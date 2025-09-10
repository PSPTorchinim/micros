#!/bin/bash
set -e

# Only copy if base_v2_1_49 does not exist
if [ ! -d library/base_v2_1_49 ] && [ -d library/2.1.49 ]; then
  cp -r library/2.1.49 library/base_v2_1_49
fi

CHARTS_DIR="${1:-charts}"
TRAIN="${2:-stable}"

cat > "${CHARTS_DIR}/app.yaml" <<EOF
annotations:
  min_scale_version: 24.10.2.2
app_version: "1.0.0"
capabilities:
  - description: DJPanel is able to change file ownership arbitrarily
    name: CHOWN
  - description: DJPanel is able to bypass file permission checks
    name: DAC_OVERRIDE
  - description: DJPanel is able to bypass permission checks for file operations
    name: FOWNER
  - description: DJPanel is able to bind to privileged ports (< 1024)
    name: NET_BIND_SERVICE
  - description: DJPanel is able to change group ID of processes
    name: SETGID
  - description: DJPanel is able to change user ID of processes
    name: SETUID
categories:
  - music
  - management
changelog_url: https://github.com/psptorchinim/micros/releases
date_added: '2024-09-12'
description: DJPanel is a modern DJ management panel and microservices stack.
home: https://github.com/psptorchinim/micros
host_mounts: []
icon: https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png
keywords:
  - dj
  - panel
  - music
lib_version: 2.1.49
lib_version_hash: e71e6b0122c9446fa5ea6fb07e7eb01b11fb42d549a19845426bbd7e21a42634
maintainers:
  - name: psptorchinim
    email: djpanel@example.com
    url: https://github.com/psptorchinim
name: djpanel
run_as_context:
  - description: DJPanel runs as root user.
    gid: 0
    group_name: root
    uid: 0
    user_name: root
screenshots:
  - https://upload.wikimedia.org/wikipedia/commons/7/70/Example.png
sources:
  - https://github.com/psptorchinim/micros
title: DJPanel
train: ${TRAIN}
version: 1.0.0
EOF