
import React, { useMemo } from 'react';
import { Project, ProjectStatus } from '../types';
import { PRODUCT_MANAGERS, TECH_TEAM, DESIGNERS } from '../constants';

interface MemberHubProps {
  projects: Project[];
}

const MemberHub: React.FC<MemberHubProps> = ({ projects }) => {
  
  const getMemberStats = (names: string[], roleLabel: string) => {
    return names.map(name => {
      // Calculate specific roles based on the Project Plan columns
      const projectsAsPM = projects.filter(p => p.pm?.toLowerCase().includes(name.toLowerCase()));
      const projectsAsDesigner = projects.filter(p => p.designer?.toLowerCase().includes(name.toLowerCase()));
      // Checking PO/Request column for Tech/PMs who might be requesters
      const projectsAsPO = projects.filter(p => p.po?.toLowerCase().includes(name.toLowerCase()));
      
      const totalInvolved = new Set([...projectsAsPM, ...projectsAsPO, ...projectsAsDesigner]).size;
      
      // Active = In Progress, Planning, or Re-Open
      const activeProjects = projects.filter(p => 
        (p.pm?.toLowerCase().includes(name.toLowerCase()) || 
         p.po?.toLowerCase().includes(name.toLowerCase()) || 
         p.designer?.toLowerCase().includes(name.toLowerCase())) && 
        (p.status === ProjectStatus.IN_PROGRESS || p.status === ProjectStatus.PLANNING || p.status === ProjectStatus.RE_OPEN)
      ).length;

      return {
        name,
        role: roleLabel,
        total: totalInvolved,
        active: activeProjects,
        pmCount: projectsAsPM.length,
        designCount: projectsAsDesigner.length,
        poCount: projectsAsPO.length,
      };
    }).sort((a, b) => b.active - a.active); // Sort by active projects first
  };

  const pmStats = useMemo(() => getMemberStats(PRODUCT_MANAGERS, 'Product Manager'), [projects]);
  const techStats = useMemo(() => getMemberStats(TECH_TEAM, 'Tech Team'), [projects]);
  const designStats = useMemo(() => getMemberStats(DESIGNERS, 'Designer'), [projects]);

  const renderSection = (title: string, stats: ReturnType<typeof getMemberStats>, colorClass: string, icon: React.ReactNode) => (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4">
        <div className={`p-2 rounded-lg ${colorClass} text-white`}>
          {icon}
        </div>
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{title}</h3>
        <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-full">{stats.length} Members</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {stats.map((member) => (
          <div key={member.name} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 hover:border-[#9f224e] transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-md ${member.active > 0 ? 'bg-[#9f224e]' : 'bg-slate-300'}`}>
                  {member.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-tight">{member.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{member.role}</p>
                </div>
              </div>
              {member.active > 0 && (
                <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-2 py-0.5 rounded border border-emerald-100 animate-pulse">
                  {member.active} ACTIVE
                </span>
              )}
            </div>
            
            <div className="space-y-3 mt-4">
              {/* Progress Bar */}
              <div className="space-y-1">
                 <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                    <span>Workload</span>
                    <span>{member.total} Total</span>
                 </div>
                 <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${member.active > 3 ? 'bg-red-500' : 'bg-[#9f224e]'}`}
                      style={{ width: `${Math.min((member.total / 8) * 100, 100)}%` }}
                    ></div>
                 </div>
              </div>

              {/* Detailed Stats based on Role */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                {title === 'Product Managers' && (
                   <>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Leading (PM)</p>
                      <p className="text-sm font-black text-slate-800">{member.pmCount}</p>
                    </div>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Requested (PO)</p>
                      <p className="text-sm font-black text-slate-800">{member.poCount}</p>
                    </div>
                   </>
                )}

                {title === 'Tech Team' && (
                   <>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center col-span-2">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">Requests / Assigned</p>
                      <p className="text-sm font-black text-slate-800">{member.poCount}</p>
                      <p className="text-[9px] text-slate-400 italic mt-1">(Matches in "Request" column)</p>
                    </div>
                   </>
                )}

                {title === 'Designers' && (
                   <>
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 text-center col-span-2">
                      <p className="text-[9px] text-slate-400 font-bold uppercase">UX/UI Tasks</p>
                      <p className="text-sm font-black text-slate-800">{member.designCount}</p>
                    </div>
                   </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {renderSection('Product Managers', pmStats, 'bg-blue-600', (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
      ))}
      
      {renderSection('Tech Team', techStats, 'bg-slate-700', (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
      ))}

      {renderSection('Designers', designStats, 'bg-[#9f224e]', (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
      ))}
    </div>
  );
};

export default MemberHub;
