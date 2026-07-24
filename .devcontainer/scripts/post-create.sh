#!/usr/bin/env bash
# Dev Container postCreate：信任 mkcert CA、權限、依賴、graphify。
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${REPO_ROOT}"

bash "${SCRIPT_DIR}/trust-certs.sh"

sudo chown -R node:node .

pnpm install

if [[ -f graphify-out/graph.json ]]; then
	graphify update .
fi
