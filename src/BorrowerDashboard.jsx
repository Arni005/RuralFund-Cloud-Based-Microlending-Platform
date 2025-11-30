import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import db from './db/database';
import { updateLoanStatuses } from './services/loanStatus';

export default function BorrowerDashboard() {
  const [localLoans, setLocalLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLocalLoans();
  }, []);

  const loadLocalLoans = async () => {
    try {
      // Load from local DB
      const localLoansData = await db.loans.toArray();
      setLocalLoans(localLoansData);
    } catch (error) {
      console.error('Error loading loans:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await updateLoanStatuses();
    await loadLocalLoans();
  };

  const getStatusBadge = (loan) => {
    // Status priority: 1. syncStatus, 2. loan.status from AWS
    let status = 'pending';
    
    if (loan.syncStatus === 'pending') {
      status = 'pending';
    } else if (loan.syncStatus === 'synced') {
      // Use the status from AWS if available, otherwise default to 'submitted'
      status = loan.status || 'submitted';
    }

    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      'submitted': { color: 'bg-blue-100 text-blue-800', text: 'Submitted' },
      'approved': { color: 'bg-green-100 text-green-800', text: 'Approved' },
      'rejected': { color: 'bg-red-100 text-red-800', text: 'Rejected' }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-emerald-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-emerald-700">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingLoans = localLoans.filter(loan => loan.syncStatus === 'pending');
  const submittedLoans = localLoans.filter(loan => loan.syncStatus === 'synced');

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-emerald-800 mb-2">My Loan Dashboard</h1>
        <p className="text-gray-600 mb-6">Track your personal loan applications and status</p>

        {/* Stats Cards - KEEP THIS EXACTLY THE SAME */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-emerald-500">
            <h3 className="text-lg font-semibold text-emerald-700 mb-2">Total Applications</h3>
            <p className="text-3xl font-bold text-emerald-800">{localLoans.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">Pending Sync</h3>
            <p className="text-3xl font-bold text-blue-800">{pendingLoans.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
            <h3 className="text-lg font-semibold text-yellow-700 mb-2">Awaiting Decision</h3>
            <p className="text-3xl font-bold text-yellow-800">
              {submittedLoans.filter(loan => !loan.status || loan.status === 'submitted' || loan.status === 'pending').length}
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
            <Link to="/apply-loan" className="block">
              <h3 className="text-lg font-semibold text-green-700 mb-2">Apply for New Loan</h3>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-all font-semibold">
                Apply Now
              </button>
            </Link>
          </div>
        </div>

        {/* Pending Sync Section */}
        {pendingLoans.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-yellow-800 mb-4">
              ⚡ {pendingLoans.length} Loan(s) Waiting to Sync
            </h2>
            <p className="text-yellow-700">
              These applications will be automatically submitted when you're back online.
            </p>
          </div>
        )}

        {/* My Loan Applications */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-emerald-800">My Loan Applications</h2>
            <button 
              onClick={handleRefresh}
              disabled={refreshing}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold ${
                refreshing 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {refreshing ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                   Refresh Status
                </>
              )}
            </button>
          </div>
          
          {localLoans.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">You haven't applied for any loans yet.</p>
              <Link to="/apply-loan" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-all font-semibold">
                Apply for Your First Loan
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {localLoans.map((loan, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-emerald-800">{loan.borrowerName}</h3>
                      <p className="text-gray-600">Amount: ₹{loan.amount}</p>
                      <p className="text-gray-600">Purpose: {loan.purpose}</p>
                      <p className="text-gray-500 text-sm">
                        Applied: {new Date(loan.createdAt).toLocaleDateString()}
                        {loan.syncedAt && ` • Submitted: ${new Date(loan.syncedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(loan)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}