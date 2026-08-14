export type RouteName = "home" | "pray" | "settings" | "mysteries" | "history";

export type RouteRenderer = (container: HTMLElement) => void | (() => void);

const routes = new Map<RouteName, RouteRenderer>();
let cleanup: (() => void) | void;

export function registerRoute(name: RouteName, renderer: RouteRenderer): void {
  routes.set(name, renderer);
}

function currentRoute(): RouteName {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const name = hash.split("?")[0] as RouteName;
  return routes.has(name) ? name : "home";
}

export function navigate(name: RouteName): void {
  if (window.location.hash === `#/${name}`) {
    render();
  } else {
    window.location.hash = `#/${name}`;
  }
}

function render(): void {
  const app = document.getElementById("app");
  if (!app) return;
  if (typeof cleanup === "function") {
    cleanup();
    cleanup = undefined;
  }
  const name = currentRoute();
  const container = document.createElement("div");
  container.id = "screen";
  container.className = `screen screen-${name}`;
  app.replaceChildren(container);
  const renderer = routes.get(name);
  if (renderer) {
    cleanup = renderer(container);
  }
  document.dispatchEvent(new CustomEvent("route:changed", { detail: { name } }));
}

export function startRouter(): void {
  window.addEventListener("hashchange", render);
  render();
}

export function getCurrentRouteName(): RouteName {
  return currentRoute();
}
