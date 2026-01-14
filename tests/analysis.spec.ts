import { test, expect } from '@playwright/test';
import { mockAnalysisResult } from './mockData';

test.describe('ESG Analysis Flow', () => {
    test.beforeEach(async ({ page }) => {
        // Intercept API call to Gemini
        // Note: The app uses frontend calls to Gemini via @google/genai which usually hits Google's API.
        // However, looking at geminiService.ts, it uses the client directly.
        // If the app were calling an internal endpoint, we'd mock that.
        // Since it's a direct browser-to-API call, we can still intercept the network request.

        await page.route('**/v1beta/models/gemini-*:generateContent*', async (route) => {
            const json = {
                candidates: [
                    {
                        content: {
                            parts: [
                                {
                                    text: JSON.stringify(mockAnalysisResult)
                                }
                            ]
                        }
                    }
                ]
            };
            await route.fulfill({ json });
        });

        await page.goto('/');
    });

    test('should complete the analysis flow with a mock file', async ({ page }) => {
        // 1. Prepare a mock PDF file
        // We can use a simple Buffer for a "PDF" since the mock API will handle the result
        const mockFile = {
            name: 'test-esg-report.pdf',
            mimeType: 'application/pdf',
            buffer: Buffer.from('%PDF-1.4\n1 0 obj\n<< /Title (Test) >>\nendobj\ntrailer\n<< /Root 1 0 R >>\n%%EOF'),
        };

        // 2. Upload the file
        // The FileUpload component likely uses an <input type="file">
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.click('text=點擊或拖放 PDF 報告至此');
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles([mockFile]);

        // 3. Verify file is ready
        await expect(page.locator('text=ESG 報告已就緒')).toBeVisible();
        await expect(page.locator(`text=${mockFile.name}`)).toBeVisible();

        // 4. Start Analysis
        await page.click('text=開始分析報告');

        // 5. Verify Loading state appears
        await expect(page.locator('text=正在分析 ESG 報告')).toBeVisible();

        // 6. Verify Results appear (matched from mockData.ts)
        await expect(page.locator(`h2:has-text("${mockAnalysisResult.companyInfo.name}")`)).toBeVisible({ timeout: 10000 });
        await expect(page.locator('text=2330')).toBeVisible();
        await expect(page.locator('text=SGS Taiwan')).toBeVisible();
        await expect(page.locator('text=2030 年淨零排放')).toBeVisible();

        // 7. Verify History is updated
        const historyBtn = page.locator('button:has-text("歷史紀錄")');
        await historyBtn.click();
        await expect(page.locator(`button:has-text("${mockFile.name}")`)).toBeVisible();
    });
});
