
##
## Copyright (c) 2020 - ARC.LV. All rights reserved.
##

all: build

build: install
	npm run build

install: node_modules

node_modules: package.json
	npm install

start:
	npm run start

clean:
	-@rm -rf ./dist

docker-build:

docker-test:

docker-start:

docker-stop:

docker-clean:

.PHONY: all build install test start clean \
	docker-build docker-test docker-start docker-stop docker-clean

.SILENT: clean
