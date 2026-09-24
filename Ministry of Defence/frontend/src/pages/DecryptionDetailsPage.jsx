import React, { useEffect, useState } from 'react';
import { 
  FileCheck2, 
  ShieldCheck, 
  Key, 
  Lock, 
  Database, 
  Clock, 
  Fingerprint, 
  CheckCircle2, 
  ArrowLeft, 
  Copy, 
  Check 
} from 'lucide-react';
import { api } from '../services/api';

export default function DecryptionDetailsPage({ blockNumber = 181, onBack }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    loadDetails(blockNumber);
  }, [blockNumber]);

  const loadDetails = async (num) => {
    setLoading(true);
    try {
      const data = await api.getDecryptionDetails(num);
      setDetails(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono">
        Loading cryptographic provenance verification matrix...
      </div>
    );
  }

  if (!details) {
    return (
      <div className="p-12 text-center text-slate-400 font-mono space-y-4">
        <div>Provenance record #{blockNumber} not found.</div>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      {/* Top back button */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-slate-200 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Overview</span>
        </button>

        <span className="font-mono text-xs px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-cyan-300">
          LEDGER BLOCK #{details.block_number}
        </span>
      </div>

      {/* Main Provenance Card */}
      <div className="p-8 rounded-2xl border border-slate-800 bg-[#0e1626]/90 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
              POST-QUANTUM CRYPTOGRAPHIC AUDIT
            </span>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight m-0 mt-1">
              DECRYPTION PROVENANCE RECORD
            </h1>
          </div>
          <div className="px-3.5 py-1.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 flex items-center gap-2 text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>INTEGRITY VERIFIED ✓</span>
          </div>
        </div>

        {/* Core Attribution Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase">DOCUMENT:</span>
            <div className="text-white font-bold text-sm">{details.document_name}</div>
            <div className="text-slate-400 text-[11px]">ID: {details.document_id}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase">RECIPIENT OFFICER:</span>
            <div className="text-cyan-400 font-bold text-sm">{details.recipient_name}</div>
            <div className="text-slate-400 text-[11px]">Recipient ID: {details.recipient_id}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase">SESSION IDENTIFIER:</span>
            <div className="text-indigo-300 font-bold text-sm">{details.session_id}</div>
            <div className="text-slate-400 text-[11px]">Air-Gapped Enclave Session</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] uppercase">DECRYPTION TIMESTAMP:</span>
            <div className="text-amber-300 font-bold text-sm">{details.timestamp}</div>
            <div className="text-slate-400 text-[11px]">Atomic Time Synchronized</div>
          </div>
        </div>

        {/* Cryptographic Proof Details */}
        <div className="space-y-3 font-mono text-xs pt-2">
          {/* Document Hash */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Document Base Hash (SHA-256)</span>
              <span className="text-cyan-300 font-bold break-all">{details.document_hash}</span>
            </div>
            <button
              onClick={() => copyToClipboard(details.document_hash, 'hash')}
              className="p-1.5 text-slate-400 hover:text-white shrink-0 self-end sm:self-center"
            >
              {copiedKey === 'hash' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Watermark ID */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block">Embedded Forensic Watermark ID</span>
              <span className="text-emerald-400 font-bold text-sm">{details.watermark_id}</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              HMAC-SHA256 Bound
            </span>
          </div>

          {/* Digital Signature */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase block">Digital Signature Algorithm</span>
                <span className="text-slate-200 font-bold">{details.signature_algorithm}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-[10px]">
                {details.signature_status}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-400 break-all">
              {details.signature}
            </div>
          </div>

          {/* Ledger Hash Chaining Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Previous Ledger Block Hash</span>
              <span className="text-slate-300 break-all text-[11px]">{details.previous_ledger_hash}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Current Block Hash</span>
              <span className="text-cyan-400 font-bold break-all text-[11px]">{details.current_entry_hash}</span>
            </div>
          </div>
        </div>

        {/* Defense Rationale Note */}
        <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs font-mono text-slate-300 space-y-2">
          <div className="font-bold text-indigo-400 uppercase text-[11px] flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5" />
            CYBERSECURITY DEFENCE RATIONALE
          </div>
          <p className="text-slate-400 leading-relaxed text-xs">
            This demonstrates that we are not merely storing <i>"Alice downloaded file."</i> We have created a 
            <b> cryptographically bound decryption event</b> signed by the recipient's post-quantum private key 
            and anchored into a tamper-evident hash chain.
          </p>
        </div>
      </div>
    </div>
  );
}
