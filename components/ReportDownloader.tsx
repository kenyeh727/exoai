import React, { useState } from 'react';

interface StockTask {
  id: string;
  code: string;
  status: 'idle' | 'searching' | 'completed' | 'failed';
  message?: string;
}

const ReportDownloader: React.FC = () => {
  const [inputCodes, setInputCodes] = useState('');
  const [tasks, setTasks] = useState<StockTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddTasks = () => {
    if (!inputCodes.trim()) return;

    // Split by comma, space, or newline and filter empty
    const codes = inputCodes
      .split(/[\s,]+/)
      .filter(code => code.trim().length > 0);

    const newTasks: StockTask[] = codes.map(code => ({
      id: Math.random().toString(36).substr(2, 9),
      code: code.trim(),
      status: 'idle'
    }));

    setTasks(prev => [...prev, ...newTasks]);
    setInputCodes('');
  };

  const handleClearTasks = () => {
    setTasks([]);
  };

  // 模擬下載流程 (因為跨域 CORS 限制，前端無法直接從 TWSE 下載檔案)
  // 實際專案中，這裡應該呼叫您的後端 API 來執行爬蟲
  const processQueue = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    const queue = tasks.filter(t => t.status === 'idle');
    
    // Process sequentially for demo purposes
    for (const task of queue) {
      setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: 'searching' } : t));
      
      // Simulate network request delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Randomly succeed or fail for demo
      const isSuccess = Math.random() > 0.1;
      
      setTasks(prev => prev.map(t => 
        t.id === task.id ? { 
          ...t, 
          status: isSuccess ? 'completed' : 'failed',
          message: isSuccess ? '已找到報告' : '查無資料或連線失敗'
        } : t
      ));
    }

    setIsProcessing(false);
  };

  // 由於無法直接下載，提供一個開啟外部連結的 Helper
  const openExternalSearch = (code: string) => {
    // 導向到查詢頁面
    window.open(`https://esggenplus.twse.com.tw/inquiry/report`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      
      {/* Input Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">ESG 報告書自動搜尋器</h2>
            <p className="text-sm text-slate-500">輸入公司代碼，系統將自動搜尋最新的永續報告書</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="codes" className="block text-sm font-medium text-slate-700 mb-2">
              公司代碼 (可輸入多筆，請以逗號、空白或換行分隔)
            </label>
            <textarea
              id="codes"
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors font-mono text-sm"
              placeholder="例如: 2330, 2303, 2454"
              value={inputCodes}
              onChange={(e) => setInputCodes(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleAddTasks}
              disabled={!inputCodes.trim()}
              className="px-6 py-2 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              加入排程
            </button>
            <button
              onClick={processQueue}
              disabled={tasks.length === 0 || isProcessing}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isProcessing 
                  ? 'bg-blue-100 text-blue-700 cursor-wait' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  處理中...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  開始搜尋
                </>
              )}
            </button>
             {tasks.length > 0 && !isProcessing && (
              <button
                onClick={handleClearTasks}
                className="px-4 py-2 text-slate-500 hover:text-red-500 transition-colors ml-auto text-sm font-medium"
              >
                清空清單
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task List */}
      {tasks.length > 0 && (
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-700">下載佇列 ({tasks.length})</h3>
            <span className="text-xs text-slate-500">
              已完成: {tasks.filter(t => t.status === 'completed').length} / {tasks.length}
            </span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {tasks.map(task => (
              <div key={task.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    task.status === 'completed' ? 'bg-green-100 text-green-600' :
                    task.status === 'failed' ? 'bg-red-100 text-red-600' :
                    task.status === 'searching' ? 'bg-blue-100 text-blue-600 animate-pulse' :
                    'bg-slate-100 text-slate-500'
                  }`}>
                    {task.code}
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">公司代碼: {task.code}</div>
                    <div className={`text-xs ${
                      task.status === 'completed' ? 'text-green-600' :
                      task.status === 'failed' ? 'text-red-500' :
                      task.status === 'searching' ? 'text-blue-500' :
                      'text-slate-400'
                    }`}>
                      {task.status === 'idle' && '等待處理...'}
                      {task.status === 'searching' && '正在搜尋 ESG Gen Plus...'}
                      {task.status === 'completed' && task.message}
                      {task.status === 'failed' && task.message}
                    </div>
                  </div>
                </div>
                
                <div>
                   {task.status === 'completed' ? (
                     <button className="text-sm bg-green-50 text-green-700 px-3 py-1.5 rounded hover:bg-green-100 transition-colors border border-green-200 flex items-center gap-1">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                         <path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" />
                         <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                       </svg>
                       下載
                     </button>
                   ) : (
                    <button 
                      onClick={() => openExternalSearch(task.code)}
                      className="text-xs text-slate-400 hover:text-blue-500 underline decoration-dotted"
                    >
                      手動前往
                    </button>
                   )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 flex items-start gap-3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
          <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
        </svg>
        <p>
          <strong>注意：</strong> 由於證交所 ESG Gen Plus 網站的安全性設定 (CORS)，網頁版應用程式無法直接在背景自動下載檔案。
          <br/>
          此功能目前為模擬排程演示。若需實現真正的全自動批次下載，需要搭配後端伺服器或 Python 腳本執行。
        </p>
      </div>
    </div>
  );
};

export default ReportDownloader;
