import React, { useState, useRef, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import ResultCard from './components/ResultCard';
import GhgTable from './components/GhgTable';
import { analyzeEsgReport } from './services/geminiService';
import { AnalysisResult, FileState } from './types';

interface HistoryItem {
  id: string;
  timestamp: number;
  fileName: string;
  data: AnalysisResult;
}

const App: React.FC = () => {
  const [fileState, setFileState] = useState<FileState>({ file: null, base64: null });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  // Close history dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFileSelect = (file: File, base64: string) => {
    setFileState({ file, base64 });
    setResult(null);
    setError(null);
  };

  const handleStartAnalysis = async () => {
    if (!fileState.base64) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeEsgReport(fileState.base64);
      setResult(data);

      // Add to history
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        fileName: fileState.file?.name || '未命名報告.pdf',
        data: data
      };
      setHistory(prev => [newItem, ...prev]);

    } catch (err) {
      console.error(err);
      setError("分析文件時發生錯誤，請確認 API Key 設定正確或檔案是否過大。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFileState({ file: null, base64: null });
    setResult(null);
    setError(null);
  };

  const restoreHistory = (item: HistoryItem) => {
    setResult(item.data);
    // Visual reset for file input implies we are viewing a past record, 
    // so we don't necessarily need the file object in the input box,
    // but clearing it avoids confusion.
    setFileState({ file: null, base64: null }); 
    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-TW', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Navbar / Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-opacity-80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleReset}>
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-emerald-200 shadow-lg">
              E
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-teal-500">
              EcoScan AI
            </h1>
          </div>
          
          <div className="flex items-center gap-3 relative" ref={historyRef}>
            <div className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full hidden sm:block">
              Powered by Gemini 2.0
            </div>

            <button 
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                showHistory 
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-2 ring-emerald-100' 
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              歷史紀錄
              {history.length > 0 && (
                <span className="ml-0.5 bg-emerald-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.2em] text-center">
                  {history.length}
                </span>
              )}
            </button>

            {/* History Dropdown */}
            {showHistory && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in z-40">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-semibold text-slate-700 text-sm">最近分析紀錄</h3>
                  <button onClick={() => setHistory([])} className="text-xs text-slate-400 hover:text-red-500 transition-colors">
                    清空
                  </button>
                </div>
                <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-50">
                  {history.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-sm">
                      <p>暫無紀錄</p>
                      <p className="text-xs mt-1">開始分析後將自動儲存</p>
                    </div>
                  ) : (
                    history.map((item) => (
                      <button 
                        key={item.id}
                        onClick={() => restoreHistory(item)}
                        className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors group"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="font-medium text-slate-800 text-sm truncate max-w-[180px]" title={item.fileName}>
                            {item.fileName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded group-hover:bg-white">
                            {formatTime(item.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded group-hover:bg-white group-hover:text-emerald-600">
                            {item.data.companyInfo.name || "未知公司"}
                          </span>
                          <span>
                            {item.data.companyInfo.code}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="animate-fade-in">
          {/* Hero Section */}
          {!result && !isLoading && (
            <div className="text-center mb-10 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                ESG 永續報告智能分析
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                上傳 PDF 永續報告書，AI 將自動識別並提取完整的 <span className="text-emerald-600 font-semibold">溫室氣體盤查數據</span> (含各廠區/範疇三細項)、<span className="text-emerald-600 font-semibold">第三方確信</span> 與 <span className="text-emerald-600 font-semibold">減量目標</span>。
              </p>
            </div>
          )}

          {/* Preparation Section: Upload */}
          {!result && !isLoading && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* File Upload Component */}
              {!fileState.file ? (
                  <FileUpload onFileSelect={handleFileSelect} disabled={isLoading} />
              ) : (
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
                  <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
                      <h3 className="font-bold text-emerald-800 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                        ESG 報告已就緒
                      </h3>
                      <button onClick={handleReset} className="text-xs text-emerald-600 hover:text-emerald-800 underline">更換檔案</button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                      <div className="w-10 h-10 bg-red-100 text-red-500 rounded-lg flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-semibold text-slate-800 truncate">{fileState.file.name}</p>
                        <p className="text-xs text-slate-500">{(fileState.file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>

                    <button
                      onClick={handleStartAnalysis}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        開始分析報告
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="max-w-3xl mx-auto text-center py-12">
              <div className="relative w-24 h-24 mx-auto mb-8">
                  <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-emerald-600 font-bold text-lg">AI</span>
                  </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">正在分析 ESG 報告</h3>
              <div className="space-y-2 mt-4 max-w-md mx-auto">
                  <div className="flex items-center gap-3 text-slate-600 text-sm">
                    <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span>識別公司基本資訊...</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-sm delay-1000">
                    <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse" style={{animationDelay: '0.5s'}}></div>
                    <span>提取範疇一與範疇二數據 (各廠區細項)...</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 text-sm delay-2000">
                    <div className="w-4 h-4 rounded-full bg-amber-500 animate-pulse" style={{animationDelay: '1s'}}></div>
                    <span>拆解範疇三排放細項與價值鏈數據...</span>
                  </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="max-w-3xl mx-auto mb-10 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mt-0.5 flex-shrink-0">
                <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H5.045c-2.309 0-3.752-2.5-2.598-4.5L9.401 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
              </svg>
              <p>{error}</p>
            </div>
          )}

          {/* Results */}
          {result && !isLoading && (
            <div className="max-w-6xl mx-auto space-y-8 animate-fade-in-up">
              
              {/* 1. Company Info Header */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 font-bold text-3xl shrink-0 border border-emerald-200">
                    {result.companyInfo.code.substring(0, 4) || "ESG"}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{result.companyInfo.name}</h2>
                    <div className="mt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 font-medium">
                      <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72m-13.5 8.65h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                          </svg>
                          股票代號: {result.companyInfo.code}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0h18M5.25 12h13.5h-13.5Zm1.5 3.75h10.5H6.75Z" />
                          </svg>
                          報告年度: {result.companyInfo.year}
                      </span>
                      <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                          </svg>
                          資料來源頁碼: {result.ghgData.page || "-"}
                      </span>
                    </div>
                </div>
              </div>

              {/* 2. Scope 1 & 2 Table */}
              <GhgTable 
                title="範疇一與範疇二盤查數據 (Scope 1 & 2)" 
                years={result.ghgData.scope1And2.years} 
                rows={result.ghgData.scope1And2.rows}
                unitInfo="營運邊界排放"
              />

              {/* 3. Scope 3 Table */}
              <GhgTable 
                title="範疇三價值鏈盤查數據 (Scope 3 Breakdown)" 
                years={result.ghgData.scope3.years} 
                rows={result.ghgData.scope3.rows}
                unitInfo="詳細分類與廠區細項"
              />

              {/* 4. Assurance and Targets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ResultCard 
                  title="第三方確信/查證"
                  found={result.thirdPartyAssurance.hasAssurance}
                  delay={200}
                  page={result.thirdPartyAssurance.page}
                  content={result.thirdPartyAssurance.provider || "無第三方確信單位"}
                  details={result.thirdPartyAssurance.details}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                    </svg>
                  }
                />
                <ResultCard 
                  title="年度減量目標"
                  found={result.reductionTargets.hasTargets}
                  delay={300}
                  page={result.reductionTargets.page}
                  content={result.reductionTargets.targets || "未提及具體年度目標"}
                  details={result.reductionTargets.details}
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.307a11.95 11.95 0 0 1 5.814-5.519l2.74-1.22m0 0-5.94-2.28m5.94 2.28-2.28 5.941" />
                    </svg>
                  }
                />
              </div>
              
              <div className="flex justify-center pt-8">
                  <button onClick={handleReset} className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
                    開始新的分析
                  </button>
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default App;