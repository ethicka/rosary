import { h } from "../util/dom.ts";
import { renderShell } from "../util/layout.ts";
import { MYSTERY_SETS, MYSTERY_SET_TAGLINE, getMysterySet, type MysterySetName } from "../data/mysteries.ts";

export function mountMysteries(container: HTMLElement): void {
  let selectedSet: MysterySetName | null = null;

  const body = h("div", {});
  renderShell(container, "mysteries", body);
  redraw();

  function redraw(): void {
    body.replaceChildren();
    if (selectedSet) {
      body.append(renderDetail(selectedSet));
    } else {
      body.append(renderGrid());
    }
  }

  function renderGrid(): HTMLElement {
    return h("div", {}, [
      h("h2", { class: "screen-title" }, ["The Mysteries"]),
      h("p", { class: "subtle" }, [
        "Browse every Mystery independent of an active Rosary, for study or preparation.",
      ]),
      h(
        "div",
        { class: "mystery-set-grid" },
        MYSTERY_SETS.map((set) =>
          h(
            "button",
            {
              class: "mystery-set-card",
              onclick: () => {
                selectedSet = set;
                redraw();
              },
            },
            [
              h("div", {}, [
                h("h3", {}, [`${set} Mysteries`]),
                h("p", { class: "subtle" }, [MYSTERY_SET_TAGLINE[set]]),
              ]),
              h("span", { class: "chevron", "aria-hidden": "true" }, ["→"]),
            ],
          ),
        ),
      ),
    ]);
  }

  function renderDetail(set: MysterySetName): HTMLElement {
    return h("div", {}, [
      h("h2", { class: "screen-title" }, [`${set} Mysteries`]),
      h("p", { class: "subtle", style: "margin-bottom: 1.25rem;" }, [MYSTERY_SET_TAGLINE[set]]),
      ...getMysterySet(set).map((m) =>
        h("article", { class: "mystery-entry" }, [
          h("h3", {}, [`${m.order}. ${m.title}`]),
          h("p", { class: "scripture-text" }, [`“${m.scripture_text}”`]),
          h("p", { class: "ref" }, [`${m.scripture_ref} · Fruit: ${m.fruit}`]),
        ]),
      ),
    ]);
  }
}
