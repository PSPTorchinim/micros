#!/bin/bash
set -e

CHART_FILE="${1:-charts/Chart.yaml}"
BRANCH="${2:-develop}"

current_version=$(yq '.version' "$CHART_FILE")
sha=$(git rev-parse --short HEAD)

python3 <<EOF > bumpver.txt
import semver
cv = semver.VersionInfo.parse("$current_version")
if "$BRANCH" == "production":
    nv = cv.bump_major()
elif "$BRANCH".startswith("releases/"):
    nv = cv.bump_minor()
else:
    nv = cv.bump_patch()
print(str(nv))
EOF

new_version=$(cat bumpver.txt)
if [ "$BRANCH" != "production" ]; then
  new_version="${new_version}-${sha}"
fi
yq -i ".version = \"$new_version\"" "$CHART_FILE"
echo "$new_version"