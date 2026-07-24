# 面試作品集

![Static Badge](https://img.shields.io/badge/core-nuxt-%2300DC82) ![Static Badge](https://img.shields.io/badge/style-tailwindcss-%2306B6D4) ![Static Badge](https://img.shields.io/badge/schema-zod-%23408AFF) ![Static Badge](https://img.shields.io/badge/query-vue--query-%234FC08D)

這個專案介紹了我個人的經歷，還有對於前端架構的整體想法，以及部份實作。

## 專案內容

內容可以簡單分為兩類，**自我介紹**和**專案實作**。以檔案結構去看的話，主要是用layers去進行分類，可分為頂層(自我介紹)和數個子層(實作)

目前已有的特色項目:

- [自我介紹](https://intro-project.netlify.app/)
- [影像的詩學(圖片陳列)](https://intro-project.netlify.app/gallery)
- [主題色切換](https://github.com/signupagain/projects/tree/master/layers/colorModeBtn/app/components): 該項目為可複用按鍵，且能判斷是否使用外掛的"深夜模式"擴充軟件
- [檔案瀏覽器](https://intro-project.netlify.app/file-browser)

## 環境建置

### 前置需求

- [Node.js](https://nodejs.org/)（建議與 Dev Container 映像相近的 LTS）與 [pnpm](https://pnpm.io/)（本專案以 `packageManager` 鎖定版本；可用 Corepack：`corepack enable`）
- 本機 HTTPS（建議）：[mkcert](https://github.com/FiloSottile/mkcert)，並執行一次 `mkcert -install`
- 可選：Docker + Dev Containers（Cursor / VS Code）

### 1. 安裝依賴

本機開發：

```bash
pnpm install
```

使用 Dev Container：以「Reopen in Container」開啟即可；`postCreateCommand` 會啟用 Corepack、安裝 pnpm 並執行 `pnpm install`。

### 2. 本機 HTTPS 憑證（`certs/`）

`*.pem` **不進 Git**。Clone 後請依 [certs/README.md](./certs/README.md) 準備下列檔案，否則開發伺服器可能退回 HTTP，且 Dev Container 的 Prometheus 掛載可能失敗：

| 檔名                | 用途                               |
| ------------------- | ---------------------------------- |
| `localhost.pem`     | 伺服器憑證                         |
| `localhost-key.pem` | 伺服器私鑰                         |
| `rootCA.pem`        | mkcert 根憑證（Prometheus 驗證用） |

摘要（細節與家目錄複製方式見該 README）：

```powershell
# Windows (PowerShell)，於專案根目錄
New-Item -ItemType Directory -Force certs | Out-Null
Set-Location certs
mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 ::1
Copy-Item "$(mkcert -CAROOT)\rootCA.pem" .\rootCA.pem
```

```bash
# macOS / Linux，於專案根目錄
mkdir -p certs && cd certs
mkcert -cert-file localhost.pem -key-file localhost-key.pem localhost 127.0.0.1 ::1
cp "$(mkcert -CAROOT)/rootCA.pem" ./rootCA.pem
```

使用 Dev Container 時：請**先**備妥 `certs/*.pem`，再 Rebuild / 開啟 Container。`app` 容器會自動把 `rootCA.pem` 裝進系統信任庫（並設 `NODE_EXTRA_CA_CERTS`）；細節見 [certs/README.md](./certs/README.md#dev-container)。Windows 瀏覽器仍需本機 `mkcert -install`。

### 3. 啟動開發伺服器

```bash
pnpm dev
```

預設於 `https://localhost:3000`（有憑證時）或 `http://localhost:3000`（無憑證時）。

### 4. Dev Container 相關服務（可選）

Compose 另起 Grafana / Prometheus，方便觀察 `@artmizu/nuxt-prometheus` 指標：

| 服務       | 位址                                                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------------------------------- |
| Nuxt       | `https://localhost:3000`（compose `ports` 發佈）                                                                       |
| Grafana    | `http://localhost:3030`（compose `ports` 發佈；帳密見根目錄 `.env` 的 `GF_SECURITY_ADMIN_PASSWORD`，範本預設 `admin`） |
| Prometheus | 僅 compose 內網（Grafana 已自動接 `http://prometheus:9090`），不對外轉發                                               |

環境變數範本見 [`.env.example`](./.env.example)（含 `PEXELS_*`、`GF_SECURITY_ADMIN_PASSWORD`）。Grafana 服務以 `env_file` 讀專案根目錄 `.env`。

憑證由專案 `certs/` 掛入 Prometheus；設定見 `.devcontainer/prometheus.yml`。Grafana datasource provisioning 見 `.devcontainer/grafana/provisioning/`。
