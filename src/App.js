import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import HowItWorks from "./pages/HowItWorks.jsx";
import GetStarted from "./pages/GetStarted.jsx";
import Contact from "./pages/Contact.jsx";
import ApplyLoan from "./ApplyLoan.jsx";
import BorrowerDashboard from "./BorrowerDashboard.jsx";
import { syncPendingLoans } from './services/sync';

function App() {
  useEffect(() => {
    // When internet comes back - sync pending loans
    window.addEventListener('online', handleSync);
    return () => window.removeEventListener('online', handleSync);
  }, []);

  const handleSync = async () => {
    console.log('📶 Back online — syncing data with AWS...');
    
    const result = await syncPendingLoans();
    
    if (result.successCount > 0) {
      console.log(`✅ Successfully synced ${result.successCount} loans to AWS`);
      // Optional: Show a subtle notification instead of alert
    }
    if (result.failCount > 0) {
      console.warn(`⚠️ Failed to sync ${result.failCount} loans`);
    }
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/howitworks" element={<HowItWorks />} />
            <Route path="/getstarted" element={<GetStarted />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/apply-loan" element={<ApplyLoan />} />
            <Route path="/dashboard" element={<BorrowerDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

