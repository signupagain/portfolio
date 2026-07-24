# 本機 HTTPS 憑證（certs）

此目錄的 `*.pem` **不會**進入 Git。Clone 後請自行產生或複製憑證，開發伺服器與 Prometheus 才會走 HTTPS。

## 需要的檔案

| 檔名                | 用途                                |
| ------------------- | ----------------------------------- |
| `localhost.pem`     | 伺服器憑證（Nuxt / Prometheus）     |
| `localhost-key.pem` | 伺服器私鑰                          |
| `rootCA.pem`        | mkcert 根憑證（供 Prometheus 驗證） |

缺檔時：Nuxt 會退回 HTTP；Dev Container 的 Prometheus 掛載可能失敗。

## 方式一：用 mkcert 在此目錄產生（建議）

1. 安裝 [mkcert](https://github.com/FiloSottile/mkcert)，並在本機執行一次 `mkcert -install`（讓瀏覽器信任）。
2. 在**專案根目錄**執行：

```bash
# macOS / Linux
mkdir -p certs && cd certs
mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 ::1
cp "$(mkcert -CAROOT)/rootCA.pem" ./rootCA.pem
```

```powershell
# Windows (PowerShell)
New-Item -ItemType Directory -Force certs | Out-Null
Set-Location certs
mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 ::1
Copy-Item "$(mkcert -CAROOT)\rootCA.pem" .\rootCA.pem
```

## 方式二：從使用者家目錄複製

若你已在 `%USERPROFILE%\certs`（Windows）或 `$HOME/certs`（macOS / Linux）放好同名檔案：

```powershell
# Windows
Copy-Item "$env:USERPROFILE\certs\*" .\certs\ -Force
```

```bash
# macOS / Linux
cp -f "$HOME/certs/"*.pem ./certs/
```

請確認複製後具備上方三個檔名。

## Dev Container

專案 `certs/` 會隨 workspace 進入 `app` 容器；Prometheus 由此目錄掛載憑證。請先備妥 `*.pem` 再 Rebuild / 開啟 Container。

### 容器如何信任 mkcert

`app` 容器會在 **postCreate / postStart** 執行 `.devcontainer/scripts/trust-certs.sh`：

1. 檢查 `localhost.pem`、`localhost-key.pem`、`rootCA.pem` 是否存在且非空。
2. 以 `openssl` 驗證 `rootCA.pem`；無效則失敗（防呆）。
3. 將 `rootCA.pem` 安裝到系統信任庫（`update-ca-certificates`），讓 `NODE_OPTIONS=--use-system-ca`、curl 等生效。
4. `devcontainer.json` 另設 `NODE_EXTRA_CA_CERTS` 指向 `certs/rootCA.pem`（雙保險）。

缺檔時腳本只警告、不阻斷開容器；補齊憑證後重開／Rebuild 即可。  
**本機瀏覽器**仍須在主機執行過 `mkcert -install`（與容器信任庫無關）。
