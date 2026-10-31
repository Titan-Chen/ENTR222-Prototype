import type { ReactNode } from 'react';
import { Info, Sparkles } from 'lucide-react';
import { METRICS, type MetricKey } from '../data/metrics';
import { useAppState } from '../state/AppState';
import { MetricIcon } from './Icons';
import { BottomSheet } from './Overlay';

interface TileProps {
  metric: MetricKey;
  value: string;
  unit?: string;
  /** Spoken and shown in the explainer; not printed on the tile. */
  meaning?: string;
  /** Visual sign shown under the number, e.g. a trend arrow. */
  trend?: ReactNode;
  compact?: boolean;
  onExplain: (metric: MetricKey, meaning?: string) => void;
}

/** A metric shown as sign + number. The name is in the accessible label and the explainer. */
export function MetricTile({ metric, value, unit, meaning, trend, compact, onExplain }: TileProps) {
  const { units } = useAppState();
  const label = METRICS[metric].label(units);
  return (
    <button
      className={`metric-tile${compact ? ' compact' : ''}`}
      onClick={() => onExplain(metric, meaning)}
      aria-label={`${label}: ${value} ${unit ?? ''}. ${meaning ?? ''} Tap to learn what this means.`}
    >
      <span className="metric-label" title={label} aria-hidden="true">
        <MetricIcon metric={metric} size={compact ? 18 : 22} />
        <Info size={13} />
      </span>
      <span className="metric-value" aria-hidden="true">
        {value}
        {unit && <small>{unit}</small>}
      </span>
      {trend && <span aria-hidden="true">{trend}</span>}
    </button>
  );
}

/** Where the words live: what this number means for you, then what the metric is. */
export function ExplainerSheet({ metric, meaning, onClose }: { metric: MetricKey; meaning?: string; onClose: () => void }) {
  const { units } = useAppState();
  const info = METRICS[metric];
  const label = info.label(units);
  return (
    <BottomSheet title={label} onClose={onClose}>
      {info.technical !== label && <p className="explainer-term">Also called “{info.technical}”</p>}
      {meaning && (
        <p className="insight" style={{ marginTop: 0, marginBottom: 14 }}>
          <Sparkles size={18} aria-hidden="true" />
          <span>{meaning}</span>
        </p>
      )}
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
