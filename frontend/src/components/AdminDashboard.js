import React from 'react';``
import { 
  LayoutDashboard, Briefcase, Users, Bell, 
  Settings, Search, Plus, Filter, ExternalLink,
  ChevronRight, CheckCircle2, Globe
} from 'lucide-react';

const AdminDashboard = () => {
  // Sample Data
  const stats = [
    { label: "Active Requirements", count: "12", trend: "+2 this week", icon: <Briefcase size={20}/> },
    { label: "Total Student Profiles", count: "1,458", trend: "+145 this month", icon: <Users size={20}/> },
    { label: "High Matches (>80%)", count: "84", trend: "Across all roles", icon: <CheckCircle2 size={20}/> },
    { label: "Candidates Selected", count: "28", trend: "Notifications sent", icon: <CheckCircle2 size={20}/> },
  ];

  const candidates = [
    { name: "Abinaya", degree: "B.S. Computer Science • 4 Yrs Exp", score: 95, tags: ["React", "TypeScript", "Node.js"], available: "2wks" },
    { name: "Dharsini", degree: "M.S. Software Eng • 3 Yrs Exp", score: 88, tags: ["JavaScript", "Redux", "Next.js"], available: "Immediate" },
    { name: "Lohit", degree: "Bootcamp Grad • 2 Yrs Exp", score: 75, tags: ["React", "TypeScript", "GraphQL"], available: "Requirement mismatch" },
  ];

  return (
    // Updated: Changed bg-[#F8F9FB] to bg-white
    <div className="flex min-h-screen bg-white font-sans text-slate-700">
      
      {/* --- SIDEBAR --- */}
      {/* Updated: Lightened border for white-on-white look */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col sticky h-screen top-0 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Globe size={24} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">TalentPool</span>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Recruitment</p>
          <SidebarLink icon={<LayoutDashboard size={18}/>} label="Match Dashboard" active />
          <SidebarLink icon={<Briefcase size={18}/>} label="Job Requirements" />
          <SidebarLink icon={<Users size={18}/>} label="All Candidates" />
          
          <div className="pt-8">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">System</p>
            <SidebarLink icon={<Bell size={18}/>} label="Notifications" />
            <SidebarLink icon={<Settings size={18}/>} label="Settings" />
          </div>
        </nav>

        <div className="p-6 bg-slate-50/50 border-t border-slate-100">
          <div className="flex items-center gap-3 text-slate-500 hover:text-blue-600 cursor-pointer transition-all">
            <ExternalLink size={16} />
            <span className="text-sm font-bold">Student View Mode</span>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-8">
        
        {/* TOP HEADER */}
        <header className="flex justify-between items-center mb-10">
          <div className="relative w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search candidates, skills, or jobs..." 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 ring-blue-50 focus:bg-white outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-6">
            <Bell className="text-slate-400 cursor-pointer hover:text-slate-600" size={20} />
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">Sweatha</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">HR Manager</p>
              </div>
              <img src="https://i.pravatar.cc/150?u=sarah" alt="Admin" className="w-10 h-10 rounded-full border-2 border-slate-100 shadow-sm" />
            </div>
          </div>
        </header>

        {/* PAGE TITLE */}
        <div className="mb-8 flex justify-between items-end">
          <div className="text-left">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Candidate Matching Engine</h2>
            <p className="text-slate-500 text-sm mt-1 font-medium">Automatically comparing student profiles against active requirements.</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all">
              <Filter size={14} /> Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
              <Plus size={14} /> New Requirement
            </button>
          </div>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {stats.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="text-blue-600 mb-4 bg-blue-50 w-fit p-2 rounded-lg">{item.icon}</div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-3xl font-black text-slate-900">{item.count}</h3>
                <span className={`text-[10px] font-bold ${idx < 2 ? 'text-emerald-500' : 'text-slate-400'}`}>{item.trend}</span>
              </div>
            </div>
          ))}
        </div>

        {/* MATCH LIST SECTION */}
        {/* Updated: Subtle shadow and slate-50 border for contrast on white */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h3 className="font-bold text-slate-900">Top Matches: Senior Frontend Engineer</h3>
            <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span className="text-blue-600 border-b-2 border-blue-600 pb-1 cursor-pointer">All Matches</span>
              <span className="hover:text-slate-600 cursor-pointer pb-1">High Accuracy</span>
              <span className="hover:text-slate-600 cursor-pointer pb-1">Shortlisted</span>
            </div>
          </div>

          <div className="divide-y divide-slate-50">
            {candidates.map((person, idx) => (
              <div key={idx} className="p-6 flex items-center justify-between hover:bg-slate-50/40 transition-all group">
                <div className="flex items-center gap-4 w-1/3 text-left">
                  <img src={`https://i.pravatar.cc/150?u=${person.name}`} className="w-12 h-12 rounded-full border border-slate-100 shadow-sm" alt="profile" />
                  <div>
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{person.name}</h4>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-tight">{person.degree}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {person.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase">{tag}</span>
                  ))}
                </div>

                <div className="text-center w-40">
                  <div className="flex items-center gap-2 justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Match</p>
                    <p className={`text-sm font-black ${person.score > 80 ? 'text-emerald-500' : 'text-amber-500'}`}>{person.score}%</p>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden shadow-inner">
                    <div className={`h-full rounded-full ${person.score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${person.score}%` }}></div>
                  </div>
                </div>

                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tight">
                  {person.available}
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">View</button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">Notify</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ icon, label, active }) => (
  <div className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
    {active && <ChevronRight size={14} />}
  </div>
);

export default AdminDashboard;