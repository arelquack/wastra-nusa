// components/FeatureCard.tsx
import React from 'react';

export const FeatureCard = ({ icon, title, description }: { icon: React.ReactElement, title: string, description: string }) => (
  <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/30 text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:bg-white">
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 text-white mx-auto mb-5 shadow-lg">
      {React.cloneElement(icon, { className: "h-8 w-8" })}
    </div>
    <h3 className="font-display text-2xl font-bold text-stone-900 mb-2">{title}</h3>
    <p className="text-stone-600 text-sm leading-relaxed">{description}</p>
  </div>
);