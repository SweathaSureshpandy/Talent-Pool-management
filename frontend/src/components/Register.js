import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, ArrowLeft, Fingerprint } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();

  return (
    // Updated: Background changed to solid white, text to slate-900
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans bg-white relative overflow-hidden">
      
      {/* Decorative background soft blurs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-50 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-60"></div>

      {/* Back Navigation */}
      <button 
        onClick={() => navigate('/')} 
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-black text-xs tracking-widest uppercase"
      >
        <ArrowLeft size={16} /> Exit to Login
      </button>

      {/* Main Selection Area */}
      <div className="z-10 text-center animate-in fade-in slide-in-from-bottom-10 duration-1000">
         <div className="inline-flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100 mb-6 shadow-sm">
            <Fingerprint size={16} className="text-purple-600" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Identity Authentication Required</span>
         </div>
         
         <h1 className="text-6xl font-black text-slate-900 mb-10 tracking-tighter">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Portal</span>
         </h1>
         
         {/* Container updated for white theme */}
         <div className="bg-white p-4 rounded-[3.5rem] flex border border-slate-100 w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
            
            {/* STUDENT BUTTON */}
            <button 
              onClick={() => navigate('/register/candidate')} 
              className="flex-1 py-16 rounded-[3rem] hover:bg-purple-50 transition-all group flex flex-col items-center border border-transparent hover:border-purple-100"
            >
              <div className="bg-purple-100 p-6 rounded-3xl mb-4 group-hover:scale-110 group-hover:bg-purple-600 transition-all duration-300">
                <User size={48} className="text-purple-600 group-hover:text-white" />
              </div>
              <span className="text-slate-900 font-black text-xl tracking-tight">STUDENT</span>
              <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-widest">Verified Profiles</p>
            </button>

            <div className="w-[1px] bg-slate-100 my-10"></div>

            {/* RECRUITER BUTTON */}
            <button 
              onClick={() => navigate('/register/hr')} 
              className="flex-1 py-16 rounded-[3rem] hover:bg-blue-50 transition-all group flex flex-col items-center border border-transparent hover:border-blue-100"
            >
              <div className="bg-blue-100 p-6 rounded-3xl mb-4 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-300">
                <Briefcase size={48} className="text-blue-600 group-hover:text-white" />
              </div>
              <span className="text-slate-900 font-black text-xl tracking-tight">RECRUITER</span>
              <p className="text-slate-400 text-[10px] font-bold mt-2 uppercase tracking-widest">Corporate Access</p>
            </button>
         </div>

         <p className="mt-10 text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
            Step 1 of 2: Role Selection
         </p>
      </div>
    </div>
  );
};

export default Register;