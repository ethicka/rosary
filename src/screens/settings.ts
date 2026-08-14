import { h } from "../util/dom.ts";
import { renderShell } from "../util/layout.ts";
import { loadSettings, saveSettings, type Settings } from "../state/settings.ts";
import { applyTheme } from "../util/theme.ts";

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
          "Group leader mode",
          [toggle(settings.leaderMode, (v) => update("leaderMode", v))],
          "Larger text with a Leader / All response split for the Our Father and Hail Mary.",
        ),
        row(
          "Beads-only mode",
          [toggle(settings.beadsOnlyMode, (v) => update("beadsOnlyMode", v))],
          "Hide prayer text and show only a minimal bead counter, for silent prayer from memory.",
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
        h("legend", {}, ["Cues"]),
        row("Advance cue", [
          selectField(
            settings.audioCue,
            [
              { value: "off", label: "Off" },
              { value: "sound", label: "Sound" },
              { value: "vibrate", label: "Vibrate" },
            ],
            (v) => update("audioCue", v as Settings["audioCue"]),
          ),
        ]),
      ]),

      h("fieldset", {}, [
        h("legend", {}, ["Language"]),
        row("Prayer language", [
          selectField("en", [{ value: "en", label: "English" }], () => {}),
        ]),
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
