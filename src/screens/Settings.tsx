import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Units } from '../lib/format';
import { useAppState, type Goal } from '../state/AppState';
import { useUi } from '../state/ui';

const GOAL_NAMES: Record<Goal, string> = {
  fitter: 'Get fitter',
  '5k': 'Run a 5K',
  consistent: 'Stay consistent',
  track: 'Just track my runs',
};

/** Everyday settings only; advanced options sit one level down (PRD 3.1). */
export default function Settings() {
  const { notifyOnSync, units, goal, update } = useAppState();
  const { toast } = useUi();

  const setUnits = (u: Units) => {
    if (u === units) return;
    update({ units: u });
    toast(u === 'mi' ? 'Showing miles' : 'Showing kilometers');
  };

  return (
    <div className="stack">
      <header className="page-header">
        <h1>Settings</h1>
      </header>

      <section>
        <h2 className="group-title">Notifications</h2>
        <div className="card settings-group">
          <div className="setting-row">
            <div className="grow" id="notify-label">
              Run summary is ready
              <span>Get a notification when a run finishes syncing from your watch.</span>
            </div>
            <button
              className="switch"
              role="switch"
              aria-checked={notifyOnSync}
              aria-labelledby="notify-label"
              onClick={() => {
                update({ notifyOnSync: !notifyOnSync });
                toast(notifyOnSync ? 'Notifications off' : 'Notifications on');
              }}
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="group-title">Display</h2>
        <div className="card settings-group">
          <div className="setting-row">
            <div className="grow">Distance</div>
            <div className="segmented" role="radiogroup" aria-label="Distance units">
              {(['mi', 'km'] as Units[]).map((u) => (
                <button key={u} role="radio" aria-checked={units === u} onClick={() => setUnits(u)}>
                  {u === 'mi' ? 'Miles' : 'Km'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="group-title">You</h2>
        <div className="card settings-group">
          <button className="setting-row" onClick={() => update({ onboarded: false })}>
            <div className="grow">
              Your goal
              <span>{GOAL_NAMES[goal]}</span>
            </div>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Change</span>
          </button>
          <Link to="/advanced" className="setting-row">
            <div className="grow">
              Advanced
              <span>Data screens, heart rate zones, sensors</span>
            </div>
            <ChevronRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <p className="subtle" style={{ textAlign: 'center', fontSize: 13 }}>
        Prototype for ENTR222 · sample data only
      </p>
    </div>
  );
}
