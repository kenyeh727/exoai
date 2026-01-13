
import { AnalysisResult, VerificationItem, VerificationResult } from "../types";

// 模擬從 TWSE 與 MOPS 獲取的數據
// 注意：由於瀏覽器 CORS 限制，此處僅為演示「多來源比對邏輯」與「UI呈現」。

export const verifyWithTwse = async (pdfData: AnalysisResult, mopsUrl?: string): Promise<VerificationResult> => {
  
  // 模擬網路延遲 (查詢兩個資料庫)
  // 如果有網址，模擬解析 PDF 需稍微久一點
  const delay = mopsUrl ? 2000 : 1500;
  await new Promise(resolve => setTimeout(resolve, delay));

  // Use scope1And2 for verification as it is the primary data source
  const tableData = pdfData.ghgData.scope1And2;
  const rows = tableData.rows;
  
  // 優先尋找 "2024" 年的數據
  let targetYear = "2024";
  let yearIndex = tableData.years.findIndex(y => y.includes("2024"));

  if (yearIndex === -1) {
    if (tableData.years.length > 0) {
        yearIndex = 0; 
        targetYear = tableData.years[0];
    } else {
        return { targetYear: "N/A", items: [] };
    }
  } else {
    targetYear = tableData.years[yearIndex];
  }

  const itemsToVerify: VerificationItem[] = rows.slice(0, 8).map(row => {
    // 1. PDF 數據
    const pdfValStr = row.values[yearIndex] || "-";
    const cleanVal = parseFloat(pdfValStr.replace(/,/g, ''));
    
    // 若 PDF 無數據
    if (isNaN(cleanVal) || pdfValStr === '-' || pdfValStr === '') {
      return {
        category: row.category,
        pdfValue: "-",
        twseValue: "-",
        mopsValue: "未揭露", // 若 PDF 沒數據，年報通常也視為未揭露
        mopsPage: "-",
        isMatch: true,
        status: 'match'
      };
    }

    // 2. 模擬 TWSE 數據 (ESG Gen Plus)
    // 這裡保持原本的模擬邏輯：證交所資料庫偶爾會有 Key-in 錯誤或更新延遲
    const isTwseMatch = Math.random() > 0.1; 
    let mockTwseNum = cleanVal;
    if (!isTwseMatch) {
      const variance = (Math.random() * 0.02) + 0.005; 
      const direction = Math.random() > 0.5 ? 1 : -1;
      mockTwseNum = cleanVal * (1 + (variance * direction));
    }
    const twseStr = Number.isInteger(mockTwseNum) ? Math.round(mockTwseNum).toString() : mockTwseNum.toFixed(2);

    // 3. 模擬 MOPS 數據 (股東會年報 114年)
    let mopsStr = "-";
    let mockMopsPage = "-";
    let mockMopsNum = cleanVal; // 用於最後的比對運算

    if (mopsUrl) {
        // 【情境 A：使用者提供了正確的年報網址】
        // 邏輯：既然網址正確，我們假設年報內容應與 PDF 報告高度一致，或者未揭露。
        // 不再生成隨機的數值誤差。
        
        mockMopsPage = Math.floor(Math.random() * 200 + 50).toString();

        // 90% 機率在年報中找到完全一致的數據
        // 10% 機率年報中沒有該細項 (顯示未揭露)
        const isFoundInMops = Math.random() > 0.1;

        if (isFoundInMops) {
            mopsStr = pdfValStr; // 強制完全一致
            mockMopsNum = cleanVal;
        } else {
            mopsStr = "未揭露";
            mockMopsNum = NaN; // 標記為無法比較
        }

    } else {
        // 【情境 B：未提供網址 (Demo 模式)】
        // 邏輯：保持隨機性，展示系統能抓出差異的功能
        mockMopsPage = Math.floor(Math.random() * 200 + 50).toString();
        const isMopsDisclosed = Math.random() > 0.1; // 90% 有揭露

        if (isMopsDisclosed) {
            const isMopsMatch = Math.random() > 0.2; // 80% 一致
            if (!isMopsMatch) {
                // 模擬不一致
                const variance = (Math.random() * 0.05) + 0.01; 
                const direction = Math.random() > 0.5 ? 1 : -1;
                mockMopsNum = cleanVal * (1 + (variance * direction));
            }
            mopsStr = Number.isInteger(mockMopsNum) ? Math.round(mockMopsNum).toString() : mockMopsNum.toFixed(2);
        } else {
            mopsStr = "未揭露";
            mockMopsNum = NaN;
        }
    }

    // 4. 三方比對邏輯
    const isTwseClose = Math.abs((cleanVal - mockTwseNum) / cleanVal) < 0.005;
    
    let isMopsClose = false;
    if (mopsStr !== "未揭露" && mopsStr !== "-") {
         // 如果有數值，檢查是否接近
         isMopsClose = Math.abs((cleanVal - mockMopsNum) / cleanVal) < 0.005;
    } else if (mopsStr === "未揭露") {
         // 如果是未揭露，我們視為「不一致」(資料缺失)，但在 UI 上會顯示「未揭露」字樣
         // 這樣可以觸發 Partial 或 Mismatch 狀態，提醒使用者注意
         isMopsClose = false; 
    }

    let status: 'match' | 'partial' | 'mismatch' = 'mismatch';
    
    // 定義狀態邏輯
    if (isTwseClose) {
        if (mopsStr === "未揭露") {
            status = 'partial'; // PDF=證交所，但年報未揭露 -> 部分一致
        } else if (isMopsClose) {
            status = 'match';   // 三方都一致 -> 完全一致
        } else {
            status = 'partial'; // PDF=證交所，但年報數值不同 -> 部分一致
        }
    } else {
        // PDF != 證交所
        if (isMopsClose) {
            status = 'partial'; // PDF=年報，但證交所不同 -> 部分一致
        } else {
            status = 'mismatch'; // 都不一致
        }
    }

    // 特殊修正：如果有網址且顯示未揭露，不要讓它看起來像嚴重錯誤
    if (mopsUrl && mopsStr === "未揭露" && isTwseClose) {
        // 這種情況下，PDF跟證交所是對的，只是年報沒寫，算 Partial
        status = 'partial';
    }

    return {
      category: row.category,
      pdfValue: pdfValStr,
      twseValue: twseStr,
      mopsValue: mopsStr,
      mopsPage: (mopsStr !== "未揭露" && mopsStr !== "-") ? mockMopsPage : "-",
      isMatch: status === 'match',
      status: status
    };
  });

  return {
    targetYear: targetYear,
    items: itemsToVerify
  };
};
