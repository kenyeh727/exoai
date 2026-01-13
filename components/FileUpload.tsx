import React, { useCallback, useState } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File, base64: string) => void;
  disabled: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isReading, setIsReading] = useState(false);

  const processFile = (file: File) => {
    if (file.type !== 'application/pdf') {
      alert('請上傳 PDF 格式的檔案');
      return;
    }

    setIsReading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onFileSelect(file, result);
      setIsReading(false);
    };
    reader.onerror = () => {
      alert('檔案讀取失敗');
      setIsReading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled || isReading) return;

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [disabled, isReading]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled && !isReading) setIsDragging(true);
  }, [disabled, isReading]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const isInteractive = !disabled && !isReading;

  return (
    <div
      onDrop={isInteractive ? handleDrop : undefined}
      onDragOver={isInteractive ? handleDragOver : undefined}
      onDragLeave={isInteractive ? handleDragLeave : undefined}
      className={`
        relative group
        border-2 border-dashed rounded-3xl p-10 sm:p-14 transition-all duration-300 ease-out
        flex flex-col items-center justify-center text-center overflow-hidden
        ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/60 scale-[1.01] shadow-xl ring-4 ring-emerald-100'
            : 'border-slate-200 bg-white hover:border-emerald-400 hover:bg-slate-50/50 hover:shadow-lg hover:-translate-y-1'
        }
        ${!isInteractive ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'cursor-pointer'}
      `}
    >
      <input
        type="file"
        accept="application/pdf"
        onChange={handleInputChange}
        disabled={!isInteractive}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
      />
      
      {/* Decorative background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 transition-opacity duration-500 ${isInteractive && 'group-hover:opacity-100'}`} />

      <div className={`
        relative z-10 w-24 h-24 rounded-3xl flex items-center justify-center mb-6 shadow-md transition-all duration-300
        ${isInteractive 
          ? 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600 group-hover:scale-110 group-hover:shadow-emerald-200 group-hover:rotate-3 border border-emerald-100' 
          : 'bg-slate-100 text-slate-400'
        }
      `}>
        {isReading ? (
          <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
          </svg>
        )}
      </div>

      <div className="relative z-10 space-y-2">
        <h3 className={`text-xl font-bold transition-colors ${isReading ? 'text-slate-700' : 'text-slate-800 group-hover:text-emerald-700'}`}>
          {isReading ? '正在讀取檔案...' : isDragging ? '放開以開始分析' : '點擊或拖放上傳 ESG 報告'}
        </h3>
        <p className="text-slate-500 font-medium">
          {isReading ? '請稍候，正在處理大型 PDF...' : '支援 PDF 格式'}
        </p>
        {!isReading && !disabled && (
           <div className="h-6 mt-2 overflow-hidden">
             <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold tracking-wide transform translate-y-8 transition-transform duration-300 group-hover:translate-y-0 shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                 <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
               </svg>
               選擇檔案
             </span>
           </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
