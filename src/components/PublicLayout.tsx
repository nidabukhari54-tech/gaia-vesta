import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { JsonLd } from './JsonLd';

/** Shared header + footer for the public tools and guide pages. */
export function PublicLayout({
  children,
  schema,
}: {
  children: ReactNode;
  schema?: object | object[];
}) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-night text-lav flex flex-col relative overflow-x-clip">
      {schema ? <JsonLd data={schema} /> : null}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(60rem_30rem_at_85%_-5%,rgba(124,92,191,0.28),transparent),radial-gradient(50rem_26rem_at_-10%_30%,rgba(212,165,116,0.10),transparent),radial-gradient(46rem_24rem_at_50%_110%,rgba(124,92,191,0.16),transparent)]" />
      <header className="sticky top-0 z-40 bg-night/85 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <img src="/favicon-512.png" alt="Gaia Vesta" className="w-9 h-9 rounded-full ring-1 ring-goldlight/50 shadow-[0_0_18px_rgba(231,200,115,0.35)]" />
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
              <img src="/favicon-512.png" alt="Gaia Vesta" className="w-8 h-8 rounded-full ring-1 ring-goldlight/50 shadow-[0_0_18px_rgba(231,200,115,0.35)]" />
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

/** Decorative 8-point matrix star — the Gaia Vesta mark, drawn as fine gold lines. */
function MatrixStar({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="1.6">
        <rect x="24" y="24" width="52" height="52" />
        <rect x="24" y="24" width="52" height="52" transform="rotate(45 50 50)" />
        <circle cx="50" cy="50" r="7" />
        <circle cx="50" cy="24" r="3.4" />
        <circle cx="50" cy="76" r="3.4" />
        <circle cx="24" cy="50" r="3.4" />
        <circle cx="76" cy="50" r="3.4" />
        <circle cx="31.6" cy="31.6" r="3.4" />
        <circle cx="68.4" cy="31.6" r="3.4" />
        <circle cx="31.6" cy="68.4" r="3.4" />
        <circle cx="68.4" cy="68.4" r="3.4" />
      </g>
      <circle cx="50" cy="50" r="3" fill="currentColor" />
    </svg>
  );
}

/**
 * Page hero band used at the top of each tool page.
 * With an `image`, it renders a homepage-style scene hero: art band on the
 * right melting into the night, gold glow, breathing motion. Without one, a
 * dignified text-only variant with the matrix-star motif.
 */
export function ToolHero({
  eyebrow,
  title,
  subtitle,
  schema,
  image,
  imageAlt,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  schema?: object | object[];
  image?: string;
  imageAlt?: string;
}) {
  useEffect(() => {
    document.title = `${title} | Gaia Vesta`;
  }, [title]);

  const eyebrowChip = eyebrow ? (
    <p className="inline-flex items-center gap-2 rounded-full border border-goldlight/40 bg-gold/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.18em] uppercase text-goldlight shadow-[0_0_18px_rgba(231,200,115,0.18)]">
      {eyebrow}
    </p>
  ) : null;

  const goldRule = (
    <div
      aria-hidden="true"
      className="h-[2px] w-24 rounded-full bg-gradient-to-r from-goldlight via-gold to-transparent"
    />
  );

  return (
    <section className="pt-12 sm:pt-16 pb-14 relative overflow-hidden">
      {schema ? <JsonLd data={schema} /> : null}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[46rem] h-[20rem] bg-gold/[0.19] rounded-full blur-3xl pointer-events-none" />

      {image ? (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="text-center lg:text-left flex flex-col items-center lg:items-start gap-5">
            {eyebrowChip}
            <h1 className="text-4xl sm:text-5xl xl:text-[3.4rem] font-serif font-bold text-cream leading-[1.08]">
              {title}
            </h1>
            <p className="text-lav/85 text-base sm:text-lg leading-relaxed max-w-xl">{subtitle}</p>
            {goldRule}
          </div>
          <div className="relative mx-auto w-full max-w-[540px]">
            <div className="absolute -inset-8 bg-gold/[0.22] rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -inset-2 bg-[radial-gradient(circle_at_70%_20%,rgba(124,92,191,0.35),transparent_65%)] rounded-full blur-2xl pointer-events-none" />
            <div className="relative animate-breathe">
              <img
                src={image}
                alt={imageAlt ?? ''}
                decoding="async"
                className="w-full h-auto max-h-[560px] object-cover [mask-image:radial-gradient(ellipse_88%_84%_at_50%_46%,black_56%,transparent_98%)]"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative flex flex-col items-center gap-5">
          <MatrixStar className="w-14 h-14 text-goldlight/80 drop-shadow-[0_0_14px_rgba(231,200,115,0.45)]" />
          {eyebrowChip}
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-cream leading-[1.12]">{title}</h1>
          <p className="text-lav/80 max-w-2xl mx-auto">{subtitle}</p>
          {goldRule}
        </div>
      )}

      {/* Slim gold ribbon echoing the homepage marquee divider */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 pointer-events-none">
        <div className="h-[10px] bg-goldlight/15 blur-md" />
        <div className="h-[2px] bg-gradient-to-r from-transparent via-goldlight/75 to-transparent" />
      </div>
    </section>
  );
}
