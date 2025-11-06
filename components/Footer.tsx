import React from "react";
import Logo from '@/public/assets/logo/wastranusa-logo.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-400 py-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Kolom Kiri: Logo & Tagline */}
          <div>
            <div className="flex items-center justify-center md:justify-start mb-4">
              <img
                src={Logo}
                alt="WastraNusa Logo"
                className="w-20 h-20 object-contain"
              />
              <span className="text-2xl font-bold text-white font-display">
                WastraNusa
              </span>
            </div>
            <p className="text-lg text-stone-300">Melestarikan Budaya, Membangun Teknologi.</p>
          </div>

          {/* Kolom Kanan: Link Navigasi */}
          <div className="flex space-x-6 mt-8 md:mt-0">
            <a href="#about" className="hover:text-amber-500 transition-colors duration-200">Tentang</a>
            <a href="#how-it-works" className="hover:text-amber-500 transition-colors duration-200">Cara Kerja</a>
            <a href="#features" className="hover:text-amber-500 transition-colors duration-200">Fitur</a>
            <a href="#team" className="hover:text-amber-500 transition-colors duration-200">Tim</a>
          </div>
        </div>

        <hr className="border-stone-700 my-8" />
        <p className="mt-6 text-sm text-center">© 2025 WastraNusa – Seluruh hak cipta dilindungi.</p>
      </div>
    </footer>
  );
};
