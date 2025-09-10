#!/bin/bash
set -e

CHARTS_DIR="${1:-charts}"
IX_VALUES="${CHARTS_DIR}/ix_values.yaml"
QUESTIONS_YAML="${CHARTS_DIR}/questions.yaml"

echo "questions:" > "$QUESTIONS_YAML"

if command -v yq >/dev/null 2>&1; then
  # NodePort questions for any service
  yq '.. | select(has("nodePort")) | {"name": .name, "nodePort": .nodePort} | select(.name != null and .nodePort != null)' "$IX_VALUES" | \
  yq -o=json '.' | jq -c '.' | while read -r entry; do
    name=$(echo "$entry" | jq -r '.name')
    port=$(echo "$entry" | jq -r '.nodePort')
    varname=$(echo "${name}_NODEPORT" | tr '[:lower:]-' '[:upper:]_')
    cat >> "$QUESTIONS_YAML" <<EOF
  - variable: $varname
    label: "${name^} NodePort"
    description: "Set the NodePort for ${name^} service"
    schema:
      type: int
      required: true
      default: $port
      min: 30000
      max: 32767
EOF
  done

  # Dataset mount questions for any hostPath* field
  yq '.. | select(type == "object") | to_entries[] | select(.key | test("^hostPath")) | {"name": (.. | select(has("name")) | .name), "key": .key, "value": .value} | select(.name != null and .value != null)' "$IX_VALUES" | \
  yq -o=json '.' | jq -c '.' | while read -r entry; do
    name=$(echo "$entry" | jq -r '.name')
    key=$(echo "$entry" | jq -r '.key')
    value=$(echo "$entry" | jq -r '.value')
    # Variable name: SERVICENAME_KEY (e.g. MONGODB_HOSTPATHDATA)
    varname=$(echo "${name}_${key}" | tr '[:lower:]-' '[:upper:]_')
    label_name=$(echo "$name" | sed 's/-/ /g' | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')
    label_key=$(echo "$key" | sed 's/hostPath//;s/^\(.\)/ \1/')
    label="${label_name} Dataset Mount${label_key:+ (${label_key})}"
    cat >> "$QUESTIONS_YAML" <<EOF
  - variable: $varname
    label: "$label"
    description: "Set the TrueNAS dataset path to mount for ${label_name}${label_key:+ (${label_key})}."
    schema:
      type: string
      required: true
      default: "$value"
EOF
  done

else
  echo "# WARNING: yq not found, NodePort and hostPath questions not generated." >> "$QUESTIONS_YAML"
fi