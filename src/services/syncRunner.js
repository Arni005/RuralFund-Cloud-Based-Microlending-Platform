// src/services/syncRunner.js
import db from '../db/database'; // your Dexie instance
const API_BASE = 'https://api.example.com'; // replace

export async function runSync(token) {
  const pending = await db.loans.where('synced').equals(false).toArray();
  for (const loan of pending) {
    try {
      // if loan has mediaRef pointing to local blob id:
      if (loan.mediaLocalId) {
        const blobRecord = await db.mediaBlobs.get(loan.mediaLocalId);
        if (blobRecord && blobRecord.blob) {
          // request signed URL
          const tokenHeader = token ? { Authorization: `Bearer ${token}` } : {};
          const urlRes = await fetch(`${API_BASE}/getUploadUrl`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...tokenHeader },
            body: JSON.stringify({ filename: loan.mediaFilename, contentType: blobRecord.type })
          });
          const { uploadUrl, fileUrl } = await urlRes.json();
          // PUT blob
          await fetch(uploadUrl, { method: 'PUT', body: blobRecord.blob });
          loan.mediaUrl = fileUrl; // attach for metadata
        }
      }

      // Prepare payload (strip local-only fields)
      const payload = { clientId: loan.clientId || loan.id, borrowerName: loan.borrowerName, amount: loan.amount, purpose: loan.purpose, mediaUrl: loan.mediaUrl };

      // POST metadata - Workbox will queue if offline, but here we do immediate fetch
      const res = await fetch(`${API_BASE}/createLoan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token?{Authorization:`Bearer ${token}`}:{}) },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        await db.loans.update(loan.id, { synced: true, cloudId: data.id, syncedAt: new Date().toISOString() });
        if (loan.mediaLocalId) await db.mediaBlobs.delete(loan.mediaLocalId);
      } else {
        
        console.warn('Loan rejected by server', await res.text());
      }
    } catch (e) {
      console.error('Sync error for loan', loan.id, e);
      // leave as unsynced to retry later
    }
  }
}
