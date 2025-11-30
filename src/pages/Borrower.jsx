import React, { useState } from "react";
import { Button } from "../components/ui/button";

export default function BorrowerForm() {
  const [agree, setAgree] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agree) {
      alert("Please agree to the Terms & Conditions before submitting.");
      return;
    }
    alert("Loan request submitted successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-100 font-['Poppins']">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 md:p-10 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-4"
      >
        {/* Heading */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-900 text-center tracking-wide">
          Borrower Loan Request
        </h1>
        <p className="text-gray-700 text-center mb-2 text-xs md:text-sm">
          Fill out this form to request your microloan. Our team will review and respond soon.
        </p>

        {/* Full Name */}
        <div>
          <label className="block text-gray-800 font-medium mb-1 text-xs md:text-sm">Full Name</label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full p-2 border-b-2 border-emerald-300 focus:border-emerald-600 outline-none bg-transparent placeholder-gray-600 text-xs md:text-sm"
            required
          />
        </div>

        {/* Loan Amount */}
        <div>
          <label className="block text-gray-800 font-medium mb-1 text-xs md:text-sm">Loan Amount</label>
          <input
            type="number"
            placeholder="Enter amount (₹)"
            className="w-full p-2 border-b-2 border-emerald-300 focus:border-emerald-600 outline-none bg-transparent placeholder-gray-600 text-xs md:text-sm"
            required
          />
        </div>

        {/* Borrower Email */}
        <div>
          <label className="block text-gray-800 font-medium mb-1 text-xs md:text-sm">Borrower Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full p-2 border-b-2 border-emerald-300 focus:border-emerald-600 outline-none bg-transparent placeholder-gray-600 text-xs md:text-sm"
            required
          />
        </div>

        {/* Purpose of Loan */}
        <div>
          <label className="block text-gray-800 font-medium mb-1 text-xs md:text-sm">Purpose of Loan</label>
          <input
            type="text"
            placeholder="e.g., Buying Seeds, Equipment, or Livestock"
            className="w-full p-2 border-b-2 border-emerald-300 focus:border-emerald-600 outline-none bg-transparent placeholder-gray-600 text-xs md:text-sm"
            required
          />
        </div>

        {/* Terms & Conditions */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            id="terms"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="w-4 h-4 accent-emerald-700 cursor-pointer"
            required
          />
          <label htmlFor="terms" className="text-gray-700 text-xs md:text-sm">
            I agree to the{" "}
            <span className="text-emerald-800 font-semibold hover:underline cursor-pointer">
              Terms & Conditions
            </span>.
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="mt-3 text-sm md:text-base bg-emerald-700 hover:bg-emerald-800 text-white transition-all py-2 rounded-lg font-semibold shadow-md hover:shadow-lg"
        >
          Submit Loan Request
        </Button>
      </form>
    </div>
  );
}
