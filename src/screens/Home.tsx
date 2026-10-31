import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Share2, Sparkles } from 'lucide-react';
import type { Run } from '../data/runs';
import { fmtDay, fmtDistance, fmtDuration, fmtPace, paceUnit } from '../lib/format';
import { insightsFor } from '../lib/insights';
import { useAppState, type Goal } from '../state/AppState';
import { RunRow } from '../components/RunRow';
import { SyncBanner } from '../components/SyncBanner';
import { ShareSheet } from '../components/ShareSheet';

const GOAL_LINE: Record<Goal, string> = {
  fitter: 'Let’s keep you moving',
  '5k': 'On the road to your 5K',
  consistent: 'Keep the streak going',
  track: 'Here’s how your running is going',
};

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

/** Home: at most four items (PRD 3.2); review and share are one tap away (PRD 1.1, 3.5). */
export default function Home() {
  const { runs, goal } = useAppState();
  const latest = runs[0];
  const recent = runs.slice(1, 4);

  return (
    <div className="stack">
      <header className="page-header">
        <p className="eyebrow">{greeting()}</p>
        <h1>{GOAL_LINE[goal]}</h1>
      </header>

      <SyncBanner />

      {latest && <LatestRunCard run={latest} />}

      {recent.length > 0 && (
        <section aria-labelledby="recent-title">
          <div className="section-head">
            <h2 id="recent-title">Recent runs</h2>
            <Link to="/runs">See all</Link>
          </div>
          <div className="run-list">
            {recent.map((run) => (
              <RunRow key={run.id} run={run} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function LatestRunCard({ run }: { run: Run }) {
  const { runs, units, todaySynced } = useAppState();
  const [sharing, setSharing] = useState(false);
  const ins = insightsFor(run, runs, units);
  const label = todaySynced ? 'Your latest run' : 'Last synced run';

  return (
    <article className="card" aria-label={label}>
      <Link to={`/runs/${run.id}`} className="latest-title stretched">
        <span className="latest-label">
          {label} · {fmtDay(run.date)}
        </span>
        <span className="sr-only">, open summary</span>
      </Link>
      <div className="big-number" style={{ marginTop: 6 }}>
        {fmtDistance(run.distanceMi, units)}
        <small>{units}</small>
      </div>
      <div className="stat-row">
        <span>
          <strong>{fmtDuration(run.durationSec)}</strong> time
        </span>
        <span>
          <strong>
            {fmtPace(run.paceSecPerMi, units)}
            {paceUnit(units)}
          </strong>{' '}
          pace
        </span>
      </div>
      <p className="insight">
        <Sparkles size={18} aria-hidden="true" />
        <span>{ins.headline}</span>
      </p>
      <div className="card-actions">
        <Link to={`/runs/${run.id}`} className="btn btn-secondary btn-grow above">
          See summary
        </Link>
        <button className="btn btn-primary btn-grow above" onClick={() => setSharing(true)}>
          <Share2 size={18} aria-hidden="true" /> Share
        </button>
      </div>
      {sharing && <ShareSheet run={run} insight={ins.headline} onClose={() => setSharing(false)} />}
    </article>
  );
}
