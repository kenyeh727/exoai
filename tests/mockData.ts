export const mockAnalysisResult = {
    companyInfo: {
        name: "測試科技股份有限公司",
        code: "2330",
        year: "2024"
    },
    ghgData: {
        found: true,
        page: "45, 46",
        scope1And2: {
            years: ["2024", "2023"],
            rows: [
                { category: "範疇一 (tCO2e)", values: ["1000", "1100"] },
                { category: "範疇二 (tCO2e)", values: ["5000", "5200"] }
            ]
        },
        scope3: {
            years: ["2024"],
            rows: [
                { category: "類別 3: 運輸 (tCO2e)", values: ["200"] }
            ]
        }
    },
    thirdPartyAssurance: {
        hasAssurance: true,
        page: "98",
        provider: "SGS Taiwan",
        details: "對 2024 年度數據進行有限確信。"
    },
    reductionTargets: {
        hasTargets: true,
        page: "10",
        targets: "2030 年淨零排放",
        details: "透過太陽能與儲能系統實現。"
    }
};
