import { h } from "./dom.ts";
import { navigate, type RouteName } from "./router.ts";

const NAV_ITEMS: { route: RouteName; label: string }[] = [
  { route: "home", label: "Home" },
  { route: "mysteries", label: "Mysteries" },
  { route: "history", label: "History" },
  { route: "settings", label: "Settings" },
];

export function renderShell(container: HTMLElement, active: RouteName, content: HTMLElement): void {
  const nav = h(
    "nav",
    { class: "app-nav", "aria-label": "Main navigation" },
    NAV_ITEMS.map((item) =>
      h(
        "a",
        {
          href: `#/${item.route}`,
          "aria-current": item.route === active ? "page" : null,
          onclick: (e: Event) => {
            e.preventDefault();
            navigate(item.route);
          },
        },
        [item.label],
      ),
    ),
  );

  const header = h("header", { class: "app-header" }, [
    h("h1", {}, ["✤ Rosary"]),
    nav,
  ]);

  const main = h("main", { id: "main-content", tabindex: "-1" }, [content]);

  container.replaceChildren(header, main);
  // Move focus to the new screen's content so screen-reader users hear the
  // route change announced, matching standard SPA accessibility practice.
  main.focus({ preventScroll: false });
}
