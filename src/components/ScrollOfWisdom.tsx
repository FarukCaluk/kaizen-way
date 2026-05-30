import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────
type QuoteCategory = "kaizen" | "samurai" | "athlete" | "stoic" | "tao";

interface Quote {
  id:       string;
  text:     string;
  author:   string;
  source?:  string;
  category: QuoteCategory;
}

const QUOTES: Quote[] = [
  {
    id: "musashi-1",
    text: "Step by step walk the thousand-mile road.",
    author: "Miyamoto Musashi",
    source: "The Book of Five Rings",
    category: "samurai",
  },
  {
    id: "musashi-2",
    text: "Today is victory over yourself of yesterday; tomorrow is your victory over lesser men.",
    author: "Miyamoto Musashi",
    source: "The Book of Five Rings",
    category: "samurai",
  },
  {
    id: "musashi-3",
    text: "It may seem difficult at first, but everything is difficult at first.",
    author: "Miyamoto Musashi",
    source: "The Book of Five Rings",
    category: "samurai",
  },
  {
    id: "musashi-4",
    text: "Think lightly of yourself and deeply of the world.",
    author: "Miyamoto Musashi",
    source: "Dokkōdō",
    category: "samurai",
  },
  {
    id: "hagakure-1",
    text: "One should be able to improve throughout his entire life. The moment you stop improving is the moment you begin to decay.",
    author: "Yamamoto Tsunetomo",
    source: "Hagakure",
    category: "samurai",
  },
  {
    id: "hagakure-2",
    text: "Matters of great concern should be treated lightly. Matters of small concern should be treated seriously.",
    author: "Yamamoto Tsunetomo",
    source: "Hagakure",
    category: "samurai",
  },
  {
    id: "kobe-1",
    text: "Those times when you get up early and you work hard; those times when you stay up late and you work hard — that is actually the dream.",
    author: "Kobe Bryant",
    category: "athlete",
  },
  {
    id: "kobe-2",
    text: "The most important thing is to try and inspire people so that they can be great in whatever they want to do.",
    author: "Kobe Bryant",
    category: "athlete",
  },
  {
    id: "bruce-lee-1",
    text: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.",
    author: "Bruce Lee",
    category: "athlete",
  },
  {
    id: "bruce-lee-2",
    text: "Absorb what is useful, discard what is useless, and add what is specifically your own.",
    author: "Bruce Lee",
    category: "athlete",
  },
  {
    id: "bruce-lee-3",
    text: "Long-term consistency trumps short-term intensity.",
    author: "Bruce Lee",
    category: "athlete",
  },
  {
    id: "goggins-1",
    text: "In situations where you are suffering, discipline is the only thing that pulls you through.",
    author: "David Goggins",
    source: "Can't Hurt Me",
    category: "athlete",
  },
  {
    id: "goggins-2",
    text: "You are in danger of living a life so comfortable and soft that you will die without ever realizing your true potential.",
    author: "David Goggins",
    source: "Can't Hurt Me",
    category: "athlete",
  },
  {
    id: "lao-1",
    text: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
    source: "Tao Te Ching",
    category: "tao",
  },
  {
    id: "lao-2",
    text: "To the mind that is still, the whole universe surrenders.",
    author: "Lao Tzu",
    source: "Tao Te Ching",
    category: "tao",
  },
  {
    id: "lao-3",
    text: "Nature does not hurry, yet everything is accomplished.",
    author: "Lao Tzu",
    source: "Tao Te Ching",
    category: "tao",
  },
  {
    id: "krishnamurti-1",
    text: "It is a daily discipline, not a goal to be achieved.",
    author: "Jiddu Krishnamurti",
    category: "kaizen",
  },
  {
    id: "marcus-1",
    text: "You have power over your mind, not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
    source: "Meditations",
    category: "stoic",
  },
  {
    id: "marcus-2",
    text: "Waste no more time arguing about what a good man should be. Be one.",
    author: "Marcus Aurelius",
    source: "Meditations",
    category: "stoic",
  },
  {
    id: "marcus-3",
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius",
    source: "Meditations",
    category: "stoic",
  },
  {
    id: "epictetus-1",
    text: "We are not disturbed by what happens to us, but by our thoughts about what happens to us.",
    author: "Epictetus",
    source: "Enchiridion",
    category: "stoic",
  },
  {
    id: "james-1",
    text: "Act as if what you do makes a difference. It does.",
    author: "William James",
    category: "kaizen",
  },
  {
    id: "jordan-1",
    text: "I've missed more than 9,000 shots. I've lost almost 300 games. 26 times I've been trusted to take the game-winning shot and missed. I've failed over and over again in my life. And that is why I succeed.",
    author: "Michael Jordan",
    category: "athlete",
  },
  {
    id: "seneca-1",
    text: "It is not that I am so smart; it's just that I stay with problems longer.",
    author: "Albert Einstein",
    category: "kaizen",
  },
  {
    id: "kaizen-1",
    text: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
    category: "kaizen",
  },
  {
    id: "sun-tzu-1",
    text: "Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.",
    author: "Sun Tzu",
    source: "The Art of War",
    category: "samurai",
  },
  {
    id: "sun-tzu-2",
    text: "Supreme excellence consists in breaking the enemy's resistance without fighting.",
    author: "Sun Tzu",
    source: "The Art of War",
    category: "samurai",
  },
  {
    id: "inazo-1",
    text: "The end of all education should surely be service to others. We cannot seek achievement for ourselves and forget about progress and prosperity for our community.",
    author: "Nitobe Inazō",
    source: "Bushido: The Soul of Japan",
    category: "samurai",
  },
];

