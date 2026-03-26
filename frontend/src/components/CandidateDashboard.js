import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, LayoutDashboard, Briefcase, FileUser, 
  Terminal, Bell, LogOut, CheckCircle2, Zap, Search, Plus, 
  FileText, MapPin, Bookmark, X, ChevronRight, 
  ClipboardCheck, Clock, Award, ShieldCheck
} from 'lucide-react';

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

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
  ];

  return (
    <div className="min-h-screen flex font-sans text-slate-900 bg-white relative">
      
      {/* Sidebar */}
      <aside className="w-72 bg-slate-50 border-r border-slate-100 flex flex-col p-8 sticky top-0 h-screen z-20 text-left">
        <div className="flex items-center gap-3 mb-12">
          <div className="bg-purple-600 p-2 rounded-xl shadow-lg shadow-purple-500/10">
            <Globe size={24} className="text-white"/>
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
          <SideBtn icon={<LogOut size={18}/>} label="Logout" className="text-red-600 hover:bg-red-50" onClick={handleLogout} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto text-slate-900">
        {activeTab === 'dashboard' && <DashboardHome onSeeJobs={() => setActiveTab('jobs')} onApply={openApplyModal} />}
        {activeTab === 'jobs' && <AvailableJobsView onApply={openApplyModal} />}
        {activeTab === 'assessments' && <AssessmentsView />}
        {activeTab === 'skills' && <SkillsView />}
        {activeTab === 'resume' && <ResumeView />}
      </main>

      {/* Apply Modal */}
      {isApplyModalOpen && (
        <ApplyModal 
          job={selectedJob} 
          onClose={() => setIsApplyModalOpen(false)} 
        />
      )}
    </div>
  );
};

