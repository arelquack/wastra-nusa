// components/MapExplorerSVG.tsx
import React, { useEffect, useRef, useState } from 'react';
import { clothingItems } from '../constants';
import type { ClothingItem } from '../types';

interface MapExplorerSVGProps {
  onSelectProvince: (item: ClothingItem) => void;
  selectedItem: ClothingItem | null;
}

// Helper untuk memformat ID menjadi Nama (misal: "jawa-barat" -> "Jawa Barat")
const formatProvinceName = (id: string) => {
  return id
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface ProvincePopupData {
  id: string;
  name: string;
  items: ClothingItem[];
  x: number;
  y: number;
}

export const MapExplorerSVG: React.FC<MapExplorerSVGProps> = ({ 
  onSelectProvince, 
  selectedItem 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [svgLoaded, setSvgLoaded] = useState(false);
  
  // State Zoom & Pan
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // --- STATE BARU: POPUP LIST BAJU ---
  const [activePopup, setActivePopup] = useState<ProvincePopupData | null>(null);

  // Fungsi Kontrol Zoom
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setActivePopup(null); // Tutup popup saat reset
  };

  // --- Event Handlers Pan ---
  const handleMouseDown = (e: React.MouseEvent) => {
    // Jika klik terjadi di dalam popup, jangan start drag
    if ((e.target as HTMLElement).closest('.province-popup-card')) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setPan({ x: newX, y: newY });
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  // Handler saat item di dalam Popup dipilih
  const handleItemSelect = (item: ClothingItem) => {
    setActivePopup(null); // Tutup popup
    onSelectProvince(item); // Pilih baju
  };

  // Tutup popup jika klik di area kosong peta
  const handleMapClick = () => {
    if (!isDragging) {
      setActivePopup(null);
    }
  };

  // Fetch SVG
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

  // Logic Interaksi SVG
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

    // Loop items untuk memasang logic
    // Kita perlu mengumpulkan semua ID provinsi unik yang punya baju adat
    const provinceMap = new Map<string, ClothingItem[]>();

    clothingItems.forEach(item => {
      const pIds = Array.isArray(item.provinceId) ? item.provinceId : [item.provinceId];
      pIds.forEach(pid => {
        if (!provinceMap.has(pid)) {
          provinceMap.set(pid, []);
        }
        provinceMap.get(pid)?.push(item);
      });
    });

    // Iterasi map provinsi yang sudah dikelompokkan
    provinceMap.forEach((items, provId) => {
      const element = svgElement.querySelector(`#${provId}`);
      if (element) {
        // Set Class
        // Jika salah satu item di provinsi ini sedang dipilih -> Active
        const isSelected = items.some(i => i.id === selectedItem?.id);
        
        if (isSelected) {
          element.classList.add('province-active');
        } else if (selectedItem !== null) {
          element.classList.add('province-inactive');
        } else {
          element.classList.add('province-default');
        }

        // Click Handler: BUKA POPUP
        (element as any).onclick = (e: MouseEvent) => {
            e.stopPropagation();
            if (!isDragging) {
              // Dapatkan posisi relatif terhadap container peta untuk popup
              // Kita gunakan e.layerX/Y atau logic sederhana dari bounding rect
              const rect = mapContainerRef.current?.getBoundingClientRect();
              
              // Hitung posisi tengah relatif viewport, tapi kita simpan data koordinat klik
              // untuk referensi (bisa disesuaikan agar popup muncul pas di mouse)
              
              setActivePopup({
                id: provId,
                name: formatProvinceName(provId),
                items: items, // Semua baju di provinsi ini
                x: e.clientX, // Posisi Mouse X
                y: e.clientY  // Posisi Mouse Y
              });
            }
        };
      }
    });

  }, [svgLoaded, selectedItem, isDragging]);

  return (
    <div className="w-full min-h-[calc(100vh_-_4rem)] flex items-center justify-center bg-stone-50 overflow-hidden relative top-20 bg-[#FAF7F4]">
      
      <style>{`
        svg g, svg path {
          transition: fill 0.3s ease, opacity 0.3s ease;
          cursor: pointer;
          stroke: rgba(255, 255, 255, 0.5);
          stroke-width: 1px;
        }
        .province-active, .province-default:hover {
          fill: #DA7120;
          opacity: 1; 
          stroke: #fff;
          stroke-width: 1.5px;
          z-index: 10;
        }
        .province-default {
          fill: #E9BD9B;
          opacity: 1;
        }
        .province-inactive {
          fill: #E9BD9B;
          opacity: 0.3;
        }
        /* Animasi Popup */
        @keyframes popup-in {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* Controls */}
      <div className="absolute left-6 z-20 flex flex-col gap-2">
        <button onClick={handleZoomIn} className="w-10 h-10 bg-white text-stone-700 rounded-lg shadow-md hover:bg-amber-50 font-bold text-xl">+</button>
        <button onClick={handleZoomOut} className="w-10 h-10 bg-white text-stone-700 rounded-lg shadow-md hover:bg-amber-50 font-bold text-xl">-</button>
        <button onClick={handleReset} className="w-10 h-10 bg-white text-stone-700 rounded-lg shadow-md hover:bg-amber-50 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-3.06-6.64" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 3v6h-6" />
            </svg>
        </button>
      </div>

      {/* Map Container */}
      <div 
        className="w-full h-full flex items-center justify-center p-4 relative z-0 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onClick={handleMapClick} // Klik background menutup popup
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
            className="relative w-full max-w-[90vw] md:max-w-6xl aspect-[2.5/1] flex items-center justify-center origin-center"
            style={{ 
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${1.2 * zoom})`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
              maxHeight: '100%',
            }}
        >
          {/* Container SVG */}
          <div 
            ref={mapContainerRef} 
            className="w-full h-full [&>svg]:w-full [&>svg]:h-full [&>svg]:drop-shadow-2xl pointer-events-auto"
          />

          {/* --- POPUP COMPONENT (Dirender di dalam container yang kena transform agar ikut gerak/zoom) --- 
              Atau dirender di luar jika ingin posisi statis.
              Untuk UX terbaik seperti tooltip, kita render Absolute di dalam container Map wrapper utama (bukan yang di-zoom)
              tapi kita butuh koordinat layar. 
          */}
        </div>
      </div>

      {/* --- POPUP LIST ITEM (Fixed Overlay Position) --- */}
      {activePopup && (
        <div 
            className="province-popup-card absolute z-50 bg-white rounded-2xl shadow-2xl p-4 w-72 md:w-80 animate-[popup-in_0.2s_ease-out]"
            style={{
                // Logika posisi pintar: 
                // Jika klik di kanan layar, popup muncul di kiri kursor.
                // Jika klik di bawah layar, popup muncul di atas kursor.
                top: activePopup.y > window.innerHeight / 2 ? 'auto' : activePopup.y + 20,
                bottom: activePopup.y > window.innerHeight / 2 ? window.innerHeight - activePopup.y + 20 : 'auto',
                left: activePopup.x > window.innerWidth / 2 ? 'auto' : activePopup.x + 20,
                right: activePopup.x > window.innerWidth / 2 ? window.innerWidth - activePopup.x + 20 : 'auto',
            }}
        >
            {/* Header Popup */}
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-stone-100">
                <h3 className="font-display font-bold text-lg text-stone-800">{activePopup.name}</h3>
                <button onClick={() => setActivePopup(null)} className="text-stone-400 hover:text-stone-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* List Baju */}
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {activePopup.items.map((item) => (
                    <div 
                        key={item.id}
                        onClick={() => handleItemSelect(item)}
                        className="flex items-center gap-3 p-2 rounded-xl border border-stone-200 hover:border-amber-500 hover:bg-amber-50 transition-all cursor-pointer group"
                    >
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-stone-200">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        
                        {/* Info */}
                        <div>
                            <h4 className="font-bold text-stone-800 text-sm leading-tight group-hover:text-amber-800 transition-colors">
                                {item.name}
                            </h4>
                            <p className="text-xs text-stone-500 mt-0.5">
                                {/* Kategori dummy, atau bisa ambil dari data jika ada field 'category' */}
                                Pakaian Adat
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Panah Tooltip (Hiasan) */}
            <div className="absolute w-4 h-4 bg-white transform rotate-45"
                 style={{
                     top: activePopup.y > window.innerHeight / 2 ? 'auto' : -8,
                     bottom: activePopup.y > window.innerHeight / 2 ? -8 : 'auto',
                     left: activePopup.x > window.innerWidth / 2 ? 'auto' : 10,
                     right: activePopup.x > window.innerWidth / 2 ? 10 : 'auto',
                     /* Sembunyikan jika posisi terlalu pojok */
                 }}
            />
        </div>
      )}

      {/* Hint Teks Awal */}
      {!selectedItem && !activePopup && svgLoaded && zoom === 1 && pan.x === 0 && (
        <div className="absolute bottom-6 right-8 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-md pointer-events-none z-10 border border-white/50">
          <p className="text-amber-900 font-semibold text-sm md:text-base flex items-center gap-2">
            Sentuh wilayah peta untuk melihat koleksi
          </p>
        </div>
      )}
    </div>
  );
};