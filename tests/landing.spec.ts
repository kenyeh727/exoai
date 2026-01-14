import { test, expect } from '@playwright/test';

test.describe('Landing Page UI', () => {
    test.beforeEach(async ({ page }) => {
        // We assume the server is running on localhost:5173
        await page.goto('/');
    });

    test('should display the main title', async ({ page }) => {
        const title = page.locator('h1');
        await expect(title).toContainText('EcoScan AI');
    });

    test('should display hero section with description', async ({ page }) => {
        const heroTitle = page.locator('h2');
        await expect(heroTitle).toContainText('ESG 永續報告智能分析');

        const description = page.locator('p');
        await expect(description.first()).toContainText('上傳 PDF 永續報告書');
    });

    test('should have a file upload area', async ({ page }) => {
        // Looking for the text or upload icon in FileUpload component
        const uploadText = page.locator('text=點擊或拖放 PDF 報告至此');
        await expect(uploadText).toBeVisible();
    });

    test('should show history button and handle empty state', async ({ page }) => {
        const historyBtn = page.locator('button:has-text("歷史紀錄")');
        await expect(historyBtn).toBeVisible();

        await historyBtn.click();
        const emptyHistoryText = page.locator('text=暫無紀錄');
        await expect(emptyHistoryText).toBeVisible();
    });
});
