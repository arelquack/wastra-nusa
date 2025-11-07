// components/TeamMemberCard.tsx
import React from 'react';

export const TeamMemberCard = ({ name, role, imageUrl }: { name: string, role: string, imageUrl: string }) => (
  <div className="text-center group">
    <div className="relative inline-block">
      <img 
        src={imageUrl} 
        alt={name} 
        className="w-36 h-36 rounded-full object-cover mx-auto shadow-lg border-4 border-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl" 
      />
    </div>
    <h4 className="mt-5 font-bold text-xl text-stone-800">{name}</h4>
    <p className="text-amber-800 font-semibold">{role}</p>
  </div>
);