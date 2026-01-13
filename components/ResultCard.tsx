import React from 'react';

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  found: boolean;
  page?: string;
  content: string;
  details: string;
  delay: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, icon, found, page, content, details, delay }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden transform transition-all duration-700 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col"
      style={{ animation: `fadeInUp 0.6s ease-out forwards ${delay}ms`, opacity: 0 }}
    >
      <div className={`h-2 w-full ${found ? 'bg-emerald-500' : 'bg-orange-400'}`} />
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${found ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'}`}>
              {icon}
            </div>
            <h4 className="font-bold text-slate-800 text-lg">{title}</h4>
          </div>
          {found && page && (
            <div className="text-xs font-mono font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
              P.{page}
            </div>
          )}
        </div>
        
        <div className="space-y-3 flex-1">
          <div className="flex items-start gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-0.5 shrink-0 ${
              found ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {found ? '已找到' : '未找到'}
            </span>
            <p className="text-slate-800 font-semibold leading-relaxed break-words">
              {content || "無法擷取相關資訊"}
            </p>
          </div>
          
          {details && (
            <div className="pl-2 border-l-2 border-slate-200 ml-1 mt-2">
               <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap font-sans">
                 {details}
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
