import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────
type MotivationPhase = "idle" | "burning" | "spent";
type DisciplinePhase = "idle" | "drawing" | "anchored";

// ─── Particle geometry — fixed at module level, never recreated ───────────────
interface Drop {
  id:        number;
  angle:     number;   // degrees
  dist:      number;   // max travel px
  r:         number;   // radius px
  delay:     number;   // s
  wobble:    number;   // lateral drift px
}
interface Streak {
  id:        number;
  angle:     number;
  dist:      number;
  w:         number;   // width px
  h:         number;   // height px
  delay:     number;
}

const DROPS: Drop[] = Array.from({ length: 22 }, (_, i) => ({
  id:     i,
  angle:  (i * 360) / 22 + (i % 4) * 8,
  dist:   58 + (i % 6) * 16,
  r:      5  + (i % 5) * 3.2,
  delay:  i  * 0.018,
  wobble: (i % 3 - 1) * 12,
}));

const STREAKS: Streak[] = Array.from({ length: 10 }, (_, i) => ({
  id:    i,
  angle: (i * 36) + 15,
  dist:  72 + (i % 4) * 18,
  w:     2.5 + (i % 3),
  h:     14  + (i % 4) * 8,
  delay: 0.02 + i * 0.022,
}));

// ─── Gold SVG paths ───────────────────────────────────────────────────────────
const THREAD = "M 8,54 C 42,22 78,80 118,46 S 188,10 228,50 S 282,86 322,46 L 356,50";
const ANCHOR = "M 356,50 L 364,66 L 342,66 Z";

// ─── helpers ─────────────────────────────────────────────────────────────────
const rad = (deg: number) => (deg * Math.PI) / 180;

