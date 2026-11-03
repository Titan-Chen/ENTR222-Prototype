import { useState } from 'react';
import { ArrowDown, ArrowUp, Info, Target } from 'lucide-react';
import type { Run } from '../data/runs';
import { METRICS } from '../data/metrics';
import type { DailyStats } from '../lib/daily';
import { intraday, type DayMetric } from '../lib/intraday';
import { DayChart } from './DayChart';
import { MetricIcon } from './Icons';
import { BottomSheet } from './Overlay';

/** Series colors match each ring (all >= 6:1 on the dark surface). */
const COLOR: Record<DayMetric, string> = {
  heartRateNow: '#f87171',
  steps: '#2ea3f2',
  bodyBattery: '#4ade80',
  stress: '#fb923c',
};

const UNIT: Record<DayMetric, string> = { heartRateNow: 'bpm', steps: 'steps', bodyBattery: '', stress: '' };

/** Tapping a ring opens today's chart for it; the words are behind ⓘ. */
export function DayChartSheet({ metric, stats, runs, onClose }: { metric: DayMetric; stats: DailyStats; runs: Run[]; onClose: () => void }) {
  const [showInfo, setShowInfo] = useState(false);
  const info = METRICS[metric];
  const name = info.label('mi');
  const series = intraday(metric, runs, stats);
  const values = series.points.map((p) => p.v).filter((v): v is number => v !== null);
  const current = { heartRateNow: stats.heartRate, steps: stats.steps, bodyBattery: stats.bodyBattery, stress: stats.stress }[metric];

  return (
    <BottomSheet title={name} onClose={onClose}>
      <div className="chart-head">
        <span className="chart-head-icon" style={{ color: COLOR[metric] }}>
          <MetricIcon metric={metric} size={28} />
        </span>
        <span className="chart-head-value">
          {current.toLocaleString()}
          {UNIT[metric] && <small>{UNIT[metric]}</small>}
        </span>
        <span className="chart-head-chips">
          {metric === 'steps' ? (
            <span className="icon-stat" aria-label={`Goal ${stats.stepGoal.toLocaleString()} steps`}>
              <Target size={16} aria-hidden="true" />
              {stats.stepGoal.toLocaleString()}
            </span>
          ) : (
            <>
              <span className="icon-stat" aria-label={`Lowest today ${Math.min(...values)}`}>
                <ArrowDown size={16} aria-hidden="true" />
                {Math.min(...values)}
              </span>
              <span className="icon-stat" aria-label={`Highest today ${Math.max(...values)}`}>
                <ArrowUp size={16} aria-hidden="true" />
                {Math.max(...values)}
              </span>
            </>
          )}
        </span>
      </div>

      <DayChart series={series} color={COLOR[metric]} unit={UNIT[metric]} name={name} />

      <button className="info-toggle" onClick={() => setShowInfo((s) => !s)} aria-expanded={showInfo} aria-label={`About ${name}`}>
        <Info size={18} aria-hidden="true" />
      </button>
      {showInfo && (
        <div className="info-text">
          <p>{info.what}</p>
          <p>{info.why}</p>
        </div>
      )}
    </BottomSheet>
  );
}
