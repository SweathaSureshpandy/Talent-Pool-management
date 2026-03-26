import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { 
  Globe, LayoutDashboard, Users, Briefcase, 
  Settings, Bell, LogOut, Search, Filter, 
  PlusCircle, CheckCircle2, TrendingUp, UserCheck,
  MoreHorizontal, ChevronRight, Download, Eye, Trash2, X, Plus
} from 'lucide-react';

const HrDashboard = () => {
  const navigate = useNavigate(); // 2. Initialize navigate
  const [activeTab, setActiveTab] = useState('dashboard');

  // 3. Create Logout Handler
  const handleLogout = () => {
    // You can clear local storage/session here if needed
    // localStorage.removeItem('token');
    navigate('/home'); 
  };

  const stats = [
    { label: "Active Requirements", value: "12", growth: "+2 this week", icon: <Briefcase size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Student Profiles", value: "1,458", growth: "+145 this month", icon: <Users size={20} />, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "High Matches (>80%)", value: "84", growth: "Across all roles", icon: <TrendingUp size={20} />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Candidates Selected", value: "28", growth: "Notifications sent", icon: <UserCheck size={20} />, color: "text-cyan-600", bg: "bg-cyan-50" }
  ];

  return (
    <div className="min-h-screen flex font-sans bg-white text-slate-900 relative">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col p-8 sticky top-0 h-screen z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Globe size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-900">Talent<span className="text-blue-600">Pool</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">Recruitment</div>
          <NavItem icon={<LayoutDashboard size={18} />} label="Match Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Briefcase size={18} />} label="Job Requirements" active={activeTab === 'requirements'} onClick={() => setActiveTab('requirements')} />
          <NavItem icon={<Users size={18} />} label="All Candidates" active={activeTab === 'candidates'} onClick={() => setActiveTab('candidates')} />
          
          <div className="pt-8 pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">System</div>
          <NavItem icon={<Bell size={18} />} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        {/* 4. Wire up the button to handleLogout */}
        <div className="pt-8 border-t border-slate-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-12 overflow-y-auto bg-white">
        {/* VIEW: MATCH DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in duration-500 text-left">
            <header className="flex justify-between items-end mb-12">
              <div>
                <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">Matching Engine</h1>
                <p className="text-slate-500 font-medium text-sm">Comparing student profiles against active job requirements.</p>
              </div>
              <div className="flex gap-4">
                <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all">
                  <Filter size={18} /> Filter
                </button>
                <button 
                    onClick={() => setActiveTab('new-requirement')}
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm hover:bg-black shadow-xl transition-all"
                >
                  <PlusCircle size={18} /> New Requirement
                </button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                  <div className={`p-3 rounded-xl w-fit mb-4 ${stat.bg} ${stat.color}`}>{stat.icon}</div>
                  <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</div>
                  <div className="mt-2 text-[10px] font-bold text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-md">{stat.growth}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Top Matches: Senior Frontend Engineer</h3>
                  <p className="text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">REQ-0942 • React, TypeScript, 3+ Yrs Exp.</p>
                </div>
                <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-100">
                  <TabButton label="All Matches" active />
                  <TabButton label="High Match" />
                  <TabButton label="Shortlisted" />
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                <CandidateRow name="Alex Sterling" role="B.S. Computer Science • 4 Yrs Exp" score={95} status="Available in 2wks" tags={['React', 'TypeScript', 'Node.js']} img="https://i.pravatar.cc/150?u=alexs" />
                <CandidateRow name="Priya Patel" role="M.S. Software Eng • 3 Yrs Exp" score={88} status="Available immediately" tags={['React', 'JavaScript', 'Next.js']} img="https://i.pravatar.cc/150?u=priya" />
              </div>
            </div>
          </div>
        )}

        {/* VIEW: JOB REQUIREMENTS */}
        {activeTab === 'requirements' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 text-left">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900">Job Requirements</h1>
                <p className="text-slate-500 font-medium mt-1">Manage active job postings and preferred candidate criteria.</p>
              </div>
              <div className="flex gap-4">
                 <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-bold text-sm"><Filter size={18}/> Filter</button>
                 <button onClick={() => setActiveTab('new-requirement')} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl transition-all">
                    <PlusCircle size={18} /> New Requirement
                 </button>
              </div>
            </header>

            <div className="grid grid-cols-4 gap-6 mb-12">
              <RequirementStat icon={<Briefcase />} val="12" label="Total Requirements" />
              <RequirementStat icon={<TrendingUp />} val="8" label="Active Postings" />
              <RequirementStat icon={<Users />} val="342" label="Matches Found" />
              <RequirementStat icon={<CheckCircle2 />} val="4" label="Successful Hires" />
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-900">Active Requirements</h3>
                  <div className="flex gap-2">
                    <TabButton label="Active" active />
                    <TabButton label="Drafts" />
                    <TabButton label="Closed" />
                  </div>
               </div>
               <div className="p-8 space-y-4">
                  <ActiveReqRow title="Senior Frontend Engineer" reqId="REQ-0942" matches="84" notified="12" />
                  <ActiveReqRow title="Backend Developer (Node.js)" reqId="REQ-0945" matches="32" notified="5" />
               </div>
            </div>
          </div>
        )}

        {/* VIEW: ALL CANDIDATES */}
        {activeTab === 'candidates' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500 text-left">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900">Candidate Database</h1>
                <p className="text-slate-500 font-medium mt-1">Browse, search, and manage all registered student profiles.</p>
              </div>
              <div className="flex gap-4">
                 <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="text" placeholder="Search by name, skill..." className="bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-6 outline-none w-80 focus:border-blue-300" />
                 </div>
                 <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-bold text-sm"><Filter size={18}/> Filter</button>
                 <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-xl"><Download size={18}/> Export</button>
              </div>
            </header>

            <div className="grid grid-cols-4 gap-6 mb-12">
               <CandidateStat val="1,458" label="Total Profiles" sub="+145 this month" color="blue" />
               <CandidateStat val="942" label="Active Seekers" sub="Available immediately" color="indigo" />
               <CandidateStat val="156" label="Currently In Review" sub="Pending actions" color="cyan" />
               <CandidateStat val="360" label="Placed Candidates" sub="Employed" color="emerald" />
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
              <div className="flex justify-between items-center mb-8">
                 <h3 className="text-xl font-black text-slate-900">All Registered Candidates</h3>
                 <div className="flex gap-2 bg-slate-50 p-1 rounded-2xl">
                    <TabButton label="All" active />
                    <TabButton label="Active" />
                    <TabButton label="In Review" />
                    <TabButton label="Placed" />
                 </div>
              </div>
              <div className="space-y-4">
                 <CandidateRow name="Alex Sterling" role="B.S. Computer Science" score={95} status="Active" tags={['React', 'TypeScript']} img="https://i.pravatar.cc/150?u=alexs" />
                 <CandidateRow name="Jordan Miles" role="Fullstack Developer" score={82} status="In Review" tags={['Node.js', 'MongoDB']} img="https://i.pravatar.cc/150?u=jordan" />
              </div>
            </div>
          </div>
        )}

        {/* VIEW: NEW REQUIREMENT */}
        {activeTab === 'new-requirement' && (
          <div className="animate-in zoom-in-95 duration-500 text-left max-w-5xl mx-auto">
            <header className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900">New Requirement</h1>
                <p className="text-slate-500 font-medium mt-1">Create a new job posting and define candidate criteria.</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setActiveTab('dashboard')} className="px-8 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl">Publish Requirement</button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 space-y-8 bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm">
                  <section>
                    <h3 className="text-lg font-black text-slate-900 mb-6">Basic Information</h3>
                    <div className="space-y-6">
                       <div>
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Job Title</label>
                          <input type="text" placeholder="e.g. Senior Frontend Engineer" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-400" />
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Employment Type</label>
                            <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none"><option>Select type</option><option>Full-time</option><option>Contract</option></select>
                          </div>
                          <div>
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Work Model</label>
                            <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none"><option>Select model</option><option>Remote</option><option>Hybrid</option></select>
                          </div>
                       </div>
                    </div>
                  </section>

                  <section className="pt-8 border-t border-slate-50">
                    <h3 className="text-lg font-black text-slate-900 mb-6">Candidate Criteria</h3>
                    <div className="space-y-6">
                       <div>
                          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Required Skills</label>
                          <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex flex-wrap gap-2">
                             {['React', 'TypeScript', 'Node.js'].map(skill => (
                                <span key={skill} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
                                  {skill} <X size={14} className="cursor-pointer" />
                                </span>
                             ))}
                             <input type="text" placeholder="Add a skill..." className="bg-transparent outline-none text-xs flex-1" />
                          </div>
                       </div>
                    </div>
                  </section>
               </div>

               <div className="bg-slate-50/50 border border-slate-100 p-8 rounded-[3rem]">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Recent Updates</h3>
                  <div className="space-y-10 relative">
                     <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-slate-200"></div>
                     <UpdateItem time="2 HOURS AGO" title="New Matches Found" desc="12 new candidates matched your 'Backend Developer' requirement." color="bg-blue-600" />
                     <UpdateItem time="YESTERDAY, 4:30 PM" title="Assessment Completed" desc="Sarah Jenkins completed the technical assessment for UI/UX." color="bg-emerald-500" />
                     <UpdateItem time="OCT 12, 2023" title="Candidate Shortlisted" desc="Michael Chen was moved to shortlist for Senior Frontend." color="bg-purple-600" />
                  </div>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// --- SUB-COMPONENTS REMAIN THE SAME ---
const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
    active ? 'bg-white text-blue-600 shadow-md border border-slate-100' : 'text-slate-400 hover:bg-white hover:text-slate-900'
  }`}>
    {icon} {label}
  </button>
);

const TabButton = ({ label, active = false }) => (
  <button className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
    active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
  }`}>
    {label}
  </button>
);

