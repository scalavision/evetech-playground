#!/usr/bin/env bash

while true; do
  # will be triggered everytime the operating system
  # detects a file change in current working directory
  inotifywait -qq -r ./src
  tsc --lib es2017,DOM ./src/Main.ts
  npm run test
  # node ./src/Main.js
done
