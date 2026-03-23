import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

const HOLD_DURATION_MS = 2500;

function playCompleteSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.15);
    osc.type = "sine";
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch {}
}

export default function Seed({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [complete, setComplete] = useState(false);
  const startTimeRef = useRef(null);
  const rafRef = useRef(null);

  const updateProgress = useCallback(() => {
    if (!startTimeRef.current || !isHolding) return;
    const elapsed = Date.now() - startTimeRef.current;
    const newProgress = Math.min((elapsed / HOLD_DURATION_MS) * 100, 100);
    setProgress(newProgress);

    if (newProgress < 100) {
      rafRef.current = requestAnimationFrame(updateProgress);
    } else {
      setComplete(true);
      playCompleteSound();
      setTimeout(() => onComplete(), 900);
    }
  }, [isHolding, onComplete]);

  const handleMouseDown = useCallback(() => {
    setIsHolding(true);
    startTimeRef.current = Date.now();
  }, []);

  const handleMouseUp = useCallback(() => {
    if (!complete) {
      setIsHolding(false);
      startTimeRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setProgress(0);
    }
  }, [complete]);

  const handleMouseLeave = useCallback(() => {
    if (isHolding && !complete) handleMouseUp();
  }, [isHolding, complete, handleMouseUp]);

  useEffect(() => {
    if (isHolding && !complete) rafRef.current = requestAnimationFrame(updateProgress);
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [isHolding, complete, updateProgress]);

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [handleMouseUp]);

  return (
    <motion.section
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-20 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Massive rising sun - glowing off-white circle in background */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,700px)] h-[min(90vw,700px)] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(242,242,242,0.12) 0%, rgba(242,242,242,0.04) 40%, transparent 70%)",
          boxShadow: "0 0 120px rgba(242,242,242,0.15), 0 0 200px rgba(242,242,242,0.08)",
        }}
      >
        {/* Red ink splatter filling the sun as user holds */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(188,0,45,0.5) 0%, rgba(188,0,45,0.25) 50%, transparent 70%)",
            }}
            animate={{
              opacity: (progress / 100),
              scale: [0.8, 1],
            }}
            transition={{ opacity: { duration: 0.1 }, scale: { duration: 0.5 } }}
          />
          {/* Splatter blobs */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 40%, rgba(188,0,45,0.6) 0%, transparent 20%),
                radial-gradient(circle at 70% 60%, rgba(188,0,45,0.4) 0%, transparent 25%),
                radial-gradient(circle at 50% 50%, rgba(188,0,45,0.3) 0%, transparent 35%)`,
            }}
            animate={{ opacity: (progress / 100) }}
            transition={{ duration: 0.1 }}
          />
        </motion.div>
      </div>

      <div className="relative z-10 max-w-xl mx-auto text-center space-y-12">
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F2F2F2] font-serif"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          The Seed
        </motion.h1>

        <motion.p
          className="text-base md:text-lg text-[#F2F2F2]/85 font-mono leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Every journey begins with intent. The 1% rule: improve by just one
          percent each day. Small, deliberate steps compound into lasting change.
        </motion.p>

        {/* Black silhouette seed */}
        <motion.svg
          width="100"
          height="100"
          viewBox="0 0 80 80"
          className="drop-shadow-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <ellipse cx="40" cy="40" rx="24" ry="30" fill="#121212" />
          <path d="M28 40 Q40 20 52 40 Q40 60 28 40" fill="#0a0a0a" opacity="0.7" />
        </motion.svg>

        {/* Hanko button - red square seal */}
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            disabled={complete}
            className="relative w-24 h-24 flex items-center justify-center cursor-pointer touch-none select-none disabled:cursor-default"
            style={{
              background: "linear-gradient(135deg, #BC002D 0%, #8B0020 100%)",
              boxShadow: "0 4px 24px rgba(188,0,45,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
              border: "2px solid rgba(188,0,45,0.8)",
            }}
          >
            <span className="text-[#F2F2F2] font-serif text-2xl font-bold relative z-10">種</span>
          </button>
          <p className="text-[#F2F2F2]/6 text-sm font-mono">Hold to seal</p>
        </motion.div>
      </div>
    </motion.section>
  );
}
