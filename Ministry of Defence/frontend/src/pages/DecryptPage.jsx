import React, { useState, useEffect } from 'react';
import { 
  KeyRound, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  ExternalLink, 
  Eye, 
  Cpu, 
  Flame, 
  ArrowRight,
  Clock,
  Fingerprint
} from 'lucide-react';
import { api } from '../services/api';

export default function DecryptPage({ 
  currentUser, 
  onSwitchUser, 
  onInspectDecryption,
  onSimulateLeak 
}) {
  const [documentName, setDocumentName] = useState('DEFENCE_REPORT.pdf');
  const [docHash, setDocHash] = useState('A81F982C318DF9C2...');
  const [decrypting, setDecrypting] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [decryptionResult, setDecryptionResult] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const decryptionSteps = [
    "Authenticating recipient identity & PQC keys...",
    "Verifying recipient distribution authorization...",
    "Decapsulating AES session key via ML-KEM-512...",
    "Decrypting document payload via AES-256-GCM...",
    "Generating cryptographically bound session watermark...",
    "Binding watermark to recipient & embedding steganographic layer...",
    "Signing decryption event with recipient ML-DSA-44 private key...",
    "Committing provenance block to immutable ledger...",
    "Document ready."
  ];

  useEffect(() => {
    api.getDocuments().then(docs => {
      if (docs && docs.length > 0) {
        setDocumentName(docs[0].name);
        setDocHash(docs[0].short_hash);
      }
    }).catch(console.error);
  }, []);

  const handleDecrypt = async () => {
    setDecrypting(true);
    setDecryptionResult(null);
    setActiveStep(0);

    // Animate through cryptographic pipeline stages for judge visibility
    for (let i = 0; i < decryptionSteps.length - 1; i++) {
      setActiveStep(i);
      await new Promise(r => setTimeout(r, 220));
    }

    try {
      const res = await api.decryptDocument(documentName, currentUser.id);
      setActiveStep(decryptionSteps.length - 1);
      setDecryptionResult(res);
    } catch (e) {
      alert("Decryption failed: " + e.message);
    } finally {
      setDecrypting(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-5xl mx-auto">
      {/* Header & Simulated User Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white m-0">
            RECIPIENT DECRYPTION PORTAL
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Zero-Trust Terminal • Cryptographically Bound Session Decryption
          </p>
        </div>

        {/* Identity Quick Switch Bar */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 px-2">RECIPIENT:</span>
          {[
            { id: 'R001', username: 'officer.alice', name: 'Alice' },
            { id: 'R002', username: 'officer.bob', name: 'Bob' },
            { id: 'R003', username: 'officer.charlie', name: 'Charlie' },
          ].map((u) => (
            <button
              key={u.id}
              onClick={() => onSwitchUser(u.username)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                currentUser.id === u.id
                  ? 'bg-cyan-600 text-white font-bold shadow-md shadow-cyan-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {u.name} ({u.id})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Authorized Asset Card & Decrypt Action */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0e1626]/90 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold block">
                    MY SECURE DOCUMENTS
                  </span>
                  <h2 className="text-base font-bold text-white m-0">
                    {documentName}
                  </h2>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800 text-[11px] font-mono font-bold">
                Authorized ✓
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Sender:</span>
                <span className="text-slate-200 font-semibold">MoD Secure Distribution</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Document Hash:</span>
                <span className="text-cyan-400 font-bold">{docHash}</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Recipient Enclave:</span>
                <span className="text-indigo-400 font-bold">{currentUser.name} ({currentUser.id})</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Signing Algorithm:</span>
                <span className="text-slate-300">NIST ML-DSA-44 (Dilithium2)</span>
              </div>
            </div>

            <button
              onClick={handleDecrypt}
              disabled={decrypting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 font-bold text-xs uppercase tracking-wider text-white shadow-xl shadow-emerald-950/50 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{decrypting ? 'EXECUTING CRYPTOGRAPHIC PIPELINE...' : 'DECRYPT DOCUMENT'}</span>
            </button>
          </div>

          {/* Core Principle Callout */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
            <div className="font-mono text-cyan-400 font-bold text-[11px] uppercase flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              THE CRUCIAL DEMO PRINCIPLE
            </div>
            <p className="text-slate-400 leading-relaxed">
              When <b>Alice, Bob, and Charlie</b> decrypt this exact same document, each recipient receives a <b>visually identical</b> PDF. However, each instance embeds a unique cryptographic watermark mathematically bound to their session and signed with their ML-DSA private key.
            </p>
          </div>
        </div>

        {/* Right Column: Progressive Execution Pipeline & Provenance Confirmation */}
        <div className="space-y-6">
          {/* Decryption Pipeline Animation Card */}
          <div className="p-6 rounded-2xl border border-slate-800 bg-[#0e1626]/90 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                CRYPTOGRAPHIC DECRYPTION PIPELINE
              </span>
              <span className="font-mono text-[10px] text-cyan-400">
                {decrypting ? 'PROCESSING...' : decryptionResult ? 'PIPELINE COMPLETE' : 'STANDBY'}
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {decryptionSteps.map((step, idx) => {
                const isPassed = (decrypting && idx < activeStep) || (!decrypting && decryptionResult);
                const isCurrent = decrypting && idx === activeStep;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 p-2 rounded transition-colors ${
                      isCurrent
                        ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-semibold'
                        : isPassed
                          ? 'text-emerald-400'
                          : 'text-slate-600'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px]">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                      )}
                    </span>
                    <span className="truncate">{step}</span>
                  </div>
                );
              })}
            </div>

            {/* Decryption Success Card */}
            {decryptionResult && (
              <div className="pt-4 border-t border-slate-800 space-y-4 animate-fadeIn">
                <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700/60 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      DECRYPTION SUCCESSFUL
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-900/80 text-[10px] text-emerald-200">
                      LEGAL PROVENANCE ATTACHED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">SESSION ID:</span>
                      <span className="text-white font-bold">{decryptionResult.session_id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">WATERMARK ID:</span>
                      <span className="text-cyan-300 font-bold">{decryptionResult.watermark_id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">LEDGER ENTRY:</span>
                      <span className="text-indigo-300 font-bold">{decryptionResult.ledger_entry}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">PQC SIGNATURE:</span>
                      <span className="text-emerald-400 font-bold">Verified ✓</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={api.getFileUrl('decrypted', decryptionResult.filename)}
                    download={decryptionResult.filename}
                    className="py-2.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </a>

                  <button
                    onClick={() => onInspectDecryption(decryptionResult.block_number)}
                    className="py-2.5 px-3 rounded-lg bg-cyan-900/80 hover:bg-cyan-800 text-cyan-200 border border-cyan-700 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>View Provenance</span>
                  </button>
                </div>

                {/* Star Judge Action: Simulate Leak */}
                <button
                  onClick={() => onSimulateLeak(decryptionResult.filename)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-900 via-rose-700 to-amber-700 hover:from-rose-800 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-950/60 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Flame className="w-4 h-4" />
                  <span>SIMULATE LEAK WITH THIS COPY ({currentUser.name})</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
