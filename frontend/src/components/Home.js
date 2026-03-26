import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Chrome, UserPlus, ShieldCheck, Globe, Loader2 } from 'lucide-react';

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const GOOGLE_CLIENT_ID = "245690543736-8apb2t2avog9ee188so4ijp3u1ujf59m.apps.googleusercontent.com";

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (res.ok) {
        if (data.token) localStorage.setItem("token", data.token);
        
        if (data.role === "student") navigate("/candidate/dashboard");
        else if (data.role === "hr") navigate("/hr/dashboard");
        else if (data.role === "admin") navigate("/admin/dashboard");
        else navigate("/"); 
      } else {
        alert(data.message || "Invalid Credentials ❌");
      }
    } catch (error) {
      alert("Server connection error ❌");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!window.google) return;
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'openid email profile',
      callback: (tokenResponse) => {
        if (tokenResponse?.access_token) {
          setIsLoggingIn(true);
          setTimeout(() => navigate("/admin/dashboard"), 1000);
        }
      },
    });
    client.requestAccessToken({ prompt: 'select_account' });
  };

  return (
    // Updated: Changed background to solid white and text to slate
    <div className="min-h-screen flex flex-col items-center justify-center relative font-sans overflow-hidden bg-white text-slate-900">
      
      {/* Background soft blurs for depth */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

      {/* Navigation to Register */}
      <div className="absolute top-8 right-8 z-20">
        <button 
          onClick={() => navigate('/register')}
          className="flex items-center gap-2 bg-slate-50 text-slate-700 border border-slate-200 px-6 py-2.5 rounded-full font-bold hover:bg-slate-100 transition-all shadow-sm active:scale-95"
        >
          <UserPlus size={18} /> Join Us
        </button>
      </div>

      <div className="z-10 w-full max-w-md px-4 animate-in fade-in zoom-in duration-500">
        {/* Card updated: White background with subtle border and soft shadow */}
        <div className="bg-white p-10 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-3xl shadow-lg mb-4 transform -rotate-12 hover:rotate-0 transition-transform duration-300">
              <Globe className="text-white" size={40} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
              Talent <span className="text-purple-600">Pool</span>
            </h1>
            <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">Enterprise Auth Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-4 text-slate-400" size={20} />
                <input 
                  type="email" 
                  placeholder="admin@talentpool.com"
                  className="input-style"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-4 text-slate-400" size={20} />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="input-style"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-slate-900 hover:bg-black text-white font-black py-4 rounded-2xl shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 tracking-widest"
            >
              {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : 'SIGN IN'}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="px-4 text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">Secure OAuth</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-slate-200 py-4 rounded-2xl hover:bg-slate-50 transition-all text-slate-700 font-bold bg-white active:scale-95"
          >
            <Chrome size={20} className="text-red-500" />
            Continue with Google
          </button>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest opacity-60">
        <ShieldCheck size={14} className="text-emerald-500" /> Certified Secure Authentication
      </div>

      <style>{`
        .input-style {
          width: 100%; padding-left: 3.5rem; padding-right: 1rem; padding-top: 1rem; padding-bottom: 1rem;
          background-color: #f8fafc; border: 1px solid #e2e8f0;
          border-radius: 1.25rem; color: #0f172a; outline: none; transition: all 0.3s;
        }
        .input-style:focus {
          background-color: white; border-color: #818cf8; box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.1);
        }
        .input-style::placeholder {
          color: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default Home;