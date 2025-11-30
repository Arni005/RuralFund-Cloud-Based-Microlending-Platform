// ApplyLoan.jsx
import React, { useState } from "react";
import { submitLoanToAWS } from './services/loanApi';
import db from './db/database';

export default function ApplyLoan() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    purpose: "",
    amount: "",
    duration: "",
    description: "",
  });

  const [agree, setAgree] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Check if all required fields are filled and terms are agreed
  const isFormValid = () => {
    return (
      formData.name.trim() &&
      formData.email.trim() &&
      formData.purpose.trim() &&
      formData.amount.trim() &&
      formData.duration.trim() &&
      agree
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setIsLoading(true);

    try {
      // Prepare data for AWS (match the expected format)
      const awsLoanData = {
        borrowerName: formData.name,
        amount: Number(formData.amount),
        purpose: formData.purpose,
        borrowerEmail: formData.email
      };

      // 1. First save locally (offline support)
      const localId = Date.now();
      await db.loans.add({
        ...awsLoanData,
        localId: localId,
        syncStatus: 'pending',
        status: 'pending',
        synced: false,
        duration: formData.duration,
        description: formData.description,
        agreeToTerms: agree,
        createdAt: new Date()
      });
      console.log('✅ Saved locally to IndexedDB');

      // 2. Try to submit to AWS
      const awsResult = await submitLoanToAWS(awsLoanData);
      
      if (awsResult.success) {
        // Update local record as synced
        const loans = await db.loans.where('localId').equals(localId).toArray();
        if (loans.length > 0) {
          await db.loans.update(loans[0].id, { 
            syncStatus: 'synced',
            synced: true,
            awsLoanId: awsResult.data.loanId
          });
        }
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        
        // Reset form
        setFormData({
          name: "",
          email: "",
          purpose: "",
          amount: "",
          duration: "",
          description: "",
        });
        setAgree(false);
      } else {
        // Will be synced later via background sync
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
        console.log('📱 Application saved offline. Will sync when online.');
      }
    } catch (error) {
      console.error('Submit failed:', error);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  // Get button styles based on form state
  const getButtonStyles = () => {
    if (!isFormValid()) {
      return "bg-gray-400 cursor-not-allowed"; // Gray when incomplete
    }
    if (isLoading) {
      return "bg-emerald-400 cursor-not-allowed"; // Lighter green when loading
    }
    return "bg-emerald-600 hover:bg-emerald-700 transform hover:scale-105"; // Green when ready
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-3">
            Apply for a Loan
          </h1>
          <p className="text-gray-600 text-lg">
            Fill out the form below to start your loan application process
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl border border-emerald-100 w-full"
        >
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                Purpose of Loan *
              </label>
              <input
                id="purpose"
                type="text"
                name="purpose"
                placeholder="e.g., Buying seeds, equipment, farm expansion"
                value={formData.purpose}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Amount (₹) *
                </label>
                <input
                  id="amount"
                  type="number"
                  name="amount"
                  placeholder="Enter amount in rupees"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  min="0"
                  required
                />
              </div>

              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (months) *
                </label>
                <input
                  id="duration"
                  type="number"
                  name="duration"
                  placeholder="Loan duration in months"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Loan Usage Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe in detail how you plan to use the loan funds..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 resize-vertical"
              ></textarea>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3 mt-2 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
              <input
                type="checkbox"
                id="terms"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-5 h-5 accent-emerald-700 cursor-pointer mt-0.5"
                required
              />
              <label htmlFor="terms" className="text-gray-700 text-sm flex-1">
                I agree to the{" "}
                <span className="text-emerald-800 font-semibold hover:underline cursor-pointer">
                  Terms & Conditions
                </span>{" "}
                and understand that this loan application is subject to approval based on eligibility criteria.
              </label>
            </div>

            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white shadow-md transition-all duration-300 ${getButtonStyles()}`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Submit Application"
              )}
            </button>

            {submitted && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg animate-fadeIn">
                <p className="text-emerald-700 text-center font-medium">
                  ✅ Loan application submitted successfully! We'll contact you shortly.
                </p>
              </div>
            )}
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}