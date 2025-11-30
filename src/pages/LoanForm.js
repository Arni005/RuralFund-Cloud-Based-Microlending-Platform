import React, { useState } from 'react';
import db from '../db/database';
import { submitLoanToAWS } from '../services/loanApi'; // Add this import

function LoanForm() {
  const [form, setForm] = useState({ 
    borrowerName: '', 
    amount: '', 
    purpose: '',
    borrowerEmail: '' // Add email field since AWS API requires it
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data in the format AWS expects
    const formData = {
      borrowerName: form.borrowerName,
      amount: Number(form.amount), // Convert to number
      purpose: form.purpose,
      borrowerEmail: form.borrowerEmail || 'user@example.com' // Default if empty
    };

    // 1. First save locally (offline support)
    try {
      await db.loans.add({
        ...formData,
        localId: Date.now(),
        syncStatus: 'pending', // pending, synced, failed
        status: 'pending',
        synced: false,
        createdAt: new Date()
      });
      console.log('✅ Saved locally to IndexedDB');
    } catch (error) {
      console.error('❌ Error saving locally:', error);
    }

    // 2. Try to submit to AWS
    try {
      const awsResult = await submitLoanToAWS(formData);
      
      if (awsResult.success) {
        // Update local record as synced
        // Note: We need to find the loan by localId to update it
        const loans = await db.loans.where('localId').equals(formData.localId).toArray();
        if (loans.length > 0) {
          await db.loans.update(loans[0].id, { 
            syncStatus: 'synced',
            synced: true,
            awsLoanId: awsResult.data.loanId // if API returns an ID
          });
        }
        alert('✅ Loan application submitted successfully!');
      } else {
        // Will be synced later via background sync
        alert('📱 Application saved offline. Will sync when online.');
      }
    } catch (error) {
      console.error('Submit failed:', error);
      alert('📱 Application saved offline. Will sync when online.');
    }

    // Clear form
    setForm({ borrowerName: '', amount: '', purpose: '', borrowerEmail: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Loan Request</h2>
      
      <input 
        name="borrowerName" 
        placeholder="Your Name" 
        value={form.borrowerName} 
        onChange={handleChange} 
        required 
      />
      
      <input 
        name="amount" 
        type="number"
        placeholder="Loan Amount" 
        value={form.amount} 
        onChange={handleChange} 
        required 
      />
      
      <input 
        name="borrowerEmail" 
        type="email"
        placeholder="Your Email" 
        value={form.borrowerEmail} 
        onChange={handleChange} 
        required 
      />
      
      <textarea 
        name="purpose" 
        placeholder="Purpose" 
        value={form.purpose} 
        onChange={handleChange}
        required
      ></textarea>
      
      <button type="submit">Submit Loan Request</button>
    </form>
  );
}

export default LoanForm;