// ─── Category meta ────────────────────────────────────────────────────────────
const CATEGORY_LABEL: Record<QuoteCategory, { kanji: string; en: string; color: string }> = {
  kaizen:  { kanji: "改善", en: "Kaizen",   color: "#D4AF37" },
  samurai: { kanji: "武士", en: "Bushidō",  color: "#BC002D" },
  athlete: { kanji: "鍛錬", en: "Tanren",   color: "#6EA8D4" },
  stoic:   { kanji: "静心", en: "Stoicism", color: "#8C7A9E" },
  tao:     { kanji: "道",   en: "Tao",      color: "#4DA88F" },
};

// ─── Random non-repeat selector ───────────────────────────────────────────────
function nextQuote(currentId: string): Quote {
  const pool = QUOTES.filter((q) => q.id !== currentId);
  const pick = pool[Math.floor(Math.random() * pool.length)];
  return pick ?? (QUOTES[0] as Quote);
}

// ─── Ink wash transition variants ────────────────────────────────────────────
const inkExit = {
  opacity:    0,
  scale:      0.965,
  filter:     "blur(7px) brightness(0.4)",
  y:          -6,
  transition: { duration: 0.38, ease: [0.4, 0, 1, 1] },
};
const inkEnter = {
  initial:    { opacity: 0, scale: 1.025, filter: "blur(7px) brightness(0.4)", y: 6 },
  animate:    { opacity: 1, scale: 1,     filter: "blur(0px) brightness(1)",   y: 0 },
  transition: { duration: 0.52, ease: [0, 0, 0.2, 1] },
};

// ─── Scroll counter ───────────────────────────────────────────────────────────
let drawCount = 0;

