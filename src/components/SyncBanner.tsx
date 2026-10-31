import { Link } from 'react-router-dom';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import { TODAY_RUN_ID } from '../data/runs';
import { useAppState } from '../state/AppState';

function stage(progress: number): string {
  if (progress < 15) return 'Connecting to your watch';
  if (progress < 90) return 'Getting today’s run from your watch';
  return 'Putting your summary together';
}

/** Non-blocking sync status (PRD 1.2, 3.8): older runs stay usable while this runs. */
export function SyncBanner() {
  const { sync, notifyOnSync } = useAppState();

  if (sync.status === 'syncing') {
    const pct = Math.round(sync.progress);
    return (
      <div className="sync-banner" role="status" aria-live="polite">
        <div className="sync-top">
          <RefreshCw size={20} className="sync-icon spin" aria-hidden="true" />
          <strong>{stage(sync.progress)}…</strong>
          <span className="subtle" aria-hidden="true">
            {pct}%
          </span>
        </div>
        <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Sync progress">
          <div style={{ width: `${pct}%` }} />
        </div>
        <p className="sync-note">
          {notifyOnSync
            ? 'Feel free to look around or leave. We’ll let you know when it’s ready.'
            : 'Your earlier runs are ready below while this finishes.'}
        </p>
      </div>
    );
  }

  if (sync.status === 'done') {
    return (
      <div className="sync-banner done" role="status" aria-live="polite">
        <div className="sync-top">
          <CheckCircle2 size={20} className="sync-icon" aria-hidden="true" />
          <strong>Today’s run is ready</strong>
          <Link to={`/runs/${TODAY_RUN_ID}`}>View</Link>
        </div>
      </div>
    );
  }

  return null;
}
