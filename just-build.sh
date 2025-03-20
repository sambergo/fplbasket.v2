#!/bin/sh
rm -rf ./server/dist/
cd ./server/ || exit
tsc
echo "tsc done"
cp .env ./dist/
cd ..
pwd
rm -rf ./server/build/
cd ./web/ || exit
pnpm run build
cd ..
pwd
mv ./web/dist ./server/build
