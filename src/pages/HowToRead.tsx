import { Link } from 'react-router-dom';
import { ArrowRight, MousePointerClick } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { articleSchema, faqPageSchema, toolBreadcrumb } from '../lib/schema';
import { SalesCTA } from '../components/SalesCTA';

const STEPS = [
  {
    title: '1. Start with your three birth numbers',
    body: 'Every Destiny Matrix begins with your birth date. Your day of birth becomes the top point of the chart — your personality, the face you show the world. Your birth month sits on the right — your creative energy and spiritual path. Your birth year, reduced to a single arcana, anchors the bottom — the material foundation you are building on. Each number is reduced to the 1–22 range of the Major Arcana: if a number is above 22, its digits are added together (29 becomes 2 + 9 = 11).',
  },
  {
    title: '2. Read the centre — your comfort zone',
    body: 'The arcana in the very centre of the matrix is the sum of your three birth points. This is your soul\u2019s comfort zone: the energy you return to when life gets hard, the quality that recharges you, and the talent so natural you probably underestimate it. When people say a chart "feels accurate", it is usually this point they are recognising.',
  },
  {
    title: '3. Find the fourth point — your karmic foundation',
    body: 'The left point of the chart completes the diamond. It is calculated from the other three and describes inherited patterns — the strengths and unfinished lessons carried into this life. Together the four outer points and the centre form the skeleton of the whole reading; everything else in the matrix is built from them.',
  },
  {
    title: '4. Follow the love line and the money line',
    body: 'Two diagonals cross the centre. The love line runs from your personality point through the centre to your foundation point: it shows how you bond, what you need from a partner, and the pattern your relationships repeat until you see it. The money line runs from your month point through the centre to the karmic point: it shows how money energy enters your life, where it leaks, and which work aligns with your nature instead of fighting it.',
  },
  {
    title: '5. Read the inner points and the life-stage purposes',
    body: 'The inner square and mid-points refine the picture: talents, health and chakra energy, family patterns, and your purpose in each season of life — the purpose of your twenties is not the purpose of your forties, and the matrix shows both. On Gaia Vesta every point is tappable: click any node on your chart and its full interpretation opens — meaning, strengths, challenges and an affirmation.',
  },
];

const FAQS = [
  {
    q: 'What is the Destiny Matrix?',
    a: 'The Destiny Matrix (also called the Matrix of Destiny) is a numerology system that maps your birth date onto the 22 Major Arcana of the Tarot. The resulting diamond-shaped chart is read as a map of personality, purpose, love, money and karmic lessons. It became popular through Eastern European numerology schools and is now calculated by millions of people online.',
  },
  {
    q: 'How is a Destiny Matrix calculated?',
    a: 'Take your birth day, month and year. Reduce each to a number between 1 and 22 by adding digits when needed. Those three numbers become three points of the diamond; the fourth point and the centre are their sums, and every remaining point is derived the same way — the whole chart unfolds from your birth date alone.',
  },
  {
    q: 'Can I read my Destiny Matrix for free?',
    a: 'Yes. On Gaia Vesta the full calculator, every point interpretation, the compatibility matrix, the chart image export and 5 AI deep readings a month are all free. Most other sites paywall the interpretations — here they are included.',
  },
  {
    q: 'What is the most important point in the chart?',
    a: 'The centre. It is your comfort zone and core talent, and both the love line and the money line pass through it — which is why two people with the same outer points can live very different charts.',
  },
];

export function HowToRead() {
  return (
    <PublicLayout>
      <ToolHero
        eyebrow="Guide · Start here"
        title="How to Read Your Destiny Matrix Chart"
        subtitle="Your chart looks like a constellation of numbers — but it reads in a clear order. This guide walks you through it, point by point, the same way a practitioner would."
        schema={[articleSchema('How to Read Your Destiny Matrix Chart', '/tools/how-to-read-destiny-matrix', "Your chart looks like a constellation of numbers — but it reads in a clear order. This guide walks you through it, point by point, the same way a practitioner would."), faqPageSchema(FAQS), toolBreadcrumb('How to Read Your Destiny Matrix Chart', '/tools/how-to-read-destiny-matrix')]}
      />

      <div className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="absolute -inset-4 bg-gold/15 rounded-[2.25rem] blur-2xl pointer-events-none" />
        <div className="relative rounded-[1.75rem] overflow-hidden border border-goldlight/30 shadow-[0_30px_70px_-25px_rgba(231,200,115,0.4)]">
          <img
            src="/images/how-to-read-illustration.webp"
            alt="An unrolled parchment scroll bearing a golden geometric chart of lines and glowing nodes, beside a candle"
            loading="lazy"
            decoding="async"
            className="w-full h-auto block"
          />
        </div>
      </div>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white/[0.04] border border-goldlight/30 rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-center gap-4">
          <MousePointerClick className="w-8 h-8 text-goldlight shrink-0" />
          <p className="text-lav/85 leading-relaxed">
            <span className="font-semibold text-cream">No chart yet?</span> Generate yours first —
            it takes ten seconds and it is free — then come back and read it with this guide.
          </p>
          <Link
            to="/#demo"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all"
          >
            My free chart <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-6">
          {STEPS.map((s) => (
            <div key={s.title} className="bg-white/80 rounded-2xl border border-purple/15 p-7 text-text-primary">
              <h2 className="font-serif font-semibold text-xl mb-3">{s.title}</h2>
              <p className="text-text-primary/75 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">Common questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
                <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
                <p className="text-lav/80 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-lavdim mt-10">
          Want the meaning of a specific number? Browse the{' '}
          <Link to="/arcana" className="text-goldlight font-medium hover:underline">Arcana Encyclopedia</Link>{' '}
          — all 22 Major Arcana, decoded.
        </p>

        <SalesCTA
          headline="Reading the map is step one. Hearing your story is step two."
          context="You now know where everything sits in your chart. The AI deep reading connects it — your love line, money line and karmic pattern in one personal narrative, with your year ahead."
        />
      </section>
    </PublicLayout>
  );
}
