import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCw } from 'lucide-react';
import type { Run } from '../data/runs';
import { fmtDay, fmtDistance, fmtDuration, fmtPace, paceUnit } from '../lib/format';
import { useAppState } from '../state/AppState';

export function RunRow({ run }: { run: Run }) {
  const { units } = useAppState();
  return (
    <Link to={`/runs/${run.id}`} className="run-row">
      <div className="run-row-main">
        <div className="run-row-title">{fmtDay(run.date)}</div>
        <div className="run-row-sub">
          {run.title} · {fmtDuration(run.durationSec)} · {fmtPace(run.paceSecPerMi, units)}
          {paceUnit(units)}
        </div>
      </div>
      <div className="run-row-dist">
        {fmtDistance(run.distanceMi, units, 1)}
        <small>{units}</small>
      </div>
      <ChevronRight size={20} aria-hidden="true" />
    </Link>
  );
}

/** Placeholder row for the run that is still coming from the watch (PRD 1.2). */
export function PendingRunRow() {
  const { sync } = useAppState();
  return (
    <div className="run-row pending" role="status">
      <RefreshCw size={20} className="sync-icon spin" aria-hidden="true" />
      <div className="run-row-main">
        <div className="run-row-title">Today’s run</div>
        <div className="run-row-sub">Coming from your watch… {Math.round(sync.progress)}%</div>
      </div>
    </div>
  );
}
