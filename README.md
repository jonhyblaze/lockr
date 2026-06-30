# 🔒 lockr

Generate strong passwords entirely offline — as a web app (PWA), a Go CLI, or a Node CLI. No password ever leaves your machine.

All three share the same generation + strength-analysis logic, organized as a monorepo.

- **Web** — an installable, offline-capable PWA (Preact + Redux + Tailwind).
- **`lockr`** — a single static Go binary. Generates a password, copies it to your clipboard, prints a strength estimate.
- **`lockr-js`** — the same CLI built with Ink (React in the terminal).

---

## Quick start

### Web

Live: **https://lockr.netlify.app** _(update once your Netlify site is connected)_

```bash
npm install
npm run dev        # http://localhost:5173
```

### CLI — `lockr` (Go)

**One-line install (prebuilt binary, macOS/Linux, no Go required):**

```bash
curl -fsSL https://raw.githubusercontent.com/jonhyblaze/lockr/main/install.sh | sh
```

or with wget:

```bash
wget -qO- https://raw.githubusercontent.com/jonhyblaze/lockr/main/install.sh | sh
```

**With the Go toolchain:**

```bash
go install github.com/jonhyblaze/lockr/packages/cli-go/cmd/lockr@latest
```

**Or download a binary** directly from the [latest release](https://github.com/jonhyblaze/lockr/releases/latest).

#### Usage

```bash
lockr           # 16-char password (default), copied to clipboard
lockr 32        # 32 characters
lockr -l 8      # 8 characters (--length also works)
```

Output is colorized in a terminal and plain when piped (or with `NO_COLOR=1`):

```
8xzX@MoCE5@QpnYwR5%i
paranoid · takes forever to crack
✔ copied to clipboard
```

### CLI — `lockr-js` (Node/Ink)

Requires Node.js 20+.

```bash
cd packages/cli
npm install        # from repo root: npm install
npm run build      # bundle to dist/cli.js
npm link           # exposes the `lockr-js` command globally
lockr-js 24
```

---

## Repository layout

```
packages/
  core/      Shared password logic (generator + strength analyzer) — TypeScript
  web/       PWA frontend (Preact, Redux Toolkit, Tailwind, vite-plugin-pwa)
  cli/       Node CLI built with Ink   → binary: lockr-js
  cli-go/    Go CLI                     → binary: lockr
go.mod       Root Go module: github.com/jonhyblaze/lockr
netlify.toml Netlify build config for the web app
install.sh   curl|sh installer for the Go binary
```

### Shared logic, two languages

`packages/core` is the single source of truth for the TypeScript world — both the web app and `lockr-js` import `@lockr/core` directly (consumed as source, no build step).

The Go CLI is a **hand-port** of the same algorithm (Go can't import TypeScript). To stop the two from drifting:

- The human-readable strings (`feedback.json`) are **shared data**: `packages/core/feedback.json` is the canonical copy, and the Go build copies it in so `go:embed` can bundle it.
- A **parity test** (`packages/cli-go/internal/password/analyzer_test.go`) pins the Go analyzer's output to golden values captured from the TypeScript implementation. If either side changes, CI fails.

---

## Development

This is an npm-workspaces monorepo plus one Go module.

```bash
npm install                # install all JS workspace deps + link @lockr/core

# Web
npm run dev                # vite dev server
npm run build              # production build -> packages/web/dist
npm run typecheck          # tsc for the web app

# Node CLI (lockr-js)
npm run cli                # run the Ink CLI in dev (tsx)

# Go CLI (lockr)
cd packages/cli-go
make sync                  # refresh feedback.json from core (run after editing it)
make build                 # ./bin/lockr
make install               # install `lockr` to $GOBIN (~/go/bin)
make test                  # go vet + parity tests
```

> **Editing the feedback strings?** Change `packages/core/feedback.json` only. The web app and `lockr-js` pick it up automatically; for the Go CLI run `make sync` (or just `make build`, which syncs first). CI does the same.

### Linux clipboard note

The Go binary is fully portable, but copying to the clipboard shells out to a platform tool:

| OS      | Tool(s) used                            |
| ------- | --------------------------------------- |
| macOS   | `pbcopy` (built in)                     |
| Windows | `clip` (built in)                       |
| Linux   | `wl-copy`, `xclip`, or `xsel` (install one) |

On a headless or freshly-installed Linux box you may need `apt install xclip` (X11) or `wl-clipboard` (Wayland). If none is present, `lockr` still prints the password — it just can't copy it.

---

## Deployment

### Web → Netlify

`netlify.toml` is already configured (build command, publish dir, SPA redirect). To deploy:

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import from Git**, pick the repo.
3. Netlify reads `netlify.toml` — no manual settings needed. Build: `npm run build --workspace @lockr/web`, publish: `packages/web/dist`.

### CLI → GitHub Releases

Pushing a `vX.Y.Z` tag triggers `.github/workflows/release.yml`, which cross-compiles `lockr` for macOS/Linux/Windows (amd64 + arm64) and attaches the binaries to a GitHub Release. The same tag is what `go install ...@latest` resolves to.

```bash
git tag v0.1.0
git push origin v0.1.0
```

---

## How strength is estimated

The analyzer combines three signals into a 0–9 score:

- **search-space entropy** — `length × log2(alphabet size)`, rewarding length and character variety;
- **character variety** — the ratio of unique characters, penalizing padding with repeats;
- **predictability** — a penalty for ascending/descending/repeated runs (`abc`, `321`, `aaaa`).

The score maps to a one-word verdict and a rough "time to crack" estimate. It's a heuristic for quick feedback, not a cryptographic guarantee.
