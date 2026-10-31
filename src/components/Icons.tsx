import type { ReactNode } from 'react';
import { Clock, Footprints, Gauge, HeartPulse, Minus, Moon, Mountain, Route, Sun, Timer, TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react';
import type { MetricKey } from '../data/metrics';

/**
 * Body Battery: a person with an energy bolt, so it reads as the body's energy
 * rather than the watch's charge. Drawn to match lucide's 24px, 2px-stroke style.
 */
export function BodyEnergyIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="4.5" r="2.5" />
      <path d="M8 9v6" />
      <path d="M4 12l4-3 4 3" />
      <path d="M8 15l-3 6" />
      <path d="M8 15l3 6" />
      <path d="M19 3l-3.5 6.5h4L16 16" />
    </svg>
  );
}

/** One sign per metric, used everywhere the metric appears. */
const ICONS: Record<MetricKey, LucideIcon | typeof BodyEnergyIcon> = {
  distance: Route,
  time: Clock,
  pace: Timer,
  heartRate: HeartPulse,
  cadence: Footprints,
  climb: Mountain,
  heartRateNow: HeartPulse,
  stress: Gauge,
  steps: Footprints,
  bodyBattery: BodyEnergyIcon,
};

export function MetricIcon({ metric, size = 20 }: { metric: MetricKey; size?: number }) {
  const Icon = ICONS[metric];
  return <Icon size={size} aria-hidden="true" />;
}

/** Sun for daytime runs, moon for evening runs. */
export function TimeOfDayIcon({ date, size = 16 }: { date: Date; size?: number }) {
  const Icon = date.getHours() >= 17 || date.getHours() < 5 ? Moon : Sun;
  return <Icon size={size} aria-hidden="true" />;
}

/**
 * Trend arrow with a short amount, replacing sentences like "16 sec faster than usual".
 * `good` colors improvements green; other changes stay neutral rather than alarming.
 */
export function Trend({ value, text, good, label }: { value: number; text: ReactNode; good?: boolean; label: string }) {
  const Icon = value > 0 ? TrendingUp : value < 0 ? TrendingDown : Minus;
  const tone = value === 0 ? 'flat' : good ? 'good' : 'neutral';
  return (
    <span className={`trend ${tone}`} aria-label={label}>
      <Icon size={15} aria-hidden="true" />
      {value !== 0 && <span aria-hidden="true">{text}</span>}
    </span>
  );
}
