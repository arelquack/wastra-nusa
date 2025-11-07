// components/landing/FeaturesSection.tsx
import React from 'react';
import { FeatureCard } from '../FeatureCard';
import { IconAi, IconMap, IconCamera, IconWorld } from '../Icons';

export const FeaturesSection = () => (
  <section id="features" className="py-24 px-4 bg-white">
    <div className="container mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="font-semibold text-amber-800 uppercase tracking-widest">Fitur Unggulan</span>
        <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-900 my-4">Mengapa WastraNusa?</h2>
        <p className="text-lg text-stone-700 leading-relaxed">
          Kami menggabungkan teknologi terkini dengan kekayaan budaya untuk memberikan pengalaman yang tak terlupakan.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard 
          icon={<IconAi />}
          title="Virtual Try-On Berbasis AI"
          description="Kenakan pakaian adat dari berbagai suku secara digital dengan hasil yang realistis."
        />
        <FeatureCard 
          icon={<IconMap />}
          title="Eksplorasi Peta Budaya"
          description="Pelajari filosofi dan sejarah di balik setiap Wastra melalui peta interaktif Nusantara."
        />
        <FeatureCard 
          icon={<IconCamera />}
          title="Interaktif & Personal"
          description="Cukup unggah foto atau gunakan kamera, AI kami akan menyesuaikan pakaian secara otomatis."
        />
        <FeatureCard 
          icon={<IconWorld />}
          title="Pelestarian Digital"
          description="Menghubungkan generasi muda dengan warisan budaya luhur melalui platform modern."
        />
      </div>
    </div>
  </section>
);