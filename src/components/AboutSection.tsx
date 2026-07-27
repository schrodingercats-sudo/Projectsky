import React from 'react';
import { ShieldCheck, Cpu, Zap } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto z-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold text-sky-200">
          <span>The SKY Philosophy</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Outfit']">
          "Technology should disappear.<br />
          Presence should remain."
        </h2>
        <p className="text-sky-100/80 text-base sm:text-lg font-normal leading-relaxed">
          We believe software should enhance your focus, not demand your attention. SKY was designed from the ground up as a native Windows companion that sits ambiently beside your work.
        </p>
      </div>

      {/* 3 Core Values Grid (100% Honest Privacy & Security Story) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="sky-glass-panel p-8 rounded-3xl border border-white/20 bg-slate-950/80 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="p-3.5 rounded-2xl bg-sky-500/15 border border-sky-400/30 text-sky-300 w-fit">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-['Outfit']">
            Native Desktop Architecture
          </h3>
          <p className="text-sky-100/80 text-sm leading-relaxed font-sans font-normal">
            Built directly for Windows 11. Unlike browser extensions or web chatbots, SKY operates with low-level system synergy, low latency, and fluid desktop spatial presence.
          </p>
        </div>

        <div className="sky-glass-panel p-8 rounded-3xl border border-white/20 bg-slate-950/80 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 w-fit">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-['Outfit']">
            Transparent API & Vault Privacy
          </h3>
          <p className="text-sky-100/80 text-sm leading-relaxed font-sans font-normal">
            Your API keys and Obsidian notes stay stored locally on your machine. All real-time vision and voice streams are transmitted securely over TLS/WSS directly to your API provider.
          </p>
        </div>

        <div className="sky-glass-panel p-8 rounded-3xl border border-white/20 bg-slate-950/80 backdrop-blur-xl shadow-2xl space-y-4">
          <div className="p-3.5 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 w-fit">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white font-['Outfit']">
            Frictionless Flow State
          </h3>
          <p className="text-sky-100/80 text-sm leading-relaxed font-sans font-normal">
            No tab clutter, no context switching. A single floating capsule bar provides instant speech, visual perception, and task automation whenever inspiration strikes.
          </p>
        </div>

      </div>

    </section>
  );
};
