import React, { useState } from 'react';
import { X, ArrowRight, CheckCircle2, Mail, Loader2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { registerWaitlistEmail } from '../services/waitlistService';

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ticketNum, setTicketNum] = useState<number>(1001);
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    if (!email || !email.includes('@')) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const res = await registerWaitlistEmail(email, 'modal');
    setLoading(false);

    if (!res.success) {
      setValidationError(res.error || 'Invalid email address.');
      return;
    }

    setTicketNum(res.ticket_number);
    setIsDuplicate(!!res.isDuplicate);
    setSubmitted(true);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#38bdf8', '#60a5fa', '#3b82f6', '#ffffff']
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-8 sky-glass-panel rounded-3xl border border-white/40 shadow-2xl space-y-6 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-blue-600 flex items-center justify-center mx-auto text-white font-bold text-sm shadow-lg shadow-sky-500/30 border border-white/30">
          &gt;v&lt;
        </div>

        {!submitted ? (
          <>
            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white font-['Outfit']">Join SKY Waitlist</h3>
              <p className="text-xs text-sky-100/80">Get priority early access when the Windows 11 desktop assistant launches.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative flex items-center">
                <Mail className="absolute left-4 w-4 h-4 text-sky-200/60 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  placeholder="name@example.com"
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/15 border text-white placeholder-sky-100/50 text-sm focus:outline-none focus:ring-2 backdrop-blur-md shadow-inner transition-all ${
                    validationError ? 'border-rose-400/80 focus:border-rose-400 focus:ring-rose-400/30' : 'border-white/30 focus:border-sky-300 focus:ring-sky-400/40'
                  }`}
                />
              </div>

              {validationError && (
                <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs font-medium flex items-center gap-2 text-left animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full sky-button-primary py-3.5 px-6 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg group disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying email...</span>
                  </>
                ) : (
                  <>
                    <span>Reserve My Spot</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="space-y-4 py-4">
            <div className="w-12 h-12 rounded-full bg-emerald-400/30 border border-emerald-300 flex items-center justify-center mx-auto text-emerald-300">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-white font-['Outfit']">
                {isDuplicate ? 'Already Registered!' : 'Access Confirmed'}
              </h3>
              <p className="text-xs text-sky-100 mt-1">
                {isDuplicate ? 'You are already in our priority queue with ticket:' : 'Your early access ticket number:'}
              </p>
              <div className="inline-block mt-3 px-6 py-2 rounded-xl bg-white/15 border border-white/30 text-xl font-mono font-bold text-sky-300 shadow-inner">
                #{ticketNum}
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 text-sm font-semibold text-white transition-colors"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
