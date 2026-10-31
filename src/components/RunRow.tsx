import { Link } from 'react-router-dom';
import { ChevronRight, RefreshCw, Watch } from 'lucide-react';
import type { Run } from '../data/runs';
import { fmtDay, fmtDistance, fmtDuration, fmtPace, paceUnit } from '../lib/format';
import { useAppState } from '../state/AppState';
import { MetricIcon, TimeOfDayIcon } from './Icons';

export function RunRow({ run }: { run: Run }) {
  const { units } = useAppState();
  const pace = `${fmtPace(run.paceSecPerMi, units)}${paceUnit(units)}`;
  return (
    <Link
      to={`/runs/${run.id}`}
      className="run-row"
      aria-label={`${fmtDay(run.date)}, ${run.title}, ${fmtDistance(run.distanceMi, units, 1)} ${units}, ${fmtDuration(run.durationSec)}, pace ${pace}`}
    >
      <div className="run-row-main" aria-hidden="true">
        <div className="run-row-title">
          <TimeOfDayIcon date={run.date} size={15} /> {fmtDay(run.date)}
        </div>
        <div className="run-row-sub">
          <span className="icon-stat">
            <MetricIcon metric="time" size={14} /> {fmtDuration(run.durationSec)}
          </span>
          <span className="icon-stat">
            <MetricIcon metric="pace" size={14} /> {pace}
          </span>
        </div>
      </div>
      <div className="run-row-dist" aria-hidden="true">
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
  const pct = Math.round(sync.progress);
  return (
    <div className="run-row pending" role="status" aria-label={`Today's run is syncing from your watch, ${pct}%`}>
      <Watch size={20} aria-hidden="true" />
      <RefreshCw size={18} className="sync-icon spin" aria-hidden="true" />
      <div className="run-row-main" aria-hidden="true">
        <div className="progress">
          <div style={{ width: `${pct}%` }} />
        </div>
      </div>
      <span className="run-row-sub" aria-hidden="true">
        {pct}%
      </span>
    </div>
  );
}
