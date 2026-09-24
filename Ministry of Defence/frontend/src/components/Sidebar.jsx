import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Share2, 
  KeyRound, 
  FileCheck2, 
  Database, 
  Flame, 
  Award,
  ShieldAlert
} from 'lucide-react';

export default function Sidebar({ currentTab, onSelectTab, alertsCount = 0 }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'documents', label: 'Documents', icon: FileText, badge: null },
    { id: 'recipients', label: 'Recipients', icon: Users, badge: null },
    { id: 'distribute', label: 'Distribute', icon: Share2, badge: 'PQC' },
    { id: 'decrypt', label: 'Recipient Decrypt', icon: KeyRound, badge: 'Core' },
    { id: 'decryptions', label: 'Provenance Details', icon: FileCheck2, badge: null },
    { id: 'ledger', label: 'Immutable Ledger', icon: Database, badge: 'DLT' },
    { id: 'investigate', label: 'Leak Investigation', icon: Flame, badge: 'MONEY SHOT', highlight: true },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-[#090e17] flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
          NAVIGATION PROTOCOL
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? item.highlight
                    ? 'bg-rose-950/80 text-rose-300 border border-rose-700/60 shadow-lg shadow-rose-950/40'
                    : 'bg-cyan-950/70 text-cyan-300 border border-cyan-800/60 shadow-sm'
                  : item.highlight
                    ? 'text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 border border-transparent'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? (item.highlight ? 'text-rose-400' : 'text-cyan-400') : (item.highlight ? 'text-rose-400' : 'text-slate-500')
                }`} />
                <span className={item.highlight ? 'font-semibold' : ''}>{item.label}</span>
              </div>

              {item.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                  item.highlight
                    ? 'bg-rose-600 text-white animate-pulse'
                    : isActive
                      ? 'bg-cyan-900/80 text-cyan-300 border border-cyan-700/60'
                      : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Mission / Air-Gapped Terminal Status */}
      <div className="p-4 m-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-2">
        <div className="flex items-center justify-between text-slate-400">
          <span className="flex items-center gap-1.5 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            AIR-GAP LINK
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
        </div>
        <div className="text-[11px] text-slate-500 leading-tight">
          Lattice PQC Anchor: ML-KEM-512 & ML-DSA-44 synchronized with hardware security profile.
        </div>
      </div>
    </aside>
  );
}
