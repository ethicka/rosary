import type { MysterySetName } from "../data/mysteries.ts";

export interface HistoryEntry {
  /** Local calendar date the Rosary was completed, YYYY-MM-DD. */
  date: string;
  mysterySet: MysterySetName;
  completedAt: string;
}

const STORAGE_KEY = "rosary.history.v1";

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function recordCompletion(mysterySet: MysterySetName, when: Date = new Date()): void {
  const history = loadHistory();
  history.push({
    date: toLocalDateString(when),
    mysterySet,
    completedAt: when.toISOString(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

/** Current streak of consecutive calendar days with at least one completed Rosary,
 * counting back from today (or from yesterday if today has none yet). */
export function getCurrentStreak(history: HistoryEntry[], today: Date = new Date()): number {
  const days = new Set(history.map((h) => h.date));
  let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!days.has(toLocalDateString(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(toLocalDateString(cursor))) return 0;
  }
  let streak = 0;
  while (days.has(toLocalDateString(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
