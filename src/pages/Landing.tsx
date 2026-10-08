import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Heart, Coins, Compass, Share2, BrainCircuit,
  ChevronDown, Menu, X, Star,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { calculateDestinyMatrix, DestinyMatrixResult } from '../lib/matrix-calculator';
import { getArcana } from '../lib/arcana-meanings';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { ArcanaModal, SelectedArcana } from '../components/chart/ArcanaModal';

const SAMPLE_RESULT = calculateDestinyMatrix(new Date(1990, 4, 21));

function Nav() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'How it works', href: '#how' },
    { label: 'Try it free', href: '#demo' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#fef7ed]/85 backdrop-blur-md border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-serif font-semibold text-text-primary">Gaia Vesta</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-text-primary/70 hover:text-text-primary transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link
                to="/dashboard"
                className="px-5 py-2.5 bg-gradient-to-r from-gold to-purple text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
              >
                Open Dashboard
              </Link>
            ) : (
              <>
                <Link to="/auth" className="text-sm font-medium text-text-primary/70 hover:text-text-primary transition-colors">
                  Sign in
                </Link>
                <Link
                  to="/auth"
                  className="px-5 py-2.5 bg-gradient-to-r from-gold to-purple text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
                >
                  Get started free
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gold/20 bg-[#fef7ed]/95 px-4 py-4 space-y-3">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm font-medium text-text-primary/80">
              {l.label}
            </a>
          ))}
          <Link to={user ? '/dashboard' : '/auth'} onClick={() => setOpen(false)}
            className="block text-center px-5 py-2.5 bg-gradient-to-r from-gold to-purple text-white text-sm font-medium rounded-lg">
            {user ? 'Open Dashboard' : 'Get started free'}
          </Link>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple/20 rounded-full blur-3xl" />
        <div className="absolute top-40 -left-24 w-96 h-96 bg-gold/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative">
        <div className="animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-white/70 border border-gold/30 rounded-full px-4 py-1.5 text-xs font-medium text-text-primary/70 mb-6">
            <Star className="w-3.5 h-3.5 text-gold" />
            Based on ancient Tarot wisdom & numerology
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-text-primary leading-tight mb-6">
            Your Cosmic <span className="bg-gradient-to-r from-gold to-purple bg-clip-text text-transparent">Blueprint</span>, Decoded
          </h1>
          <p className="text-lg text-text-primary/70 mb-8 max-w-lg">
            Enter your birth date and Gaia Vesta maps your Destiny Matrix — 22 Major Arcana revealing
            your soul purpose, love patterns, money energy, and life path.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#demo" className="px-8 py-3.5 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-xl transition-all flex items-center justify-center gap-2">
              Reveal my chart — free
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#how" className="px-8 py-3.5 bg-white/70 border border-gold/30 text-text-primary font-medium rounded-xl hover:border-gold/60 transition-all flex items-center justify-center">
              How it works
            </a>
          </div>
          <p className="mt-4 text-sm text-text-primary/50">No account needed to try · Free forever plan</p>
        </div>

        <div className="relative animate-fadeIn">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-purple/20">
            <p className="text-center text-sm font-medium text-text-primary/60 mb-2">A sample Destiny Matrix</p>
            <DestinyMatrixChart result={SAMPLE_RESULT} />
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg border border-gold/30 px-5 py-2 text-sm font-medium text-text-primary whitespace-nowrap">
            Tap any node on your own chart for its meaning
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-16">
        <a href="#how" className="text-text-primary/40 hover:text-text-primary/70 transition-colors" aria-label="Scroll down">
          <ChevronDown className="w-8 h-8 animate-bounce" />
        </a>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: '1', title: 'Enter your birth date', text: 'Just day, month, and year. Your chart is computed instantly from classical 22-arcana numerology.' },
    { n: '2', title: 'Explore your matrix', text: 'Tap any node to read its full interpretation — personality, love, money, karmic lessons, and affirmations.' },
    { n: '3', title: 'Save & share', text: 'Create a free account to save unlimited charts, generate shareable links, and unlock AI-powered deep readings.' },
  ];

  return (
    <section id="how" className="py-20 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary mb-4">How it works</h2>
          <p className="text-text-primary/60 max-w-2xl mx-auto">
            The Destiny Matrix method reduces your birth date to the 22 Major Arcana and maps them
            onto a sacred geometric chart — an ancient system for understanding your life's themes.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s) => (
            <div key={s.n} className="bg-white/80 rounded-2xl p-8 border border-gold/20 shadow-sm hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center text-white font-bold text-lg mb-5">
                {s.n}
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">{s.title}</h3>
              <p className="text-text-primary/60">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Demo() {
  const { user } = useAuth();
  const [matrixResult, setMatrixResult] = useState<DestinyMatrixResult | null>(null);
  const [personName, setPersonName] = useState('');
  const [selectedArcana, setSelectedArcana] = useState<SelectedArcana | null>(null);

  const handleCalculate = (date: Date, name: string) => {
    setMatrixResult(calculateDestinyMatrix(date));
    setPersonName(name);
    setSelectedArcana(null);
  };

  const handleNodeClick = (position: string, arcanaId: number) => {
    setSelectedArcana({ position, arcana: getArcana(arcanaId) });
  };

  return (
    <section id="demo" className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary mb-4">Try it right now — free</h2>
          <p className="text-text-primary/60">No account, no email. Your birth date never leaves your browser in this demo.</p>
        </div>

        {!matrixResult ? (
          <ChartCalculator onCalculate={handleCalculate} />
        ) : (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-serif font-semibold text-text-primary">
                {personName}'s Destiny Matrix
              </h3>
              <p className="text-text-primary/60 text-sm mt-1">Tap any number to reveal its meaning</p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border border-purple/20">
              <DestinyMatrixChart
                result={matrixResult}
                onNodeClick={(position, arcana) => handleNodeClick(position, arcana.id)}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: Heart, label: 'Love line', value: `${matrixResult.loveLine.left} → ${matrixResult.loveLine.center} → ${matrixResult.loveLine.right}`, bg: 'bg-purple/10', color: 'text-purple' },
                { icon: Coins, label: 'Money line', value: `${matrixResult.moneyLine.left} → ${matrixResult.moneyLine.center} → ${matrixResult.moneyLine.right}`, bg: 'bg-gold/10', color: 'text-gold' },
                { icon: Compass, label: 'Life path', value: `${matrixResult.lifePath.left} → ${matrixResult.lifePath.center} → ${matrixResult.lifePath.right}`, bg: 'bg-purple/10', color: 'text-purple' },
              ].map((l) => (
                <div key={l.label} className="bg-white/80 rounded-xl p-4 border border-gold/20 text-center">
                  <div className={`w-10 h-10 ${l.bg} rounded-full flex items-center justify-center mx-auto mb-2`}>
                    <l.icon className={`w-5 h-5 ${l.color}`} />
                  </div>
                  <p className="text-sm font-medium text-text-primary/60">{l.label}</p>
                  <p className="font-semibold text-text-primary">{l.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-gold/10 to-purple/10 border border-gold/30 rounded-2xl p-8 text-center">
              <h4 className="text-xl font-serif font-semibold text-text-primary mb-2">Love what you see?</h4>
              <p className="text-text-primary/60 mb-5">
                {user
                  ? 'Head to your chart page to save this reading to your collection.'
                  : 'Create a free account to save this chart, share it with a link, and unlock AI deep readings.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setMatrixResult(null)}
                  className="px-6 py-3 bg-white/80 border border-gold/30 text-text-primary font-medium rounded-xl hover:border-gold/60 transition-all"
                >
                  Calculate another
                </button>
                <Link
                  to={user ? '/chart' : '/auth'}
                  className="px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {user ? 'Open chart studio' : 'Save my chart — free'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <ArcanaModal selected={selectedArcana} onClose={() => setSelectedArcana(null)} />
    </section>
  );
}

function Features() {
  const features = [
    { icon: Sparkles, title: 'Interactive Destiny Matrix', text: 'A beautiful SVG chart with 16 positions, tap any node for its full arcana interpretation.' },
    { icon: Heart, title: 'Love, Money & Life Path lines', text: 'Dedicated lines decode your relationship patterns, financial energy, and soul direction.' },
    { icon: BrainCircuit, title: 'AI deep readings', text: 'Premium members get personalized AI interpretations woven from your full chart (free tier: 5/month).' },
    { icon: Share2, title: 'Shareable chart links', text: 'Generate a magic link for any chart and share your cosmic blueprint with friends.' },
  ];

  return (
    <section id="features" className="py-20 bg-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary mb-4">Everything in one cosmic toolkit</h2>
          <p className="text-text-primary/60 max-w-2xl mx-auto">More than a calculator — a personal library of your charts, readings, and insights.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white/80 rounded-2xl p-6 border border-gold/20 hover:border-gold/50 hover:shadow-lg transition-all">
              <div className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{f.title}</h3>
              <p className="text-sm text-text-primary/60">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-text-primary mb-4">Simple pricing</h2>
          <p className="text-text-primary/60">Start free. Go deeper when you're ready.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-white/80 rounded-2xl p-8 border border-gold/20">
            <h3 className="text-xl font-semibold text-text-primary mb-1">Starseed</h3>
            <p className="text-text-primary/60 text-sm mb-4">For the curious</p>
            <p className="text-4xl font-serif font-bold text-text-primary mb-6">Free</p>
            <ul className="space-y-3 text-sm text-text-primary/70 mb-8">
              {['Unlimited chart calculations', 'Full 22-arcana interpretations', 'Save charts to your library', '5 AI deep readings / month', 'Shareable chart links'].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-gold mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/auth" className="block text-center px-6 py-3 bg-white/80 border border-gold/40 text-text-primary font-medium rounded-xl hover:border-gold transition-all">
              Start free
            </Link>
          </div>
          <div className="bg-gradient-to-br from-gold/15 to-purple/15 rounded-2xl p-8 border-2 border-gold/50 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold to-purple text-white text-xs font-semibold px-4 py-1 rounded-full">
              MOST POPULAR
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-1">Cosmic</h3>
            <p className="text-text-primary/60 text-sm mb-4">For the devoted</p>
            <p className="text-4xl font-serif font-bold text-text-primary mb-6">$9<span className="text-lg font-normal text-text-primary/60">/month</span></p>
            <ul className="space-y-3 text-sm text-text-primary/70 mb-8">
              {['Everything in Starseed', 'Unlimited AI deep readings', 'Priority new features', 'Ad-free experience', 'Support indie astrology'].map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Star className="w-4 h-4 text-gold mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link to="/pricing" className="block text-center px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all">
              Go Cosmic
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white/70 border-t border-gold/20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-serif font-semibold text-text-primary">Gaia Vesta</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-primary/60">
            <Link to="/auth" className="hover:text-text-primary transition-colors">Sign in</Link>
            <Link to="/pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
            <a href="#demo" className="hover:text-text-primary transition-colors">Free demo</a>
          </div>
        </div>
        <p className="text-center text-xs text-text-primary/40 mt-8 max-w-2xl mx-auto">
          Gaia Vesta is a tool for self-reflection and entertainment based on numerological and tarot traditions.
          It is not a substitute for professional advice of any kind.
        </p>
      </div>
    </footer>
  );
}

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef7ed] to-[#f3e8ff] text-text-primary">
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Demo />
        <Features />
        <Pricing />
      </main>
      <Footer />
    </div>
  );
}
