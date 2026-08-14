import { h } from "./dom.ts";
import type { ShortcutEntry } from "../data/shortcuts.ts";

export function renderShortcutList(entries: ShortcutEntry[]): HTMLElement {
  return h(
    "ul",
    { class: "shortcut-list" },
    entries.map((entry) =>
      h("li", { class: "shortcut-row" }, [
        h(
          "span",
          { class: "shortcut-keys" },
          entry.keys.map((k) => h("kbd", {}, [k])),
        ),
        h("span", { class: "subtle" }, [entry.action]),
      ]),
    ),
  );
}
