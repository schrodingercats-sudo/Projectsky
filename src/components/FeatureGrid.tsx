import React from 'react';
import { 
  Eye, 
  Mic, 
  Brain, 
  Command, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Sliders, 
  Cpu, 
  Zap, 
  Compass, 
  Sparkle, 
  MessageSquare, 
  Monitor 
} from 'lucide-react';

interface FeatureCard {
  badge: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const FeatureGrid: React.FC = () => {
  // ─── 4 CORE FEATURE CARDS ───
  const coreFeatures: FeatureCard[] = [
    {
      badge: "Visual Intelligence",
      title: "Spatial Screen Perception",
      description: "SKY understands everything visible on your desktop in real time. It sees what you see, offering instant assistance across any application without context switching.",
      icon: <Eye className="w-5 h-5 text-cyan-300" />
    },
    {
      badge: "Conversational Flow",
      title: "Fluid Voice Dialogue",
      description: "Engage in natural, instant voice interactions with zero latency. Speak naturally as ideas occur, and receive intelligent responses that blend seamlessly into your workflow.",
      icon: <Mic className="w-5 h-5 text-sky-300" />
    },
    {
      badge: "Ambient Memory",
      title: "Unified Long-Term Memory",
      description: "Effortlessly retains your projects, preferences, and active ideas across sessions. Never repeat instructions—SKY remembers your context so you remain in flow.",
      icon: <Brain className="w-5 h-5 text-indigo-300" />
    },
    {
      badge: "Native Orchestration",
      title: "Seamless Desktop Control",
      description: "Directs your operating system with quiet precision. Launch tools, organize workspace layouts, and automate complex desktop tasks through simple natural intent.",
      icon: <Command className="w-5 h-5 text-emerald-300" />
    }
  ];

  // ─── 10 ADDITIONAL CAPABILITY CARDS (ACCURATE PRIVACY & SECURITY) ───
  const additionalFeatures: FeatureCard[] = [
    {
      badge: "Deep Integration",
      title: "Cross-Application Continuity",
      description: "Operates fluidly between your code editor, browser, notes, and system tools, connecting fragmented workflows into a single cohesive experience.",
      icon: <Layers className="w-5 h-5 text-blue-300" />
    },
    {
      badge: "Proactive Design",
      title: "Predictive Assistance",
      description: "Anticipates your next move before you ask—suggesting relevant actions, preparing files, and reducing friction during deep work sessions.",
      icon: <Sparkles className="w-5 h-5 text-amber-300" />
    },
    {
      badge: "Security Core",
      title: "User-Controlled API Privacy",
      description: "Your API keys and vault notes remain strictly stored on your local disk. Vision and voice streams are transmitted securely over TLS direct to your API provider.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-300" />
    },
    {
      badge: "Adaptive Persona",
      title: "Personal Workflow Tuning",
      description: "Continuously adapts to your tone, habits, and task organization, evolving into a natural extension of your creative mind.",
      icon: <Sliders className="w-5 h-5 text-purple-300" />
    },
    {
      badge: "Background Power",
      title: "Ambient Task Execution",
      description: "Handles complex operations and background inquiries quietly without interrupting your focused flow state.",
      icon: <Cpu className="w-5 h-5 text-teal-300" />
    },
    {
      badge: "Micro Interactions",
      title: "Sub-Perceptual Controls",
      description: "Accessible via minimal global hotkeys or subtle gestures, staying completely out of sight until the exact moment you need it.",
      icon: <Zap className="w-5 h-5 text-amber-400" />
    },
    {
      badge: "Active Awareness",
      title: "Workspace Context Sensing",
      description: "Automatically senses active projects and open documents, instantly tailoring its intelligence to your current task.",
      icon: <Compass className="w-5 h-5 text-sky-400" />
    },
    {
      badge: "Instant Synthesis",
      title: "Multi-Source Intelligence",
      description: "Synthesizes complex information across local files, documentation, and active browser tabs into clear, actionable summaries.",
      icon: <Sparkle className="w-5 h-5 text-cyan-300" />
    },
    {
      badge: "Silent Efficiency",
      title: "Frictionless Command Input",
      description: "Speak, type, or let SKY infer your intent from your active screen—interaction feels as effortless as thought.",
      icon: <MessageSquare className="w-5 h-5 text-indigo-400" />
    },
    {
      badge: "OS Synergy",
      title: "Native Windows Architecture",
      description: "Engineered specifically for Windows 11, integrating deeply with system controls, notifications, and spatial windows.",
      icon: <Monitor className="w-5 h-5 text-blue-400" />
    }
  ];

  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto z-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold text-sky-200">
          <span>Engineered for Presence</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Outfit']">
          Designed to feel like part of your operating system.
        </h2>
        <p className="text-sky-100/80 text-base sm:text-lg font-normal leading-relaxed">
          "Technology should disappear. Presence should remain."
        </p>
      </div>

      {/* ─── 4 CORE FEATURE CARDS ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {coreFeatures.map((card, idx) => (
          <div
            key={idx}
            className="sky-glass-panel p-8 rounded-3xl border border-white/20 bg-slate-950/80 backdrop-blur-2xl hover:border-sky-400/50 transition-all duration-300 shadow-2xl group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-sky-500/15 text-sky-200 border border-sky-300/30">
                  {card.badge}
                </span>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit']">
                {card.title}
              </h3>
              <p className="text-sky-100/85 text-sm sm:text-base leading-relaxed font-sans font-normal">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Section Divider Subheader */}
      <div className="text-center my-16">
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-['Outfit']">
          Built for how you actually work.
        </h3>
      </div>

      {/* ─── 10 ADDITIONAL CAPABILITY CARDS ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {additionalFeatures.map((card, idx) => (
          <div
            key={idx}
            className="sky-glass-panel p-6 rounded-2xl border border-white/15 bg-slate-950/70 backdrop-blur-xl hover:border-sky-400/40 transition-all duration-300 shadow-xl group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-0.5 rounded-full text-[11px] font-semibold bg-white/10 text-sky-200 border border-white/15">
                  {card.badge}
                </span>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10 group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
              </div>
              <h4 className="text-lg font-bold text-white tracking-tight font-['Outfit']">
                {card.title}
              </h4>
              <p className="text-sky-100/75 text-xs sm:text-sm leading-relaxed font-sans font-normal">
                {card.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
