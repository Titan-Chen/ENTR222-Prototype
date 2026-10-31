import type { RunDeltas } from '../lib/insights';
import type { Units } from '../lib/format';
import { MetricIcon, Trend } from './Icons';

type Key = keyof RunDeltas;

/** Text and spoken label for each trend; faster pace is the only change shown as "good". */
export function trendProps(key: Key, value: number, units: Units) {
  const abs = Math.abs(value);
  switch (key) {
    case 'pace':
      return {
        text: `${abs}s`,
        good: value > 0,
        label: value === 0 ? 'Pace about the same as usual' : `${abs} seconds per ${units === 'mi' ? 'mile' : 'kilometer'} ${value > 0 ? 'faster' : 'slower'} than usual`,
      };
    case 'distance':
      return { text: `${abs} ${units}`, label: value === 0 ? 'Usual distance' : `${abs} ${units} ${value > 0 ? 'farther' : 'shorter'} than usual` };
    case 'time':
      return { text: `${abs}m`, label: value === 0 ? 'Usual length' : `${abs} minutes ${value > 0 ? 'longer' : 'shorter'} than usual` };
    case 'heartRate':
      return { text: `${abs}`, label: value === 0 ? 'Heart rate in your usual range' : `Heart rate ${abs} beats ${value > 0 ? 'higher' : 'lower'} than usual` };
  }
}

/** A row of metric icons with trend arrows, replacing the written comparison. */
export function RunTrends({ deltas, units, only }: { deltas: RunDeltas | null; units: Units; only?: Key[] }) {
  if (!deltas) return null;
  const keys = only ?? (Object.keys(deltas) as Key[]);
  return (
    <div className="trend-row" aria-label="Compared with your last 3 runs">
      {keys.map((k) => (
        <span key={k} className="trend-chip">
          <MetricIcon metric={k} size={16} />
          <Trend value={deltas[k]} {...trendProps(k, deltas[k], units)} />
        </span>
      ))}
    </div>
  );
}
