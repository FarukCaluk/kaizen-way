import { motion } from "framer-motion";

const DUST_COUNT = 24;

function DustParticles() {
  return (
    <>
      {Array.from({ length: DUST_COUNT }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-[#F2F2F2]"
          style={{
            left: `${5 + (i * 7) % 90}%`,
            top: `${10 + (i * 11) % 80}%`,
          }}
          animate={{
            opacity: [0.02, 0.08, 0.02],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}

export default function Layout({ children, progress = 0 }) {
  return (
    <div className="relative min-h-screen bg-[#121212] overflow-hidden">
      {/* Film grain overlay */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.04, 0.07, 0.04] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
        }}
      />

      {/* Dust particle overlay */}
      <div className="fixed inset-0 pointer-events-none z-[51] overflow-hidden">
        <DustParticles />
      </div>

      {/* Vertical Sword Stroke progress bar - left edge */}
      <div className="fixed top-0 left-0 bottom-0 w-[3px] bg-[#121212] z-[60]">
        <motion.div
          className="absolute top-0 left-0 w-full bg-[#BC002D]"
          style={{ boxShadow: "0 0 12px rgba(188,0,45,0.6)" }}
          animate={{ height: `${progress}%` }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      <div className="relative z-10 pl-4">{children}</div>
    </div>
  );
}
