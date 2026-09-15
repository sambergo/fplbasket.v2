#!/bin/sh
set -eu
cd "$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
./just-build.sh
git add .
git commit -m "build"
git push
