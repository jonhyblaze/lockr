CORE_FEEDBACK = ../core/feedback.json
EMBED_FEEDBACK = internal/password/feedback.json
PKG = ./cmd/lockr

# Copy the canonical feedback strings from @lockr/core into this package so
# go:embed can reach them (embed patterns can't escape the module dir).
.PHONY: sync
sync:
	cp $(CORE_FEEDBACK) $(EMBED_FEEDBACK)

# Build a standalone `lockr` binary for the host platform.
.PHONY: build
build: sync
	go build -o bin/lockr $(PKG)

# Install `lockr` into $GOBIN (or $GOPATH/bin).
.PHONY: install
install: sync
	go install $(PKG)

.PHONY: test
test: sync
	go test ./...

.PHONY: clean
clean:
	rm -rf bin dist $(EMBED_FEEDBACK)
