// components/landing/AboutSection.tsx
import React from 'react';

export const AboutSection = () => (
  <section id="about" className="py-24 px-4 bg-white">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <span className="font-semibold text-amber-800 uppercase tracking-widest">Mengenal WastraNusa</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-900 my-4">Jembatan Digital Warisan Bangsa</h2>
          <p className="text-lg text-stone-700 leading-relaxed mb-6">
            WastraNusa adalah sebuah jembatan digital yang menghubungkan kekayaan budaya Indonesia dengan teknologi masa depan. Misi kami adalah melestarikan dan memperkenalkan Pakaian Adat Nusantara kepada dunia melalui pengalaman virtual try-on yang interaktif dan edukatif.
          </p>
          <p className="text-lg text-stone-700 leading-relaxed">
            Melalui pengalaman virtual try-on berbasis AI, kami menghadirkan cara baru untuk mengenakan, memahami, 
            dan merayakan pakaian adat. Sebuah ajakan untuk menjaga agar warisan budaya tidak hanya diingat, 
            tetapi terus hidup dan dikenakan kembali.
          </p>
        </div>
        <div className="animate-fade-in-up">
          <div className="relative w-full h-80 md:h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <video
              ref={(el) => { if (el) el.playbackRate = 0.9; }}
              className="absolute inset-0 w-full h-full object-cover"
              src="/video-about.webm"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);