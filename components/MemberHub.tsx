
import React, { useMemo, useState } from 'react';
import { Project, ProjectStatus, Member } from '../types';

interface MemberHubProps {
  projects: Project[];
  members: Member[];
}

const MemberHub: React.FC<MemberHubProps> = ({ projects, members }) => {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  const getMemberStats = (memberList: Member[], roleLabel: string) => {
    return memberList.map(member => {
      const name = member.name;
      const projectsAsPM = projects.filter(p => p.pm?.toLowerCase().includes(name.toLowerCase()));
      const projectsAsDesigner = projects.filter(p => p.designer?.toLowerCase().includes(name.toLowerCase()));
      const projectsAsPO = projects.filter(p => p.po?.toLowerCase().includes(name.toLowerCase()));
      const totalInvolved = new Set([...projectsAsPM, ...projectsAsPO, ...projectsAsDesigner]).size;
      const activeProjects = projects.filter(p => 
        (p.pm?.toLowerCase().includes(name.toLowerCase()) || p.po?.toLowerCase().includes(name.toLowerCase()) || p.designer?.toLowerCase().includes(name.toLowerCase())) && 
        (p.status === ProjectStatus.IN_PROGRESS || p.status === ProjectStatus.PLANNING || p.status === ProjectStatus.RE_OPEN)
      ).length;

      return { ...member, role: roleLabel, total: totalInvolved, active: activeProjects, pmCount: projectsAsPM.length, designCount: projectsAsDesigner.length, poCount: projectsAsPO.length };
    }).sort((a, b) => b.active - a.active);
  };

  const pmStats = useMemo(() => {
    const pms = members.filter(m => m.position?.toLowerCase().includes('product'));
    return getMemberStats(pms, 'Product Manager');
  }, [projects, members]);

  const designStats = useMemo(() => {
    const designers = members.filter(m => m.position?.toLowerCase().includes('design'));
    return getMemberStats(designers, 'UI/UX Designer');
  }, [projects, members]);


  const renderSection = (title: string, stats: ReturnType<typeof getMemberStats>, colorClass: string, icon: React.ReactNode) => (
    <div className="mb-12">
      <div className="flex items-center gap-4 mb-8 border-b border-slate-300 dark:border-slate-700/60 pb-6">
        <div className={`p-3 rounded-2xl ${colorClass} text-white shadow-lg`}>
          {icon}
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight drop-shadow-sm">{title}</h3>
        <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full border border-slate-300 dark:border-slate-600">{stats.length} Members</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stats.map((member) => (
          <div key={member.name} onClick={() => setSelectedMember(member)} className="bg-white/80 dark:bg-[#1e293b]/50 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700/50 hover:border-[#9f224e] hover:bg-white dark:hover:bg-[#1e293b]/70 hover:shadow-[0_0_20px_rgba(159,34,78,0.2)] transition-all group cursor-pointer active:scale-95 transform hover:-translate-y-1">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-base shadow-lg overflow-hidden border-2 ${member.active > 0 ? 'border-[#9f224e] bg-[#9f224e]' : 'border-slate-300 dark:border-slate-600 bg-slate-400 dark:bg-slate-700'}`}>
                  {member.avatar ? <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" /> : member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-lg leading-tight group-hover:text-[#9f224e] transition-colors">{member.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-0.5 group-hover:text-slate-600 dark:group-hover:text-slate-300">{member.role}</p>
                </div>
              </div>
              {member.active > 0 && (
                <span className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-300 text-[9px] font-black px-2 py-1 rounded border dark:border-emerald-700 animate-pulse">
                  {member.active} ACTIVE
                </span>
              )}
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                 <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase"><span>Workload</span><span className="text-slate-700 dark:text-white">{member.total} Total</span></div>
                 <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-300 dark:border-slate-700/50">
                    <div className={`h-full transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor] ${member.active > 3 ? 'bg-red-500 text-red-500' : 'bg-[#9f224e] text-[#9f224e]'}`} style={{ width: `${Math.min((member.total / 8) * 100, 100)}%` }}></div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                {title === 'Product Managers' && (
                   <>
                    <div className="bg-slate-100 dark:bg-slate-900/70 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                      <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Leading</p>
                      <p className="text-xl font-black text-slate-800 dark:text-white">{member.pmCount}</p>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-900/70 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                      <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">Requested</p>
                      <p className="text-xl font-black text-slate-800 dark:text-white">{member.poCount}</p>
                    </div>
                   </>
                )}
                {title === 'UI/UX' && (
                    <div className="bg-slate-100 dark:bg-slate-900/70 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 text-center col-span-2 hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                      <p className="text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase mb-1">UX/UI Tasks</p>
                      <p className="text-xl font-black text-slate-800 dark:text-white">{member.designCount}</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="space-y-8 animate-fade-in pb-10">
        {renderSection('Product Managers', pmStats, 'bg-blue-600', <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>)}
        {renderSection('UI/UX', designStats, 'bg-[#9f224e]', <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>)}
      </div>
      {selectedMember && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedMember(null)}>
          <div className="bg-white dark:bg-[#1e293b] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700 animate-scale-in flex flex-col md:flex-row" onClick={e => e.stopPropagation()}>
            <div className="w-full md:w-1/3 bg-slate-100 dark:bg-slate-900 flex items-center justify-center relative min-h-[300px] border-r border-slate-200 dark:border-slate-700">
               {selectedMember.avatar ? <img src={selectedMember.avatar} className="absolute inset-0 w-full h-full object-cover opacity-90" alt={selectedMember.name} /> : <div className="text-8xl font-black text-slate-300 dark:text-slate-800">{selectedMember.name.charAt(0).toUpperCase()}</div>}
               <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1e293b] to-transparent opacity-30"></div>
            </div>
            <div className="w-full md:w-2/3 p-10 flex flex-col justify-center bg-white dark:bg-[#1e293b]">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">{selectedMember.fullName || selectedMember.name}</h2>
              <div className="space-y-5 text-sm">
                <div className="flex"><span className="w-32 font-bold text-slate-400 uppercase text-[10px] tracking-wider pt-1">Ngày sinh</span><span className="font-bold text-slate-700 dark:text-slate-200">{selectedMember.dob || 'N/A'}</span></div>
                <div className="flex"><span className="w-32 font-bold text-slate-400 uppercase text-[10px] tracking-wider pt-1">Bộ phận</span><span className="font-bold text-slate-700 dark:text-slate-200">{selectedMember.department || 'N/A'}</span></div>
                <div className="flex"><span className="w-32 font-bold text-slate-400 uppercase text-[10px] tracking-wider pt-1">Vị trí</span><span className="font-black text-[#9f224e] drop-shadow-[0_0_5px_rgba(159,34,78,0.8)]">{selectedMember.position}</span></div>
                <div className="flex"><span className="w-32 font-bold text-slate-400 uppercase text-[10px] tracking-wider pt-1">Email</span><a href={`mailto:${selectedMember.email}`} className="font-bold text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline">{selectedMember.email || 'N/A'}</a></div>
                <div className="flex"><span className="w-32 font-bold text-slate-400 uppercase text-[10px] tracking-wider pt-1">Ngày đi làm</span><span className="font-bold text-slate-700 dark:text-slate-200">{selectedMember.startDate || 'N/A'}</span></div>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                 <button onClick={() => setSelectedMember(null)} className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-bold rounded-xl transition-colors border border-slate-300 dark:border-slate-600">Close Profile</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MemberHub;