# Ministry of Defence — Secure Document Distribution & Attribution System
### Problem Statement: SIH26237 (Smart India Hackathon / DRDO)

> **Core Objective:** Three authorized recipients decrypt the same document, each gets a **visually identical** but **uniquely traceable** copy, and when one copy is leaked, the system **identifies the recipient and verifies the provenance record**.

---

## Architecture Overview

```
                          ┌─────────────────────────────────────┐
                          │         TACTICAL FRONTEND           │
                          │   (React + Tailwind + Lucide Icons) │
                          └──────────────────┬──────────────────┘
                                             │ HTTP / REST API
                                             ▼
                          ┌─────────────────────────────────────┐
                          │          FASTAPI BACKEND            │
                          └──────┬───────────┼───────────┬──────┘
                                 │           │           │
                 ┌───────────────┘           │           └───────────────┐
                 ▼                           ▼                           ▼
      ┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
      │  CRYPTO SERVICE     │     │  WATERMARK ENGINE   │     │   LEDGER SERVICE    │
      │ • AES-256-GCM       │     │ • ISO 32000 (3 Tr)  │     │ • SHA-256 Block Ch. │
      │ • NIST ML-KEM-512   │     │ • Micro-Typography  │     │ • Prev Hash Binding │
      │ • NIST ML-DSA-44    │     │ • Metadata Catalog  │     │ • Tamper Detection  │
      │ • HMAC-SHA256 Bind  │     │ • Raster Stego Scan │     │ • Non-Repudiation   │
      └─────────────────────┘     └─────────────────────┘     └─────────────────────┘
                 │                           │                           │
                 └───────────────────┬───────┴───────────────────────────┘
                                     ▼
                          ┌─────────────────────┐
                          │  FORENSICS SERVICE  │
                          │ • Watermark Extract │
                          │ • Ledger Lookup     │
                          │ • Signature Verify  │
                          │ • Evidence Dossier  │
                          └─────────────────────┘
```

---

## The 6 Technical Components

| Component | Technical Implementation | Defense Standard |
|---|---|---|
| **1. Document Encryption** | Ephemeral **AES-256-GCM** key generation with 96-bit unique nonce. Sensitive document never touches ledger. | FIPS 197 / SP 800-38D |
| **2. Post-Quantum Identity** | **ML-KEM-512** (Kyber) for quantum-safe key exchange & **ML-DSA-44** (Dilithium) for digital signatures. | NIST FIPS 203 & FIPS 204 |
| **3. Forensic Watermarking** | 4-layer steganography: Native PDF Invisible Text Streams (`3 Tr`), micro-typography canvas margins, structural catalog tokens, raster byte-stream recovery. Survives re-export, screenshots, and print-scans. | ISO 32000 Standard |
| **4. Signed Decryption Event** | Decryption event payload `{docHash, recipientId, sessionId, watermarkId, timestamp}` canonically hashed and signed with recipient's private key. | Digital Signature Standard |
| **5. Tamper-Evident Ledger** | Permissioned hash chain: $H_N = \text{SHA256}(N \parallel H_{N-1} \parallel \text{Event} \parallel \text{Sig})$. Modifying any old entry immediately triggers `CHAIN INVALID ❌`. | Cryptographic Linked Ledger |
| **6. Forensic Verification** | Leaked PDF/image analyzed $\to$ watermark extracted $\to$ block matched $\to$ ML-DSA signature verified $\to$ chain validated $\to$ court-admissible PDF evidence dossier produced. | Indian Evidence Act / DCA |

---

## 8 Main Screens + 1 Forensic Flow + Certificate

1. **Login / Identity (`/login`)**
   - Simulated users: Officer Alice (`R001`), Officer Bob (`R002`), Officer Charlie (`R003`), Admin / Investigator (`ADM-001`).
   - Air-Gapped mode toggle & lattice PQC key status.
2. **Dashboard (`/dashboard`)**
   - Security overview metrics, active documents, recent decryptions timeline, judge presentation workflow.
3. **Document Management (`/documents`)**
   - Classified catalog, SHA-256 hashing, recipient counts, download original, encrypted local store doctrine.
4. **Recipient Management (`/recipients`)**
   - Lattice PKI Root CA registry, ML-KEM and ML-DSA public key fingerprints. Private keys isolated in hardware enclave.
5. **Distribute Document (`/distribute`)**
   - Multi-recipient selection (Alice, Bob, Charlie). AES-256 document encryption + ML-KEM key encapsulation.
6. **Recipient Decryption Portal (`/decrypt`)**
   - Switch between Alice, Bob, Charlie. Live 7-step cryptographic visualizer. Produces visually identical copies with unique watermarks.
7. **Provenance Details (`/decryptions/:id`)**
   - Full judge audit view: Document hash, session ID, watermark ID, ML-DSA signature verification, previous and current block hashes.
8. **Immutable Ledger (`/ledger`)**
   - Block cards linked by SHA-256 hash pointers. Includes **"Simulate Tamper Attack"** button to prove chain invalidation in real time!
9. **Leak Investigation (`/investigate`) — THE MONEY SHOT**
   - "A leaked copy of the document has been recovered."
   - 1-click test leaks for Alice, Bob, Charlie or custom PDF/screenshot upload.
   - Live multi-stage forensic scanner $\to$ Watermark found $\to$ Ledger matched $\to$ Signature verified $\to$ **ATTRIBUTION RESULT: ALICE (R001)**.
   - Side-by-side Visual Comparison Proof tab proving documents look 100% identical.
10. **Verification Certificate (`/certificate`)**
    - Official DCA Case Dossier (`CASE-2026-0041`) with one-click exportable PDF evidence report.

---

## Running the System

### 1. Prerequisites
- Python 3.12+
- Node.js v20+ & npm

### 2. Backend Startup
```powershell
# From project root
& "C:\Users\AVDHOOT\AppData\Local\Programs\Python\Python312\python.exe" "backend\run_server.py"
```
Backend runs at: `http://127.0.0.1:8000`

### 3. Frontend Startup
```powershell
# From frontend folder
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 30-Second Hackathon Judge Demo Script

1. **Open Dashboard (`/dashboard`)**: Show system security overview, 3 active recipients, and air-gapped status.
2. **Navigate to Recipient Decrypt (`/decrypt`)**:
   - Decrypt as **Alice** $\to$ Watermark `WM-78E485E13D`, Block `#181`.
   - Switch to **Bob** $\to$ Decrypt $\to$ Watermark `WM-306B5CFF96`, Block `#182`.
   - Switch to **Charlie** $\to$ Decrypt $\to$ Watermark `WM-0A03AC8C2A`, Block `#183`.
3. **Show Comparison (`/investigate` $\to$ Visual Comparison)**:
   - Show judges all 3 copies: completely identical to human eyes and standard viewers.
4. **Simulate Leak & Investigate (`/investigate`)**:
   - Click **"Test Leak: Alice's Recovered Copy"** $\to$ Click **"ANALYZE DOCUMENT"**.
   - Watch the live forensic scanner recover the watermark, search the ledger, verify the ML-DSA signature, and declare:
     **ATTRIBUTION RESULT: ALICE (R001) — PROVENANCE VERIFIED ✓**.
5. **Tamper Proof (`/ledger`)**:
   - Click **"Simulate Tamper Attack"** $\to$ Watch the ledger immediately flag **CHAIN INVALID ❌** with exact hash mismatch details. Click **"Restore Authentic Chain"** to return to green verified status.
6. **Export Certificate**:
   - Click **"Export Evidence Dossier (PDF)"** to download the court-admissible forensic audit certificate.
