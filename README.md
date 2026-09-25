# 🌱 EcoScan AI — ESG Report Analyzer

> Upload an ESG report (PDF) and get instant AI-powered analysis — key greenhouse gas (GHG) figures, assurance status, and reduction targets, extracted in seconds instead of hours.
>
> 上傳 ESG 報告書（PDF），AI 即時解析：溫室氣體關鍵數據、確信狀況、減量目標，幾秒鐘搞定，不用再逐頁翻上百頁的 PDF。

---

## ✨ Features

- 📄 **PDF Report Analysis** — Upload ESG reports right in the browser, no preprocessing needed
- 🏭 **GHG Data Extraction** — Automatically pull out key greenhouse gas emissions figures
- ✅ **Assurance Status** — See at a glance whether the data carries third-party assurance
- 🎯 **Reduction Targets** — Extract stated emissions-reduction targets and timelines
- ⚡ **Structured Insights** — Clear summaries and key points instead of skimming full reports
- 🧪 **End-to-End Tested** — Playwright test coverage for upload and analysis flows

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/kenyeh727/exoai.git
   cd exoai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and add your API key:
   ```env
   VITE_AI_API_KEY=your_key_here
   # Optional: override the default model
   VITE_MODEL_ID=your_model_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

5. **Run tests**
   ```bash
   npx playwright test
   ```

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **AI**: AI API integration for document analysis and data extraction
- **Testing**: Playwright
- **Deployment**: GitHub Pages via GitHub Actions

## 📁 Project Structure

```
exoai/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── components/                 # React components
├── services/                   # API and analysis services
├── tests/                      # Playwright end-to-end tests
├── App.tsx                     # Main application component
├── index.tsx                   # Application entry point
├── types.ts                    # TypeScript type definitions
├── vite.config.ts              # Vite configuration
└── package.json                # Project dependencies
```

## 🌐 Deployment

This project auto-deploys to **GitHub Pages** via GitHub Actions on every push to `main`:

1. Go to repository **Settings** → **Pages**
2. Under **Build and deployment**, select **GitHub Actions** as the source
3. Push to `main` — the workflow installs dependencies, runs linting, builds, and deploys `dist/`

---

## 中文說明

### 🌱 EcoScan AI — ESG 報告書分析工具

EcoScan AI 讓你直接在瀏覽器上傳 ESG 報告書（PDF），AI 自動擷取關鍵資訊：溫室氣體（GHG）排放數據、是否經過第三方確信、減量目標與時程，幾秒鐘產出結構化摘要。

**功能特色**

- 📄 **PDF 報告書解析** — 瀏覽器直接上傳，不需前處理
- 🏭 **溫室氣體數據擷取** — 自動抓出關鍵排放數字
- ✅ **確信狀況** — 一眼看出數據有無第三方確信
- 🎯 **減量目標** — 擷取減排目標與達成時程
- ⚡ **結構化洞察** — 清晰摘要，不用逐頁翻報告
- 🧪 **端到端測試** — Playwright 覆蓋上傳與分析流程

**快速開始**：需求 Node.js v18 以上，`npm install` → 在 `.env` 設定 API key → `npm run dev`，打開 http://localhost:3000 即可使用。測試跑 `npx playwright test`。
