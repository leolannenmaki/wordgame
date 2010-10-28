#!/bin/bash
# Uses JSBuild
# Installation instructions at: http://github.com/azer/jsbuild
/Library/Frameworks/Python.framework/Versions/3.1/bin/jsbuild manifest.json
cp main/client/client.html build/client.html
