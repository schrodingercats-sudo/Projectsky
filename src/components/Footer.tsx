import React from 'react';
import { ArrowRight, Globe, Disc as Discord, Twitter, Linkedin } from 'lucide-react';

interface FooterProps {
  onJoinClick: () => void;
  onAdminClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onJoinClick, onAdminClick }) => {
  return (
    <footer className="relative text-white overflow-hidden border-t border-white/30 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url('/footer.jpg')` }}>
      
      {/* Light transparent gradient overlay to keep footer.jpg bright & 100% visible while preserving text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#081326]/40 via-[#081326]/20 to-[#040914]/70 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 pb-10 sm:pb-12 relative z-10">
        
        {/* Top Call to Action Banner */}
        <div className="sky-glass-panel rounded-2xl sm:rounded-3xl p-6 sm:p-12 mb-12 sm:mb-16 text-center border border-white/40 shadow-2xl relative overflow-hidden bg-slate-950/60 backdrop-blur-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-['Outfit'] text-white drop-shadow-md">
              Ready for the Future of Desktop AI?
            </h2>
            <p className="text-sky-100/90 text-xs sm:text-base font-normal leading-relaxed drop-shadow">
              Join thousands of early adopters bringing true ambient AI intelligence to Windows 11.
            </p>
            <div className="pt-2 flex justify-center">
              <button
                onClick={onJoinClick}
                className="sky-button-primary w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all border border-white/40 group"
              >
                <span>Get Early Access</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-12 pb-10 sm:pb-12 border-b border-white/20">
          
          {/* Brand Info with Header Logo Resized */}
          <div className="sm:col-span-2 md:col-span-4 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/header-logo-resized.png" 
                alt="Official Project SKY App Logo" 
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-xl"
              />
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Outfit'] text-white drop-shadow-md">
                SKY
              </span>
            </div>
            <p className="text-sky-100/90 text-xs sm:text-sm leading-relaxed max-w-sm drop-shadow">
              The real-time AI companion built natively for Windows. Multimodal vision, instant speech pipeline, and local vault intelligence.
            </p>
          </div>

          {/* Product Links */}
          <div className="md:col-span-3 space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider drop-shadow">Product</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-sky-100/85 drop-shadow">
              <li><a href="#features" className="hover:text-white transition-colors block py-0.5">Vision Pipeline</a></li>
              <li><a href="#features" className="hover:text-white transition-colors block py-0.5">Real-time Voice</a></li>
              <li><a href="#features" className="hover:text-white transition-colors block py-0.5">Obsidian FTS Memory</a></li>
              <li><a href="#features" className="hover:text-white transition-colors block py-0.5">Desktop Automation</a></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="md:col-span-3 space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider drop-shadow">Resources</h3>
            <ul className="space-y-2 text-xs sm:text-sm text-sky-100/85 drop-shadow">
              <li><a href="#about" className="hover:text-white transition-colors block py-0.5">Documentation</a></li>
              <li><a href="#about" className="hover:text-white transition-colors block py-0.5">Architecture Whitepaper</a></li>
              <li><a href="#about" className="hover:text-white transition-colors block py-0.5">Security & Privacy</a></li>
              <li><a href="#roadmap" className="hover:text-white transition-colors block py-0.5">Release Notes</a></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="md:col-span-2 space-y-2 sm:space-y-3">
            <h3 className="text-xs sm:text-sm font-semibold text-white uppercase tracking-wider drop-shadow">Community</h3>
            <div className="flex items-center gap-3 pt-1">
              <a 
                href="https://discord.gg/akvjPJN2zP" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-950/60 hover:bg-sky-500/30 transition-all border border-white/30 text-sky-200 hover:text-white hover:border-sky-400 shadow-lg"
                title="Project SKY Discord Community"
              >
                <Discord className="w-4 h-4" />
              </a>
              <a 
                href="https://x.com/projectsky6f" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-950/60 hover:bg-sky-500/30 transition-all border border-white/30 text-sky-200 hover:text-white hover:border-sky-400 shadow-lg"
                title="Project SKY Official X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/feed/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-full bg-slate-950/60 hover:bg-sky-500/30 transition-all border border-white/30 text-sky-200 hover:text-white hover:border-sky-400 shadow-lg"
                title="LinkedIn Profile"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sky-100/90 gap-4 text-center sm:text-left drop-shadow">
          <p>© {new Date().getFullYear()} Project SKY. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            {onAdminClick && (
              <button onClick={onAdminClick} className="text-sky-300 hover:text-white transition-colors font-medium">
                Admin CMS
              </button>
            )}
          </div>
        </div>

      </div>
    </footer>
  );
};
