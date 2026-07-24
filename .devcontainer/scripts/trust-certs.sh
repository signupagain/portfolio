#!/usr/bin/env bash
# 將專案 certs/rootCA.pem 安裝進容器系統信任庫，供 Node --use-system-ca / curl / openssl 使用。
# 防呆：缺檔只警告不中斷；檔案存在但無效則失敗；空檔不安裝。
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
CERTS_DIR="${REPO_ROOT}/certs"
CA_SRC="${CERTS_DIR}/rootCA.pem"
CA_DEST_NAME="portfolio-mkcert-rootCA.crt"
CA_DEST="/usr/local/share/ca-certificates/${CA_DEST_NAME}"

REQUIRED_PEMS=(localhost.pem localhost-key.pem rootCA.pem)

log() { printf '%s\n' "$*"; }
warn() { printf 'WARN: %s\n' "$*" >&2; }
err() { printf 'ERROR: %s\n' "$*" >&2; }

missing=0
for name in "${REQUIRED_PEMS[@]}"; do
	path="${CERTS_DIR}/${name}"
	if [[ ! -f "${path}" ]]; then
		warn "缺少 certs/${name}"
		missing=1
		continue
	fi
	if [[ ! -s "${path}" ]]; then
		err "certs/${name} 存在但是空檔"
		exit 1
	fi
done

if [[ "${missing}" -eq 1 ]]; then
	warn "certs/ 不完整。請依 certs/README.md 產生或複製 *.pem 後 Rebuild / 重開容器。"
	warn "影響：Nuxt 可能退回 HTTP；容器內 Node 無法信任 mkcert；Prometheus 掛載可能失敗。"
	# 缺檔不使 postCreate 整段失敗，方便先開容器再補憑證
	exit 0
fi

if ! command -v openssl >/dev/null 2>&1; then
	err "找不到 openssl，無法驗證 rootCA.pem"
	exit 1
fi

if ! openssl x509 -in "${CA_SRC}" -noout >/dev/null 2>&1; then
	err "certs/rootCA.pem 不是有效的 X.509 憑證"
	exit 1
fi

if [[ ! -f "${CA_DEST}" ]] || ! cmp -s "${CA_SRC}" "${CA_DEST}"; then
	if ! command -v sudo >/dev/null 2>&1; then
		err "需要 sudo 才能安裝系統 CA（${CA_DEST}）"
		exit 1
	fi
	sudo cp "${CA_SRC}" "${CA_DEST}"
	sudo update-ca-certificates >/dev/null
	log "已安裝 mkcert rootCA 至系統信任庫（${CA_DEST}）"
else
	log "系統信任庫已含最新 mkcert rootCA，略過安裝"
fi

log "提示：瀏覽器信任需先在本機執行 mkcert -install（與容器信任庫無關）。"
