#!/bin/bash
echo "build at `date`"
. ~/.nvm/nvm.sh
nvm use 0.10.36
cd ~/xuanwo
git pull
hexo clean
hexo d -g
echo "built successfully"