import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Mic, 
  MicOff,
  MessageSquare, 
  Maximize2,
  RotateCcw,
  ChevronDown,
  X,
  Send,
  CheckCircle2,
  Trash2,
  FilePlus,
  Eye,
  MousePointer
} from 'lucide-react';
import { LivingSymbol, type SymbolState } from './LivingSymbol';

// ─── Browser Speech API types ───
interface SpeechRecognitionEvent {
  results: { [index: number]: { [index: number]: { transcript: string } } };
  resultIndex: number;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'sky';
  text: string;
  timestamp: string;
  options?: { label: string; action: string }[];
}

export const ProductShowcase: React.FC = () => {
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [showMicPowerModal, setShowMicPowerModal] = useState<boolean>(false);
  const [showChatWindow, setShowChatWindow] = useState<boolean>(false);
  const [symbolState, setSymbolState] = useState<SymbolState>('idle');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isCapsuleHovered, setIsCapsuleHovered] = useState<boolean>(false);
  const [lastActionNotification, setLastActionNotification] = useState<{ text: string; type: 'create' | 'delete' | 'vision' } | null>(null);
  const [iframeInteractive, setIframeInteractive] = useState<boolean>(false);

  // Multi-turn state
  const [pendingAction, setPendingAction] = useState<'create_awaiting_name' | 'delete_awaiting_name' | null>(null);

  // Voice state
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');

  // Iframe ref for postMessage
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Chat State
  const [chatInput, setChatInput] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'sky',
      text: 'Welcome to SKY interactive demo. Toggle the mic ON and speak, or use the chat. I can create files, delete items, and scan the screen.',
      timestamp: '12:00 PM',
      options: [
        { label: "📄 Create a file", action: "__create" },
        { label: "🗑️ Delete a file", action: "__delete" },
        { label: "👁️ Scan monitor", action: "__scan" }
      ]
    }
  ]);

  const chatScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollRef.current) {
      // Only scroll the chat container, not the page
      const el = chatScrollRef.current;
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  // ─── Initialize Speech Synthesis ───
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // ─── SKY Speak Out Loud ───
  const skySpeak = useCallback((text: string) => {
    if (!synthRef.current) return;
    // Cancel any ongoing speech
    synthRef.current.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 0.85;
    // Try to pick a good English voice
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(v => v.name.includes('Microsoft Zira') || v.name.includes('Google US English') || v.name.includes('Samantha') || (v.lang === 'en-US' && v.localService));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => setSymbolState('speaking');
    utterance.onend = () => {
      if (isMicActive) {
        setSymbolState('listening');
      } else {
        setSymbolState('idle');
      }
    };
    synthRef.current.speak(utterance);
  }, [isMicActive]);

  // ─── SEND COMMAND TO IFRAME (WINDOWS 11 OS DESKTOP) ───
  const sendToDesktop = (type: string, fileName: string) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type, fileName }, '*');
    }
  };

  const handleRefresh = () => {
    setIframeKey(prev => prev + 1);
    setSymbolState('idle');
    setLastActionNotification(null);
    setPendingAction(null);
    setIframeInteractive(false);
  };

  const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const addUserMsg = useCallback((text: string) => {
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, sender: 'user', text, timestamp: now() }]);
  }, []);

  const addSkyMsg = useCallback((text: string, options?: { label: string; action: string }[]) => {
    setMessages(prev => [...prev, { id: `s-${Date.now()}`, sender: 'sky', text, timestamp: now(), options }]);
  }, []);

  const showNotif = (text: string, type: 'create' | 'delete' | 'vision') => {
    setLastActionNotification({ text, type });
    setTimeout(() => setLastActionNotification(null), 4000);
  };

  // ─── MAIN COMMAND PROCESSOR ───
  const processCommand = useCallback((rawInput: string, fromVoice = false) => {
    if (!rawInput.trim()) return;
    const input = rawInput.trim();
    const lower = input.toLowerCase();

    // Don't echo internal action tokens as user messages
    if (!input.startsWith('__')) {
      addUserMsg(fromVoice ? `🎙️ "${input}"` : input);
    }
    setChatInput('');
    setSymbolState('thinking');

    setTimeout(() => {
      setSymbolState('speaking');

      // ─── MULTI-TURN: AWAITING FILE NAME FOR CREATION ───
      if (pendingAction === 'create_awaiting_name') {
        const fileName = input.includes('.') ? input : `${input.replace(/\s+/g, '_')}.txt`;
        sendToDesktop('sky-create-file', fileName);
        const response = `Done! I've created '${fileName}' on the desktop.`;
        addSkyMsg(response);
        showNotif(`Created ${fileName}`, 'create');
        skySpeak(response);
        setPendingAction(null);
        return;
      }

      // ─── MULTI-TURN: AWAITING FILE NAME FOR DELETION ───
      if (pendingAction === 'delete_awaiting_name') {
        const fileName = input.includes('.') ? input : `${input.replace(/\s+/g, '_')}.tmp`;
        sendToDesktop('sky-delete-file', fileName);
        const response = `Deleted '${fileName}'. It's been moved to the Recycle Bin.`;
        addSkyMsg(response);
        showNotif(`Deleted ${fileName}`, 'delete');
        skySpeak(response);
        setPendingAction(null);
        return;
      }

      // ─── INTENT MATCHING (broad, fuzzy, voice-friendly) ───
      const has = (...keys: string[]) => keys.some(k => lower.includes(k));
      const starts = (...keys: string[]) => keys.some(k => lower.startsWith(k));

      // ─── Desktop file map for navigation ───
      const fileMap: Record<string, { path: string; label: string }> = {
        'about sky': { path: '/notepad/about', label: 'About SKY' },
        'about': { path: '/notepad/about', label: 'About SKY' },
        'sky': { path: '/notepad/about', label: 'About SKY' },
        'projects': { path: '/explorer/projects', label: 'Projects' },
        'project': { path: '/explorer/projects', label: 'Projects' },
        'tools': { path: '/explorer/tools', label: 'Tools' },
        'tool': { path: '/explorer/tools', label: 'Tools' },
        'links': { path: '/explorer/links', label: 'Links' },
        'link': { path: '/explorer/links', label: 'Links' },
      };

      // ─── OPEN / LAUNCH EXISTING FILE (navigate iframe) ───
      if (has('open', 'launch', 'go to', 'navigate', 'show', 'run', 'start', 'read', 'view', 'about') && !has('create', 'new file', 'make file', 'add file')) {
        // Try to match a desktop file name from the user's input
        let matched: { path: string; label: string } | null = null;
        for (const [key, val] of Object.entries(fileMap)) {
          if (lower.includes(key)) { matched = val; break; }
        }

        if (matched) {
          // Navigate iframe to the matched page
          if (iframeRef.current) {
            iframeRef.current.src = `http://localhost:3001${matched.path}`;
          }
          setIframeInteractive(true);
          const response = `Opening ${matched.label} on your desktop.`;
          addSkyMsg(response);
          showNotif(`Opened ${matched.label}`, 'vision');
          skySpeak(response);
          return;
        } else {
          // Ask which file to open
          const response = "Which file would you like to open?";
          addSkyMsg(response, [
            { label: "📄 About SKY", action: "__open_about" },
            { label: "📁 Projects", action: "__open_projects" },
            { label: "📁 Tools", action: "__open_tools" },
            { label: "📁 Links", action: "__open_links" }
          ]);
          skySpeak(response);
          return;
        }
      }

      // ─── HANDLE OPEN FILE CHIP CLICKS ───
      if (lower === '__open_about' || lower === '__open_projects' || lower === '__open_tools' || lower === '__open_links') {
        const map: Record<string, { path: string; label: string }> = {
          '__open_about': { path: '/notepad/about', label: 'About SKY' },
          '__open_projects': { path: '/explorer/projects', label: 'Projects' },
          '__open_tools': { path: '/explorer/tools', label: 'Tools' },
          '__open_links': { path: '/explorer/links', label: 'Links' },
        };
        const target = map[lower];
        if (iframeRef.current && target) {
          iframeRef.current.src = `http://localhost:3001${target.path}`;
        }
        setIframeInteractive(true);
        const response = `Opening ${target.label} on the desktop.`;
        addSkyMsg(response);
        showNotif(`Opened ${target.label}`, 'vision');
        skySpeak(response);
        return;
      }

      // ─── CREATE / MAKE / NEW / BUILD / GENERATE ───
      if (lower === '__create' || has('create', 'new file', 'make file', 'add file', 'make a', 'build', 'generate', 'write a', 'touch', 'new document', 'new note', 'make new', 'save a', 'save file') || starts('make', 'new')) {
        const response = "Sure! What should I name the file?";
        addSkyMsg(response, [
          { label: "📄 Project_Notes.md", action: "Project_Notes.md" },
          { label: "📄 Architecture.txt", action: "Architecture.txt" },
          { label: "📄 script.py", action: "script.py" },
          { label: "📄 config.json", action: "config.json" }
        ]);
        skySpeak(response);
        setPendingAction('create_awaiting_name');
        return;
      }

      // ─── DELETE / REMOVE / CLOSE / TRASH / CLEAN / SHUT ───
      if (lower === '__delete' || has('delete', 'remove', 'trash', 'clean', 'clear', 'close file', 'shut', 'erase', 'destroy', 'discard', 'throw', 'bin', 'wipe', 'get rid', 'take out', 'clean up', 'tidy')) {
        const response = "Which file should I delete?";
        addSkyMsg(response, [
          { label: "🗑️ About SKY", action: "About SKY" },
          { label: "🗑️ Projects", action: "Projects" },
          { label: "🗑️ Tools", action: "Tools" },
          { label: "🗑️ Links", action: "Links" }
        ]);
        skySpeak(response);
        setPendingAction('delete_awaiting_name');
        return;
      }

      // ─── SCAN / VISION / LOOK / SEE / WHAT / SHOW / TELL / DESCRIBE / CHECK / STATUS ───
      if (lower === '__scan' || has('monitor', 'screen', 'scan', 'look', 'desktop', 'show me', 'tell me', 'describe', 'check', 'status', 'view', 'display', 'inspect', 'analyse', 'analyze', 'observe', 'watch', 'reading', 'capture') || starts('what', 'see', 'how does', 'how is', 'can you see', 'do you see', 'is there', 'are there')) {
        const reports = [
          "I can see your Windows 11 desktop. SKY capsule is floating at the top. I count 4 desktop shortcuts: About SKY, Projects, Tools, Links, and a Recycle Bin. Everything looks normal.",
          "Screen scan complete. Windows 11 home screen active. Taskbar at the bottom. No error dialogs detected. All systems nominal.",
          "I see the desktop with the SKY overlay running. Background wallpaper loaded. 4 shortcut icons visible. No active windows right now.",
          "Scanning your display now. I see the desktop with standard icons. No alerts, no active processes hogging resources. All clear."
        ];
        const report = reports[Math.floor(Math.random() * reports.length)];
        addSkyMsg(report);
        showNotif("Scanned Screen", 'vision');
        skySpeak(report);
        return;
      }

      // ─── GREETING / HI / HELLO / GOOD MORNING ───
      if (has('hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy', 'yo', 'sup', 'greetings') || starts('hi', 'hey')) {
        const greetings = [
          "Hey! I'm SKY, your desktop companion. I can create files, delete items, or scan the screen. What would you like?",
          "Hello! Ready to help. Try asking me to create a file or scan the monitor.",
          "Hi there! I'm listening. What can I do for you?"
        ];
        const g = greetings[Math.floor(Math.random() * greetings.length)];
        addSkyMsg(g, [
          { label: "📄 Create a file", action: "__create" },
          { label: "🗑️ Delete a file", action: "__delete" },
          { label: "👁️ Scan monitor", action: "__scan" }
        ]);
        skySpeak(g);
        return;
      }

      // ─── HELP / WHAT CAN YOU DO ───
      if (has('help', 'assist', 'capable', 'can you do', 'features', 'abilities', 'options', 'commands', 'support')) {
        const response = "I can create files on the desktop, delete items, and scan the screen for you. Just ask naturally!";
        addSkyMsg(response, [
          { label: "📄 Create a file", action: "__create" },
          { label: "🗑️ Delete a file", action: "__delete" },
          { label: "👁️ Scan monitor", action: "__scan" }
        ]);
        skySpeak(response);
        return;
      }

      // ─── THANKS / BYE / STOP ───
      if (has('thank', 'thanks', 'bye', 'goodbye', 'stop', 'done', 'that\'s all', 'nothing', 'no', 'nope', 'never mind', 'cancel', 'quit', 'exit')) {
        const responses = [
          "You're welcome! I'll be right here if you need anything.",
          "No problem! Just say my name when you need me again.",
          "Alright, standing by. I'm always listening."
        ];
        const r = responses[Math.floor(Math.random() * responses.length)];
        addSkyMsg(r);
        skySpeak(r);
        setPendingAction(null);
        return;
      }

      // ─── YES / OK / SURE / CONFIRM ───
      if (has('yes', 'yeah', 'yep', 'sure', 'okay', 'ok', 'go ahead', 'do it', 'confirm', 'proceed', 'alright')) {
        const response = "Got it! What would you like me to do?";
        addSkyMsg(response, [
          { label: "📄 Create a file", action: "__create" },
          { label: "🗑️ Delete a file", action: "__delete" },
          { label: "👁️ Scan monitor", action: "__scan" }
        ]);
        skySpeak(response);
        return;
      }

      // ─── SMART FALLBACK — try to be helpful instead of "I didn't catch that" ───
      const smartFallback = `I heard you say "${input}". I can create files, delete items, or scan the screen. Which would you like?`;
      addSkyMsg(smartFallback, [
        { label: "📄 Create a file", action: "__create" },
        { label: "🗑️ Delete a file", action: "__delete" },
        { label: "👁️ Scan monitor", action: "__scan" }
      ]);
      skySpeak(smartFallback);
    }, 700);
  }, [pendingAction, showChatWindow, addUserMsg, addSkyMsg, skySpeak]);

  // ─── SPEECH RECOGNITION (Browser Native — no API key needed) ───
  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      addSkyMsg("⚠️ Your browser doesn't support Speech Recognition. Please use Chrome or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < Object.keys(event.results).length; i++) {
        const result = event.results[i];
        if (result && result[0]) {
          const transcript = result[0].transcript;
          if ((result as any).isFinal) {
            final += transcript;
          } else {
            interim = transcript;
          }
        }
      }
      setVoiceTranscript(interim);
      if (final) {
        setVoiceTranscript('');
        processCommand(final, true);
      }
    };

    recognition.onerror = (event: any) => {
      console.log('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        addSkyMsg("Microphone access was denied. Please allow microphone permissions in your browser.");
      }
    };

    recognition.onend = () => {
      // Auto-restart if mic is still supposed to be active
      if (isMicActive && recognitionRef.current) {
        try { recognition.start(); } catch(e) { /* already started */ }
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
    setSymbolState('listening');
  }, [isMicActive, processCommand, addSkyMsg]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onend = null; // Prevent auto-restart
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setVoiceTranscript('');
    setSymbolState('idle');
    // Also stop any ongoing speech
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  }, []);

  // ─── MIC TOGGLE ───
  const handleToggleMic = useCallback((active: boolean) => {
    setIsMicActive(active);
    if (active) {
      startListening();
    } else {
      stopListening();
    }
  }, [startListening, stopListening]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Click outside iframe overlay to deactivate it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const showcase = document.getElementById('showcase');
      if (showcase && !showcase.contains(e.target as Node)) {
        setIframeInteractive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(chatInput);
  };

  const handleOptionClick = (action: string) => {
    processCommand(action);
  };

  const isExpanded = isCapsuleHovered || showChatWindow || showMicPowerModal || symbolState === 'thinking' || symbolState === 'speaking';

  return (
    <section id="showcase" className="hidden md:block relative px-4 sm:px-6 lg:px-8 pt-12 pb-16 w-full max-w-[1440px] mx-auto mt-10 z-20">
      
      <div className={`relative rounded-none overflow-hidden sky-glass-panel border-2 border-white/30 shadow-2xl backdrop-blur-2xl transition-all duration-500 bg-[#081326]/90 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : 'w-full'
      }`}>

        {/* ─── ACTION NOTIFICATION BADGE ─── */}
        {lastActionNotification && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full bg-slate-950/90 border border-sky-400/60 text-white text-xs font-semibold shadow-2xl backdrop-blur-xl flex items-center gap-2" style={{ animation: 'fadeInDown 0.3s ease' }}>
            {lastActionNotification.type === 'create' && <FilePlus className="w-4 h-4 text-emerald-400" />}
            {lastActionNotification.type === 'delete' && <Trash2 className="w-4 h-4 text-rose-400" />}
            {lastActionNotification.type === 'vision' && <Eye className="w-4 h-4 text-cyan-400" />}
            <span>{lastActionNotification.text}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 ml-1" />
          </div>
        )}

        {/* ─── VOICE TRANSCRIPT LIVE INDICATOR ─── */}
        {isMicActive && voiceTranscript && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 rounded-full bg-cyan-950/90 border border-cyan-400/50 text-cyan-200 text-xs font-medium shadow-2xl backdrop-blur-xl flex items-center gap-2">
            <Mic className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="italic">"{voiceTranscript}"</span>
          </div>
        )}

        {/* ─── FLOATING CAPSULE BAR ─── */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto flex items-center justify-center">
          <div 
            onMouseEnter={() => setIsCapsuleHovered(true)}
            onMouseLeave={() => setIsCapsuleHovered(false)}
            className="flex items-center px-3 py-1.5 rounded-full transition-all duration-500 shadow-2xl relative cursor-pointer"
            style={{
              height: 48,
              width: isExpanded ? 340 : 56,
              background: 'linear-gradient(180deg, rgba(14, 14, 22, 0.96), rgba(0, 0, 0, 0.98))',
              boxShadow: isCapsuleHovered 
                ? '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 25px rgba(56, 189, 248, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.5)' 
                : '0 20px 50px rgba(0, 0, 0, 0.85), inset 0 1px 1px rgba(255, 255, 255, 0.45)',
              border: isCapsuleHovered ? '1px solid rgba(56, 189, 248, 0.6)' : '1px solid rgba(255, 255, 255, 0.22)',
              overflow: showMicPowerModal ? 'visible' : 'hidden'
            }}
          >
            <div className="flex-shrink-0 flex items-center justify-center">
              <LivingSymbol state={symbolState} size={32} />
            </div>

            <div className={`flex items-center justify-between flex-1 ml-3 transition-all duration-300 ${
              isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none w-0 overflow-hidden'
            }`}>
              <div className="flex items-center justify-center flex-1 px-1">
                {isMicActive ? (
                  <div className="flex items-center justify-center gap-[3.5px] w-full">
                    {[...Array(18)].map((_, i) => (
                      <span key={i} className="w-1 bg-sky-400 rounded-full animate-pulse"
                        style={{ height: `${Math.floor(6 + Math.sin(i * 0.7) * 9 + (i % 3) * 4)}px`, animationDelay: `${i * 55}ms`, backgroundColor: i % 2 === 0 ? '#38bdf8' : '#818cf8' }} />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-1.5 w-full">
                    {[...Array(14)].map((_, i) => (
                      <span key={i} className="w-1 h-1.5 bg-slate-600 rounded-full" />
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 border-l border-white/15 pl-2.5 flex-shrink-0">
                <button 
                  onClick={() => setShowChatWindow(!showChatWindow)}
                  className={`p-1.5 rounded-full transition-colors ${showChatWindow ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40' : 'text-white/80 hover:text-white hover:bg-white/20'}`}
                  title="Toggle Chat Window"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>

                <div className="relative">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleToggleMic(!isMicActive)}
                      className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] flex items-center gap-1 transition-all shadow-md ${
                        isMicActive ? 'bg-sky-400 text-slate-950 hover:bg-sky-300 shadow-sky-400/30' : 'bg-rose-600/90 text-white hover:bg-rose-500 shadow-rose-600/30'
                      }`}
                    >
                      {isMicActive ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                      <span>{isMicActive ? 'ON' : 'OFF'}</span>
                    </button>
                    <button onClick={() => setShowMicPowerModal(!showMicPowerModal)} className="p-1 text-white/70 hover:text-white transition-colors ml-0.5">
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  {showMicPowerModal && (
                    <div className="absolute top-10 right-0 w-72 p-4 rounded-2xl bg-slate-900/95 border border-white/25 shadow-2xl backdrop-blur-2xl z-50 text-left space-y-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MICROPHONE POWER</div>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => { handleToggleMic(true); setShowMicPowerModal(false); }}
                          className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${isMicActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}>
                          <span className="w-2 h-2 rounded-full bg-emerald-400" /><span>Mic ON</span>
                        </button>
                        <button onClick={() => { handleToggleMic(false); setShowMicPowerModal(false); }}
                          className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${!isMicActive ? 'bg-rose-500/20 text-rose-300 border-rose-400/50' : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}>
                          <span className="w-2 h-2 rounded-full bg-rose-400" /><span>Mic OFF</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-slate-500 text-center leading-tight">Uses your browser's built-in Speech Recognition. No data leaves your device.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── CHATBOX WINDOW ─── */}
        {showChatWindow && (
          <div className="absolute top-18 left-1/2 -translate-x-1/2 z-50 w-[440px] max-w-[95vw] h-[540px] rounded-2xl bg-[#0f1420]/95 border border-white/20 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-left" style={{ animation: 'fadeInDown 0.25s ease' }}>
            
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${isMicActive ? 'bg-cyan-400 animate-pulse' : 'bg-indigo-400'}`} />
                <span className="font-extrabold text-white text-sm tracking-tight font-['Outfit']">SKY Interactive Demo</span>
                {isMicActive && <span className="text-[9px] text-cyan-300/80 font-medium ml-1">🎙️ Listening...</span>}
              </div>
              <button onClick={() => setShowChatWindow(false)} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 bg-slate-950/80 border-b border-white/10 flex items-center justify-center gap-2 overflow-x-auto text-[11px]">
              <button onClick={() => processCommand("__create")} className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 hover:bg-emerald-500/30 transition-colors flex items-center gap-1 flex-shrink-0">
                <FilePlus className="w-3 h-3" /><span>Create file</span>
              </button>
              <button onClick={() => processCommand("__delete")} className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 hover:bg-rose-500/30 transition-colors flex items-center gap-1 flex-shrink-0">
                <Trash2 className="w-3 h-3" /><span>Delete file</span>
              </button>
              <button onClick={() => processCommand("__scan")} className="px-2.5 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 hover:bg-sky-500/30 transition-colors flex items-center gap-1 flex-shrink-0">
                <Eye className="w-3 h-3" /><span>Scan monitor</span>
              </button>
            </div>

            <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs" style={{ overscrollBehavior: 'contain' }}>
              {messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[88%] p-3 rounded-2xl leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md'
                      : 'bg-white/10 text-sky-100 border border-white/15 rounded-bl-none shadow-sm'
                  }`}>
                    <div>{msg.text}</div>
                    {msg.options && (
                      <div className="mt-2.5 pt-2 border-t border-white/15 flex flex-wrap gap-1.5">
                        {msg.options.map((opt, i) => (
                          <button key={i} onClick={() => handleOptionClick(opt.action)}
                            className="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-sky-500/30 text-sky-200 border border-white/20 text-[11px] font-semibold transition-all hover:scale-105">
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-950/90 border-t border-white/10">
              <form onSubmit={handleSendMessage} className="relative flex items-center">
                <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                  placeholder={pendingAction === 'create_awaiting_name' ? "Type a filename (e.g. notes.md)..." : pendingAction === 'delete_awaiting_name' ? "Type the file to delete..." : "Type a command or speak..."}
                  className="w-full pl-4 pr-12 py-3 rounded-full bg-black/60 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-400/60 shadow-inner" />
                <button type="submit" disabled={!chatInput.trim()} className="absolute right-1.5 p-2 rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 text-white disabled:opacity-40 transition-all hover:scale-105 shadow-md">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ─── ACTION CONTROLS ─── */}
        <div className="absolute top-4 right-4 z-40 flex items-center gap-2">
          <button onClick={handleRefresh} className="p-2 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-sky-200 hover:text-white text-xs transition-all shadow-lg" title="Reset Demo">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-2 rounded-lg bg-slate-950/80 hover:bg-slate-900 border border-white/20 text-sky-200 hover:text-white text-xs transition-all shadow-lg" title="Fullscreen">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ─── WINDOWS 11 OS IFRAME + SCROLL-THROUGH OVERLAY ─── */}
        <div className="relative w-full h-[700px] sm:h-[750px] bg-[#0b192e]">
          {/* Transparent overlay: allows page scroll through the iframe area.
              Click to interact with the desktop, click outside to re-enable scroll-through. */}
          {!iframeInteractive && (
            <div 
              className="absolute inset-0 z-10 cursor-pointer flex items-start justify-center pt-24"
              onClick={() => setIframeInteractive(true)}
            >
              <div className="px-5 py-2.5 rounded-full bg-slate-950/90 backdrop-blur-xl border border-white/30 text-white/90 text-xs font-semibold flex items-center gap-2 shadow-2xl hover:bg-slate-900 hover:scale-105 transition-all">
                <MousePointer className="w-3.5 h-3.5 text-sky-400" />
                <span>Click to interact with Desktop OS</span>
              </div>
            </div>
          )}
          <iframe
            ref={iframeRef}
            key={iframeKey}
            src="http://localhost:3001"
            title="SKY Windows 11 Interactive Showcase"
            className="w-full h-full border-0 rounded-none"
            style={{ pointerEvents: iframeInteractive ? 'auto' : 'none' }}
            loading="eager"
            allow="autoplay; clipboard-write; encrypted-media"
          />
        </div>
      </div>

      {/* ─── KEYFRAME ANIMATIONS ─── */}
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-12px) translateX(-50%); }
          to { opacity: 1; transform: translateY(0) translateX(-50%); }
        }
      `}</style>
    </section>
  );
};
