import React from 'react';
import { Clock, Sparkles, Wrench, ShieldAlert } from 'lucide-react';

interface RoadmapPhase {
  phase: string;
  status: 'active-dev' | 'testing' | 'upcoming' | 'planned';
  statusLabel: string;
  title: string;
  target: string;
  description: string;
  milestones: string[];
}

export const RoadmapSection: React.FC = () => {
  const phases: RoadmapPhase[] = [
    {
      phase: "Phase 01",
      status: "active-dev",
      statusLabel: "In Private Testing",
      title: "Multi-Modal Vision Engine",
      target: "Core Engine",
      description: "Delta-aware vision sensors with NVIDIA Llama 3.2 90B & Groq Fallback, real-time screen capture, and moving-border visual indicator.",
      milestones: ["Delta-Aware Screen Sensors", "Multi-Provider Vision Waterfall", "Moving Border Overlay Shader"]
    },
    {
      phase: "Phase 02",
      status: "active-dev",
      statusLabel: "Active Development",
      title: "Groq Voice State Machine",
      target: "Audio Engine",
      description: "Continuous WebSpeech & Groq Whisper Large v3 Turbo audio pipeline with adaptive silence detection, interruptibility, and token guards.",
      milestones: ["Groq Whisper v3 Turbo VAD", "Re-entrancy & Token Guards", "Instant Voice Interruptibility"]
    },
    {
      phase: "Phase 03",
      status: "testing",
      statusLabel: "Internal Alpha",
      title: "Unified Working Memory",
      target: "Memory Core",
      description: "Multi-dimensional working memory tracking active windows, delta vision logs, task goals, and local Obsidian Markdown Vault synchronization.",
      milestones: ["Real-time WorkingMemory State", "Obsidian Vault FTS Logging", "Task & Goal Execution Logs"]
    },
    {
      phase: "Phase 04",
      status: "upcoming",
      statusLabel: "Roadmap Stage",
      title: "Native System Automation",
      target: "OS Control",
      description: "Direct Windows 11 system orchestration allowing SKY to execute PowerShell commands, launch installed apps, and manipulate local files.",
      milestones: ["AppResolver Path Resolver", "PowerShell Action Engine", "Automated Visual Verification"]
    }
  ];

  return (
    <section id="roadmap" className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto z-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 backdrop-blur-md text-xs font-semibold text-amber-200">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Project Status: In Development & Private Alpha Testing (Unreleased)</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Outfit']">
          Real System Architecture & Development Roadmap
        </h2>
        <p className="text-sky-100/80 text-base sm:text-lg font-normal leading-relaxed">
          Project SKY is currently under active private development and internal testing. Here is the actual technical architecture from our desktop codebase.
        </p>
      </div>

      {/* Timeline Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {phases.map((item, idx) => (
          <div
            key={idx}
            className={`sky-glass-panel p-7 rounded-3xl border transition-all duration-300 shadow-2xl flex flex-col justify-between ${
              item.status === 'active-dev' 
                ? 'border-amber-400/50 bg-slate-950/85 shadow-amber-500/10' 
                : item.status === 'testing' 
                ? 'border-sky-400/40 bg-slate-950/75' 
                : 'border-white/15 bg-slate-950/65'
            }`}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-sky-300">
                  {item.phase}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1.5 ${
                  item.status === 'active-dev' 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' 
                    : item.status === 'testing' 
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30' 
                    : 'bg-white/10 text-slate-300 border border-white/15'
                }`}>
                  {item.status === 'active-dev' ? <Wrench className="w-3 h-3 text-amber-300" /> : item.status === 'testing' ? <Sparkles className="w-3 h-3 text-sky-300" /> : <Clock className="w-3 h-3" />}
                  {item.statusLabel}
                </span>
              </div>

              <div>
                <div className="text-[11px] font-medium text-slate-400">{item.target}</div>
                <h3 className="text-lg font-bold text-white tracking-tight font-['Outfit'] mt-0.5">
                  {item.title}
                </h3>
              </div>

              <p className="text-sky-100/75 text-xs leading-relaxed font-sans font-normal">
                {item.description}
              </p>

              <div className="pt-3 border-t border-white/10 space-y-1.5">
                {item.milestones.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11px] text-sky-200/80">
                    <span className="w-1 h-1 rounded-full bg-sky-400" />
                    <span>{m}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
