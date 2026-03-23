import { useRef } from "react";
import { motion, useInView, useScroll, useVelocity, useTransform } from "framer-motion";

/* Ink-stroke roots - hand-drawn, varying thickness */
const INK_ROOTS = [
  { d: "M200 10 q-5 80 -25 160 q-30 80 -90 220", strokeWidth: 4, delay: 0 },
  { d: "M200 10 q10 60 35 130 q40 90 120 200", strokeWidth: 3, delay: 0.12 },
  { d: "M200 10 q-15 70 -45 140 q-50 100 -140 250", strokeWidth: 5, delay: 0.06 },
  { d: "M200 10 q15 50 55 110 q60 100 140 210", strokeWidth: 2.5, delay: 0.18 },
  { d: "M200 10 L200 100 q-10 80 0 180 q5 60 -20 120", strokeWidth: 3.5, delay: 0.03 },
  { d: "M200 10 q-8 90 10 170 q25 70 70 150", strokeWidth: 2, delay: 0.15 },
  { d: "M200 10 q8 75 -15 155 q-35 90 -100 200", strokeWidth: 4.5, delay: 0.09 },
];

function SakuraPetals() {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const drift = useTransform(scrollVelocity, [-500, 0, 500], [-40, 0, 40]);

  const petals = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: 10 + (i * 13) % 85,
    delay: i * 0.4,
    size: 8 + (i % 3) * 4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: -20,
            width: p.size,
            height: p.size,
            x: drift,
          }}
          animate={{
            y: [0, 600],
            rotate: [0, 400],
            opacity: [0.7, 0],
          }}
          transition={{
            duration: 8 + p.id * 0.5,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        >
          <svg viewBox="0 0 24 24" fill="#BC002D" className="opacity-80">
            <path d="M12 2c-1 3-2 6-2 8s1 4 2 6c1-2 2-4 2-6s-1-5-2-8zm0 0c2 1 4 3 5 5-1 2-3 4-5 5-2-1-4-3-5-5 1-2 3-4 5-5z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}

export default function Roots({ onContinue }) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { amount: 0.25 });
  return (
    <motion.section
      ref={sectionRef}
      className="min-h-screen flex flex-col items-center justify-center px-6 py-32 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <SakuraPetals />

      <div className="max-w-xl mx-auto text-center space-y-10 relative z-20">
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F2F2F2] font-serif"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          The Roots
        </motion.h2>

        <motion.blockquote
          className="text-xl md:text-2xl text-[#F2F2F2]/95 font-mono italic"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          &ldquo;A tree with deep roots laughs at the wind.&rdquo;
        </motion.blockquote>

        <div className="space-y-4 text-left max-w-lg mx-auto">
          <motion.p
            className="text-base md:text-lg text-[#F2F2F2]/85 font-mono leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Habits are the roots of character. Build them deep, one small action at a time.
          </motion.p>
          <motion.p
            className="text-base md:text-lg text-[#F2F2F2]/85 font-mono leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Strong roots anchor the tree. They draw nourishment from consistency. The deeper they go, the higher the branches can reach.
          </motion.p>
          <motion.p
            className="text-base md:text-lg text-[#F2F2F2]/85 font-mono leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Every habit you nurture becomes a root. Morning routines, focused work, daily reflection—each one strengthens the whole.
          </motion.p>
          <motion.p
            className="text-base md:text-lg text-[#BC002D]/90 font-mono leading-relaxed font-medium"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            A strong tree starts below the surface. Tend your roots first.
          </motion.p>
        </div>

        {onContinue && (
          <motion.button
            onClick={onContinue}
            className="mt-6 px-8 py-3 border-2 border-[#BC002D] text-[#F2F2F2] font-mono text-sm tracking-wider bg-transparent hover:bg-[#BC002D] transition-colors duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue
          </motion.button>
        )}
      </div>

      {/* Ink-stroke roots */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-xl h-72 pointer-events-none z-10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg viewBox="0 0 400 320" className="w-full h-full" fill="none">
          {INK_ROOTS.map((root, i) => (
            <motion.path
              key={i}
              d={root.d}
              stroke="#121212"
              strokeWidth={root.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{
                duration: 2,
                delay: root.delay,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
          ))}
        </svg>
      </motion.div>
    </motion.section>
  );
}
