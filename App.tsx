import React, { useState } from 'react';
import { Header } from './components/Header';
import { MapExplorerSVG } from './components/MapExplorerSVG';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
// import { CulturalExperienceModal } from './components/CulturalExperienceModal'; // Modal Baru (Fusion/Heritage)
import type { ClothingItem } from './types';

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem | null>(null);

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleSelectProvince = (item: ClothingItem) => {
    setSelectedClothing(item);
    // Kita tidak mengubah 'view', tapi state selectedClothing akan mentrigger Modal muncul
  };

  const handleCloseModal = () => {
    setSelectedClothing(null);
  };

  // 1. Landing Page View
  if (!hasStarted) {
    return <LandingPage onStart={handleStart} />;
  }

  // 2. Map View (Selalu render) + Overlay Modal
  return (
    <div className="min-h-screen text-stone-800 flex flex-col bg-stone-50 relative">
      <Header onNavigate={() => {}} currentView="map" /> {/* Header disederhanakan */}
      
      <main className="flex-grow flex relative">
        {/* Peta selalu ada di background */}
        <MapExplorerSVG 
          onSelectProvince={handleSelectProvince} 
          selectedItem={selectedClothing}
        />

        {/* 3. Unified Modal Overlay (Heritage & Fusion Mode) */}
        {selectedClothing && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm">
             {/* <CulturalExperienceModal 
                item={selectedClothing} 
                onClose={handleCloseModal} 
             /> */}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}