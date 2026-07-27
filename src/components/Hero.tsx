import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onJoinClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onJoinClick }) => {
  const [stage, setStage] = useState<number>(0);

  useEffect(() => {
    // Stage 1: Load Hero Background Image 100% Clear & Crisp (100ms)
    const t1 = setTimeout(() => setStage(1), 100);
    // Stage 2: Smoothly bring in atmospheric dark blue overlay (1500ms)
    const t2 = setTimeout(() => setStage(2), 1500);
    // Stage 3: Slide up Subtitle & CTA Components (2400ms)
    const t3 = setTimeout(() => setStage(3), 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return (
    <section id="vision" className="relative w-full h-screen min-h-screen px-4 sm:px-6 text-center overflow-hidden flex flex-col justify-center items-center">
      
      {/* ─── 1. HERO BACKGROUND IMAGE (LOADS FIRST 100% CRISP WITHOUT ANY BLUR/OVERLAY) ─── */}
      <div className={`absolute inset-0 z-0 transition-all duration-[1800ms] cubic-bezier(0.16, 1, 0.3, 1) transform ${
        stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
      }`}>
        {/* Desktop Hero Background (Full Viewport Fit) */}
        <div 
          className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
          style={{ backgroundImage: `url('/hero-desktop.png')` }}
        />
        {/* Mobile Hero Background */}
        <div 
          className="block md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
          style={{ backgroundImage: `url('/hero-phone.png')` }}
        />
        
        {/* ─── 2. ATMOSPHERIC DARK OVERLAY FADES IN AFTER IMAGE IS SEEN CLEARLY (STAGE 2) ─── */}
        <div className={`absolute inset-0 bg-gradient-to-b from-[#0b192e]/50 via-[#0b192e]/20 to-transparent transition-opacity duration-[1600ms] ease-in-out ${
          stage >= 2 ? 'opacity-100' : 'opacity-0'
        }`} />
      </div>

      {/* ─── 3. SUBTITLE AND CTA COMPONENTS SLIDE UP SMOOTHLY (STAGE 3) ─── */}
      <div className={`max-w-4xl mx-auto relative z-10 space-y-6 pt-24 sm:pt-36 transition-all duration-[1800ms] cubic-bezier(0.16, 1, 0.3, 1) transform ${
        stage >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>

        {/* Subtitle (Moved down slightly so SKY word on computer image is visible) */}
        <p className="max-w-2xl mx-auto text-lg sm:text-2xl text-white font-medium leading-relaxed drop-shadow-xl font-['Outfit']">
          SKY is your AI companion for Windows.<br className="hidden sm:inline" />
          It lives on your desktop. Understands you. Gets things done.
        </p>

        {/* Action CTA Button */}
        <div className="pt-2 flex items-center justify-center">
          <button
            onClick={onJoinClick}
            className="sky-button-primary px-8 py-3.5 rounded-full text-base font-semibold text-white flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 group border border-white/40"
          >
            <span>Reserve Early Access</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
