import React from 'react';
import type { ClothingItem } from '../types';

interface ClothingModalProps {
  item: ClothingItem;
  onClose: () => void;
}

const InfoSection: React.FC<{ title: string; content?: string }> = ({ title, content }) => {
  if (!content) return null;
  return (
    <div className="mb-6">
      <h4 className="font-display text-2xl font-bold text-amber-900 mb-2">{title}</h4>
      <p className="text-stone-700 text-base leading-relaxed">{content}</p>
    </div>
  );
};

export const ClothingModal: React.FC<ClothingModalProps> = ({ item, onClose }) => {
  return (
    <div onClick={onClose} className="modal-backdrop">
      <div onClick={(e) => e.stopPropagation()} className="modal-content">
        <button onClick={onClose} className="modal-close-button">&times;</button>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          
          <div className="md:w-1/3 flex-shrink-0 modal-image-column">
            <img src={item.imageUrl} alt={item.name} className="w-full h-auto object-cover rounded-xl shadow-lg" />
            <h3 className="font-display text-4xl font-bold text-stone-900 mt-5">{item.name}</h3>
            <p className="text-stone-600 text-xl">{item.origin}</p>
          </div>

          <div className="md:w-2/3 modal-scrollbar">
            <InfoSection title="Deskripsi" content={item.description} />
            <InfoSection title="Sejarah Singkat" content={item.sejarah} />
            <InfoSection title="Makna Filosofis" content={item.filosofi} />
            <InfoSection title="Konteks Penggunaan" content={item.konteks} />

            <p className="mt-6 text-stone-700 text-base italic">
                Tertarik melihat atau membeli pakaian adat dari daerah ini? Jelajahi rekomendasi di marketplace berikut:
            </p>

            {/* CTA SHOPEE */}
            <div className="mt-8 flex">
              <a
                href={`https://shopee.co.id/search?keyword=baju%20adat%20${encodeURIComponent(item.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4
                  bg-gradient-to-r from-amber-600 to-amber-800 text-white font-semibold 
                  text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]
                  transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9h14l-2-9M10 21a1 1 0 11-2 0 1 1 0 012 0zm8 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
                Cari Baju Adat Daerah ini di Shopee
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
