import { h } from "./dom.ts";
import { navigate, type RouteName } from "./router.ts";
import { CROSS_MARK_SVG } from "./icon.ts";

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
      h("span", { class: "logo-mark", html: CROSS_MARK_SVG }),
      "Rosary",
    ]),
    nav,
  ]);

  const main = h("main", { id: "main-content", tabindex: "-1" }, [content]);

  container.replaceChildren(header, main, renderFooter());
  // Move focus to the new screen's content so screen-reader users hear the
  // route change announced, matching standard SPA accessibility practice.
  main.focus({ preventScroll: false });
}

function renderFooter(): HTMLElement {
  return h("footer", { class: "app-footer" }, [
    h("p", {}, [
      "Prayer texts and Scripture readings are copied from the USCCB: ",
      h("a", { href: "https://www.usccb.org/how-to-pray-the-rosary", target: "_blank", rel: "noopener noreferrer" }, [
        "How to Pray the Rosary",
      ]),
      " and ",
      h("a", { href: "https://www.usccb.org/prayers/prayers-rosary", target: "_blank", rel: "noopener noreferrer" }, [
        "Prayers of the Rosary",
      ]),
      ".",
    ]),
    h("p", {}, ["No account, no tracking, no ads — everything stays on your device."]),
  ]);
}
