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

  const body = h("div", {});
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

    body.append(
      h("div", { class: "home-hero" }, [h("p", { class: "hero-date" }, [dateStr])]),
    );

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
      h("div", { class: "today-card" }, [
        h("p", { class: "eyebrow" }, [`Today's Mystery · ${defaultSelection.reason}`]),
        h("h2", { class: "set-name" }, [`${defaultSelection.set} Mysteries`]),
        h("p", { class: "set-tagline" }, [MYSTERY_SET_TAGLINE[defaultSelection.set]]),
      ]),
    );

    body.append(h("p", { class: "picker-label subtle" }, ["Or pray a different set:"]));
    body.append(
      h(
        "div",
        { class: "set-picker", role: "group", "aria-label": "Choose Mystery set" },
        MYSTERY_SETS.map((set) =>
          h(
            "button",
            {
              "aria-pressed": String(set === selectedSet),
              onclick: () => {
                selectedSet = set;
                redraw();
              },
            },
            [`${set}`],
          ),
        ),
      ),
    );

    body.append(
      h("div", { class: "cta-row" }, [
        h(
          "button",
          {
            class: "primary start-button",
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
