# Connect Casual Prototype

A clickable web prototype of a casual-first Garmin Connect redesign for ENTR222. It covers the MVP in [PRD.md](PRD.md): review a run after it syncs, understand the numbers, and share it. All data is sample data. See [PROTOTYPE_PLAN.md](PROTOTYPE_PLAN.md) for the design decisions.

## Run it

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:5173. On a laptop the app appears inside a phone frame; on a phone it fills the screen.

```bash
npm run build
```

`npm run build` writes a static site to `dist/` that any static host can serve (GitHub Pages, Vercel, Netlify).

## Running a usability session

Open the app with `?demo` (for example `http://localhost:5173/?demo`). A small yellow **Demo** tab appears on the right edge with these controls:

- **Re-run today's sync:** replays the "run coming from your watch" moment
- **Sync speed:** 6 s (default) or 15 s, to test whether people wait or wander off
- **Run recording speed:** real time (default) or 10×, so a "run" covers some distance during a short session
- **Restore deleted runs**
- **Reset everything (new tester):** back to onboarding with default settings

Everything is saved in the browser, so reset between testers.

## What's simulated

| Real product | Prototype |
|---|---|
| Recording a run on the watch (2.2–2.5) | "Start a run" on Home: GPS check, live time/distance/pace/heart rate, pause/resume (paused time not counted), then finish and save or discard. The saved run opens its summary |
| Watch → app sync | A timed progress banner. Today's run appears when it finishes |
| Push notification (2.11) | An in-app banner styled like a phone notification. It appears if the tester has left Home when sync finishes |
| Share to apps (2.8) | A real PNG of the run card sent to the system share sheet. Where the browser can't share files, it downloads the image |
| "More details" / Advanced (Layer 2) | A placeholder for the existing Connect screens (post-MVP) |

## Tap-count audit (PRD 1.1, 1.6, 3.5)

| Task | Path | Taps | Target |
|---|---|---|---|
| Start a run | Home → Start a run → Start | 2 | n/a |
| Review last run | Home → See summary | 1 | ≤3 |
| Share a run from Home | Share → Share image → pick app | 3 | ≤3 |
| Share from run summary | Share → Share image → pick app | 3 | ≤3 (1.6) |
| Open past runs list | Runs tab | 1 | ≤2 (1.1) |
| Open a specific past run | Runs tab → run | 2 | ≤3 |
| Learn what a metric means | Tap the metric on the summary | 1 | n/a |
| Reach detailed data | Summary → More details | 1 | n/a |
| Turn sync notifications off | Settings tab → toggle | 2 | n/a |

Not built (post-MVP in the PRD): "check today's plan" and "reschedule a workout" from 3.5.

## Accessibility (PRD 1.8)

- Every text/background color pair meets WCAG 2.1 AA (lowest is 5.0:1). Ratios are noted in `src/theme.css`.
- Body text is 16px; tap targets are at least 44px.
- Sheets and dialogs move focus, close with Escape, and return focus when closed.
- Animations are turned off when the system's reduce-motion setting is on.

## Code map

```
src/
  App.tsx              router, phone frame, tab bar
  theme.css            design tokens and all styles
  data/runs.ts         18 sample runs, dated relative to today
  data/metrics.ts      everyday labels + plain-language explanations
  lib/insights.ts      one-line meanings ("16 sec per mile faster than your last 3 runs")
  state/AppState.tsx   settings, simulated sync, deleted runs (saved to localStorage)
  state/ui.tsx         toasts and simulated notifications
  screens/             Onboarding, Home, Record, Runs, RunSummary, MoreDetails, Settings
  components/          sheets, metric tiles, share card, sync banner, demo panel
```
