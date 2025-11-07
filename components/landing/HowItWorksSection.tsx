// components/landing/HowItWorksSection.tsx
import React from 'react';
import { StepCard } from '../StepCard';
import { IconUpload, IconSparkles, IconDownload } from '../icons';

export const HowItWorksSection = () => (
  <section id="how-it-works" className="py-24 px-4 bg-stone-100/70" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d3c5b4' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}>
    <div className="container mx-auto text-center max-w-5xl">
      <span className="font-semibold text-amber-800 uppercase tracking-widest">Cara Kerja</span>
      <h2 className="font-display text-4xl md:text-5xl font-bold text-stone-900 mb-16">Semudah 1-2-3</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <StepCard
          number="1"
          icon={<IconUpload />}
          title="Unggah Foto Anda"
          description="Ambil foto selfie atau unggah foto potret Anda dengan pose menghadap depan."
        />
        <StepCard
          number="2"
          icon={<IconSparkles />}
          title="Pilih Pakaian Adat"
          description="Jelajahi koleksi WastraNusa dari 38 provinsi dan pilih pakaian yang ingin Anda coba."
        />
        <StepCard
          number="3"
          icon={<IconDownload />}
          title="Nikmati Hasil AI"
          description="AI kami akan 'memakaikan' baju adat ke foto Anda secara realistis. Unduh dan bagikan!"
        />
      </div>
    </div>
  </section>
);