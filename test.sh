#!/bin/bash
vows test/common/*.js test/server/*.js
./build.sh
open test/client/qunit.html

