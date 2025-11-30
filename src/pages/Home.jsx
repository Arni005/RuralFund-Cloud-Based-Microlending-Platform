import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../assets/hero.png";
import farmerImg from "../assets/farmer.png";
import womenEntrepreneurImg from "../assets/women_entrepreneur.png";
import shopOwnerImg from "../assets/shop_owner.png";
import ngoImg from "../assets/ngo.png";
import { Button } from "../components/ui/button";

export default function Home() {
  const cards = [
    { img: farmerImg, title: "Farmers (किसान)" },
    { img: womenEntrepreneurImg, title: "Women Entrepreneurs (महिला उद्यमी)" },
    { img: shopOwnerImg, title: "Local Shop Owners (स्थानीय दुकानदार)" },
    { img: ngoImg, title: "Rural Credit Unions / NGOs / MFIs" },
  ];

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <section className="min-h-[80vh] bg-gradient-to-b from-green-50 to-emerald-100 flex items-center overflow-hidden">
        <div className="container mx-auto flex flex-col md:flex-row items-center px-6 md:px-16 py-14">
          {/* Text */}
          <div className="flex-1 flex flex-col justify-center items-start md:pr-10 animate-fade-in-left">
            <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 leading-tight mb-6">
              Empowering Rural Communities Through Smart Microlending — बिना इंटरनेट के भी
            </h1>
            <p className="text-green-700 text-lg mb-6">
              RuralFund enables villagers to apply for and manage{" "}
              <span className="font-semibold">microloans (सूक्ष्म ऋण)</span> offline.
              Automatically syncs when connectivity returns — powered by AWS Cloud.
            </p>
            <Link to="/getstarted">
              <Button className="text-lg hover:scale-105 hover:shadow-xl transition transform duration-300">
                शुरू करें
              </Button>
            </Link>
          </div>

          {/* Image */}
          <div className="flex-1 flex justify-center md:justify-end mt-10 md:mt-0 animate-bounce-slow">
            <img
              src={heroImg}
              alt="Rural Empowerment"
              className="w-72 md:w-[450px] rounded-2xl shadow-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 md:px-16 bg-gradient-to-b from-emerald-50 to-green-100 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-emerald-800 mb-6">
          Our Mission (हमारा मिशन)
        </h2>
        <p className="text-green-700 max-w-3xl mx-auto text-lg leading-relaxed mb-10">
          Millions of rural borrowers struggle with <span className="font-semibold">unstable internet and limited access to finance</span>.
          RuralFund bridges this gap — bringing <span className="font-semibold">accessibility, transparency, and empowerment</span> through
          a secure, cloud-powered platform designed for every village.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 animate-fade-up">
            <h3 className="text-emerald-800 font-semibold text-xl mb-2">🌍 Accessibility</h3>
            <p className="text-green-700 text-sm">Loans accessible anytime, even without internet.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 animate-fade-up">
            <h3 className="text-emerald-800 font-semibold text-xl mb-2">🔍 Transparency</h3>
            <p className="text-green-700 text-sm">Every transaction clear and trackable for both sides.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 animate-fade-up">
            <h3 className="text-emerald-800 font-semibold text-xl mb-2">⚙️ Reliability</h3>
            <p className="text-green-700 text-sm">Cloud-backed, secure, and always up to date.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 animate-fade-up">
            <h3 className="text-emerald-800 font-semibold text-xl mb-2">💪 Empowerment</h3>
            <p className="text-green-700 text-sm">Helping every villager take charge of their future.</p>
          </div>
        </div>
      </section>

      {/* Who Can Use Section */}
      <section className="py-16 px-6 md:px-16 bg-green-50 relative">
        <h2 className="text-3xl md:text-4xl font-semibold mb-2 text-center relative z-10 text-emerald-800">
          Who Can Use RuralFund
        </h2>
        <p className="text-md md:text-lg text-green-700 mb-12 text-center relative z-10">
          (कौन उपयोग कर सकता है)
        </p>

        <div className="absolute inset-0 bg-green-100 rounded-3xl shadow-inner z-0"></div>

        <div className="relative z-10 flex flex-wrap justify-center gap-12">
          {cards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl shadow-lg w-64 md:w-72 p-4 flex flex-col items-center cursor-pointer transform transition duration-500 hover:scale-105 hover:-translate-y-3 hover:shadow-2xl animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <img
                src={card.img}
                alt={card.title}
                className="w-40 h-40 md:w-44 md:h-44 mb-4 object-cover rounded-xl"
              />
              <span className="font-semibold text-lg text-emerald-800 text-center">{card.title}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Impact Stats Section */}
      <section className="py-16 px-6 md:px-16 bg-gradient-to-b from-green-100 to-emerald-200 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-emerald-800 mb-8">
          Our Early Impact (हमारा प्रारंभिक प्रभाव)
        </h2>
        <p className="text-green-700 mb-12 text-lg">Even in our early stages, RuralFund is making a difference.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:scale-105 transform transition duration-300">
            <p className="text-3xl font-bold text-emerald-800 mb-3">200+</p>
            <p className="text-green-700">Microloans enabled in 3 villages within 2 months.</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:scale-105 transform transition duration-300">
            <p className="text-3xl font-bold text-emerald-800 mb-3">60%</p>
            <p className="text-green-700">Reduction in loan approval delays through automation.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 px-6 md:px-16 text-center">
        <div className="flex flex-wrap justify-center gap-6 mb-2">
          <Link to="/about" className="hover:underline">About (हमारे बारे में)</Link>
          <Link to="/faqs" className="hover:underline">FAQs</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        </div>

        <div className="flex justify-center gap-6 my-3">
          {/* GitHub Logo */}
          <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.58 0-.29-.01-1.04-.015-2.04-3.338.73-4.042-1.61-4.042-1.61-.546-1.38-1.333-1.75-1.333-1.75-1.09-.74.082-.725.082-.725 1.205.085 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.997.108-.77.418-1.3.762-1.6-2.664-.3-5.466-1.33-5.466-5.93 0-1.31.467-2.38 1.235-3.22-.124-.3-.536-1.52.117-3.17 0 0 1.008-.32 3.3 1.23a11.52 11.52 0 013.003-.4 11.52 11.52 0 013.003.4c2.29-1.55 3.297-1.23 3.297-1.23.654 1.65.242 2.87.118 3.17.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.63-5.48 5.92.43.37.816 1.1.816 2.22 0 1.6-.014 2.9-.014 3.3 0 .32.192.7.802.58C20.565 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z" />
          </svg>

          {/* LinkedIn Logo */}
          <svg
            className="w-6 h-6 fill-white"
            viewBox="0 0 34 34"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M34,34H27V23c0-2.7-0.1-6.2-3.8-6.2c-3.8,0-4.4,3-4.4,6v11h-7V11h6.7v3.2h0.1
              c0.9-1.7,3.1-3.5,6.4-3.5c6.9,0,8.2,4.5,8.2,10.3V34z M4,8C1.8,8,0,6.2,0,4S1.8,0,4,0s4,1.8,4,4S6.2,8,4,8z M0,34h8V11H0V34z"/>
          </svg>
        </div>

        <p className="m-0">Email: support@ruralfund.com</p>
        <p className="m-0">© 2025 RuralFund. सभी अधिकार सुरक्षित।</p>
      </footer>
    </div>
  );
}
