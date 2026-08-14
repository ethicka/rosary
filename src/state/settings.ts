export type TextSize = "md" | "lg" | "xl";
export type Theme = "system" | "light" | "dark";
export type AudioCue = "off" | "sound" | "vibrate";

export interface Settings {
  textSize: TextSize;
  theme: Theme;
  includeFatima: boolean;
  includeStJoseph: boolean;
  audioCue: AudioCue;
  leaderMode: boolean;
  beadsOnlyMode: boolean;
  language: "en";
}

const STORAGE_KEY = "rosary.settings.v1";

export const DEFAULT_SETTINGS: Settings = {
  textSize: "md",
  theme: "system",
  includeFatima: true,
  includeStJoseph: false,
  audioCue: "off",
  leaderMode: false,
  beadsOnlyMode: false,
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
