DIST = dist

help:
	@more Makefile

.PHONY: help clean

build-development:
build-production:

build-%:
	npx webpack --mode='$*'
	@npx cpx './public/**/*' $(DIST)

clean:
	rm -r $(DIST)
