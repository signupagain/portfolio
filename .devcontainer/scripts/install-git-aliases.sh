#!/usr/bin/env bash
# 將 Host 經 initializeCommand 暫存的 .git_aliases 安裝進 Container shell。
# 邊界：暫存檔不存在／為空 → 略過；已 source 過 → 不重複寫入 bashrc。
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
TMP_ALIASES="${REPO_ROOT}/.devcontainer/.tmp_git_aliases"
TARGET="${HOME}/.git_aliases"
BASHRC="${HOME}/.bashrc"
SOURCE_LINE='[ -f ~/.git_aliases ] && . ~/.git_aliases'

if [[ ! -f "${TMP_ALIASES}" ]]; then
	exit 0
fi

if [[ ! -s "${TMP_ALIASES}" ]]; then
	rm -f "${TMP_ALIASES}"
	exit 0
fi

cp "${TMP_ALIASES}" "${TARGET}"
rm -f "${TMP_ALIASES}"

touch "${BASHRC}"
if ! grep -qF "${SOURCE_LINE}" "${BASHRC}"; then
	{
		echo ''
		echo '# Git aliases synced from host via Dev Container'
		echo "${SOURCE_LINE}"
	} >>"${BASHRC}"
fi
