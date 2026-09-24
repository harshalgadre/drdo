import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Lock, 
  Cpu, 
  Key, 
  Radio, 
  CheckCircle, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { api } from '../services/api';

export default function DistributePage({ onNavigate }) {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState('DEFENCE_REPORT.pdf');
  const [recipients, setRecipients] = useState([
    { id: 'R001', name: 'Alice', checked: true, role: 'Strategic Operations' },
    { id: 'R002', name: 'Bob', checked: true, role: 'Naval Intelligence' },
    { id: 'R003', name: 'Charlie', checked: true, role: 'Tactical Command' },
    { id: 'R004', name: 'David', checked: false, role: 'Defence R&D' },
  ]);

  const [distributing, setDistributing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.getDocuments().then(data => {
      setDocuments(data);
      if (data.length > 0) {
        setSelectedDoc(data[0].name);
      }
    }).catch(console.error);
  }, []);

  const toggleRecipient = (id) => {
    setRecipients(prev => prev.map(r => r.id === id ? { ...r, checked: !r.checked } : r));
  };

  const handleDistribute = async () => {
    const selectedIds = recipients.filter(r => r.checked).map(r => r.id);
    if (selectedIds.length === 0) {
      alert("Please select at least one recipient");
      return;
    }

    setDistributing(true);
    setResult(null);

    try {
      const res = await api.distributeDocument({
        document_name: selectedDoc,
        recipient_ids: selectedIds
      });
      setResult(res);
    } catch (e) {
      alert("Distribution error: " + e.message);
    } finally {
      setDistributing(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white m-0">
          DISTRIBUTE DOCUMENT
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Post-Quantum Key Establishment (ML-KEM) & Authenticated Dissemination
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form */}
        <div className="md:col-span-2 space-y-6">
          {/* Document selection */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#0e1626]/80 space-y-4">
            <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 block">
              Document Selection
            </label>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-sm font-mono text-slate-200 focus:outline-none focus:border-cyan-500 transition"
            >
              {documents.map((d) => (
                <option key={d.name} value={d.name}>
                  {d.name} ({d.id || 'DOC-2026-001'})
                </option>
              ))}
            </select>
          </div>

          {/* Authorized Recipients Checkboxes */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#0e1626]/80 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
                Authorized Recipients
              </label>
              <span className="text-[11px] font-mono text-cyan-400">
                {recipients.filter(r => r.checked).length} Selected
              </span>
            </div>

            <div className="space-y-2">
              {recipients.map((rec) => (
                <div
                  key={rec.id}
                  onClick={() => toggleRecipient(rec.id)}
                  className={`p-3 rounded-lg border transition cursor-pointer flex items-center justify-between ${
                    rec.checked
                      ? 'bg-cyan-950/40 border-cyan-700/80 text-slate-100'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                      rec.checked ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'border-slate-700 bg-slate-800'
                    }`}>
                      {rec.checked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold font-sans">{rec.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{rec.role}</div>
                    </div>
                  </div>
                  <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {rec.id}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Parameters */}
          <div className="p-5 rounded-xl border border-slate-800 bg-[#0e1626]/80 space-y-3 font-mono text-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Cryptographic Security Profile
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Algorithm:</span>
                <span className="text-emerald-400 font-bold">AES-256-GCM</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Key Exchange:</span>
                <span className="text-cyan-400 font-bold">ML-KEM-512</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Signature:</span>
                <span className="text-indigo-400 font-bold">ML-DSA-44</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Watermark:</span>
                <span className="text-emerald-400 font-bold">● Enabled</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Ledger:</span>
                <span className="text-emerald-400 font-bold">● Enabled</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Mode:</span>
                <span className="text-emerald-400 font-bold">● Offline / Air-Gapped</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDistribute}
            disabled={distributing}
            className="w-full py-3.5 rounded-lg bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 font-bold text-xs uppercase tracking-wider text-white shadow-xl shadow-cyan-950/60 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Share2 className="w-4 h-4" />
            <span>{distributing ? 'DISTRIBUTING VIA PQC...' : 'DISTRIBUTE DOCUMENT'}</span>
          </button>
        </div>

        {/* Right 1 Col: Backend Flow Visualization & Result */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-[#0e1626]/90 shadow-xl space-y-4 text-xs font-mono">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
              Distribution Architecture Flow
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center">
                Original Document
              </div>
              <div className="text-center text-slate-500 text-xs">↓</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center text-cyan-400">
                Generate Document Hash (SHA-256)
              </div>
              <div className="text-center text-slate-500 text-xs">↓</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center text-emerald-400">
                Encrypt Document (AES-256-GCM)
              </div>
              <div className="text-center text-slate-500 text-xs">↓</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center text-indigo-400">
                ML-KEM Key Encapsulation
              </div>
              <div className="grid grid-cols-3 gap-1 text-[10px] text-center pt-1">
                <div className="p-1 rounded bg-slate-950 border border-slate-800">Alice</div>
                <div className="p-1 rounded bg-slate-950 border border-slate-800">Bob</div>
                <div className="p-1 rounded bg-slate-950 border border-slate-800">Charlie</div>
              </div>
              <div className="text-center text-slate-500 text-xs">↓</div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 text-center font-bold text-amber-400">
                Distribution Record Created
              </div>
            </div>

            {/* Result Display */}
            {result && (
              <div className="pt-4 border-t border-slate-800 space-y-2 animate-fadeIn">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                  <CheckCircle className="w-4 h-4" />
                  <span>DISTRIBUTION SUCCESSFUL</span>
                </div>
                <div className="space-y-1 text-[11px] text-slate-300">
                  <div>✓ Document encrypted</div>
                  {result.authorized_recipients?.map((name) => (
                    <div key={name} className="text-cyan-300">✓ {name} authorized via ML-KEM</div>
                  ))}
                  <div>✓ Distribution record created</div>
                  <div className="pt-2 text-slate-400">
                    Document ID: <b className="text-white">{result.document_id}</b>
                  </div>
                  <div className="text-slate-400">
                    Hash: <b className="text-cyan-400">{result.short_hash}</b>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('decrypt')}
                  className="w-full mt-3 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs tracking-wider uppercase transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Proceed to Recipient Decrypt</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
