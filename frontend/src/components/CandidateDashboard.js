import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Globe, LayoutDashboard, Briefcase, FileUser,
  Terminal, Bell, LogOut, CheckCircle2, Zap, Search, Plus,
  FileText, MapPin, Bookmark, X, ChevronRight,
  ClipboardCheck, Clock, Award, ShieldCheck, Upload
} from 'lucide-react';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  // Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "{}"));
  const [fullProfile, setFullProfile] = useState(null);
  const [assessmentsData, setAssessmentsData] = useState([]);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [notificationsData, setNotificationsData] = useState([]);
  const [myApplications, setMyApplications] = useState([]);

  const fetchApplications = (studentId) => {
    fetch(`http://localhost:5000/api/applications/student/${studentId}`)
      .then(res => res.json())
      .then(data => setMyApplications(data))
      .catch(err => console.error(err));
  };

  const handleStartAssessment = (id) => {
    fetch(`http://localhost:5000/api/assessments/${id}`)
      .then(res => res.json())
      .then(data => {
        setCurrentAssessment(data);
        setActiveTab('quiz');
      })
      .catch(err => console.error(err));
  };

  const fetchProfile = () => {
    fetch(`http://localhost:5000/api/profile/student/${user.user_id}`)
      .then(res => res.json())
      .then(data => {
        setFullProfile(data);
        if (data?.student_id) fetchApplications(data.student_id);
      })
      .catch(err => console.error("Profile fetch error:", err));
  };

  React.useEffect(() => {
    fetch("http://localhost:5000/api/jobs/recommended")
      .then(res => res.json())
      .then(data => setRecommendedJobs(data))
      .catch(err => console.error("Fetch error:", err));
      
    fetchProfile();

    fetch("http://localhost:5000/api/assessments")
      .then(res => res.json())
      .then(data => setAssessmentsData(data))
      .catch(err => console.error(err));

    fetch(`http://localhost:5000/api/notifications/${user.user_id}`)
      .then(res => res.json())
      .then(data => setNotificationsData(data))
      .catch(err => console.error(err));
  }, []);

  const handleApply = async (job, newResumeFile = null) => {
    try {
      let currentResume = fullProfile?.resume;

      // If a new resume is provided, upload it first
      if (newResumeFile) {
        const formData = new FormData();
        formData.append('resume', newResumeFile);
        formData.append('student_id', fullProfile.student_id);
        
        const uploadRes = await fetch("http://localhost:5000/api/profile/student/upload-resume", {
          method: "POST",
          body: formData,
        });
        if (uploadRes.ok) {
           const uploadData = await uploadRes.json();
           currentResume = uploadData.resume;
           fetchProfile(); 
        }
      }

      const res = await fetch("http://localhost:5000/api/applications/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_id: job.job_id,
          student_id: fullProfile.student_id // 🔥 Corrected from user.user_id
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Applied Successfully ✅");
        setIsApplyModalOpen(false);
        fetchApplications(fullProfile.student_id); // Refetch to update UI
      } else {
        alert(data.message || "Application Failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error ❌");
    }
  };

  const handleLogout = () => navigate('/home');

  const openApplyModal = (job) => {
    setSelectedJob(job);
    setIsApplyModalOpen(true);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { id: 'jobs', label: 'Available Jobs', icon: <Briefcase size={18} /> },
    { id: 'assessments', label: 'Assessments', icon: <ClipboardCheck size={18} /> },
  ];

  const profileItems = [
    { id: 'resume', label: 'Manage Resume', icon: <FileUser size={18} /> },
    { id: 'skills', label: 'My Skills', icon: <Terminal size={18} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  ];

  return (
    <div className="min-h-screen flex font-sans text-slate-900 bg-white relative">

      {/* Sidebar */}
      <aside className="w-72 bg-slate-50 border-r border-slate-100 flex flex-col p-8 sticky top-0 h-screen z-20 text-left">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-purple-600 p-2 rounded-xl shadow-lg shadow-purple-500/10">
            <Globe size={24} className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-slate-950">Talent<span className="text-purple-600">Pool</span></span>
        </div>

        <nav className="flex-1 space-y-1">
          <div className="pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Menu</div>
          {menuItems.map(item => (
            <SideBtn key={item.id} icon={item.icon} label={item.label} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
          ))}
          <div className="pt-8 pb-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Profile</div>
          {profileItems.map(item => (
            <SideBtn key={item.id} icon={item.icon} label={item.label} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
          ))}
        </nav>

        <div className="pt-8 border-t border-slate-100">
          <SideBtn icon={<LogOut size={18} />} label="Logout" className="text-red-600 hover:bg-red-50" onClick={handleLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto text-slate-900">
        {activeTab === 'dashboard' && <DashboardHome myApps={myApplications} onSeeJobs={() => setActiveTab('jobs')} onApply={openApplyModal} user={user} recommendedJobs={recommendedJobs} fullProfile={fullProfile} />}
        {activeTab === 'jobs' && <AvailableJobsView myApps={myApplications} onApply={openApplyModal} jobs={recommendedJobs} />}
        {activeTab === 'assessments' && <AssessmentsListView assessments={assessmentsData} onStart={handleStartAssessment} />}
        {activeTab === 'quiz' && <QuizView assessment={currentAssessment} onComplete={() => setActiveTab('dashboard')} user={user} />}
        {activeTab === 'skills' && <SkillsView profile={fullProfile} refresh={fetchProfile} />}
        {activeTab === 'resume' && <ResumeView profile={fullProfile} refresh={fetchProfile} />}
        {activeTab === 'notifications' && <NotificationsView notifications={notificationsData} />}
      </main>

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <ApplyModal
          job={selectedJob}
          onClose={() => setIsApplyModalOpen(false)}
          user={user}
          profile={fullProfile}
          handleApply={handleApply}
          alreadyApplied={myApplications.some(a => a.job_id === selectedJob.job_id)}
        />
      )}
    </div>
  );
};

