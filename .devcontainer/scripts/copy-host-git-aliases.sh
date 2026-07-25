#!/usr/bin/env bash
# Host（Linux / macOS / WSL）：若 ~/.git_aliases 存在且非空，複製到 .devcontainer 暫存檔。
# 一律 exit 0：缺檔、複製失敗都不得擋住 Dev Container 初始化。
set +e

SRC="${HOME}/.git_aliases"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
DEST="${SCRIPT_DIR}/../.tmp_git_aliases"

if [[ -f "${SRC}" && -s "${SRC}" ]]; then
	cp "${SRC}" "${DEST}" 2>/dev/null || true
fi

exit 0
