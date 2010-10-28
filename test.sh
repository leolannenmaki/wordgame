#!/bin/bash
# Uses Vows
# Installation instructions at: http://vowsjs.org/#installing
vows test/common/*.js test/server/*.js
./build.sh
open test/client/qunit.html

