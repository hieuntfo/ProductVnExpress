
import React from 'react';
import { Project, ProjectStatus } from '../types';

interface ProjectTableProps {
  projects: Project[];
  selectedYear: number;
  onSelectProject: (project: Project) => void;
}

const ProjectTable: React.FC<ProjectTableProps> = ({ projects, selectedYear, onSelectProject }) => {
  const getStatusBadge = (status: ProjectStatus) => {
    const styles: Record<ProjectStatus, string> = {
      [ProjectStatus.NOT_STARTED]: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
      [ProjectStatus.IN_PROGRESS]: 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800',
      [ProjectStatus.DONE]: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-300 dark:border-emerald-800',
      [ProjectStatus.PENDING]: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/50 dark:text-amber-300 dark:border-amber-800',
      [ProjectStatus.RE_OPEN]: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-800',
      [ProjectStatus.IOS_DONE]: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:border-purple-800',
      [ProjectStatus.ANDROID_DONE]: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-800',
      [ProjectStatus.CANCELLED]: 'bg-slate-100 text-slate-400 border-slate-200 line-through dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700',
      [ProjectStatus.HAND_OFF]: 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-[#9f224e]/30 dark:text-[#f43f5e] dark:border-[#9f224e]/50',
      [ProjectStatus.PLANNING]: 'bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-900/50 dark:text-cyan-300 dark:border-cyan-800',
    };
    return (
      <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-wider whitespace-nowrap backdrop-blur-sm ${styles[status] || 'bg-slate-100 text-slate-400'}`}>
        {status}
      </span>
    );
  };

  const getQuarterBadge = (q: number) => (
    <span className="bg-slate-200 text-slate-600 border-slate-300 dark:bg-slate-700/80 dark:text-white dark:border-slate-600 text-[10px] px-2 py-0.5 rounded font-bold uppercase border shadow-sm">
      Q{q}
    </span>
  );

  return (
    <div className="bg-white/80 dark:bg-[#1e293b]/50 backdrop-blur-2xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 dark:border-slate-700/50 overflow-hidden transition-all duration-300 hover:bg-white dark:hover:bg-[#1e293b]/60">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-[#1e293b]/80 border-b border-slate-200 dark:border-slate-700/50">
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em] w-16">No.</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">Project / Description</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">Dept / Type</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">PM / Request</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">Status</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em]">Timeline</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.1em] text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-all duration-200 group">
                <td className="px-6 py-5">
                  <span className="font-mono text-sm font-bold text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">#{project.code}</span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col max-w-xs">
                    <button onClick={() => onSelectProject(project)} className="text-left text-[15px] font-bold text-slate-800 dark:text-white leading-tight truncate hover:text-[#9f224e] hover:underline decoration-[#9f224e] decoration-2 underline-offset-4 transition-all focus:outline-none" title="Click to view details">{project.description}</button>
                    <div className="flex gap-2 mt-2 items-center">
                       {getQuarterBadge(project.quarter)}
                       {project.year !== selectedYear && project.status === ProjectStatus.RE_OPEN && (
                          <span className="text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-900/50 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-700">
                            FROM {project.year}
                          </span>
                       )}
                       <span className="text-[11px] text-slate-500 dark:text-slate-400 italic font-medium truncate group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">{project.phase}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex flex-col">
                      <span className="text-sm text-slate-700 dark:text-slate-200 font-bold group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{project.department}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">{project.type}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col text-[12px]">
                    <span className="text-slate-700 dark:text-slate-200 font-bold group-hover:text-slate-900 dark:group-hover:text-white transition-colors">PM: {project.pm}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] truncate max-w-[120px]" title={project.po}>Req: {project.po}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1.5 items-start">{getStatusBadge(project.status)}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col text-[11px] text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors">
                    <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500"></span>HO: {project.techHandoff || '-'}</span>
                    <span className="font-bold text-[#9f224e] flex items-center gap-1.5 mt-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#9f224e] shadow-[0_0_5px_#9f224e]"></span>Rel: {project.releaseDate || '-'}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <button onClick={() => onSelectProject(project)} className="p-2 text-slate-400 hover:text-white hover:bg-[#9f224e] rounded-xl transition-all shadow-sm border border-transparent hover:shadow-[0_0_15px_rgba(159,34,78,0.5)] transform hover:scale-105 active:scale-95" title="View Details">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </button>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-32 text-center text-slate-400 italic font-medium">
                  <div className="flex flex-col items-center gap-4">
                    <svg className="w-16 h-16 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 8-8-8" /></svg>
                    <span>No projects found for the selected filters.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectTable;
