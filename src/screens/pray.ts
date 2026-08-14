import { h } from "../util/dom.ts";
import { navigate } from "../util/router.ts";
import { loadSession, saveSession, clearSession, type RosarySession } from "../state/session.ts";
import { loadSettings, type Settings, type HideablePrayer } from "../state/settings.ts";
import { buildBeadSequence, describeProgress, type Bead } from "../state/beadSequence.ts";
import { resolveBead } from "../util/resolveBead.ts";
import { getMysterySet, type MysterySetName } from "../data/mysteries.ts";
import { HOME_ICON_SVG } from "../util/icon.ts";

const NEXT_KEYS = new Set(["ArrowRight", "ArrowDown", "PageDown"]);
const PREV_KEYS = new Set(["ArrowLeft", "ArrowUp", "PageUp", "Backspace"]);

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
      clearSession();
      completed = true;
      redraw();
      return;
    }
    index++;
    persist();
    redraw();
  }

  function goPrev(): void {
    if (completed || index <= 0) return;
    index--;
    persist();
    redraw();
  }

  function onKeydown(e: KeyboardEvent): void {
    const target = e.target;
    if (target instanceof HTMLElement && ["SELECT", "INPUT", "TEXTAREA"].includes(target.tagName)) return;
    const isButtonFocused = target instanceof HTMLElement && ["BUTTON", "A"].includes(target.tagName);

    if (e.key === "Escape") {
      e.preventDefault();
      navigate("home");
      return;
    }
    if (NEXT_KEYS.has(e.key)) {
      e.preventDefault();
      goNext();
      return;
    }
    if (PREV_KEYS.has(e.key)) {
      e.preventDefault();
      goPrev();
      return;
    }
    if (!isButtonFocused && (e.key === " " || e.key === "Spacebar" || e.key === "Enter")) {
      e.preventDefault();
      goNext();
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
          class: "ghost small home-button",
          "aria-label": "Exit to Home",
          html: HOME_ICON_SVG,
          onclick: () => navigate("home"),
        },
        [],
      ),
      h("div", { class: "pray-progress" }, [
        h("div", {}, [progress.decadeLabel]),
        h("div", {}, [progress.detailLabel]),
      ]),
      h("div", { class: "pray-header-spacer" }),
    ]);

    const elements: HTMLElement[] = [headerEl];

    const showSubheader =
      bead.decade >= 1 && bead.decade <= 5 && bead.type !== "mysteryAnnounce" && mystery === undefined;
    if (showSubheader) {
      const subheaderMystery = resolveBead({ ...bead, type: "mysteryAnnounce" }, session.mysterySet).mystery;
      if (subheaderMystery) {
        elements.push(
          h("div", { class: "pray-subheader" }, [
            h("strong", {}, [`Decade ${bead.decade}: ${subheaderMystery.title}`]),
            h("span", { class: "subtle" }, [` · Fruit: ${subheaderMystery.fruit}`]),
          ]),
        );
      }
    }

    const innerEl = h("div", { class: "pray-main-inner" });

    if (mystery) {
      innerEl.append(renderMysteryAnnounce(mystery, bead.decade, settings));
    } else if (prayer) {
      innerEl.append(renderPrayer(prayer, bead, settings));
    }

    if (settings.beadsOnlyMode) {
      innerEl.append(h("div", { class: "bead-dot" }, [beadOrdinal(bead)]));
    }

    const mainEl = h(
      "div",
      {
        class: `pray-main${settings.beadsOnlyMode ? " beads-only" : ""}`,
        onclick: (e: Event) => {
          if (e.target instanceof HTMLElement && e.target.closest("button, a")) return;
          goNext();
        },
        ontouchstart: onTouchStart,
        ontouchend: onTouchEnd,
      },
      [innerEl],
    );

    const contentEl = h("div", { class: "pray-content" }, [mainEl, renderControls()]);
    const layoutEl = h("div", { class: "pray-layout" }, [
      renderSidebar(bead, session.mysterySet),
      contentEl,
    ]);
    elements.push(layoutEl);

    root.append(...elements);
  }

  function renderControls(): HTMLElement {
    const isLast = index >= sequence.length - 1;
    return h("div", { class: "pray-controls" }, [
      h(
        "button",
        { onclick: goPrev, disabled: index === 0, "aria-label": "Previous" },
        ["← Previous"],
      ),
      h(
        "button",
        { onclick: goNext, "aria-label": isLast ? "Finish" : "Next" },
        [isLast ? "Finish" : "Next", " →"],
      ),
    ]);
  }

  function renderCompletion(): void {
    root.append(
      h("div", { class: "pray-main" }, [
        h("div", { class: "pray-main-inner" }, [
          h("div", { class: "complete-banner" }, [
            h("h2", {}, ["Rosary Complete"]),
            h("p", {}, ["Peace be with you."]),
          ]),
          h("div", { class: "cta-row" }, [
            h("button", { class: "primary", onclick: () => navigate("home") }, ["Return Home"]),
          ]),
        ]),
      ]),
    );
  }

  return () => {
    document.removeEventListener("keydown", onKeydown);
  };
}

function renderSidebar(bead: Bead, mysterySet: MysterySetName): HTMLElement {
  const mysteries = getMysterySet(mysterySet);
  const items = mysteries.map((m) => {
    const decadeNum = m.order;
    let state: "done" | "active" | "upcoming";
    if (bead.decade === 6) state = "done";
    else if (bead.decade === 0) state = "upcoming";
    else if (bead.decade === decadeNum) state = "active";
    else if (bead.decade > decadeNum) state = "done";
    else state = "upcoming";

    return h(
      "li",
      {
        class: `decade-item decade-${state}`,
        "aria-current": state === "active" ? "step" : null,
      },
      [
        h("span", { class: "decade-num" }, [String(decadeNum)]),
        h("span", { class: "decade-name" }, [m.title]),
      ],
    );
  });
  return h("aside", { class: "decade-sidebar", "aria-label": "Decade progress" }, [h("ol", {}, items)]);
}

function beadOrdinal(bead: Bead): string {
  if (bead.type === "hailMary" && bead.count) return `×${bead.count}`;
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

function renderPrayer(
  prayer: ReturnType<typeof resolveBead>["prayer"],
  bead: Bead,
  settings: Settings,
): HTMLElement {
  if (!prayer) return h("div", {});
  const title = h("h2", { class: "prayer-title" }, [prayer.title]);

  const children: HTMLElement[] = [title];
  if (bead.type === "hailMary" && bead.count) {
    children.push(h("p", { class: "subtle repeat-count" }, [`Pray ${bead.count} times`]));
  }

  const hidden = settings.beadsOnlyMode || settings.hiddenPrayers.includes(bead.type as HideablePrayer);
  if (hidden) {
    return h("div", {}, children);
  }

  const textEl = h("div", { class: "prayer-text" }, [h("p", {}, [prayer.lines.join("\n")])]);
  children.push(textEl);

  return h("div", {}, children);
}
