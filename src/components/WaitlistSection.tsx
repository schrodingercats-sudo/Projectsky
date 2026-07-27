import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Shield, Mail, Loader2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { registerWaitlistEmail } from '../services/waitlistService';

export const WaitlistSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketNum, setTicketNum] = useState<number>(1001);
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const res = await registerWaitlistEmail(email, 'website_section');
    setLoading(false);

    if (!res.success) {
      setValidationError(res.error || 'Invalid email address.');
      return;
    }

    setTicketNum(res.ticket_number);
    setIsDuplicate(!!res.isDuplicate);
    setSubmitted(true);

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#60a5fa', '#3b82f6', '#93c5fd', '#ffffff']
    });
  };

  return (
    <section id="waitlist" className="py-20 px-6 max-w-4xl mx-auto relative z-10">
      <div className="sky-glass-panel p-8 sm:p-12 rounded-3xl border border-white/40 shadow-2xl backdrop-blur-2xl relative overflow-hidden text-center space-y-8">
        
        {/* Decorative Background Orb */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-sky-400/30 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/30 blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-300/30 text-xs font-semibold text-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>Limited Beta Access</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-['Outfit'] tracking-tight">
            Be first in line for <span className="bg-gradient-to-r from-sky-300 to-blue-400 bg-clip-text text-transparent">SKY</span>
          </h2>

          <p className="text-sky-100/80 text-sm sm:text-base">
            Join developers, creators, and power users building the future of desktop AI.
          </p>
        </div>

        {/* Form Container */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-5 h-5 text-sky-200/60 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (validationError) setValidationError('');
                }}
                placeholder="Enter your email address..."
                className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-white/15 border text-white placeholder-sky-100/50 text-sm focus:outline-none focus:ring-2 backdrop-blur-md shadow-inner transition-all ${
                  validationError ? 'border-rose-400/80 focus:border-rose-400 focus:ring-rose-400/30' : 'border-white/30 focus:border-sky-300 focus:ring-sky-400/40'
                }`}
              />
            </div>

            {validationError && (
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-medium flex items-center gap-2 text-left animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full sky-button-primary py-4 px-6 rounded-2xl text-base font-bold text-white flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all border border-white/30 group disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying email...</span>
                </>
              ) : (
                <>
                  <span>Request Early Access</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-sky-200/70 pt-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Zero spam. Direct priority invitation when early build drops.</span>
            </div>
          </form>
        ) : (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-center space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-400/30 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-300">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white">
                {isDuplicate ? 'Already on the waitlist!' : "You're on the list!"}
              </h3>
              <p className="text-xs text-sky-100 mt-1">
                Your priority ticket number: <span className="font-bold text-emerald-300">#{ticketNum}</span>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/10 text-xs font-mono text-sky-200 border border-white/15">
              Email saved: <span className="text-white font-semibold">{email}</span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
