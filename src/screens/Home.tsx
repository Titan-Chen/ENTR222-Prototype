import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, History, Share2, X } from 'lucide-react';
import type { Run } from '../data/runs';
import { fmtDay, fmtDistance, fmtDuration, fmtPace, paceUnit } from '../lib/format';
import { insightsFor } from '../lib/insights';
import { useAppState } from '../state/AppState';
import { MetricIcon, TimeOfDayIcon } from '../components/Icons';
import { RunRow } from '../components/RunRow';
import { RunSuggestion } from '../components/RunSuggestion';
import { RunTrends } from '../components/RunTrends';
import { SyncBanner } from '../components/SyncBanner';
import { SharePanel } from '../components/ShareSheet';
import { TodayStats } from '../components/TodayStats';

/**
 * Home, communicated mainly with signs: today's numbers, one big start button,
 * the latest run, recent runs. Names live in accessible labels and explainers.
 */
export default function Home() {
  const { runs } = useAppState();
  const latest = runs[0];
  const recent = runs.slice(1, 4);

  return (
    <div className="stack">
      <h1 className="sr-only">Home</h1>

      <TodayStats />

      <RunSuggestion />

      <SyncBanner />

      {latest && <LatestRunCard run={latest} />}

      {recent.length > 0 && (
        <section aria-label="Recent runs">
          <div className="section-head icon-head">
            <History size={20} aria-hidden="true" />
            <Link to="/runs" className="icon-link" aria-label="See all runs">
              <ArrowRight size={20} aria-hidden="true" />
            </Link>
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
  const panelRef = useRef<HTMLDivElement>(null);
  const ins = insightsFor(run, runs, units);

  // Bring the newly opened share area into view; Recent runs moves down below it.
  useEffect(() => {
    if (sharing) panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [sharing]);
  const label = todaySynced ? 'Your latest run' : 'Last synced run';

  return (
    <article className="card" aria-label={label}>
      <div className="card-top">
        <Link to={`/runs/${run.id}`} className="latest-label stretched">
          <TimeOfDayIcon date={run.date} />
          {fmtDay(run.date)}
          <span className="sr-only">, {label}, open summary</span>
        </Link>
        <button
          className={`round-btn above${sharing ? '' : ' primary'}`}
          onClick={() => setSharing((s) => !s)}
          aria-expanded={sharing}
          aria-controls="home-share-panel"
          aria-label={sharing ? 'Close sharing' : 'Share this run'}
        >
          {sharing ? <X size={20} aria-hidden="true" /> : <Share2 size={20} aria-hidden="true" />}
        </button>
      </div>
      <div className="big-number">
        {fmtDistance(run.distanceMi, units)}
        <small>{units}</small>
      </div>
      <div className="stat-row">
        <span className="icon-stat" aria-label={`Time ${fmtDuration(run.durationSec)}`}>
          <MetricIcon metric="time" size={17} />
          <strong>{fmtDuration(run.durationSec)}</strong>
        </span>
        <span className="icon-stat" aria-label={`Pace ${fmtPace(run.paceSecPerMi, units)} ${paceUnit(units)}`}>
          <MetricIcon metric="pace" size={17} />
          <strong>
            {fmtPace(run.paceSecPerMi, units)}
            {paceUnit(units)}
          </strong>
        </span>
      </div>
      <RunTrends deltas={ins.deltas} units={units} only={['pace', 'heartRate']} />
      {sharing && (
        <div ref={panelRef} id="home-share-panel" className="inline-share above" role="region" aria-label="Share your run">
          <SharePanel run={run} insight={ins.headline} onClose={() => setSharing(false)} />
        </div>
      )}
    </article>
  );
}
