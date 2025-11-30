import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        <div className="font-bold text-2xl text-emerald-700">🌾 RuralFund</div>
        <div className="space-x-6 hidden md:flex text-gray-700">
          <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
          <Link to="/about" className="hover:text-emerald-600 transition">About</Link>
          <Link to="/howitworks" className="hover:text-emerald-600 transition">How It Works</Link>
          <Link to="/getstarted" className="hover:text-emerald-600 transition">Get Started</Link>
          <Link to="/apply-loan" className="hover:text-emerald-600 transition font-semibold text-emerald-600">Apply Loan</Link>
          <Link to="/dashboard" className="hover:text-emerald-600 transition">Dashboard</Link>
          <Link to="/contact" className="hover:text-emerald-600 transition">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;