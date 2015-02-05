echo "build at `date`"
. ~/.nvm/nvm.sh
nvm use 0.10.36
git pull
hexo clean
hexo d -g
echo "built successfully"