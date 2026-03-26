import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Intro from './components/Intro';
import Home from './components/Home';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import HrDashboard from './components/HrDashboard'
import CandidateRegistration from './components/CandidateRegistration';
import HrRegistration from './components/HrRegistration';
import CandidateDashboard from './components/CandidateDashboard';

// Helper component to fix scroll position on navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <Router>
      <ScrollToTop /> {/* Ensures users start at the top of the registration forms */}
      <Routes>
        {/* Entrance */}
        <Route path="/" element={<Intro />} />
        
        {/* Login Page */}
        <Route path="/home" element={<Home />} />
        
        {/* Selection Page (Student vs Recruiter) */}
        <Route path="/register" element={<Register />} />
        
        {/* Specific Registration Flows */}
        <Route path="/register/candidate" element={<CandidateRegistration />} />
        <Route path="/register/hr" element={<HrRegistration />} />
        
        {/* Main Dashboard */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
        <Route path="/hr/dashboard" element={<HrDashboard />} />
      </Routes>
    </Router>
  );
}


export default App;