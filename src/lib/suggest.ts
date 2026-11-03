import type { Run } from '../data/runs';
import { HILLY_FT, ROUTES, type Route } from '../data/routes';
import type { DailyStats } from './daily';
import { daysBetween, toUnits, type Units } from './format';

export type Effort = 'recovery' | 'easy' | 'steady' | 'long';

export interface Suggestion {
  effort: Effort;
  distanceMi: number;
  minutes: number;
  routes: Route[];
  /** Plain-language reason, shown behind the ⓘ button. */
  why: string;
}

const LEVELS: Effort[] = ['recovery', 'easy', 'steady', 'long'];
const FACTOR: Record<Effort, number> = { recovery: 0.45, easy: 0.8, steady: 1, long: 1.3 };
const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

/**
 * Today's suggested run from body metrics (PRD 2.15, 3.9): Body Battery sets the
 * starting effort, high stress or an earlier run today eases it off one step, and
 * the distance scales from the user's recent runs.
 */
export function suggestRun(stats: DailyStats, runs: Run[], units: Units, now = new Date()): Suggestion {
  const recent = runs.filter((r) => r.date <= now).slice(0, 5);
  const usualMi = recent.length ? avg(recent.map((r) => r.distanceMi)) : 2;
  const usualPace = recent.length ? avg(recent.map((r) => r.paceSecPerMi)) : 660;
  const ranToday = runs.some((r) => daysBetween(now, r.date) === 0 && r.date <= now);

  const bb = stats.bodyBattery;
  let level = bb >= 75 ? 3 : bb >= 50 ? 2 : bb >= 25 ? 1 : 0;
  const reasons = [`Body Battery is ${bb}`];
  if (stats.stress > 75) {
    level--;
    reasons.push('stress is high');
  }
  if (ranToday) {
    level--;
    reasons.push('you already ran today');
  }
  const effort = LEVELS[Math.max(0, level)];

  // Round to a friendly half unit in the user's units, then back to miles.
  const step = units === 'mi' ? 0.5 : 0.5 / 1.609344;
  const distanceMi = Math.max(step * 2, Math.round((usualMi * FACTOR[effort]) / step) * step);
  const minutes = Math.round((distanceMi * usualPace * (effort === 'recovery' ? 1.15 : 1)) / 60 / 5) * 5;

  // Closest routes by distance; easy days skip hilly ones.
  const routes = ROUTES.filter((r) => effort === 'long' || effort === 'steady' || r.climbFt < HILLY_FT)
    .sort((a, b) => Math.abs(a.distanceMi - distanceMi) - Math.abs(b.distanceMi - distanceMi))
    .slice(0, 3)
    .sort((a, b) => a.distanceMi - b.distanceMi);

  const effortWords: Record<Effort, string> = {
    recovery: 'a short, gentle recovery run or walk',
    easy: 'an easy run, a bit shorter than usual',
    steady: 'a steady run around your usual distance',
    long: 'a longer run than usual, hills are fine',
  };
  const d = toUnits(distanceMi, units).toFixed(1);
  const why = `${capitalize(reasons.join(', '))}, so today suits ${effortWords[effort]}: about ${d} ${units}.`;

  return { effort, distanceMi, minutes, routes, why };
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
