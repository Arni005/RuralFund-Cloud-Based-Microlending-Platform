import { getAllLoansFromAWS, getLoanStatus } from './loanApi';
import db from '../db/database';

// status checking with multiple fallback methods
export const updateLoanStatuses = async () => {
  try {
    console.log('🔄 Checking loan statuses from AWS...');
    
    const syncedLoans = await db.loans
      .where('syncStatus')
      .equals('synced')
      .toArray();

    let updatedCount = 0;

    // Method 1: Try to get all loans from AWS and match by data
    try {
      const allLoansResult = await getAllLoansFromAWS();
      
      if (allLoansResult.success && allLoansResult.data) {
        const awsLoans = allLoansResult.data;
        
        for (const localLoan of syncedLoans) {
          // Find matching loan in AWS by borrower name, amount, and purpose
          const matchingAwsLoan = awsLoans.find(awsLoan => 
            awsLoan.borrowerName === localLoan.borrowerName &&
            Number(awsLoan.amount) === Number(localLoan.amount) &&
            awsLoan.purpose === localLoan.purpose
          );
          
          if (matchingAwsLoan) {
            const awsStatus = matchingAwsLoan.status || 'submitted';
            let ourStatus = 'submitted';
            
            if (awsStatus.toLowerCase().includes('approve') || awsStatus.toLowerCase().includes('accept')) {
              ourStatus = 'approved';
            } else if (awsStatus.toLowerCase().includes('reject') || awsStatus.toLowerCase().includes('deny')) {
              ourStatus = 'rejected';
            }
            
            if (localLoan.status !== ourStatus) {
              await db.loans.update(localLoan.id, {
                status: ourStatus,
                awsLoanId: matchingAwsLoan.loanId || localLoan.awsLoanId,
                updatedAt: new Date()
              });
              updatedCount++;
              console.log(`✅ Updated ${localLoan.borrowerName} status to: ${ourStatus}`);
            }
          }
        }
      }
    } catch (fallbackError) {
      console.log('Fallback method failed, trying individual status checks...');
      
      // Method 2: Individual status checks for loans with awsLoanId
      for (const loan of syncedLoans) {
        if (loan.awsLoanId && !loan.awsLoanId.startsWith('loan-')) {
          try {
            const statusResult = await getLoanStatus(loan.awsLoanId);
            
            if (statusResult.success && statusResult.data) {
              const awsStatus = statusResult.data.status || 'submitted';
              let ourStatus = 'submitted';
              
              if (awsStatus.toLowerCase().includes('approve')) ourStatus = 'approved';
              else if (awsStatus.toLowerCase().includes('reject')) ourStatus = 'rejected';
              
              if (loan.status !== ourStatus) {
                await db.loans.update(loan.id, {
                  status: ourStatus,
                  updatedAt: new Date()
                });
                updatedCount++;
              }
            }
          } catch (error) {
            console.error(`Error checking loan ${loan.awsLoanId}:`, error);
          }
        }
      }
    }

    console.log(`✅ Updated status for ${updatedCount} loans`);
    return { updatedCount };
  } catch (error) {
    console.error('Error updating loan statuses:', error);
    return { updatedCount: 0 };
  }
};