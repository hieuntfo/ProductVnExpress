
import React from 'react';
import { BacklogItem } from '../types';

interface BacklogListProps {
  items: BacklogItem[];
}

const BacklogList: React.FC<BacklogListProps> = ({ items }) => {
  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || '';
    if (s.includes('done')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
    if (s.includes('progress')) return 'bg-blue-50 text-blue-600 border-blue-100';
    if (s.includes('pending') || s.includes('planning')) return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-slate-50 text-slate-500 border-slate-100';
  };

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
        <div key={item.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#9f224e]/30 transition-all group flex flex-col h-full">
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-mono font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 self-start">
                {item.code || 'NO_CODE'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider self-start ${getPriorityBadge(item.priority)}`}>
                {item.priority || 'MEDIUM'}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
               <span className="bg-[#1a1a1a] text-white text-[9px] font-black px-2 py-0.5 rounded">
                  QUÝ {item.quarter || '?'}
               </span>
               <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border tracking-wider ${getStatusBadge(item.status)}`}>
                {item.status}
              </span>
            </div>
          </div>
          
          <h4 className="text-base font-black text-slate-900 mb-3 leading-tight group-hover:text-[#9f224e] transition-colors">
            {item.description}
          </h4>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black uppercase border border-slate-200">
              {item.type || 'Sản phẩm'}
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black uppercase border border-slate-200">
              {item.department || 'Phòng P&T'}
            </span>
          </div>

          <div className="flex-1 space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 mb-4">
            <div className="grid grid-cols-2 gap-2 text-[11px]">
               <div className="flex flex-col">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">PM Phụ trách</span>
                  <span className="font-black text-slate-700">{item.pm || 'N/A'}</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">Designer</span>
                  <span className="font-black text-slate-700">{item.designer || 'N/A'}</span>
               </div>
               <div className="flex flex-col mt-2">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">Release Dự kiến</span>
                  <span className="font-black text-emerald-600">{item.releaseDate || 'TBA'}</span>
               </div>
               <div className="flex flex-col mt-2">
                  <span className="text-slate-400 font-bold uppercase text-[9px]">Product Owner</span>
                  <span className="font-black text-slate-700">{item.po || 'N/A'}</span>
               </div>
            </div>
            
            {item.notes && (
              <div className="pt-2 border-t border-slate-200/50">
                <p className="text-[11px] text-slate-500 italic line-clamp-2 leading-relaxed">
                  "{item.notes}"
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <button className="text-[10px] font-black text-slate-400 hover:text-[#9f224e] uppercase flex items-center gap-1 transition-colors">
               <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
               Chỉnh sửa
            </button>
            <button className="text-[10px] font-black bg-[#9f224e] text-white px-4 py-2 rounded-xl shadow-lg shadow-[#9f224e]/20 hover:bg-[#851a40] active:scale-95 transition-all">
               ĐƯA VÀO PLAN
            </button>
          </div>
        </div>
      ))}
      
      {items.length === 0 && (
        <div className="col-span-full py-32 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 8-8-8" /></svg>
          </div>
          <p className="text-slate-400 font-black uppercase tracking-[0.3em]">Không có dữ liệu Backlog</p>
        </div>
      )}
    </div>
  );
};

export default BacklogList;
