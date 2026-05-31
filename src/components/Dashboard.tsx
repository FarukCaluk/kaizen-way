import { useCallback, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDashboard } from "@/store/useDashboard";
import EnsoCanvas from "./EnsoCanvas";
import type { BonsaiPhase } from "@/types/kaizen";

/* ─── Micro Timer ────────────────────────────────────────────────────────── */
const CIRCUMFERENCE = 2 * Math.PI * 35;

function KaizenTimer() {
  const { timerStatus, timerElapsed, startTimer, stopTimer, resetTimer } = useDashboard();
  const progress   = timerElapsed / 60;
  const offset     = CIRCUMFERENCE * (1 - progress);
  const isComplete = timerStatus === "complete";

  return (
    <motion.div
      className="glass rounded-2xl p-5 flex flex-col items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <p className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-mono opacity-80">
        1-Minute Kaizen
      </p>

      <div className="relative w-24 h-24">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(212,175,55,0.1)" strokeWidth="3" />
          <motion.circle
            cx="40" cy="40" r="35" fill="none"
            stroke={isComplete ? "#BC002D" : "#D4AF37"}
            strokeWidth="3" strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.5, ease: "linear" }}
            style={{ filter: isComplete ? "drop-shadow(0 0 6px #BC002D)" : "drop-shadow(0 0 4px #D4AF37)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-xl text-[#f2f2f2]">
            {isComplete ? "✓" : `${60 - timerElapsed}s`}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        {timerStatus === "idle" && !isComplete && (
          <button
            onClick={startTimer}
            className="px-5 py-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30
                       text-[#D4AF37] text-xs font-mono tracking-wider
                       active:bg-[#D4AF37]/25 hover:bg-[#D4AF37]/20 transition-colors"
          >
            始める · Begin
          </button>
        )}
        {timerStatus === "running" && (
          <button
            onClick={stopTimer}
            className="px-5 py-2 rounded-lg bg-[#BC002D]/10 border border-[#BC002D]/30
                       text-[#f2f2f2] text-xs font-mono tracking-wider
                       active:bg-[#BC002D]/25 hover:bg-[#BC002D]/20 transition-colors"
          >
            Pause
          </button>
        )}
        {(isComplete || timerStatus !== "idle") && (
          <button
            onClick={resetTimer}
            className="px-4 py-2 rounded-lg bg-white/5 border border-white/10
                       text-[#f2f2f2]/50 text-xs font-mono
                       active:bg-white/15 hover:bg-white/10 transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {isComplete && (
        <motion.p
          className="text-[10px] font-mono text-[#D4AF37] tracking-widest"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        >
          木に水をやる · Tree watered
        </motion.p>
      )}
    </motion.div>
  );
}

/* ─── Hansei Journal ─────────────────────────────────────────────────────── */
function HanseiJournal() {
  const { hanseiLogs, addHansei, deleteHansei, todayReflected } = useDashboard();
  const [text, setText] = useState("");
  const [, startTransition] = useTransition();

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!text.trim()) return;
      startTransition(() => addHansei(text));
      setText("");
    },
    [text, addHansei]
  );

  return (
    <motion.div
      className="glass rounded-2xl p-5 flex flex-col gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-mono opacity-80">
          反省 · Hansei
        </p>
        {todayReflected && (
          <span className="text-[9px] font-mono text-[#D4AF37]/60 tracking-wider">● Today logged</span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 140))}
            placeholder="What was 1% better today?"
            maxLength={140}
            rows={2}
            className="w-full bg-white/5 border border-[#D4AF37]/15 rounded-lg
                       px-3 py-2.5 text-sm font-mono text-[#f2f2f2] placeholder-[#f2f2f2]/25
                       resize-none focus:outline-none focus:border-[#D4AF37]/40
                       transition-colors leading-relaxed"
          />
          <span className="absolute bottom-2 right-2 text-[9px] font-mono text-[#f2f2f2]/20">
            {text.length}/140
          </span>
        </div>
        <button
          type="submit"
          disabled={!text.trim()}
          className="self-end px-4 py-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30
                     text-[#D4AF37] text-xs font-mono tracking-wider
                     active:bg-[#D4AF37]/25 hover:bg-[#D4AF37]/20
                     disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          記録 · Log
        </button>
      </form>

      {hanseiLogs.length > 0 && (
        <ul className="flex flex-col gap-2 max-h-44 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {hanseiLogs.slice(0, 7).map((entry) => (
              <motion.li
                key={entry.id}
                layout
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="flex items-start gap-2 group"
              >
                <span className="mt-1.5 w-1 h-1 rounded-full bg-[#D4AF37]/50 shrink-0" />
                <p className="flex-1 text-xs font-mono text-[#f2f2f2]/70 leading-relaxed">
                  {entry.text}
                </p>
                {/* Always visible on touch devices, hover-only on desktop */}
                <button
                  onClick={() => deleteHansei(entry.id)}
                  className="opacity-40 md:opacity-0 md:group-hover:opacity-40 hover:opacity-80
                             text-[#f2f2f2] text-sm leading-none shrink-0 w-5 text-center
                             transition-opacity active:opacity-100"
                  aria-label="Delete entry"
                >
                  ×
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </motion.div>
  );
}

/* ─── Kintsugi Repair Panel ─────────────────────────────────────────────── */
function KintsugiPanel() {
  const { kintsugi, streak, activateKintsugi, progressKintsugiRepair, completeKintsugiRepair } =
    useDashboard();

  const isBroken = streak.current === 0 && kintsugi.fractureCount > 0 && !kintsugi.repaired;
  if (!isBroken && !kintsugi.active) return null;

  return (
    <motion.div
      className="glass rounded-2xl p-5 flex flex-col gap-4 border border-[#D4AF37]/30"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{ boxShadow: "0 0 32px rgba(212,175,55,0.15)" }}
    >
      <div className="flex items-center gap-3">
        <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden>
          {kintsugi.active ? (
            <path d="M20 4 L14 20 L22 28 L16 36" fill="none" stroke="#D4AF37"
              strokeWidth="2" strokeLinecap="round" strokeDasharray="100"
              strokeDashoffset={100 - kintsugi.repairProgress * 100}
              style={{ filter: "drop-shadow(0 0 4px #D4AF37)" }} />
          ) : (
            <path d="M20 4 L14 20 L22 28 L16 36" fill="none"
              stroke="rgba(188,0,45,0.6)" strokeWidth="1.5" strokeLinecap="round"
              style={{ animation: "fracture-crack 0.4s ease-out forwards" }} />
          )}
        </svg>
        <div>
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-mono">
            金継ぎ · Kintsugi
          </p>
          <p className="text-xs font-mono text-[#f2f2f2]/50 mt-0.5">
            {kintsugi.active ? "Repairing fracture…" : "Streak fractured"}
          </p>
        </div>
      </div>

      {!kintsugi.active && (
        <button
          onClick={activateKintsugi}
          className="w-full py-3 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/40
                     text-[#D4AF37] text-xs font-mono tracking-widest
                     active:bg-[#D4AF37]/25 hover:bg-[#D4AF37]/20 transition-colors"
        >
          修復する · Activate Repair
        </button>
      )}

      {kintsugi.active && (
        <div className="flex flex-col gap-3">
          <div className="relative h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full bg-[#D4AF37]"
              animate={{ width: `${kintsugi.repairProgress * 100}%` }}
              style={{ boxShadow: "0 0 8px #D4AF37" }}
              transition={{ ease: "easeOut" }}
            />
          </div>
          <p className="text-[10px] font-mono text-[#f2f2f2]/40 text-center">
            Complete a micro-task to fill the vein
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => progressKintsugiRepair(0.25)}
              className="flex-1 py-2.5 rounded-lg bg-white/5 border border-white/10
                         text-[#f2f2f2]/70 text-xs font-mono
                         active:bg-white/15 hover:bg-white/10 transition-colors"
            >
              +25%
            </button>
            {kintsugi.repairProgress >= 1 && (
              <button
                onClick={completeKintsugiRepair}
                className="flex-1 py-2.5 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/50
                           text-[#D4AF37] text-xs font-mono tracking-wider
                           active:bg-[#D4AF37]/35 hover:bg-[#D4AF37]/30 transition-colors"
              >
                完成 · Complete
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ─── Phase Nav ──────────────────────────────────────────────────────────── */
const PHASES: { id: BonsaiPhase; label: string; kanji: string }[] = [
  { id: "seed",   label: "Seed",   kanji: "種" },
  { id: "roots",  label: "Roots",  kanji: "根" },
  { id: "trunk",  label: "Trunk",  kanji: "幹" },
  { id: "canopy", label: "Canopy", kanji: "葉" },
];
const PHASE_ORDER: BonsaiPhase[] = ["seed", "roots", "trunk", "canopy"];

function PhaseNav({ current, onAdvance }: { current: BonsaiPhase; onAdvance: () => void }) {
  const currentIdx = PHASE_ORDER.indexOf(current);

  return (
    <div className="flex flex-wrap items-center gap-y-2 gap-x-1">
      {PHASES.map((p, i) => {
        const isActive = p.id === current;
        const isPast   = i < currentIdx;
        return (
          <div key={p.id} className="flex items-center gap-1">
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono
                transition-all duration-300
                ${isActive  ? "bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]"
                : isPast    ? "bg-white/5 border border-white/10 text-[#f2f2f2]/40"
                : "bg-transparent border border-white/5 text-[#f2f2f2]/20"}`}
            >
              <span>{p.kanji}</span>
              <span className="tracking-wider hidden sm:inline">{p.label}</span>
            </div>
            {i < PHASES.length - 1 && (
              <div className={`w-2 h-px ${isPast ? "bg-[#D4AF37]/30" : "bg-white/10"}`} />
            )}
          </div>
        );
      })}

      {currentIdx < PHASE_ORDER.length - 1 && (
        <button
          onClick={onAdvance}
          className="ml-1 px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20
                     text-[#D4AF37] text-[10px] font-mono
                     active:bg-[#D4AF37]/25 hover:bg-[#D4AF37]/20 transition-colors"
        >
          →
        </button>
      )}
    </div>
  );
}

/* ─── Streak Badge ───────────────────────────────────────────────────────── */
function StreakBadge() {
  const { streak, todayWatered } = useDashboard();
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: todayWatered ? "#D4AF37" : "rgba(242,242,242,0.2)" }}
        animate={todayWatered ? { scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="font-mono text-xs text-[#f2f2f2]/50">
        {streak.current > 0 ? <span className="text-[#D4AF37]">{streak.current}d</span> : "—"}{" "}streak
      </span>
    </div>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────────────────── */
export default function Dashboard() {
  const { phase, advancePhase } = useDashboard();
  const [focused, setFocused]   = useState(false);

  const progressValue: Record<BonsaiPhase, number> = {
    seed: 0, roots: 33, trunk: 66, canopy: 100,
  };

  return (
    <div
      className="relative w-full min-h-screen flex flex-col lg:flex-row overflow-x-hidden"
      onMouseEnter={() => setFocused(true)}
      onMouseLeave={() => setFocused(false)}
    >
      {/* Three.js Enso background */}
      <div className="absolute inset-0 z-0">
        <EnsoCanvas focused={focused} className="w-full h-full opacity-60" />
      </div>

      {/* Radial gradient mask */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 80% at 70% 50%, transparent 20%, #0B0B0C 75%)",
        }}
      />

      {/* ── Hero — left half on desktop, full-width top block on mobile ── */}
      <div className="relative z-10 flex flex-col justify-center
                      px-6 md:pl-16 md:pr-8 gap-6
                      pt-16 pb-6 lg:py-0
                      min-h-[55vh] lg:min-h-screen
                      w-full lg:w-1/2">
        <motion.div
          className="flex flex-col gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p className="text-[10px] tracking-[0.4em] uppercase font-mono text-[#D4AF37]/70">
            改善 · Kaizen Bonsai
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading leading-[1.1] tracking-tight">
            <span className="gold-text">1% Better</span>
            <br />
            <span className="text-[#f2f2f2]/80 text-3xl sm:text-4xl md:text-5xl">Every Day</span>
          </h1>
          <p className="font-mono text-sm text-[#f2f2f2]/40 max-w-sm leading-relaxed">
            A single breath. A single act. The tree grows in silence.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PhaseNav current={phase} onAdvance={advancePhase} />
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <StreakBadge />
        </motion.div>
      </div>

      {/* ── Sidebar — right panel on desktop, stacked below on mobile ── */}
      <div className="relative z-10 flex flex-col gap-3
                      px-4 md:px-6
                      pt-2 pb-28 lg:pb-12
                      w-full lg:w-[380px] lg:justify-center lg:min-h-screen
                      lg:border-l lg:border-[#D4AF37]/10">

        {/* Vertical progress thread — desktop only */}
        <div className="hidden lg:block absolute left-0 top-8 bottom-8 w-px bg-[#D4AF37]/8">
          <motion.div
            className="w-full bg-[#D4AF37]/40 rounded-full"
            style={{ boxShadow: "0 0 4px rgba(212,175,55,0.4)" }}
            animate={{ height: `${progressValue[phase]}%` }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          />
        </div>

        <KaizenTimer />
        <HanseiJournal />

        <AnimatePresence>
          <KintsugiPanel />
        </AnimatePresence>

        <motion.blockquote
          className="text-center py-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        >
          <p className="text-[10px] font-mono text-[#f2f2f2]/22 leading-relaxed tracking-wider italic">
            "小さな改善が大きな変化を生む"
          </p>
          <p className="text-[9px] font-mono text-[#f2f2f2]/12 mt-1 tracking-widest">
            Small improvements create great change.
          </p>
        </motion.blockquote>
      </div>
    </div>
  );
}
