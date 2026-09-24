"""
Crypto Service for MoD Secure Document Distribution
Implements:
1. NIST FIPS 203 (ML-KEM / Kyber512) for Post-Quantum Key Encapsulation
2. NIST FIPS 204 (ML-DSA / Dilithium2) for Post-Quantum Digital Signatures
3. AES-256-GCM for Authenticated Document Encryption
4. SHA-256 and HMAC-SHA256 for integrity hashing and cryptographic binding
"""

import os
import json
import hashlib
import hmac
from typing import Tuple, Dict, Any
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from kyber_py.kyber import Kyber512
from dilithium_py.dilithium import Dilithium2

class CryptoService:
    def __init__(self):
        pass

    @staticmethod
    def generate_kem_keypair() -> Tuple[bytes, bytes]:
        """Generate Post-Quantum ML-KEM (Kyber512) Keypair: (pk, sk)"""
        pk, sk = Kyber512.keygen()
        return pk, sk

    @staticmethod
    def generate_dsa_keypair() -> Tuple[bytes, bytes]:
        """Generate Post-Quantum ML-DSA (Dilithium2) Keypair: (pk, sk)"""
        pk, sk = Dilithium2.keygen()
        return pk, sk

    @staticmethod
    def kem_encapsulate(kem_pk: bytes) -> Tuple[bytes, bytes]:
        """
        Encapsulate shared key to recipient's ML-KEM public key.
        Returns: (shared_secret_32bytes, ciphertext)
        """
        shared_secret, ciphertext = Kyber512.encaps(kem_pk)
        return shared_secret, ciphertext

    @staticmethod
    def kem_decapsulate(kem_sk: bytes, ciphertext: bytes) -> bytes:
        """
        Decapsulate shared key using recipient's ML-KEM secret key.
        Returns: shared_secret_32bytes
        """
        return Kyber512.decaps(kem_sk, ciphertext)

    @staticmethod
    def dsa_sign(dsa_sk: bytes, message: bytes) -> bytes:
        """Sign message using recipient's ML-DSA (Dilithium2) secret key"""
        return Dilithium2.sign(dsa_sk, message)

    @staticmethod
    def dsa_verify(dsa_pk: bytes, message: bytes, signature: bytes) -> bool:
        """Verify signature using recipient's ML-DSA (Dilithium2) public key"""
        try:
            return Dilithium2.verify(dsa_pk, message, signature)
        except Exception:
            return False

    @staticmethod
    def encrypt_aes256_gcm(plaintext: bytes, key: bytes) -> Dict[str, bytes]:
        """
        Encrypt plaintext using AES-256-GCM.
        key must be 32 bytes.
        """
        aesgcm = AESGCM(key)
        nonce = os.urandom(12)
        ciphertext = aesgcm.encrypt(nonce, plaintext, None)
        return {
            "nonce": nonce,
            "ciphertext": ciphertext
        }

    @staticmethod
    def decrypt_aes256_gcm(ciphertext: bytes, key: bytes, nonce: bytes) -> bytes:
        """Decrypt AES-256-GCM ciphertext"""
        aesgcm = AESGCM(key)
        return aesgcm.decrypt(nonce, ciphertext, None)

    @staticmethod
    def sha256(data: bytes) -> str:
        """Compute SHA-256 hex digest"""
        return hashlib.sha256(data).hexdigest().upper()

    @staticmethod
    def hmac_sha256(key: bytes, message: bytes) -> str:
        """Compute HMAC-SHA256 hex digest"""
        return hmac.new(key, message, hashlib.sha256).hexdigest().upper()

    @staticmethod
    def generate_watermark_id(recipient_id: str, session_id: str, doc_hash: str, nonce: str) -> str:
        """
        Generate cryptographically bound Watermark ID
        WM = Prefix + SHA256(Recipient_ID + Session_ID + Doc_Hash + Nonce)[:12]
        """
        material = f"{recipient_id}:{session_id}:{doc_hash}:{nonce}".encode("utf-8")
        token = hashlib.sha256(material).hexdigest()[:10].upper()
        return f"WM-{token}"

    @staticmethod
    def canonical_event_bytes(event_dict: Dict[str, Any]) -> bytes:
        """Serialize event to deterministic canonical JSON for signing"""
        clean_dict = {k: v for k, v in event_dict.items() if k != "signature"}
        return json.dumps(clean_dict, sort_keys=True, separators=(",", ":")).encode("utf-8")
