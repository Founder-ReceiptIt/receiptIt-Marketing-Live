import { useState, useEffect } from 'react';
import { Shield, Eye, Lock, Check, Home, Clock, Play, User, ChevronDown, Mail } from 'lucide-react';
import SuccessModal from './components/SuccessModal';
import { supabase } from './lib/supabase';

function App() {
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFixedButton, setShowFixedButton] = useState(false);

  const handleClaimClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!alias) {
      setError('Please enter an alias');
      return;
    }

    if (!/^[a-zA-Z0-9._-]+$/.test(alias)) {
      setError('Alias can only contain letters, numbers, dots, hyphens, and underscores');
      return;
    }

    if (!email) {
      setError('Please enter your email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase
        .from('waitlist')
        .insert([{ email, alias }]);

      if (dbError) {
        if (dbError.code === '23505') {
          if (dbError.message?.includes('alias')) {
            setError('That alias is already taken');
          } else if (dbError.message?.includes('email')) {
            setError('You are already on the list');
          } else {
            setError('That alias is already taken');
          }
        } else {
          setError('Something went wrong. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      setIsModalOpen(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.querySelector('section');
      if (heroSection) {
        const heroBottom = heroSection.getBoundingClientRect().bottom;
        setShowFixedButton(heroBottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <Shield className="text-neon-teal" size={32} />
            <h1 className="text-2xl font-jetbrains font-bold">
              <span className="text-white">receipt</span>
              <span className="text-neon-teal">It</span>
            </h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">

        <section className="max-w-4xl mx-auto text-center mb-32">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center px-6 py-2 rounded-full border border-neon-teal/30 bg-neon-teal/5 backdrop-blur-sm shadow-[0_0_15px_rgba(45,212,191,0.3)] animate-float">
              <span className="text-neon-teal font-jetbrains text-sm font-bold tracking-wide">PUBLIC BETA OPENING SOON</span>
            </div>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-jetbrains font-bold mb-6 leading-tight tracking-tight">
            <span className="text-white">STOP GIVING RETAILERS</span><br />
            <span className="text-neon-teal">YOUR REAL EMAIL.</span>
          </h2>
          <p className="text-xl sm:text-2xl text-white/80 mb-12 font-inter">
            The smart receipt tracker and privacy firewall in one.
          </p>

          <form onSubmit={handleClaimClick} className="max-w-3xl mx-auto space-y-4">
            <div className="space-y-3">
              <div className="bg-dark-zinc/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <User size={20} className="text-white/40" />
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="your_name"
                  className="flex-1 bg-transparent text-white placeholder-white/40 outline-none font-jetbrains text-lg py-2"
                />
                <span className="text-white/60 font-jetbrains text-base">@receiptIt.app</span>
              </div>

              <div className="bg-dark-zinc/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <Mail size={20} className="text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@gmail.com"
                  required
                  className="flex-1 bg-transparent text-white placeholder-white/40 outline-none font-jetbrains text-lg py-2"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-neon-teal hover:bg-neon-teal text-black font-jetbrains font-bold px-8 py-4 rounded-full transition-all duration-200 hover:scale-105 shadow-[0_0_20px_rgba(45,212,191,0.6)] hover:shadow-[0_0_30px_rgba(45,212,191,0.8)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? 'Submitting...' : 'Get Your Smart Alias'}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-sm font-inter text-center">{error}</p>
            )}

            <div className="flex items-center justify-center gap-2 pt-2">
              <Lock size={16} className="text-white/60" />
              <p className="text-white/60 text-sm font-inter">
                <span className="text-white/80 font-medium">Zero-Sale Promise:</span> We never sell your data. Emails are AES-256 Encrypted.
              </p>
            </div>
          </form>

          <p className="mt-8 text-zinc-400 text-sm italic font-inter text-center max-w-2xl mx-auto">
            "I threw away my shoebox. This app saved me £500 on a warranty claim."
          </p>

          <button
            onClick={scrollToFeatures}
            className="mt-16 flex flex-col items-center gap-2 mx-auto text-white/40 hover:text-neon-teal transition-colors cursor-pointer group"
            aria-label="Scroll to features"
          >
            <span className="text-xs font-jetbrains tracking-wider">SCROLL DOWN</span>
            <ChevronDown size={24} className="animate-bounce group-hover:text-neon-teal" />
          </button>
        </section>

        <section className="max-w-4xl mx-auto mb-32">
          <div className="relative aspect-video bg-dark-zinc/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden group hover:border-neon-teal/50 transition-colors shadow-[0_0_40px_rgba(45,212,191,0.15)]">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-teal/5 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-neon-teal/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-neon-teal/30 group-hover:scale-110 transition-transform cursor-pointer">
                <Play className="text-neon-teal ml-1" size={32} fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-white/90 font-jetbrains text-sm">Director's Mode: See how receiptIt protects your inbox</p>
            </div>
          </div>
        </section>

        <section id="features" className="max-w-6xl mx-auto mb-32">
          <h3 className="text-3xl sm:text-4xl font-jetbrains font-bold text-center mb-12">
            WHY <span className="text-white">receipt</span><span className="text-neon-teal">It</span>?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-dark-zinc/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 hover:border-neon-teal/50 transition-colors">
              <Home className="text-neon-teal mb-4" size={48} />
              <h4 className="text-xl font-jetbrains font-bold mb-3">A Home for Your Receipts.</h4>
              <p className="text-white/70 font-inter leading-relaxed">
                Store, track, and budget automatically. We organize everything into a searchable digital vault.
              </p>
            </div>

            <div className="bg-dark-zinc/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 hover:border-neon-teal/50 transition-colors">
              <Shield className="text-neon-teal mb-4" size={48} />
              <h4 className="text-xl font-jetbrains font-bold mb-3">Stop Data Leaks.</h4>
              <p className="text-white/70 font-inter leading-relaxed">
                Retailers get your alias, not your real email. Block spam and protect your identity with one click.
              </p>
            </div>

            <div className="bg-dark-zinc/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 hover:border-neon-teal/50 transition-colors">
              <Clock className="text-neon-teal mb-4" size={48} />
              <h4 className="text-xl font-jetbrains font-bold mb-3">Never Miss a Warranty.</h4>
              <p className="text-white/70 font-inter leading-relaxed">
                We auto-detect electronics and notify you before your warranty expires.
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto">
          <h3 className="text-3xl sm:text-4xl font-jetbrains font-bold text-center mb-12">
            PRICING
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-dark-zinc/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 flex flex-col">
              <div className="text-center mb-8">
                <h4 className="text-2xl font-jetbrains font-bold mb-4">Privacy Starter</h4>
                <div className="mb-2">
                  <span className="text-5xl font-jetbrains font-bold text-white">£0</span>
                  <span className="text-white/60 font-inter text-lg">/mo</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <Check className="text-white/60 flex-shrink-0 mt-1" size={20} />
                  <span className="font-inter text-white/90"><span className="font-semibold">1 Smart Email Alias</span></span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-white/60 flex-shrink-0 mt-1" size={20} />
                  <span className="font-inter text-white/90">Block Retailer Spam</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-white/60 flex-shrink-0 mt-1" size={20} />
                  <span className="font-inter text-white/90">15 Receipts / Month</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-white/60 flex-shrink-0 mt-1" size={20} />
                  <span className="font-inter text-white/90">30-Day Search History</span>
                </li>
              </ul>

              <button className="w-full bg-white/10 hover:bg-white/20 text-white/80 font-jetbrains font-bold py-3 px-6 rounded-full transition-all duration-200 border border-white/20">
                Join Waitlist
              </button>
            </div>

            <div className="bg-dark-zinc/40 backdrop-blur-2xl border-2 border-neon-teal rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-[0_0_30px_rgba(45,212,191,0.3)] flex flex-col">
              <div className="absolute top-4 right-4 bg-neon-teal text-black text-xs font-jetbrains font-bold px-4 py-2 rounded-full">
                Beta User Exclusive
              </div>

              <div className="text-center mb-8">
                <h4 className="text-2xl font-jetbrains font-bold mb-4">Full Firewall</h4>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-2xl font-jetbrains font-bold line-through text-white/30">£4.99/mo</span>
                </div>
                <div className="mb-2">
                  <span className="text-5xl font-jetbrains font-bold text-neon-teal">6 Months FREE</span>
                </div>
                <p className="text-white/60 font-inter text-sm">Then £4.99/month or cancel anytime</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <Check className="text-neon-teal flex-shrink-0 mt-1" size={20} />
                  <span className="font-inter text-white/90">Unlimited Smart Aliases</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-neon-teal flex-shrink-0 mt-1" size={20} />
                  <span className="font-inter text-white/90">Warranty Watchdog (Auto-Alerts)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-neon-teal flex-shrink-0 mt-1" size={20} />
                  <span className="font-inter text-white/90">HMRC Tax Pack (CSV Export)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-neon-teal flex-shrink-0 mt-1" size={20} />
                  <span className="font-inter text-white/90">Lifetime 'Vault' Storage</span>
                </li>
              </ul>

              <button className="w-full bg-neon-teal hover:bg-neon-teal text-black font-jetbrains font-bold py-3 px-6 rounded-full transition-all duration-200 hover:scale-105 shadow-[0_0_20px_rgba(45,212,191,0.6)]">
                Claim Free 6 Months
              </button>
            </div>
          </div>
        </section>

        <footer className="mt-32 pb-24 text-center text-white/40 font-jetbrains text-sm">
          <p>© 2026 <span className="text-white font-bold">receipt</span><span className="text-neon-teal font-bold">It</span>. Built with privacy-first principles.</p>
        </footer>
      </div>

      {showFixedButton && (
        <button
          onClick={(e) => {
            if (!alias || !email) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              handleClaimClick(e);
            }
          }}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '90%',
            maxWidth: '450px',
            zIndex: 50
          }}
          className="bg-neon-teal/95 backdrop-blur-lg hover:bg-neon-teal text-black font-jetbrains font-bold py-4 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_30px_rgba(45,212,191,0.8)] animate-[slideUp_0.3s_ease-out]"
        >
          Unlock 6 Months Free
        </button>
      )}

      <SuccessModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setAlias('');
          setEmail('');
          setError('');
        }}
        alias={alias}
      />
    </div>
  );
}

export default App;
