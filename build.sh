#!/bin/bash
/Library/Frameworks/Python.framework/Versions/3.1/bin/jsbuild manifest.json
cp main/client/client.html build/client.html
cp main/client/jquery.js build/jquery.js
