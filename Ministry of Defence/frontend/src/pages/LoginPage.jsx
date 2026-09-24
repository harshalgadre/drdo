import React, { useState } from 'react';
import { Shield, Lock, User, Key, CheckCircle, Radio, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLoginSuccess }) {
  const [selectedUser, setSelectedUser] = useState('officer.alice');
  const [password, setPassword] = useState('••••••••••••');

  const simulatedProfiles = [
    {
      username: 'officer.alice',
      name: 'Officer Alice',
      id: 'R001',
      role: 'Strategic Operations Officer',
      dept: 'Defence Strategic Planning Staff',
      clearance: 'TOP SECRET // STRAT-OPS',
      keyAlgo: 'ML-KEM-512 & ML-DSA-44'
    },
    {
      username: 'officer.bob',
      name: 'Officer Bob',
      id: 'R002',
      role: 'Naval Intelligence Analyst',
      dept: 'Directorate of Naval Intelligence',
      clearance: 'TOP SECRET // NAV-INTEL',
      keyAlgo: 'ML-KEM-512 & ML-DSA-44'
    },
    {
      username: 'officer.charlie',
      name: 'Officer Charlie',
      id: 'R003',
      role: 'Tactical Command Lead',
      dept: 'Joint Tactical Operations Command',
      clearance: 'TOP SECRET // TAC-CMD',
      keyAlgo: 'ML-KEM-512 & ML-DSA-44'
    },
    {
      username: 'investigator.admin',
      name: 'Admin / Investigator',
      id: 'ADM-001',
      role: 'Chief Forensic Investigator',
      dept: 'DRDO Cyber & Counter-Intelligence Division',
      clearance: 'COSMIC // SPECIAL FORENSIC AUTHORITY',
      keyAlgo: 'ML-KEM-512 & ML-DSA-44'
    }
  ];

  const handleLogin = (e) => {
    e?.preventDefault();
    onLoginSuccess(selectedUser);
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-200 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background ambient grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* Glow orb */}
      <div className="absolute w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -bottom-20 -right-20"></div>

      <div className="relative w-full max-w-xl bg-[#0e1626]/90 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur-xl">
        {/* Emblem & Header */}
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-amber-600 via-rose-700 to-indigo-700 shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white m-0">
              SECURE DOCUMENT DISTRIBUTION
            </h1>
            <h2 className="text-base md:text-lg font-semibold tracking-wider text-cyan-400 mt-1 m-0">
              & ATTRIBUTION SYSTEM
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-2">
              Ministry of Defence • Post-Quantum Cryptographic Provenance Infrastructure
            </p>
          </div>
        </div>

        {/* Quick Identity Selector */}
        <div className="space-y-4 mb-6">
          <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 block">
            Select Simulated Recipient Identity
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {simulatedProfiles.map((p) => {
              const isSelected = selectedUser === p.username;
              return (
                <button
                  type="button"
                  key={p.username}
                  onClick={() => setSelectedUser(p.username)}
                  className={`p-3 rounded-xl text-left border transition-all relative ${
                    isSelected
                      ? 'bg-cyan-950/70 border-cyan-500 shadow-md shadow-cyan-950/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-100">{p.name}</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {p.id}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-1">{p.role}</div>
                  <div className="text-[9px] font-mono text-cyan-400/90 mt-1 flex items-center gap-1">
                    <Key className="w-2.5 h-2.5" />
                    PQC Enclave Ready
                  </div>
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-cyan-400 flex items-center justify-center text-slate-900">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Login form fields */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5">User ID</label>
            <div className="relative">
              <input
                type="text"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition"
              />
              <User className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-slate-400 block mb-1.5">Cryptographic Pin / Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700 text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 font-bold text-xs uppercase tracking-wider text-white shadow-lg shadow-cyan-950/60 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>AUTHENTICATE & ENTER SYSTEM</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Offline Badge Footer */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>OFFLINE / AIR-GAPPED MODE</span>
          </div>
          <span className="text-slate-500">SIH PROBLEM #26237</span>
        </div>
      </div>
    </div>
  );
}
