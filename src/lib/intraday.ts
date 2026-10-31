import type { Run } from '../data/runs';
import type { DailyStats } from './daily';
import { daysBetween } from './format';

export type DayMetric = 'heartRateNow' | 'steps' | 'bodyBattery' | 'stress';

export interface DayPoint {
  /** Minutes since midnight. */
  min: number;
  /** Null where the watch doesn't report (stress during a run). */
  v: number | null;
}

export interface DaySeries {
  kind: 'line' | 'area' | 'bars';
  /** Minutes between points (bars span this width). */
  step: number;
  points: DayPoint[];
  yMin: number;
  yMax: number;
  /** Today's runs as [start, end] minutes, shaded on the chart. */
  runs: { start: number; end: number }[];
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/** Stable 0–1 noise so the chart doesn't reshuffle on every render. */
function noise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

const niceCeil = (v: number, step: number) => Math.ceil(v / step) * step;

/**
 * Simulated readings through today, ending at the live values in `stats` so the
 * chart and the ring always agree.
 */
export function intraday(metric: DayMetric, runs: Run[], stats: DailyStats, now = new Date()): DaySeries {
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const seedBase = now.getFullYear() * 400 + now.getMonth() * 32 + now.getDate();
  const todays = runs
    .filter((r) => daysBetween(now, r.date) === 0 && r.date <= now)
    .map((r) => {
      const start = r.date.getHours() * 60 + r.date.getMinutes();
      return { start, end: Math.min(nowMin, start + r.durationSec / 60), miles: r.distanceMi };
    });
  const inRun = (m: number) => todays.some((r) => m >= r.start && m < r.end);
  const minsAfterRun = (m: number) => Math.min(...todays.filter((r) => m >= r.end).map((r) => m - r.end), Infinity);
  const runWindows = todays.map(({ start, end }) => ({ start, end }));

  const sample = (step: number, f: (m: number, i: number) => number | null, last: number): DayPoint[] => {
    const pts: DayPoint[] = [];
    for (let m = 0, i = 0; m <= nowMin; m += step, i++) pts.push({ min: m, v: f(m, i) });
    pts.push({ min: nowMin, v: last });
    return pts;
  };

  switch (metric) {
    case 'heartRateNow': {
      const points = sample(
        10,
        (m, i) => {
          const n = noise(seedBase + i);
          if (inRun(m)) return Math.round(140 + 14 * n);
          if (m < 7 * 60) return Math.round(52 + 6 * n);
          const after = minsAfterRun(m);
          if (after < 40) return Math.round(110 - after + 6 * n);
          return Math.round(64 + 8 * n + 5 * Math.sin(m / 90));
        },
        stats.heartRate,
      );
      const max = Math.max(...points.map((p) => p.v ?? 0));
      return { kind: 'line', step: 10, points, yMin: 40, yMax: Math.max(120, niceCeil(max, 20)), runs: runWindows };
    }
    case 'stress': {
      const points = sample(
        15,
        (m, i) => {
          if (inRun(m)) return null;
          const n = noise(seedBase + 500 + i);
          if (m < 7 * 60) return Math.round(8 + 10 * n);
          const after = minsAfterRun(m) < 60 ? 18 : 0;
          return Math.round(clamp(26 + 9 * Math.sin(m / 150) + after + (n - 0.5) * 14, 0, 100));
        },
        stats.stress,
      );
      return { kind: 'line', step: 15, points, yMin: 0, yMax: 100, runs: runWindows };
    }
    case 'bodyBattery': {
      const points = sample(
        15,
        (m, i) => {
          const h = m / 60;
          const n = noise(seedBase + 900 + i);
          if (h < 7) return Math.round(clamp(30 + 58 * (h / 7) + (n - 0.5) * 3, 5, 100));
          const milesSoFar = todays.reduce(
            (sum, r) => sum + r.miles * clamp((m - r.start) / Math.max(1, r.end - r.start), 0, 1),
            0,
          );
          return Math.round(clamp(88 - (h - 7) * 3.2 - milesSoFar * 5, 5, 100));
        },
        stats.bodyBattery,
      );
      return { kind: 'area', step: 15, points, yMin: 0, yMax: 100, runs: runWindows };
    }
    case 'steps': {
      const hourNow = Math.floor(nowMin / 60);
      const raw: number[] = [];
      for (let h = 0; h <= hourNow; h++) {
        const n = noise(seedBase + 1300 + h);
        let v = h < 7 ? 0 : 430 * (0.4 + 1.2 * n);
        v += todays.filter((r) => Math.floor(r.start / 60) === h).reduce((s, r) => s + r.miles * 1550, 0);
        if (h === hourNow) v *= (nowMin % 60) / 60;
        raw.push(v);
      }
      // Scale so the bars add up to the step count shown on the ring.
      const total = raw.reduce((a, b) => a + b, 0) || 1;
      const points = raw.map((v, h) => ({ min: h * 60, v: Math.round((v / total) * stats.steps) }));
      const max = Math.max(...points.map((p) => p.v ?? 0));
      return { kind: 'bars', step: 60, points, yMin: 0, yMax: Math.max(500, niceCeil(max, 500)), runs: runWindows };
    }
  }
}

export function fmtClock(min: number): string {
  const h = Math.floor(min / 60) % 24;
  const m = Math.round(min % 60);
  const suffix = h < 12 ? 'AM' : 'PM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
}
