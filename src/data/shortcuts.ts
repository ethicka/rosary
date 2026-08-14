export interface ShortcutEntry {
  keys: string[];
  action: string;
}

/** Shortcuts active on the Prayer screen. */
export const PRAYER_SHORTCUTS: ShortcutEntry[] = [
  { keys: ["→", "↓", "Space", "Enter"], action: "Next" },
  { keys: ["←", "↑", "Backspace"], action: "Previous" },
  { keys: ["Esc"], action: "Exit to Home" },
];

/** Shortcuts active anywhere in the app. */
export const GLOBAL_SHORTCUTS: ShortcutEntry[] = [
  { keys: ["Shift", "?"], action: "Show this help" },
];
