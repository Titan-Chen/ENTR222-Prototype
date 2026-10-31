import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flag, Pause, Play, Satellite, X } from 'lucide-react';
import { titleFor, type Run } from '../data/runs';
import { fmtDistance, fmtDuration, fmtPace, paceUnit } from '../lib/format';
import { useAppState } from '../state/AppState';
import { useUi } from '../state/ui';
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
      title: titleFor(date.getHours()),
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
          <button className="back-btn" style={{ margin: 0 }} onClick={() => navigate(-1)}>
            <X size={20} aria-hidden="true" /> Cancel
          </button>
        ) : (
          <span />
        )}
        <span className="record-status" role="status" aria-live="polite">
          {phase === 'locating' ? <Satellite size={16} className="pulse" aria-hidden="true" /> : <span className="dot" aria-hidden="true" />}
          {status}
        </span>
      </div>

      <div className="record-main">
        <div className="record-time">
          <span>Time</span>
          <strong>{fmtDuration(live.movingSec)}</strong>
        </div>
        <div className="record-grid">
          <div>
            <span>Distance</span>
            <strong>
              {fmtDistance(live.distanceMi, units)}
              <small>{units}</small>
            </strong>
          </div>
          <div>
            <span>Pace</span>
            <strong>
              {live.currentPace ? fmtPace(live.currentPace, units) : '--:--'}
              <small>{paceUnit(units)}</small>
            </strong>
          </div>
          <div>
            <span>Heart rate</span>
            <strong>
              {phase === 'running' || phase === 'paused' ? live.hr : '--'}
              <small>bpm</small>
            </strong>
          </div>
        </div>
      </div>

      <div className="record-controls">
        {phase === 'locating' && <p className="subtle">Stay still for a moment so your location can be found.</p>}
        {phase === 'ready' && (
          <button className="record-btn start" onClick={start} aria-label="Start run">
            <Play size={40} fill="currentColor" aria-hidden="true" />
            <span>Start</span>
          </button>
        )}
        {phase === 'running' && (
          <button className="record-btn pause" onClick={() => setPhase('paused')} aria-label="Pause run">
            <Pause size={40} fill="currentColor" aria-hidden="true" />
            <span>Pause</span>
          </button>
        )}
        {phase === 'paused' && (
          <div className="record-pair">
            <button className="record-btn start small" onClick={() => setPhase('running')} aria-label="Resume run">
              <Play size={30} fill="currentColor" aria-hidden="true" />
              <span>Resume</span>
            </button>
            <button className="record-btn finish small" onClick={() => setFinishing(true)} aria-label="Finish run">
              <Flag size={30} aria-hidden="true" />
              <span>Finish</span>
            </button>
          </div>
        )}
      </div>

      {finishing && (
        <BottomSheet title="Finish your run?" onClose={() => setFinishing(false)}>
          <p className="subtle" style={{ marginBottom: 16 }}>
            {canSave
              ? `${fmtDistance(live.distanceMi, units)} ${units} in ${fmtDuration(live.movingSec)}. Save it to see your summary.`
              : 'This run is too short to save. Keep going a little longer, or discard it.'}
          </p>
          <div className="stack" style={{ gap: 10 }}>
            <button className="btn btn-primary btn-block" onClick={save} disabled={!canSave}>
              Save run
            </button>
            <button className="btn btn-secondary btn-block" onClick={() => setFinishing(false)}>
              Keep going
            </button>
            <button className="link-danger" onClick={() => setConfirmDiscard(true)}>
              Discard run
            </button>
          </div>
        </BottomSheet>
      )}
      {confirmDiscard && (
        <ConfirmDialog
          title="Discard this run?"
          message="It won't be saved to your history."
          confirmLabel="Discard"
          onConfirm={discard}
          onCancel={() => setConfirmDiscard(false)}
        />
      )}
    </div>
  );
}
