import React from "react";

export default function HowItWorks() {
  const steps = [
    {
      title: "Apply Offline",
      description:
        "Borrowers can fill out and save a loan application directly in the RuralFund app on their phone—no internet required. The data is stored securely on the device.",
    },
    {
      title: "Automatic Sync",
      description:
        "The moment the phone finds an internet connection, the app automatically syncs the saved application with our secure cloud platform. This happens in the background without any extra steps.",
    },
    {
      title: "Review and Approve",
      description:
        "Lenders instantly see the new application on their dashboard. They can review the details and approve the loan online. The borrower is then immediately notified of the decision.",
    },
  ];

  return (
    <section className="min-h-[10vh] bg-blue-50 flex items-center">
      <div className="container mx-auto px-6 md:px-16 py-24">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-12 text-center">
          How It Works
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-start items-start hover:shadow-2xl transition"
            >
              <h2 className="text-xl font-semibold text-emerald-700 mb-3">
                {step.title}
              </h2>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
