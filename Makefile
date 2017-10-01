TEST=$(shell ls -S `find ./test -type f -name "*.test.js" -print`)

install:
	@tnpm install .

test:
	@./node_modules/.bin/mocha --recursive -t 200000 $(TEST)

.PHONY: test