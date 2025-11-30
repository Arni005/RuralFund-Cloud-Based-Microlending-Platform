import Dexie from 'dexie';

// Creates a new database
const db = new Dexie('MicroLendingDB');


db.version(2).stores({  
  loans: '++id, borrowerName, amount, purpose, status, synced, syncStatus, localId, borrowerEmail, createdAt, awsLoanId',
  mediaBlobs: '++id, loanId, blob'
});

db.version(2).stores({ loans: '++id, borrowerName, amount, purpose, status, synced, syncStatus, localId, borrowerEmail, createdAt, awsLoanId' }).upgrade(tx => {
  return tx.table('loans').toCollection().modify(loan => {
    loan.syncStatus = loan.synced === true ? 'synced' : 'pending';
    loan.localId = loan.localId || Date.now();
    loan.borrowerEmail = loan.borrowerEmail || '';
    loan.createdAt = loan.createdAt || new Date();
  });
});

export default db;

