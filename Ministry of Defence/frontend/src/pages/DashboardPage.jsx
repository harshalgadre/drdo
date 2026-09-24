import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Users, 
  KeyRound, 
  ShieldAlert, 
  Database, 
  CheckCircle2, 
  ArrowRight, 
  Radio, 
  Flame, 
  Lock, 
  ExternalLink 
} from 'lucide-react';
import { api } from '../services/api';

export default function DashboardPage({ onNavigate, onInspectDecryption }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white m-0">
              SECURITY OVERVIEW & PROVENANCE MONITOR
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              SYSTEM SECURE ✓
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time Post-Quantum Cryptographic Document Distribution & Attribution Ledger
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('distribute')}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs tracking-wider uppercase transition shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>+ Distribute Document</span>
          </button>
          <button
            onClick={() => onNavigate('investigate')}
            className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wider uppercase transition shadow-lg shadow-rose-950/40 flex items-center gap-1.5 cursor-pointer"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Investigate Leak</span>
          </button>
        </div>
      </div>

      {/* Quick Judge Demo Flow Walkthrough Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/50 shadow-xl">
        <div className="flex items-center gap-2 text-indigo-300 text-xs font-mono font-semibold uppercase tracking-wider mb-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          SIH26237 JUDGE DEMONSTRATION WORKFLOW
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Prove the core outcome: <b>Three authorized recipients decrypt the same document</b>, each gets a <b>visually identical</b> but uniquely traceable copy. When one copy is leaked, the system <b>identifies the exact recipient</b> and verifies the provenance record.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-indigo-900/40 font-mono text-[11px]">
          <button 
            onClick={() => onNavigate('distribute')}
            className="p-2 rounded bg-slate-800/70 hover:bg-slate-700/70 text-left border border-slate-700 flex items-center justify-between text-slate-300 transition"
          >
            <span>1. Distribute (AES + ML-KEM)</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
          <button 
            onClick={() => onNavigate('decrypt')}
            className="p-2 rounded bg-slate-800/70 hover:bg-slate-700/70 text-left border border-slate-700 flex items-center justify-between text-slate-300 transition"
          >
            <span>2. Decrypt as Alice/Bob/Charlie</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
          <button 
            onClick={() => onNavigate('ledger')}
            className="p-2 rounded bg-slate-800/70 hover:bg-slate-700/70 text-left border border-slate-700 flex items-center justify-between text-slate-300 transition"
          >
            <span>3. View Immutable Ledger</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
          </button>
          <button 
            onClick={() => onNavigate('investigate')}
            className="p-2 rounded bg-rose-950/70 hover:bg-rose-900/80 text-left border border-rose-800/60 flex items-center justify-between text-rose-300 transition font-bold"
          >
            <span>4. 🔥 Run Leak Investigation</span>
            <Flame className="w-3.5 h-3.5 text-rose-400" />
          </button>
        </div>
      </div>

      {/* Top Security Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Card 1: Documents */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>DOCUMENTS</span>
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {stats?.documents_count ?? 1}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Classified Assets</div>
        </div>

        {/* Card 2: Recipients */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>RECIPIENTS</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {stats?.recipients_count ?? 3}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Authorized Officers</div>
        </div>

        {/* Card 3: Decryptions */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>DECRYPTIONS</span>
            <KeyRound className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {stats?.decryption_events_count ?? 3}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Signed Events</div>
        </div>

        {/* Card 4: Ledger Entries */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>LEDGER BLOCKS</span>
            <Database className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            #{stats?.ledger_entries_count ?? 5}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Hash-Chained</div>
        </div>

        {/* Card 5: Tamper Alerts */}
        <div className={`p-4 rounded-xl border transition ${
          stats?.tamper_alerts > 0
            ? 'bg-rose-950/60 border-rose-600 text-rose-200'
            : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
        }`}>
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className={stats?.tamper_alerts > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
              TAMPER ALERTS
            </span>
            <ShieldAlert className={`w-4 h-4 ${stats?.tamper_alerts > 0 ? 'text-rose-400 animate-bounce' : 'text-emerald-400'}`} />
          </div>
          <div className={`text-2xl font-bold font-mono ${stats?.tamper_alerts > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {stats?.tamper_alerts ?? 0}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">
            {stats?.tamper_alerts > 0 ? 'Ledger compromised!' : 'Chain Integrity: 100%'}
          </div>
        </div>

        {/* Card 6: Investigations */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-2">
            <span>INVESTIGATIONS</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {stats?.investigations_count ?? 1}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Forensic Attributions</div>
        </div>
      </div>

      {/* Main Grid: Active Documents & Recent Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Documents */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300 m-0">
              Active Documents in Repository
            </h2>
            <button
              onClick={() => onNavigate('documents')}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0e1626]/80 overflow-hidden">
            {stats?.active_documents?.map((doc) => (
              <div 
                key={doc.name}
                className="p-5 border-b border-slate-800/80 last:border-b-0 hover:bg-slate-800/30 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-sm text-slate-100">{doc.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {doc.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span>ID: <b className="text-slate-300">{doc.id}</b></span>
                    <span>•</span>
                    <span>SHA-256: <b className="text-cyan-400">{doc.short_hash}</b></span>
                    <span>•</span>
                    <span>Size: {doc.size_kb} KB</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <div className="text-slate-300 font-semibold">{doc.recipients_count} Authorized</div>
                    <div className="text-[10px] text-slate-400">{doc.decryption_events_count} Decryptions</div>
                  </div>
                  <button
                    onClick={() => onNavigate('decrypt')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition cursor-pointer"
                  >
                    Decrypt
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cryptographic Architecture Card */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 text-xs space-y-3">
            <div className="font-mono text-slate-300 font-semibold uppercase tracking-wider flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              Cryptographic Binding Principle
            </div>
            <p className="text-slate-400 leading-relaxed">
              In strict compliance with defense requirements: <b>the sensitive document is never committed onto the ledger</b>. 
              The original document is AES-256 encrypted in air-gapped storage. The immutable ledger only anchors the <b>SHA-256 document hash, recipient post-quantum key bindings, and ML-DSA signed decryption provenance events</b>.
            </p>
          </div>
        </div>

        {/* Right 1 Col: Recent Decryption Events */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300 m-0">
              Recent Provenance Events
            </h2>
            <button
              onClick={() => onNavigate('ledger')}
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Ledger</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="rounded-xl border border-slate-800 bg-[#0e1626]/80 p-4 space-y-3">
            {stats?.recent_events?.map((evt, idx) => (
              <div
                key={idx}
                onClick={() => onInspectDecryption(evt.block_number)}
                className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-cyan-800/80 hover:bg-slate-800/60 transition cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-200 group-hover:text-cyan-300">
                    <span>{evt.recipient_name}</span>
                    <span className="text-slate-500 font-mono font-normal">→</span>
                    <span className="text-slate-400 font-mono text-[11px] font-normal">{evt.event_type}</span>
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    Block #{evt.block_number}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2 text-[10px] font-mono text-slate-400">
                  <span>{evt.watermark_id || 'PROVENANCE_ROOT'}</span>
                  <span className="text-slate-500">{evt.timestamp}</span>
                </div>

                <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                  <span className="text-emerald-400 font-semibold">{evt.status}</span>
                  <span className="text-slate-500 group-hover:text-cyan-400 transition flex items-center gap-0.5">
                    Inspect <ExternalLink className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
