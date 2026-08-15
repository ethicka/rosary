import { h } from "../util/dom.ts";
import { renderShell } from "../util/layout.ts";
import { navigate } from "../util/router.ts";
import { getDefaultMysterySet } from "../data/liturgical.ts";
import { MYSTERY_SETS, MYSTERY_SET_TAGLINE, MYSTERY_SET_DAYS, type MysterySetName } from "../data/mysteries.ts";
import { loadSettings } from "../state/settings.ts";
import { loadSession, saveSession, clearSession } from "../state/session.ts";
import { buildBeadSequence, describeProgress } from "../state/beadSequence.ts";

export function mountHome(container: HTMLElement): void {
  const today = new Date();
  const defaultSelection = getDefaultMysterySet(today);
  let selectedSet: MysterySetName = defaultSelection.set;

  const body = h("div", { class: "home-body" });
  renderShell(container, "home", body);
  redraw();

  function redraw(): void {
    body.replaceChildren();

    const dateStr = today.toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const existingSession = loadSession();
    if (existingSession) {
      const sequence = buildBeadSequence({
        includeFatima: existingSession.includeFatima,
        includeStJoseph: existingSession.includeStJoseph,
        skipDecadePrayers: existingSession.skipDecadePrayers,
      });
      const notFinished = existingSession.index < sequence.length - 1;
      if (notFinished) {
        const bead = sequence[Math.min(existingSession.index, sequence.length - 1)];
        const progress = describeProgress(bead, existingSession.mysterySet);
        body.append(
          h("div", { class: "resume-banner", role: "region", "aria-label": "Resume Rosary" }, [
            h("div", {}, [
              h("strong", {}, [`Rosary in progress - ${existingSession.mysterySet} Mysteries`]),
              h("div", { class: "subtle" }, [`${progress.decadeLabel} · ${progress.detailLabel}`]),
            ]),
            h("div", { class: "cta-row", style: "margin: 0;" }, [
              h(
                "button",
                {
                  class: "primary",
                  onclick: () => navigate("pray"),
                },
                ["Resume"],
              ),
              h(
                "button",
                {
                  class: "ghost small",
                  onclick: () => {
                    clearSession();
                    redraw();
                  },
                },
                ["Discard"],
              ),
            ]),
          ]),
        );
      }
    }

    // Sundays in Advent or Lent override the usual Sunday (Glorious) default —
    // call that out explicitly so it doesn't read as a mistake.
    const isSeasonalException =
      defaultSelection.reason === "Sunday in Advent" || defaultSelection.reason === "Sunday in Lent";

    const sentence = isSeasonalException
      ? [
          "Today is ",
          h("strong", {}, [dateStr]),
          ". Sundays are usually the Glorious mysteries, but during ",
          defaultSelection.reason.endsWith("Advent") ? "Advent" : "Lent",
          " the mystery is the ",
          h("strong", { class: "accent-text" }, [defaultSelection.set]),
          " mysteries: ",
          MYSTERY_SET_TAGLINE[defaultSelection.set],
          ".",
        ]
      : [
          "Today is ",
          h("strong", {}, [dateStr]),
          " and the mystery is the ",
          h("strong", { class: "accent-text" }, [defaultSelection.set]),
          " mysteries: ",
          MYSTERY_SET_TAGLINE[defaultSelection.set],
          ".",
        ];

    body.append(h("p", { class: "home-sentence" }, sentence));

    body.append(
      h("div", { class: "home-actions" }, [
        h(
          "label",
          { class: "sr-only", for: "mystery-set-select" },
          ["Choose Mystery set"],
        ),
        h(
          "select",
          {
            id: "mystery-set-select",
            onchange: (e: Event) => {
              selectedSet = (e.target as HTMLSelectElement).value as MysterySetName;
            },
          },
          MYSTERY_SETS.map((set) =>
            h("option", { value: set, selected: set === selectedSet }, [
              `${set} Mysteries (${MYSTERY_SET_DAYS[set]})`,
            ]),
          ),
        ),
        h(
          "button",
          {
            class: "primary",
            onclick: () => startRosary(),
          },
          ["Start Rosary"],
        ),
      ]),
    );
  }

  function startRosary(): void {
    const settings = loadSettings();
    saveSession({
      mysterySet: selectedSet,
      index: 0,
      includeFatima: settings.includeFatima,
      includeStJoseph: settings.includeStJoseph,
      skipDecadePrayers: settings.skipDecadePrayers,
      startedAt: new Date().toISOString(),
    });
    navigate("pray");
  }
}
