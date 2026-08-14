import type { Settings } from "../state/settings.ts";

const FONT_SCALE: Record<Settings["textSize"], string> = {
  md: "1",
  lg: "1.18",
  xl: "1.4",
};

export function applyTheme(settings: Settings): void {
  const root = document.documentElement;
  if (settings.theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", settings.theme);
  }
  root.style.setProperty("--font-scale", FONT_SCALE[settings.textSize]);
}
