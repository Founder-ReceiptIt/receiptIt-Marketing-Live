import { useState } from 'react';
import { Check, X, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  alias: string;
}

export default function SuccessModal({ isOpen, onClose, alias }: SuccessModalProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email) {
      setError('Please enter your email');
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert([{ alias: alias.toLowerCase(), email }]);

      if (insertError) {
        if (insertError.code === '23505' || (insertError as any).status === 409) {
          setError('This email or alias has already been claimed.');
        } else {
          setError('Something went wrong. Please try again.');
        }
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError('');
    setIsSuccess(false);
    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-dark-zinc/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-neon-teal/20 rounded-full flex items-center justify-center">
              <Mail size={40} className="text-neon-teal" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-jetbrains font-bold text-white">
                SECURE YOUR ALIAS
              </h2>
              <p className="text-neon-teal font-jetbrains text-lg">
                {alias}@receiptIt.app
              </p>
            </div>

            <div className="w-full space-y-4">
              <p className="text-white/80 font-inter text-sm">
                Enter your email to secure this alias and get priority access to receiptIt.
              </p>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full bg-black/50 border border-white/10 rounded-full px-6 py-3 text-white placeholder-white/40 outline-none font-inter focus:border-neon-teal/50 transition-colors"
                disabled={isLoading}
                autoFocus
              />

              {error && (
                <p className="text-red-400 text-sm font-inter">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-neon-teal hover:bg-neon-teal text-black font-jetbrains font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(45,212,191,0.6)]"
            >
              {isLoading ? 'RESERVING...' : 'RESERVE ALIAS'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
              <Check size={48} className="text-green-500" strokeWidth={3} />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-jetbrains font-bold text-white">
                ALIAS RESERVED!
              </h2>
              <p className="text-neon-teal font-jetbrains text-lg">
                {alias}@receiptIt.app
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-white/90 font-inter text-base">
                You are on the Priority Access list. We will email you in Q1 to activate your 6 Free Months.
              </p>
              <p className="text-white/50 font-inter text-sm">
                Your email has been securely hashed.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full bg-neon-teal hover:bg-neon-teal/90 text-black font-inter font-semibold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
