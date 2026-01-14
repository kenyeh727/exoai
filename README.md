# EcoScan AI - ESG Report Analyzer

EcoScan AI is a React-based application designed to analyze ESG (Environmental, Social, and Governance) reports using Google's Gemini API.

## Project Architecture

- **Frontend Framework**: React 19 + Vite
- **Language**: TypeScript
- **Styling**: CSS Modules / Standard CSS
- **AI Integration**: Google GenAI SDK
- **Testing**: Playwright
- **Deployment**: GitHub Pages via GitHub Actions

## Local Development

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd exoai
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory and add your Gemini API key:
    ```
    GEMINI_API_KEY=your_api_key_here
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

5.  **Run Tests:**
    ```bash
    npm run test  # or appropriate test script
    # For Playwright
    npx playwright test
    ```

## Deployment

This project is configured to automatically deploy to **GitHub Pages** using GitHub Actions.

### Prerequisite
1.  Go to your repository **Settings**.
2.  Navigate to **Pages** (under Code and automation).
3.  Under **Build and deployment**, select **GitHub Actions** as the source.

### Workflow
The deployment workflow is defined in `.github/workflows/deploy.yml`. It performs the following steps on every push to `main`:
1.  Installs dependencies.
2.  Runs linting checks (`npm run lint`).
3.  Builds the project (`npm run build`).
4.  Deploys the `dist` folder to GitHub Pages.
