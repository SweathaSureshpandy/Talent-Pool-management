import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Users, Zap } from 'lucide-react';

const Intro = () => {
  const navigate = useNavigate();
  
  // High-quality professional background
  const bgImage = "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070";

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden font-sans text-white"
      style={{ 
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(88, 28, 135, 0.6)), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      
    >
      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Main Content */}
      <div className="z-10 text-center px-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6 animate-bounce">
          <Sparkles size={18} className="text-yellow-400" />
          <span className="text-sm font-bold tracking-widest uppercase">The Future of Hiring is Here</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
          Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Talent Pool</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          Bridging the gap between elite students and top-tier recruiters. 
          Verified data, seamless communication, and instant hiring.
        </p>

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
              <ShieldCheck className="text-purple-400" />
            </div>
            <span className="font-bold">Verified Profiles</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
              <Zap className="text-blue-400" />
            </div>
            <span className="font-bold">Quick Verification</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/10">
              <Users className="text-green-400" />
            </div>
            <span className="font-bold">Massive Network</span>
          </div>
        </div>

        {/* CTA Button */}
        <button 
          onClick={() => navigate('/home')} // Takes you to the Login/Home page
          className="group relative inline-flex items-center justify-center px-10 py-5 font-black text-white transition-all duration-200 bg-[#7c5dfa] rounded-2xl hover:bg-[#6a4dec] hover:shadow-[0_0_40px_rgba(124,93,250,0.5)] active:scale-95 shadow-2xl"
        >
          GET STARTED
          <ArrowRight className="ml-3 group-hover:translate-x-2 transition-transform" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-8 text-gray-400 text-xs font-bold tracking-[0.3em] uppercase">
        Built for Excellence • Talent Pool v3.0
      </div>
    </div>
  );
};
<style>{`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .animate-fade-up {
    animation: fadeInUp 0.8s ease-out forwards;
  }
`}</style>

export default Intro;
