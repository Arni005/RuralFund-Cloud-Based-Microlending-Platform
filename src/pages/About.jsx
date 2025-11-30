import React from "react";

export default function AboutUs() {
  return (
    <section className="bg-green-50 py-20 px-6 md:px-20">
      <div className="max-w-5xl mx-auto text-center">
        {/* Bigger About Us Heading */}
        <h2 className="text-5xl md:text-6xl font-extrabold text-green-900 mb-6">
          About Us
        </h2>

        {/* Smaller Subheading */}
        <h1 className="text-2xl md:text-3xl font-bold text-green-900 mb-6">
          Empowering Rural Communities, One Step at a Time
        </h1>

        {/* Paragraphs */}
        <p className="text-lg md:text-xl text-green-800 mb-6">
          At <span className="font-semibold">RuralFund</span>, we believe that access to financial resources should never be a barrier to growth. Our platform is dedicated to bridging the gap between rural communities and essential funding, helping farmers, artisans, and small entrepreneurs unlock their full potential.
        </p>
        <p className="text-lg md:text-xl text-green-800 mb-6">
          Founded with the vision of creating a self-sufficient and thriving rural ecosystem, <span className="font-semibold">RuralFund</span> connects local borrowers with responsible lenders through a transparent, secure, and cloud-based microlending platform. We understand the unique challenges faced by rural communities — from limited access to banks to seasonal income patterns — and we design solutions that truly make a difference.
        </p>
        <p className="text-lg md:text-xl text-green-800">
          At <span className="font-semibold">RuralFund</span>, we are more than a platform — we are a movement to empower, educate, and elevate rural communities. By supporting small businesses and local entrepreneurs, we are building a future where prosperity is shared, and opportunities are endless.
        </p>
      </div>
    </section>
  );
}
