// App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { ExplorePage } from './components/ExplorePage';

// Wrapper component untuk LandingPage biar bisa pake hook useNavigate
const LandingPageWrapper = () => {
  const navigate = useNavigate();
  
  return (
    <LandingPage 
      onStart={() => {
        navigate('/explore'); // Navigasi ke route Explore saat tombol Mulai diklik
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} 
    />
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route untuk Landing Page */}
        <Route path="/" element={<LandingPageWrapper />} />
        
        {/* Route untuk Virtual Try-On / Map Explorer */}
        <Route path="/explore" element={<ExplorePage />} />
      </Routes>
    </BrowserRouter>
  );
}