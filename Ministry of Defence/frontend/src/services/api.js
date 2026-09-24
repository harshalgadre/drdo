/**
 * API Service for MoD Secure Document Distribution & Attribution System
 */

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api`;

export const api = {
  // System status
  async getStatus() {
    const res = await fetch(`${API_BASE}/status`);
    return res.json();
  },

  // Auth / Simulated login
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return res.json();
  },

  // Recipients
  async getRecipients() {
    const res = await fetch(`${API_BASE}/recipients`);
    return res.json();
  },

  // Dashboard stats
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/dashboard/stats`);
    return res.json();
  },

  // Documents
  async getDocuments() {
    const res = await fetch(`${API_BASE}/documents`);
    return res.json();
  },

  async uploadDocument(file) {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${API_BASE}/documents/upload`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  // Distribute
  async distributeDocument(data) {
    const res = await fetch(`${API_BASE}/distribute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // Decrypt
  async decryptDocument(documentName, recipientId) {
    const res = await fetch(`${API_BASE}/decrypt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document_name: documentName,
        recipient_id: recipientId
      })
    });
    return res.json();
  },

  // Decryption provenance details
  async getDecryptionDetails(blockNumber) {
    const res = await fetch(`${API_BASE}/decryptions/${blockNumber}`);
    return res.json();
  },

  // Ledger
  async getLedger() {
    const res = await fetch(`${API_BASE}/ledger`);
    return res.json();
  },

  async verifyLedger() {
    const res = await fetch(`${API_BASE}/ledger/verify`, {
      method: 'POST'
    });
    return res.json();
  },

  async tamperLedger(blockNumber, field = 'recipient_name', maliciousValue = 'Mallory (Attacker)') {
    const res = await fetch(`${API_BASE}/ledger/tamper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        block_number: blockNumber,
        field: field,
        malicious_value: maliciousValue
      })
    });
    return res.json();
  },

  async restoreLedger() {
    const res = await fetch(`${API_BASE}/ledger/restore`, {
      method: 'POST'
    });
    return res.json();
  },

  // Investigation
  async getInvestigationSamples() {
    const res = await fetch(`${API_BASE}/investigate/samples`);
    return res.json();
  },

  async investigateLeak(file = null, sampleFilename = null) {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    } else if (sampleFilename) {
      formData.append('sample_filename', sampleFilename);
    }

    const res = await fetch(`${API_BASE}/investigate`, {
      method: 'POST',
      body: formData
    });
    return res.json();
  },

  // Evidence PDF URL
  getEvidencePdfUrl(caseId) {
    return `${API_BASE}/evidence/${caseId}/pdf`;
  },

  // Download URL
  getFileUrl(folder, filename) {
    return `${API_BASE}/files/${folder}/${filename}`;
  }
};
