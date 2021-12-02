#!/bin/sh
rm -rf ./server/dist/
cd ./server/
tsc
echo "tsc done"
pwd
cd ..
pwd
cd ./web/ 
yarn build
cd ..


