import type { MysterySetName } from "../data/mysteries.ts";

export interface RosarySession {
  mysterySet: MysterySetName;
  /** Current index into the bead sequence generated from the options below. */
  index: number;
  includeFatima: boolean;
  includeStJoseph: boolean;
  skipDecadePrayers: boolean;
  startedAt: string;
}

const STORAGE_KEY = "rosary.session.v1";

export function loadSession(): RosarySession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as RosarySession;
  } catch {
    return null;
  }
}

export function saveSession(session: RosarySession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEY);
}
