#!/bin/sh
# Installer for the lockr CLI.
#
#   curl -fsSL https://raw.githubusercontent.com/jonhyblaze/lockr/main/install.sh | sh
#
# Downloads the right prebuilt binary for your OS/arch from the latest GitHub
# release and installs it to /usr/local/bin (falling back to ~/.local/bin).
# Override the destination with LOCKR_INSTALL_DIR=/some/dir.
set -eu

REPO="jonhyblaze/lockr"
BIN="lockr"

os="$(uname -s | tr '[:upper:]' '[:lower:]')"
arch="$(uname -m)"

case "$arch" in
  x86_64 | amd64) arch="amd64" ;;
  arm64 | aarch64) arch="arm64" ;;
  *) echo "lockr: unsupported architecture: $arch" >&2; exit 1 ;;
esac

case "$os" in
  darwin | linux) ;;
  *) echo "lockr: unsupported OS: $os (try 'go install' instead)" >&2; exit 1 ;;
esac

asset="lockr_${os}_${arch}"
url="https://github.com/${REPO}/releases/latest/download/${asset}"

dir="${LOCKR_INSTALL_DIR:-/usr/local/bin}"
if ! mkdir -p "$dir" 2>/dev/null || [ ! -w "$dir" ]; then
  dir="$HOME/.local/bin"
  mkdir -p "$dir"
fi

tmp="$(mktemp)"
echo "Downloading $asset ..."
if command -v curl >/dev/null 2>&1; then
  curl -fsSL "$url" -o "$tmp"
elif command -v wget >/dev/null 2>&1; then
  wget -qO "$tmp" "$url"
else
  echo "lockr: need curl or wget to download" >&2; exit 1
fi

chmod +x "$tmp"
mv "$tmp" "$dir/$BIN"
echo "Installed $BIN -> $dir/$BIN"

case ":$PATH:" in
  *":$dir:"*) ;;
  *) echo "Note: $dir is not on your PATH. Add it with:"; echo "  export PATH=\"$dir:\$PATH\"" ;;
esac
