package password

import (
	"os/exec"
	"runtime"
)

// clipboardTool is an external command capable of reading text from stdin and
// placing it on the system clipboard.
type clipboardTool struct {
	name string
	args []string
}

// clipboardTools returns the candidate clipboard commands for the current OS,
// in priority order. On Linux several may be installed (or none) depending on
// the display server, so we try each until one works.
func clipboardTools() []clipboardTool {
	switch runtime.GOOS {
	case "darwin":
		return []clipboardTool{{name: "pbcopy"}}
	case "windows":
		return []clipboardTool{{name: "clip"}}
	default: // linux, *bsd, etc.
		return []clipboardTool{
			{name: "wl-copy"}, // Wayland
			{name: "xclip", args: []string{"-selection", "clipboard"}}, // X11
			{name: "xsel", args: []string{"--clipboard", "--input"}},   // X11
		}
	}
}

// CopyToClipboard copies text to the system clipboard, picking the right tool
// for the current OS (pbcopy on macOS, clip on Windows, wl-copy/xclip/xsel on
// Linux). Returns true on success; fails soft (returns false) when no suitable
// tool is available, so the caller can still print the password.
func CopyToClipboard(text string) bool {
	for _, tool := range clipboardTools() {
		if _, err := exec.LookPath(tool.name); err != nil {
			continue
		}
		if writeToTool(tool, text) {
			return true
		}
	}
	return false
}

func writeToTool(tool clipboardTool, text string) bool {
	cmd := exec.Command(tool.name, tool.args...)

	stdin, err := cmd.StdinPipe()
	if err != nil {
		return false
	}

	if err := cmd.Start(); err != nil {
		return false
	}

	if _, err := stdin.Write([]byte(text)); err != nil {
		stdin.Close()
		return false
	}
	stdin.Close()

	return cmd.Wait() == nil
}
