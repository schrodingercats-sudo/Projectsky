import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface NavbarProps {
  onJoinClick: () => void;
  onAdminClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onJoinClick, onAdminClick }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('vision');

  // Initial sequential entrance animation matching page load
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Buttery-smooth GPU-accelerated scroll direction listener (Apple / Linear / Raycast style)
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDir = () => {
      const currentScrollY = window.scrollY;

      // Toggle glass background when scrolled past top
      if (currentScrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide navbar when scrolling down past 100px, show when scrolling up
      if (currentScrollY > 100 && currentScrollY > lastScrollY + 5) {
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY - 5) {
        setIsHidden(false);
      }

      lastScrollY = Math.max(0, currentScrollY);
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setActiveSection(targetId);

    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3.5 sm:py-4 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) transform will-change-transform ${
        !isMounted
          ? 'opacity-0 -translate-y-12'
          : isHidden
          ? 'opacity-0 -translate-y-full'
          : 'opacity-100 translate-y-0'
      } ${
        isScrolled 
          ? 'bg-slate-950/70 border-b border-white/10 backdrop-blur-xl shadow-2xl py-3' 
          : 'bg-transparent border-b-0 backdrop-blur-none'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo (Using header logo resized.png) */}
        <a 
          href="#vision" 
          onClick={(e) => handleNavClick(e, 'vision')}
          className="flex items-center gap-2.5 sm:gap-3 group"
        >
          <img 
            src="/header-logo-resized.png" 
            alt="SKY Logo" 
            className="h-8 sm:h-10 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
          />
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-['Outfit'] group-hover:text-sky-300 transition-colors drop-shadow-md">
            SKY
          </span>
        </a>

        {/* Center Navigation Links (Smooth Scroll & Animated Active Indicators) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-sky-100/90 drop-shadow">
          <a 
            href="#vision" 
            onClick={(e) => handleNavClick(e, 'vision')}
            className={`py-1 transition-all relative ${
              activeSection === 'vision' ? 'text-white font-bold' : 'hover:text-white'
            }`}
          >
            Vision
            {activeSection === 'vision' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 rounded-full animate-in fade-in zoom-in duration-300" />
            )}
          </a>

          <a 
            href="#features" 
            onClick={(e) => handleNavClick(e, 'features')}
            className={`py-1 transition-all relative ${
              activeSection === 'features' ? 'text-white font-bold' : 'hover:text-white'
            }`}
          >
            Features
            {activeSection === 'features' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 rounded-full animate-in fade-in zoom-in duration-300" />
            )}
          </a>

          <a 
            href="#skills" 
            onClick={(e) => handleNavClick(e, 'skills')}
            className={`py-1 transition-all relative ${
              activeSection === 'skills' ? 'text-white font-bold' : 'hover:text-white'
            }`}
          >
            Skills
            {activeSection === 'skills' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 rounded-full animate-in fade-in zoom-in duration-300" />
            )}
          </a>

          <a 
            href="#roadmap" 
            onClick={(e) => handleNavClick(e, 'roadmap')}
            className={`py-1 transition-all relative flex items-center gap-1.5 ${
              activeSection === 'roadmap' ? 'text-white font-bold' : 'hover:text-white'
            }`}
          >
            Roadmap
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
            {activeSection === 'roadmap' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 rounded-full animate-in fade-in zoom-in duration-300" />
            )}
          </a>

          <a 
            href="#about" 
            onClick={(e) => handleNavClick(e, 'about')}
            className={`py-1 transition-all relative ${
              activeSection === 'about' ? 'text-white font-bold' : 'hover:text-white'
            }`}
          >
            About
            {activeSection === 'about' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-400 rounded-full animate-in fade-in zoom-in duration-300" />
            )}
          </a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-2">
          {onAdminClick && (
            <button
              onClick={onAdminClick}
              className="hidden sm:flex px-3 py-2 rounded-full text-xs font-semibold text-sky-200/80 hover:text-white hover:bg-white/10 border border-white/15 transition-all"
              title="Admin CMS Dashboard"
            >
              CMS Admin
            </button>
          )}
          <button
            onClick={onJoinClick}
            className="sky-glass-pill px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold text-white flex items-center gap-2 hover:bg-white/30 transition-all duration-300 shadow-xl shadow-sky-500/20 active:scale-95 border border-white/40 group backdrop-blur-xl"
          >
            <span>Join Waitlist</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
};
