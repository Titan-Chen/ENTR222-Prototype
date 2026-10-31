import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import { METRICS } from '../data/metrics';
import { dailyMeanings, dailyStats, stressWord } from '../lib/daily';
import { useAppState } from '../state/AppState';
import { MetricIcon } from './Icons';
import { DayChartSheet } from './DayChartSheet';
import type { DayMetric } from '../lib/intraday';

const REFRESH_MS = 5000;
const SIZE = 68;
const STROKE = 6;

type Tone = 'heart' | 'steps' | 'good' | 'warn' | 'low';

/**
 * Circular gauge: the ring fills toward a goal (steps) or a scale (Body Battery,
 * stress out of 100), with the metric's icon in the middle.
 */
function Ring({ pct, tone, beatBpm, children }: { pct: number; tone: Tone; beatBpm?: number; children: ReactNode }) {
  const r = (SIZE - STROKE) / 2;
  const c = 2 * Math.PI * r;
  const fill = Math.min(100, Math.max(0, pct));
  // Heart rate has no goal: the ring stays full and the icon beats at the live rate.
  const beat = beatBpm ? ({ animationDuration: `${60 / beatBpm}s` } as CSSProperties) : undefined;
  return (
    <span className={`ring ${tone}`} style={{ width: SIZE, height: SIZE }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
        <circle className="ring-track" cx={SIZE / 2} cy={SIZE / 2} r={r} strokeWidth={STROKE} fill="none" />
        <circle
          className="ring-fill"
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={r}
          strokeWidth={STROKE}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - fill / 100)}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
        />
      </svg>
      <span className={`ring-icon${beatBpm ? ' beat' : ''}`} style={beat} aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

function RingTile({
  metric,
  tone,
  pct,
  beatBpm,
  value,
  unit,
  meaning,
  onExplain,
}: {
  metric: DayMetric;
  tone: Tone;
  pct: number;
  beatBpm?: number;
  value: string;
  unit?: string;
  meaning: string;
  onExplain: (m: DayMetric) => void;
}) {
  const label = METRICS[metric].label('mi');
  return (
    <button
      className="ring-tile"
      onClick={() => onExplain(metric)}
      title={label}
      aria-label={`${label}: ${value} ${unit ?? ''}. ${meaning}. Tap to see today's chart.`}
    >
      <Ring pct={pct} tone={tone} beatBpm={beatBpm}>
        <MetricIcon metric={metric} size={24} />
      </Ring>
      <span className="ring-value" aria-hidden="true">
        {value}
        {unit && <small>{unit}</small>}
      </span>
    </button>
  );
}

/** Glanceable all-day data from the watch as four rings. Tap a ring for today's chart. */
export function TodayStats() {
  const { runs } = useAppState();
  const [tick, setTick] = useState(0);
  const [chart, setChart] = useState<DayMetric | null>(null);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // Recomputed on each tick so heart rate and stress look live.
  const stats = dailyStats(runs);
  const meaning = dailyMeanings(stats);
  void tick;

  const battery = stats.bodyBattery;
  const batteryTone: Tone = battery >= 50 ? 'good' : battery >= 25 ? 'warn' : 'low';
  const stressTone: Tone = stats.stress <= 50 ? 'good' : stats.stress <= 75 ? 'warn' : 'low';
  const stepsPct = (stats.steps / stats.stepGoal) * 100;
  const open = setChart;

  return (
    <section className="card ring-row" aria-label="Today, from your watch">
      <RingTile metric="heartRateNow" tone="heart" pct={100} beatBpm={stats.heartRate} value={String(stats.heartRate)} unit="bpm" meaning={meaning.heartRate} onExplain={open} />
      <RingTile
        metric="steps"
        tone="steps"
        pct={stepsPct}
        value={stats.steps >= 10000 ? `${(stats.steps / 1000).toFixed(1)}k` : stats.steps.toLocaleString()}
        meaning={`${stats.steps.toLocaleString()} of ${stats.stepGoal.toLocaleString()} steps. ${meaning.steps}`}
        onExplain={open}
      />
      <RingTile metric="bodyBattery" tone={batteryTone} pct={battery} value={String(battery)} meaning={`${battery} of 100. ${meaning.bodyBattery}`} onExplain={open} />
      <RingTile metric="stress" tone={stressTone} pct={stats.stress} value={String(stats.stress)} meaning={`${stressWord(stats.stress)}. ${meaning.stress}`} onExplain={open} />
      {chart && <DayChartSheet metric={chart} stats={stats} runs={runs} onClose={() => setChart(null)} />}
    </section>
  );
}
