import { useEffect, useState } from 'react';

const SPOTS = [
  { x: 0.02, y: 0.7 },
  { x: 0.87, y: 0.52 },
  { x: 0.8, y: 0.09 },
  { x: 0.03, y: 0.28 },
  { x: 0.44, y: 0.8 },
  { x: 0.9, y: 0.3 },
];

export default function RoamingGaia() {
  const [idx, setIdx] = useState(0);
  const [size, setSize] = useState({ w: 1280, h: 800 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const t = window.setInterval(() => setIdx((i) => (i + 1) % SPOTS.length), 7000);
    return () => window.clearInterval(t);
  }, [reduced]);

  const sprite = size.w < 640 ? 92 : 128;
  const spot = SPOTS[idx];
  const x = Math.max(4, Math.min(spot.x * size.w, size.w - sprite - 4));
  const y = Math.max(76, Math.min(spot.y * size.h, size.h - sprite * 1.25 - 8));

  return (
    <button
      onClick={() => window.dispatchEvent(new Event('gaia:open-chat'))}
      aria-label="Gaia — tap to chat with her"
      className="fixed left-0 top-0 z-40 cursor-pointer"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        transition: reduced ? undefined : 'transform 6.5s ease-in-out',
        width: sprite,
        height: sprite * 1.25,
      }}
    >
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[70%] bg-gold/25 rounded-full blur-2xl pointer-events-none" />
      <img
        src="/images/gaia-character.webp"
        alt="Gaia, your fairy guide"
        className="relative w-full h-full object-cover animate-breathe"
        style={{
          WebkitMaskImage: 'radial-gradient(ellipse 72% 62% at 50% 44%, black 55%, transparent 98%)',
          maskImage: 'radial-gradient(ellipse 72% 62% at 50% 44%, black 55%, transparent 98%)',
          filter: 'drop-shadow(0 0 16px rgba(231,200,115,0.45))',
        }}
        loading="lazy"
        decoding="async"
      />
    </button>
  );
}
