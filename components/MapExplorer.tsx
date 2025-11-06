import React, { useEffect, useRef } from 'react';
import { clothingItems } from '../constants';
import type { ClothingItem } from '../types';
import { Footer } from './Footer';

interface MapExplorerProps {
  onSelectTribe: (item: ClothingItem) => void;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({ onSelectTribe }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current && (window as any).L) {
      const L = (window as any).L;
      
      // Prevent re-initialization
      if ((mapContainerRef.current as any)._leaflet_id) return;

      const map = L.map(mapContainerRef.current, {
        scrollWheelZoom: false,
      }).setView([-2.5, 118], 5);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap & CARTO'
      }).addTo(map);

      clothingItems.forEach(item => {
        const marker = L.marker([item.coordinates.lat, item.coordinates.lng]).addTo(map);

        const popupContent = `
          <div class="p-1">
            <img src="${item.imageUrl}" alt="${item.name}" class="w-full h-28 object-cover rounded-t-lg mb-2" />
            <div class="p-2 pt-0">
              <h3 class="font-bold font-display text-lg text-stone-900">${item.name}</h3>
              <p class="text-sm text-stone-600 mb-2">${item.origin}</p>
              <p class="text-xs text-stone-500 mb-3">${item.description}</p>
              <button id="try-on-${item.id}"
                class="w-full bg-amber-800 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-900 transition-all text-sm shadow-md hover:shadow-lg">
                Coba Pakaian Ini
              </button>
            </div>
          </div>
        `;

        const popup = L.popup({ minWidth: 240 }).setContent(popupContent);
        marker.bindPopup(popup);

        marker.on('popupopen', () => {
          const button = document.getElementById(`try-on-${item.id}`);
          if (button) button.onclick = () => onSelectTribe(item);
        });
      });
    }
  }, [onSelectTribe]);

  return (
    <div className="pt-28 pb-16 animate-fade-in-up">

      {/* Leaflet Z-Index Fix */}
      <style>
        {`
          .leaflet-container { z-index: 1 !important; }
          .leaflet-popup, .leaflet-control { z-index: 40 !important; }
        `}
      </style>

      <div className="text-center mb-8 md:mb-14">
        <span className="text-amber-800 font-semibold uppercase tracking-widest">
          Eksplorasi Interaktif
        </span>

        <h1 className="text-4xl md:text-5xl font-bold text-stone-900 font-display mt-3">
          Peta Budaya Wastra Nusantara
        </h1>

        <p className="mt-4 text-lg md:text-xl text-stone-600 max-w-3xl mx-auto">
          Telusuri kekayaan pakaian adat dari Sabang hingga Merauke. Klik penanda pada peta untuk mencoba secara virtual.
        </p>
      </div>

      <div
        ref={mapContainerRef}
        className="w-full h-[72vh] md:h-[78vh] rounded-3xl shadow-2xl overflow-hidden border border-stone-200 relative z-0"
      />
    </div>
  );
};