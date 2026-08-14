import type { BeadType } from "./beadSequence.ts";

export type TextSize = "md" | "lg" | "xl";
export type Theme = "system" | "light" | "dark";

/** Bead types whose prayer text can be individually hidden ("known by heart"). Excludes mysteryAnnounce, which isn't a recited prayer. */
export type HideablePrayer = Exclude<BeadType, "mysteryAnnounce">;

export interface Settings {
  textSize: TextSize;
  theme: Theme;
  includeFatima: boolean;
  includeStJoseph: boolean;
  beadsOnlyMode: boolean;
  hiddenPrayers: HideablePrayer[];
  language: "en";
}

const STORAGE_KEY = "rosary.settings.v1";

export const DEFAULT_SETTINGS: Settings = {
  textSize: "md",
  theme: "system",
  includeFatima: true,
  includeStJoseph: false,
  beadsOnlyMode: false,
  hiddenPrayers: [],
  language: "en",
};

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