// ─── MotivationPanel ──────────────────────────────────────────────────────────
function MotivationPanel({
  phase,
  onClick,
}: {
  phase: MotivationPhase;
  onClick: () => void;
}) {
  const idle    = phase === "idle";
  const burning = phase === "burning";
  const spent   = phase === "spent";

  return (
    <motion.article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="relative overflow-hidden rounded-2xl cursor-pointer select-none
                 outline-none focus-visible:ring-2 focus-visible:ring-[#BC002D]/40"
      style={{
        background:          spent ? "rgba(8,6,6,0.88)" : "rgba(18,13,13,0.7)",
        border:              `1px solid ${spent ? "rgba(50,30,30,0.22)" : "rgba(188,0,45,0.24)"}`,
        backdropFilter:      "blur(18px)",
        WebkitBackdropFilter:"blur(18px)",
        transition:          "background 0.9s ease, border-color 0.7s ease",
      }}
      whileHover={idle ? { scale: 1.014 } : undefined}
      whileTap={idle   ? { scale: 0.986 } : undefined}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      {/* ── Explosion layer ─────────────────────────────────────────── */}
      <AnimatePresence>
        {burning && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>

            {/* Shockwave ring */}
            <motion.span
              className="absolute rounded-full"
              style={{
                top: "46%", left: "50%",
                border: "2px solid #BC002D",
                translateX: "-50%", translateY: "-50%",
              }}
              initial={{ width: 0, height: 0, opacity: 0.9 }}
              animate={{ width: 340, height: 340, opacity: 0, borderWidth: 0.5 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            />

            {/* Central radial flash */}
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: "radial-gradient(circle at 50% 46%, rgba(188,0,45,0.65) 0%, rgba(188,0,45,0.08) 45%, transparent 70%)",
              }}
            />

            {/* Ink drops */}
            {DROPS.map((p) => {
              const tx = Math.cos(rad(p.angle)) * p.dist + p.wobble;
              const ty = Math.sin(rad(p.angle)) * p.dist;
              return (
                <motion.span
                  key={`d${p.id}`}
                  className="absolute rounded-full"
                  style={{
                    width:      p.r * 2,
                    height:     p.r * 2,
                    top:        "46%",
                    left:       "50%",
                    marginTop:  -p.r,
                    marginLeft: -p.r,
                  }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1, backgroundColor: "#BC002D" }}
                  animate={{
                    x:               [0, tx * 0.45, tx],
                    y:               [0, ty * 0.45 - 8, ty],
                    scale:           [0, 1.6, 0.4],
                    opacity:         [1, 0.9, 0],
                    backgroundColor: ["#BC002D", "#D42840", "#1a1414"],
                  }}
                  transition={{ duration: 1.35, delay: p.delay, ease: [0.12, 0, 0.8, 1] }}
                />
              );
            })}

            {/* Elongated streaks */}
            {STREAKS.map((s) => {
              const tx = Math.cos(rad(s.angle)) * s.dist;
              const ty = Math.sin(rad(s.angle)) * s.dist;
              return (
                <motion.span
                  key={`s${s.id}`}
                  className="absolute"
                  style={{
                    width:        s.w,
                    height:       s.h,
                    borderRadius: s.w / 2,
                    top:          "46%",
                    left:         "50%",
                    marginTop:    -(s.h / 2),
                    marginLeft:   -(s.w / 2),
                    rotate:       s.angle + 90,
                    backgroundColor: "#BC002D",
                  }}
                  initial={{ x: 0, y: 0, scaleY: 0, opacity: 0.85 }}
                  animate={{
                    x:       [0, tx],
                    y:       [0, ty],
                    scaleY:  [0, 1, 0.3],
                    opacity: [0.85, 0.7, 0],
                    backgroundColor: ["#BC002D", "#902030", "#111"],
                  }}
                  transition={{ duration: 1.2, delay: s.delay, ease: [0.1, 0, 0.85, 1] }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* ── Spent overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {spent && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.1 }}
            style={{ background: "rgba(0,0,0,0.58)" }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 p-7 md:p-9 flex flex-col gap-5 min-h-[360px]">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span
              className="text-[9px] tracking-[0.38em] uppercase font-mono transition-colors duration-700"
              style={{ color: spent ? "rgba(70,50,50,0.45)" : "rgba(188,0,45,0.62)" }}
            >
              動機 · Dōki
            </span>
            <h3
              className="text-[1.65rem] font-heading leading-none transition-colors duration-700"
              style={{ color: spent ? "#2c2020" : "#f2f2f2" }}
            >
              Motivation
            </h3>
          </div>

          <motion.svg
            width="32" height="38" viewBox="0 0 32 38" fill="none" aria-hidden
            animate={
              burning ? { scale: [1, 1.7, 0.6], opacity: [1, 1, 0.15] }
              : spent ? { scale: 0.6, opacity: 0.12 }
              : {}
            }
            transition={{ duration: 1.4 }}
          >
            <path
              d="M16 2 C16 2 25 13 25 21 C25 27 21 33 16 33 C11 33 7 27 7 21 C7 13 16 2 16 2Z"
              fill={spent ? "#180e0e" : "#BC002D"}
              style={{ filter: burning ? "drop-shadow(0 0 10px #BC002D)" : "none" }}
            />
            <ellipse cx="16" cy="25" rx="4.5" ry="3.5"
              fill={spent ? "#110a0a" : "#F08040"}
              opacity={spent ? 0.25 : 0.85}
            />
          </motion.svg>
        </div>

        <p
          className="font-mono text-[0.8rem] leading-[1.8] transition-colors duration-700"
          style={{ color: spent ? "rgba(60,40,40,0.55)" : "rgba(242,242,242,0.5)" }}
        >
          Motivation is a volatile spark.{" "}
          <span style={{ color: spent ? "rgba(50,30,30,0.45)" : "rgba(188,0,45,0.7)" }}>
            It dies in the cold.
          </span>{" "}
          It gets you to the starting line then vanishes — relying on it guarantees a broken streak.
        </p>

        {/* Footer */}
        <div className="mt-auto h-5">
          <AnimatePresence mode="wait">
            {idle && (
              <motion.div key="cta" className="flex items-center gap-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#BC002D] animate-pulse-dot" />
                <span className="text-[10px] font-mono text-[#f2f2f2]/25 tracking-[0.28em]">
                  Click to ignite
                </span>
              </motion.div>
            )}
            {spent && (
              <motion.p key="spent"
                className="text-[10px] font-mono tracking-[0.35em] uppercase"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ delay: 0.3 }}
                style={{ color: "rgba(65,40,40,0.5)" }}
              >
                — Extinguished
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}

// ─── DisciplinePanel ──────────────────────────────────────────────────────────
function DisciplinePanel({
  phase,
  onClick,
}: {
  phase: DisciplinePhase;
  onClick: () => void;
}) {
  const idle     = phase === "idle";
  const drawing  = phase === "drawing";
  const anchored = phase === "anchored";
  const showInk  = drawing || anchored;

  return (
    <motion.article
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      className="relative overflow-hidden rounded-2xl cursor-pointer select-none
                 outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/35"
      style={{
        background:          anchored ? "rgba(12,12,10,0.82)" : "rgba(14,14,11,0.7)",
        border:              `1px solid ${anchored ? "rgba(212,175,55,0.3)" : "rgba(212,175,55,0.16)"}`,
        backdropFilter:      "blur(18px)",
        WebkitBackdropFilter:"blur(18px)",
        boxShadow:           anchored ? "0 0 48px rgba(212,175,55,0.06)" : "none",
        transition:          "box-shadow 0.9s ease, border-color 0.6s ease, background 0.6s ease",
      }}
      whileHover={idle ? { scale: 1.014 } : undefined}
      whileTap={idle   ? { scale: 0.986 } : undefined}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      {/* ── Gold thread SVG ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showInk && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-[78px] pointer-events-none"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            aria-hidden
          >
            <svg viewBox="0 0 370 78" className="w-full h-full" preserveAspectRatio="none">
              {/* Shadow depth */}
              <motion.path d={THREAD} stroke="rgba(120,90,8,0.28)" strokeWidth="3.5"
                fill="none" strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3.2, ease: [0.22, 0.06, 0.18, 1] }}
              />
              {/* Main thread */}
              <motion.path d={THREAD} stroke="#D4AF37" strokeWidth="1.8"
                fill="none" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0.75 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 3.2, ease: [0.22, 0.06, 0.18, 1] }}
                style={{ filter: "drop-shadow(0 0 4px rgba(212,175,55,0.75))" }}
              />
              {/* Shimmer highlight */}
              <motion.path d={THREAD} stroke="#F7E9A0" strokeWidth="0.6"
                fill="none" strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.42 }}
                transition={{ duration: 3.2, delay: 0.2, ease: [0.22, 0.06, 0.18, 1] }}
              />
              {/* Anchor bedrock */}
              <motion.path d={ANCHOR} fill="#D4AF37" stroke="#D4AF37"
                strokeWidth="0.8" strokeLinejoin="round"
                initial={{ scale: 0, opacity: 0 }}
                animate={anchored ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.08 }}
                style={{
                  transformOrigin: "353px 58px",
                  filter: anchored ? "drop-shadow(0 0 6px rgba(212,175,55,0.9))" : "none",
                }}
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Anchored glow pulse ──────────────────────────────────────── */}
      <AnimatePresence>
        {anchored && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.08, 0] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background: "radial-gradient(ellipse 90% 55% at 50% 100%, rgba(212,175,55,0.32) 0%, transparent 70%)",
            }}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* ── Content ───────────────────────────────────────────────────── */}
      <div className="relative z-10 p-7 md:p-9 flex flex-col gap-5 min-h-[360px]">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] tracking-[0.38em] uppercase font-mono text-[#D4AF37]/55">
              規律 · Kiritsu
            </span>
            <h3 className="text-[1.65rem] font-heading leading-none text-[#f2f2f2]">
              Discipline
            </h3>
          </div>

          <motion.svg
            width="32" height="30" viewBox="0 0 32 30" fill="none" aria-hidden
            animate={
              anchored ? {
                filter: [
                  "drop-shadow(0 0 3px rgba(212,175,55,0.4))",
                  "drop-shadow(0 0 12px rgba(212,175,55,1))",
                  "drop-shadow(0 0 3px rgba(212,175,55,0.4))",
                ],
              } : {}
            }
            transition={{ duration: 3.4, repeat: anchored ? Infinity : 0, ease: "easeInOut" }}
          >
            <polygon points="16,3 29,26 3,26"
              fill={anchored ? "#D4AF37" : "rgba(212,175,55,0.2)"}
              stroke="#D4AF37" strokeWidth="1"
            />
            <line x1="10" y1="17" x2="22" y2="17"
              stroke={anchored ? "#0B0B0C" : "#D4AF37"} strokeWidth="0.9" opacity="0.55" />
            <line x1="12" y1="21" x2="20" y2="21"
              stroke={anchored ? "#0B0B0C" : "#D4AF37"} strokeWidth="0.9" opacity="0.55" />
          </motion.svg>
        </div>

        <p className="font-mono text-[0.8rem] leading-[1.8] text-[#f2f2f2]/5">
          <span className="text-[#f2f2f2]/50">Discipline is the stone.</span>{" "}
          <span className="text-[#D4AF37]/55">Daily 1% action without emotional attachment.</span>{" "}
          <span className="text-[#f2f2f2]/38">
            Musashi did not swing his sword because he felt motivated — he did it because it was the Way.
          </span>
        </p>

        {/* Footer */}
        <div className="mt-auto h-5">
          <AnimatePresence mode="wait">
            {idle && (
              <motion.div key="cta" className="flex items-center gap-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/50 animate-pulse-dot" />
                <span className="text-[10px] font-mono text-[#f2f2f2]/25 tracking-[0.28em]">
                  Click to commit
                </span>
              </motion.div>
            )}
            {drawing && (
              <motion.p key="drawing"
                className="text-[10px] font-mono text-[#D4AF37]/45 tracking-[0.32em] uppercase"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              >
                Drawing the thread…
              </motion.p>
            )}
            {anchored && (
              <motion.div key="anchored" className="flex items-center gap-2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ delay: 0.15 }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"
                  style={{ boxShadow: "0 0 6px #D4AF37" }} />
                <span className="text-[10px] font-mono text-[#D4AF37]/65 tracking-[0.28em] uppercase">
                  Anchored. The Way holds.
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
}

// ─── Musashi Quote ────────────────────────────────────────────────────────────
function MusashiQuote() {
  return (
    <motion.blockquote
      className="relative w-full max-w-2xl"
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
    >
      {/* Left gold vein */}
      <div
        className="absolute left-0 top-6 bottom-6 w-[2px] rounded-full pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, transparent, #D4AF37 30%, #D4AF37 70%, transparent)",
          boxShadow:  "0 0 10px rgba(212,175,55,0.3)",
        }}
        aria-hidden
      />

      <div
        className="rounded-2xl pl-10 pr-8 py-9 flex flex-col gap-5"
        style={{
          background:          "rgba(11,11,10,0.72)",
          border:              "1px solid rgba(212,175,55,0.13)",
          backdropFilter:      "blur(22px)",
          WebkitBackdropFilter:"blur(22px)",
        }}
      >
        {/* Japanese */}
        <p className="font-heading text-xl md:text-2xl text-[#f2f2f2]/85 leading-relaxed tracking-wide">
          「昨日の自分に勝つことが、今日の勝利である。」
        </p>

        <div
          className="w-8 h-px"
          style={{ background: "linear-gradient(to right, #D4AF37, transparent)" }}
          aria-hidden
        />

        {/* English */}
        <p className="font-mono text-[0.78rem] text-[#f2f2f2]/42 leading-relaxed italic">
          "Today is victory over yourself of yesterday; tomorrow is your victory over lesser men."
        </p>

        <cite className="text-[9.5px] not-italic font-mono text-[#D4AF37]/45 tracking-[0.32em] uppercase">
          — Miyamoto Musashi · The Book of Five Rings
        </cite>

        {/* Red ink dot */}
        <div className="absolute top-7 right-7 pointer-events-none" aria-hidden>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="6" fill="rgba(188,0,45,0.1)" />
            <circle cx="12" cy="12" r="3" fill="rgba(188,0,45,0.38)" />
          </svg>
        </div>
      </div>
    </motion.blockquote>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function MotivationVsDiscipline() {
  const [motivationPhase, setMotivationPhase] = useState<MotivationPhase>("idle");
  const [disciplinePhase, setDisciplinePhase] = useState<DisciplinePhase>("idle");
  const burnTimer       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const disciplineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMotivationClick = useCallback(() => {
    if (motivationPhase === "burning") return;
    burnTimer.current && clearTimeout(burnTimer.current);
    setMotivationPhase("burning");
    burnTimer.current = setTimeout(() => setMotivationPhase("spent"), 1500);
  }, [motivationPhase]);

  const handleDisciplineClick = useCallback(() => {
    if (disciplinePhase !== "idle") return;
    setDisciplinePhase("drawing");
    disciplineTimer.current = setTimeout(() => setDisciplinePhase("anchored"), 3400);
  }, [disciplinePhase]);

  return (
    <section
      className="relative w-full min-h-screen bg-[#0B0B0C] overflow-x-hidden
                 flex flex-col items-center justify-center px-5 md:px-10 py-24 gap-14"
    >
      {/* Ambient wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(14,10,8,0) 25%, #0B0B0C 100%)",
        }}
        aria-hidden
      />

      {/* Intro */}
      <motion.div
        className="relative z-10 text-center max-w-md flex flex-col gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-[9px] tracking-[0.45em] uppercase font-mono text-[#D4AF37]/50">
          改善の道 · The Way of Kaizen
        </p>
        <h1 className="text-4xl md:text-[2.8rem] font-heading text-[#f2f2f2] leading-[1.1] tracking-tight">
          The Spark{" "}
          <span className="text-[#f2f2f2]/22">&</span>{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #F0D070 0%, #D4AF37 50%, #B8961E 100%)",
              WebkitBackgroundClip: "text", backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            the Stone
          </span>
        </h1>
        <p className="font-mono text-[0.78rem] text-[#f2f2f2]/35 leading-relaxed max-w-xs mx-auto">
          In the Way of Kaizen, we do not rely on feelings.
        </p>
      </motion.div>

      {/* Panels */}
      <motion.div
        className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 26 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
      >
        <MotivationPanel phase={motivationPhase} onClick={handleMotivationClick} />

        {/* Vertical katana divider */}
        <div
          className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                     w-px h-3/4 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(212,175,55,0.18), transparent)" }}
          aria-hidden
        />

        <DisciplinePanel phase={disciplinePhase} onClick={handleDisciplineClick} />
      </motion.div>

      {/* Quote */}
      <div className="relative z-10 w-full max-w-4xl flex justify-center">
        <MusashiQuote />
      </div>
    </section>
  );
}
