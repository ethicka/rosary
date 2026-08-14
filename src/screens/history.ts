import { h } from "../util/dom.ts";
import { renderShell } from "../util/layout.ts";
import { loadHistory, getCurrentStreak } from "../state/history.ts";

export function mountHistory(container: HTMLElement): void {
  const history = loadHistory();
  const streak = getCurrentStreak(history);
  const total = history.length;
  const recent = [...history].reverse().slice(0, 30);

  const body = h("div", {}, [
    h("h2", { class: "screen-title" }, ["Streak & History"]),
    h("div", { class: "stat-row" }, [
      h("div", { class: "stat-tile" }, [
        h("span", { class: "value" }, [String(streak)]),
        h("span", { class: "label" }, ["day streak"]),
      ]),
      h("div", { class: "stat-tile" }, [
        h("span", { class: "value" }, [String(total)]),
        h("span", { class: "label" }, ["Rosaries prayed"]),
      ]),
    ]),
    recent.length === 0
      ? h("p", { class: "empty-state" }, ["No completed Rosaries yet. Once you finish one, it will appear here."])
      : h(
          "ul",
          { class: "history-list" },
          recent.map((entry) =>
            h("li", {}, [
              h("span", {}, [
                new Date(entry.completedAt).toLocaleDateString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                }),
              ]),
              h("span", { class: "subtle" }, [`${entry.mysterySet} Mysteries`]),
            ]),
          ),
        ),
  ]);

  renderShell(container, "history", body);
}
