import { useCallback, useEffect, useRef, useState } from "react";
import type {
  BonsaiPhase,
  DashboardActions,
  DashboardState,
  HanseiEntry,
  KintsugiState,
  StreakData,
  TimerStatus,
} from "@/types/kaizen";

const STORAGE_KEY = "kaizen_dashboard_v2";
const TIMER_DURATION = 60;

// ── Use LOCAL calendar date, not UTC, so timezone doesn't break streaks ───────
function localDateString(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm   = String(d.getMonth() + 1).padStart(2, "0");
  const dd   = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// ── Days between two YYYY-MM-DD strings (calendar days, not ms) ──────────────
function daysBetween(a: string, b: string): number {
  const msPerDay = 86_400_000;
  const da = new Date(`${a}T00:00:00`);
  const db = new Date(`${b}T00:00:00`);
  return Math.round((db.getTime() - da.getTime()) / msPerDay);
}

// ─── Defaults ─────────────────────────────────────────────────────────────────
const defaultStreak  = (): StreakData    => ({ current: 0, longest: 0, lastCompletedDate: null, missedDays: 0 });
const defaultKintsugi = (): KintsugiState => ({ active: false, fractureCount: 0, repaired: false, repairProgress: 0 });

// ─── Persistence ──────────────────────────────────────────────────────────────
interface PersistedState {
  phase:           BonsaiPhase;
  hanseiLogs:      HanseiEntry[];
  streak:          StreakData;
  kintsugi:        KintsugiState;
  lastWateredDate: string | null;
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("empty");
    return JSON.parse(raw) as PersistedState;
  } catch {
    return {
      phase:           "seed",
      hanseiLogs:      [],
      streak:          defaultStreak(),
      kintsugi:        defaultKintsugi(),
      lastWateredDate: null,
    };
  }
}

