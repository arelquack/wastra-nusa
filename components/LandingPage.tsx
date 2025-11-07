// LandingPage.tsx
import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

import { HeroSection } from '@/components/landing/HeroSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TeamSection } from '@/components/landing/TeamSection';
import { LandingPageStyles } from '@/components/landing/LandingPageStyles';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="bg-stone-50 text-stone-800 antialiased">
      <Header onNavigate={onStart} currentView="map" />

      <HeroSection onStart={onStart} />
      <AboutSection />
      <HowItWorksSection />
      <FeaturesSection />
      <TeamSection />
      
      <Footer />
      
      <LandingPageStyles />
    </div>
  );
};