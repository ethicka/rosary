import { h } from "../util/dom.ts";
import { navigate } from "../util/router.ts";
import { loadSession, saveSession, clearSession, type RosarySession } from "../state/session.ts";
import { loadSettings, saveSettings, type Settings } from "../state/settings.ts";
import { buildBeadSequence, describeProgress, type Bead } from "../state/beadSequence.ts";
import { resolveBead } from "../util/resolveBead.ts";
import { recordCompletion } from "../state/history.ts";
import { playAdvanceCue } from "../util/cue.ts";

const CUE_CYCLE: Settings["audioCue"][] = ["off", "sound", "vibrate"];
const CUE_LABEL: Record<Settings["audioCue"], string> = {
  off: "Cues off",
  sound: "Sound",
  vibrate: "Vibrate",
};

export function mountPray(container: HTMLElement): () => void {
  const loaded = loadSession();
  if (!loaded) {
    navigate("home");
    return () => {};
  }
  const session: RosarySession = loaded;

  const settings = loadSettings();
  const sequence = buildBeadSequence({
    includeFatima: session.includeFatima,
    includeStJoseph: session.includeStJoseph,
  });

  let index = Math.min(session.index, sequence.length - 1);
  let completed = false;

  const liveRegion = h("div", { class: "sr-only", "aria-live": "polite", role: "status" });
  const root = h("div", { class: "pray-screen" }, [liveRegion]);
  container.append(root);

  redraw();

  function persist(): void {
    const updated: RosarySession = { ...session, index };
    saveSession(updated);
  }

  function goNext(): void {
    if (completed) return;
    if (index >= sequence.length - 1) {
      recordCompletion(session.mysterySet);
      clearSession();
      completed = true;
      redraw();
      return;
    }
    index++;
    persist();
    playAdvanceCue(settings.audioCue);
    redraw();
  }

  function goPrev(): void {
    if (completed || index <= 0) return;
    index--;
    persist();
    redraw();
  }

  function cycleCue(): void {
    const next = CUE_CYCLE[(CUE_CYCLE.indexOf(settings.audioCue) + 1) % CUE_CYCLE.length];
    settings.audioCue = next;
    saveSettings(settings);
    redraw();
  }

  function onKeydown(e: KeyboardEvent): void {
    if (e.target instanceof HTMLElement && ["SELECT", "INPUT", "TEXTAREA"].includes(e.target.tagName)) return;
    if (e.key === "ArrowRight" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      goNext();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    }
  }
  document.addEventListener("keydown", onKeydown);

  let touchStartX: number | null = null;
  function onTouchStart(e: TouchEvent): void {
    touchStartX = e.changedTouches[0]?.clientX ?? null;
  }
  function onTouchEnd(e: TouchEvent): void {
    if (touchStartX === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX;
    const delta = endX - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) < 40) return;
    if (delta < 0) goNext();
    else goPrev();
  }

  function redraw(): void {
    root.replaceChildren(liveRegion);

    if (completed) {
      renderCompletion();
      return;
    }

    const bead = sequence[index];
    const progress = describeProgress(bead, session.mysterySet);
    const { prayer, mystery } = resolveBead(bead, session.mysterySet);

    liveRegion.textContent = `${progress.decadeLabel}. ${progress.detailLabel}.${
      mystery ? " " + mystery.title : ""
    }`;

    const headerEl = h("header", { class: "pray-header" }, [
      h(
        "button",
        {
          class: "ghost small",
          "aria-label": "Exit to Home",
          onclick: () => navigate("home"),
        },
        ["← Home"],
      ),
      h("div", { class: "pray-progress" }, [
        h("div", {}, [progress.decadeLabel]),
        h("div", {}, [progress.detailLabel]),
      ]),
      h(
        "button",
        {
          class: "ghost small",
          "aria-label": `Advance cue: ${CUE_LABEL[settings.audioCue]}. Activate to change.`,
          onclick: cycleCue,
        },
        [CUE_LABEL[settings.audioCue]],
      ),
    ]);

    const mainEl = h("div", {
      class: `pray-main${settings.beadsOnlyMode ? " beads-only" : ""}`,
      onclick: (e: Event) => {
        if (e.target instanceof HTMLElement && e.target.closest("button, a")) return;
        goNext();
      },
      ontouchstart: onTouchStart,
      ontouchend: onTouchEnd,
    });

    const showMysteryChip =
      bead.decade >= 1 && bead.decade <= 5 && bead.type !== "mysteryAnnounce" && mystery === undefined;
    if (showMysteryChip) {
      const chipMystery = resolveBead({ ...bead, type: "mysteryAnnounce" }, session.mysterySet).mystery;
      if (chipMystery) {
        mainEl.append(
          h("div", { class: "mystery-chip" }, [
            h("strong", {}, [`Decade ${bead.decade}: ${chipMystery.title}`]),
            h("span", {}, [`Fruit: ${chipMystery.fruit}`]),
          ]),
        );
      }
    }

    if (mystery) {
      mainEl.append(renderMysteryAnnounce(mystery, bead.decade, settings));
    } else if (prayer) {
      mainEl.append(renderPrayer(prayer, settings));
    }

    if (settings.beadsOnlyMode) {
      mainEl.append(h("div", { class: "bead-dot" }, [beadOrdinal(bead)]));
    }

    root.append(headerEl, mainEl, renderControls());
  }

  function renderControls(): HTMLElement {
    return h("div", { class: "pray-controls" }, [
      h(
        "button",
        { onclick: goPrev, disabled: index === 0, "aria-label": "Previous" },
        ["Prev"],
      ),
      h(
        "button",
        { class: "primary", onclick: goNext, "aria-label": index >= sequence.length - 1 ? "Finish" : "Next" },
        [index >= sequence.length - 1 ? "Finish" : "Next"],
      ),
    ]);
  }

  function renderCompletion(): void {
    root.append(
      h("div", { class: "pray-main" }, [
        h("div", { class: "complete-banner" }, [
          h("h2", {}, ["Rosary Complete"]),
          h("p", { class: "subtle" }, [`${session.mysterySet} Mysteries · ${new Date().toLocaleDateString()}`]),
        ]),
        h("div", { class: "cta-row" }, [
          h("button", { class: "primary", onclick: () => navigate("home") }, ["Return Home"]),
        ]),
      ]),
    );
  }

  return () => {
    document.removeEventListener("keydown", onKeydown);
  };
}

