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
  
  // State untuk Zoom & Pan (Geser)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Fungsi Kontrol Zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3)); // Max zoom 3x
  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.2, 0.5);
      // Opsional: Jika zoom out maksimal, reset posisi pan ke tengah
      if (newZoom <= 0.5) setPan({ x: 0, y: 0 });
      return newZoom;
    });
  };
  
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 }); // Reset posisi geser juga
  };

  // --- Event Handlers untuk Panning (Geser Peta) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah seleksi teks browser
    setIsDragging(true);
    // Simpan titik awal klik dikurangi posisi pan saat ini
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    // Hitung posisi baru berdasarkan pergerakan mouse
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPan({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

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
    // Penting: pastikan pointer events pada SVG tidak memblokir event dragging container
    // Kita atur spesifik path/g yang bisa diklik di CSS

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
                // Cek apakah sedang dragging. Jika gerakan mouse kecil (klik), jalankan select.
                // Karena kita pakai React state untuk dragging, klik cepat biasanya aman.
                if (!isDragging) {
                    onSelectProvince(item);
                }
            };
          }
      });
    });

  }, [svgLoaded, selectedItem, onSelectProvince, isDragging]); // Tambahkan isDragging ke dependency jika perlu, tapi hati-hati re-render

  return (
    <div className="w-full top-20 h-full flex flex-col items-center justify-center bg-stone-50 overflow-hidden relative mb-40">
      
      {/* --- STYLE CSS --- */}
      <style>{`
        /* Style path provinsi */
        svg g, svg path {
          transition: fill 0.3s ease, opacity 0.3s ease; /* Hapus transisi transform agar drag smooth */
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
          /* Transform translateY dihapus atau dipindah agar tidak konflik dengan panning */
          /* transform: translateY(-2px); */ 
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

      {/* Tombol Kontrol Zoom */}
      <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-2">
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-3.06-6.64" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 3v6h-6" />
            </svg>
            <span className="sr-only">Reset view</span>
        </button>
      </div>

      {/* --- CONTAINER MAP (DRAGGABLE ZONE) --- */}
      {/* Container ini menangkap event mouse untuk panning */}
      <div 
        className="w-full h-full flex items-center justify-center p-4 md:p-10 relative z-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
            className="relative w-full max-w-[90vw] md:max-w-6xl aspect-[2.5/1] md:aspect-[2/1] flex items-center justify-center origin-center"
            style={{ 
              // Gabungkan posisi Pan (Translate) dan Zoom (Scale)
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${1.2 * zoom})`,
              // Matikan transisi saat dragging agar responsif, nyalakan saat zoom/release agar smooth
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
              maxHeight: '80vh',
              pointerEvents: 'none' // Biarkan event tembus ke container, tapi override di elemen SVG
            }}
        >
          {/* Container SVG */}
          <div 
            ref={mapContainerRef} 
            className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:drop-shadow-2xl pointer-events-auto"
          />
        </div>
      </div>

      {/* Hint Teks */}
      {!selectedItem && svgLoaded && zoom === 1 && pan.x === 0 && (
        <div className="absolute bottom-4 right-8 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-md pointer-events-none z-10 border border-white/50">
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