const CandidateStat = ({ val, label, sub, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left">
    <div className={`w-8 h-8 rounded-lg bg-${color}-50 text-${color}-600 flex items-center justify-center mb-4`}>
       {color === 'blue' ? <Users size={18}/> : <CheckCircle2 size={18}/>}
    </div>
    <div className="text-4xl font-black text-slate-900 mb-1">{val}</div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">{label}</div>
    <div className={`text-[10px] font-bold bg-${color}-50 text-${color}-600 px-3 py-1 rounded-full w-fit`}>{sub}</div>
  </div>
);

const RequirementStat = ({ icon, val, label }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left">
    <div className="p-3 bg-slate-50 rounded-xl w-fit mb-4 text-slate-400">{icon}</div>
    <div className="text-4xl font-black text-slate-900 mb-1">{val}</div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
  </div>
);

const ActiveReqRow = ({ title, reqId, matches, notified }) => (
  <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white transition-all group">
     <div className="flex-1">
        <h4 className="text-xl font-black text-slate-900">{title}</h4>
        <p className="text-xs font-bold text-slate-400 uppercase mt-1">{reqId} • Full-time • Remote</p>
        <div className="flex gap-2 mt-4">
           {['React', 'TypeScript', 'Node.js'].map(t => <span key={t} className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500">{t}</span>)}
        </div>
     </div>
     <div className="flex items-center gap-12 px-12">
        <div className="text-center">
           <div className="text-2xl font-black text-slate-900">{matches}</div>
           <div className="text-[10px] font-bold text-slate-400 uppercase">Matches</div>
        </div>
        <div className="text-center">
           <div className="text-2xl font-black text-slate-900">{notified}</div>
           <div className="text-[10px] font-bold text-slate-400 uppercase">Notified</div>
        </div>
     </div>
     <div className="flex gap-2">
        <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all"><MoreHorizontal size={20}/></button>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-50">View Matches</button>
     </div>
  </div>
);

const UpdateItem = ({ time, title, desc, color }) => (
  <div className="relative pl-10">
    <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${color}`}></div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{time}</div>
    <h4 className="text-sm font-black text-slate-900">{title}</h4>
    <p className="text-xs text-slate-500 font-medium leading-relaxed mt-1">{desc}</p>
  </div>
);

const CandidateRow = ({ name, role, score, status, tags, img }) => (
  <div className="p-8 flex items-center gap-6 hover:bg-slate-50/50 transition-all group">
    <img src={img} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm" alt="" />
    <div className="flex-1">
      <h4 className="font-black text-lg text-slate-900">{name}</h4>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">{role}</p>
    </div>
    <div className="flex gap-2">
      {tags.map(t => <span key={t} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500">{t}</span>)}
    </div>
    <div className="px-12">
      <div className="flex items-center gap-3 mb-2"><span className="text-[10px] font-black text-slate-400">Match</span><span className="text-xs font-black text-emerald-600">{score}%</span></div>
      <div className="w-40 bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full" style={{ width: `${score}%` }}></div></div>
    </div>
    <div className="w-32"><span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600">{status}</span></div>
    <div className="flex gap-2">
      <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400"><MoreHorizontal size={18} /></button>
      <button className="bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">View Profile</button>
    </div>
  </div>
);

export default HrDashboard;