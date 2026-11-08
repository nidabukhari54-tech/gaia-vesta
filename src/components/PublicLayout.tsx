import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

/** Shared header + footer for the public tools and guide pages. */
export function PublicLayout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fef7ed] to-[#f3e8ff] text-text-primary flex flex-col">
      <header className="sticky top-0 z-40 bg-[#fef7ed]/85 backdrop-blur-md border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-serif font-semibold">Gaia Vesta</span>
            </Link>

            <nav className="hidden md:flex items-center gap-7">
              <Link to="/tools" className="text-sm font-medium text-text-primary/70 hover:text-text-primary transition-colors">Tools</Link>
              <Link to="/tools/compatibility" className="text-sm font-medium text-text-primary/70 hover:text-text-primary transition-colors">Compatibility</Link>
              <Link to="/arcana" className="text-sm font-medium text-text-primary/70 hover:text-text-primary transition-colors">Arcana Guide</Link>
              <Link to="/pricing" className="text-sm font-medium text-text-primary/70 hover:text-text-primary transition-colors">Pricing</Link>
            </nav>

            <Link
              to={user ? '/dashboard' : '/auth'}
              className="px-5 py-2.5 bg-gradient-to-r from-gold to-purple text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
            >
              {user ? 'Dashboard' : 'Get started free'}
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white/70 border-t border-gold/20 py-10 mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-serif font-semibold">Gaia Vesta</span>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-5 text-sm text-text-primary/60">
              <Link to="/tools" className="hover:text-text-primary transition-colors">All tools</Link>
              <Link to="/tools/compatibility" className="hover:text-text-primary transition-colors">Compatibility</Link>
              <Link to="/tools/year-forecast" className="hover:text-text-primary transition-colors">Year forecast</Link>
              <Link to="/arcana" className="hover:text-text-primary transition-colors">Arcana guide</Link>
              <Link to="/pricing" className="hover:text-text-primary transition-colors">Pricing</Link>
            </div>
          </div>
          <p className="text-center text-xs text-text-primary/40 mt-7 max-w-2xl mx-auto">
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
  return (
    <section className="pt-14 pb-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-purple mb-3">{eyebrow}</p>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold mb-4">{title}</h1>
        <p className="text-text-primary/65 max-w-2xl mx-auto">{subtitle}</p>
      </div>
    </section>
  );
}
