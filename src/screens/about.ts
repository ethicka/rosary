import { h } from "../util/dom.ts";
import { renderShell } from "../util/layout.ts";

export function mountAbout(container: HTMLElement): void {
  const body = h("div", {}, [
    h("h2", { class: "screen-title" }, ["About This Site"]),
    h("p", {}, [
      "Prayer texts and Scripture readings are copied from the USCCB: ",
      h(
        "a",
        { href: "https://www.usccb.org/how-to-pray-the-rosary", target: "_blank", rel: "noopener noreferrer" },
        ["How to Pray the Rosary"],
      ),
      " and ",
      h(
        "a",
        { href: "https://www.usccb.org/prayers/prayers-rosary", target: "_blank", rel: "noopener noreferrer" },
        ["Prayers of the Rosary"],
      ),
      ".",
    ]),
    h("p", {}, [
      "No account, no ads. Your Rosary progress and settings stay on your device; anonymous, cookie-free page-view analytics (Vercel Analytics and Fathom) help us see how the app is used.",
    ]),
  ]);
  renderShell(container, "about", body);
}
