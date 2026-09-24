import React from 'react';
import { Shield, Lock, Radio, Bell, User, Cpu, ChevronDown } from 'lucide-react';

export default function Navbar({ currentUser, onSwitchUser, systemStatus }) {
  const users = [
    { username: 'officer.alice', name: 'Alice', id: 'R001', role: 'Strategic Ops' },
    { username: 'officer.bob', name: 'Bob', id: 'R002', role: 'Naval Intel' },
    { username: 'officer.charlie', name: 'Charlie', id: 'R003', role: 'Tactical Cmd' },
    { username: 'investigator.admin', name: 'Admin / Investigator', id: 'ADM-001', role: 'Forensics Lead' }
  ];

  return (
    <header className="h-16 border-b border-slate-800 bg-[#0c121e]/95 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Emblem and System Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-600 to-rose-700 p-0.5 shadow-lg flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-100 tracking-wider text-sm md:text-base">
              MINISTRY OF DEFENCE
            </span>
            <span className="text-[10px] bg-red-950/80 text-red-400 border border-red-800/60 font-mono px-1.5 py-0.5 rounded tracking-widest font-semibold uppercase">
              TOP SECRET
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono hidden sm:block">
            SIH26237 • Quantum-Resilient Provenance & Forensic Attribution Engine
          </p>
        </div>
      </div>

      {/* Right: Operational Status & Current User Identity */}
      <div className="flex items-center gap-4">
        {/* Offline / Air-Gapped Mode Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-700/50 text-emerald-400 text-xs font-mono font-medium shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>OFFLINE / AIR-GAPPED MODE</span>
        </div>

        {/* PQC Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700/60 text-slate-300 text-xs font-mono">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>ML-KEM-512 / ML-DSA-44</span>
        </div>

        {/* User Identity Switcher Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs transition">
            <div className="w-6 h-6 rounded-full bg-cyan-700 flex items-center justify-center text-cyan-100 font-bold text-xs">
              {currentUser?.avatar || 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <div className="font-semibold text-slate-200 text-xs">{currentUser?.name || 'Officer'}</div>
              <div className="text-[10px] text-slate-400 font-mono">{currentUser?.id || 'R001'}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Switcher Dropdown */}
          <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-2 hidden group-hover:block z-50">
            <div className="px-2 py-1 text-[11px] font-mono text-slate-400 border-b border-slate-800 mb-1">
              SWITCH SIMULATED IDENTITY
            </div>
            {users.map(u => (
              <button
                key={u.username}
                onClick={() => onSwitchUser(u.username)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition ${
                  currentUser?.username === u.username
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div>{u.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{u.role}</div>
                </div>
                <span className="font-mono text-[10px] px-1 py-0.5 rounded bg-slate-800 text-slate-400">
                  {u.id}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button className="p-2 text-slate-400 hover:text-slate-200 transition" title="Security Alerts">
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
