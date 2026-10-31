import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { fmtClock, type DaySeries } from '../lib/intraday';

const W = 340;
const H = 180;
const PAD = { l: 34, r: 8, t: 10, b: 22 };
const PLOT_W = W - PAD.l - PAD.r;
const PLOT_H = H - PAD.t - PAD.b;
const X_TICKS = [
  [0, '12a'],
  [360, '6a'],
  [720, '12p'],
  [1080, '6p'],
  [1440, '12a'],
] as const;

const compact = (v: number) => (v >= 1000 ? `${Math.round(v / 100) / 10}K` : String(Math.round(v)));

/**
 * Today's readings for one metric: a 2px line (heart rate, stress), a 10% area
 * wash (Body Battery) or hourly columns (steps). Single series, so no legend box;
 * the sheet title names it. Pointer and arrow keys move a readout along the day.
 */
export function DayChart({ series, color, unit, name }: { series: DaySeries; color: string; unit: string; name: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const { points, yMin, yMax, kind } = series;

  const x = (min: number) => PAD.l + (min / 1440) * PLOT_W;
  const y = (v: number) => PAD.t + (1 - (v - yMin) / (yMax - yMin)) * PLOT_H;
  const baseY = y(yMin);
  const valid = points.map((p, i) => (p.v === null ? -1 : i)).filter((i) => i >= 0);
  const lastIdx = valid[valid.length - 1];

  const nearest = (clientX: number) => {
    const rect = svgRef.current!.getBoundingClientRect();
    const min = (((clientX - rect.left) / rect.width) * W - PAD.l) / PLOT_W * 1440;
    if (kind === 'bars') return Math.max(0, Math.min(points.length - 1, Math.floor(min / series.step)));
    return valid.reduce((best, i) => (Math.abs(points[i].min - min) < Math.abs(points[best].min - min) ? i : best), valid[0]);
  };

  const onPointer = (e: PointerEvent) => setActive(nearest(e.clientX));
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const pos = valid.indexOf(active ?? lastIdx);
    const next = Math.max(0, Math.min(valid.length - 1, pos + (e.key === 'ArrowRight' ? 1 : -1)));
    setActive(valid[next]);
  };

  // Line segments break at gaps (no stress reading during a run).
  const segments: { min: number; v: number }[][] = [];
  for (const p of points) {
    if (p.v === null) segments.push([]);
    else (segments[segments.length - 1] ?? segments[segments.push([]) - 1]).push({ min: p.min, v: p.v });
  }
  const linePaths = segments.filter((s) => s.length > 1).map((s) => s.map((p, i) => `${i ? 'L' : 'M'}${x(p.min).toFixed(1)} ${y(p.v).toFixed(1)}`).join(' '));
  const areaPaths = segments
    .filter((s) => s.length > 1)
    .map((s, k) => `${linePaths[k]} L${x(s[s.length - 1].min).toFixed(1)} ${baseY} L${x(s[0].min).toFixed(1)} ${baseY} Z`);

  const slot = (series.step / 1440) * PLOT_W;
  const barW = Math.min(24, slot - 2);
  const barPath = (min: number, v: number) => {
    const x0 = x(min) + (slot - barW) / 2;
    const x1 = x0 + barW;
    const top = y(v);
    const h = baseY - top;
    if (h <= 0.5) return '';
    const r = Math.min(4, barW / 2, h);
    return `M${x0} ${baseY} V${top + r} Q${x0} ${top} ${x0 + r} ${top} H${x1 - r} Q${x1} ${top} ${x1} ${top + r} V${baseY} Z`;
  };

  const yTicks = [yMin, (yMin + yMax) / 2, yMax];
  const shown = active ?? null;
  const tipPoint = shown !== null ? points[shown] : null;
  const tipX = tipPoint ? x(kind === 'bars' ? tipPoint.min + series.step / 2 : tipPoint.min) : 0;
  const inRun = (min: number) => series.runs.some((r) => min >= r.start && min < r.end);
  const tipTime = tipPoint
    ? kind === 'bars'
      ? `${fmtClock(tipPoint.min)} – ${fmtClock(tipPoint.min + series.step)}`
      : fmtClock(tipPoint.min)
    : '';

  const dot = (i: number) => {
    const p = points[i];
    if (p.v === null) return null;
    const cx = kind === 'bars' ? x(p.min) + slot / 2 : x(p.min);
    return <circle cx={cx} cy={y(p.v)} r={4.5} fill={color} stroke="var(--surface)" strokeWidth={2} />;
  };

  return (
    <div className="day-chart">
      <div
        className="day-chart-plot"
        tabIndex={0}
        role="img"
        aria-label={`${name} today. Use left and right arrow keys to read values.`}
        onKeyDown={onKey}
        onBlur={() => setActive(null)}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          aria-hidden="true"
          onPointerMove={onPointer}
          onPointerDown={onPointer}
          onPointerLeave={() => setActive(null)}
          style={{ touchAction: 'pan-y' }}
        >
          {series.runs.map((r, i) => (
            <rect key={i} className="run-band" x={x(r.start)} y={PAD.t} width={Math.max(2, x(r.end) - x(r.start))} height={PLOT_H} rx={2} />
          ))}
          {yTicks.map((t) => (
            <g key={t}>
              <line className="grid" x1={PAD.l} x2={W - PAD.r} y1={y(t)} y2={y(t)} />
              <text className="tick" x={PAD.l - 6} y={y(t) + 3.5} textAnchor="end">
                {compact(t)}
              </text>
            </g>
          ))}
          {X_TICKS.map(([m, label]) => (
            <text key={m} className="tick" x={x(m)} y={H - 6} textAnchor={m === 0 ? 'start' : m === 1440 ? 'end' : 'middle'}>
              {label}
            </text>
          ))}

          {kind === 'area' && areaPaths.map((d, i) => <path key={i} d={d} fill={color} opacity={0.1} />)}
          {kind !== 'bars' &&
            linePaths.map((d, i) => <path key={i} d={d} fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />)}
          {kind === 'bars' &&
            points.map((p, i) =>
              p.v ? <path key={i} d={barPath(p.min, p.v)} fill={color} opacity={shown === null || shown === i ? 1 : 0.55} /> : null,
            )}

          {tipPoint && kind !== 'bars' && <line className="crosshair" x1={tipX} x2={tipX} y1={PAD.t} y2={baseY} />}
          {shown !== null ? kind !== 'bars' && dot(shown) : kind !== 'bars' && lastIdx !== undefined && dot(lastIdx)}
          {/* Hit layer covers the whole plot so the pointer only needs the right time, not the 2px line. */}
          <rect x={PAD.l} y={PAD.t} width={PLOT_W} height={PLOT_H} fill="transparent" />
        </svg>

        {tipPoint && (
          <div className="chart-tip" style={{ left: `${Math.min(80, Math.max(20, (tipX / W) * 100))}%` }}>
            <span className="chart-tip-key" style={{ background: color }} />
            <strong>
              {tipPoint.v === null ? '–' : tipPoint.v.toLocaleString()}
              {tipPoint.v !== null && unit && <small> {unit}</small>}
            </strong>
            <span>{tipTime}</span>
            {inRun(tipPoint.min) && <span className="chart-tip-run">Run</span>}
          </div>
        )}
      </div>

      {series.runs.length > 0 && (
        <div className="chart-legend" aria-hidden="true">
          <span className="run-swatch" /> Run
        </div>
      )}

      <table className="sr-only">
        <caption>{name} by hour today</caption>
        <tbody>
          {points
            .filter((p, i) => kind === 'bars' || p.min % 60 === 0 || i === points.length - 1)
            .map((p, i) => (
              <tr key={i}>
                <th scope="row">{fmtClock(p.min)}</th>
                <td>{p.v === null ? 'No reading' : `${p.v} ${unit}`}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
