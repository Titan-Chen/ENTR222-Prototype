import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, RefreshCw, Smartphone, Watch } from 'lucide-react';
import { TODAY_RUN_ID } from '../data/runs';
import { useAppState } from '../state/AppState';

/** Non-blocking sync status (PRD 1.2, 3.8) shown as watch → phone with progress. */
export function SyncBanner() {
  const { sync } = useAppState();

  if (sync.status === 'syncing') {
    const pct = Math.round(sync.progress);
    return (
      <div className="sync-banner" role="status" aria-live="polite" aria-label={`Getting today's run from your watch, ${pct}%`}>
        <div className="sync-top" aria-hidden="true">
          <Watch size={20} className="sync-icon" />
          <RefreshCw size={16} className="sync-icon spin" />
          <Smartphone size={20} className="sync-icon" />
          <div className="progress" style={{ flex: 1 }}>
            <div style={{ width: `${pct}%` }} />
          </div>
          <span className="subtle">{pct}%</span>
        </div>
      </div>
    );
  }

  if (sync.status === 'done') {
    return (
      <Link to={`/runs/${TODAY_RUN_ID}`} className="sync-banner done" role="status" aria-label="Today's run is ready. Open it.">
        <div className="sync-top" aria-hidden="true">
          <Watch size={20} className="sync-icon" />
          <CheckCircle2 size={20} className="sync-icon" />
          <span style={{ flex: 1 }} />
          <ArrowRight size={20} className="sync-icon" />
        </div>
      </Link>
    );
  }

  return null;
}
