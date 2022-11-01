#!/bin/sh
rm -rf ./server/dist/
cd ./server/
tsc
echo "tsc done"
cp .env ./dist/
cd ..
pwd
cd ./web/
yarn build
cd ..
pwd
mv ./web/build ./server/
git add .
git commit -m "build"
git push
