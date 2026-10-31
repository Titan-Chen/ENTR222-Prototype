import { Info } from 'lucide-react';
import { METRICS, type MetricKey } from '../data/metrics';
import { useAppState } from '../state/AppState';
import { BottomSheet } from './Overlay';

interface TileProps {
  metric: MetricKey;
  value: string;
  unit?: string;
  meaning?: string;
  compact?: boolean;
  onExplain: (metric: MetricKey) => void;
}

export function MetricTile({ metric, value, unit, meaning, compact, onExplain }: TileProps) {
  const { units } = useAppState();
  const label = METRICS[metric].label(units);
  return (
    <button
      className={`metric-tile${compact ? ' compact' : ''}`}
      onClick={() => onExplain(metric)}
      aria-label={`${label}: ${value} ${unit ?? ''}. ${meaning ?? ''} Tap to learn what this means.`}
    >
      <span className="metric-label">
        {label}
        <Info size={14} aria-hidden="true" />
      </span>
      <span className="metric-value">
        {value}
        {unit && <small>{unit}</small>}
      </span>
      {meaning && <span className="metric-meaning">{meaning}</span>}
    </button>
  );
}

export function ExplainerSheet({ metric, onClose }: { metric: MetricKey; onClose: () => void }) {
  const { units } = useAppState();
  const info = METRICS[metric];
  const label = info.label(units);
  return (
    <BottomSheet title={label} onClose={onClose}>
      {info.technical !== label && <p className="explainer-term">Also called “{info.technical}”</p>}
      <div className="explainer-block">
        <h3>What it means</h3>
        <p>{info.what}</p>
      </div>
      <div className="explainer-block">
        <h3>Why it matters</h3>
        <p>{info.why}</p>
      </div>
      <button className="btn btn-secondary btn-block" onClick={onClose}>
        Got it
      </button>
    </BottomSheet>
  );
}
