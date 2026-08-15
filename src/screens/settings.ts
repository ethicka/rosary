import { h } from "../util/dom.ts";
import { renderShell } from "../util/layout.ts";
import { loadSettings, saveSettings, type Settings, type HideablePrayer } from "../state/settings.ts";
import { applyTheme } from "../util/theme.ts";
import { renderShortcutList } from "../util/shortcutList.ts";
import { PRAYER_SHORTCUTS, GLOBAL_SHORTCUTS } from "../data/shortcuts.ts";
import { en } from "../data/i18n/en.ts";

const HIDEABLE_PRAYERS: { type: HideablePrayer; title: string }[] = [
  { type: "signOfCross", title: en.prayers.signOfCross.title },
  { type: "creed", title: en.prayers.creed.title },
  { type: "ourFather", title: en.prayers.ourFather.title },
  { type: "hailMary", title: en.prayers.hailMary.title },
  { type: "gloryBe", title: en.prayers.gloryBe.title },
  { type: "fatima", title: en.prayers.fatima.title },
  { type: "hailHolyQueen", title: en.prayers.hailHolyQueen.title },
  { type: "versicleResponse", title: en.prayers.versicleResponse.title },
  { type: "closingPrayer", title: en.prayers.closingPrayer.title },
  { type: "stJoseph", title: en.prayers.stJoseph.title },
];

export function mountSettings(container: HTMLElement): void {
  const settings = loadSettings();
  const body = h("div", {});
  renderShell(container, "settings", body);
  redraw();

  function update<K extends keyof Settings>(key: K, value: Settings[K]): void {
    settings[key] = value;
    saveSettings(settings);
    applyTheme(settings);
    redraw();
  }

  function toggleHidden(type: HideablePrayer, hide: boolean): void {
    const set = new Set(settings.hiddenPrayers);
    if (hide) set.add(type);
    else set.delete(type);
    update("hiddenPrayers", Array.from(set));
  }

  function redraw(): void {
    body.replaceChildren(
      h("h2", { class: "screen-title" }, ["Settings"]),

      h("fieldset", {}, [
        h("legend", {}, ["Display"]),
        row("Text size", [
          selectField(
            settings.textSize,
            [
              { value: "md", label: "Standard" },
              { value: "lg", label: "Large" },
              { value: "xl", label: "Extra Large" },
            ],
            (v) => update("textSize", v as Settings["textSize"]),
          ),
        ]),
        row("Theme", [
          selectField(
            settings.theme,
            [
              { value: "system", label: "Match device" },
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
            ],
            (v) => update("theme", v as Settings["theme"]),
          ),
        ]),
        row(
          "Beads-only mode",
          [toggle(settings.beadsOnlyMode, (v) => update("beadsOnlyMode", v))],
          "Hide all prayer text and show only a minimal bead counter, for silent prayer from memory.",
        ),
        row(
          "Skip prayers between Mysteries",
          [toggle(settings.skipDecadePrayers, (v) => update("skipDecadePrayers", v))],
          "Step through just the five Mysteries, skipping the Our Father, Hail Marys, and Glory Be of each decade — for when you already know them by heart. Opening and closing prayers are unaffected.",
        ),
      ]),

      h("fieldset", {}, [
        h("legend", {}, ["Prayers"]),
        row(
          "Include Fatima Prayer",
          [toggle(settings.includeFatima, (v) => update("includeFatima", v))],
          "“O my Jesus…” said after the Glory Be of each decade.",
        ),
        row(
          "Include Prayer to St. Joseph",
          [toggle(settings.includeStJoseph, (v) => update("includeStJoseph", v))],
          "Said near the end, after the Hail, Holy Queen.",
        ),
      ]),

      h("fieldset", {}, [
        h("legend", {}, ["Prayers you know by heart"]),
        h("p", { class: "subtle", style: "margin: -0.25rem 0 0.75rem; font-size: 0.85em;" }, [
          "Hide the text for prayers you've memorized — only the title will show.",
        ]),
        ...HIDEABLE_PRAYERS.map((p) =>
          row(p.title, [
            toggle(settings.hiddenPrayers.includes(p.type), (v) => toggleHidden(p.type, v)),
          ]),
        ),
      ]),

      h("fieldset", {}, [
        h("legend", {}, ["Language"]),
        row("Prayer language", [
          selectField("en", [{ value: "en", label: "English" }], () => {}),
        ]),
      ]),

      h("fieldset", {}, [
        h("legend", {}, ["Keyboard shortcuts"]),
        renderShortcutList([...GLOBAL_SHORTCUTS, ...PRAYER_SHORTCUTS]),
      ]),
    );
  }
}

function row(label: string, controls: HTMLElement[], hint?: string): HTMLElement {
  return h("div", {}, [
    h("label", { class: "option-row" }, [h("span", {}, [label]), ...controls]),
    hint ? h("p", { class: "subtle", style: "margin: -0.4rem 0 0.6rem; font-size: 0.85em;" }, [hint]) : null,
  ]);
}

function toggle(value: boolean, onChange: (v: boolean) => void): HTMLElement {
  return h("input", {
    type: "checkbox",
    checked: value,
    "aria-checked": String(value),
    onchange: (e: Event) => onChange((e.target as HTMLInputElement).checked),
  });
}

function selectField(
  value: string,
  options: { value: string; label: string }[],
  onChange: (v: string) => void,
): HTMLElement {
  return h(
    "select",
    { onchange: (e: Event) => onChange((e.target as HTMLSelectElement).value) },
    options.map((o) => h("option", { value: o.value, selected: o.value === value }, [o.label])),
  );
}
