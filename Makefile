.PHONY: build
server:
	hugo server --minify --disableFastRender -F --ignoreCache -w -v

.PHONY: run
build:
	hugo --minify