// --- NEW ASSESSMENTS VIEW COMPONENT ---
const AssessmentsView = () => (
  <div className="animate-in slide-in-from-bottom-4 duration-700 text-left">
    <header className="mb-10 flex justify-between items-end">
      <div>
        <p className="text-xs font-black text-purple-600 uppercase tracking-[0.2em] mb-2">Employee / Assessments / Full Stack Web Development</p>
        <h1 className="text-5xl font-black tracking-tighter mb-4 text-slate-950">Full Stack Web Development</h1>
        <p className="text-slate-500 text-lg font-medium italic">Required for: <span className="text-slate-950 font-bold not-italic">Frontend Developer Role at TechCorp Inc.</span></p>
      </div>
      <div className="bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl flex items-center gap-4 shadow-sm">
        <Clock size={24} className="text-slate-400" />
        <span className="text-2xl font-black text-slate-950 tracking-tighter">20:00</span>
      </div>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Assessment Rules */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-slate-100 rounded-[3rem] p-12 shadow-sm">
          <div className="mb-8">
             <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100">Assessment Ready</span>
          </div>
          
          <h2 className="text-3xl font-black text-slate-950 mb-4">Start your assessment</h2>
          <p className="text-slate-500 font-medium mb-12 leading-relaxed text-lg">
            This assessment contains 10 multiple choice questions based on React, JavaScript, APIs, and frontend development fundamentals. Read each question carefully and submit before the timer ends.
          </p>

          <div className="space-y-4">
            <AssessmentRule icon={<ClipboardCheck size={20} className="text-blue-600"/>} text="10 questions in total with one correct answer for each question." />
            <AssessmentRule icon={<Clock size={20} className="text-amber-500"/>} text="You will have 20 minutes to complete the full assessment." />
            <AssessmentRule icon={<Award size={20} className="text-purple-600"/>} text="Your final score will be used to calculate the matching percentage for this role." />
            <AssessmentRule icon={<ShieldCheck size={20} className="text-green-600"/>} text="Once submitted, the result will be shared with the recruiter automatically." />
          </div>

          <div className="mt-12 flex gap-4">
             <button className="px-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all">Back</button>
             <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-purple-600/20 transition-all flex items-center justify-center gap-2">
                Start Assessment <ChevronRight size={18} />
             </button>
          </div>
        </div>
      </div>

      {/* Right Column: Summary Card */}
      <div className="space-y-6">
        <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-10 shadow-sm">
          <h3 className="text-xl font-black text-slate-950 mb-8">Assessment Summary</h3>
          
          <div className="space-y-6 mb-10">
            <SummaryRow label="Total Questions" value="10" />
            <SummaryRow label="Time Limit" value="20 mins" />
            <SummaryRow label="Difficulty" value="Intermediate" />
            <SummaryRow label="Job Match Weight" value="High" color="text-purple-600" />
          </div>

          <div className="space-y-4 mb-10">
             <TopicBadge text="React & JavaScript" />
             <TopicBadge text="APIs & Axios" />
             <TopicBadge text="UI and problem solving" />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 transition-all">
            Start Now
          </button>
        </div>
      </div>
    </div>
  </div>
);

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
const ApplyModal = ({ job, onClose }) => {
  if (!job) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8 border-b border-slate-50 flex justify-between items-start">
          <div className="text-left">
            <h2 className="text-2xl font-black text-slate-950 mb-1">{job.title}</h2>
            <p className="text-slate-500 font-bold text-sm">{job.company} • {job.location}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24} /></button>
        </div>
        <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto text-left">
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputGroup label="Full Name" value="Alex Johnson" />
              <InputGroup label="Email Address" value="alex.johnson@example.com" />
            </div>
          </section>
          <section>
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Resume</h3>
            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-xl text-purple-600 border border-slate-100"><FileText size={20}/></div>
                <div><p className="text-sm font-black text-slate-900 leading-none">alex_resume_2026.pdf</p></div>
              </div>
              <button className="text-[10px] font-black uppercase text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-100">Change</button>
            </div>
          </section>
        </div>
        <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex gap-4">
          <button onClick={onClose} className="flex-1 bg-white border border-slate-200 py-4 rounded-2xl text-xs font-black uppercase text-slate-600">Cancel</button>
          <button className="flex-[2] bg-purple-600 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">Submit Application <ChevronRight size={16}/></button>
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
const DashboardHome = ({ onSeeJobs, onApply }) => (
  <div className="animate-in fade-in duration-700">
    <header className="flex justify-between items-center mb-12">
      <div className="text-left">
        <h1 className="text-4xl font-black tracking-tight mb-2 text-slate-950">Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Sweatha!</span></h1>
        <p className="text-slate-600 font-medium text-lg">Here's what's happening with your job applications today.</p>
      </div>
      <HeaderIcons />
    </header>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <StatCard label="Applications Sent" value="12" icon={<Zap size={20} />} color="text-blue-600" />
      <StatCard label="Profile Completion" value="85%" icon={<CheckCircle2 size={20} />} color="text-purple-600" />
      <StatCard label="Verified Skills" value="8" icon={<Terminal size={20} />} color="text-amber-600" />
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center px-2">
           <h3 className="text-xl font-black tracking-tight uppercase text-slate-950">Recommended for you</h3>
           <button onClick={onSeeJobs} className="text-xs font-black text-purple-600 hover:text-purple-700 uppercase tracking-widest">View All Jobs</button>
        </div>
        <JobCard onApply={() => onApply({ title: "Senior React Developer", company: "TechCorp Inc.", location: "Remote" })} title="Senior React Developer" company="TechCorp Inc." location="Remote" tags={['React.js', 'Node.js']} />
        <JobCard onApply={() => onApply({ title: "Full Stack Engineer", company: "Startup Hub", location: "New York, NY" })} title="Full Stack Engineer" company="Startup Hub" location="New York, NY" tags={['JS', 'Express']} />
      </div>
      <SkillsSidebar />
    </div>
  </div>
);

const AvailableJobsView = ({ onApply }) => (
  <div className="animate-in slide-in-from-bottom-4 duration-700">
    <header className="mb-10 text-left">
      <h1 className="text-5xl font-black tracking-tighter mb-4 text-slate-950">Find Your Next Role</h1>
      <p className="text-slate-600 text-lg">Discover opportunities that match your skills.</p>
    </header>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <PremiumJobCard onApply={() => onApply({ title: "Senior React Developer", company: "TechCorp Inc.", location: "Remote" })} title="Senior React Developer" company="TechCorp Inc." match="98%" salary="$120k" />
      <PremiumJobCard onApply={() => onApply({ title: "Full Stack Engineer", company: "Startup Hub", location: "NYC" })} title="Full Stack Engineer" company="Startup Hub" match="88%" salary="$100k" />
    </div>
  </div>
);

