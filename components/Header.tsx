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
          <a href="#" onClick={handleStart} className="flex items-center space-x-2">
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
          </a>
        </div>
      </div>
    </nav>
  );
};
