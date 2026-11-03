import { Link } from 'react-router-dom';
import { Bell, CalendarCheck, ChevronRight, Footprints, HeartPulse, Medal, Ruler, SlidersHorizontal, Target } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Units } from '../lib/format';
import { useAppState, type Goal } from '../state/AppState';
import { useUi } from '../state/ui';

const GOALS: Record<Goal, { name: string; icon: ReactNode }> = {
  fitter: { name: 'Get fitter', icon: <HeartPulse size={18} /> },
  '5k': { name: 'Run a 5K', icon: <Medal size={18} /> },
  consistent: { name: 'Stay consistent', icon: <CalendarCheck size={18} /> },
  track: { name: 'Just track my runs', icon: <Footprints size={18} /> },
};

/** Everyday settings as icon rows; advanced options sit one level down (PRD 3.1). */
export default function Settings() {
  const { notifyOnSync, units, goal, update } = useAppState();
  const { toast } = useUi();

  const setUnits = (u: Units) => {
    if (u === units) return;
    update({ units: u });
    toast(u === 'mi' ? 'Miles' : 'Kilometers');
  };

  return (
    <div className="stack">
      <h1 className="sr-only">Settings</h1>

      <div className="card settings-group">
        <div className="setting-row">
          <Bell size={22} className="row-icon" aria-hidden="true" />
          <div className="grow" id="notify-label">
            Run ready alert
          </div>
          <button
            className="switch"
            role="switch"
            aria-checked={notifyOnSync}
            aria-labelledby="notify-label"
            onClick={() => {
              update({ notifyOnSync: !notifyOnSync });
              toast(notifyOnSync ? 'Alerts off' : 'Alerts on');
            }}
          />
        </div>

        <div className="setting-row">
          <Ruler size={22} className="row-icon" aria-hidden="true" />
          <div className="grow">Units</div>
          <div className="segmented" role="radiogroup" aria-label="Distance units">
            {(['mi', 'km'] as Units[]).map((u) => (
              <button key={u} role="radio" aria-checked={units === u} onClick={() => setUnits(u)}>
                {u}
              </button>
            ))}
          </div>
        </div>

        <button className="setting-row" onClick={() => update({ onboarded: false })} aria-label={`Goal: ${GOALS[goal].name}. Change`}>
          <Target size={22} className="row-icon" aria-hidden="true" />
          <div className="grow icon-stat">
            {GOALS[goal].icon}
            {GOALS[goal].name}
          </div>
          <ChevronRight size={20} aria-hidden="true" />
        </button>

        <Link to="/advanced" className="setting-row">
          <SlidersHorizontal size={22} className="row-icon" aria-hidden="true" />
          <div className="grow">Advanced</div>
          <ChevronRight size={20} aria-hidden="true" />
        </Link>
      </div>

      <p className="subtle" style={{ textAlign: 'center', fontSize: 13 }}>
        ENTR222 prototype · sample data
      </p>
    </div>
  );
}
