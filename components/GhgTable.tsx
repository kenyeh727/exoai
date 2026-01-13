import React, { useState } from 'react';
import { GhgTableRow } from '../types';

interface GhgTableProps {
  title: string;
  years: string[];
  rows: GhgTableRow[];
  unitInfo?: string;
}

const GhgTable: React.FC<GhgTableProps> = ({ title, years, rows, unitInfo }) => {
  const [copied, setCopied] = useState(false);

  if (!rows || rows.length === 0) {
    return null;
  }

  const handleCopy = () => {
    // Construct TSV (Tab Separated Values) for easy pasting into Excel
    // Removed Unit column from copy
    const header = ['項目 / 廠區 (含單位)', ...years].join('\t');
    const body = rows.map(row => {
      // Escape tabs in data just in case
      const safeCategory = row.category.replace(/\t/g, ' ');
      const safeValues = row.values.map(v => v.replace(/\t/g, ' '));
      return [safeCategory, ...safeValues].join('\t');
    }).join('\n');

    const content = `${header}\n${body}`;
    
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-fade-in-up mb-8">
      <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M1.125 6.75v10.5a1.125 1.125 0 0 0 1.125 1.125h19.5a1.125 1.125 0 0 0 1.125-1.125V6.75" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
            {unitInfo && (
              <p className="text-xs text-slate-500 mt-0.5">{unitInfo}</p>
            )}
          </div>
        </div>
        
        <button 
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            copied 
              ? 'bg-green-100 text-green-700' 
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-emerald-700'
          }`}
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              已複製
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
              複製表格
            </>
          )}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              {/* Increased width to 7/12 since unit column is gone */}
              <th className="py-4 px-6 font-semibold text-slate-700 w-7/12 min-w-[250px]">項目 / 廠區 / 單位</th>
              {years.map((year, idx) => (
                <th key={idx} className="py-4 px-6 font-semibold text-emerald-700 text-right whitespace-nowrap">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                <td className="py-3 px-6 text-slate-800 font-medium group-hover:text-emerald-700 transition-colors whitespace-normal break-words leading-snug">
                  {row.category}
                </td>
                {/* Unit column removed */}
                {row.values.map((val, vIdx) => (
                  <td key={vIdx} className="py-3 px-6 text-right text-slate-700 font-mono tabular-nums whitespace-nowrap align-top pt-3.5">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GhgTable;