# Prototype Build Plan

Build plan for the MVP in [PRD.md](PRD.md) §2.2. It covers Release 1 "review and share a run" plus the casual-first interface rules. Layer 2 (3.10–3.14) is post-MVP: "More details" opens a placeholder that stands in for the existing Connect screens.

## Decisions

| Topic | Choice | Why |
|---|---|---|
| Platform | Web app, laid out like a phone screen | Testers open it from a link; no app install needed |
| Stack | Vite + React + TypeScript, React Router, plain CSS with design tokens | Small, fast, no backend |
| Icons | lucide-react | Generic icons, no Garmin trademarks |
| Share image | html-to-image → `navigator.share({ files })`, falls back to download / copy link | Covers 2.8 in mobile Safari and Chrome |
| Data | Sample runs in a local JSON file; app state in `localStorage` | No Garmin API access needed (PRD §5) |
| Look | Garmin-inspired: dark theme, blue accent, no logo | 1.7 "recognizably Garmin" |
| Units | Miles and min/mi | Can add a km toggle later |
| Hosting | GitHub Pages or Vercel (decide before user testing) | Phones need a public URL |

## Screens and the requirements they cover

| Screen | What it shows | Reqs |
|---|---|---|
| **Onboarding** (first launch) | 3 steps: goal → experience level → notifications on/off. Under 1 minute. Sets the home greeting and how detailed the explanations are. | 3.6, 2.11 |
| **Home** | Sync banner · latest run card with a one-line meaning · "Share last run" · link to all runs. At most 4 items. | 1.1, 1.2, 3.2, 3.5, 3.8 |
| **Runs** | Reverse-chronological list grouped by week. Each row: date, distance, time, short note. | 1.5, 2.7 |
| **Run summary** | Pace, distance, time, heart rate above the fold. Each has an everyday label, a one-line meaning ("Faster than your last 3 runs"), and tap to explain. Buttons: Share, More details. | 1.3, 1.4, 1.7, 3.1, 3.3, 3.4 |
| **Metric explainer** (bottom sheet) | Plain-language meaning, the technical term, and why it matters. | 1.4, 3.3 |
| **Share** (sheet) | Preview of the summary card → Share → system share sheet. Reached in ≤3 taps from summary. | 1.6, 2.8 |
| **More details** | Placeholder for "existing Connect screens" (Layer 2 is post-MVP) | 3.1 |
| **Settings** | Summary-ready notification toggle, units, restart onboarding | 2.11 |

**Bottom tabs:** Home · Runs · Settings. Share is an action on a run, not a tab.

## Simulated behavior

- **Sync (1.2, 3.8):** Past runs show instantly on launch. A "Syncing today's run… 60%" banner runs for about 6 s, then the new run slides in with a "Run synced" message.
- **Notification (2.11):** If the tester leaves Home during sync, an in-app notification banner (styled like a phone notification) appears when sync finishes. Tapping it opens the run summary. It respects the settings toggle.
- **Confirm and undo (3.7):** In the MVP this applies only to deleting a run: a confirm dialog, then an undo message for 5 s.
- **Demo panel:** Open with `?demo`. Facilitators can reset onboarding, re-run sync, switch between slow and fast sync, and reset data between test sessions.

## Sample data

About 18 runs over 8 weeks for one persona: a casual runner doing 2–3 runs a week, 2–5 mi. Each run has date, distance, duration, average pace, average heart rate, cadence, elevation gain and calories. The one-line meanings come from simple rules comparing a run with the previous 3 runs (faster/slower pace, longer/shorter distance, heart rate higher/lower).

## Project structure

```
src/
  main.tsx, App.tsx            router, phone frame, tabs
  theme.css                    color/type tokens (WCAG AA checked)
  data/runs.json               sample runs
  data/metrics.ts              everyday label, technical term, explanation per metric
  lib/format.ts                pace/time/distance formatting
  lib/insights.ts              one-line meanings for each run
  state/                       app store: onboarding, settings, sync, deleted runs
  screens/                     Onboarding, Home, Runs, RunSummary, MoreDetails, Settings
  components/                  SyncBanner, MetricTile, ExplainerSheet, ShareSheet,
                               Toast, NotificationBanner, ConfirmDialog, DemoPanel
```

## Build order

1. Scaffold the Vite app, theme tokens, phone frame, router and tabs
2. Sample data, formatting and insight helpers
3. Runs list and Run summary, with metric explainers
4. Home with sync banner and simulated notification
5. Share sheet (card image + system share)
6. Onboarding and Settings
7. Delete with confirm and undo, toasts, demo panel
8. Accessibility pass, tap-count audit, deploy

## How each MVP acceptance criterion gets checked

| Req | Check |
|---|---|
| 1.1, 1.6, 3.5 | Tap-count table in the README (home → each task) |
| 1.2 | No blocking loader; banner renders on first paint |
| 1.3 | Core metrics visible at 375×667 without scrolling |
| 1.4, 3.4 | Every metric in `metrics.ts` has an explanation; every tile has a meaning line |
| 1.8 | axe / Lighthouse accessibility run; contrast tokens checked; body text ≥16px |
| 3.2 | At most 4 primary items on each first-layer screen |
| 3.6 | Timed run-through under 60 s |
| 2.11, 3.7, 3.8 | Manual walkthrough with the demo panel |

## Gaps in the PRD to settle (they don't block the build)

- **"Prepare" step in 1.1:** No MVP feature backs it, so the prototype's navigation covers review → share only.
- **3.5:** "Check today's plan" and "reschedule a workout" depend on training plans, which are post-MVP. Only "review last run" and "share a run" get built.
- **3.6:** What should the goal and experience level actually change on Home? The plan assumes the greeting and how detailed the explanations are.
- **Spotify Wrapped-style recap:** It's the headline concept but isn't in the MVP. A simple monthly recap could be added as a stretch goal.
