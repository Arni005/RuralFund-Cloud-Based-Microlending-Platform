import { submitLoanToAWS } from './loanApi';
import db from '../db/database';

// sync function
export const syncPendingLoans = async () => {
  try {
    console.log(' Starting background sync of pending loans...');
    
    // all pending loans from local DB
    const pendingLoans = await db.loans
      .where('syncStatus')
      .equals('pending')
      .toArray();

    console.log(`📊 Found ${pendingLoans.length} pending loans to sync...`);

    let successCount = 0;
    let failCount = 0;

    for (const loan of pendingLoans) {
      try {
        console.log(` Syncing loan: ${loan.localId}`, loan);
        
        // Prepare data for AWS (match the expected format)
        const awsLoanData = {
          borrowerName: loan.borrowerName,
          amount: Number(loan.amount),
          purpose: loan.purpose,
          borrowerEmail: loan.borrowerEmail || 'user@example.com'
        };

        const result = await submitLoanToAWS(awsLoanData);
        
        if (result.success) {
          
          await db.loans.update(loan.id, { 
            syncStatus: 'synced',
            synced: true,
            awsLoanId: result.data.loanId || `loan-${Date.now()}-${loan.id}`,
            syncedAt: new Date(),
            status: 'submitted' // Initial status after syncing
          });
          successCount++;
          console.log(`✅ Successfully synced loan: ${loan.localId}`);
        } else {
          failCount++;
          console.warn(`❌ Failed to sync loan: ${loan.localId}`, result.error);
        }
      } catch (loanError) {
        failCount++;
        console.error(`💥 Error syncing loan ${loan.localId}:`, loanError);
      }
    }

    console.log(`🎉 Sync completed: ${successCount} successful, ${failCount} failed`);
    return { successCount, failCount };

  } catch (error) {
    console.error('💥 Background sync failed:', error);
    return { successCount: 0, failCount: 0, error: error.message };
  }
};

// Manual sync trigger
export const manualSync = async () => {
  console.log('👨‍💻 Manual sync triggered');
  return await syncPendingLoans();
};

// Check if there are pending loans
export const hasPendingLoans = async () => {
  try {
    const pendingLoans = await db.loans
      .where('syncStatus')
      .equals('pending')
      .toArray();
    
    return pendingLoans.length > 0;
  } catch (error) {
    console.error('Error checking pending loans:', error);
    return false;
  }
};

