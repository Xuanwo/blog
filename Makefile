.PHONY: build
server:
	hugo server --minify --disableFastRender -F --ignoreCache -w

.PHONY: run
build:
	hugo --minify
