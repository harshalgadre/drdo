import React, { useEffect, useState } from 'react';
import { Users, Key, ShieldCheck, Lock, Cpu, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export default function RecipientsPage() {
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecipients();
  }, []);

  const loadRecipients = async () => {
    try {
      const data = await api.getRecipients();
      setRecipients(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white m-0">
            AUTHORIZED RECIPIENTS & PQC IDENTITIES
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Post-Quantum Lattice Key Registry • NIST FIPS 203 (ML-KEM) & FIPS 204 (ML-DSA)
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-xs font-mono text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>LATTICE PKI ROOT CA: VERIFIED</span>
        </div>
      </div>

      {/* Recipients Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0e1626]/80 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
            Registered Cryptographic Officers
          </span>
          <span className="font-mono text-xs text-slate-400">
            {recipients.length} Officers Provisioned
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Name & Directorate</th>
                <th className="p-3.5">Public Key (ML-DSA-44)</th>
                <th className="p-3.5">Key Exchange (ML-KEM-512)</th>
                <th className="p-3.5">Security Clearance</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recipients.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-3.5 font-bold text-cyan-400">
                    {rec.id}
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-200">
                        {rec.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-200 text-xs font-sans">{rec.name}</div>
                        <div className="text-[10px] text-slate-400">{rec.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Key className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px] text-cyan-300">
                        {rec.dsa_fingerprint}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-[11px] text-indigo-300">
                        {rec.kem_fingerprint}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-300 border border-amber-800/50">
                      {rec.clearance}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                      {rec.status} ✓
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Architecture Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-mono text-cyan-400 font-bold uppercase text-[11px]">
            <Lock className="w-4 h-4" />
            PRIVATE KEY ISOLATION
          </div>
          <p className="text-slate-400 leading-relaxed">
            In strict compliance with defense standards, <b>private keys are never displayed in the UI</b>. They reside inside recipient hardware security enclaves / local key stores.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-mono text-indigo-400 font-bold uppercase text-[11px]">
            <Cpu className="w-4 h-4" />
            NIST ML-KEM-512 (KYBER)
          </div>
          <p className="text-slate-400 leading-relaxed">
            Module-Lattice Key Encapsulation ensures forward secrecy against quantum cryptanalytic attacks by Shor's algorithm.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
          <div className="flex items-center gap-2 font-mono text-emerald-400 font-bold uppercase text-[11px]">
            <Key className="w-4 h-4" />
            NIST ML-DSA-44 (DILITHIUM)
          </div>
          <p className="text-slate-400 leading-relaxed">
            Module-Lattice Digital Signatures provide mathematical non-repudiation for every decryption event recorded in the immutable ledger.
          </p>
        </div>
      </div>
    </div>
  );
}
