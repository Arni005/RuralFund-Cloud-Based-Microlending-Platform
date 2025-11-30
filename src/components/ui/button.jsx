import React from "react";

export function Button({ children, className, ...props }) {
  return (
    <button
      className={`px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
