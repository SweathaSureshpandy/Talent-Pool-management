import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe, LayoutDashboard, Users, Briefcase,
  Settings, Bell, LogOut, Search, Filter,
  PlusCircle, CheckCircle2, TrendingUp, UserCheck,
  MoreHorizontal, ChevronRight, Download, Eye, Trash2, X, Plus, MapPin,
  User, Shield, Building2, CreditCard, Mail, Phone, Camera,
  GraduationCap, FileText, ExternalLink, ArrowLeft
} from 'lucide-react';

const HrDashboard = ({ user: propUser }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(propUser || JSON.parse(localStorage.getItem("user") || "{}"));
  const [activeTab, setActiveTab] = useState('dashboard');

  // --- Auth Guard ---
  useEffect(() => {
    if (!user || Object.keys(user).length === 0) return;
    if (!user.user_id || user.role !== 'hr') {
      navigate('/home');
    }
  }, [user, navigate]);

  // --- State Management ---
  const [requirements, setRequirements] = useState([]);
  const [newReq, setNewReq] = useState({ title: "", job_type: "Full-time", work_model: "Remote", required_skills: [] });
  const [hrStats, setHrStats] = useState({ activeJobs: 0, totalStudents: 0, totalApplications: 0, highMatches: 0, activeSeekers: 0, inReview: 0, placed: 0 });
  const [candidates, setCandidates] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [notificationsData, setNotificationsData] = useState([]);
  const [reqFilter, setReqFilter] = useState("Active");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  
  // NEW: State for drill-down matches
  const [viewingMatchesFor, setViewingMatchesFor] = useState(null);

  // --- API Fetching ---
  useEffect(() => {
    const hrId = user.hr_id;
    const userId = user.user_id;

    fetch(`http://localhost:5000/api/jobs`)
      .then(res => res.json())
      .then(data => setRequirements(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

    fetch(`http://localhost:5000/api/hr/stats/${hrId}`)
      .then(res => res.json())
      .then(data => setHrStats(data || {}))
      .catch(err => console.error(err));

    fetch("http://localhost:5000/api/admin/candidates")
      .then(res => res.json())
      .then(data => setCandidates(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

    fetch(`http://localhost:5000/api/notifications/${userId}`)
      .then(res => res.json())
      .then(data => setNotificationsData(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));

    fetch("http://localhost:5000/api/skills")
      .then(res => res.json())
      .then(data => setAllSkills(Array.isArray(data) ? data : []))
      .catch(err => console.error(err));
  }, [user.hr_id, user.user_id]);

  const handleLogout = () => navigate('/home');

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="min-h-screen flex font-sans bg-white text-slate-900 relative">
      
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] animate-in slide-in-from-top-8 duration-500">
          <div className="bg-slate-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-slate-700">
            <div className="bg-emerald-500 p-1 rounded-full">
              <CheckCircle2 size={18} className="text-white" />
            </div>
            <span className="font-black text-xs uppercase tracking-widest">{toastMsg}</span>
          </div>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-slate-50 border-r border-slate-200 flex flex-col p-8 sticky top-0 h-screen z-20 text-left">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">T</div>
          <span className="text-xl font-black tracking-tight text-slate-900">TalentPool<span className="text-blue-600">.</span></span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutDashboard size={18} />} label="Match Dashboard" active={activeTab === 'dashboard'} onClick={() => {setActiveTab('dashboard'); setViewingMatchesFor(null);}} />
          <NavItem icon={<Briefcase size={18} />} label="Job Requirements" active={activeTab === 'requirements'} onClick={() => {setActiveTab('requirements'); setViewingMatchesFor(null);}} />
          <NavItem icon={<Users size={18} />} label="All Candidates" active={activeTab === 'candidates'} onClick={() => {setActiveTab('candidates'); setViewingMatchesFor(null);}} />
          
          <div className="pt-8 pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-4">System</div>
          <NavItem icon={<Bell size={18} />} label="Notifications" active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} />
          <NavItem icon={<Settings size={18} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="pt-8 border-t border-slate-200">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 p-12 overflow-y-auto bg-white">
        {activeTab === 'dashboard' && (
          <DashboardView hrStats={hrStats} candidates={candidates} setSelectedCandidate={setSelectedCandidate} />
        )}

        {activeTab === 'requirements' && (
          <RequirementsView 
            requirements={requirements} 
            hrStats={hrStats} 
            setActiveTab={setActiveTab}
            viewingMatchesFor={viewingMatchesFor}
            setViewingMatchesFor={setViewingMatchesFor}
            candidates={candidates}
            setSelectedCandidate={setSelectedCandidate}
          />
        )}

        {activeTab === 'candidates' && (
          <CandidatesView candidates={candidates} setSelectedCandidate={setSelectedCandidate} />
        )}

        {activeTab === 'settings' && (
          <SettingsView user={user} triggerToast={triggerToast} />
        )}

        {activeTab === 'notifications' && (
          <NotificationsView notifications={notificationsData} />
        )}

        {activeTab === 'new-requirement' && (
          <NewRequirementView 
            newReq={newReq} 
            setNewReq={setNewReq} 
            allSkills={allSkills} 
            setActiveTab={setActiveTab} 
          />
        )}
      </main>

      {/* Profile Modal */}
      {selectedCandidate && (
        <CandidateProfileModal 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)} 
          onShortlist={() => {
            triggerToast(`${selectedCandidate.user?.user_name} Shortlisted!`);
            setSelectedCandidate(null);
          }}
        />
      )}
    </div>
  );
};

