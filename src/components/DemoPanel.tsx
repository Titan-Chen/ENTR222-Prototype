import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../state/AppState';
import { useUi } from '../state/ui';
import { BottomSheet } from './Overlay';

const enabled = /[?&#]demo\b/.test(window.location.search + window.location.hash);

/** Facilitator controls for usability sessions. Open the app with ?demo to show them. */
export function DemoPanel() {
  const [open, setOpen] = useState(false);
  const { slowSync, deletedIds, update, restartSync, resetAll } = useAppState();
  const { toast } = useUi();
  const navigate = useNavigate();

  if (!enabled) return null;

  const run = (label: string, fn: () => void) => () => {
    fn();
    setOpen(false);
    toast(label);
  };

  return (
    <>
      <button className="demo-pill" onClick={() => setOpen(true)}>
        Demo
      </button>
      {open && (
        <BottomSheet title="Demo controls" onClose={() => setOpen(false)}>
          <div className="demo-actions">
            <button className="btn btn-secondary" onClick={run('Sync restarted', () => { navigate('/'); restartSync(); })}>
              Re-run today’s sync
            </button>
            <button className="btn btn-secondary" onClick={run(slowSync ? 'Fast sync (6 s)' : 'Slow sync (15 s)', () => update({ slowSync: !slowSync }))}>
              Sync speed: {slowSync ? 'slow (15 s)' : 'fast (6 s)'}
            </button>
            <button
              className="btn btn-secondary"
              disabled={deletedIds.length === 0}
              onClick={run('Deleted runs restored', () => update({ deletedIds: [] }))}
            >
              Restore deleted runs ({deletedIds.length})
            </button>
            <button className="btn btn-primary" onClick={run('Reset for next tester', () => { resetAll(); navigate('/'); })}>
              Reset everything (new tester)
            </button>
          </div>
        </BottomSheet>
      )}
    </>
  );
}
