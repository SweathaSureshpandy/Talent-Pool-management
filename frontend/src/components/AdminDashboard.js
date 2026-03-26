import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Briefcase, Users, Bell, 
  Settings, Search, Plus, Filter, ExternalLink,
  ChevronRight, CheckCircle2, Globe
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState([
    { label: "Active Requirements", count: "0", trend: "Live", icon: <Briefcase size={20}/> },
    { label: "Total Student Profiles", count: "0", trend: "Live", icon: <Users size={20}/> },
    { label: "High Matches (>80%)", count: "0", trend: "Live", icon: <CheckCircle2 size={20}/> },
    { label: "Candidates Selected", count: "0", trend: "Live", icon: <CheckCircle2 size={20}/> },
  ]);

  const [candidates, setCandidates] = useState([]);
  const [notificationsData, setNotificationsData] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/stats")
      .then(res => res.json())
      .then(data => {
        setStats([
          { label: "Active Requirements", count: data.activeJobs || 0, trend: "Live", icon: <Briefcase size={20}/> },
          { label: "Total Student Profiles", count: data.totalStudents || 0, trend: "Live", icon: <Users size={20}/> },
          { label: "High Matches (>80%)", count: "84", trend: "Calculated", icon: <CheckCircle2 size={20}/> },
          { label: "Candidates Selected", count: data.totalApplications || 0, trend: "Live", icon: <CheckCircle2 size={20}/> },
        ]);
      })
      .catch(err => console.error(err));

    fetch("http://localhost:5000/api/admin/candidates")
      .then(res => res.json())
      .then(data => setCandidates(data))
      .catch(err => console.error(err));

    fetch(`http://localhost:5000/api/notifications/${user.user_id}`)
      .then(res => res.json())
      .then(data => setNotificationsData(data))
      .catch(err => console.error(err));
  }, [user.user_id]);

  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-700">
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col sticky h-screen top-0 z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white"><Globe size={24} /></div>
          <span className="font-bold text-xl tracking-tight text-slate-900">TalentPool</span>
        </div>
        <nav className="flex-1 px-4 space-y-1 mt-4">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">Recruitment</p>
          <SidebarLink icon={<LayoutDashboard size={18}/>} label="Match Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarLink icon={<Briefcase size={18}/>} label="Job Requirements" active={activeTab === 'requirements'} onClick={() => setActiveTab('requirements')} />
          <SidebarLink icon={<Users size={18}/>} label="All Candidates" active={activeTab === 'candidates'} onClick={() => setActiveTab('candidates')} />
          <div className="pt-8">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-2">System</p>
            <SidebarLink icon={<Bell size={18}/>} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
            <SidebarLink icon={<Settings size={18}/>} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </div>
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div className="relative w-1/3 text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none" />
          </div>
          <div className="flex items-center gap-6">
            <Bell className="text-slate-400" size={20} />
            <div className="flex items-center gap-3 border-l pl-6 border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">Admin</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase">System Root</p>
              </div>
              <img src="https://i.pravatar.cc/150?u=admin" className="w-10 h-10 rounded-full" alt="" />
            </div>
          </div>
        </header>

        {(activeTab === 'dashboard' || activeTab === 'candidates') && (
          <div className="animate-in fade-in duration-500">
            <div className="grid grid-cols-4 gap-6 mb-10">
              {stats.map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left">
                  <div className="text-blue-600 mb-4 bg-blue-50 w-fit p-2 rounded-lg">{s.icon}</div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">{s.count}</h3>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden text-left">
              <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">{activeTab === 'dashboard' ? 'Match Engine' : 'Student Directory'}</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {candidates.map((c, i) => (
                  <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50">
                    <div className="flex items-center gap-4">
                      <img src={`https://i.pravatar.cc/150?u=${c.user?.user_name}`} className="w-12 h-12 rounded-full border border-slate-100" />
                      <div>
                        <h4 className="font-bold text-slate-900">{c.user?.user_name}</h4>
                        <p className="text-xs text-slate-400 uppercase">{c.degree}</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase">{c.status}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       {c.skills?.map(sk => <span key={sk.skill_id} className="px-2 py-1 bg-slate-100 text-[10px] font-bold rounded">{sk.skill_name}</span>)}
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">View Profile</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && <NotificationsView notifications={notificationsData} />}
      </main>
    </div>
  );
};

const SidebarLink = ({ icon, label, active, onClick }) => (
  <div onClick={onClick} className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all group ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
    {active && <ChevronRight size={14} />}
  </div>
);

const NotificationsView = ({ notifications }) => (
  <div className="animate-in fade-in duration-500 text-left">
    <header className="mb-10">
      <h1 className="text-4xl font-black tracking-tight text-slate-900">Notifications</h1>
      <p className="text-slate-500 font-medium">System-wide alerts and updates.</p>
    </header>
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
      <div className="divide-y divide-slate-50">
        {notifications.length > 0 ? (
          notifications.map((n, i) => (
            <div key={i} className="p-8 hover:bg-slate-50/50 transition-all flex items-start gap-6">
               <div className="p-3 rounded-2xl bg-blue-600 text-white">
                 <Bell size={20} />
               </div>
               <div className="flex-1">
                 <p className="text-base font-bold text-slate-900">{n.message}</p>
                 <p className="text-xs text-slate-400 font-bold uppercase mt-2">{new Date(n.created_at).toLocaleString()}</p>
               </div>
            </div>
          ))
        ) : (
          <div className="p-20 text-center">
             <Bell size={48} className="text-slate-200 mx-auto mb-4" />
             <p className="text-slate-400 font-bold italic">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default AdminDashboard;