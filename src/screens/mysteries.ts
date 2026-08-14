import { h } from "../util/dom.ts";
import { renderShell } from "../util/layout.ts";
import { MYSTERY_SETS, getMysterySet } from "../data/mysteries.ts";

export function mountMysteries(container: HTMLElement): void {
  const body = h("div", {}, [
    h("h2", { class: "screen-title" }, ["The 20 Mysteries"]),
    h("p", { class: "subtle" }, [
      "Browse every Mystery independent of an active Rosary, for study or preparation.",
    ]),
    ...MYSTERY_SETS.map((set) =>
      h("section", { class: "mystery-set-section" }, [
        h("h2", {}, [`${set} Mysteries`]),
        ...getMysterySet(set).map((m) =>
          h("article", { class: "mystery-entry" }, [
            h("h3", {}, [`${m.order}. ${m.title}`]),
            h("p", { class: "scripture-text" }, [`“${m.scripture_text}”`]),
            h("p", { class: "ref" }, [`${m.scripture_ref} · Fruit: ${m.fruit}`]),
          ]),
        ),
      ]),
    ),
  ]);
  renderShell(container, "mysteries", body);
}
