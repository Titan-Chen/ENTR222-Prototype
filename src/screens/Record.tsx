import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, CircleCheck, Flag, Pause, Play, Satellite, Target, Trash2, X } from 'lucide-react';
import { routeById } from '../data/routes';
import { titleFor, type Run } from '../data/runs';
import { fmtDistance, fmtDuration, fmtPace, paceUnit } from '../lib/format';
import { useAppState } from '../state/AppState';
import { useUi } from '../state/ui';
import { MetricIcon } from '../components/Icons';
import { BottomSheet, ConfirmDialog } from '../components/Overlay';

type Phase = 'locating' | 'ready' | 'running' | 'paused';

interface Live {
  movingSec: number;
  distanceMi: number;
  currentPace: number;
  hr: number;
  hrTotal: number;
}

const START: Live = { movingSec: 0, distanceMi: 0, currentPace: 0, hr: 105, hrTotal: 0 };
const BASE_PACE = 590; // sec per mile, matches the sample persona
const MIN_SAVE_MI = 0.01;

/**
 * Simulated run recording, standing in for the watch flow in the story map's
 * Release 1 (PRD 2.2–2.5): GPS check → start → live metrics → pause/resume → save.
 */
export default function Record() {
  const navigate = useNavigate();
  const { units, fastRuns, addRun } = useAppState();
  const { toast } = useUi();
  const [phase, setPhase] = useState<Phase>('locating');
  const [live, setLive] = useState<Live>(START);
  const [finishing, setFinishing] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const startedAt = useRef<Date | null>(null);
  // Route and target distance chosen from the suggestion card on Home.
  const [params] = useSearchParams();
  const route = routeById(params.get('route'));
  const targetMi = Number(params.get('target')) || route?.distanceMi || 0;
  const reached = targetMi > 0 && live.distanceMi >= targetMi;

  useEffect(() => {
    if (phase !== 'locating') return;
    const t = setTimeout(() => setPhase('ready'), 2000);
    return () => clearTimeout(t);
  }, [phase]);

  // One simulated second per tick; only while running, so paused time isn't counted (2.4).
  useEffect(() => {
    if (phase !== 'running') return;
    const id = setInterval(
      () =>
        setLive((l) => {
          const t = l.movingSec + 1;
          const pace = BASE_PACE + Math.sin(t / 23) * 25 + (Math.random() - 0.5) * 20;
          // Heart rate climbs to a steady ~150 within the first couple of minutes.
          const target = Math.min(152, 130 + t * 0.2);
          const hr = Math.round(l.hr + (target - l.hr) * 0.15 + (Math.random() - 0.5) * 3);
          return { movingSec: t, distanceMi: l.distanceMi + 1 / pace, currentPace: pace, hr, hrTotal: l.hrTotal + hr };
        }),
      fastRuns ? 100 : 1000,
    );
    return () => clearInterval(id);
  }, [phase, fastRuns]);

  const start = () => {
    startedAt.current = new Date();
    setPhase('running');
  };

  const save = () => {
    const date = startedAt.current ?? new Date();
    const run: Run = {
      id: `rec-${date.getTime()}`,
      date,
      title: route?.name ?? titleFor(date.getHours()),
      distanceMi: Math.round(live.distanceMi * 100) / 100,
      durationSec: live.movingSec,
      paceSecPerMi: Math.round(live.movingSec / live.distanceMi),
      avgHr: Math.round(live.hrTotal / live.movingSec),
      cadence: 160 + Math.round(Math.random() * 6),
      elevationFt: Math.round(live.distanceMi * 25),
      calories: Math.round(live.distanceMi * 105),
    };
    addRun(run);
    navigate(`/runs/${run.id}`, { replace: true });
    toast('Run saved');
  };

  const discard = () => {
    navigate('/', { replace: true });
    toast('Run discarded');
  };

  const canSave = live.distanceMi >= MIN_SAVE_MI;
  const status =
    phase === 'locating' ? 'Finding GPS…' : phase === 'ready' ? 'GPS ready' : phase === 'running' ? 'Recording' : 'Paused';

  return (
    <div className={`record record-${phase}`}>
      <div className="record-top">
        {phase === 'locating' || phase === 'ready' ? (
          <button className="icon-btn back-icon" onClick={() => navigate(-1)} aria-label="Cancel">
            <X size={26} aria-hidden="true" />
          </button>
        ) : (
          <span />
        )}
        <span className="record-status" role="status" aria-live="polite" aria-label={status} title={status}>
          {phase === 'locating' && <Satellite size={18} className="pulse" aria-hidden="true" />}
          {phase === 'ready' && <Satellite size={18} aria-hidden="true" />}
          {phase === 'paused' ? <Pause size={16} fill="currentColor" aria-hidden="true" /> : phase !== 'locating' && <span className="dot" aria-hidden="true" />}
        </span>
      </div>

      <div className="record-main">
        <div className="record-time">
          <MetricIcon metric="time" size={22} />
          <strong aria-label={`Time ${fmtDuration(live.movingSec)}`}>{fmtDuration(live.movingSec)}</strong>
        </div>
        <div className="record-grid">
          <div>
            <MetricIcon metric="distance" size={20} />
            <strong>
              {fmtDistance(live.distanceMi, units)}
              <small>{units}</small>
            </strong>
          </div>
          <div>
            <MetricIcon metric="pace" size={20} />
            <strong>
              {live.currentPace ? fmtPace(live.currentPace, units) : '--:--'}
              <small>{paceUnit(units)}</small>
            </strong>
          </div>
          <div>
            <MetricIcon metric="heartRate" size={20} />
            <strong>
              {phase === 'running' || phase === 'paused' ? live.hr : '--'}
              <small>bpm</small>
            </strong>
          </div>
        </div>
        {targetMi > 0 && (
          <div
            className={`record-target${reached ? ' reached' : ''}`}
            role="progressbar"
            aria-label={`${route ? route.name + ', ' : ''}target ${fmtDistance(targetMi, units, 1)} ${units}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(Math.min(1, live.distanceMi / targetMi) * 100)}
          >
            <div className="record-target-top" aria-hidden="true">
              <span className="icon-stat">
                {route ? <MetricIcon metric="distance" size={16} /> : <Target size={16} />}
                {route?.name ?? fmtDistance(targetMi, units, 1) + ' ' + units}
              </span>
              <span className="icon-stat">
                {reached ? <CircleCheck size={16} /> : <Target size={16} />}
                {fmtDistance(targetMi, units, 1)} {units}
              </span>
            </div>
            <div className="progress" aria-hidden="true">
              <div style={{ width: `${Math.min(100, (live.distanceMi / targetMi) * 100)}%` }} />
            </div>
          </div>
        )}
      </div>

      <div className="record-controls">
        {phase === 'ready' && (
          <button className="record-btn start" onClick={start} aria-label="Start run">
            <Play size={40} fill="currentColor" aria-hidden="true" />
          </button>
        )}
        {phase === 'running' && (
          <button className="record-btn pause" onClick={() => setPhase('paused')} aria-label="Pause run">
            <Pause size={40} fill="currentColor" aria-hidden="true" />
          </button>
        )}
        {phase === 'paused' && (
          <div className="record-pair">
            <button className="record-btn start small" onClick={() => setPhase('running')} aria-label="Resume run">
              <Play size={30} fill="currentColor" aria-hidden="true" />
              </button>
            <button className="record-btn finish small" onClick={() => setFinishing(true)} aria-label="Finish run">
              <Flag size={30} aria-hidden="true" />
              </button>
          </div>
        )}
      </div>

      {finishing && (
        <BottomSheet title="Finish" onClose={() => setFinishing(false)}>
          <div className="stat-row finish-stats" aria-label={`${fmtDistance(live.distanceMi, units)} ${units} in ${fmtDuration(live.movingSec)}`}>
            <span className="icon-stat" aria-hidden="true">
              <MetricIcon metric="distance" size={20} />
              <strong>
                {fmtDistance(live.distanceMi, units)} {units}
              </strong>
            </span>
            <span className="icon-stat" aria-hidden="true">
              <MetricIcon metric="time" size={20} />
              <strong>{fmtDuration(live.movingSec)}</strong>
            </span>
          </div>
          {!canSave && <p className="sr-only">Too short to save.</p>}
          <div className="icon-actions">
            <button className="round-btn big danger" onClick={() => setConfirmDiscard(true)} aria-label="Discard run">
              <Trash2 size={24} aria-hidden="true" />
            </button>
            <button className="round-btn big" onClick={() => setFinishing(false)} aria-label="Keep going">
              <Play size={24} fill="currentColor" aria-hidden="true" />
            </button>
            <button className="round-btn big good" onClick={save} disabled={!canSave} aria-label={canSave ? 'Save run' : 'Too short to save'}>
              <Check size={26} aria-hidden="true" />
            </button>
          </div>
        </BottomSheet>
      )}
      {confirmDiscard && (
        <ConfirmDialog
          title="Discard this run?"
          message="It won't be saved."
          confirmLabel="Discard"
          onConfirm={discard}
          onCancel={() => setConfirmDiscard(false)}
        />
      )}
    </div>
  );
}
