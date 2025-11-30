import React from "react";
import { Button } from "../components/ui/button";

export default function GetStarted() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-100 via-emerald-200 to-emerald-50 font-['Poppins']">

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-16 px-6 md:px-16">
        <h1 className="text-3xl md:text-4xl font-extrabold text-emerald-900 mb-3 tracking-wide">
          Start Your Loan Journey Today
        </h1>
        <p className="text-gray-700 text-base md:text-lg mb-6 max-w-2xl">
          RuralFund helps you get microloans to grow your farm, buy equipment, or support small businesses — quickly and easily.
        </p>
        <Button
          className="bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-6 rounded-lg shadow-md font-semibold text-sm md:text-base"
          onClick={() => window.location.href="/apply-loan"} // Links to borrower form
        >
          Apply for a Loan
        </Button>
      </section>

      {/* Benefits Section */}
      <section className="py-12 px-6 md:px-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-emerald-900 mb-6 tracking-wide">
          Why Choose RuralFund?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-5 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-emerald-800 mb-1">Quick Approval</h3>
            <p className="text-gray-700 text-sm">
              Our team reviews loan requests promptly, ensuring you get funds when you need them.
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-emerald-800 mb-1">Low-Interest Loans</h3>
            <p className="text-gray-700 text-sm">
              Affordable microloans designed specifically for farmers and small entrepreneurs.
            </p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-emerald-800 mb-1">Offline Support</h3>
            <p className="text-gray-700 text-sm">
              Apply even with limited internet access — our support team guides you every step.
            </p>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="mt-auto bg-gray-800 p-5 text-center rounded-t-3xl">
        <p className="text-white text-sm">&copy; {new Date().getFullYear()} RuralFund. All rights reserved.</p>
        <p className="text-gray-300 text-xs mt-1">
          Contact us: support@ruralfund.com | +91 12345 67890
        </p>
      </footer>
    </div>
  );
}
