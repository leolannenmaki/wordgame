#!/bin/bash
# Uses Google Closure Linter
# Installation instructions at: http://code.google.com/closure/utilities/docs/linter_howto.html
gjslint -r main/client
echo "Running lint on server files"
gjslint -r main/server
echo "Running lint on common files"
gjslint -r main/common

