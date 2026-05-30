import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Lenis from "lenis";

const DUST_COUNT = 20;

const dustParticles = Array.from({ length: DUST_COUNT }, (_, i) => ({
  key: i,
  left: `${5 + ((i * 7) % 90)}%`,
  top: `${10 + ((i * 11) % 80)}%`,
  duration: 4 + (i % 3),
  delay: i * 0.18,
}));

interface LayoutProps {
  children: React.ReactNode;
  progress?: number;
}

export default function Layout({ children, progress = 0 }: LayoutProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenisRef.current?.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenisRef.current?.destroy();
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-[#0B0B0C] overflow-x-hidden">
      {/* Film grain */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-50"
        animate={{ opacity: [0.04, 0.07, 0.04] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Dust particles */}
      <div className="fixed inset-0 pointer-events-none z-[51] overflow-hidden">
        {dustParticles.map((p) => (
          <motion.div
            key={p.key}
            className="absolute w-px h-px rounded-full bg-[#f2f2f2]"
            style={{ left: p.left, top: p.top }}
            animate={{ opacity: [0.02, 0.09, 0.02], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Vertical progress bar — left edge */}
      <div className="fixed top-0 left-0 bottom-0 w-[3px] bg-[#0B0B0C] z-[60]">
        <motion.div
          className="absolute top-0 left-0 w-full bg-[#BC002D]"
          style={{ boxShadow: "0 0 12px rgba(188,0,45,0.6)" }}
          animate={{ height: `${progress}%` }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      <div className="relative z-10 pl-4">{children}</div>
    </div>
  );
}
