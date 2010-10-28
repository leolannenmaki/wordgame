#!/bin/bash
./lint.sh
./build.sh
./compile.sh
node main/server/server.js

