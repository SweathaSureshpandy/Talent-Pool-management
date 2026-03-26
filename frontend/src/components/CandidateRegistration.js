import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Globe, ArrowLeft, User, BookOpen, Cpu, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';

const CandidateRegistration = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // State
  const [skills, setSkills] = useState(['React.js', 'Tailwind CSS']);
  const [skillInput, setSkillInput] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle Skill Logic
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newSkill = skillInput.trim().replace(/,/g, '');
      if (newSkill && !skills.includes(newSkill)) {
        setSkills([...skills, newSkill]);
        setSkillInput("");
      }
    } else if (e.key === 'Backspace' && !skillInput && skills.length > 0) {
      setSkills(skills.slice(0, -1));
    }
  };

  const removeSkill = (indexToRemove) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  // Handle File Upload Logic
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = (e) => {
    e.preventDefault();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFinalRegister = async (e) => {
    e.preventDefault();
    setIsRegistering(true);

    const formData = {
      user_name: e.target[0].value,
      email: e.target[1].value,
      password: e.target[2].value,
      role: "student",
      university: e.target[4].value,
      degree: e.target[5].value,
      skills: skills,
      resume_name: selectedFile ? selectedFile.name : null
    };

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Student Registered Successfully ✅");
        navigate("/candidate/dashboard");
      } else {
        const data = await res.json();
        alert(data.message || "Registration Failed ❌");
      }
    } catch (err) {
      alert("Server Error ❌");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4 relative font-sans text-slate-900">
      
      {/* Decorative background orbs */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-purple-50 rounded-full blur-[120px] pointer-events-none opacity-60"></div>
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-50 rounded-full blur-[120px] pointer-events-none opacity-60"></div>

      {/* Header */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 z-10">
        <div className="flex items-center gap-2 text-slate-900 font-black text-2xl tracking-tighter">
          <div className="bg-purple-600 p-2 rounded-lg shadow-lg">
            <Globe size={24} className="text-white" />
          </div>
          Talent<span className="text-purple-600">Pool</span>
        </div>
        <button 
          onClick={() => navigate('/register')} 
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest transition-all"
        >
          <ArrowLeft size={16} /> Back to Selection
        </button>
      </div>

      {/* Main Form Card */}
      <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="p-10 border-b border-slate-50 text-center bg-slate-50/50">
          <div className="inline-flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full border border-purple-200 mb-4">
            <ShieldCheck size={14} className="text-purple-600" />
            <span className="text-[10px] font-black text-purple-700 uppercase tracking-widest">Candidate Verification</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">Create Profile</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Join the talent network and get discovered.</p>
        </div>

        <form className="p-10 space-y-10" onSubmit={handleFinalRegister}>
          
          {/* Section 1: Account */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-purple-600 font-black text-[10px] uppercase tracking-[0.2em] ml-2">
              <User size={16} /> Personal Identity
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" placeholder="Full Legal Name" className="white-input" required />
              <input type="email" placeholder="Professional Email" className="white-input" required />
              <input type="password" placeholder="Create Password" className="white-input" required />
              <input type="password" placeholder="Confirm Password" className="white-input" required />
            </div>
          </section>

          {/* Section 2: Education */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-purple-600 font-black text-[10px] uppercase tracking-[0.2em] ml-2">
              <BookOpen size={16} /> Academic Background
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" placeholder="University / Institution" className="white-input" />
              <input type="text" placeholder="Degree / Field of Study" className="white-input" />
            </div>
          </section>

          {/* Section 3: Skills */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-purple-600 font-black text-[10px] uppercase tracking-[0.2em] ml-2">
              <Cpu size={16} /> Expertise & Skills
            </div>
            <div className="flex flex-wrap gap-3 p-5 border border-slate-100 rounded-[1.5rem] bg-slate-50 min-h-[100px] transition-all focus-within:bg-white shadow-inner">
              {skills.map((skill, index) => (
                <div key={index} className="bg-white text-slate-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border border-slate-200 shadow-sm">
                  {skill}
                  <button type="button" onClick={() => removeSkill(index)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <input 
                type="text" 
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Add skill..."
                className="bg-transparent outline-none text-slate-700 text-sm flex-1 min-w-[150px]"
              />
            </div>
          </section>

          {/* Section 4: Resume (Updated Upload UI) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-purple-600 font-black text-[10px] uppercase tracking-[0.2em] ml-2">
              <Upload size={16} /> Verification Documents
            </div>

            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              id="resume-upload" 
              accept=".pdf,.doc,.docx" 
              onChange={handleFileChange}
            />

            {!selectedFile ? (
              <label 
                htmlFor="resume-upload"
                className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 hover:border-purple-200 transition-all cursor-pointer group"
              >
                <div className="bg-white p-4 rounded-2xl text-purple-600 mb-4 group-hover:scale-110 shadow-sm border border-slate-100 transition-transform">
                  <Upload size={32} />
                </div>
                <p className="text-slate-900 font-bold tracking-tight">Upload Professional Resume</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">PDF format preferred (Max 5MB)</p>
                <div className="mt-4 px-8 py-2.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Select File</div>
              </label>
            ) : (
              <div className="border-2 border-solid border-purple-100 rounded-[2rem] p-8 flex items-center justify-between bg-purple-50/30 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-600 p-3 rounded-xl text-white shadow-lg shadow-purple-100">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-slate-900 font-bold text-sm truncate max-w-[250px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-purple-600 font-black uppercase tracking-widest">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Ready to verify
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={removeFile}
                  className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </section>

          <button 
            type="submit" 
            disabled={isRegistering}
            className="w-full bg-purple-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-purple-100 hover:bg-purple-700 transition-all transform active:scale-[0.98] tracking-[0.2em] text-xs uppercase flex items-center justify-center gap-3"
          >
            {isRegistering ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Create Professional Profile"
            )}
          </button>
        </form>
      </div>

      <style>{`
        .white-input {
          width: 100%; padding: 1.1rem 1.5rem; background: #f8fafc;
          border: 1px solid #e2e8f0; border-radius: 1.25rem;
          color: #0f172a; font-size: 0.9rem; font-weight: 600;
          outline: none; transition: all 0.3s;
        }
        .white-input:focus {
          border-color: #9333ea; background: white;
          box-shadow: 0 10px 25px -10px rgba(147, 51, 234, 0.2);
        }
      `}</style>
    </div>
  );
};

export default CandidateRegistration;