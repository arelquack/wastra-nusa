// components/MapExplorerSVG.tsx
import React, { useEffect, useRef, useState } from 'react';
import { clothingItems } from '../constants';
import type { ClothingItem } from '../types';

interface MapExplorerSVGProps {
  onSelectProvince: (item: ClothingItem) => void;
  selectedItem: ClothingItem | null;
}

export const MapExplorerSVG: React.FC<MapExplorerSVGProps> = ({ 
  onSelectProvince, 
  selectedItem 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [svgLoaded, setSvgLoaded] = useState(false);
  
  // State untuk Zoom & Pan
  const [zoom, setZoom] = useState(1);
  
  // Fungsi Kontrol Zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3)); // Max zoom 3x
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5)); // Min zoom 0.5x
  const handleReset = () => setZoom(1);

  // 1. Fetch File SVG
  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch('/assets/peta-indonesia.svg');
        const svgText = await response.text();
        if (mapContainerRef.current) {
          mapContainerRef.current.innerHTML = svgText;
          setSvgLoaded(true);
        }
      } catch (error) {
        console.error("Gagal memuat peta:", error);
      }
    };
    loadSvg();
  }, []);

  // 2. Logic Interaksi & State (Hover, Active, Click)
  useEffect(() => {
    if (!svgLoaded || !mapContainerRef.current) return;

    const svgElement = mapContainerRef.current.querySelector('svg');
    if (!svgElement) return;

    svgElement.style.width = '100%';
    svgElement.style.height = '100%';


    // Reset class
    const allProvinces = svgElement.querySelectorAll('.province-active, .province-inactive, .province-default');
    allProvinces.forEach(el => {
        el.classList.remove('province-active', 'province-inactive', 'province-default');
    });

    // Loop items untuk set class & click handler
    clothingItems.forEach((item) => {
      const provinceIds = Array.isArray(item.provinceId) ? item.provinceId : [item.provinceId];

      provinceIds.forEach((provId) => {
          const element = svgElement.querySelector(`#${provId}`);
          if (element) {
            // Set Class Sesuai State
            if (selectedItem?.id === item.id) {
              element.classList.add('province-active');
            } else if (selectedItem !== null) {
              element.classList.add('province-inactive');
            } else {
              element.classList.add('province-default');
            }

            // Click Handler
            (element as any).onclick = (e: Event) => {
                e.stopPropagation();
                onSelectProvince(item);
            };
          }
      });
    });

  }, [svgLoaded, selectedItem, onSelectProvince]);

  return (
    <div className="w-full top-15  h-full flex flex-col items-center justify-center bg-stone-50 overflow-hidden relative">
      
      {/* --- STYLE CSS --- */}
      <style>{`
        /* Style path provinsi */
        svg g, svg path {
          transition: all 0.3s ease;
          cursor: pointer;
          stroke: rgba(255, 255, 255, 0.5);
          stroke-width: 1px;
        }
        .province-active, .province-default:hover {
          opacity: 0.8; 
          fill: #DA7120;
          stroke: #fff;
          stroke-width: 1.5px;
          z-index: 10;
          transform: translateY(-2px);
        }
        .province-default {
          fill: #E9BD9B;
          opacity: 1;
        }
        .province-inactive {
          fill: #E9BD9B;
          opacity: 0.3;
        }
      `}</style>

      <div className="absolute top-20 left-6 z-20 flex flex-col gap-2">
        <button 
          onClick={handleZoomIn}
          className="w-10 h-10 bg-white text-stone-700 rounded-lg shadow-md hover:bg-amber-50 hover:text-amber-700 flex items-center justify-center transition-all active:scale-95 font-bold text-xl"
          aria-label="Zoom In"
        >
          +
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-10 h-10 bg-white text-stone-700 rounded-lg shadow-md hover:bg-amber-50 hover:text-amber-700 flex items-center justify-center transition-all active:scale-95 font-bold text-xl"
          aria-label="Zoom Out"
        >
          -
        </button>
        <button 
          onClick={handleReset}
          className="w-10 h-10 bg-white text-stone-700 rounded-lg shadow-md hover:bg-amber-50 hover:text-amber-700 flex items-center justify-center transition-all active:scale-95 p-2"
          aria-label="Reset View"
        >
          {/* Icon Reset Simple */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>

      {/* --- CONTAINER MAP (FIT SCREEN) --- */}
      {/* Saya ubah styling container agar lebih fit.
          h-[85vh] = membatasi tinggi agar tidak terlalu panjang.
          aspect-video = menjaga rasio agar tidak gepeng, tapi tetap fleksibel.
      */}
      <div className="w-full h-full flex items-center justify-center p-4 md:p-10 relative z-0">
        <div 
            className="relative w-full max-w-[90vw] md:max-w-6xl aspect-[2.5/1] md:aspect-[2/1] flex items-center justify-center transition-transform duration-300 ease-out origin-center"
            style={{ 
              transform: `scale(${zoom})`,
              // Tips: Gunakan max-height agar SVG tidak pernah lebih tinggi dari layar
              maxHeight: '80vh' 
            }}
        >
          {/* Container SVG */}
          <div 
            ref={mapContainerRef} 
            className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Hint Teks (Hanya muncul jika belum ada interaksi & zoom normal) */}
      {!selectedItem && svgLoaded && zoom === 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-xl pointer-events-none animate-bounce z-10 border border-white/50">
          <p className="text-amber-900 font-semibold text-sm md:text-base flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
            </svg>
            Sentuh wilayah peta untuk mulai menjelajah
          </p>
        </div>
      )}
    </div>
  );
};