import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the schema for structured JSON output
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    companyInfo: {
      type: Type.OBJECT,
      properties: {
        code: { type: Type.STRING },
        name: { type: Type.STRING },
        year: { type: Type.STRING },
      },
      required: ["code", "name", "year"],
    },
    ghgData: {
      type: Type.OBJECT,
      properties: {
        found: { type: Type.BOOLEAN },
        page: { type: Type.STRING },
        scope1And2: {
          type: Type.OBJECT,
          description: "Table for Scope 1 (Direct), Scope 2 (Energy Indirect), and Intensity.",
          properties: {
            years: { type: Type.ARRAY, items: { type: Type.STRING } },
            rows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  // Unit removed from schema
                  values: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["category", "values"],
              },
            },
          },
          required: ["years", "rows"],
        },
        scope3: {
          type: Type.OBJECT,
          description: "Table for Scope 3 (Other Indirect) detailed breakdown.",
          properties: {
            years: { type: Type.ARRAY, items: { type: Type.STRING } },
            rows: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  // Unit removed from schema
                  values: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["category", "values"],
              },
            },
          },
          required: ["years", "rows"],
        },
      },
      required: ["found", "page", "scope1And2", "scope3"],
    },
    thirdPartyAssurance: {
      type: Type.OBJECT,
      properties: {
        hasAssurance: { type: Type.BOOLEAN },
        page: { type: Type.STRING },
        provider: { type: Type.STRING },
        details: { type: Type.STRING },
      },
      required: ["hasAssurance", "page", "provider", "details"],
    },
    reductionTargets: {
      type: Type.OBJECT,
      properties: {
        hasTargets: { type: Type.BOOLEAN },
        page: { type: Type.STRING },
        targets: { type: Type.STRING },
        details: { type: Type.STRING },
      },
      required: ["hasTargets", "page", "targets", "details"],
    },
  },
  required: ["companyInfo", "ghgData", "thirdPartyAssurance", "reductionTargets"],
};

export const analyzeEsgReport = async (base64Pdf: string): Promise<AnalysisResult> => {
  try {
    const base64Data = base64Pdf.replace(/^data:application\/pdf;base64,/, "");
    const modelId = "gemini-3-flash-preview";

    const prompt = `
      你是一位專業的溫室氣體盤查稽核員。請分析這份 PDF，提取**精確**的盤查數據。
      
      **重要規則：**
      1. **不再單獨列出「單位」欄位**。請務必將單位直接包含在「項目名稱」中。
         - 例如：「範疇一排放量 (tCO2e)」、「吳江廠 - 範疇二 (tCO2e)」。
      2. 報告有什麼數據就填什麼，不要自行加總或計算。若某年份無數據填 "-"。

      **表 1: 範疇一與範疇二 (Scope 1 & 2)**
      - **提取項目**：
        1. 範疇一 (Scope 1) 總量及各廠區/分公司細項。
        2. 範疇二 (Scope 2) 總量及各廠區/分公司細項。
        3. **溫室氣體排放密集度 (Intensity)**：
           - 請務必將名稱寫得非常詳細，包含分子與分母單位。
           - **請依照以下標準格式命名 (若適用)**：
             - 「範疇一+二：溫室氣體排放密集度(公噸/千元)」
             - 「範疇一+二：溫室氣體排放密集度(公噸/百萬元)」
             - 「範疇一+二：溫室氣體排放密集度(公噸/百萬元營收)」
             - 「範疇一：溫室氣體排放密集度(公噸/噸廢棄物處理量)」
      - **廠區名稱**：若數據分廠區列出，請合併寫在名稱中（例如：台灣廠 - 範疇一 (tCO2e)）。

      **表 2: 範疇三 (Scope 3)**
      - **提取項目**：
        1. 範疇三總量。
        2. **所有範疇三的分類細項**。請注意 ISO 14064-1:2018 的分類（類別 3~6）或 GHG Protocol 的 15 項分類。
        3. **細項與廠區**：若細項有區分廠區，請展開。
           - 例如：「吳江廠 - 資本財 (tCO2e)」或「類別4:資本財 - 吳江廠 (tCO2e)」。
      
      **通用提取規則：**
      - **年份**：找出表格標頭的年份 (e.g., 2024, 2023, 2022)，最新年份排前面。
      - **數值**：請直接提取字串，包含小數點。
      - **頁碼**：請列出所有參考數據的頁碼。

      請以繁體中文回答 JSON。
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64Data,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini.");

    const result = JSON.parse(text) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Error analyzing PDF:", error);
    throw error;
  }
};