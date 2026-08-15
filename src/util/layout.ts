import { h } from "./dom.ts";
import { navigate, type RouteName } from "./router.ts";
import { ROSARY_MARK_SVG } from "./icon.ts";

const NAV_ITEMS: { route: RouteName; label: string }[] = [
  { route: "home", label: "Home" },
  { route: "mysteries", label: "Mysteries" },
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
    h("h1", { class: "app-logo" }, [
      h(
        "a",
        {
          href: "#/home",
          class: "app-logo-link",
          onclick: (e: Event) => {
            e.preventDefault();
            navigate("home");
          },
        },
        [h("span", { class: "logo-mark", html: ROSARY_MARK_SVG }), "Rosary"],
      ),
    ]),
    nav,
  ]);

  const main = h("main", { id: "main-content", tabindex: "-1" }, [content]);

  container.replaceChildren(header, main, renderFooter());
  // Move focus to the new screen's content so screen-reader users hear the
  // route change announced, matching standard SPA accessibility practice.
  // preventScroll avoids the browser also scrolling the header out of view
  // to bring the newly focused (but already-visible) main element flush to
  // the top of the viewport.
  main.focus({ preventScroll: true });
}

function renderFooter(): HTMLElement {
  return h("footer", { class: "app-footer" }, [
    h("p", {}, [
      "Project by William Donahoe · ",
      h("a", { href: "https://github.com/ethicka", target: "_blank", rel: "noopener noreferrer" }, ["GitHub"]),
    ]),
    h("p", {}, [
      h(
        "a",
        {
          href: "#/about",
          onclick: (e: Event) => {
            e.preventDefault();
            navigate("about");
          },
        },
        ["About this site"],
      ),
    ]),
  ]);
}
