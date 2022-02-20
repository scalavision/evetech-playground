BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD)
CONTAINER_NAME ?= evetech_playground
TMP_DIR ?= /tmp

.PHONY: help

help :
	@echo "make compile   - compile typescript [requires  typescript installed]"
	@echo "make build     - build docker image"
	@echo "make run       - builds and runs app in docker container"
	@echo "make run-nix   - builds and runs app in docker container built from nixos"
	@echo "make shell     - builds and runs container, opening a bash shell inside container for inspection"
	@echo "make run-app   - compiles and runs app on host"
	@echo "make test-app  - compiles and tests app on host"

build:
	docker build -t $(CONTAINER_NAME) -f ./docker/Dockerfile .

run: build
	docker run --name $(CONTAINER_NAME) --rm $(CONTAINER_NAME) 

build-nix:
	docker build -t $(CONTAINER_NAME)-nix -f ./nixos/Dockerfile .

run-nix: build-nix
	docker run --name $(CONTAINER_NAME)-nix --rm $(CONTAINER_NAME)-nix

shell: build
	docker run --name $(CONTAINER_NAME) --rm -i -t $(CONTAINER_NAME) bash

compile:
	tsc --lib es2017,DOM ./src/Main.ts

run-app: compile
	node ./src/Main.js

test-app: compile
	npm run test
