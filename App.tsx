import React, { useState } from 'react';
import { Header } from './components/Header';
import { TryOnStudio } from './components/TryOnStudio';
import { Footer } from './components/Footer';
import { MapExplorer } from './components/MapExplorer';
import { LandingPage } from './components/LandingPage';
import type { ClothingItem } from './types';
import { clothingItems } from './constants';

export default function App() {
  const [view, setView] = useState<'landing' | 'map' | 'studio'>('landing');
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem>(clothingItems[0]);

  const handleSelectFromMap = (item: ClothingItem) => {
    setSelectedClothing(item);
    setView('studio');
  };

  const handleNavigate = (targetView: 'map' | 'studio') => {
    setView(targetView);
  }

  const handleStart = () => {
    setView('map');
  }

  if (view === 'landing') {
    return <LandingPage onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen text-stone-800 flex flex-col">
      <Header onNavigate={handleNavigate} currentView={view} />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        {view === 'map' ? (
          <MapExplorer onSelectTribe={handleSelectFromMap} />
        ) : (
          <TryOnStudio 
            selectedClothing={selectedClothing} 
            onSelectClothing={setSelectedClothing}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}