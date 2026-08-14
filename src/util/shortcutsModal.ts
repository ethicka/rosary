import { h } from "./dom.ts";
import { renderShortcutList } from "./shortcutList.ts";
import { PRAYER_SHORTCUTS } from "../data/shortcuts.ts";

let overlay: HTMLElement | null = null;
let lastFocused: Element | null = null;

function close(): void {
  if (!overlay) return;
  overlay.remove();
  overlay = null;
  if (lastFocused instanceof HTMLElement) lastFocused.focus();
}

function open(): void {
  if (overlay) return;
  lastFocused = document.activeElement;

  const closeButton = h(
    "button",
    { class: "ghost small", "aria-label": "Close", onclick: close },
    ["✕"],
  );

  const dialog = h(
    "div",
    { class: "modal-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "shortcuts-modal-title" },
    [
      h("div", { class: "modal-header" }, [
        h("h2", { id: "shortcuts-modal-title" }, ["Keyboard Shortcuts"]),
        closeButton,
      ]),
      h("p", { class: "subtle" }, ["Available while praying the Rosary:"]),
      renderShortcutList(PRAYER_SHORTCUTS),
      h("p", { class: "subtle", style: "margin-top: 1rem;" }, [
        "Press ",
        h("kbd", {}, ["Shift"]),
        " + ",
        h("kbd", {}, ["?"]),
        " anywhere to open this help.",
      ]),
    ],
  );

  overlay = h("div", { class: "modal-overlay", onclick: (e: Event) => { if (e.target === overlay) close(); } }, [
    dialog,
  ]);

  document.body.append(overlay);
  dialog.setAttribute("tabindex", "-1");
  dialog.focus();
}

function isOpen(): boolean {
  return overlay !== null;
}

function onKeydown(e: KeyboardEvent): void {
  // While open, swallow every keystroke before other document-level
  // listeners (e.g. the Prayer screen's own navigation shortcuts) see it.
  if (isOpen()) {
    if (e.key === "Escape" || e.key === "?") {
      e.preventDefault();
      close();
    }
    e.stopImmediatePropagation();
    return;
  }
  const target = e.target;
  const isFormEl = target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
  // "?" is Shift+/ on a standard layout, so e.key already reflects the Shift press.
  if (e.key === "?" && !isFormEl) {
    e.preventDefault();
    open();
  }
}

export function initShortcutsModal(): void {
  document.addEventListener("keydown", onKeydown);
}
