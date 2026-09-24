import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DocumentsPage from './pages/DocumentsPage';
import RecipientsPage from './pages/RecipientsPage';
import DistributePage from './pages/DistributePage';
import DecryptPage from './pages/DecryptPage';
import DecryptionDetailsPage from './pages/DecryptionDetailsPage';
import LedgerPage from './pages/LedgerPage';
import InvestigatePage from './pages/InvestigatePage';
import CertificateModal from './components/CertificateModal';
import { api } from './services/api';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Default logged in for immediate hackathon judge demo
  const [currentUser, setCurrentUser] = useState({
    id: 'R001',
    username: 'officer.alice',
    name: 'Alice',
    role: 'Strategic Operations Officer',
    department: 'Defence Strategic Planning Staff',
    clearance: 'TOP SECRET // STRAT-OPS',
    status: 'Active',
    avatar: 'A'
  });

  const [currentTab, setCurrentTab] = useState('dashboard');
  const [selectedBlockNumber, setSelectedBlockNumber] = useState(181);
  const [preloadedLeakFilename, setPreloadedLeakFilename] = useState(null);
  const [certificateData, setCertificateData] = useState(null);
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const s = await api.getStatus();
      setSystemStatus(s);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoginSuccess = async (username) => {
    try {
      const res = await api.login(username);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        setIsLoggedIn(true);
        setCurrentTab('dashboard');
      }
    } catch (e) {
      console.error(e);
      setIsLoggedIn(true);
    }
  };

  const handleSwitchUser = async (username) => {
    try {
      const res = await api.login(username);
      if (res.success && res.user) {
        setCurrentUser(res.user);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleInspectDecryption = (blockNumber) => {
    setSelectedBlockNumber(blockNumber || 181);
    setCurrentTab('decryptions');
  };

  const handleSimulateLeak = (filename) => {
    setPreloadedLeakFilename(filename);
    setCurrentTab('investigate');
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        systemStatus={systemStatus}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          alertsCount={systemStatus?.tamper_alerts || 0}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#080d18]">
          {currentTab === 'dashboard' && (
            <DashboardPage
              onNavigate={setCurrentTab}
              onInspectDecryption={handleInspectDecryption}
            />
          )}

          {currentTab === 'documents' && (
            <DocumentsPage onNavigate={setCurrentTab} />
          )}

          {currentTab === 'recipients' && (
            <RecipientsPage />
          )}

          {currentTab === 'distribute' && (
            <DistributePage onNavigate={setCurrentTab} />
          )}

          {currentTab === 'decrypt' && (
            <DecryptPage
              currentUser={currentUser}
              onSwitchUser={handleSwitchUser}
              onInspectDecryption={handleInspectDecryption}
              onSimulateLeak={handleSimulateLeak}
            />
          )}

          {currentTab === 'decryptions' && (
            <DecryptionDetailsPage
              blockNumber={selectedBlockNumber}
              onBack={() => setCurrentTab('dashboard')}
            />
          )}

          {currentTab === 'ledger' && (
            <LedgerPage
              onInspectBlock={handleInspectDecryption}
            />
          )}

          {currentTab === 'investigate' && (
            <InvestigatePage
              preloadedLeakFilename={preloadedLeakFilename}
              onViewCertificate={(data) => setCertificateData(data)}
            />
          )}
        </main>
      </div>

      {/* Forensic Certificate Modal */}
      {certificateData && (
        <CertificateModal
          certificateData={certificateData}
          onClose={() => setCertificateData(null)}
        />
      )}
    </div>
  );
}