const AssessmentsListView = ({ assessments, onStart }) => (
  <div className="animate-in fade-in duration-700 text-left">
    <header className="mb-12">
      <h1 className="text-5xl font-black tracking-tighter mb-4 text-slate-950">Skill Assessments</h1>
      <p className="text-slate-500 text-lg">Validate your expertise and boost your match score.</p>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {assessments.map(a => (
        <div key={a.assessment_id} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex flex-col justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-950 mb-2">{a.title}</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">{a.description}</p>
          </div>
          <button
            onClick={() => onStart(a.assessment_id)}
            className="w-full bg-slate-950 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-purple-600 transition-all"
          >
            Start Assessment
          </button>
        </div>
      ))}
    </div>
  </div>
);

const QuizView = ({ assessment, onComplete, user }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const questionsList = assessment?.questions || [];

  const handleSelect = (ans) => {
    setAnswers({ ...answers, [questionsList[currentIdx].question_id]: ans });
  };

  const next = () => {
    if (currentIdx < questionsList.length - 1) setCurrentIdx(currentIdx + 1);
    else finish();
  };

  const finish = async () => {
    let score = 0;
    questionsList.forEach(q => {
      if (answers[q.question_id] === q.correct_answer) score += (100 / questionsList.length);
    });

    try {
      await fetch("http://localhost:5000/api/assessments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: user.user_id,
          assessment_id: assessment.assessment_id,
          score: Math.round(score)
        })
      });
      alert(`Quiz Completed! Your Score: ${Math.round(score)}%`);
      onComplete();
    } catch (err) {
      alert("Submission failed");
    }
  };

  if (!assessment) return <p>Loading questions...</p>;

  const q = questionsList[currentIdx];

  return (
    <div className="animate-in zoom-in-95 duration-700 text-left max-w-4xl mx-auto">
      <header className="mb-12 flex justify-between items-center">
        <div>
          <p className="text-xs font-black text-purple-600 uppercase tracking-widest mb-2">Question {currentIdx + 1} of {questionsList.length}</p>
          <h1 className="text-3xl font-black text-slate-950">{q.question_text}</h1>
        </div>
      </header>

      <div className="space-y-4 mb-12">
        {Object.entries(q.options).map(([key, val]) => (
          <button
            key={key}
            onClick={() => handleSelect(key)}
            className={`w-full p-6 rounded-3xl border-2 transition-all text-left flex items-center gap-6 ${answers[q.question_id] === key ? 'border-purple-600 bg-purple-50' : 'border-slate-100 hover:border-slate-200 bg-slate-50'}`}
          >
            <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs ${answers[q.question_id] === key ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>{key}</span>
            <span className="font-bold text-slate-700">{val}</span>
          </button>
        ))}
      </div>

      <button
        onClick={next}
        disabled={!answers[q.question_id]}
        className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black uppercase tracking-widest disabled:opacity-50 shadow-xl"
      >
        {currentIdx < questionsList.length - 1 ? 'Next Question' : 'Finish Assessment'}
      </button>
    </div>
  );
};