function saveState(s: PersistedState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useDashboard(): DashboardState & DashboardActions {
  const todayStr  = localDateString();
  const persisted = loadState();

  // ── State — restore raw persisted values, NO reset logic here ────────────
  const [phase,           setPhase]           = useState<BonsaiPhase>(persisted.phase);
  const [timerStatus,     setTimerStatus]     = useState<TimerStatus>("idle");
  const [timerElapsed,    setTimerElapsed]    = useState(0);
  const [hanseiLogs,      setHanseiLogs]      = useState<HanseiEntry[]>(persisted.hanseiLogs);
  const [streak,          setStreak]          = useState<StreakData>(persisted.streak);
  const [kintsugi,        setKintsugi]        = useState<KintsugiState>(persisted.kintsugi);
  const [lastWateredDate, setLastWateredDate] = useState<string | null>(persisted.lastWateredDate);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const todayWatered   = lastWateredDate === todayStr;
  const todayReflected = hanseiLogs.some((l) => l.date === todayStr);

  // ── Persist on every meaningful state change ──────────────────────────────
  useEffect(() => {
    saveState({ phase, hanseiLogs, streak, kintsugi, lastWateredDate });
  }, [phase, hanseiLogs, streak, kintsugi, lastWateredDate]);

  // ── Streak drift check — runs ONCE on mount ───────────────────────────────
  // This is the ONLY place that applies the gap reset, so it can't double-fire.
  useEffect(() => {
    const last = persisted.streak.lastCompletedDate;
    if (!last) return;

    const gap = daysBetween(last, todayStr);

    // gap === 0 → same day as last session, streak intact
    // gap === 1 → completed yesterday, streak intact
    // gap  > 1 → missed at least one day, break streak
    if (gap > 1 && persisted.streak.current > 0) {
      const missed = gap - 1;

      setStreak((prev) => ({
        ...prev,
        current:    0,
        missedDays: prev.missedDays + missed,
      }));

      // Only add a fracture if there wasn't already an unrepaired one
      setKintsugi((prev) => {
        if (prev.fractureCount > 0 && !prev.repaired) return prev; // already fractured
        return {
          ...prev,
          fractureCount:  prev.fractureCount + 1,
          repaired:       false,
          repairProgress: 0,
        };
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty deps — intentionally only on mount

  // ── Timer ─────────────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    if (timerStatus === "running") return;
    setTimerStatus("running");
    setTimerElapsed(0);
    timerRef.current = setInterval(() => {
      setTimerElapsed((prev) => {
        if (prev >= TIMER_DURATION - 1) {
          clearInterval(timerRef.current!);
          setTimerStatus("complete");
          return TIMER_DURATION;
        }
        return prev + 1;
      });
    }, 1000);
  }, [timerStatus]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerStatus("idle");
  }, []);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerStatus("idle");
    setTimerElapsed(0);
  }, []);

  // ── Mark today watered — called on timer complete ─────────────────────────
  const markTodayWatered = useCallback(() => {
    setLastWateredDate(todayStr);
    setStreak((prev) => {
      // Already watered today → don't double-count
      if (prev.lastCompletedDate === todayStr) return prev;

      const gap = prev.lastCompletedDate
        ? daysBetween(prev.lastCompletedDate, todayStr)
        : null;

      // gap === 1 → consecutive day → extend streak
      // gap === 0 → same day (shouldn't happen but guard it) → no change
      // gap  > 1 → already handled by mount effect; reset to 1
      // null     → first ever completion
      const newCurrent =
        gap === 1 ? prev.current + 1
        : gap === 0 ? prev.current
        : 1;

      return {
        current:           newCurrent,
        longest:           Math.max(prev.longest, newCurrent),
        lastCompletedDate: todayStr,
        missedDays:        prev.missedDays,
      };
    });
  }, [todayStr]);

  // Auto-mark when 60s timer finishes
  useEffect(() => {
    if (timerStatus === "complete" && !todayWatered) {
      markTodayWatered();
    }
  }, [timerStatus, todayWatered, markTodayWatered]);

  // ── Hansei ────────────────────────────────────────────────────────────────
  const addHansei = useCallback((text: string) => {
    const trimmed = text.trim().slice(0, 140);
    if (!trimmed) return;
    const entry: HanseiEntry = {
      id:        `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text:      trimmed,
      date:      localDateString(),
      timestamp: Date.now(),
    };
    setHanseiLogs((prev) => [entry, ...prev].slice(0, 90));
  }, []);

  const deleteHansei = useCallback((id: string) => {
    setHanseiLogs((prev) => prev.filter((l) => l.id !== id));
  }, []);

  // ── Phase ─────────────────────────────────────────────────────────────────
  const advancePhase = useCallback(() => {
    const order: BonsaiPhase[] = ["seed", "roots", "trunk", "canopy"];
    setPhase((prev) => {
      const idx = order.indexOf(prev);
      return idx < order.length - 1 ? (order[idx + 1] as BonsaiPhase) : prev;
    });
  }, []);

  // ── Kintsugi ──────────────────────────────────────────────────────────────
  const activateKintsugi = useCallback(() => {
    setKintsugi((prev) => ({ ...prev, active: true, repaired: false, repairProgress: 0 }));
  }, []);

  const progressKintsugiRepair = useCallback((delta: number) => {
    setKintsugi((prev) => ({ ...prev, repairProgress: Math.min(1, prev.repairProgress + delta) }));
  }, []);

  const completeKintsugiRepair = useCallback(() => {
    setKintsugi((prev) => ({
      ...prev,
      active:         false,
      repaired:       true,
      repairProgress: 1,
      fractureCount:  Math.max(0, prev.fractureCount - 1),
    }));
    // Repair restores streak to 1 from today
    setStreak((prev) => ({ ...prev, current: 1, lastCompletedDate: todayStr }));
  }, [todayStr]);

  return {
    phase,
    timerStatus,
    timerElapsed,
    hanseiLogs,
    streak,
    kintsugi,
    lastWateredDate,
    todayWatered,
    todayReflected,
    startTimer,
    stopTimer,
    resetTimer,
    addHansei,
    deleteHansei,
    advancePhase,
    activateKintsugi,
    progressKintsugiRepair,
    completeKintsugiRepair,
    markTodayWatered,
  };
}
