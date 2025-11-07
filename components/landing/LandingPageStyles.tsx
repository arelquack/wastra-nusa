// components/landing/LandingPageStyles.tsx
import React from 'react';

export const LandingPageStyles = () => (
  <style>{`
    html {
      scroll-behavior: smooth;
    }
    @keyframes fadeInDown {
      0% { opacity: 0; transform: translateY(-20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-down {
      animation: fadeInDown 1s ease-out forwards;
      opacity: 0;
    }
    @keyframes fadeInUp {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 1s ease-out forwards;
      opacity: 0;
    }
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    .animate-fade-in {
      animation: fadeIn 1s ease-out forwards;
      opacity: 0;
    }
    @keyframes glow {
      0%, 100% { box-shadow: 0 0 10px rgba(245, 158, 11, 0.4), 0 0 20px rgba(245, 158, 11, 0.3); }
      50% { box-shadow: 0 0 25px rgba(245, 158, 11, 0.6), 0 0 40px rgba(245, 158, 11, 0.4); }
    }
    .animate-glow {
      animation: glow 3s ease-in-out infinite 1s;
    }
  `}</style>
);