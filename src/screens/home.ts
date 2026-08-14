import { h } from "../util/dom.ts";
import { renderShell } from "../util/layout.ts";
import { navigate } from "../util/router.ts";
import { getDefaultMysterySet } from "../data/liturgical.ts";
import { MYSTERY_SETS, MYSTERY_SET_TAGLINE, type MysterySetName } from "../data/mysteries.ts";
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

    body.append(
      h("p", { class: "home-sentence" }, [
        "Today is ",
        h("strong", {}, [dateStr]),
        " and the mystery is the ",
        h("strong", { class: "accent-text" }, [selectedSet]),
        " mysteries: ",
        MYSTERY_SET_TAGLINE[selectedSet],
        ".",
      ]),
    );

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
              redraw();
            },
          },
          MYSTERY_SETS.map((set) =>
            h("option", { value: set, selected: set === selectedSet }, [`${set} Mysteries`]),
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
      startedAt: new Date().toISOString(),
    });
    navigate("pray");
  }
}
