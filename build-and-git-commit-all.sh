#!/bin/sh
sh ./just-build.sh
git add .
git commit -m "build"
git push
