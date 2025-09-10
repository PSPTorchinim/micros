#!/bin/bash
set -e

VERSION="$1"

git config user.name "github-actions[bot]"
git config user.email "github-actions[bot]@users.noreply.github.com"
git pull
git add "charts/Chart.yaml"
git commit -m "bump chart version to $VERSION" || echo "No changes to commit"
git push origin "HEAD:${GITHUB_REF#refs/heads/}"