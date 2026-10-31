import { useEffect, useState, type ReactNode } from 'react';
import { Footprints, Gauge, HeartPulse, Info } from 'lucide-react';
import { METRICS, type MetricKey } from '../data/metrics';
import { dailyMeanings, dailyStats, stressWord } from '../lib/daily';
import { useAppState } from '../state/AppState';
import { ExplainerSheet } from './Metric';

const REFRESH_MS = 5000;

/**
 * Body Battery: a person with an energy bolt, so it reads as the body's energy
 * rather than the watch's charge. Drawn to match lucide's 24px, 2px-stroke style.
 */
function BodyEnergyIcon({ size = 24 }: { size?: number }) {
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

function Tile({
  metric,
  icon,
  tone,
  value,
  unit,
  meaning,
  extra,
  onExplain,
}: {
  metric: MetricKey;
  /** Shown instead of a text label; the name stays in the accessible label. */
  icon: ReactNode;
  tone: 'heart' | 'stress' | 'steps' | 'good' | 'warn' | 'low';
  value: string;
  unit?: string;
  meaning: string;
  extra?: ReactNode;
  onExplain: (m: MetricKey) => void;
}) {
  const label = METRICS[metric].label('mi');
  return (
    <button
      className="daily-tile"
      onClick={() => onExplain(metric)}
      aria-label={`${label}: ${value} ${unit ?? ''}. ${meaning}. Tap to learn what this means.`}
    >
      <span className={`daily-icon ${tone}`} title={label} aria-hidden="true">
        {icon}
        <Info size={13} className="daily-info" />
      </span>
      <span className="daily-value">
        {value}
        {unit && <small>{unit}</small>}
      </span>
      {extra}
      <span className="metric-meaning">{meaning}</span>
    </button>
  );
}

function Bar({ pct, tone }: { pct: number; tone: 'accent' | 'good' | 'warn' | 'low' }) {
  return (
    <span className={`mini-bar ${tone}`} aria-hidden="true">
      <span style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </span>
  );
}

/** Glanceable all-day data from the watch, each with a plain-language meaning. */
export function TodayStats() {
  const { runs } = useAppState();
  const [tick, setTick] = useState(0);
  const [explain, setExplain] = useState<MetricKey | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // Recomputed on each tick so heart rate and stress look live.
  const stats = dailyStats(runs);
  const meaning = dailyMeanings(stats);
  void tick;

  const battery = stats.bodyBattery;
  const batteryTone = battery >= 50 ? 'good' : battery >= 25 ? 'warn' : 'low';

  return (
    <section aria-labelledby="today-title">
      <div className="section-head">
        <h2 id="today-title">Today</h2>
        <span className="live-note">
          <span className="live-dot" aria-hidden="true" /> From your watch
        </span>
      </div>
      <div className="daily-grid">
        <Tile metric="heartRateNow" icon={<HeartPulse size={24} />} tone="heart" value={String(stats.heartRate)} unit="bpm" meaning={meaning.heartRate} onExplain={setExplain} />
        <Tile metric="stress" icon={<Gauge size={24} />} tone="stress" value={String(stats.stress)} unit={stressWord(stats.stress)} meaning={meaning.stress} onExplain={setExplain} />
        <Tile
          metric="steps"
          icon={<Footprints size={24} />}
          tone="steps"
          value={stats.steps.toLocaleString()}
          meaning={meaning.steps}
          extra={<Bar pct={(stats.steps / stats.stepGoal) * 100} tone="accent" />}
          onExplain={setExplain}
        />
        <Tile
          metric="bodyBattery"
          icon={<BodyEnergyIcon />}
          tone={batteryTone}
          value={String(battery)}
          unit="/ 100"
          meaning={meaning.bodyBattery}
          extra={<Bar pct={battery} tone={batteryTone} />}
          onExplain={setExplain}
        />
      </div>
      {explain && <ExplainerSheet metric={explain} onClose={() => setExplain(null)} />}
    </section>
  );
}
