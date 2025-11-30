import React from "react";
import { Button } from "../components/ui/button";

export default function Contact() {
  return (
    <section className="min-h-[30vh] bg-purple-50 flex flex-col items-center py-4 px-6 md:px-16">
      <h1 className="text-4xl md:text-5xl font-bold text-purple-800 mb-8 text-center">
        Contact Us
      </h1>

      <form className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full flex flex-col gap-4">
        <label className="text-gray-700 font-semibold">Full Name</label>
        <input
          type="text"
          placeholder="Your Name"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />

        <label className="text-gray-700 font-semibold">Email</label>
        <input
          type="email"
          placeholder="Your Email"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
        />

        <label className="text-gray-700 font-semibold">Message</label>
        <textarea
          rows={5}
          placeholder="Your Message"
          className="p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
        ></textarea>

        <Button type="submit" className="mt-4 w-full">
          Send Message
        </Button>
      </form>
    </section>
  );
}
