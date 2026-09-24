import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  Upload, 
  Search, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  FileCheck2, 
  AlertTriangle, 
  Download, 
  ArrowRight, 
  Fingerprint, 
  Radio, 
  Eye, 
  Layers 
} from 'lucide-react';
import { api } from '../services/api';

export default function InvestigatePage({ preloadedLeakFilename, onViewCertificate }) {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(preloadedLeakFilename || null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('investigate'); // 'investigate' | 'comparison'

  const stagesAnimation = [
    { title: "Analyzing Document Structure", detail: "Parsing PDF content streams & metadata catalogs" },
    { title: "Searching Multi-Layer Forensic Watermark", detail: "Scanning ISO 32000 Mode 3 Tr invisible text & micro-typography" },
    { title: "Extracting Cryptographic Watermark ID", detail: "Recovering HMAC-SHA256 bound session token" },
    { title: "Searching Immutable Provenance Ledger", detail: "Querying permissioned hash-chained blocks" },
    { title: "Verifying Post-Quantum ML-DSA Signature", detail: "Executing lattice-based signature verification" },
    { title: "Verifying Ledger Hash Chain Integrity", detail: "Traversing block hash pointers to Genesis root" },
    { title: "Attribution Verdict Formulated", detail: "Generating court-admissible forensic case dossier" }
  ];

  useEffect(() => {
    loadSamples();
  }, []);

  useEffect(() => {
    if (preloadedLeakFilename) {
      setSelectedSample(preloadedLeakFilename);
    }
  }, [preloadedLeakFilename]);

  const loadSamples = async () => {
    try {
      const data = await api.getInvestigationSamples();
      setSamples(data);
      if (!selectedSample && data.length > 0) {
        setSelectedSample(data[0].filename);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setSelectedSample(null);
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile && !selectedSample) {
      alert("Please select a sample or upload a leaked file");
      return;
    }

    setAnalyzing(true);
    setResult(null);
    setAnalysisStep(0);

    // Progressive animation steps
    for (let i = 0; i < stagesAnimation.length - 1; i++) {
      setAnalysisStep(i);
      await new Promise(r => setTimeout(r, 260));
    }

    try {
      const res = await api.investigateLeak(uploadedFile, selectedSample);
      setAnalysisStep(stagesAnimation.length - 1);
      setResult(res);
    } catch (e) {
      alert("Investigation error: " + e.message);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white m-0">
              FORENSIC LEAK INVESTIGATION
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold uppercase tracking-wider animate-pulse">
              HOT INCIDENT
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Autonomous Watermark Recovery • Cryptographic Provenance Attribution • Evidence Extraction
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('investigate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              activeTab === 'investigate' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Leak Analyzer
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
              activeTab === 'comparison' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Visual Comparison Proof
          </button>
        </div>
      </div>

      {activeTab === 'investigate' ? (
        <div className="space-y-8">
          {/* Recovery Notification Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 border border-rose-700/60 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-900/80 border border-rose-600 flex items-center justify-center text-rose-200 shrink-0">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide m-0">
                  A leaked copy of the classified document has been recovered.
                </h2>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Three officers were authorized. One unauthorized copy was discovered in an external intelligence channel.
                </p>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-lg bg-black/40 border border-rose-900 text-xs font-mono text-rose-300 shrink-0">
              TARGET: DEFENCE_REPORT.pdf
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Leaked File Selection */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#0e1626]/90 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Step 1: Select Recovered Document
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">DEMO PRESETS</span>
                </div>

                {/* 1-Click Leak Presets */}
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-slate-400 block uppercase">
                    Quick-Load Suspected Officer's Decrypted File:
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {samples.map((s) => {
                      const isSelected = selectedSample === s.filename && !uploadedFile;
                      const officerName = s.filename.includes('ALICE') ? 'Officer Alice (R001)' :
                                          s.filename.includes('BOB') ? 'Officer Bob (R002)' :
                                          s.filename.includes('CHARLIE') ? 'Officer Charlie (R003)' : s.filename;
                      return (
                        <button
                          key={s.filename}
                          onClick={() => {
                            setSelectedSample(s.filename);
                            setUploadedFile(null);
                            setResult(null);
                          }}
                          className={`p-3 rounded-xl border text-left font-mono transition flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-rose-950/70 border-rose-600 text-rose-200 shadow-md shadow-rose-950/40'
                              : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-slate-400'}`} />
                            <div>
                              <div className="font-bold text-xs">{officerName}</div>
                              <div className="text-[10px] text-slate-500">{s.filename}</div>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-500">{s.size_kb} KB</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Or Custom Upload */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <label className="text-[10px] font-mono text-slate-400 block uppercase">
                    Or Upload Recovered Leak (PDF or Screenshot Image):
                  </label>
                  <label className={`w-full p-4 rounded-xl border-2 border-dashed transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    uploadedFile
                      ? 'bg-cyan-950/40 border-cyan-500 text-cyan-200'
                      : 'border-slate-700 hover:border-slate-600 bg-slate-900/40 text-slate-400'
                  }`}>
                    <Upload className="w-5 h-5" />
                    <span className="text-xs font-mono font-medium">
                      {uploadedFile ? uploadedFile.name : 'Choose / Drop leaked PDF or Screenshot'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Big Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={analyzing || (!uploadedFile && !selectedSample)}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-rose-600 via-rose-700 to-amber-600 hover:from-rose-500 hover:to-amber-500 font-bold text-xs uppercase tracking-wider text-white shadow-xl shadow-rose-950/60 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Search className="w-4 h-4" />
                  <span>{analyzing ? 'EXTRACTING FORENSIC WATERMARK...' : 'ANALYZE DOCUMENT'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Progressive Analysis & Big Attribution Shot */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border border-slate-800 bg-[#0e1626]/90 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                    Forensic Attribution Engine
                  </span>
                  <span className="font-mono text-[10px] text-cyan-400">
                    {analyzing ? 'SCANNING LAYERS...' : result ? 'ATTRIBUTION COMPLETE' : 'STANDBY'}
                  </span>
                </div>

                {/* Progressive Scan Stages */}
                <div className="space-y-2 font-mono text-xs">
                  {stagesAnimation.map((stg, idx) => {
                    const isPassed = (analyzing && idx < analysisStep) || (!analyzing && result);
                    const isCurrent = analyzing && idx === analysisStep;
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2.5 rounded transition ${
                          isCurrent
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-700/60 font-semibold'
                            : isPassed
                              ? 'bg-slate-900/60 text-emerald-400 border border-slate-800'
                              : 'text-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                            {isPassed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : isCurrent ? (
                              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping"></span>
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-700"></span>
                            )}
                          </span>
                          <div>
                            <div className="font-semibold">{stg.title}</div>
                            <div className="text-[10px] text-slate-500 font-normal">{stg.detail}</div>
                          </div>
                        </div>
                        {isPassed && (
                          <span className="text-[10px] font-bold text-emerald-400 uppercase">
                            ✓ VERIFIED
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* THE BIG RESULT: ATTRIBUTION CARD */}
                {result && result.success && (
                  <div className="pt-4 border-t border-slate-800 space-y-4 animate-fadeIn">
                    <div className="p-6 rounded-2xl bg-gradient-to-b from-rose-950/80 via-slate-900 to-black border-2 border-rose-500 shadow-2xl shadow-rose-950/80 space-y-4 font-mono">
                      <div className="flex items-center justify-between border-b border-rose-800/80 pb-3">
                        <span className="text-xs font-bold tracking-widest text-rose-400 uppercase">
                          ATTRIBUTION RESULT
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-rose-900 text-rose-200 border border-rose-700 font-bold">
                          MATHEMATICALLY CERTAIN
                        </span>
                      </div>

                      {/* Recipient Identity Callout */}
                      <div className="p-4 rounded-xl bg-black/60 border border-rose-900/80 space-y-1">
                        <div className="text-[10px] text-slate-400 uppercase">IDENTIFIED RECIPIENT SOURCE:</div>
                        <div className="text-2xl font-extrabold text-white tracking-wide">
                          {result.attribution.recipient_name.toUpperCase()}
                        </div>
                        <div className="text-xs text-rose-300 font-bold">
                          Officer ID: {result.attribution.recipient_id} • {result.attribution.department}
                        </div>
                      </div>

                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                          <span className="text-[10px] text-slate-500 block uppercase">WATERMARK ID:</span>
                          <span className="text-cyan-300 font-bold">{result.attribution.watermark_id}</span>
                        </div>
                        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                          <span className="text-[10px] text-slate-500 block uppercase">SESSION ID:</span>
                          <span className="text-white font-bold">{result.attribution.session_id}</span>
                        </div>
                        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                          <span className="text-[10px] text-slate-500 block uppercase">ORIGIN DECRYPTION:</span>
                          <span className="text-amber-300 font-bold text-[11px]">{result.attribution.decryption_timestamp}</span>
                        </div>
                        <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                          <span className="text-[10px] text-slate-500 block uppercase">LEDGER BLOCK:</span>
                          <span className="text-indigo-300 font-bold">{result.attribution.ledger_block}</span>
                        </div>
                      </div>

                      {/* Verification Checks */}
                      <div className="space-y-1.5 pt-2 border-t border-rose-900/60 text-xs">
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Post-Quantum Digital Signature:</span>
                          <span className="text-emerald-400 font-bold">{result.attribution.digital_signature_status}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Tamper-Evident Ledger Integrity:</span>
                          <span className="text-emerald-400 font-bold">{result.attribution.ledger_integrity}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300">
                          <span>Document Base Hash:</span>
                          <span className="text-emerald-400 font-bold">{result.attribution.document_hash_status}</span>
                        </div>
                      </div>

                      {/* Verdict Banner */}
                      <div className="pt-2 text-center">
                        <div className="py-2.5 rounded-lg bg-emerald-950/90 border border-emerald-600 text-emerald-300 font-extrabold tracking-widest text-sm uppercase">
                          PROVENANCE VERIFIED ✓
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => onViewCertificate(result)}
                        className="py-3 px-4 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-semibold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                      >
                        <FileCheck2 className="w-4 h-4" />
                        <span>View Verification Certificate</span>
                      </button>

                      <a
                        href={api.getEvidencePdfUrl(result.case_id)}
                        download={result.evidence_filename}
                        className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export Evidence Dossier (PDF)</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Visual Comparison Proof Tab */
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0e1626]/90 border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white m-0">
              TRIPLE-RECIPIENT VISUAL IDENTITY PROOF
            </h2>
            <p className="text-xs text-slate-400 font-mono leading-relaxed">
              Three authorized officers decrypted <b>DEFENCE_REPORT.pdf</b>. 
              To any human eye, printed page, or screen reader, all three documents are 100% identical in layout, text, tables, and classification banners.
              However, beneath the visual layer, distinct steganographic tokens isolate each recipient.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Alice */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-slate-200">ALICE'S COPY</span>
                  <span className="text-[10px] text-cyan-400">R001</span>
                </div>
                <div className="aspect-[3/4] bg-white rounded border border-slate-300 p-3 text-[7px] text-slate-800 overflow-hidden relative shadow-inner">
                  <div className="text-center font-bold text-red-600 text-[8px] mb-1">★★★ TOP SECRET ★★★</div>
                  <div className="font-bold mb-1 text-[7px]">PROJECT TRISHUL REPORT</div>
                  <p className="leading-tight text-slate-700">Operational deployment parameters for tactical relays. Access strictly partitioned...</p>
                  <div className="my-1.5 p-1 bg-slate-100 border text-[6px]">
                    <div>NODE-ALPHA: NOMINAL</div>
                    <div>NODE-BRAVO: ACTIVE</div>
                  </div>
                  <div className="absolute bottom-1 right-2 text-[5px] text-slate-400">Page 1 of 1</div>
                  {/* Imperceptible marker indicator */}
                  <div className="absolute bottom-1 left-2 text-[4px] text-slate-200">WM-EMBEDDED</div>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="text-slate-400">Visual Appearance: <b className="text-emerald-400">Identical ✓</b></div>
                  <div className="text-slate-400">Watermark: <b className="text-cyan-400">WM-78E485E13D</b></div>
                  <div className="text-slate-400">Signed Event: <b className="text-indigo-400">Block #181</b></div>
                </div>
              </div>

              {/* Bob */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-slate-200">BOB'S COPY</span>
                  <span className="text-[10px] text-cyan-400">R002</span>
                </div>
                <div className="aspect-[3/4] bg-white rounded border border-slate-300 p-3 text-[7px] text-slate-800 overflow-hidden relative shadow-inner">
                  <div className="text-center font-bold text-red-600 text-[8px] mb-1">★★★ TOP SECRET ★★★</div>
                  <div className="font-bold mb-1 text-[7px]">PROJECT TRISHUL REPORT</div>
                  <p className="leading-tight text-slate-700">Operational deployment parameters for tactical relays. Access strictly partitioned...</p>
                  <div className="my-1.5 p-1 bg-slate-100 border text-[6px]">
                    <div>NODE-ALPHA: NOMINAL</div>
                    <div>NODE-BRAVO: ACTIVE</div>
                  </div>
                  <div className="absolute bottom-1 right-2 text-[5px] text-slate-400">Page 1 of 1</div>
                  <div className="absolute bottom-1 left-2 text-[4px] text-slate-200">WM-EMBEDDED</div>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="text-slate-400">Visual Appearance: <b className="text-emerald-400">Identical ✓</b></div>
                  <div className="text-slate-400">Watermark: <b className="text-cyan-400">WM-306B5CFF96</b></div>
                  <div className="text-slate-400">Signed Event: <b className="text-indigo-400">Block #182</b></div>
                </div>
              </div>

              {/* Charlie */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-bold text-slate-200">CHARLIE'S COPY</span>
                  <span className="text-[10px] text-cyan-400">R003</span>
                </div>
                <div className="aspect-[3/4] bg-white rounded border border-slate-300 p-3 text-[7px] text-slate-800 overflow-hidden relative shadow-inner">
                  <div className="text-center font-bold text-red-600 text-[8px] mb-1">★★★ TOP SECRET ★★★</div>
                  <div className="font-bold mb-1 text-[7px]">PROJECT TRISHUL REPORT</div>
                  <p className="leading-tight text-slate-700">Operational deployment parameters for tactical relays. Access strictly partitioned...</p>
                  <div className="my-1.5 p-1 bg-slate-100 border text-[6px]">
                    <div>NODE-ALPHA: NOMINAL</div>
                    <div>NODE-BRAVO: ACTIVE</div>
                  </div>
                  <div className="absolute bottom-1 right-2 text-[5px] text-slate-400">Page 1 of 1</div>
                  <div className="absolute bottom-1 left-2 text-[4px] text-slate-200">WM-EMBEDDED</div>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="text-slate-400">Visual Appearance: <b className="text-emerald-400">Identical ✓</b></div>
                  <div className="text-slate-400">Watermark: <b className="text-cyan-400">WM-0A03AC8C2A</b></div>
                  <div className="text-slate-400">Signed Event: <b className="text-indigo-400">Block #183</b></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