// --- REUSABLE UI ---
const SideBtn = ({ icon, label, active, onClick, className = "" }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/10' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'} ${className}`}>
    {icon} {label}
  </button>
);

const PremiumJobCard = ({ title, company, match, salary, onApply }) => (
  <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100 hover:border-purple-200 hover:bg-white transition-all group text-left shadow-sm">
    <div className="flex justify-between items-start mb-6">
      <div className="p-4 bg-purple-100 rounded-2xl text-purple-600"><Briefcase size={24}/></div>
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">{match} Match</span>
    </div>
    <h3 className="text-xl font-black group-hover:text-purple-600 transition-colors text-slate-950">{title}</h3>
    <p className="text-slate-500 font-bold mb-8">{company} • {salary}</p>
    <button onClick={onApply} className="w-full bg-purple-600 text-white py-4 rounded-2xl text-xs font-black uppercase transition-all">Apply Now</button>
  </div>
);

const JobCard = ({ title, company, location, tags, onApply }) => (
  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 hover:border-slate-200 transition-all flex justify-between items-center shadow-sm">
    <div className="text-left">
      <h4 className="text-xl font-black text-slate-950 mb-1">{title}</h4>
      <p className="text-sm font-medium text-slate-600 mb-4">{company} • {location}</p>
      <div className="flex gap-2">
        {tags.map(t => <span key={t} className="text-[10px] font-black uppercase text-purple-700 bg-purple-100/50 px-3 py-1 rounded-lg">{t}</span>)}
      </div>
    </div>
    <button onClick={onApply} className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all">Apply Now</button>
  </div>
);

const SkillsView = () => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
    <h1 className="text-4xl font-black text-slate-950 mb-8">My Skills</h1>
    <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
      <p className="font-bold text-slate-400 uppercase text-xs tracking-widest mb-4">Core Competencies</p>
      <div className="flex flex-wrap gap-3">
        {['React.js', 'Node.js', 'TypeScript', 'Tailwind CSS'].map(s => (
          <span key={s} className="bg-white px-6 py-3 rounded-xl border border-slate-200 font-black text-slate-700">{s}</span>
        ))}
      </div>
    </div>
  </div>
);

const ResumeView = () => (
  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
    <h1 className="text-4xl font-black text-slate-950 mb-8">Manage Resume</h1>
    <div className="bg-slate-50 p-10 rounded-[2.5rem] border border-slate-100">
      <div className="flex items-center gap-6 bg-white p-6 rounded-3xl border border-slate-200">
        <FileText size={40} className="text-purple-600" />
        <div>
          <p className="text-lg font-black text-slate-950">Sweatha_Resume_2026.pdf</p>
          <p className="text-xs font-bold text-slate-400 uppercase">Last updated today</p>
        </div>
      </div>
    </div>
  </div>
);

const HeaderIcons = () => (
  <div className="flex items-center gap-4">
    <button className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-slate-600 relative"><Bell size={20} /><span className="absolute top-3 right-3 w-2 h-2 bg-purple-600 rounded-full border-2 border-white"></span></button>
    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 p-[2px]"><img src="https://i.pravatar.cc/150?u=sweatha" className="w-full h-full rounded-[14px] object-cover border-2 border-white" alt="Avatar" /></div>
  </div>
);

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 text-left shadow-sm">
    <div className={`p-3 rounded-2xl bg-white border border-slate-100 w-fit mb-4 ${color}`}>{icon}</div>
    <div className="text-3xl font-black mb-1 text-slate-950">{value}</div>
    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{label}</div>
  </div>
);

const SkillsSidebar = () => (
  <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left">
    <h3 className="text-sm font-black uppercase tracking-widest text-slate-950 mb-6">Top Skills</h3>
    <div className="flex flex-wrap gap-2">
      {['React.js', 'Node.js', 'MongoDB'].map(s => <span key={s} className="bg-white border border-slate-100 px-4 py-2 rounded-xl text-xs font-bold text-slate-700">{s}</span>)}
    </div>
  </div>
);

export default CandidateDashboard;