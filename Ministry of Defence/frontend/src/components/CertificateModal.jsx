import React from 'react';
import { X, ShieldCheck, Download, FileText, CheckCircle2, Award, Stamp } from 'lucide-react';
import { api } from '../services/api';

export default function CertificateModal({ certificateData, onClose }) {
  if (!certificateData) return null;

  const attr = certificateData.attribution || {};
  const caseId = certificateData.case_id || 'CASE-2026-0041';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#0c1322] border-2 border-cyan-700/80 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs animate-scaleUp">
        {/* Modal Top Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200 uppercase tracking-wider text-xs">
              Official Verification Certificate & Forensic Dossier
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Paper Body */}
        <div className="p-6 space-y-6">
          {/* Header Seal */}
          <div className="text-center space-y-1 border-b border-slate-800 pb-4">
            <div className="text-[10px] text-red-500 font-bold tracking-widest uppercase">
              DEFENCE CYBER AGENCY • COUNTER-INTELLIGENCE DIVISION
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide m-0">
              PROVENANCE VERIFICATION CERTIFICATE
            </h2>
            <div className="text-[11px] text-cyan-400">
              CASE REFERENCE: {caseId}
            </div>
          </div>

          {/* Certificate Fields Grid */}
          <div className="grid grid-cols-2 gap-3 text-slate-300">
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">TARGET ASSET:</span>
              <span className="font-bold text-white">{attr.document_name || 'DEFENCE_REPORT.pdf'}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">DOCUMENT BASE HASH:</span>
              <span className="font-bold text-cyan-300 break-all">{attr.document_hash?.substring(0, 16)}...</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">FORENSIC WATERMARK:</span>
              <span className="font-bold text-amber-300">{attr.watermark_id}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">IDENTIFIED RECIPIENT:</span>
              <span className="font-bold text-white">{attr.recipient_name} ({attr.recipient_id})</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">ORIGIN DECRYPTION TIMESTAMP:</span>
              <span className="font-bold text-slate-200">{attr.decryption_timestamp}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-500 block">IMMUTABLE LEDGER ANCHOR:</span>
              <span className="font-bold text-indigo-300">{attr.ledger_block}</span>
            </div>
          </div>

          {/* Status Matrix */}
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span>Post-Quantum Digital Signature:</span>
              <span className="text-emerald-400 font-bold">{attr.digital_signature_status}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Tamper-Evident Ledger Chain Integrity:</span>
              <span className="text-emerald-400 font-bold">{attr.ledger_integrity}</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Document Hash Match:</span>
              <span className="text-emerald-400 font-bold">{attr.document_hash_status}</span>
            </div>
          </div>

          {/* Legal Result Box */}
          <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-600 text-center space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-emerald-400 block font-bold">
              FINAL FORENSIC VERDICT
            </span>
            <div className="text-base font-extrabold text-white tracking-widest">
              PROVENANCE VERIFIED ✓
            </div>
            <div className="text-[10px] text-emerald-300/80">
              Mathematical non-repudiation established under Official Secrets Act & DCA Evidence Directives.
            </div>
          </div>

          {/* Download Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-[10px] text-slate-500">
              Generated by DRDO-MoD PQC Provenance Engine v2.4
            </span>
            <a
              href={api.getEvidencePdfUrl(caseId)}
              download={certificateData.evidence_filename || `${caseId}_EVIDENCE_REPORT.pdf`}
              className="py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Official Evidence PDF</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
