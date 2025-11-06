import React from 'react';
import Logo from '@/public/assets/logo/wastranusa-logo.png';

interface HeaderProps {
  onNavigate: (view: 'map' | 'studio') => void;
  currentView: 'map' | 'studio';
}

export const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const handleStart = () => {
    onNavigate('studio');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo + Text */}
          <div className="flex items-center space-x-2">
            <img
              src={Logo}
              alt="WastraNusa Logo"
              className="w-20 h-20 object-contain"
            />
            <span className="text-2xl font-bold text-stone-800 font-display">
              WastraNusa
            </span>
          </div>

          {/* CTA */}
          <button
            onClick={handleStart}
            className="hidden md:block px-5 py-2 bg-amber-800 text-white text-sm font-semibold rounded-full shadow-sm hover:bg-amber-900 transition-all duration-300 hover:scale-105"
          >
            Coba Sekarang
          </button>
        </div>
      </div>
    </nav>
  );
};