// --- ASSESSMENT SUB-COMPONENTS ---
const AssessmentRule = ({ icon, text }) => (
  <div className="flex items-center gap-5 bg-slate-50/50 p-6 rounded-2xl border border-slate-50 hover:border-slate-100 transition-all group">
    <div className="bg-white p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform">{icon}</div>
    <p className="text-base font-bold text-slate-700">{text}</p>
  </div>
);

const SummaryRow = ({ label, value, color = "text-slate-950" }) => (
  <div className="flex justify-between items-center border-b border-slate-200 pb-4">
    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</span>
    <span className={`text-base font-black ${color}`}>{value}</span>
  </div>
);

const TopicBadge = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50"></div>
    <span className="text-sm font-bold text-slate-600">{text}</span>
  </div>
);

// --- MODAL COMPONENT ---
const ApplyModal = ({ job, onClose, user, profile, handleApply }) => {
  const [newResume, setNewResume] = useState(null);
  
  if (!job) return null;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-10 border-b border-slate-50 flex justify-between items-start">
          <div className="text-left">
            <h2 className="text-3xl font-black text-slate-950 mb-1">{job.title}</h2>
            <p className="text-slate-500 font-bold text-sm tracking-wide">{job.company || "Enterprise"} • Remote</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-300 hover:text-slate-900 transition-all"><X size={28} /></button>
        </div>
        
        <div className="p-10 space-y-10 max-h-[60vh] overflow-y-auto text-left">
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Confirm Identity</h3>
            <div className="grid grid-cols-2 gap-6">
              <InputGroup label="Full Name" value={user?.user_name || "Guest"} />
              <InputGroup label="Email Address" value={user?.email || "guest@example.com"} />
            </div>
          </section>

          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Resume Attachment</h3>
            <div className="bg-slate-50/50 border border-slate-100 rounded-[2rem] p-8">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-white rounded-2xl text-purple-600 border border-slate-100 shadow-sm"><FileText size={24} /></div>
                  <div>
                    <p className="text-sm font-black text-slate-950 truncate max-w-[200px]">{newResume ? newResume.name : (profile?.resume || "No resume uploaded")}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{newResume ? "Newly Selected" : "Profile Default"}</p>
                  </div>
                </div>
                <label className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-purple-300 hover:text-purple-600 transition-all shadow-sm">
                  Change File
                  <input type="file" className="hidden" accept=".pdf" onChange={(e) => setNewResume(e.target.files[0])} />
                </label>
              </div>
            </div>
          </section>
        </div>

        <div className="p-10 bg-slate-50/30 border-t border-slate-50 flex gap-4">
          <button onClick={onClose} className="flex-1 py-5 font-black text-slate-400 hover:text-slate-900 transition-all uppercase tracking-widest text-xs">Dismiss</button>
          <button
            onClick={() => handleApply(job, newResume)}
            disabled={myApplications.some(a => a.job_id === job.job_id)}
            className={`flex-[2.5] py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all ${myApplications.some(a => a.job_id === job.job_id) ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none' : 'bg-slate-950 text-white'}`}
          >
            {myApplications.some(a => a.job_id === job.job_id) ? 'Already Applied' : 'Submit Application'} {!myApplications.some(a => a.job_id === job.job_id) && <ChevronRight size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, value }) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-slate-600 ml-1">{label}</label>
    <input type="text" defaultValue={value} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-purple-200" />
  </div>
);

