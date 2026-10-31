import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Share2, Sparkles } from 'lucide-react';
import type { MetricKey } from '../data/metrics';
import { TODAY_RUN_ID } from '../data/runs';
import { fmtDay, fmtDistance, fmtDuration, fmtPace, fmtTime, paceUnit } from '../lib/format';
import { insightsFor } from '../lib/insights';
import { useAppState } from '../state/AppState';
import { useUi } from '../state/ui';
import { ExplainerSheet, MetricTile } from '../components/Metric';
import { ConfirmDialog } from '../components/Overlay';
import { ShareSheet } from '../components/ShareSheet';

/** Run summary: four core metrics first, each with meaning and explanation (PRD 1.3, 1.4, 3.3, 3.4). */
export default function RunSummary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { runs, units, experience, todaySynced, deleteRun, restoreRun } = useAppState();
  const { toast } = useUi();
  const [explain, setExplain] = useState<MetricKey | null>(null);
  const [sharing, setSharing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const back = (
    // Opened from a notification or a shared link there is no history to go back to.
    <button className="back-btn" onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/runs'))}>
      <ChevronLeft size={22} aria-hidden="true" /> Back
    </button>
  );

  const run = runs.find((r) => r.id === id);
  if (!run) {
    const stillSyncing = id === TODAY_RUN_ID && !todaySynced;
    return (
      <div className="stack">
        {back}
        <h1>{stillSyncing ? 'Almost there' : 'Run not found'}</h1>
        <p className="subtle">
          {stillSyncing
            ? 'Today’s run is still coming from your watch. It will open here as soon as it’s ready.'
            : 'This run may have been deleted.'}
        </p>
        <Link to="/runs" className="btn btn-secondary">
          See all runs
        </Link>
      </div>
    );
  }

  const ins = insightsFor(run, runs, units);

  const handleDelete = () => {
    setConfirmDelete(false);
    deleteRun(run.id);
    navigate('/runs', { replace: true });
    toast('Run deleted', { label: 'Undo', onAction: () => restoreRun(run.id) });
  };

  return (
    <div className="stack">
      <div>
        {back}
        <header className="page-header">
          <p className="eyebrow">
            {fmtDay(run.date)} · {fmtTime(run.date)}
          </p>
          <h1>{run.title}</h1>
        </header>
      </div>

      <p className="insight" style={{ marginTop: 0 }}>
        <Sparkles size={18} aria-hidden="true" />
        <span className="summary-headline">{ins.headline}</span>
      </p>

      <div className="metric-grid">
        <MetricTile metric="distance" value={fmtDistance(run.distanceMi, units)} unit={units} meaning={ins.distance} onExplain={setExplain} />
        <MetricTile metric="time" value={fmtDuration(run.durationSec)} meaning={ins.time} onExplain={setExplain} />
        <MetricTile metric="pace" value={fmtPace(run.paceSecPerMi, units)} unit={paceUnit(units)} meaning={ins.pace} onExplain={setExplain} />
        <MetricTile metric="heartRate" value={String(run.avgHr)} unit="bpm" meaning={ins.heartRate} onExplain={setExplain} />
      </div>

      {experience === 'new' && <p className="hint">Tap any number to learn what it means.</p>}

      <div className="card-actions" style={{ marginTop: 0 }}>
        <button className="btn btn-primary btn-grow" onClick={() => setSharing(true)}>
          <Share2 size={18} aria-hidden="true" /> Share
        </button>
        <Link to={`/runs/${run.id}/details`} className="btn btn-secondary btn-grow">
          More details <ChevronRight size={18} aria-hidden="true" />
        </Link>
      </div>

      <section aria-labelledby="also-title">
        <h2 id="also-title" className="group-title">
          Also from this run
        </h2>
        <div className="stack" style={{ gap: 8 }}>
          <MetricTile metric="cadence" value={String(run.cadence)} compact onExplain={setExplain} />
          <MetricTile metric="climb" value={String(run.elevationFt)} unit="ft" compact onExplain={setExplain} />
        </div>
      </section>

      <button className="link-danger" onClick={() => setConfirmDelete(true)}>
        Delete run
      </button>

      {explain && <ExplainerSheet metric={explain} onClose={() => setExplain(null)} />}
      {sharing && <ShareSheet run={run} insight={ins.headline} onClose={() => setSharing(false)} />}
      {confirmDelete && (
        <ConfirmDialog
          title="Delete this run?"
          message="It will be removed from your history. You can undo this right after."
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}
