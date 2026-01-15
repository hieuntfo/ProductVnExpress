
import React from 'react';
import { BacklogItem } from '../types';

interface BacklogListProps {
  items: BacklogItem[];
}

const BacklogList: React.FC<BacklogListProps> = ({ items }) => {
  const getPriorityBadge = (priority: string) => {
    const p = priority?.toLowerCase() || '';
    if (p.includes('cao') || p.includes('high') || p.includes('p0')) 
      return 'bg-red-50 text-red-600 border-red-100';
    if (p.includes('trung') || p.includes('medium') || p.includes('p1')) 
      return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-slate-50 text-slate-500 border-slate-100';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-scale-in">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-start justify-between mb-4">
            <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
              {item.code || 'N/A'}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider ${getPriorityBadge(item.priority)}`}>
              {item.priority || 'Low'}
            </span>
          </div>
          
          <h4 className="text-sm font-bold text-slate-900 mb-2 leading-snug group-hover:text-[#9f224e] transition-colors">
            {item.description}
          </h4>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">
              {item.type || 'Sản phẩm'}
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">
              {item.department || 'VNE'}
            </span>
          </div>

          <div className="pt-4 border-t border-slate-50">
            <p className="text-[11px] text-slate-500 italic line-clamp-2">
              {item.notes || 'Chưa có ghi chú chi tiết cho backlog này.'}
            </p>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Status: {item.status}</span>
            <button className="text-[10px] font-bold text-[#9f224e] hover:underline uppercase">Đưa vào Plan</button>
          </div>
        </div>
      ))}
      
      {items.length === 0 && (
        <div className="col-span-full py-20 text-center">
          <p className="text-slate-400 font-bold uppercase tracking-widest">Không có item nào trong backlog</p>
        </div>
      )}
    </div>
  );
};

export default BacklogList;
