import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import {
  Globe, LayoutDashboard, Users, Briefcase,
  Settings, Bell, LogOut, Search, Filter,
  PlusCircle, CheckCircle2, TrendingUp, UserCheck,
  MoreHorizontal, ChevronRight, Download, Eye, Trash2, X, Plus, MapPin
} from 'lucide-react';

const HrDashboard = ({ user: propUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(propUser || JSON.parse(localStorage.getItem("user") || "{}"));
  const [activeTab, setActiveTab] = useState('dashboard');

  React.useEffect(() => {
    if (!user || Object.keys(user).length === 0) return;

    if (!user.user_id || user.role !== 'hr') {
      navigate('/home');
    }
  }, [user, navigate]);
  const [requirements, setRequirements] = useState([]);
  const [newReq, setNewReq] = useState({ title: "", job_type: "Full-time", work_model: "Remote", required_skills: [] });

  const [hrStats, setHrStats] = useState({ activeJobs: 0, totalStudents: 0, totalApplications: 0, highMatches: 0, activeSeekers: 0, inReview: 0, placed: 0 });
  const [candidates, setCandidates] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [notificationsData, setNotificationsData] = useState([]);
  const [reqFilter, setReqFilter] = useState("Active");
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  React.useEffect(() => {
    fetch(`http://localhost:5000/api/jobs`)
      .then(res => res.json())
      .then(data => setRequirements(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

    fetch(`http://localhost:5000/api/hr/stats/${user.hr_id}`)
      .then(res => res.json())
      .then(data => setHrStats(data || {}))
      .catch(err => console.error(err));

    fetch("http://localhost:5000/api/admin/candidates")
      .then(res => res.json())
      .then(data => setCandidates(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

    fetch(`http://localhost:5000/api/notifications/${user.user_id}`)
      .then(res => res.json())
      .then(data => setNotificationsData(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

    fetch("http://localhost:5000/api/skills")
      .then(res => res.json())
      .then(data => setAllSkills(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, [user.hr_id, user.user_id]);

  const handleShortlist = async (studentId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/profile/student/${studentId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Shortlisted" })
      });
      if (res.ok) {
        alert("Candidate Shortlisted for global pool! 🌟");
        setSelectedCandidate(null);
        // Refresh candidates
        fetch("http://localhost:5000/api/admin/candidates")
          .then(res => res.json())
          .then(data => setCandidates(Array.isArray(data) ? data : []));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateRequirement = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newReq, hr_id: user.hr_id })
      });
      if (res.ok) {
        alert("Requirement created successfully!");
        setActiveTab('requirements');
        // Refresh requirements
        fetch(`http://localhost:5000/api/jobs`)
          .then(res => res.json())
          .then(data => setRequirements(Array.isArray(data) ? data : []));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex font-sans bg-white text-slate-900 relative">

      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col p-8 sticky top-0 h-screen z-20 text-left">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">T</div>
          <span className="text-xl font-black tracking-tight text-slate-900">TalentPool<span className="text-blue-600">.</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={18} />} label="Match Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <NavItem icon={<Briefcase size={18} />} label="Job Requirements" active={activeTab === 'requirements'} onClick={() => setActiveTab('requirements')} />
          <NavItem icon={<Users size={18} />} label="All Candidates" active={activeTab === 'candidates'} onClick={() => setActiveTab('candidates')} />

          <div className="pt-8 pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">System</div>
          <NavItem icon={<Bell size={18} />} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

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

            <div className="grid grid-cols-4 gap-8 mb-16">
              <CandidateStat val={hrStats.totalApplications} label="Matches Processed" sub="In the last 24h" color="blue" />
              <CandidateStat val={hrStats.highMatches} label="High Potential" sub="Matches above 85%" color="indigo" />
              <CandidateStat val={hrStats.totalStudents} label="Pool Coverage" sub="Total active students" color="cyan" />
              <CandidateStat val={hrStats.placed} label="Successful Placements" sub="Role assigned" color="emerald" />
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-10 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900">Recommended Matches</h3>
                <div className="flex gap-2 bg-white p-1 rounded-2xl border border-slate-100">
                  <TabButton label="All Matches" active />
                  <TabButton label="High Match" />
                  <TabButton label="Shortlisted" />
                </div>
              </div>
              <div className="divide-y divide-slate-50">
                {Array.isArray(candidates) && candidates.slice(0, 5).map((person, i) => (
                  <CandidateRow
                    key={i}
                    name={person.user?.user_name}
                    role={person.degree}
                    score={85}
                    status="Available"
                    tags={person.skills?.map(s => s.skill_name) || []}
                    img={`https://i.pravatar.cc/150?u=${person.user?.user_name}`}
                    onViewProfile={() => setSelectedCandidate(person)}
                  />
                ))}
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
                <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-bold text-sm"><Filter size={18} /> Filter</button>
                <button onClick={() => setActiveTab('new-requirement')} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl transition-all">
                  <PlusCircle size={18} /> New Requirement
                </button>
              </div>
            </header>

            <div className="grid grid-cols-4 gap-6 mb-12">
              <RequirementStat icon={<Briefcase />} val={hrStats.totalRequirements || 0} label="Total Requirements" />
              <RequirementStat icon={<TrendingUp />} val={hrStats.activePostings || 0} label="Active Postings" />
              <RequirementStat icon={<Users />} val={hrStats.matchesFound || 0} label="Matches Found" />
              <RequirementStat icon={<CheckCircle2 />} val={hrStats.successfulHires || 0} label="Successful Hires" />
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-900">Active Requirements</h3>
                <div className="flex gap-2">
                  <TabButton label="Active" active={reqFilter === "Active"} onClick={() => setReqFilter("Active")} />
                  <TabButton label="Drafts" active={reqFilter === "Drafts"} onClick={() => setReqFilter("Drafts")} />
                  <TabButton label="Closed" active={reqFilter === "Closed"} onClick={() => setReqFilter("Closed")} />
                </div>
              </div>
              <div className="p-8 space-y-4">
                {requirements.length > 0 ? (
                  requirements.filter(r => reqFilter === "Active" ? true : false).map(req => (
                    <ActiveReqRow
                      key={req.job_id}
                      title={req.title}
                      reqId={`REQ-${req.job_id}`}
                      matches={req.applications?.length || 0}
                      notified={req.applications?.length ? Math.floor(req.applications.length / 2) : 0}
                      tags={req.skills?.map(s => s.skill_name) || []}
                      onViewMatches={() => setActiveTab('candidates')}
                    />
                  ))
                ) : (
                  <p>No active requirements.</p>
                )}
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
                <button className="flex items-center gap-2 bg-white border border-slate-200 px-5 py-3 rounded-2xl font-bold text-sm"><Filter size={18} /> Filter</button>
                <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-3 rounded-2xl font-bold text-sm shadow-xl"><Download size={18} /> Export</button>
              </div>
            </header>

            <div className="grid grid-cols-4 gap-6 mb-12">
              <CandidateStat val={hrStats.totalStudents} label="Total Profiles" sub="+145 this month" color="blue" />
              <CandidateStat val={hrStats.activeSeekers} label="Active Seekers" sub="Available immediately" color="indigo" />
              <CandidateStat val={hrStats.inReview} label="Currently In Review" sub="Pending actions" color="cyan" />
              <CandidateStat val={hrStats.placed} label="Placed Candidates" sub="Employed" color="emerald" />
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
                {Array.isArray(candidates) && candidates.map((c, i) => (
                  <CandidateRow
                    key={i}
                    name={c.user?.user_name}
                    role={c.degree}
                    score={85}
                    status="Active"
                    tags={c.skills?.map(s => s.skill_name) || []}
                    img={`https://i.pravatar.cc/150?u=${c.user?.user_name}`}
                    onViewProfile={() => setSelectedCandidate(c)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: NEW REQUIREMENT */}
        {activeTab === 'new-requirement' && (
          <NewRequirementView
            newReq={newReq}
            setNewReq={setNewReq}
            allSkills={allSkills}
            handleCreateRequirement={handleCreateRequirement}
            setActiveTab={setActiveTab}
          />
        )}

        {/* VIEW: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <NotificationsView notifications={notificationsData} />
        )}
      </main>

      {/* Profile Modal */}
      {selectedCandidate && (
        <CandidateProfileModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onShortlist={() => handleShortlist(selectedCandidate.student_id)}
        />
      )}
    </div>
  );
};

const NewRequirementView = ({ newReq, setNewReq, allSkills, handleCreateRequirement, setActiveTab }) => {
  const [skillInput, setSkillInput] = React.useState("");

  const addSkill = (s) => {
    if (s && !newReq.required_skills.includes(s)) {
      setNewReq({ ...newReq, required_skills: [...newReq.required_skills, s] });
      setSkillInput("");
    }
  };

  const removeSkill = (s) => {
    setNewReq({ ...newReq, required_skills: newReq.required_skills.filter(x => x !== s) });
  };

  return (
    <div className="animate-in zoom-in-95 duration-500 text-left max-w-5xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">New Requirement</h1>
          <p className="text-slate-500 font-medium mt-1">Create a new job posting and define candidate criteria.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setActiveTab('dashboard')} className="px-8 py-3 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
          <button
            onClick={handleCreateRequirement}
            className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl"
          >
            Publish Requirement
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 bg-white border border-slate-100 p-10 rounded-[3rem] shadow-sm">
          <section>
            <h3 className="text-lg font-black text-slate-900 mb-6">Basic Information</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Frontend Engineer"
                  value={newReq.title}
                  onChange={(e) => setNewReq({ ...newReq, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-blue-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Employment Type</label>
                  <select
                    value={newReq.job_type}
                    onChange={(e) => setNewReq({ ...newReq, job_type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none"
                  >
                    <option>Full-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Work Model</label>
                  <select
                    value={newReq.work_model}
                    onChange={(e) => setNewReq({ ...newReq, work_model: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none"
                  >
                    <option>Remote</option>
                    <option>Hybrid</option>
                    <option>On-site</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className="pt-8 border-t border-slate-50">
            <h3 className="text-lg font-black text-slate-900 mb-6">Candidate Criteria</h3>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 block">Required Skills</label>
                <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 flex flex-wrap gap-2 mb-4">
                  {newReq.required_skills.map(skill => (
                    <span key={skill} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-2">
                      {skill} <X size={14} className="cursor-pointer" onClick={() => removeSkill(skill)} />
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Type and press enter..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill(skillInput)}
                    className="bg-transparent outline-none text-xs flex-1"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {allSkills.filter(s => !newReq.required_skills.includes(s.skill_name)).slice(0, 10).map(s => (
                    <button
                      key={s.skill_id}
                      onClick={() => addSkill(s.skill_name)}
                      className="text-[10px] font-bold px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:text-blue-600 transition-all"
                    >
                      + {s.skill_name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="bg-slate-50/50 border border-slate-200 p-8 rounded-[3rem]">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Jobs Type</span>
              <span className="text-xs font-black text-slate-900">{newReq.job_type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Work Model</span>
              <span className="text-xs font-black text-slate-900">{newReq.work_model}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase">Skills</span>
              <span className="text-xs font-black text-slate-900">{newReq.required_skills.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NotificationsView = ({ notifications }) => (
  <div className="animate-in fade-in duration-500 text-left">
    <header className="mb-10">
      <h1 className="text-4xl font-black tracking-tight text-slate-900">Notifications</h1>
      <p className="text-slate-500 font-medium">Stay updated with the latest system activities.</p>
    </header>
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
      <div className="divide-y divide-slate-50">
        {notifications.length > 0 ? (
          notifications.map((n, i) => (
            <div key={i} className={`p-8 hover:bg-slate-50/50 transition-all flex items-start gap-6 ${!n.is_read ? 'bg-blue-50/30' : ''}`}>
              <div className={`p-3 rounded-2xl ${!n.is_read ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                <Bell size={20} />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-slate-900">{n.message}</p>
                <p className="text-xs text-slate-400 font-bold uppercase mt-2">{new Date(n.created_at).toLocaleString()}</p>
              </div>
              {!n.is_read && <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>}
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

// --- SUB-COMPONENTS REMAIN THE SAME ---
const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${active ? 'bg-white text-blue-600 shadow-md border border-slate-100' : 'text-slate-400 hover:bg-white hover:text-slate-900'
    }`}>
    {icon} {label}
  </button>
);

const TabButton = ({ label, active = false, onClick }) => (
  <button onClick={onClick} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
    }`}>
    {label}
  </button>
);

const CandidateStat = ({ val, label, sub, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left">
    <div className={`w-8 h-8 rounded-lg bg-${color}-50 text-${color}-600 flex items-center justify-center mb-4`}>
      {color === 'blue' ? <Users size={18} /> : <CheckCircle2 size={18} />}
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

const ActiveReqRow = ({ title, reqId, matches, notified, tags, onViewMatches }) => (
  <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white transition-all group">
    <div className="flex-1">
      <h4 className="text-xl font-black text-slate-900">{title}</h4>
      <p className="text-xs font-bold text-slate-400 uppercase mt-1">{reqId} • Full-time • Remote</p>
      <div className="flex gap-2 mt-4">
        {tags && tags.length > 0 ? (
          tags.slice(0, 3).map(t => <span key={t} className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-slate-500">{t}</span>)
        ) : (
          <span className="text-[10px] text-slate-400 italic">No specific skills listed</span>
        )}
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
    <div className="flex gap-2 text-left">
      <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-blue-600 transition-all"><MoreHorizontal size={20} /></button>
      <button
        onClick={onViewMatches}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black uppercase shadow-lg shadow-blue-50"
      >
        View Matches
      </button>
    </div>
  </div>
);


const CandidateRow = ({ name, role, score, status, tags, img, onViewProfile }) => (
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
    <div className="flex gap-2 text-left">
      <button className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400"><MoreHorizontal size={18} /></button>
      <button
        onClick={onViewProfile}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
      >
        View Profile
      </button>
    </div>
  </div>
);

const CandidateProfileModal = ({ candidate, onClose, onShortlist }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
      <div className="p-12 relative">
        <button onClick={onClose} className="absolute right-10 top-10 p-2 text-slate-400 hover:text-slate-900 transition-all"><X size={24} /></button>

        <div className="flex items-center gap-8 mb-10">
          <img src={`https://i.pravatar.cc/150?u=${candidate.user?.user_name}`} className="w-24 h-24 rounded-3xl object-cover border-4 border-slate-100 shadow-md" alt="" />
          <div className="text-left">
            <h2 className="text-3xl font-black text-slate-950 mb-2">{candidate.user?.user_name}</h2>
            <div className="flex gap-4">
              <span className="flex items-center gap-2 text-slate-500 font-bold text-xs"><MapPin size={14} /> Remote</span>
              <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{candidate.status || "Active"}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-10">
          <div className="text-left">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 ml-2">Education</p>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h4 className="font-black text-slate-900 mb-1">{candidate.degree}</h4>
              <p className="text-slate-500 font-medium text-xs">{candidate.university}</p>
            </div>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 ml-2">Contact Details</p>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <h4 className="font-black text-slate-900 mb-1">{candidate.user?.email}</h4>
              <p className="text-slate-500 font-medium text-xs">Verified Student Account</p>
            </div>
          </div>
        </div>

        <div className="mb-10 text-left">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 ml-2">Technical Skills</p>
          <div className="flex flex-wrap gap-2">
            {candidate.skills?.map(s => (
              <span key={s.skill_id} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[10px] font-black text-slate-700 shadow-sm">{s.skill_name}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-8 border-t border-slate-50">
          <a
            href={candidate.resume ? `http://localhost:5000/uploads/${candidate.resume}` : "#"}
            target="_blank"
            rel="noreferrer"
            className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-sm text-center shadow-xl hover:bg-black transition-all"
          >
            Download Resume
          </a>
          <button 
            onClick={onShortlist}
            className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
          >
            Shortlist Candidate
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default HrDashboard;