// --- REQ VIEW (UPDATED FOR MATCHES) ---
const RequirementsView = ({ requirements, hrStats, setActiveTab, viewingMatchesFor, setViewingMatchesFor, candidates, setSelectedCandidate }) => (
  <div className="animate-in slide-in-from-bottom-4 duration-500 text-left">
    <header className="flex justify-between items-center mb-10">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900">
          {viewingMatchesFor ? `Matches for ${viewingMatchesFor.title}` : 'Job Requirements'}
        </h1>
        {viewingMatchesFor && (
           <button onClick={() => setViewingMatchesFor(null)} className="mt-2 flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest hover:text-blue-700">
             <ArrowLeft size={14}/> Back to All Requirements
           </button>
        )}
      </div>
      {!viewingMatchesFor && (
        <button onClick={() => setActiveTab('new-requirement')} className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl flex items-center gap-2">
          <PlusCircle size={18} /> New Requirement
        </button>
      )}
    </header>

    {!viewingMatchesFor ? (
      <>
        <div className="grid grid-cols-4 gap-6 mb-12">
          <StatCard val={hrStats.activeJobs || 0} label="Active Postings" color="blue" />
          <StatCard val={hrStats.highMatches || 0} label="Top Tier Candidates" color="indigo" />
        </div>
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
          {requirements.map((req) => (
            <ActiveReqRow key={req.job_id} req={req} onViewMatches={() => setViewingMatchesFor(req)} />
          ))}
        </div>
      </>
    ) : (
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {candidates.map((c, i) => (
            <CandidateMatchRow key={i} person={c} onViewProfile={() => setSelectedCandidate(c)} />
          ))}
        </div>
      </div>
    )}
  </div>
);

// --- NEW COMPONENT: CANDIDATE ROW WITH PERCENTAGE ---
const CandidateMatchRow = ({ person, onViewProfile }) => {
  const matchScore = Math.floor(Math.random() * (98 - 75 + 1)) + 75; // Simulated match score
  
  return (
    <div className="p-8 flex items-center gap-6 hover:bg-slate-50/50 transition-all text-left">
      <img src={`https://i.pravatar.cc/150?u=${person.user?.user_name}`} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100" alt="" />
      <div className="flex-1">
        <h4 className="font-black text-lg text-slate-900">{person.user?.user_name}</h4>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{person.degree}</p>
      </div>
      
      <div className="flex items-center gap-6 mr-4">
        <div className="text-right">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Compatibility</span>
          <span className={`text-xl font-black ${matchScore > 90 ? 'text-emerald-500' : 'text-blue-600'}`}>{matchScore}%</span>
        </div>
        <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={`h-full transition-all duration-1000 ${matchScore > 90 ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${matchScore}%` }} />
        </div>
      </div>

      <button onClick={onViewProfile} className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-black transition-all">View Profile</button>
    </div>
  );
};

const ActiveReqRow = ({ req, onViewMatches }) => (
  <div className="flex items-center justify-between p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 hover:bg-white mb-4 text-left group transition-all">
    <div>
      <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{req.title}</h4>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">REQ-{req.job_id} • {req.job_type || 'Full-time'}</p>
    </div>
    <button onClick={onViewMatches} className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-50 hover:bg-blue-700 transition-all active:scale-95">
      View Matches
    </button>
  </div>
);

// --- REST OF COMPONENTS (PRESERVED) ---

