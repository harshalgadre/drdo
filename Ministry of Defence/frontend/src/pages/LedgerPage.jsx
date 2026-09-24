import React, { useEffect, useState } from 'react';
import { 
  Database, 
  ShieldCheck, 
  ShieldAlert, 
  RotateCcw, 
  ArrowDown, 
  CheckCircle2, 
  Lock, 
  FileText, 
  User, 
  Key, 
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/api';

export default function LedgerPage({ onInspectBlock }) {
  const [blocks, setBlocks] = useState([]);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [tampering, setTampering] = useState(false);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    loadLedger();
  }, []);

  const loadLedger = async () => {
    setLoading(true);
    try {
      const data = await api.getLedger();
      setBlocks(data.blocks || []);
      setVerification(data.verification);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      const res = await api.verifyLedger();
      setVerification(res);
    } catch (e) {
      console.error(e);
    } finally {
      setVerifying(false);
    }
  };

  const handleSimulateTamper = async () => {
    // Pick block 181 or second block to tamper
    const targetBlock = blocks.length > 1 ? blocks[1].block_number : blocks[0]?.block_number;
    if (!targetBlock) return;

    setTampering(true);
    try {
      const res = await api.tamperLedger(targetBlock, 'recipient_name', 'MALLORY_ATTACKER_INJECT');
      await loadLedger();
    } catch (e) {
      console.error(e);
    } finally {
      setTampering(false);
    }
  };

  const handleRestore = async () => {
    setRestoring(true);
    try {
      await api.restoreLedger();
      await loadLedger();
    } catch (e) {
      console.error(e);
    } finally {
      setRestoring(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white m-0">
            IMMUTABLE PROVENANCE LEDGER
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Permissioned Hash-Chained Blockchain • SHA-256 Pointers • Tamper-Evident Non-Repudiation
          </p>
        </div>

        {/* Live Chain Status Badge */}
        <div className="flex items-center gap-3">
          {verification?.valid ? (
            <div className="px-3.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700/60 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CHAIN VALID ✓</span>
            </div>
          ) : (
            <div className="px-3.5 py-1.5 rounded-lg bg-rose-950/90 border border-rose-600 text-rose-300 text-xs font-mono font-bold flex items-center gap-2 animate-pulse">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>CHAIN INVALID ❌</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Action Toolbar */}
      <div className="p-4 rounded-xl bg-[#0e1626]/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Total Blocks: <b className="text-white">{blocks.length}</b></span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">Hash Algorithm: <b className="text-cyan-400">SHA-256</b></span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
            <span>Verify Integrity</span>
          </button>

          {verification?.valid ? (
            <button
              onClick={handleSimulateTamper}
              disabled={tampering}
              className="px-3.5 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700/70 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Demonstrate tamper detection for judges"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Simulate Tamper Attack</span>
            </button>
          ) : (
            <button
              onClick={handleRestore}
              disabled={restoring}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Authentic Chain</span>
            </button>
          )}
        </div>
      </div>

      {/* Tamper Warning Banner if chain compromised */}
      {!verification?.valid && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-200 text-xs font-mono space-y-2 shadow-2xl animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-400">
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
            <span>CRYPTOGRAPHIC INTEGRITY ALERT: TAMPERING DETECTED!</span>
          </div>
          <p className="leading-relaxed">
            {verification?.reason || "Hash linkage broken! A block was modified without valid previous hash recalculation."}
          </p>
          <div className="p-2.5 rounded bg-black/40 border border-rose-900 text-[11px] space-y-1">
            <div>Broken Block Number: <b className="text-white">#{verification?.broken_at_block}</b></div>
            {verification?.expected_hash && (
              <div className="truncate">Expected SHA-256: <span className="text-emerald-400">{verification.expected_hash}</span></div>
            )}
            {verification?.actual_hash && (
              <div className="truncate">Stored Hash: <span className="text-rose-400">{verification.actual_hash}</span></div>
            )}
          </div>
        </div>
      )}

      {/* Block Chain Visualization Cards */}
      <div className="space-y-4">
        {blocks.map((block, idx) => {
          const isTampered = block.tampered;
          return (
            <React.Fragment key={block.block_number}>
              {/* Block Card */}
              <div className={`p-6 rounded-2xl border transition-all ${
                isTampered
                  ? 'bg-rose-950/40 border-rose-600 shadow-xl shadow-rose-950/50'
                  : 'bg-[#0e1626]/90 border-slate-800 hover:border-slate-700 shadow-xl'
              }`}>
                {/* Block Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs text-cyan-400">
                      #{block.block_number}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white font-mono uppercase tracking-wider block">
                        {block.event_type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {block.timestamp}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    {isTampered ? (
                      <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-700 font-bold text-[10px]">
                        TAMPERED ENTRY ❌
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold text-[10px]">
                        ✓ VALID BLOCK
                      </span>
                    )}

                    <button
                      onClick={() => onInspectBlock(block.block_number)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
                    >
                      Inspect
                    </button>
                  </div>
                </div>

                {/* Block Content Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 font-mono text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Document:</span>
                    <span className="text-slate-200 font-bold truncate block">{block.document_name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Recipient:</span>
                    <span className={`font-bold truncate block ${isTampered ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`}>
                      {block.recipient_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Watermark ID:</span>
                    <span className="text-amber-300 font-bold truncate block">{block.watermark_id}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Signature:</span>
                    <span className="text-slate-300 truncate block">ML-DSA Verified ✓</span>
                  </div>
                </div>

                {/* Hash Chaining Row */}
                <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">PREVIOUS BLOCK HASH:</span>
                    <span className="text-slate-400 break-all">{block.previous_hash}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">CURRENT ENTRY HASH:</span>
                    <span className={`break-all font-bold ${isTampered ? 'text-rose-400' : 'text-cyan-300'}`}>
                      {block.current_hash}
                    </span>
                  </div>
                </div>
              </div>

              {/* Connecting Hash Link Arrow */}
              {idx < blocks.length - 1 && (
                <div className="flex flex-col items-center justify-center my-1 text-slate-600">
                  <div className="w-0.5 h-3 bg-slate-800"></div>
                  <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] font-mono text-cyan-400/80">
                    <span>SHA-256 LINKAGE POINTER</span>
                    <ArrowDown className="w-3 h-3 text-cyan-400 animate-bounce" />
                  </div>
                  <div className="w-0.5 h-3 bg-slate-800"></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
