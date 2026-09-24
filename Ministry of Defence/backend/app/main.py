"""
FastAPI Backend for Ministry of Defence Secure Document Distribution & Attribution System
Problem Statement: SIH26237
Implements 8 core endpoints + forensic verification + air-gapped immutable ledger
"""

import os
import shutil
from typing import List, Optional
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from backend.app.services.crypto_service import CryptoService
from backend.app.services.watermark_service import WatermarkService
from backend.app.services.ledger_service import LedgerService
from backend.app.services.document_service import DocumentService, DOCS_DIR, DECRYPTED_DIR, ENCRYPTED_DIR
from backend.app.services.forensics_service import ForensicsService, EVIDENCE_DIR

app = FastAPI(
    title="MoD Secure Document Distribution & Attribution System",
    description="SIH26237 Quantum-Resilient Provenance & Forensic Attribution Engine",
    version="2.4.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Core Services
ledger_service = LedgerService()
doc_service = DocumentService(ledger_service)
forensics_service = ForensicsService(doc_service, ledger_service)
crypto = CryptoService()

# ----------------- Models -----------------
class LoginRequest(BaseModel):
    username: str
    password: Optional[str] = "••••••••••"

class DistributeRequest(BaseModel):
    document_name: str
    recipient_ids: List[str]
    algorithm: Optional[str] = "AES-256-GCM"
    pqc_kem: Optional[str] = "ML-KEM-512"
    pqc_dsa: Optional[str] = "ML-DSA-44"

class DecryptRequest(BaseModel):
    document_name: str
    recipient_id: str

class TamperRequest(BaseModel):
    block_number: int
    field: Optional[str] = "recipient_name"
    malicious_value: Optional[str] = "Mallory (Attacker)"

# ----------------- Routes -----------------

@app.get("/api/status")
def get_system_status():
    """System health and air-gapped posture status"""
    chain_audit = ledger_service.verify_chain()
    return {
        "status": "OPERATIONAL",
        "mode": "OFFLINE / AIR-GAPPED",
        "pqc_kem": "NIST FIPS 203 (ML-KEM-512)",
        "pqc_dsa": "NIST FIPS 204 (ML-DSA-44)",
        "cipher": "AES-256-GCM",
        "ledger_blocks": len(ledger_service.get_chain()),
        "ledger_valid": chain_audit["valid"],
        "tamper_alerts": 0 if chain_audit["valid"] else 1,
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

@app.post("/api/auth/login")
def login(req: LoginRequest):
    """Simulated login for Alice, Bob, Charlie, and Admin / Investigator"""
    user = doc_service.get_user_by_username(req.username)
    if not user:
        # Fallback to alice if generic
        user = doc_service.identities.get("R001")

    return {
        "success": True,
        "user": {
            "id": user["id"],
            "username": user["username"],
            "name": user["name"],
            "role": user["role"],
            "department": user["department"],
            "clearance": user["clearance"],
            "status": user["status"],
            "avatar": user["avatar"],
            "kem_fingerprint": user["kem_fingerprint"],
            "dsa_fingerprint": user["dsa_fingerprint"],
            "is_admin": user["id"] == "ADM-001"
        }
    }

@app.get("/api/recipients")
def list_recipients():
    """List authorized recipients with public key fingerprints"""
    return doc_service.get_public_recipients()

@app.get("/api/dashboard/stats")
def get_dashboard_stats():
    """Dashboard security overview metrics and recent events"""
    docs = doc_service.get_documents_list()
    chain = ledger_service.get_chain()
    chain_audit = ledger_service.verify_chain()

    # Filter decryption events
    decryptions = [b for b in chain if b.get("event_type") == "DECRYPTION_PROVENANCE"]
    
    # Recent events list
    recent_events = []
    for b in reversed(chain[-8:]):
        recent_events.append({
            "block_number": b.get("block_number"),
            "recipient_name": b.get("recipient_name"),
            "event_type": b.get("event_type"),
            "document_name": b.get("document_name"),
            "timestamp": b.get("timestamp"),
            "watermark_id": b.get("watermark_id"),
            "status": "Verified ✓" if not b.get("tampered") else "Tampered ❌"
        })

    return {
        "documents_count": len(docs),
        "recipients_count": len(doc_service.get_public_recipients()) - 1, # Exclude admin
        "decryption_events_count": len(decryptions),
        "ledger_entries_count": len(chain),
        "tamper_alerts": 0 if chain_audit["valid"] else 1,
        "investigations_count": len(os.listdir(EVIDENCE_DIR)) if os.path.exists(EVIDENCE_DIR) else 0,
        "active_documents": docs,
        "recent_events": recent_events,
        "chain_valid": chain_audit["valid"]
    }

@app.get("/api/documents")
def list_documents():
    """Document repository list"""
    return doc_service.get_documents_list()

@app.post("/api/documents/upload")
async def upload_document(file: UploadFile = File(...)):
    """Upload custom document PDF"""
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF documents are supported")

    dest_path = os.path.join(DOCS_DIR, file.filename)
    with open(dest_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return {
        "success": True,
        "filename": file.filename,
        "message": f"Document {file.filename} uploaded and staged for quantum-resilient encryption."
    }

@app.post("/api/distribute")
def distribute_document(req: DistributeRequest):
    """Distribute document with AES-256 + ML-KEM + ML-DSA"""
    try:
        res = doc_service.distribute_document(req.document_name, req.recipient_ids)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/decrypt")
def decrypt_document(req: DecryptRequest):
    """Recipient decryption executing the 7-step cryptographic pipeline"""
    try:
        res = doc_service.decrypt_document(req.document_name, req.recipient_id)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/decryptions/{block_number}")
def get_decryption_provenance(block_number: int):
    """Detailed cryptographic provenance record for judges"""
    chain = ledger_service.get_chain()
    target_block = None
    for b in chain:
        if b.get("block_number") == block_number:
            target_block = b
            break

    if not target_block:
        raise HTTPException(status_code=404, detail=f"Provenance entry #{block_number} not found")

    recipient = doc_service.identities.get(target_block["recipient_id"])

    # Re-verify signature
    sig_valid = False
    if recipient:
        try:
            dsa_pk = base64.b64decode(recipient["pqc_dsa_pk"])
            sig_bytes = bytes.fromhex(target_block["signature"])
            canonical = crypto.canonical_event_bytes({
                "document_hash": target_block["document_hash"],
                "document_name": target_block["document_name"],
                "recipient_id": target_block["recipient_id"],
                "recipient_name": target_block["recipient_name"],
                "session_id": target_block["session_id"],
                "watermark_id": target_block["watermark_id"],
                "timestamp": target_block["timestamp"]
            })
            sig_valid = crypto.dsa_verify(dsa_pk, canonical, sig_bytes)
        except Exception:
            sig_valid = False

    chain_audit = ledger_service.verify_chain()

    return {
        "block_number": target_block["block_number"],
        "document_name": target_block["document_name"],
        "document_id": target_block["document_id"],
        "document_hash": target_block["document_hash"],
        "recipient_name": target_block["recipient_name"],
        "recipient_id": target_block["recipient_id"],
        "session_id": target_block["session_id"],
        "timestamp": target_block["timestamp"],
        "watermark_id": target_block["watermark_id"],
        "signature": target_block["signature"],
        "signature_algorithm": target_block.get("signature_algorithm", "ML-DSA-44 (Dilithium2)"),
        "signature_status": "VALID ✓" if sig_valid else "INVALID ❌",
        "previous_ledger_hash": target_block["previous_hash"],
        "current_entry_hash": target_block["current_hash"],
        "ledger_integrity": "VERIFIED ✓" if chain_audit["valid"] else "COMPROMISED ❌",
        "raw_block": target_block
    }

@app.get("/api/ledger")
def get_ledger():
    """Retrieve full immutable blockchain/ledger and audit status"""
    chain = ledger_service.get_chain()
    verification = ledger_service.verify_chain()
    return {
        "blocks": chain,
        "total_blocks": len(chain),
        "verification": verification
    }

@app.post("/api/ledger/verify")
def verify_ledger():
    """Verify hash chain integrity across all blocks"""
    return ledger_service.verify_chain()

@app.post("/api/ledger/tamper")
def tamper_ledger(req: TamperRequest):
    """Simulate tamper attack on a past ledger block"""
    res = ledger_service.simulate_tamper(req.block_number, req.field, req.malicious_value)
    return res

@app.post("/api/ledger/restore")
def restore_ledger():
    """Restore legitimate hash chain after tamper demonstration"""
    res = ledger_service.restore_legitimate_chain()
    return {
        "restored": True,
        "verification": res,
        "message": "Ledger restored to authentic cryptographically consistent state."
    }

@app.get("/api/investigate/samples")
def get_investigation_samples():
    """List generated decrypted copies for 1-click leak testing"""
    samples = []
    if os.path.exists(DECRYPTED_DIR):
        for f in os.listdir(DECRYPTED_DIR):
            if f.endswith(".pdf"):
                filepath = os.path.join(DECRYPTED_DIR, f)
                samples.append({
                    "filename": f,
                    "size_kb": round(os.path.getsize(filepath) / 1024, 1),
                    "created_at": datetime.fromtimestamp(os.path.getmtime(filepath)).strftime("%Y-%m-%d %H:%M:%S")
                })
    return samples

@app.post("/api/investigate")
async def investigate_leak(
    file: Optional[UploadFile] = File(None),
    sample_filename: Optional[str] = Form(None)
):
    """
    Forensic leak investigation endpoint.
    Accepts uploaded file or preset sample filename (e.g. DEFENCE_REPORT_ALICE.pdf).
    """
    file_bytes = b""
    filename = ""

    if file:
        file_bytes = await file.read()
        filename = file.filename
    elif sample_filename:
        filepath = os.path.join(DECRYPTED_DIR, sample_filename)
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail=f"Sample file {sample_filename} not found")
        with open(filepath, "rb") as f:
            file_bytes = f.read()
        filename = sample_filename
    else:
        raise HTTPException(status_code=400, detail="Must provide either uploaded file or sample_filename")

    res = forensics_service.analyze_leaked_file(file_bytes, filename)
    return res

@app.get("/api/evidence/{case_id}/pdf")
def download_evidence_pdf(case_id: str):
    """Download court-admissible forensic evidence report PDF"""
    filename = f"{case_id}_EVIDENCE_REPORT.pdf"
    filepath = os.path.join(EVIDENCE_DIR, filename)
    if not os.path.exists(filepath):
        # Find any matching PDF
        for f in os.listdir(EVIDENCE_DIR):
            if case_id in f:
                filepath = os.path.join(EVIDENCE_DIR, f)
                filename = f
                break
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail=f"Evidence report {case_id} not found")

    return FileResponse(
        filepath,
        media_type="application/pdf",
        filename=filename
    )

@app.get("/api/files/{folder}/{filename}")
def download_file(folder: str, filename: str):
    """Serve documents, encrypted files, and decrypted files"""
    folder_map = {
        "documents": DOCS_DIR,
        "decrypted": DECRYPTED_DIR,
        "encrypted": ENCRYPTED_DIR,
        "evidence": EVIDENCE_DIR
    }
    target_dir = folder_map.get(folder)
    if not target_dir:
        raise HTTPException(status_code=400, detail="Invalid folder")

    filepath = os.path.join(target_dir, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(filepath, media_type="application/pdf", filename=filename)