// ─── Component ────────────────────────────────────────────────────────────────
export default function ScrollOfWisdom() {
  const [quote, setQuote]     = useState<Quote>(() => QUOTES[Math.floor(Math.random() * QUOTES.length)] ?? QUOTES[0]!);
  const [count, setCount]     = useState(1);
  const [transitioning, setTransitioning] = useState(false);

  const draw = useCallback(() => {
    if (transitioning) return;
    setTransitioning(true);
    // slight delay so exit animation is visible
    setTimeout(() => {
      setQuote((prev) => nextQuote(prev.id));
      drawCount++;
      setCount((c) => c + 1);
      setTransitioning(false);
    }, 400);
  }, [transitioning]);

  const meta  = CATEGORY_LABEL[quote.category];
  const index = (count % QUOTES.length) || QUOTES.length;

  return (
    <div
      className="relative w-full min-h-screen bg-[#0B0B0C] flex flex-col
                 items-center justify-center px-5 md:px-10 py-24 overflow-hidden
                 cursor-pointer select-none"
      onClick={draw}
      role="main"
      aria-label="Scroll of Wisdom — click to draw next scroll"
    >
      {/* Ambient background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 65% at 50% 48%, rgba(20,16,10,0) 20%, #0B0B0C 100%)",
        }}
        aria-hidden
      />

      {/* Ink wash overlay — flashes on transition */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            style={{ background: "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.9) 0%, #0B0B0C 100%)" }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-2 mb-16"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[9px] tracking-[0.45em] uppercase font-mono text-[#D4AF37]/48">
          知恵の巻物 · Scroll of Wisdom
        </p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.3))" }} aria-hidden />
          <span className="text-[9px] font-mono text-[#f2f2f2]/18 tracking-[0.25em]">
            Scroll {String(index).padStart(2, "0")} of ∞
          </span>
          <div className="w-8 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(212,175,55,0.3))" }} aria-hidden />
        </div>
      </motion.div>

      {/* ── Quote block ───────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={quote.id}
            exit={inkExit}
            initial={inkEnter.initial}
            animate={inkEnter.animate}
            transition={inkEnter.transition}
            className="w-full flex flex-col items-center gap-8"
          >
            {/* Category tag */}
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full"
              style={{
                background: `rgba(${meta.color === "#D4AF37" ? "212,175,55" : meta.color === "#BC002D" ? "188,0,45" : meta.color === "#6EA8D4" ? "110,168,212" : meta.color === "#8C7A9E" ? "140,122,158" : "77,168,143"}, 0.08)`,
                border:     `1px solid ${meta.color}22`,
              }}
            >
              <span className="text-[11px] font-heading" style={{ color: meta.color + "90" }}>
                {meta.kanji}
              </span>
              <span className="text-[9px] font-mono tracking-[0.25em] uppercase"
                style={{ color: meta.color + "55" }}>
                {meta.en}
              </span>
            </div>

            {/* Quote text */}
            <blockquote className="w-full flex flex-col items-center gap-7">
              {/* Decorative top bracket */}
              <svg width="32" height="16" viewBox="0 0 32 16" fill="none" aria-hidden>
                <path d="M 2,14 L 2,2 L 30,2" stroke="rgba(212,175,55,0.25)" strokeWidth="1.2"
                  strokeLinecap="round" fill="none" />
              </svg>

              <p
                className="font-heading text-center leading-[1.65] tracking-wide"
                style={{
                  fontSize:  quote.text.length > 120 ? "1.1rem" : quote.text.length > 80 ? "1.3rem" : "1.6rem",
                  color:     "rgba(242,242,242,0.88)",
                  textShadow:"0 0 60px rgba(212,175,55,0.06)",
                }}
              >
                "{quote.text}"
              </p>

              {/* Bottom bracket */}
              <svg width="32" height="16" viewBox="0 0 32 16" fill="none" aria-hidden>
                <path d="M 2,2 L 2,14 L 30,14" stroke="rgba(212,175,55,0.25)" strokeWidth="1.2"
                  strokeLinecap="round" fill="none" />
              </svg>

              {/* Divider */}
              <div
                className="w-6 h-px"
                style={{ background: "linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)" }}
                aria-hidden
              />

              {/* Attribution */}
              <div className="flex flex-col items-center gap-1.5">
                <cite
                  className="not-italic font-heading text-base"
                  style={{ color: "rgba(242,242,242,0.55)" }}
                >
                  — {quote.author}
                </cite>
                {quote.source && (
                  <span className="text-[10px] font-mono tracking-[0.28em] uppercase"
                    style={{ color: "rgba(212,175,55,0.38)" }}>
                    {quote.source}
                  </span>
                )}
              </div>
            </blockquote>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Draw button ───────────────────────────────────────────────── */}
      <motion.div
        className="relative z-10 mt-20 flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          onClick={draw}
          disabled={transitioning}
          className="flex items-center gap-3 px-7 py-3 rounded-xl font-mono text-xs
                     tracking-[0.3em] uppercase outline-none
                     focus-visible:ring-2 focus-visible:ring-[#D4AF37]/35
                     disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background:          "rgba(212,175,55,0.07)",
            border:              "1px solid rgba(212,175,55,0.2)",
            color:               "rgba(212,175,55,0.75)",
            backdropFilter:      "blur(12px)",
            WebkitBackdropFilter:"blur(12px)",
          }}
          whileHover={{ scale: 1.04, backgroundColor: "rgba(212,175,55,0.12)" }}
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          {/* Scroll icon */}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
            <rect x="2" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1" opacity="0.7" />
            <line x1="4" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="0.8" />
            <line x1="4" y1="7" x2="10" y2="7" stroke="currentColor" strokeWidth="0.8" />
            <line x1="4" y1="9" x2="8"  y2="9" stroke="currentColor" strokeWidth="0.8" />
          </svg>
          Draw Next Scroll
          <span className="text-[#D4AF37]/35">→</span>
        </motion.button>

        <p className="text-[9px] font-mono text-[#f2f2f2]/15 tracking-[0.25em]">
          or click anywhere
        </p>
      </motion.div>

      {/* ── Corner ink accents ─────────────────────────────────────────── */}
      <div className="absolute top-8 left-8 pointer-events-none opacity-30" aria-hidden>
        <svg width="28" height="28" viewBox="0 0 28 28">
          <path d="M 2,26 L 2,2 L 26,2" stroke="rgba(212,175,55,0.4)" strokeWidth="1"
            fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute top-8 right-8 pointer-events-none opacity-30" aria-hidden>
        <svg width="28" height="28" viewBox="0 0 28 28">
          <path d="M 26,26 L 26,2 L 2,2" stroke="rgba(212,175,55,0.4)" strokeWidth="1"
            fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-20 left-8 pointer-events-none opacity-30" aria-hidden>
        <svg width="28" height="28" viewBox="0 0 28 28">
          <path d="M 2,2 L 2,26 L 26,26" stroke="rgba(212,175,55,0.4)" strokeWidth="1"
            fill="none" strokeLinecap="round" />
        </svg>
      </div>
      <div className="absolute bottom-20 right-8 pointer-events-none opacity-30" aria-hidden>
        <svg width="28" height="28" viewBox="0 0 28 28">
          <path d="M 26,2 L 26,26 L 2,26" stroke="rgba(212,175,55,0.4)" strokeWidth="1"
            fill="none" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
