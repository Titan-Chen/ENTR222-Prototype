import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Feather, Flame, Info, Infinity as FreeRun, Leaf, Mountain, Play } from 'lucide-react';
import { HILLY_FT } from '../data/routes';
import { dailyStats } from '../lib/daily';
import { fmtDistance } from '../lib/format';
import { suggestRun, type Effort } from '../lib/suggest';
import { useAppState } from '../state/AppState';
import { MetricIcon } from './Icons';
import { RouteMap } from './RouteMap';

const EFFORT: Record<Effort, { label: string; icon: ReactNode }> = {
  recovery: { label: 'Recovery', icon: <Leaf size={16} /> },
  easy: { label: 'Easy', icon: <Feather size={16} /> },
  steady: { label: 'Steady', icon: <Activity size={16} /> },
  long: { label: 'Long', icon: <Flame size={16} /> },
};

/**
 * Today's run, suggested from body metrics at the moment the user decides to run
 * (PRD 2.15, 3.9): effort, distance and time, a few matching routes, and one wide
 * Start button that carries the chosen route and target into the recording.
 */
export function RunSuggestion() {
  const { runs, units } = useAppState();
  const s = suggestRun(dailyStats(runs), runs, units);
  const closest = s.routes.reduce((a, b) => (Math.abs(b.distanceMi - s.distanceMi) < Math.abs(a.distanceMi - s.distanceMi) ? b : a), s.routes[0]);
  // undefined = not chosen yet (use the closest route); null = free run.
  const [picked, setPicked] = useState<string | null | undefined>(undefined);
  const [showWhy, setShowWhy] = useState(false);

  // If the suggestion changes and the picked route drops out, fall back to the closest one.
  const route = picked === null ? null : s.routes.find((r) => r.id === picked) ?? closest;
  const targetMi = route ? route.distanceMi : s.distanceMi;
  const target = `${fmtDistance(targetMi, units, 1)} ${units}`;
  const query = new URLSearchParams({ target: String(targetMi), ...(route ? { route: route.id } : {}) });

  return (
    <section className="card suggest" aria-label="Suggested run for today">
      <Link to={`/record?${query}`} className="start-run" aria-label={`Start a run${route ? `, ${route.name}` : ''}, ${target}`}>
        <Play size={26} fill="currentColor" aria-hidden="true" />
        <span aria-hidden="true">{target}</span>
      </Link>

      <div className="suggest-head">
        <span className={`effort-pill ${s.effort}`}>
          {EFFORT[s.effort].icon}
          {EFFORT[s.effort].label}
        </span>
        <span className="icon-stat" aria-label={`About ${fmtDistance(s.distanceMi, units, 1)} ${units}`}>
          <MetricIcon metric="distance" size={17} />
          <strong>
            {fmtDistance(s.distanceMi, units, 1)} {units}
          </strong>
        </span>
        <span className="icon-stat" aria-label={`About ${s.minutes} minutes`}>
          <MetricIcon metric="time" size={17} />
          <strong>~{s.minutes}m</strong>
        </span>
        <button className="icon-btn suggest-info" onClick={() => setShowWhy((v) => !v)} aria-expanded={showWhy} aria-label="Why this suggestion">
          <Info size={18} aria-hidden="true" />
        </button>
      </div>
      {showWhy && <p className="suggest-why">{s.why}</p>}

      {route && (
        <div className="route-preview">
          <RouteMap route={route} aspect={2} label={`Map of ${route.name}, starting and finishing at home`} />
          <span className="route-preview-name" aria-hidden="true">
            {route.name}
          </span>
        </div>
      )}

      <div className="route-picks" role="radiogroup" aria-label="Choose a route">
        {s.routes.map((r) => (
          <button
            key={r.id}
            className="route-pick"
            role="radio"
            aria-checked={route?.id === r.id}
            aria-label={`${r.name}, ${fmtDistance(r.distanceMi, units, 1)} ${units}${r.climbFt >= HILLY_FT ? ', hilly' : ''}`}
            onClick={() => setPicked(r.id)}
          >
            <span className="route-thumb" aria-hidden="true">
              <RouteMap route={r} thumb aspect={1.7} />
            </span>
            <strong aria-hidden="true">
              {fmtDistance(r.distanceMi, units, 1)}
              <small>{units}</small>
              {r.climbFt >= HILLY_FT && <Mountain size={13} />}
            </strong>
            <span aria-hidden="true">{r.name}</span>
          </button>
        ))}
        <button className="route-pick" role="radio" aria-checked={route === null} aria-label="Free run, no route" onClick={() => setPicked(null)}>
          <span className="route-thumb" aria-hidden="true">
            <FreeRun size={30} />
          </span>
          <strong aria-hidden="true">Free</strong>
          <span aria-hidden="true">Any way</span>
        </button>
      </div>
    </section>
  );
}
