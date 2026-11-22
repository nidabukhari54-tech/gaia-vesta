import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

/** Shared header + footer for the public tools and guide pages. */
export function PublicLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-night text-lav flex flex-col relative overflow-x-clip">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(60rem_30rem_at_85%_-5%,rgba(124,92,191,0.28),transparent),radial-gradient(50rem_26rem_at_-10%_30%,rgba(212,165,116,0.10),transparent),radial-gradient(46rem_24rem_at_50%_110%,rgba(124,92,191,0.16),transparent)]" />
      <header className="sticky top-0 z-40 bg-night/85 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[radial-gradient(circle_at_35%_35%,#F6E3AC,#C9963C)] flex items-center justify-center shadow-[0_0_18px_rgba(231,200,115,0.45)]">
                <Sparkles className="w-4 h-4 text-night3" />
              </div>
              <span className="leading-none">
                <span className="block text-lg font-serif font-semibold tracking-wide text-cream">GAIA VESTA</span>
                <span className="block text-[9px] tracking-[0.3em] text-lavdim mt-0.5">DESTINY MATRIX</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-7">
              <Link to="/tools" className="text-sm font-medium text-lav hover:text-cream transition-colors">Tools</Link>
              <Link to="/tools/compatibility" className="text-sm font-medium text-lav hover:text-cream transition-colors">Compatibility</Link>
              <Link to="/arcana" className="text-sm font-medium text-lav hover:text-cream transition-colors">Arcana Guide</Link>
              <Link to="/pricing" className="text-sm font-medium text-lav hover:text-cream transition-colors">Pricing</Link>
            </nav>

            <Link
              to={user ? '/dashboard' : '/auth'}
              className="px-5 py-2.5 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 text-sm font-semibold rounded-full hover:shadow-[0_0_24px_rgba(231,200,115,0.45)] transition-all"
            >
              {user ? 'Dashboard' : 'Get started free'}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">{children}</main>

      <footer className="border-t border-white/10 py-10 mt-4 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[radial-gradient(circle_at_35%_35%,#F6E3AC,#C9963C)] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-night3" />
              </div>
              <span className="leading-none">
                <span className="block font-serif font-semibold tracking-wide text-cream">GAIA VESTA</span>
                <span className="block text-[8px] tracking-[0.3em] text-lavdim mt-0.5">DESTINY MATRIX</span>
              </span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-5 text-sm text-lav/80">
              <Link to="/tools" className="hover:text-cream transition-colors">All tools</Link>
              <Link to="/tools/compatibility" className="hover:text-cream transition-colors">Compatibility</Link>
              <Link to="/tools/year-forecast" className="hover:text-cream transition-colors">Year forecast</Link>
              <Link to="/arcana" className="hover:text-cream transition-colors">Arcana guide</Link>
              <Link to="/pricing" className="hover:text-cream transition-colors">Pricing</Link>
            </div>
          </div>
          <p className="text-center text-xs text-lavdim mt-7 max-w-2xl mx-auto">
            Gaia Vesta is a tool for self-reflection and entertainment based on numerological and tarot traditions.
            It is not a substitute for professional advice of any kind.
          </p>
        </div>
      </footer>
    </div>
  );
}

/** Page hero band used at the top of each tool page. */
export function ToolHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  useEffect(() => {
    document.title = `${title} | Gaia Vesta`;
  }, [title]);

  return (
    <section className="pt-14 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-3">{eyebrow}</p>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-cream mb-4">{title}</h1>
        <p className="text-lav/80 max-w-2xl mx-auto">{subtitle}</p>
      </div>
    </section>
  );
}
