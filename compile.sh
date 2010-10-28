#!/bin/bash
# Uses Google Closure Compiler
# Installation instructions at: http://code.google.com/closure/compiler/docs/gettingstarted_app.html
java -jar tools/compiler.jar --js build/wordgame-latest.js --js_output_file build/wordgame-latest-min.js

