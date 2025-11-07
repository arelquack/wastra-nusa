// components/landing/HeroSection.tsx
import React from 'react';
import { IconArrowRight } from '../Icons';

export const HeroSection: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <section className="relative min-h-screen flex items-center justify-center text-center overflow-hidden pt-16">
    <video
      ref={(el) => { if (el) el.playbackRate = 0.9; }}
      className="absolute inset-0 w-full h-full object-cover z-0"
      src="/video-cover.webm"
      autoPlay
      loop
      muted
      playsInline
    />
    <div className="absolute inset-0 bg-black/70 z-10"></div>
    <div className="relative z-20 px-4 py-16">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/20 shadow-2xl">
        <span className="font-semibold text-amber-300 uppercase tracking-widest animate-fade-in-down" style={{ animationDelay: '0.2s' }}>
          Selamat Datang di WastraNusa
        </span>
        <h1 className="font-display text-5xl md:text-7xl font-bold text-white drop-shadow-xl my-4 animate-fade-in-down">
          Pesona Budaya, Sentuhan Teknologi
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-stone-200 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          Jelajahi, pelajari, dan kenakan warisan adiluhung bangsa secara virtual.
        </p>
        <button 
          onClick={onStart} 
          className="mt-10 px-10 py-4 bg-gradient-to-br from-amber-500 to-amber-700 text-white font-bold text-lg rounded-full shadow-lg hover:from-amber-600 hover:to-amber-800 transition-all duration-300 transform hover:scale-105 hover:shadow-amber-400/50 animate-glow flex items-center justify-center mx-auto"
        >
          Mulai Jelajahi
          <IconArrowRight />
        </button>
      </div>
    </div>
  </section>
);