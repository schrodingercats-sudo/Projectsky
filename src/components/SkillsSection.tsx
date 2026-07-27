import React from 'react';
import { Eye, Mic, Brain, Command, Cpu, Compass } from 'lucide-react';

interface SkillItem {
  id: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  highlights: string[];
}

export const SkillsSection: React.FC = () => {
  const skills: SkillItem[] = [
    {
      id: "skill-vision",
      badge: "Perception Domain",
      title: "Real-Time Spatial Vision",
      description: "Continuously reads and interprets your active desktop environment, understanding code, UI layouts, and documentation directly from screen pixels.",
      icon: <Eye className="w-6 h-6 text-cyan-300" />,
      highlights: ["Screen Context Perception", "Code Error Diagnostics", "Visual UI Inspection"]
    },
    {
      id: "skill-voice",
      badge: "Speech Domain",
      title: "Zero-Latency Voice Dialogue",
      description: "Engage in natural fluid conversation with instant response times. Formulate complex thoughts verbally without breaking your creative coding momentum.",
      icon: <Mic className="w-6 h-6 text-sky-300" />,
      highlights: ["Natural Speech Input", "Instant Audio Synthesis", "Hands-Free Execution"]
    },
    {
      id: "skill-memory",
      badge: "Memory Domain",
      title: "Persistent Vault Memory",
      description: "Indexes your project guidelines, past conversations, and technical preferences into a unified local memory architecture that persists across sessions.",
      icon: <Brain className="w-6 h-6 text-indigo-300" />,
      highlights: ["Cross-Session Recall", "Project Context Indexing", "Zero Re-explanation"]
    },
    {
      id: "skill-control",
      badge: "Control Domain",
      title: "Windows OS Orchestration",
      description: "Translates natural language intent into precise system actions—managing windows, triggering scripts, and organizing complex desktop environments.",
      icon: <Command className="w-6 h-6 text-emerald-300" />,
      highlights: ["Desktop Layout Control", "Script Execution", "System Automation"]
    },
    {
      id: "skill-reasoning",
      badge: "Reasoning Domain",
      title: "Multimodal Problem Solving",
      description: "Synthesizes code logic, visual design mocks, and project documentation simultaneously to resolve technical blockers effortlessly.",
      icon: <Cpu className="w-6 h-6 text-purple-300" />,
      highlights: ["Multi-Source Synthesis", "Deep Context Awareness", "Solution Generation"]
    },
    {
      id: "skill-ambient",
      badge: "Ambient Domain",
      title: "Proactive Task Sensing",
      description: "Quietly monitors your workspace activity to anticipate needs, preparing relevant files and actions before you explicitly ask.",
      icon: <Compass className="w-6 h-6 text-amber-300" />,
      highlights: ["Workflow Anticipation", "Silent Preparation", "Minimal Friction"]
    }
  ];

  return (
    <section id="skills" className="relative py-24 px-4 sm:px-6 max-w-7xl mx-auto z-20">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-xs font-semibold text-sky-200">
          <span>Agentic Skillset</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-['Outfit']">
          Capabilities engineered for desktop mastery.
        </h2>
        <p className="text-sky-100/80 text-base sm:text-lg font-normal leading-relaxed">
          SKY combines six core skill domains into a unified, ambient assistant that lives directly on Windows 11.
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="sky-glass-panel p-7 rounded-3xl border border-white/20 bg-slate-950/80 backdrop-blur-xl hover:border-sky-400/50 transition-all duration-300 shadow-2xl group flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-sky-200 border border-white/15">
                  {skill.badge}
                </span>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                  {skill.icon}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight font-['Outfit']">
                {skill.title}
              </h3>

              <p className="text-sky-100/80 text-xs sm:text-sm leading-relaxed font-sans font-normal">
                {skill.description}
              </p>

              <div className="pt-3 border-t border-white/10 space-y-1.5">
                {skill.highlights.map((h, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-sky-200/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                    <span>{h}</span>
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
