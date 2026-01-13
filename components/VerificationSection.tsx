import React, { useEffect, useState } from 'react';
import { AnalysisResult, VerificationResult } from '../types';
import { verifyWithTwse } from '../services/verificationService';

interface Props {
  data: AnalysisResult;
  mopsUrl?: string; // Add optional URL prop
}

const VerificationSection: React.FC<Props> = ({ data, mopsUrl }) => {
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const runVerification = async () => {
      setLoading(true);
      try {
        // Pass the mopsUrl to the service
        const verificationResult = await verifyWithTwse(data, mopsUrl);
        setResult(verificationResult);
      } catch (e) {
        console.error("Verification failed", e);
      } finally {
        setLoading(false);
      }
    };

    if (data && data.companyInfo && data.companyInfo.code) {
      runVerification();
    }
  }, [data, mopsUrl]); // Add mopsUrl to dependency array

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-fade-in-up mt-8">
      {/* Header */}
      <div className="bg-slate-800 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center text-white gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-lg shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">數據一致性自動核對 (三方比對)</h3>
            <p className="text-xs text-slate-300">
              比對年度: {result ? <span className="text-yellow-300 font-bold">{result.targetYear}</span> : '...'} | 
              來源: PDF報告 vs 證交所資料庫 vs 
              {mopsUrl ? <span className="ml-1 text-green-300 underline" title={mopsUrl}>指定年報網址</span> : ' MOPS年報(模擬)'}
            </p>
          </div>
        </div>
        
        {/* Buttons Group */}
        <div className="flex flex-wrap items-center gap-2">
           <a 
             href={`https://esggenplus.twse.com.tw/inquiry/info/individual?lang=zh-TW&stockCode=${data.companyInfo.code}`} 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors flex items-center gap-1 border border-slate-600"
           >
             ESG Gen Plus
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
               <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
             </svg>
           </a>
           <a 
             href={mopsUrl || `https://mopsov.twse.com.tw/mops/web/t57sb01_q5`} 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition-colors flex items-center gap-1 border border-slate-600"
           >
             {mopsUrl ? '開啟指定年報' : 'MOPS 年報 (114)'}
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
               <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
             </svg>
           </a>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading || !result ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-500">
             <svg className="animate-spin h-8 w-8 text-blue-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
             <p>正在進行三方資料比對 (PDF / 證交所 / 年報)...</p>
             {mopsUrl && <p className="text-xs mt-1 text-emerald-600 font-medium">已載入您提供的年報網址進行分析</p>}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                    <th className="py-3 px-4 w-[25%]">比對項目</th>
                    <th className="py-3 px-4 text-right w-[15%] text-emerald-700">PDF 報告</th>
                    <th className="py-3 px-4 text-right w-[15%]">證交所資料庫</th>
                    <th className="py-3 px-4 text-right w-[20%]">MOPS 年報 (114)</th>
                    <th className="py-3 px-4 text-center w-[15%]">綜合結果</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {result.items.map((item, idx) => {
                    const isMismatch = item.status === 'mismatch';
                    const isPartial = item.status === 'partial';
                    const rowClass = isMismatch ? 'bg-red-50' : isPartial ? 'bg-orange-50' : 'hover:bg-slate-50';
                    
                    return (
                      <tr key={idx} className={`transition-colors ${rowClass}`}>
                        <td className="py-3 px-4 text-slate-800 font-medium text-sm">{item.category}</td>
                        <td className="py-3 px-4 text-right text-slate-800 font-mono font-bold bg-white/50">{item.pdfValue}</td>
                        <td className="py-3 px-4 text-right text-slate-600 font-mono">{item.twseValue}</td>
                        <td className="py-3 px-4 text-right text-slate-600 font-mono">
                          <div>{item.mopsValue}</div>
                          {item.mopsPage !== '-' && (
                            <div className="text-[10px] text-slate-400">P.{item.mopsPage}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {item.status === 'match' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                               完全一致
                            </span>
                          )}
                          {item.status === 'partial' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                               部分差異
                            </span>
                          )}
                          {item.status === 'mismatch' && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                               數值異常
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {result.items.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400">
                        無法比對：找不到 ({result.targetYear}) 的資料
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 text-xs text-slate-400 border-t border-slate-100 pt-3 flex items-start gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
              </svg>
              <span>注意：受限於瀏覽器安全性規範 (CORS)，本系統無法直接爬取證交所與 MOPS 年報的即時內容。上述「證交所資料庫」與「MOPS 年報」欄位數值 (包含頁碼) 均為模擬生成，並假定來源為您輸入的網址。實際應用需串接後端 API 代理請求。</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerificationSection;
