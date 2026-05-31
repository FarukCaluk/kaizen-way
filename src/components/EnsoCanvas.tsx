import { useEffect, useRef } from "react";
import { motion, useAnimationFrame } from "framer-motion";
import type { MouseParallax } from "@/types/kaizen";

// ─── Pure SVG + Framer Motion Enso — no WebGL, no Three.js ──────────────────

interface EnsoCanvasProps {
  focused?: boolean;
  className?: string;
}

export default function EnsoCanvas({ focused = false, className = "" }: EnsoCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef     = useRef<MouseParallax>({ x: 0, y: 0 });
  const lerpRef      = useRef<MouseParallax>({ x: 0, y: 0 });

  // Track raw mouse / touch position
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = {
        x:  (e.clientX / window.innerWidth)  * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
      };
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      mouseRef.current = {
        x:  (t.clientX / window.innerWidth)  * 2 - 1,
        y: -((t.clientY / window.innerHeight) * 2 - 1),
      };
    };
    window.addEventListener("mousemove", onMove,  { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  // Smooth lerp the parallax offset each frame
  useAnimationFrame(() => {
    if (!containerRef.current) return;
    const speed = 0.055;
    lerpRef.current.x += (mouseRef.current.x - lerpRef.current.x) * speed;
    lerpRef.current.y += (mouseRef.current.y - lerpRef.current.y) * speed;

    const tx = lerpRef.current.x * 28;
    const ty = lerpRef.current.y * 18;
    containerRef.current.style.transform = `translate(${tx}px, ${-ty}px)`;
  });

  const glow = focused
    ? "drop-shadow(0 0 22px rgba(212,175,55,0.55)) drop-shadow(0 0 6px rgba(212,175,55,0.3))"
    : "drop-shadow(0 0 10px rgba(212,175,55,0.25))";

  return (
    <div
      className={`pointer-events-none select-none flex items-center justify-center ${className}`}
      style={{ transition: "filter 0.6s ease", filter: glow }}
    >
      {/* Parallax wrapper — translated by RAF loop above */}
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
        <svg
          viewBox="-160 -160 320 320"
          className="w-full h-full max-w-[600px] max-h-[600px]"
          style={{ overflow: "visible" }}
          aria-hidden
        >
          <defs>
            {/* Gold radial glow filter */}
            <filter id="enso-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Soft glow for outer ring */}
            <filter id="outer-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Blood dot glow */}
            <filter id="dot-glow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* ── Outermost ghost ring — very faint, large ── */}
          <motion.circle
            cx="0" cy="0" r="148"
            fill="none"
            stroke="rgba(212,175,55,0.06)"
            strokeWidth="0.5"
            animate={{ rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            style={{ originX: "0px", originY: "0px" }}
          />

          {/* ── Outer Enso ring — slow clockwise ── */}
          <motion.circle
            cx="0" cy="0" r="118"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="0.8"
            strokeOpacity={0.35}
            filter="url(#outer-glow)"
            animate={{ rotate: 360 }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            style={{ originX: "0px", originY: "0px" }}
          />

          {/* ── Main Enso ring — medium, gold ── */}
          <motion.g
            animate={{ rotate: focused ? 360 : 180 }}
            transition={{
              duration: focused ? 22 : 60,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ originX: "0px", originY: "0px" }}
          >
            {/* Ring body */}
            <circle
              cx="0" cy="0" r="88"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1.4"
              filter="url(#enso-glow)"
            />
            {/* Bright highlight arc — 60° arc at top */}
            <motion.path
              d="M 0,-88 A 88,88 0 0,1 76.21,-44"
              fill="none"
              stroke="#F7E9A0"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeOpacity={0.65}
            />
            {/* Dim shadow arc — opposite side */}
            <motion.path
              d="M 0,88 A 88,88 0 0,1 -76.21,44"
              fill="none"
              stroke="#9A7D0A"
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeOpacity={0.5}
            />
          </motion.g>

          {/* ── Inner ring — counter-clockwise, transmission glass look ── */}
          <motion.g
            animate={{ rotate: focused ? -360 : -180 }}
            transition={{
              duration: focused ? 30 : 80,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ originX: "0px", originY: "0px" }}
          >
            <circle
              cx="0" cy="0" r="54"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="8"
              strokeOpacity={0.07}
            />
            <circle
              cx="0" cy="0" r="54"
              fill="none"
              stroke="#D4AF37"
              strokeWidth="1"
              strokeOpacity={0.4}
              filter="url(#enso-glow)"
            />
            {/* Inner shimmer arc */}
            <path
              d="M 0,-54 A 54,54 0 0,1 46.77,-27"
              fill="none"
              stroke="#F0D070"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeOpacity={0.5}
            />
          </motion.g>

          {/* ── Floating ink dot particles — slow orbital ── */}
          {[0, 72, 144, 216, 288].map((startAngle, i) => (
            <motion.g
              key={i}
              animate={{ rotate: 360 }}
              transition={{
                duration: 28 + i * 8,
                repeat: Infinity,
                ease: "linear",
                delay: i * 1.4,
              }}
              style={{ originX: "0px", originY: "0px" }}
            >
              <circle
                cx={Math.cos((startAngle * Math.PI) / 180) * (100 + i * 6)}
                cy={Math.sin((startAngle * Math.PI) / 180) * (100 + i * 6)}
                r={0.8 + (i % 2) * 0.4}
                fill="#D4AF37"
                opacity={0.3 + (i % 3) * 0.1}
              />
            </motion.g>
          ))}

          {/* ── Center blood red ink dot ── */}
          <motion.circle
            cx="0" cy="0" r="3.5"
            fill="#BC002D"
            filter="url(#dot-glow)"
            animate={{ opacity: [0.7, 1, 0.7], r: [3.5, 4.2, 3.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <circle cx="0" cy="0" r="1.2" fill="#f2f2f2" opacity={0.6} />
        </svg>
      </div>
    </div>
  );
}
