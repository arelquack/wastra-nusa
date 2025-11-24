import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { MapExplorerSVG } from './components/MapExplorerSVG';
import { CulturalExperienceModal } from './components/CulturalExperienceModal';
import type { ClothingItem } from './types';

export default function App() {
  // State Navigasi Utama: Apakah user sudah klik "Mulai"?
  const [hasStarted, setHasStarted] = useState(false);
  
  // State Interaksi: Menyimpan item baju yang sedang dipilih untuk ditampilkan di Modal Overlay
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem | null>(null);

  // Fungsi saat user klik "Mulai Jelajahi" di Landing Page
  const handleStart = () => {
    setHasStarted(true);
    // Scroll otomatis ke atas saat masuk mode peta
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fungsi saat user memilih baju dari Peta (via Popup)
  const handleSelectClothing = (item: ClothingItem) => {
    setSelectedClothing(item);
  };

  // Fungsi menutup Modal
  const handleCloseModal = () => {
    setSelectedClothing(null);
  };

  // Handler navigasi dari Header
  const handleHeaderNavigate = (target: 'map' | 'studio') => {
    // Apapun targetnya, kita pastikan masuk ke mode peta
    if (!hasStarted) {
        setHasStarted(true);
    }
    // Jika tombol "Coba Sekarang" diklik, kita bisa berikan feedback atau scroll ke peta
    if (target === 'studio') {
       window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- TAMPILAN 1: LANDING PAGE ---
  if (!hasStarted) {
    return <LandingPage onStart={handleStart} />;
  }

  // --- TAMPILAN 2: MAP EXPERIENCE (UTAMA) ---
  return (
    <div className="min-h-screen text-stone-800 flex flex-col bg-stone-50 relative">
      <Header onNavigate={handleHeaderNavigate} currentView="map" />
      
      <main className="flex-grow flex flex-col relative w-full overflow-hidden">
        {/* Peta Interaktif SVG */}
        <div className="relative z-0 w-full h-full min-h-[85vh] flex flex-col">
            <MapExplorerSVG 
              onSelectProvince={handleSelectClothing} 
              selectedItem={selectedClothing} 
            />
        </div>

        {/* Unified Modal Overlay 
            - Muncul saat selectedClothing tidak null
            - Menangani Heritage Mode & Fusion Mode 
        */}
        {selectedClothing && (
             <CulturalExperienceModal 
                item={selectedClothing} 
                onClose={handleCloseModal} 
             />
        )}
      </main>
      
      <Footer />
    </div>
  );
}