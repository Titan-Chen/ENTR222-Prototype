import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ALL_RUNS, TODAY_RUN_ID, type Run } from '../data/runs';
import type { Units } from '../lib/format';

export type Goal = 'fitter' | '5k' | 'consistent' | 'track';
export type Experience = 'new' | 'some' | 'regular';

interface Persisted {
  onboarded: boolean;
  goal: Goal;
  experience: Experience;
  notifyOnSync: boolean;
  units: Units;
  deletedIds: string[];
  slowSync: boolean;
  /** Runs recorded in the app with "Start a run". */
  recordedRuns: Run[];
  /** Demo only: run the recording clock at 10x. */
  fastRuns: boolean;
}

/** waiting → syncing → done (banner shows "ready") → idle */
export type SyncStatus = 'waiting' | 'syncing' | 'done' | 'idle';

interface AppState extends Persisted {
  runs: Run[];
  sync: { status: SyncStatus; progress: number };
  /** Increments each time a sync finishes, so listeners can react once. */
  syncCompletions: number;
  todaySynced: boolean;
  update: (patch: Partial<Persisted>) => void;
  deleteRun: (id: string) => void;
  restoreRun: (id: string) => void;
  addRun: (run: Run) => void;
  restartSync: () => void;
  resetAll: () => void;
}

const STORAGE_KEY = 'connect-casual-prototype-v1';

const DEFAULTS: Persisted = {
  onboarded: false,
  goal: 'fitter',
  experience: 'some',
  notifyOnSync: true,
  units: 'mi',
  deletedIds: [],
  slowSync: false,
  recordedRuns: [],
  fastRuns: false,
};

const FAST_SYNC_MS = 6000;
const SLOW_SYNC_MS = 15000;
const TICK_MS = 150;

function load(): Persisted {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const saved = { ...DEFAULTS, ...JSON.parse(raw) } as Persisted;
    // Dates come back from JSON as strings.
    saved.recordedRuns = saved.recordedRuns.map((r) => ({ ...r, date: new Date(r.date) }));
    return saved;
  } catch {
    return DEFAULTS;
  }
}

const Ctx = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<Persisted>(load);
  const [sync, setSync] = useState<AppState['sync']>({ status: 'waiting', progress: 0 });
  const [syncCompletions, setSyncCompletions] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
    } catch {
      // Private mode or blocked storage: the prototype still works for this session.
    }
  }, [persisted]);

  // Start syncing "today's run" once the user is past onboarding.
  useEffect(() => {
    if (persisted.onboarded && sync.status === 'waiting') setSync({ status: 'syncing', progress: 0 });
  }, [persisted.onboarded, sync.status]);

  useEffect(() => {
    if (sync.status !== 'syncing') return;
    const step = (100 * TICK_MS) / (persisted.slowSync ? SLOW_SYNC_MS : FAST_SYNC_MS);
    const id = setInterval(() => {
      setSync((s) => {
        const progress = Math.min(100, s.progress + step);
        return progress >= 100 ? { status: 'done', progress: 100 } : { ...s, progress };
      });
    }, TICK_MS);
    return () => clearInterval(id);
  }, [sync.status, persisted.slowSync]);

  useEffect(() => {
    if (sync.status !== 'done') return;
    setSyncCompletions((n) => n + 1);
    const t = setTimeout(() => setSync((s) => (s.status === 'done' ? { status: 'idle', progress: 100 } : s)), 5000);
    return () => clearTimeout(t);
  }, [sync.status]);

  const todaySynced = sync.status === 'done' || sync.status === 'idle';

  const runs = useMemo(
    () =>
      [...persisted.recordedRuns, ...ALL_RUNS]
        .filter((r) => !persisted.deletedIds.includes(r.id) && (r.id !== TODAY_RUN_ID || todaySynced))
        .sort((a, b) => b.date.getTime() - a.date.getTime()),
    [persisted.recordedRuns, persisted.deletedIds, todaySynced],
  );

  const update = useCallback((patch: Partial<Persisted>) => setPersisted((p) => ({ ...p, ...patch })), []);

  const deleteRun = useCallback(
    (id: string) => setPersisted((p) => ({ ...p, deletedIds: [...p.deletedIds, id] })),
    [],
  );

  const restoreRun = useCallback(
    (id: string) => setPersisted((p) => ({ ...p, deletedIds: p.deletedIds.filter((d) => d !== id) })),
    [],
  );

  const addRun = useCallback(
    (run: Run) => setPersisted((p) => ({ ...p, recordedRuns: [run, ...p.recordedRuns] })),
    [],
  );

  const restartSync = useCallback(() => setSync({ status: 'waiting', progress: 0 }), []);

  const resetAll = useCallback(() => {
    setPersisted(DEFAULTS);
    setSync({ status: 'waiting', progress: 0 });
  }, []);

  const value: AppState = {
    ...persisted,
    runs,
    sync,
    syncCompletions,
    todaySynced,
    update,
    deleteRun,
    restoreRun,
    addRun,
    restartSync,
    resetAll,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}
