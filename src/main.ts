import "./style.css";
import { inject as injectAnalytics } from "@vercel/analytics";
import { registerRoute, startRouter } from "./util/router.ts";
import { loadSettings } from "./state/settings.ts";
import { applyTheme } from "./util/theme.ts";
import { mountHome } from "./screens/home.ts";
import { mountPray } from "./screens/pray.ts";
import { mountSettings } from "./screens/settings.ts";
import { mountMysteries } from "./screens/mysteries.ts";
import { initShortcutsModal } from "./util/shortcutsModal.ts";

applyTheme(loadSettings());

registerRoute("home", mountHome);
registerRoute("pray", mountPray);
registerRoute("settings", mountSettings);
registerRoute("mysteries", mountMysteries);

initShortcutsModal();
startRouter();
injectAnalytics();

// The app navigates via hash-based routing, which Fathom's own script
// can't observe on its own — send it a pageview on every route change.
document.addEventListener("route:changed", () => {
  window.fathom?.trackPageview();
});

if ("serviceWorker" in navigator) {
  import("virtual:pwa-register").then(({ registerSW }) => {
    registerSW({ immediate: true });
  });
}
