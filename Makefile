.PHONY: server
server:
	hugo server --minify --disableFastRender -F --ignoreCache -w

.PHONY: build
build: setup
	hugo --minify
