// components/ExplorePage.tsx
import React, { useState } from 'react';
import { Header } from './Header';
import { MapExplorerSVG } from './MapExplorerSVG';
import { CulturalExperienceModal } from './CulturalExperienceModal';
import { CulturalTryOnModal } from './CulturalTryOnModal';
import type { ClothingItem } from '../types';
import { HowToUse } from './HowToUse';
import { Modal } from './Modal';

export const ExplorePage = () => {
  // State Interaksi
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem | null>(null);
  const [openUsage, setOpenUsage] = useState(false);

  const handleSelectClothing = (item: ClothingItem) => {
    setSelectedClothing(item);
  };

  const handleCloseModal = () => {
    setSelectedClothing(null);
  };

  // Handler dummy untuk prop onNavigate di Header (karena kita sekarang pakai router)
  const handleHeaderNavigate = (target: 'map' | 'studio') => {
    if (target === 'studio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="h-screen w-screen text-stone-800 flex flex-col bg-stone-50 relative">
      <Header 
        onNavigate={handleHeaderNavigate} 
        onOpenUsage={() => setOpenUsage(true)} 
      />
      
      <main className="flex-grow flex flex-col relative w-full h-full overflow-hidden">
        <div className="relative z-0 w-full h-full flex flex-col">
            <MapExplorerSVG 
              onSelectProvince={handleSelectClothing} 
              selectedItem={selectedClothing} 
            />
        </div>

        {selectedClothing && (
          <>
            <CulturalExperienceModal 
              item={selectedClothing} 
              onClose={handleCloseModal}
            />
            <CulturalTryOnModal
              item={selectedClothing} 
              onClose={handleCloseModal}
            />
          </>
        )}
      </main>

      <Modal open={openUsage} onClose={() => setOpenUsage(false)}>
        <HowToUse />
      </Modal>
    </div>
  );
};