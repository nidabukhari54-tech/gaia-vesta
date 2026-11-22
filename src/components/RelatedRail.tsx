import { useRef, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

export type RailItem = {
  to: string;
  title: string;
  /** One-line essence shown under the title. */
  essence: string;
  /** Card art (families that have it). Falls back to the glyph treatment. */
  image?: string;
  imageAlt?: string;
  /** Big typographic mark (sign glyph, animal glyph, angel number…) when there is no art. */
  glyph?: ReactNode;
  /** Small gold label above the title (dates, element, phase…). */
  badge?: string;
};

/** First sentence of a longer text — for rail-card essences. */
export function firstSentence(text: string): string {
  const m = text.match(/^[^.!?]+[.!?]/);
  return (m ? m[0] : text).trim();
}

/**
 * "Keep exploring" rail — a snap-scrolling carousel of sibling pages, styled
 * after the homepage Arcana carousel, so detail pages end in a journey
 * instead of a dead end. Render it inside the page's own container; pass
 * prev/next for families that have a natural sequence.
 */
export function RelatedRail({
  title,
  items,
  prev,
  next,
  className = '',
}: {
  title: string;
  items: RailItem[];
  prev?: { to: string; label: string };
  next?: { to: string; label: string };
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({ left: dir * 330, behavior: 'smooth' });

  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-6 mb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-goldlight mb-2">
            Keep exploring
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream">{title}</h2>
        </div>
        <div className="hidden sm:flex gap-2.5 shrink-0">
          <button
            onClick={() => scroll(-1)}
            aria-label="Scroll back"
            className="w-11 h-11 rounded-full border border-white/20 text-cream flex items-center justify-center hover:border-goldlight/60 hover:text-goldlight transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label="Scroll forward"
            className="w-11 h-11 rounded-full border border-white/20 text-cream flex items-center justify-center hover:border-goldlight/60 hover:text-goldlight transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] max-w-full h-[16rem] bg-gold/[0.13] rounded-full blur-3xl pointer-events-none" />
        <div
          ref={trackRef}
          className="relative flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="snap-start shrink-0 w-[270px] sm:w-[300px] bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-[1.75rem] overflow-hidden hover:border-goldlight/60 hover:shadow-[0_24px_50px_-20px_rgba(231,200,115,0.45)] transition-all group flex flex-col"
            >
              {item.image ? (
                <div className="relative h-40 shrink-0 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.imageAlt ?? ''}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1A0C33] via-[#1A0C33]/40 to-transparent pointer-events-none" />
                </div>
              ) : (
                <div className="relative h-40 shrink-0 flex items-center justify-center overflow-hidden">
                  <div className="absolute w-44 h-44 bg-gold/[0.14] rounded-full blur-2xl pointer-events-none" />
                  <span className="relative font-serif text-6xl text-goldlight drop-shadow-[0_0_18px_rgba(231,200,115,0.45)] px-4 text-center leading-none">
                    {item.glyph}
                  </span>
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                {item.badge ? (
                  <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-goldlight/80 mb-1.5">
                    {item.badge}
                  </p>
                ) : null}
                <h3 className="font-serif text-xl text-cream mb-1.5 group-hover:text-goldlight transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-lav/75 leading-relaxed line-clamp-3">{item.essence}</p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-goldlight mt-auto pt-4">
                  Read more <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {prev || next ? (
        <div className="flex justify-between mt-6">
          {prev ? (
            <Link
              to={prev.to}
              className="inline-flex items-center gap-2 text-sm font-medium text-lav/80 hover:text-cream transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> {prev.label}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to={next.to}
              className="inline-flex items-center gap-2 text-sm font-medium text-lav/80 hover:text-cream transition-colors"
            >
              {next.label} <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      ) : null}
    </div>
  );
}