const DashboardView = ({ hrStats, candidates, setSelectedCandidate }) => (
  <div className="animate-in fade-in duration-500 text-left">
    <header className="flex justify-between items-end mb-12">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-900">Matching Engine</h1>
        <p className="text-slate-500 font-medium text-sm">Comparing student profiles against active requirements.</p>
      </div>
    </header>
    <div className="grid grid-cols-4 gap-8 mb-16">
      <StatCard val={hrStats.totalApplications} label="Matches Processed" color="blue" />
      <StatCard val={hrStats.highMatches} label="High Potential" color="indigo" />
      <StatCard val={hrStats.totalStudents} label="Pool Coverage" color="cyan" />
      <StatCard val={hrStats.placed} label="Successful Placements" color="emerald" />
    </div>
    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-10 border-b border-slate-50 bg-slate-50/30">
        <h3 className="text-2xl font-black text-slate-900">Recommended Matches</h3>
      </div>
      <div className="divide-y divide-slate-50">
        {candidates.slice(0, 5).map((person, i) => (
          <CandidateRow key={i} person={person} onViewProfile={() => setSelectedCandidate(person)} />
        ))}
      </div>
    </div>
  </div>
);

const CandidatesView = ({ candidates, setSelectedCandidate }) => (
  <div className="animate-in fade-in duration-500 text-left">
    <header className="mb-10">
      <h1 className="text-4xl font-black tracking-tight text-slate-900">Candidate Database</h1>
      <p className="text-slate-500 font-medium">Browse and search all registered student profiles.</p>
    </header>
    <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="divide-y divide-slate-50">
        {candidates.map((c, i) => (
          <CandidateRow key={i} person={c} onViewProfile={() => setSelectedCandidate(c)} />
        ))}
      </div>
    </div>
  </div>
);

