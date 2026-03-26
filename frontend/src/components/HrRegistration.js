import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ArrowLeft, Building2, ShieldCheck, Mail, Briefcase, Loader2, X, CheckCircle2 } from 'lucide-react';

const HrRegistration = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // States
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle Removing File
  const removeFile = (e) => {
    e.preventDefault();
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleHrRegister = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Note: Adjust indices if you add more fields
    const formData = {
      user_name: e.target[0].value,
      email: e.target[1].value,
      password: e.target[2].value,
      role: "hr",
      company_name: e.target[3].value,
      company_website: e.target[4].value,
      industry_type: e.target[5].value,
      file_name: selectedFile ? selectedFile.name : null
    };

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("HR Registered Successfully ✅");
        navigate("/hr/dashboard");
      } else {
        const data = await res.json();
        alert(data.message || "Registration Failed ❌");
      }
    } catch (err) {
      alert("Server Error ❌");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-12 px-4 relative font-sans text-slate-900">

      {/* Decorative soft blue blur orb */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-blue-50 rounded-full blur-[120px] pointer-events-none opacity-70"></div>

      {/* Header / Nav */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 z-10">
        <div className="flex items-center gap-2 text-slate-900 font-black text-2xl tracking-tighter">
          <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-100">
            <Globe size={24} className="text-white" />
          </div>
          Talent<span className="text-blue-600">Pool</span>
        </div>
        <button
          onClick={() => navigate('/register')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-[10px] uppercase tracking-widest transition-all"
        >
          <ArrowLeft size={16} /> Back to Selection
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-slate-100 overflow-hidden z-10 animate-in fade-in slide-in-from-bottom-5 duration-700">

        {/* Card Header */}
        <div className="p-10 border-b border-slate-50 text-center bg-slate-50/50">
          <div className="inline-flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full border border-blue-200 mb-4">
            <ShieldCheck size={14} className="text-blue-600" />
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Employer Verification</span>
          </div>
          <h1 className="text-3xl font-black text-slate-950 tracking-tight">Employer Account</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium">Register your organization to access verified talent.</p>
        </div>

        <form className="p-10 space-y-10" onSubmit={handleHrRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Left Column: Personal Identity */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] ml-2">
                <Mail size={16} /> HR Identity
              </div>
              <input type="text" placeholder="Full Name" className="white-input-blue" required />
              <input type="email" placeholder="Work Email (@company)" className="white-input-blue" required />
              <input type="password" placeholder="Password" className="white-input-blue" required />
            </div>

            {/* Right Column: Company Credentials */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] ml-2">
                <Building2 size={16} /> Company Credentials
              </div>
              <input type="text" placeholder="Legal Entity Name" className="white-input-blue" required />
              <input type="url" placeholder="Company Website URL" className="white-input-blue" />
              <div className="relative">
                <select className="white-input-blue appearance-none pr-10 cursor-pointer" required>
                  <option value="" className="text-slate-400">Industry Type</option>
                  <option value="tech">Technology</option>
                  <option value="health">Healthcare</option>
                  <option value="finance">Finance</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <ArrowLeft size={14} className="-rotate-90" />
                </div>
              </div>
            </div>
          </div>

          {/* Verification Docs Section (Updated Upload UI) */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] ml-2">
              <ShieldCheck size={16} /> Business Authentication
            </div>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              id="incorp-upload"
              accept=".pdf,.jpg,.png"
              onChange={handleFileChange}
            />

            {!selectedFile ? (
              /* EMPTY STATE */
              <label
                htmlFor="incorp-upload"
                className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 hover:border-blue-200 transition-all cursor-pointer group"
              >
                <div className="bg-white p-4 rounded-2xl text-blue-600 mb-3 group-hover:scale-110 shadow-sm border border-slate-100 transition-transform">
                  <Briefcase size={32} />
                </div>
                <p className="text-slate-900 font-bold tracking-tight">Upload Incorporation Certificate</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">Business ID / License (PDF/JPG)</p>
                <div className="mt-4 px-8 py-2.5 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">Select File</div>
              </label>
            ) : (
              /* UPLOADED STATE */
              <div className="border-2 border-solid border-blue-100 rounded-[2rem] p-8 flex items-center justify-between bg-blue-50/30 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-600 p-3 rounded-xl text-white shadow-lg shadow-blue-100">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="text-left">
                    <p className="text-slate-900 font-bold text-sm truncate max-w-[250px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">
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

          {/* Registration Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all transform active:scale-[0.98] tracking-[0.2em] text-xs uppercase flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Verifying Business...
              </>
            ) : (
              "Complete Registration"
            )}
          </button>
        </form>
      </div>

      <style>{`
        .white-input-blue {
          width: 100%; 
          padding: 1.1rem 1.5rem; 
          background: #f8fafc;
          border: 1px solid #e2e8f0; 
          border-radius: 1.25rem;
          color: #0f172a; 
          font-size: 0.9rem; 
          font-weight: 600;
          outline: none; 
          transition: all 0.3s;
        }
        .white-input-blue:focus {
          border-color: #2563eb; 
          background: white;
          box-shadow: 0 10px 25px -10px rgba(37, 99, 235, 0.2);
          transform: translateY(-1px);
        }
        .white-input-blue::placeholder { color: #94a3b8; font-weight: 500; }
      `}</style>
    </div>
  );
};

export default HrRegistration;