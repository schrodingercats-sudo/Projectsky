import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import { Agentation } from 'agentation';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductShowcase } from './components/ProductShowcase';
import { FeatureGrid } from './components/FeatureGrid';
import { SkillsSection } from './components/SkillsSection';
import { RoadmapSection } from './components/RoadmapSection';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { WaitlistModal } from './components/WaitlistModal';
import { AdminDashboard } from './components/AdminDashboard';

export function App() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);

  // Auto-open admin if URL hash is #admin
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // 1. Initialize Lenis Smooth Scroll for Apple/Linear inertia scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // 2. High-Performance Idle Preloader for All Web Assets
  useEffect(() => {
    const preloadAssets = () => {
      const imagesToPreload = [
        '/hero-desktop.png',
        '/hero-phone.png',
        '/header-logo-resized.png',
        '/icon.png',
        '/desktop-sky-bg.png',
        '/footer.jpg'
      ];

      imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
      });
    };

    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(preloadAssets);
    } else {
      setTimeout(preloadAssets, 500);
    }
  }, []);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  
  const handleOpenAdmin = () => setIsAdminOpen(true);
  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <div className="min-h-screen bg-[#081326] text-white relative selection:bg-sky-400/30 selection:text-sky-100 scroll-smooth overflow-x-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Agentation Visual Feedback Toolbar for UI/UX Feedback */}
      <Agentation />

      {/* ─── BACKGROUND SCENIC ATMOSPHERE ─── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Soft Blue Atmospheric Radial Lights */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-sky-400/15 via-blue-500/10 to-transparent blur-[140px] rounded-full" />
      </div>

      {/* ─── MAIN LANDING CONTENT ─── */}
      <div className="relative z-10">
        <Navbar onJoinClick={handleOpenModal} onAdminClick={handleOpenAdmin} />
        
        <main>
          {/* 1. HERO SECTION (#vision) */}
          <Hero onJoinClick={handleOpenModal} />
          
          {/* 2. MIDDLE SECTION WITH DARK ELEGANT BACKGROUND */}
          <div 
            className="relative bg-cover bg-center bg-no-repeat w-full shadow-2xl"
            style={{ backgroundImage: `url('/desktop-sky-bg.png')` }}
          >
            {/* Dark elegant backdrop overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#081326]/90 via-[#081326]/80 to-[#081326]/95 pointer-events-none backdrop-blur-[2px]" />

            <div className="relative z-10">
              {/* Product Showcase Window */}
              <ProductShowcase />
              
              {/* Feature Grid (#features) */}
              <FeatureGrid />

              {/* Skills Domain Section (#skills) */}
              <SkillsSection />

              {/* Product Roadmap Section (#roadmap) */}
              <RoadmapSection />

              {/* About Philosophy Section (#about) */}
              <AboutSection />
            </div>
          </div>
        </main>

        {/* 3. FOOTER SECTION */}
        <Footer onJoinClick={handleOpenModal} onAdminClick={handleOpenAdmin} />
      </div>

      {/* Interactive Waitlist Modal */}
      <WaitlistModal isOpen={isModalOpen} onClose={handleCloseModal} />

      {/* Admin CMS Dashboard Modal */}
      <AdminDashboard isOpen={isAdminOpen} onClose={handleCloseAdmin} />
    </div>
  );
}

export default App;
