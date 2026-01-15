
import React, { useState, useMemo, useEffect } from 'react';
import { DEPARTMENTS, TEAM_MEMBERS, MOCK_PROJECTS } from './constants';
import { Project, ProjectStatus, ProjectType, ReportItem } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectTable from './components/ProjectTable';
import AIAssistant from './components/AIAssistant';
import MemberHub from './components/MemberHub';

const PLAN_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQJJ2HYdVoZ45yKhXPX8kydfkXB6eHebun5TNJlcMIFTtbYncCx8Nuq1sphQE0yeB1M9w_aC_QCzB2g/pub?output=tsv";
const REPORT_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQJJ2HYdVoZ45yKhXPX8kydfkXB6eHebun5TNJlcMIFTtbYncCx8Nuq1sphQE0yeB1M9w_aC_QCzB2g/pub?gid=55703458&single=true&output=tsv";

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'projects' | 'backlog' | 'team'>('dashboard');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  // Form state for New Project
  const [newProject, setNewProject] = useState<Partial<Project>>({
    year: 2026,
    type: ProjectType.NEW,
    status: ProjectStatus.PLANNING,
    phase: 'Khởi tạo',
    quarter: 1,
    department: DEPARTMENTS[0],
    pm: TEAM_MEMBERS[0],
    po: TEAM_MEMBERS[1],
    designer: TEAM_MEMBERS[2]
  });

  const normalizeStatus = (statusStr: string): ProjectStatus => {
    const s = (statusStr || '').trim();
    const map: Record<string, ProjectStatus> = {
      'Not Started': ProjectStatus.NOT_STARTED,
      'In Progress': ProjectStatus.IN_PROGRESS,
      'Done': ProjectStatus.DONE,
      'Pending': ProjectStatus.PENDING,
      'Re-Open': ProjectStatus.RE_OPEN,
      'iOS Done': ProjectStatus.IOS_DONE,
      'Android Done': ProjectStatus.ANDROID_DONE,
      'Cancelled': ProjectStatus.CANCELLED,
      'Hand-Off': ProjectStatus.HAND_OFF,
      'Planning': ProjectStatus.PLANNING,
    };
    return map[s] || ProjectStatus.NOT_STARTED;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [planRes, reportRes] = await Promise.all([
          fetch(`${PLAN_URL}&t=${Date.now()}`),
          fetch(`${REPORT_URL}&t=${Date.now()}`)
        ]);

        const planTsv = await planRes.text();
        const planRows = planTsv.split('\n').map(row => row.split('\t'));
        
        const parsedProjects: Project[] = planRows.slice(1)
          .filter(r => r.length > 2 && r[1] && r[1].trim() !== '')
          .map((row, idx) => {
            const code = (row[0] || '').trim();
            const desc = (row[1] || '').trim();
            const relDate = (row[8] || '').trim();
            const hoDate = (row[7] || '').trim();
            
            let year = 2026;
            if (code.toLowerCase().includes('2025') || relDate.includes('2025') || hoDate.includes('2025') || relDate.endsWith('/25') || hoDate.endsWith('/25')) {
              year = 2025;
            }

            return {
              id: `p-${idx}`,
              year,
              code,
              description: desc,
              type: ((row[2] || '').trim() as ProjectType) || ProjectType.ANNUAL,
              department: (row[3] || '').trim(),
              status: normalizeStatus(row[4] || ''),
              phase: (row[5] || '').trim(),
              quarter: parseInt(row[6]) || 1,
              techHandoff: hoDate,
              releaseDate: relDate,
              pm: (row[9] || '').trim(),
              designer: (row[10] || '').trim(),
              po: (row[11] || '').trim(),
              kpi: (row[12] || '').trim(),
              dashboardUrl: (row[13] || '').trim(),
              notes: (row[14] || '').trim()
            };
          });

        const reportTsv = await reportRes.text();
        const reportRows = reportTsv.split('\n').map(row => row.split('\t'));
        
        const parsedReports: ReportItem[] = reportRows.slice(1)
          .filter(r => r.length > 2 && r[2] && r[2].trim() !== '')
          .map(row => {
            const rawType = (row[0] || '').trim();
            const projectName = (row[2] || '').trim();
            const year = projectName.includes('2025') ? 2025 : 2026;
            return {
              type: rawType.toUpperCase().includes('ANN') ? 'ANN' : 'NEW',
              designer: (row[1] || '').trim(),
              projectName,
              status: (row[3] || '').trim(),
              year
            };
          });

        setProjects(parsedProjects.length > 0 ? parsedProjects : MOCK_PROJECTS);
        setReports(parsedReports);
      } catch (error) {
        console.error("Error fetching data:", error);
        setProjects(MOCK_PROJECTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => p.year === selectedYear && (
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.code.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [projects, selectedYear, searchQuery]);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const projectToAdd: Project = {
      ...newProject,
      id: `local-${Math.random().toString(36).substr(2, 9)}`,
      year: selectedYear,
    } as Project;

    setProjects(prev => [projectToAdd, ...prev]);
    setIsAddingProject(false);
    alert(`Dự án ${projectToAdd.code} đã được thêm vào hệ thống ${selectedYear}!`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex items-center justify-between mb-8 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#9f224e] w-2 h-2 rounded-full"></span>
              <span className="text-[10px] font-black uppercase text-[#9f224e] tracking-[0.2em]">Hệ thống quản lý 2026</span>
            </div>
            <h1 className="text-3xl font-black text-[#1a1a1a] tracking-tight">
              {activeView === 'dashboard' ? 'Báo Cáo Tổng Quan' : 
               activeView === 'projects' ? 'Kế Hoạch Dự Án' : 
               activeView === 'backlog' ? 'Danh Sách Chờ' : 'Member HUB'}
            </h1>
            <div className="flex bg-slate-200 p-1 rounded-xl mt-4 inline-flex shadow-inner">
              {[2025, 2026].map(yr => (
                <button 
                  key={yr}
                  onClick={() => setSelectedYear(yr)}
                  className={`px-8 py-1.5 text-xs font-black rounded-lg transition-all duration-300 ${selectedYear === yr ? 'bg-[#9f224e] text-white shadow-lg scale-105' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  NĂM {yr}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.location.reload()}
              className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-[#9f224e] transition-all shadow-sm active:scale-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
            <button onClick={() => setIsAddingProject(true)} className="bg-[#9f224e] text-white px-6 py-3 rounded-xl font-black text-sm shadow-xl flex items-center gap-2 hover:bg-[#851a40] transition-all active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
              TẠO DỰ ÁN
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-12 h-12 border-4 border-slate-100 border-t-[#9f224e] rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black mt-6 text-[11px] uppercase tracking-[0.3em] animate-pulse">Đang nạp dữ liệu...</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {activeView === 'dashboard' && <Dashboard projects={projects.filter(p => p.year === selectedYear)} reports={reports.filter(r => r.year === selectedYear)} />}
            {activeView === 'projects' && (
              <div className="space-y-6">
                 <div className="relative max-w-md">
                    <input 
                      type="text" 
                      placeholder="Tìm mã dự án hoặc tên..." 
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#9f224e] outline-none shadow-sm transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <svg className="w-5 h-5 absolute left-4 top-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 </div>
                 <ProjectTable projects={filteredProjects} onSelectProject={setSelectedProject} />
              </div>
            )}
            {activeView === 'team' && <MemberHub projects={projects.filter(p => p.year === selectedYear)} />}
            {activeView === 'backlog' && <div className="p-20 text-center font-bold text-slate-300 uppercase tracking-widest">Backlog Coming Soon</div>}
          </div>
        )}
      </main>

      <AIAssistant projects={projects.filter(p => p.year === selectedYear)} />

      {/* Lightbox: Thêm dự án mới */}
      {isAddingProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">Khởi tạo dự án mới {selectedYear}</h2>
              <button onClick={() => setIsAddingProject(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleAddProject} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-5">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mã dự án</label>
                  <input required type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Vd: VNE_2026_001" onChange={e => setNewProject({...newProject, code: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Loại hình</label>
                  <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" onChange={e => setNewProject({...newProject, type: e.target.value as ProjectType})}>
                    {Object.values(ProjectType).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tên dự án (Issue Description)</label>
                  <input required type="text" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" placeholder="Nhập tên dự án..." onChange={e => setNewProject({...newProject, description: e.target.value})} />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Chuyên mục</label>
                  <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" onChange={e => setNewProject({...newProject, department: e.target.value})}>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">PM Phụ trách</label>
                  <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm" onChange={e => setNewProject({...newProject, pm: e.target.value})}>
                    {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button type="button" onClick={() => setIsAddingProject(false)} className="px-6 py-2.5 font-bold text-slate-500 hover:text-slate-700">Hủy</button>
                <button type="submit" className="px-8 py-2.5 bg-[#9f224e] text-white rounded-xl font-bold shadow-lg">Lưu dự án</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox: Chi tiết dự án */}
      {selectedProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl animate-scale-in">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black text-[#9f224e] uppercase tracking-widest">Chi tiết dự án</span>
                <h2 className="text-xl font-bold text-slate-900 mt-1">{selectedProject.description}</h2>
              </div>
              <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Mã dự án</p>
                    <p className="font-mono text-sm font-bold">{selectedProject.code}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Trạng thái</p>
                    <p className="text-sm font-bold text-[#9f224e]">{selectedProject.status}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">KPI Cam kết</p>
                    <p className="text-sm font-bold">{selectedProject.kpi || 'N/A'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Nhân sự Lead</p>
                    <p className="text-sm font-bold">PM: {selectedProject.pm} | PO: {selectedProject.po}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Lộ trình (Rel)</p>
                    <p className="text-sm font-bold text-emerald-600">{selectedProject.releaseDate || 'TBA'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Ghi chú</p>
                    <p className="text-xs text-slate-500 italic">"{selectedProject.notes || 'Không có ghi chú.'}"</p>
                  </div>
                </div>
              </div>
              {selectedProject.dashboardUrl && (
                <div className="pt-4 border-t">
                  <a href={selectedProject.dashboardUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all">
                    Mở Dashboard Theo Dõi
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default App;
