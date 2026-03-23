import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DISTRACTIONS = [
  "Social Media",
  "Procrastination",
  "Negative Thoughts",
  "Multitasking",
  "Fear",
  "Doubt",
  "Noise",
  "Worry",
  "Overthinking",
  "Comparison",
  "Excuses",
  "Gossip",
  "Perfectionism",
  "Distraction",
  "Complaining",
  "Impatience",
];

const NOISE_COLORS = [
  "#BC002D", "#C41E3A", "#E74C3C", "#D35400", "#E67E22",
  "#F39C12", "#D4A017", "#C0392B", "#A93226", "#E74C3C",
  "#D35400", "#E67E22", "#F39C12", "#BC002D", "#C0392B",
  "#D4A017",
];

function playSlashSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.06);
    osc.type = "sawtooth";
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch {}
}

function BrushStrokeSlash() {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[70] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute w-[200%] h-2 origin-center"
        style={{
          background: "linear-gradient(90deg, transparent 40%, rgba(188,0,45,0.9) 48%, rgba(188,0,45,1) 52%, transparent 60%)",
          boxShadow: "0 0 40px rgba(188,0,45,0.8)",
        }}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </motion.div>
  );
}

function DistractionWord({ label, onSlice, index }) {
  const [sliced, setSliced] = useState(false);
  const accentColor = NOISE_COLORS[index % NOISE_COLORS.length];

  const handleClick = useCallback(() => {
    if (sliced) return;
    setSliced(true);
    playSlashSound();
    setTimeout(onSlice, 280);
  }, [sliced, onSlice]);

  if (sliced) return null;

  return (
    <motion.button
      className="px-5 py-3 rounded font-mono text-sm md:text-base cursor-pointer shrink-0"
      style={{
        backgroundColor: "#121212",
        color: accentColor,
        borderWidth: "2px",
        borderColor: accentColor + "70",
        boxShadow: `0 2px 16px ${accentColor}50`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: index * 0.04 }}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.button>
  );
}

export default function Trunk({ onComplete }) {
  const [distractions, setDistractions] = useState(
    DISTRACTIONS.map((label, i) => ({ id: i, label }))
  );
  const [allSliced, setAllSliced] = useState(false);
  const [slashKey, setSlashKey] = useState(0);

  const rows = useMemo(() => {
    const words = DISTRACTIONS.map((label, i) => ({ id: i, label }));
    const row1 = words.slice(0, 6);
    const row2 = words.slice(6, 11);
    const row3 = words.slice(11, 16);
    return [row1, row2, row3];
  }, []);

  const handleSlice = useCallback((id) => {
    setSlashKey((k) => k + 1);
    setDistractions((prev) => {
      const next = prev.filter((d) => d.id !== id);
      if (next.length === 0) {
        setTimeout(() => {
          setAllSliced(true);
          onComplete?.();
        }, 600);
      }
      return next;
    });
  }, [onComplete]);

  const sliceCount = DISTRACTIONS.length - distractions.length;

  return (
    <>
      <AnimatePresence mode="wait">
        {slashKey > 0 && <BrushStrokeSlash key={slashKey} />}
      </AnimatePresence>

      <motion.section
        className="min-h-screen flex flex-col items-center px-6 py-16 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-8">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F2F2F2] font-serif"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            The Trunk
          </motion.h2>

          <motion.p
            className="text-lg text-[#F2F2F2]/80 font-mono leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Cut out the noise. Click each word to remove it from your life.
          </motion.p>
        </div>

        {/* Words in three rows with spacing */}
        <div className="flex flex-col gap-10 md:gap-14 w-full max-w-4xl mx-auto flex-1 justify-center">
          {rows.map((rowWords, rowIndex) => (
            <div
              key={rowIndex}
              className="flex flex-wrap justify-center gap-4 md:gap-6"
            >
              <AnimatePresence>
                {rowWords
                  .filter((w) => distractions.some((d) => d.id === w.id))
                  .map((w, i) => (
                    <DistractionWord
                      key={w.id}
                      label={w.label}
                      index={w.id}
                      onSlice={() => handleSlice(w.id)}
                    />
                  ))}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {distractions.length > 0 && (
          <motion.p
            className="mt-6 text-[#F2F2F2]/50 text-sm font-mono"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {sliceCount} cut from your life ({DISTRACTIONS.length - sliceCount} left)
          </motion.p>
        )}

        {allSliced && (
          <motion.p
            className="mt-6 text-[#BC002D] font-serif font-medium text-lg"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            The path is clear.
          </motion.p>
        )}
      </motion.section>
    </>
  );
}
