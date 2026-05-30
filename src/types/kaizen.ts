export type BonsaiPhase = "seed" | "roots" | "trunk" | "canopy";

export type TimerStatus = "idle" | "running" | "complete";

export interface HanseiEntry {
  id: string;
  text: string;
  date: string; // ISO date string YYYY-MM-DD
  timestamp: number;
}

export interface StreakData {
  current: number;
  longest: number;
  lastCompletedDate: string | null; // YYYY-MM-DD
  missedDays: number;
}

export interface KintsugiState {
  active: boolean;
  fractureCount: number;
  repaired: boolean;
  repairProgress: number; // 0–1
}

export interface DashboardState {
  phase: BonsaiPhase;
  timerStatus: TimerStatus;
  timerElapsed: number; // seconds 0–60
  hanseiLogs: HanseiEntry[];
  streak: StreakData;
  kintsugi: KintsugiState;
  lastWateredDate: string | null;
  todayWatered: boolean;
  todayReflected: boolean;
}

export interface DashboardActions {
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  addHansei: (text: string) => void;
  deleteHansei: (id: string) => void;
  advancePhase: () => void;
  activateKintsugi: () => void;
  progressKintsugiRepair: (delta: number) => void;
  completeKintsugiRepair: () => void;
  markTodayWatered: () => void;
}

export interface MouseParallax {
  x: number; // –1 to 1
  y: number; // –1 to 1
}
