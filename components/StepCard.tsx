// components/StepCard.tsx
import React from 'react';

export const StepCard = ({ number, icon, title, description }: { number: string, icon: React.ReactElement, title: string, description: string }) => (
  <div className="relative bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/50 transition-all duration-300 hover:-translate-y-1">
    <div className="absolute -top-4 -left-4 w-16 h-16 flex items-center justify-center bg-gradient-to-br from-amber-700 to-amber-900 text-white font-display text-3xl font-bold rounded-2xl shadow-lg transform -rotate-12">
      {number}
    </div>
    <div className="mt-12 mb-4 text-amber-800">
      {React.cloneElement(icon, { className: "h-12 w-12" })}
    </div>
    <h3 className="font-display text-2xl font-bold text-stone-900 mb-2">{title}</h3>
    <p className="text-stone-600 text-sm">{description}</p>
  </div>
);