function beadOrdinal(bead: Bead): string {
  if (bead.type === "hailMary" && bead.beadInDecade) return String(bead.beadInDecade);
  return "•";
}

function renderMysteryAnnounce(
  mystery: ReturnType<typeof resolveBead>["mystery"],
  decade: number,
  settings: Settings,
): HTMLElement {
  if (!mystery) return h("div", {});
  const children: (HTMLElement | null)[] = [
    h("p", { class: "subtle" }, [`Decade ${decade} of 5`]),
    h("h2", { class: "mystery-title" }, [mystery.title]),
    h("p", { class: "fruit" }, [`Fruit: ${mystery.fruit}`]),
  ];
  if (!settings.beadsOnlyMode) {
    children.push(
      h("p", { class: "scripture" }, [`“${mystery.scripture_text}”`]),
      h("p", { class: "subtle" }, [mystery.scripture_ref]),
    );
  }
  return h("div", { class: "mystery-announce" }, children);
}

function renderPrayer(prayer: ReturnType<typeof resolveBead>["prayer"], settings: Settings): HTMLElement {
  if (!prayer) return h("div", {});
  const title = h("h2", { class: "prayer-title" }, [prayer.title]);
  if (settings.beadsOnlyMode) {
    return h("div", {}, [title]);
  }

  const useLeaderSplit = settings.leaderMode && prayer.leaderLines;
  const textEl = h("div", { class: "prayer-text" });

  if (useLeaderSplit) {
    const leaderLines = prayer.lines.slice(0, prayer.leaderLines);
    const allLines = prayer.lines.slice(prayer.leaderLines);
    textEl.append(
      h("span", { class: "call-response-label" }, ["Leader"]),
      h("p", {}, [h("span", { class: "leader-line" }, [leaderLines.join(" ")])]),
      h("span", { class: "call-response-label" }, ["All"]),
      h("p", {}, [h("span", { class: "all-line" }, [allLines.join(" ")])]),
    );
  } else {
    textEl.append(h("p", {}, [prayer.lines.join(" ")]));
  }

  return h("div", {}, [title, textEl]);
}
