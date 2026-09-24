"""
Immutable Tamper-Evident Provenance Ledger
Implements cryptographically chained blocks:
Block N+1 contains Hash(Block N).
Provides real SHA-256 chain verification, tamper detection, and ledger lookup.
"""

import os
import json
import hashlib
from datetime import datetime
from typing import Dict, Any, List, Optional, Tuple

LEDGER_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "storage", "ledger.json")

class LedgerService:
    def __init__(self, filepath: str = LEDGER_FILE):
        self.filepath = filepath
        self._init_ledger()

    def _init_ledger(self):
        """Initialize ledger file with Genesis block if it does not exist"""
        os.makedirs(os.path.dirname(self.filepath), exist_ok=True)
        if not os.path.exists(self.filepath):
            genesis_timestamp = "2026-09-24T09:00:00"
            genesis_prev_hash = "0000000000000000000000000000000000000000000000000000000000000000"
            genesis_payload = {
                "block_number": 179,
                "timestamp": genesis_timestamp,
                "event_type": "GENESIS_ROOT",
                "document_id": "MOD-SYSTEM-ROOT",
                "document_name": "MoD Strategic Key & Provenance Authority Root",
                "document_hash": "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855",
                "recipient_id": "SYS-ROOT",
                "recipient_name": "Ministry of Defence Root CA",
                "session_id": "SES-ROOT-000",
                "watermark_id": "WM-ROOT-GENESIS",
                "signature": "GENESIS_CRYPTO_ANCHOR_VERIFIED_77BC9A403FE29D12",
                "signature_algorithm": "ML-DSA-44",
                "previous_hash": genesis_prev_hash,
            }
            genesis_hash = self.compute_block_hash(genesis_payload, genesis_prev_hash)
            genesis_payload["current_hash"] = genesis_hash
            genesis_payload["tampered"] = False

            with open(self.filepath, "w", encoding="utf-8") as f:
                json.dump([genesis_payload], f, indent=2)

    @staticmethod
    def compute_block_hash(block_data: Dict[str, Any], previous_hash: str) -> str:
        """
        Compute deterministic SHA-256 hash of block contents bound to previous hash.
        current_hash = SHA-256(block_num | prev_hash | timestamp | event_type | doc_id | doc_name | rec_id | rec_name | ses_id | wm_id | doc_hash | sig)
        """
        material = (
            f"{block_data.get('block_number')}|"
            f"{previous_hash}|"
            f"{block_data.get('timestamp')}|"
            f"{block_data.get('event_type')}|"
            f"{block_data.get('document_id')}|"
            f"{block_data.get('document_name')}|"
            f"{block_data.get('recipient_id')}|"
            f"{block_data.get('recipient_name')}|"
            f"{block_data.get('session_id')}|"
            f"{block_data.get('watermark_id')}|"
            f"{block_data.get('document_hash')}|"
            f"{block_data.get('signature')}"
        ).encode("utf-8")
        return hashlib.sha256(material).hexdigest().upper()

    def get_chain(self) -> List[Dict[str, Any]]:
        """Retrieve full chain of blocks"""
        try:
            with open(self.filepath, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def save_chain(self, chain: List[Dict[str, Any]]):
        """Save chain to storage"""
        with open(self.filepath, "w", encoding="utf-8") as f:
            json.dump(chain, f, indent=2)

    def add_block(
        self,
        event_type: str,
        document_id: str,
        document_name: str,
        document_hash: str,
        recipient_id: str,
        recipient_name: str,
        session_id: str,
        watermark_id: str,
        signature: str,
        signature_algorithm: str = "ML-DSA-44",
        timestamp: Optional[str] = None
    ) -> Dict[str, Any]:
        """Add new verified block to ledger"""
        chain = self.get_chain()
        last_block = chain[-1] if chain else None
        
        last_block_num = last_block.get("block_number", 179) if last_block else 179
        previous_hash = last_block.get("current_hash", "00000000000000000000000000000000") if last_block else "00000000000000000000000000000000"
        
        block_number = last_block_num + 1
        now_ts = timestamp or datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        block_data = {
            "block_number": block_number,
            "timestamp": now_ts,
            "event_type": event_type,
            "document_id": document_id,
            "document_name": document_name,
            "document_hash": document_hash,
            "recipient_id": recipient_id,
            "recipient_name": recipient_name,
            "session_id": session_id,
            "watermark_id": watermark_id,
            "signature": signature,
            "signature_algorithm": signature_algorithm,
            "previous_hash": previous_hash,
            "tampered": False
        }

        current_hash = self.compute_block_hash(block_data, previous_hash)
        block_data["current_hash"] = current_hash

        chain.append(block_data)
        self.save_chain(chain)
        return block_data

    def verify_chain(self) -> Dict[str, Any]:
        """
        Verify cryptographic integrity of every block and hash linkage from genesis to tip.
        Returns detailed audit status.
        """
        chain = self.get_chain()
        if not chain:
            return {"valid": False, "reason": "Ledger is empty", "broken_at_block": None}

        # Check genesis
        genesis = chain[0]
        expected_genesis_hash = self.compute_block_hash(genesis, genesis.get("previous_hash", ""))
        if genesis.get("current_hash") != expected_genesis_hash:
            return {
                "valid": False,
                "broken_at_block": genesis.get("block_number"),
                "reason": "Genesis block hash mismatch!",
                "expected_hash": expected_genesis_hash,
                "actual_hash": genesis.get("current_hash")
            }

        # Verify all subsequent links
        for i in range(1, len(chain)):
            curr_block = chain[i]
            prev_block = chain[i - 1]

            # 1. Previous hash linkage check
            if curr_block.get("previous_hash") != prev_block.get("current_hash"):
                return {
                    "valid": False,
                    "broken_at_block": curr_block.get("block_number"),
                    "reason": f"Hash linkage broken between Block #{prev_block.get('block_number')} and Block #{curr_block.get('block_number')}!",
                    "expected_previous": prev_block.get("current_hash"),
                    "actual_previous": curr_block.get("previous_hash")
                }

            # 2. Block content recomputation check
            recomputed = self.compute_block_hash(curr_block, curr_block.get("previous_hash", ""))
            if curr_block.get("current_hash") != recomputed:
                return {
                    "valid": False,
                    "broken_at_block": curr_block.get("block_number"),
                    "reason": f"Block #{curr_block.get('block_number')} data was tampered with! Computed hash does not match stored hash.",
                    "expected_hash": recomputed,
                    "actual_hash": curr_block.get("current_hash")
                }

        return {
            "valid": True,
            "total_blocks": len(chain),
            "latest_block": chain[-1].get("block_number"),
            "latest_hash": chain[-1].get("current_hash"),
            "message": "Ledger cryptographic integrity verified. All hash pointers and SHA-256 bindings valid."
        }

    def simulate_tamper(self, block_number: int, field_to_alter: str = "recipient_name", malicious_val: str = "Mallory (Attacker)") -> Dict[str, Any]:
        """
        Simulate tampering with an existing ledger block to prove chain invalidation.
        """
        chain = self.get_chain()
        found = False
        target_block = None

        for b in chain:
            if b.get("block_number") == block_number:
                b[field_to_alter] = malicious_val
                b["tampered"] = True
                found = True
                target_block = b
                break

        if not found:
            return {"success": False, "error": f"Block #{block_number} not found"}

        self.save_chain(chain)
        verification = self.verify_chain()
        return {
            "success": True,
            "tampered_block": block_number,
            "field": field_to_alter,
            "tampered_value": malicious_val,
            "chain_verification": verification
        }

    def restore_legitimate_chain(self) -> Dict[str, Any]:
        """Recompute valid hashes to restore legitimate chain after demonstration"""
        chain = self.get_chain()
        for i, b in enumerate(chain):
            b["tampered"] = False
            # If recipient was altered to Mallory, restore based on ID
            if b.get("recipient_id") == "R001":
                b["recipient_name"] = "Alice"
            elif b.get("recipient_id") == "R002":
                b["recipient_name"] = "Bob"
            elif b.get("recipient_id") == "R003":
                b["recipient_name"] = "Charlie"

            prev_hash = chain[i - 1].get("current_hash") if i > 0 else "0000000000000000000000000000000000000000000000000000000000000000"
            b["previous_hash"] = prev_hash
            b["current_hash"] = self.compute_block_hash(b, prev_hash)

        self.save_chain(chain)
        return self.verify_chain()

    def find_by_watermark(self, watermark_id: str) -> Optional[Dict[str, Any]]:
        """Search ledger for provenance block corresponding to watermark ID"""
        chain = self.get_chain()
        for b in chain:
            if b.get("watermark_id") == watermark_id:
                return b
        return None
