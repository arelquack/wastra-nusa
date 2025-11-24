// components/CulturalExperienceModal.tsx
import React, { useState, useRef } from 'react';
import type { ClothingItem } from '../types';
import { generateVirtualTryOn, generateCulturalValidation } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import { IconUpload, IconCamera, IconSparkles, IconDownload } from './Icons'; // Pastikan icon tersedia

interface CulturalExperienceModalProps {
  item: ClothingItem;
  onClose: () => void;
}

export const CulturalExperienceModal: React.FC<CulturalExperienceModalProps> = ({ item, onClose }) => {
  return (
  <div 
    className="
      fixed left-3 top-1/2 -translate-y-1/2 
      w-[380px] md:w-[420px] 
      max-h-[75vh]
      z-40 
      bg-white shadow-xl border-r border-stone-200 
      rounded-3xl 
      overflow-y-auto 
      animate-slide-in
    "
  >
      {/* Backdrop Blur */}
      {/* <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-md" onClick={onClose} /> */}

      {/* Modal Content */}
      <div className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Tombol Close */}
        <button onClick={onClose} className="absolute top-4 right-4 z-20 p-2 bg-amber-800 rounded-full hover:bg-amber-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* --- KOLOM KIRI: LITERASI BUDAYA (40%) --- */}
        <div className="w-full bg-stone-50 p-6 md:p-8 border-r border-stone-200">
            <div className="sticky top-0 bg-stone-50 pb-4 z-10">
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider">
                    {item.origin}
                </span>
                <h2 className="font-display text-4xl md:text-2xl font-bold text-stone-900 mt-3 leading-tight">
                    {item.name}
                </h2>
            </div>
            
            <img src={item.imageUrl} alt={item.name} className="w-full aspect-[4/3] object-cover items-center rounded-xl shadow-md mb-6" />

            <div className="space-y-6 text-stone-700">
                <section>
                    <h3 className="font-bold text-md text-amber-900 mb-2 flex items-center gap-2">
                        📖 Sejarah & Asal Usul
                    </h3>
                    <p className="text-sm leading-relaxed">{item.sejarah || item.description}</p>
                </section>

                <section>
                    <h3 className="font-bold text-md text-amber-900 mb-2 flex items-center gap-2">
                        💡 Makna Filosofis
                    </h3>
                    <p className="text-sm leading-relaxed">{item.filosofi || "Memiliki nilai luhur yang diwariskan turun-temurun."}</p>
                </section>

                <section>
                    <h3 className="font-bold text-md text-amber-900 mb-2 flex items-center gap-2">
                        🎉 Konteks Penggunaan
                    </h3>
                    <p className="text-sm leading-relaxed">{item.konteks || "Digunakan dalam upacara adat penting."}</p>
                </section>
                
                {/* Marketplace CTA */}
                <div className="pt-4 border-t border-stone-200">
                    <a
                        href={`https://shopee.co.id/search?keyword=baju%20adat%20${encodeURIComponent(item.origin)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex text-sm items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-orange-500/30 transition-all hover:-translate-y-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        Beli Produk UMKM Lokal
                    </a>
                    <p className="text-xs text-center text-stone-400 mt-2">Dukung pengrajin lokal dengan membeli produk asli.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};