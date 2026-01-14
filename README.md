<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1S8A-AmXXLehsxhdT3v4s-UIaRPi8h2nY

## 部署說明 (Deployment)

本專案透過 GitHub Actions 自動部署至 GitHub Pages。

**線上網址：** [https://kenyeh727.github.io/exoai/](https://kenyeh727.github.io/exoai/)

### 自動部署流程
1. 推送 (Push) 程式碼至 `main` 分支。
2. GitHub Actions 會自動執行測試、建構並部署至 `gh-pages` 分支。
3. 部署完成後，約 1-2 分鐘即可在上述網址查看更新。

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
