.PHONY: build
server:
	hugo server --minify --disableFastRender -F --ignoreCache

.PHONY: run
build:
	hugo --minify