// --- VIEW COMPONENTS ---

const DashboardHome = ({ onSeeJobs, onApply, user, recommendedJobs, fullProfile, myApps = [] }) => (
  <div className="animate-in fade-in duration-700">
    <header className="flex justify-between items-center mb-12">
      <div className="text-left">
        <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-950">Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">{user.user_name || "Guest"}!</span></h1>
        <p className="text-slate-600 font-medium text-lg">Here's what's happening with your job applications today.</p>
      </div>
      <HeaderIcons user={user} />
    </header>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <StatCard label="Applications Sent" value={myApps.length} icon={<Zap size={20} />} color="text-blue-600" />
      <StatCard label="Profile Completion" value="85%" icon={<CheckCircle2 size={20} />} color="text-purple-600" />
      <StatCard label="Verified Skills" value={fullProfile?.skills?.length || 0} icon={<Terminal size={20} />} color="text-amber-600" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center px-2 text-left mb-6">
          <h3 className="text-xl font-black tracking-tight uppercase text-slate-950">Recommended for you</h3>
          <button onClick={onSeeJobs} className="text-xs font-black text-purple-600 hover:text-purple-700 uppercase tracking-widest">View All Jobs</button>
        </div>
        {recommendedJobs.length > 0 ? (
          recommendedJobs.slice(0, 3).map(job => (
            <JobCard
              key={job.job_id}
              onApply={() => onApply(job)}
              title={job.title}
              company={job.hr?.company_name || "Enterprise"}
              location={job.location || "Remote"}
              tags={job.skills?.map(s => s.skill_name) || []}
              applied={myApps.some(a => a.job_id === job.job_id)}
            />
          ))
        ) : (
          <p className="text-slate-400 italic">No job recommendations yet.</p>
        )}
      </div>
      <SkillsSidebar skills={fullProfile?.skills || []} />
    </div>
  </div>
);

const AvailableJobsView = ({ jobs, onApply, myApps }) => (
  <div className="animate-in fade-in duration-700 text-left">
    <header className="mb-12">
      <h1 className="text-5xl font-black tracking-tighter mb-4 text-slate-950">Marketplace</h1>
      <p className="text-slate-500 text-lg">Discover roles that sync with your expertise.</p>
    </header>
    <div className="space-y-4">
      {jobs.length > 0 ? (
        jobs.map(job => (
          <JobCard
            key={job.job_id}
            title={job.title}
            company={job.hr?.company_name || "Enterprise"}
            location="Remote"
            tags={job.skills?.map(s => s.skill_name) || ["Engineering"]}
            onApply={() => onApply(job)}
            applied={myApps.some(a => a.job_id === job.job_id)}
          />
        ))
      ) : (
        <p className="text-slate-400 italic">No jobs available right now.</p>
      )}
    </div>
  </div>
);

// --- REUSABLE UI ---
const SideBtn = ({ icon, label, active, onClick, className = "" }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/10' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'} ${className}`}>
    {icon} {label}
  </button>
);

const PremiumJobCard = ({ title, company, match, salary, onApply, applied }) => (
  <div className={`p-8 rounded-[3rem] border transition-all group text-left shadow-sm ${applied ? 'bg-slate-50 border-slate-100 opacity-80' : 'bg-slate-50 border-slate-100 hover:border-purple-200 hover:bg-white'}`}>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl border border-slate-100 ${applied ? 'bg-slate-100 text-slate-400' : 'bg-purple-100 text-purple-600'}`}><Briefcase size={24} /></div>
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${applied ? 'bg-slate-200 text-slate-500' : 'bg-green-100 text-green-700'}`}>{applied ? 'Status: Pending' : (match + ' Match')}</span>
    </div>
    <h3 className={`text-xl font-black transition-colors ${applied ? 'text-slate-500' : 'group-hover:text-purple-600 text-slate-950'}`}>{title}</h3>
    <p className="text-slate-500 font-bold mb-8">{company} • {salary}</p>
    <button 
      onClick={!applied ? onApply : undefined} 
      className={`w-full py-4 rounded-2xl text-xs font-black uppercase transition-all ${applied ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' : 'bg-purple-600 text-white shadow-lg'}`}
    >
      {applied ? 'Already Applied' : 'Apply Now'}
    </button>
  </div>
);