const SettingsView = ({ user, triggerToast }) => {
  const [activeSubTab, setActiveSubTab] = useState('account');
  return (
    <div className="animate-in slide-in-from-bottom-4 duration-700 text-left relative">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tight text-slate-900">Settings</h1>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1 space-y-2">
          <SettingSubNav icon={<User size={18} />} label="Account" active={activeSubTab === 'account'} onClick={() => setActiveSubTab('account')} />
          <SettingSubNav icon={<Building2 size={18} />} label="Company" active={activeSubTab === 'company'} onClick={() => setActiveSubTab('company')} />
        </div>
        <div className="lg:col-span-3 bg-white border border-slate-100 rounded-[3rem] p-12 shadow-sm">
           <div className="grid grid-cols-2 gap-8 mb-10">
             <InputGroup label="Full Name" value={user.user_name} />
             <InputGroup label="Email Address" value={user.email} icon={<Mail size={16} />} />
           </div>
           <button onClick={() => triggerToast("Profile Updated!")} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

const NotificationsView = ({ notifications }) => (
  <div className="animate-in fade-in duration-500 text-left">
    <header className="mb-10"><h1 className="text-4xl font-black tracking-tight text-slate-900">Notifications</h1></header>
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      {notifications.length > 0 ? notifications.map((n, i) => (
        <div key={i} className="p-8 border-b border-slate-50 flex items-center gap-6">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Bell size={20} /></div>
          <div><p className="font-bold text-slate-900">{n.message}</p></div>
        </div>
      )) : <div className="p-20 text-center text-slate-400 italic">No notifications.</div>}
    </div>
  </div>
);

const NewRequirementView = ({ newReq, setNewReq, allSkills, setActiveTab }) => (
  <div className="animate-in zoom-in-95 duration-500 text-left">
    <header className="flex justify-between items-center mb-10">
      <h1 className="text-4xl font-black tracking-tight text-slate-900">New Requirement</h1>
      <button onClick={() => setActiveTab('requirements')} className="text-slate-400 font-bold hover:text-slate-900">Cancel</button>
    </header>
    <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm max-w-3xl">
      <InputGroup label="Job Title" placeholder="e.g. Frontend Engineer" />
      <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest mt-8 shadow-xl">Publish Posting</button>
    </div>
  </div>
);

// --- ATOMS ---
const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${active ? 'bg-white text-blue-600 shadow-md border border-slate-100' : 'text-slate-400 hover:bg-white hover:text-slate-900'}`}>
    {icon} {label}
  </button>
);
const SettingSubNav = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${active ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}>
    {icon} {label}
  </button>
);
const StatCard = ({ val, label, color }) => (
  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left">
    <div className="text-4xl font-black text-slate-900 mb-1">{val}</div>
    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
    <div className={`mt-3 h-1 w-12 rounded-full bg-${color}-500`} />
  </div>
);
const InputGroup = ({ label, value, placeholder, icon }) => (
  <div className="space-y-2 text-left">
    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300">{icon}</div>}
      <input type="text" defaultValue={value} placeholder={placeholder} className={`w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 outline-none focus:border-blue-300 transition-all ${icon ? 'pl-12 pr-6' : 'px-6'}`} />
    </div>
  </div>
);
const CandidateRow = ({ person, onViewProfile }) => (
  <div className="p-8 flex items-center gap-6 hover:bg-slate-50/50 transition-all text-left">
    <img src={`https://i.pravatar.cc/150?u=${person.user?.user_name}`} className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm" alt="" />
    <div className="flex-1">
      <h4 className="font-black text-lg text-slate-900">{person.user?.user_name}</h4>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{person.degree}</p>
    </div>
    <button onClick={onViewProfile} className="bg-slate-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">View Profile</button>
  </div>
);

// --- UPDATED CANDIDATE PROFILE MODAL ---
const CandidateProfileModal = ({ candidate, onClose, onShortlist }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
    <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col relative text-left animate-in zoom-in-95 duration-300">
      
      {/* Modal Header */}
      <div className="p-10 bg-slate-50 border-b border-slate-100 flex items-start justify-between">
        <div className="flex gap-8 items-center">
          <div className="relative">
             <img 
               src={`https://i.pravatar.cc/150?u=${candidate.user?.user_name}`} 
               className="w-32 h-32 rounded-[2.5rem] border-4 border-white shadow-xl object-cover" 
               alt="" 
             />
             <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl border-4 border-white">
               <CheckCircle2 size={16}/>
             </div>
          </div>
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">{candidate.user?.user_name}</h2>
            <p className="text-blue-600 font-bold text-lg">{candidate.degree || 'Engineering Candidate'}</p>
            <div className="flex gap-6 mt-4">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <MapPin size={14} className="text-blue-500"/> Remote / On-site
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <Mail size={14} className="text-blue-500"/> {candidate.user?.email || 'N/A'}
                </div>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="p-4 bg-white rounded-2xl text-slate-400 hover:text-slate-900 shadow-sm border border-slate-100 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Profile Body */}
      <div className="flex-1 overflow-y-auto p-12 grid grid-cols-3 gap-12">
        <div className="col-span-2 space-y-12">
          <section>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6">Professional Summary</h4>
            <p className="text-slate-600 leading-relaxed font-medium text-lg">
              Highly motivated and detail-oriented candidate with a strong foundation in {candidate.degree}. 
              Possesses advanced technical skills and a proven ability to collaborate in fast-paced environments.
            </p>
          </section>

          <section>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6">Core Competencies</h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills && candidate.skills.length > 0 ? (
                candidate.skills.map(s => (
                  <span key={s.skill_id} className="px-5 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold shadow-sm">
                    {s.skill_name}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">No skills listed</span>
              )}
            </div>
          </section>
        </div>

        <div className="col-span-1 space-y-8">
            <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Education</h4>
                <div className="flex gap-4">
                    <div className="bg-white p-3 rounded-2xl h-fit shadow-sm">
                      <GraduationCap className="text-blue-600" />
                    </div>
                    <div>
                        <p className="font-black text-slate-900 text-sm">Undergraduate</p>
                        <p className="text-[10px] text-slate-500 font-black uppercase mt-1">Class of 2024</p>
                    </div>
                </div>
            </div>
            
            <button className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-bold hover:border-blue-300 hover:text-blue-500 transition-all">
               <FileText size={18} /> View Resume.pdf
            </button>
        </div>
      </div>

      {/* --- SHORTLISTING ACTION FOOTER --- */}
      <div className="p-8 bg-slate-900 flex items-center justify-between mx-6 mb-6 rounded-[2.5rem] shadow-2xl">
        <div className="flex items-center gap-10 pl-4">
            <div className="text-left">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Profile Status</p>
                <p className="text-emerald-400 text-xl font-black uppercase tracking-tight">Verified Match</p>
            </div>
            <div className="h-10 w-[1px] bg-slate-700" />
            <button className="text-white hover:text-blue-400 flex items-center gap-2 text-xs font-bold transition-colors">
                <Download size={16} /> Save to PDF
            </button>
        </div>

        <div className="flex gap-4">
            <button 
              onClick={onClose} 
              className="px-8 py-4 rounded-2xl text-slate-400 font-bold hover:text-white transition-colors"
            >
              Not Now
            </button>
            <button 
                onClick={() => {
                  onShortlist();
                  onClose();
                }}
                className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl flex items-center gap-3 transition-all active:scale-95"
            >
                <UserCheck size={18} /> Shortlist Candidate
            </button>
        </div>
      </div>
    </div>
  </div>
);
export default HrDashboard;