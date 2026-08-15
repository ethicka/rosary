# The Holy Rosary

A single-page, offline-first web app that walks you through praying the Rosary — the correct prayer text, the correct Mystery for the day, a short Scripture reading per Mystery, and nothing else. No account, no ads, no gamification.

Prayer texts and Scripture readings are copied verbatim from the USCCB: [How to Pray the Rosary](https://www.usccb.org/how-to-pray-the-rosary) and [Prayers of the Rosary](https://www.usccb.org/prayers/prayers-rosary).

## Features

- **Today's Mystery, automatically.** Day-of-week selection per USCCB's traditional schedule, with real liturgical-season awareness — Advent and Lent Sundays are computed from Easter (Anonymous Gregorian algorithm), not hardcoded.
- **Bead-by-bead walkthrough.** One step per prayer — the ten Hail Marys of a decade are a single "Hail Mary ×10" step, not ten individual taps.
- **Decade tracker.** A sidebar (a horizontal strip on narrow screens) shows progress through the five decades of the active Mystery set.
- **Resume in progress.** Session position is saved to `localStorage`; closing the tab or locking your phone mid-Rosary picks up exactly where you left off.
- **Prayers you know by heart.** Hide the text of any individual prayer you've memorized — only its title shows.
- **Beads-only mode.** Hide all prayer text globally for fully silent, from-memory prayer.
- **Keyboard shortcuts.** Arrow keys / Space / Enter to advance, Escape to exit; `Shift + ?` opens a shortcuts help dialog from anywhere in the app.
- **Offline-first PWA.** A service worker precaches all prayer text, Scripture, and images, so it's fully usable with no connection — installable to a home screen.
- **Accessible.** Full keyboard navigation, `aria-live` progress announcements, WCAG AA contrast in both light and dark themes, `prefers-reduced-motion` support.
- **Mystery Reference.** All 20 Mysteries — title, Scripture text, reference, and fruit — browsable independent of an active session.

## Tech stack

Vanilla TypeScript + [Vite](https://vitejs.dev/), no UI framework. Static JSON/TS data modules, `localStorage` for all persistence, [`vite-plugin-pwa`](https://vite-pwa-org.netlify.app/) for the service worker and manifest. No backend, no database, no auth.

## Development

```sh
npm install
npm run dev       # start the dev server
npm run build     # type-check and build to dist/
npm run preview   # serve the production build locally
```

## Project structure

```
src/
  data/            Static content: prayer text, the 20 Mysteries, liturgical
                    calendar math, keyboard shortcut definitions
  state/           localStorage-backed stores: settings, session, bead sequence
  screens/         The five screens (Home, Prayer, Settings, Mystery Reference)
  util/            DOM helpers, router, shared layout/shell, icons, modal
public/            Static assets: manifest icons, favicon
```

The whole Rosary is modeled as a flat, precomputed array of "beads" (see `src/state/beadSequence.ts`); navigating is just moving an integer index into that array, which is what makes resuming a session trivial.

## Deployment

Configured for [Vercel](https://vercel.com) (`vercel.json`) as a static Vite build. Routing is hash-based (`#/home`, `#/pray`, …), so no server-side rewrites are needed.

## Analytics

Anonymous, cookie-free page-view analytics via [Vercel Analytics](https://vercel.com/analytics) and [Fathom](https://usefathom.com/). No personal data, and no Rosary session content, ever leaves your device — analytics only sees which screens are visited.

## License / attribution

Prayer texts and Scripture readings are copied from the USCCB and are used here for a non-commercial devotional tool. The Prayer to St. Joseph is the traditional Leo XIII text prayed after the Rosary (the specific USCCB page for it could not be fetched at build time). App iconography is original.
