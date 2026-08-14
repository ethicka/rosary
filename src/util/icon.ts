/** The app's cross mark, as inline SVG markup (uses currentColor so callers control tint via CSS `color`). */
export const CROSS_MARK_SVG = `<svg viewBox="0 0 512 512" width="1em" height="1em" aria-hidden="true" focusable="false">
  <rect x="212" y="100" width="88" height="328" rx="16" fill="currentColor"/>
  <rect x="128" y="220" width="256" height="88" rx="16" fill="currentColor"/>
</svg>`;

/** A simple outline house mark, as inline SVG markup (uses currentColor). */
export const HOME_ICON_SVG = `<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
  <path d="M3 11.5 12 4l9 7.5"/>
  <path d="M5.5 10v9a1 1 0 0 0 1 1H9a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h2.5a1 1 0 0 0 1-1v-9"/>
</svg>`;
