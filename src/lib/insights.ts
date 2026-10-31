import type { Run } from '../data/runs';
import { daysBetween, paceInUnits, toUnits, type Units } from './format';

export interface RunInsights {
  headline: string;
  pace: string;
  distance: string;
  time: string;
  heartRate: string;
}

const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

/**
 * One-line meanings for a run (PRD 3.4), comparing it with the three runs before it.
 * `runs` must be sorted newest first.
 */
export function insightsFor(run: Run, runs: Run[], units: Units): RunInsights {
  const prev = runs.filter((r) => r.date < run.date).slice(0, 3);
  const runsThisMonth = runs.filter((r) => r.date <= run.date && daysBetween(run.date, r.date) < 30).length;

  if (prev.length < 3) {
    const keepGoing = 'Keep running to see how this compares';
    return {
      headline: 'Nice work getting out there. A few more runs and we’ll show how you’re improving.',
      pace: keepGoing,
      distance: keepGoing,
      time: keepGoing,
      heartRate: keepGoing,
    };
  }

  const unitWord = units === 'mi' ? 'mile' : 'km';

  const paceDiff = Math.round(paceInUnits(avg(prev.map((r) => r.paceSecPerMi)) - run.paceSecPerMi, units));
  const pace =
    paceDiff >= 5
      ? `${paceDiff} sec per ${unitWord} faster than your last 3 runs`
      : paceDiff <= -5
        ? `${-paceDiff} sec per ${unitWord} slower than usual. Easy days count too`
        : 'Right around your usual pace';

  const recentWindow = runs.filter((r) => r.date < run.date && daysBetween(run.date, r.date) <= 28);
  const isLongest = recentWindow.length >= 3 && recentWindow.every((r) => r.distanceMi < run.distanceMi);
  const distDiff = toUnits(run.distanceMi - avg(prev.map((r) => r.distanceMi)), units);
  const distance = isLongest
    ? 'Your longest run in 4 weeks'
    : distDiff > 0.3
      ? `${distDiff.toFixed(1)} ${units} farther than usual`
      : distDiff < -0.3
        ? 'A shorter one than usual, and that’s fine'
        : 'About your usual distance';

  const minDiff = Math.round((run.durationSec - avg(prev.map((r) => r.durationSec))) / 60);
  const time =
    minDiff >= 2
      ? `${plural(minDiff, 'minute')} longer than your usual run`
      : minDiff <= -2
        ? `${plural(-minDiff, 'minute')} shorter than your usual run`
        : 'About as long as your usual run';

  const hrDiff = Math.round(run.avgHr - avg(prev.map((r) => r.avgHr)));
  const heartRate =
    hrDiff <= -3
      ? `${-hrDiff} beats lower than usual, so this felt easier on your body`
      : hrDiff >= 3
        ? `${hrDiff} beats higher than usual, so this one worked you harder`
        : 'In your usual range for a run like this';

  let headline: string;
  if (paceDiff >= 5 && hrDiff < 3) {
    headline = 'You ran faster without working harder. That’s what getting fitter looks like.';
  } else if (isLongest) {
    headline = 'Your longest run in a month. Nice job going the distance.';
  } else if (paceDiff >= 5) {
    headline = 'A quicker run than usual. Nice push.';
  } else {
    headline = `A steady run. That’s ${plural(runsThisMonth, 'run')} in the last 30 days.`;
  }

  return { headline, pace, distance, time, heartRate };
}
