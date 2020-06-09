#!/bin/bash

set -e

mkdir /root/.ssh
ssh-keyscan -t rsa github.com > /root/.ssh/known_hosts && \
echo "${GIT_DEPLOY_KEY}" > /root/.ssh/id_rsa && \
chmod 400 /root/.ssh/id_rsa

export REMOTE_REPO="git@github.com:${GITHUB_REPOSITORY}.git"
export REMOTE_BRANCH="${GIT_BRANCH}"

git config --global user.name "${GITHUB_ACTOR}"
git config --global user.email "${GITHUB_ACTOR}@users.noreply.github.com"

mkdir -p public

pushd public \
&& git init \
&& git remote add deploy $REMOTE_REPO \
&& git fetch deploy \
&& git checkout $REMOTE_BRANCH \
&& rm ./* -r \
&& popd

npm install
HUGO_ENV=production hugo --minify

pushd public \
&& git add . \
&& git commit -m "Automated deployment to GitHub Pages on $(date +%s%3N)" \
&& git push deploy $REMOTE_BRANCH --force \
&& popd

rm /root/.ssh -r
