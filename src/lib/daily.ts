import type { Run } from '../data/runs';
import { daysBetween } from './format';

export interface DailyStats {
  heartRate: number;
  stress: number;
  steps: number;
  stepGoal: number;
  bodyBattery: number;
}

const STEP_GOAL = 7500;
const WAKE_HOUR = 7;

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

/**
 * Simulated all-day watch data for the sample persona. Shaped by the time of day
 * and by any runs logged today, with a little noise so heart rate looks live.
 */
export function dailyStats(runs: Run[], now = new Date()): DailyStats {
  const hour = now.getHours() + now.getMinutes() / 60;
  const awake = Math.max(0, hour - WAKE_HOUR);
  const today = runs.filter((r) => daysBetween(now, r.date) === 0 && r.date <= now);
  const runMiles = today.reduce((sum, r) => sum + r.distanceMi, 0);
  const minsSinceRun = today.length
    ? Math.min(...today.map((r) => (now.getTime() - r.date.getTime() - r.durationSec * 1000) / 60000))
    : Infinity;
  const recentlyRan = minsSinceRun < 30;

  const steps = Math.round(awake * 430 + runMiles * 1550);
  const bodyBattery = Math.round(
    hour < WAKE_HOUR ? clamp(55 + hour * 5, 5, 100) : clamp(88 - awake * 3.2 - runMiles * 5, 5, 100),
  );
  const stress = Math.round(clamp(26 + 9 * Math.sin(hour / 2.5) + (recentlyRan ? 18 : 0) + (Math.random() - 0.5) * 4, 0, 100));
  const heartRate = Math.round((recentlyRan ? 92 : 66) + (Math.random() - 0.5) * 6);

  return { heartRate, stress, steps, stepGoal: STEP_GOAL, bodyBattery };
}

/** One-line meanings for the Today panel (PRD 3.4). */
export function dailyMeanings(s: DailyStats) {
  return {
    heartRate:
      s.heartRate < 80 ? 'Relaxed, in your resting range' : s.heartRate < 100 ? 'A little up, you’ve been moving' : 'Up right now, you’re active',
    // The level word ("Low") is already shown next to the number.
    stress: s.stress <= 25 ? 'Nice and calm right now' : s.stress <= 50 ? 'A calm day so far' : s.stress <= 75 ? 'Try a short break' : 'Take it easy for a bit',
    steps:
      s.steps >= s.stepGoal
        ? 'Daily goal reached, nice!'
        : `${Math.round((s.steps / s.stepGoal) * 100)}% of your ${s.stepGoal.toLocaleString()} goal`,
    bodyBattery:
      s.bodyBattery >= 75
        ? 'Plenty of energy for a run'
        : s.bodyBattery >= 50
          ? 'Good for an easy run'
          : s.bodyBattery >= 25
            ? 'Running low, go easy today'
            : 'Time to rest and recharge',
  };
}

export function stressWord(stress: number): string {
  return stress <= 25 ? 'Resting' : stress <= 50 ? 'Low' : stress <= 75 ? 'Medium' : 'High';
}