const JobCard = ({ title, company, location, tags, onApply, applied }) => (
  <div className={`p-8 rounded-[2.5rem] border transition-all flex justify-between items-center shadow-sm ${applied ? 'bg-slate-50 border-slate-100' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}`}>
    <div className="text-left">
      <h4 className={`text-xl font-black mb-1 ${applied ? 'text-slate-500' : 'text-slate-950'}`}>{title}</h4>
      <p className="text-sm font-medium text-slate-600 mb-4">{company} • {location}</p>
      <div className="flex gap-2">
        {tags.map(t => <span key={t} className={`text-[10px] font-black uppercase px-3 py-1 rounded-lg ${applied ? 'bg-slate-100 text-slate-400' : 'bg-purple-100/50 text-purple-700'}`}>{t}</span>)}
      </div>
    </div>
    <button 
      onClick={!applied ? onApply : undefined} 
      className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${applied ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'}`}
    >
      {applied ? 'Applied' : 'Apply Now'}
    </button>
  </div>
);

const SkillsView = ({ profile, refresh }) => {
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = async () => {
    if (!newSkill) return;
    try {
      const res = await fetch("http://localhost:5000/api/profile/student/add-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: profile.student_id,
          skill_name: newSkill
        })
      });
      if (res.ok) {
        setNewSkill("");
        refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      <h1 className="text-4xl font-black text-slate-950 mb-8">My Skills</h1>
      <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
        <div className="flex gap-4 mb-10">
           <input 
             type="text" 
             placeholder="Add new skill (e.g. Docker, AWS)" 
             value={newSkill}
             onChange={(e) => setNewSkill(e.target.value)}
             className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 outline-none focus:border-purple-300 shadow-sm"
           />
           <button 
             onClick={handleAddSkill}
             className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-purple-200"
           >
             Add Skill
           </button>
        </div>
        <p className="font-bold text-slate-400 uppercase text-[10px] tracking-[0.2em] mb-6 ml-2">Core Competencies</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {profile?.skills?.length > 0 ? (
            profile.skills.map(s => (
              <div key={s.skill_id} className="bg-white px-6 py-4 rounded-3xl border border-slate-200 font-black text-slate-700 flex justify-between items-center group hover:border-purple-200 transition-all shadow-sm">
                <span>{s.skill_name}</span>
                <X size={14} className="text-slate-300 group-hover:text-red-400 cursor-pointer transition-colors" />
              </div>
            ))
          ) : (
            <p className="text-slate-400 italic p-4">No skills listed yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const ResumeView = ({ profile, refresh }) => {
  const [fileName, setFileName] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !profile) return;
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('student_id', profile.student_id);

    try {
      const res = await fetch("http://localhost:5000/api/profile/student/upload-resume", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Resume uploaded successfully!");
        refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!profile) return (
    <div className="flex items-center justify-center p-20 bg-slate-50 rounded-[3rem] border border-slate-100 italic font-bold text-slate-400">
      Loading profile details...
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      <h1 className="text-4xl font-black text-slate-950 mb-8">Manage Resume</h1>
      <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
        <div className="flex items-center gap-8 bg-white p-8 rounded-[2rem] border border-slate-200 mb-10 shadow-sm">
          <div className="p-5 bg-purple-50 rounded-3xl text-purple-600"><FileText size={48} /></div>
          <div className="flex-1">
            <p className="text-xl font-black text-slate-950">{profile?.resume || "No resume uploaded"}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Status: {profile?.resume ? "Verified Profile" : "Incomplete Profile"}</p>
          </div>
          <div className="px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 size={12} /> Live
          </div>
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
           <p className="text-sm font-bold text-slate-600 mb-6">Upload a new PDF resume</p>
           <div className="flex gap-4">
              <input 
                type="file" 
                accept=".pdf"
                onChange={handleFileUpload}
                id="resumeUpload"
                className="hidden"
              />
              <label 
                htmlFor="resumeUpload"
                className="flex-1 bg-slate-50 border border-dashed border-slate-300 rounded-2xl px-6 py-8 outline-none hover:border-purple-400 flex flex-col items-center justify-center gap-4 cursor-pointer group transition-all"
              >
                <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-300 group-hover:text-purple-600 group-hover:scale-110 transition-all"><Upload size={24} /></div>
                <div className="text-center">
                   <p className="text-sm font-black text-slate-900">Click to Browse or Drag PDF</p>
                   <p className="text-xs text-slate-400 font-bold uppercase mt-1">Maximum file size: 5MB</p>
                </div>
              </label>
           </div>
        </div>
        
        {profile?.resume && (
          <div className="mt-8 flex justify-center">
            <a 
              href={`http://localhost:5000/uploads/${profile.resume}`} 
              target="_blank" 
              rel="noreferrer"
              className="text-xs font-black uppercase text-purple-600 bg-purple-50 px-6 py-3 rounded-xl hover:bg-purple-100 transition-all"
            >
              View Uploaded Document
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const HeaderIcons = ({ user }) => (
  <div className="flex items-center gap-4">
    <button className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-slate-600 relative"><Bell size={20} /><span className="absolute top-3 right-3 w-2 h-2 bg-purple-600 rounded-full border-2 border-white"></span></button>
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 p-[2px]"><img src={`https://i.pravatar.cc/150?u=${user?.user_name}`} className="w-full h-full rounded-[14px] object-cover border-2 border-white" alt="Avatar" /></div>
  </div>
);

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 text-left shadow-sm">
    <div className={`p-3 rounded-2xl bg-white border border-slate-100 w-fit mb-4 ${color}`}>{icon}</div>
    <div className="text-3xl font-black mb-1 text-slate-950">{value}</div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
  </div>
);

const SkillsSidebar = ({ skills }) => (
  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left">
    <h3 className="text-sm font-black uppercase tracking-widest text-slate-950 mb-6">Top Skills</h3>
    <div className="flex flex-wrap gap-2">
      {skills.length > 0 ? (
        skills.slice(0, 6).map(s => <span key={s.skill_id} className="bg-white border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-700">{s.skill_name}</span>)
      ) : (
        <p className="text-xs text-slate-400 italic">Add skills to your profile.</p>
      )}
    </div>
  </div>
);

const NotificationsView = ({ notifications }) => (
  <div className="animate-in fade-in duration-500 text-left">
    <header className="mb-10">
      <h1 className="text-4xl font-black tracking-tight text-slate-900">Notifications</h1>
      <p className="text-slate-500 font-medium">Stay updated with your application status and messages.</p>
    </header>
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden text-left">
      <div className="divide-y divide-slate-50">
        {notifications.length > 0 ? (
          notifications.map((n, i) => (
            <div key={i} className={`p-8 hover:bg-slate-50/50 transition-all flex items-start gap-6 ${!n.is_read ? 'bg-purple-50/30' : ''}`}>
               <div className={`p-3 rounded-2xl ${!n.is_read ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                 <Bell size={20} />
               </div>
               <div className="flex-1">
                 <p className="text-base font-bold text-slate-900">{n.message}</p>
                 <p className="text-xs text-slate-400 font-bold uppercase mt-2">{new Date(n.created_at).toLocaleString()}</p>
               </div>
               {!n.is_read && <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>}
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

export default CandidateDashboard;