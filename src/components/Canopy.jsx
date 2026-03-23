import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "kaizen_growth_words";
const TARGET_WORDS = 10;

/* Ink dot clusters - background leaves */
const INK_DOTS = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: 15 + (i * 7) % 75,
  y: 10 + (Math.floor(i / 6) * 18) % 80,
  size: 3 + (i % 4),
  delay: i * 0.08,
}));

function FallingLeaf({ onComplete }) {
  return (
    <motion.div
      className="fixed top-0 left-1/2 w-6 h-6 z-50 pointer-events-none"
      initial={{ x: "-50%", y: -30, rotate: 0 }}
      animate={{
        y: "120vh",
        x: ["-50%", "calc(-50% + 40px)", "calc(-50% - 20px)", "-50%"],
        rotate: [0, 90, 180, 270],
      }}
      transition={{ duration: 2.5, ease: "easeIn" }}
      onAnimationComplete={onComplete}
    >
      <svg viewBox="0 0 24 24" fill="#2d5a27" className="w-full h-full drop-shadow-lg">
        <path d="M12 2c-1 3-2 6-2 8s1 4 2 6c1-2 2-4 2-6s-1-5-2-8zm0 0c2 1 4 3 5 5-1 2-3 4-5 5-2-1-4-3-5-5 1-2 3-4 5-5z" />
      </svg>
    </motion.div>
  );
}

export default function Canopy() {
  const [word, setWord] = useState("");
  const [words, setWords] = useState([]);
  const [leafKey, setLeafKey] = useState(0);
  const [showLeaf, setShowLeaf] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setWords(Array.isArray(parsed) ? parsed : []);
      } catch {
        setWords([]);
      }
    }
  }, []);

  useEffect(() => {
    if (words.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    }
  }, [words]);

  const handleAddWord = (e) => {
    e.preventDefault();
    const trimmed = word.trim();
    if (!trimmed) return;

    setWords((prev) => [...prev, trimmed]);
    setWord("");
    setLeafKey((k) => k + 1);
    setShowLeaf(true);
  };

  const handleLeafComplete = () => {
    setShowLeaf(false);
  };

  const progress = Math.min((words.length / TARGET_WORDS) * 100, 100);

  return (
    <motion.section
      className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <AnimatePresence>
        {showLeaf && (
          <FallingLeaf key={leafKey} onComplete={handleLeafComplete} />
        )}
      </AnimatePresence>

      <div className="max-w-2xl mx-auto text-center space-y-12">
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F2F2F2] font-serif"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          The Canopy
        </motion.h2>

        <motion.p
          className="text-lg text-[#F2F2F2]/80 font-mono leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Each word symbolizes growth. Write one at a time. Watch the tree fill.
        </motion.p>

        {/* Ink dot clusters for leaves */}
        <div className="relative w-full max-w-md h-40 mx-auto">
          {INK_DOTS.map((dot) => (
            <motion.div
              key={dot.id}
              className="absolute rounded-full bg-[#121212]"
              style={{
                left: `${dot.x}%`,
                top: `${dot.y}%`,
                width: dot.size,
                height: dot.size,
              }}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [0.9, 1.1, 0.9],
              }}
              transition={{
                duration: 3 + (dot.id % 3) * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: dot.delay,
              }}
            />
          ))}
        </div>

        {/* Word input - one word at a time */}
        <motion.form
          onSubmit={handleAddWord}
          className="flex flex-col items-center gap-6 w-full max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label
            htmlFor="kaizen-word"
            className="text-[#F2F2F2]/70 text-sm font-mono tracking-wider"
          >
            A word that symbolizes your growth
          </label>
          <div className="w-2/3 min-w-[200px] flex gap-2">
            <input
              id="kaizen-word"
              type="text"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              placeholder="e.g. patience"
              className="flex-1 py-3 px-4 bg-transparent text-[#F2F2F2] font-mono text-center focus:outline-none border-0 border-b border-[#F2F2F2]/30 focus:border-[#BC002D] transition-colors"
              style={{ borderBottomWidth: "1px" }}
            />
            <motion.button
              type="submit"
              disabled={!word.trim()}
              className="px-6 py-3 bg-[#BC002D] text-[#F2F2F2] font-mono text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Add
            </motion.button>
          </div>
          {words.length > 0 && (
            <p className="text-[#F2F2F2]/60 font-mono text-sm">
              {words.length} word{words.length !== 1 ? "s" : ""} added
            </p>
          )}
        </motion.form>

        {/* Percentage bar at bottom */}
        <motion.div
          className="fixed bottom-0 left-0 right-0 h-1.5 bg-[#121212] z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-[#BC002D]"
            style={{ boxShadow: "0 0 12px rgba(188,0,45,0.5)" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F2F2F2]/70 font-mono text-xs">
            {Math.round(progress)}%
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
