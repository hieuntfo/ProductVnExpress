
import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, Legend, PieChart, Pie
} from 'recharts';
import { Project, ProjectStatus, ProjectType } from '../types';

interface DashboardProps {
  projects: Project[];
}

const COLORS = ['#9f224e', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'];

const Dashboard: React.FC<DashboardProps> = ({ projects }) => {
  // Statistics
  const stats = useMemo(() => {
    return {
      total: projects.length,
      done: projects.filter(p => [ProjectStatus.DONE, ProjectStatus.HAND_OFF].includes(p.status)).length,
      inProgress: projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length,
      pending: projects.filter(p => [ProjectStatus.PENDING, ProjectStatus.PLANNING].includes(p.status)).length,
    };
  }, [projects]);

  // Statistics ANN vs NEW
  const typeStats = useMemo(() => {
    // ANN = ProjectType.ANNUAL
    const annProjects = projects.filter(p => p.type === ProjectType.ANNUAL);
    // NEW = ProjectType.NEW or ProjectType.STRATEGIC
    const newProjects = projects.filter(p => p.type === ProjectType.NEW || p.type === ProjectType.STRATEGIC);

    const getDesignerLoad = (data: Project[]) => {
      const counts = data.reduce((acc, p) => {
        const d = p.designer || 'Unassigned';
        acc[d] = (acc[d] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    };

    return {
      annCount: annProjects.length,
      newCount: newProjects.length,
      annDesigners: getDesignerLoad(annProjects),
      newDesigners: getDesignerLoad(newProjects)
    };
  }, [projects]);

  return (
    <div className="space-y-8 animate-scale-in">
      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Projects</p>
          <h3 className="text-3xl font-black text-[#222]">{stats.total}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
          <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-1">Completed</p>
          <h3 className="text-3xl font-black text-emerald-600">{stats.done}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
          <p className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-1">In Progress</p>
          <h3 className="text-3xl font-black text-blue-500">{stats.inProgress}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
          <p className="text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-1">Pending</p>
          <h3 className="text-3xl font-black text-amber-500">{stats.pending}</h3>
        </div>
      </div>

      {/* Main Analysis Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ANN (Annual) */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="bg-[#9f224e] text-white text-[10px] px-3 py-1 rounded-full font-black uppercase">ANN</span>
              <h4 className="text-xl font-black text-slate-900 mt-2">Annual Projects ({typeStats.annCount})</h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold uppercase">Designer Workload</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            {typeStats.annDesigners.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeStats.annDesigners} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} style={{ fontSize: '12px', fontWeight: 'bold' }} width={80} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }} />
                  <Bar dataKey="count" fill="#9f224e" radius={[0, 4, 4, 0]} barSize={20}>
                    {typeStats.annDesigners.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 font-bold uppercase text-xs tracking-wider border-2 border-dashed border-slate-100 rounded-xl">No Data (ANN)</div>
            )}
          </div>
        </div>

        {/* NEW (New Projects) */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="bg-emerald-600 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase">NEW</span>
              <h4 className="text-xl font-black text-slate-900 mt-2">New Projects ({typeStats.newCount})</h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 font-bold uppercase">Designer Workload</span>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            {typeStats.newDesigners.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeStats.newDesigners}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {typeStats.newDesigners.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 font-bold uppercase text-xs tracking-wider border-2 border-dashed border-slate-100 rounded-xl">No Data (NEW)</div>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-[#1a1a1a] text-white p-8 rounded-3xl shadow-xl">
        <h4 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2">
           <span className="w-2 h-2 bg-[#9f224e] rounded-full"></span>
           Total Designer Workload
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from(new Set([...typeStats.annDesigners.map(d => d.name), ...typeStats.newDesigners.map(d => d.name)])).map((name, i) => {
            const total = (typeStats.annDesigners.find(d => d.name === name)?.count || 0) + (typeStats.newDesigners.find(d => d.name === name)?.count || 0);
            return (
              <div key={i} className="text-center">
                <div className="text-2xl font-black text-white mb-1">{total}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{name}</div>
                <div className="w-full bg-[#333] h-1 mt-2 rounded-full overflow-hidden">
                   <div className="bg-[#9f224e] h-full" style={{ width: `${Math.min((total/5)*100, 100)}%` }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
