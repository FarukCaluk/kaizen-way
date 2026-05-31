import { motion } from "framer-motion";

export type AppView = "dashboard" | "motivation" | "wisdom";

interface NavItem {
  id:     AppView;
  kanji:  string;
  label:  string;
}

const ITEMS: NavItem[] = [
  { id: "dashboard",  kanji: "木", label: "Bonsai"  },
  { id: "motivation", kanji: "火", label: "Spark"   },
  { id: "wisdom",     kanji: "巻", label: "Wisdom"  },
];

interface NavDockProps {
  current:    AppView;
  onNavigate: (view: AppView) => void;
}

export default function NavDock({ current, onNavigate }: NavDockProps) {
  return (
    // Sit flush at bottom-0 and use padding to clear the iOS home indicator
    <nav
      className="fixed bottom-0 left-1/2 z-[70] -translate-x-1/2"
      style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))" }}
      aria-label="Main navigation"
    >
      <div
        className="flex items-center gap-1 px-2 py-2 rounded-2xl"
        style={{
          background:           "rgba(11,11,12,0.80)",
          backdropFilter:       "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border:               "1px solid rgba(212,175,55,0.14)",
          boxShadow:            "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(212,175,55,0.06)",
        }}
      >
        {ITEMS.map((item, i) => {
          const isActive = item.id === current;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              // min 44×44 tap target for iOS HIG
              className="relative flex flex-col items-center justify-center gap-0.5
                         min-w-[72px] min-h-[44px] px-4 rounded-xl
                         outline-none focus-visible:ring-1 focus-visible:ring-[#D4AF37]/40"
              style={{
                background:  isActive ? "rgba(212,175,55,0.09)" : "transparent",
                border:      isActive ? "1px solid rgba(212,175,55,0.2)" : "1px solid transparent",
                transition:  "background 0.25s ease, border-color 0.25s ease",
              }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.label}
            >
              {/* Active indicator dot */}
              {isActive && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#D4AF37]"
                  style={{ boxShadow: "0 0 6px rgba(212,175,55,0.9)" }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              <span
                className="text-base font-heading leading-none transition-colors duration-200"
                style={{ color: isActive ? "#D4AF37" : "rgba(242,242,242,0.32)" }}
              >
                {item.kanji}
              </span>
              <span
                className="text-[9px] font-mono tracking-[0.15em] leading-none transition-colors duration-200"
                style={{ color: isActive ? "rgba(212,175,55,0.65)" : "rgba(242,242,242,0.22)" }}
              >
                {item.label}
              </span>

              {/* Separator */}
              {i < ITEMS.length - 1 && !isActive && current !== ITEMS[i + 1]?.id && (
                <span className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-px h-4
                                 bg-[#D4AF37]/10 pointer-events-none" />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}
