"use client";
import React from "react";

export default function Recommendations() {
  const recommendations = [
    { dest: "Bali", reason: "Based on your interest in beach destinations." },
    { dest: "Shimla", reason: "Based on your search history for mountain travel." }
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mt-6 text-left">
      <h3 className="font-bold text-sm text-gray-900 mb-4 uppercase tracking-wider">✨ Recommended for you</h3>
      <div className="grid grid-cols-1 gap-4">
        {recommendations.map((rec, i) => (
          <div key={i} className="border border-blue-100 p-4 rounded-lg bg-blue-50/50">
            <p className="font-bold text-blue-900 text-xs">{rec.dest}</p>
            {/* Tooltip Wrapper */}
            <div className="group relative mt-2 inline-block">
              <span className="text-[10px] text-blue-600 underline cursor-pointer font-medium">Why this recommendation?</span>
              {/* Tooltip Box */}
              <div className="absolute left-0 bottom-6 w-48 p-2 bg-black text-white text-[9px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                {rec.reason}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}