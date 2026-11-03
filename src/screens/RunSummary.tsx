import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChartColumn, ChevronLeft, Share2, Trash2, Watch } from 'lucide-react';
import type { MetricKey } from '../data/metrics';
import { routeById } from '../data/routes';
import { TODAY_RUN_ID } from '../data/runs';
import { fmtDay, fmtDistance, fmtDuration, fmtPace, fmtTime, paceUnit } from '../lib/format';
import { insightsFor, type RunDeltas } from '../lib/insights';
import { useAppState } from '../state/AppState';
import { useUi } from '../state/ui';
import { TimeOfDayIcon, Trend } from '../components/Icons';
import { ExplainerSheet, MetricTile } from '../components/Metric';
import { ConfirmDialog } from '../components/Overlay';
import { RouteMap } from '../components/RouteMap';
import { trendProps } from '../components/RunTrends';
import { ShareSheet } from '../components/ShareSheet';

/**
 * Run summary: four core metrics first (PRD 1.3), shown as sign + number + trend arrow.
 * Tapping a number gives the plain-language meaning and explanation (PRD 1.4, 3.4).
 */
export default function RunSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { runs, units, todaySynced, deleteRun, restoreRun } = useAppState();
  const { toast } = useUi();
  const [explain, setExplain] = useState<{ metric: MetricKey; meaning?: string } | null>(null);
  const [sharing, setSharing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const back = (
    // Opened from a notification or a shared link there is no history to go back to.
    <button
      className="icon-btn back-icon"
      onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/runs'))}
      aria-label="Back"
    >
      <ChevronLeft size={26} aria-hidden="true" />
    </button>
  );

  const run = runs.find((r) => r.id === id);
  if (!run) {
    const stillSyncing = id === TODAY_RUN_ID && !todaySynced;
    return (
      <div className="stack">
        {back}
        <h1>{stillSyncing ? <Watch size={40} aria-label="Still syncing from your watch" /> : 'Run not found'}</h1>
        <Link to="/runs" className="btn btn-secondary">
          All runs
        </Link>
      </div>
    );
  }

  const ins = insightsFor(run, runs, units);
  const route = routeById(run.routeId);
  const open = (metric: MetricKey, meaning?: string) => setExplain({ metric, meaning });
  const trend = (key: keyof RunDeltas) => ins.deltas && <Trend value={ins.deltas[key]} {...trendProps(key, ins.deltas[key], units)} />;

  const handleDelete = () => {
    setConfirmDelete(false);
    deleteRun(run.id);
    navigate('/runs', { replace: true });
    toast('Run deleted', { label: 'Undo', onAction: () => restoreRun(run.id) });
  };

  return (
    <div className="stack">
      <div className="summary-top">
        {back}
        <h1 className="summary-title">
          <TimeOfDayIcon date={run.date} size={22} />
          {fmtDay(run.date)}
          <span className="subtle">{fmtTime(run.date)}</span>
          <span className="sr-only">, {run.title}</span>
        </h1>
        <button className="round-btn" onClick={() => setConfirmDelete(true)} aria-label="Delete run">
          <Trash2 size={19} aria-hidden="true" />
        </button>
      </div>

      {route && (
        <div className="route-preview">
          <RouteMap route={route} aspect={1.8} label={`Map of ${route.name}`} />
          <span className="route-preview-name" aria-hidden="true">
            {route.name}
          </span>
        </div>
      )}

      <div className="metric-grid">
        <MetricTile metric="distance" value={fmtDistance(run.distanceMi, units)} unit={units} meaning={ins.distance} trend={trend('distance')} onExplain={open} />
        <MetricTile metric="time" value={fmtDuration(run.durationSec)} meaning={ins.time} trend={trend('time')} onExplain={open} />
        <MetricTile metric="pace" value={fmtPace(run.paceSecPerMi, units)} unit={paceUnit(units)} meaning={ins.pace} trend={trend('pace')} onExplain={open} />
        <MetricTile metric="heartRate" value={String(run.avgHr)} unit="bpm" meaning={ins.heartRate} trend={trend('heartRate')} onExplain={open} />
      </div>

      <div className="metric-grid">
        <MetricTile metric="cadence" value={String(run.cadence)} unit="spm" compact onExplain={open} />
        <MetricTile metric="climb" value={String(run.elevationFt)} unit="ft" compact onExplain={open} />
      </div>

      <div className="icon-actions">
        <button className="round-btn big primary" onClick={() => setSharing(true)} aria-label="Share this run">
          <Share2 size={24} aria-hidden="true" />
        </button>
        <Link to={`/runs/${run.id}/details`} className="round-btn big" aria-label="More details">
          <ChartColumn size={24} aria-hidden="true" />
        </Link>
      </div>

      {explain && <ExplainerSheet metric={explain.metric} meaning={explain.meaning} onClose={() => setExplain(null)} />}
      {sharing && <ShareSheet run={run} insight={ins.headline} onClose={() => setSharing(false)} />}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete this run?"
          message="You can undo this right after."
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}
