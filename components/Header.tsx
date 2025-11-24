import React from "react";
import Logo from '@/public/assets/logo/wastranusa-logo.png';

interface HeaderProps {
  onNavigate: (view: 'map' | 'studio') => void;
  onOpenUsage: () => void; // ⬅ tambahin ini
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, onOpenUsage }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => onNavigate("studio")}
          >
            <img src={Logo} alt="WastraNusa Logo" className="w-16 h-16" />
            <span className="text-2xl font-bold text-stone-800 font-display">
              WastraNusa
            </span>
          </div>

          {/* Right buttons */}
          <div className="flex items-center space-x-4">

            {/* Cara Penggunaan */}
            <button
              onClick={onOpenUsage}
              className="px-6 py-2 bg-amber-800 text-white rounded-full hover:bg-amber-900 transition-all hover:scale-105"
            >
              Cara Penggunaan
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
