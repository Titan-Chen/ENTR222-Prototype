import { useMemo } from 'react';
import type { Run } from '../data/runs';
import { fmtDistance, fmtShortDate, weekStart } from '../lib/format';
import { useAppState } from '../state/AppState';
import { PendingRunRow, RunRow } from '../components/RunRow';

function weekLabel(start: Date, thisWeek: Date): string {
  const weeksAgo = Math.round((thisWeek.getTime() - start.getTime()) / (7 * 86_400_000));
  if (weeksAgo === 0) return 'This week';
  if (weeksAgo === 1) return 'Last week';
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${fmtShortDate(start)} – ${fmtShortDate(end)}`;
}

/** Past runs in one reverse-chronological list (PRD 1.5, 2.7). */
export default function Runs() {
  const { runs, units, todaySynced } = useAppState();

  const groups = useMemo(() => {
    const thisWeek = weekStart(new Date());
    const map = new Map<number, Run[]>();
    for (const run of runs) {
      const key = weekStart(run.date).getTime();
      map.set(key, [...(map.get(key) ?? []), run]);
    }
    return [...map.entries()].map(([key, items]) => ({
      label: weekLabel(new Date(key), thisWeek),
      total: items.reduce((sum, r) => sum + r.distanceMi, 0),
      items,
    }));
  }, [runs]);

  return (
    <div className="stack">
      <header className="page-header">
        <h1>Your runs</h1>
        <p className="subtle">
          {runs.length} runs, newest first
        </p>
      </header>

      {!todaySynced && <PendingRunRow />}

      {groups.map((g) => (
        <section key={g.label} className="week-group" aria-label={g.label}>
          <h2>
            {g.label} <span>· {fmtDistance(g.total, units, 1)} {units}</span>
          </h2>
          <div className="run-list">
            {g.items.map((run) => (
              <RunRow key={run.id} run={run} />
            ))}
          </div>
        </section>
      ))}

      {runs.length === 0 && <p className="subtle">No runs yet. Your next run will show up here after it syncs.</p>}
    </div>
  );
}
