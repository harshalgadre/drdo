import React, { useEffect, useState } from 'react';
import { 
  FileText, 
  Upload, 
  Lock, 
  Key, 
  Database, 
  Users, 
  CheckCircle, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { api } from '../services/api';

export default function DocumentsPage({ onNavigate }) {
  const [documents, setDocuments] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState(null);

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    try {
      const data = await api.getDocuments();
      setDocuments(data);
      if (data.length > 0 && !selectedDoc) {
        setSelectedDoc(data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyHash = (hash) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMsg(null);
    try {
      const res = await api.uploadDocument(file);
      setUploadMsg(res.message);
      await loadDocs();
    } catch (err) {
      setUploadMsg("Upload failed: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white m-0">
            DOCUMENT MANAGEMENT
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Classified Repository • Zero-Trust Access Boundary • SHA-256 Anchored
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs tracking-wider uppercase transition shadow-md flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploading ? 'Processing...' : '+ Upload Document'}</span>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileUpload} 
              className="hidden" 
              disabled={uploading} 
            />
          </label>
        </div>
      </div>

      {uploadMsg && (
        <div className="p-3 rounded-lg bg-cyan-950/80 border border-cyan-800 text-xs font-mono text-cyan-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-cyan-400" />
          <span>{uploadMsg}</span>
        </div>
      )}

      {/* Main Grid: List & Selected Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl border border-slate-800 bg-[#0e1626]/80 overflow-hidden shadow-xl">
            <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                Classified Documents Catalog
              </span>
              <span className="font-mono text-xs text-slate-400">
                {documents.length} Assets Registered
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Document</th>
                    <th className="p-3.5">Hash (SHA-256)</th>
                    <th className="p-3.5">Recipients</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {documents.map((doc) => {
                    const isSelected = selectedDoc?.name === doc.name;
                    return (
                      <tr 
                        key={doc.name}
                        onClick={() => setSelectedDoc(doc)}
                        className={`hover:bg-slate-800/40 transition cursor-pointer ${
                          isSelected ? 'bg-cyan-950/40 border-l-2 border-l-cyan-400' : ''
                        }`}
                      >
                        <td className="p-3.5 font-bold text-slate-200">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-cyan-400" />
                            <span>{doc.name}</span>
                          </div>
                        </td>
                        <td className="p-3.5 text-cyan-400 font-mono">
                          {doc.short_hash}
                        </td>
                        <td className="p-3.5 text-slate-300">
                          {doc.recipients_count} authorized
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-[10px] font-bold">
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDoc(doc);
                              onNavigate('distribute');
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-sans font-medium transition cursor-pointer"
                          >
                            Distribute
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Defense Architecture Note */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs space-y-2">
            <div className="flex items-center gap-2 font-mono text-amber-400 font-bold uppercase text-[11px]">
              <AlertCircle className="w-4 h-4" />
              IMPORTANT DEFENCE DIRECTIVE
            </div>
            <p className="text-slate-300 leading-relaxed">
              <b>Do not put the actual sensitive document on your blockchain.</b> The prototype adheres to military security doctrine:
            </p>
            <div className="grid grid-cols-2 gap-3 pt-1 font-mono text-[11px]">
              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-cyan-400 block font-bold">DOCUMENT ASSET</span>
                <span className="text-slate-400">Encrypted AES-256 local air-gapped storage</span>
              </div>
              <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-indigo-400 block font-bold">PROVENANCE LEDGER</span>
                <span className="text-slate-400">SHA-256 hash + ML-DSA signed recipient events</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Selected Document Details Drawer */}
        <div className="space-y-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-[#0e1626]/90 shadow-xl space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                DOCUMENT INSPECTION CARD
              </div>
              <h2 className="text-base font-bold text-white mt-1 break-all m-0">
                {selectedDoc?.name || 'DEFENCE_REPORT.pdf'}
              </h2>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">SHA-256 Cryptographic Hash</span>
                <div className="flex items-center gap-2 mt-1 p-2 rounded bg-slate-900 border border-slate-800 text-[11px] text-cyan-300 break-all">
                  <span>{selectedDoc?.hash || 'A81F982C318DF9C2...'}</span>
                  <button
                    onClick={() => copyHash(selectedDoc?.hash || '')}
                    className="p-1 hover:text-white transition shrink-0"
                    title="Copy full hash"
                  >
                    {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Uploaded</span>
                  <span className="text-slate-200 font-medium">{selectedDoc?.uploaded_at || '24 Sep 2026 09:30'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Status</span>
                  <span className="text-emerald-400 font-bold">{selectedDoc?.status || 'Encrypted ✓'}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800">
                <div className="p-2 rounded bg-slate-900 text-center">
                  <div className="text-slate-400 text-[10px]">Recipients</div>
                  <div className="text-base font-bold text-white mt-0.5">{selectedDoc?.recipients_count ?? 3}</div>
                </div>
                <div className="p-2 rounded bg-slate-900 text-center">
                  <div className="text-slate-400 text-[10px]">Decryptions</div>
                  <div className="text-base font-bold text-cyan-400 mt-0.5">{selectedDoc?.decryption_events_count ?? 3}</div>
                </div>
                <div className="p-2 rounded bg-slate-900 text-center">
                  <div className="text-slate-400 text-[10px]">Ledger</div>
                  <div className="text-base font-bold text-indigo-400 mt-0.5">{selectedDoc?.ledger_entries_count ?? 3}</div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <a
                href={api.getFileUrl('documents', selectedDoc?.name || 'DEFENCE_REPORT.pdf')}
                download={selectedDoc?.name || 'DEFENCE_REPORT.pdf'}
                className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Original Document</span>
              </a>

              <button
                onClick={() => onNavigate('distribute')}
                className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Distribute Document</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
