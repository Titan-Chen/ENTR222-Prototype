import { CAMPUS, HILLS, HOME, LAKE, MAP_SIZE, PARK, RIVER, SIDE_STREETS, STREETS, TRAILS, pathLength, pointAlong, type Pt } from '../data/map';
import type { Route } from '../data/routes';

const line = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

/** Frame the map around the route (or home), padded and stretched to the frame's aspect ratio. */
function viewBox(path: Pt[] | undefined, aspect: number, pad: number) {
  const pts = path ?? [[HOME[0] - 60, HOME[1] - 45], [HOME[0] + 60, HOME[1] + 45]];
  let x0 = Math.min(...pts.map((p) => p[0])) - pad;
  let x1 = Math.max(...pts.map((p) => p[0])) + pad;
  let y0 = Math.min(...pts.map((p) => p[1])) - pad;
  let y1 = Math.max(...pts.map((p) => p[1])) + pad;
  const w = x1 - x0;
  const h = y1 - y0;
  if (w / h < aspect) {
    const grow = (h * aspect - w) / 2;
    x0 -= grow;
    x1 += grow;
  } else {
    const grow = (w / aspect - h) / 2;
    y0 -= grow;
    y1 += grow;
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/**
 * A route drawn on the neighborhood map so the runner can follow it street by
 * street. Direction arrows show which way to go; `progress` (0–1) marks how far
 * along the runner is during a recording.
 */
export function RouteMap({
  route,
  progress,
  aspect = 1.6,
  thumb = false,
  label,
}: {
  route?: Route;
  progress?: number;
  aspect?: number;
  thumb?: boolean;
  label?: string;
}) {
  const path = route?.path;
  const vb = viewBox(path, aspect, thumb ? 10 : 22);
  // Keep strokes a steady on-screen size whatever the zoom.
  const k = vb.w / (thumb ? 90 : 340);
  const total = path ? pathLength(path) : 0;
  const arrowCount = path && !thumb ? Math.max(3, Math.floor(total / (70 * k))) : 0;
  const arrows = Array.from({ length: arrowCount }, (_, i) => pointAlong(path!, (i + 0.5) / arrowCount));
  // With no route (a free run) the runner simply shows at home.
  const here = progress === undefined ? null : path ? pointAlong(path, progress) : { pt: HOME, index: 0 };
  const done = path && here ? [...path.slice(0, here.index), here.pt] : null;

  return (
    <svg
      className={`route-map${thumb ? ' thumb' : ''}`}
      viewBox={`${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}`}
      preserveAspectRatio="xMidYMid meet"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {/* "meet" keeps the whole route in frame; the map itself runs past the edges to fill any extra room. */}
      <g>
        <rect className="map-land" x={-MAP_SIZE} y={-MAP_SIZE} width={MAP_SIZE * 3} height={MAP_SIZE * 3} />
        {HILLS.rings.map(([rx, ry], i) => (
          <ellipse key={i} className="map-hill" cx={HILLS.cx} cy={HILLS.cy} rx={rx} ry={ry} strokeWidth={1.2 * k} />
        ))}
        <rect className="map-park" x={PARK.x} y={PARK.y} width={PARK.w} height={PARK.h} rx={4} />
        <rect className="map-campus" x={CAMPUS.x} y={CAMPUS.y} width={CAMPUS.w} height={CAMPUS.h} rx={3} />
        <ellipse className="map-water" cx={LAKE.cx} cy={LAKE.cy} rx={LAKE.rx} ry={LAKE.ry} />
        <path className="map-river" d={line(RIVER)} strokeWidth={14} />
        {SIDE_STREETS.map(([x1, y1, x2, y2], i) => (
          <line key={`s${i}`} className="map-street side" x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={Math.max(2, 3 * k)} />
        ))}
        {STREETS.map(([x1, y1, x2, y2], i) => (
          <line key={`m${i}`} className="map-street" x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={Math.max(3.5, 5 * k)} />
        ))}
        {TRAILS.map((t, i) => (
          <path key={`t${i}`} className="map-trail" d={line(t)} strokeWidth={1.4 * k} strokeDasharray={`${3 * k} ${3 * k}`} />
        ))}

        {path && (
          <>
            <path className="map-route-casing" d={line(path)} strokeWidth={(thumb ? 7 : 8) * k} />
            <path className="map-route" d={line(path)} strokeWidth={(thumb ? 4 : 4.5) * k} />
            {done && <path className="map-route-done" d={line(done)} strokeWidth={4.5 * k} />}
            {arrows.map(({ pt, angle }, i) => (
              <path
                key={i}
                className="map-arrow"
                d={`M${-2.2 * k} ${-2.6 * k} L${1.8 * k} 0 L${-2.2 * k} ${2.6 * k}`}
                strokeWidth={1.4 * k}
                transform={`translate(${pt[0].toFixed(1)} ${pt[1].toFixed(1)}) rotate(${angle.toFixed(0)})`}
              />
            ))}
          </>
        )}

        {/* Home: where every route starts and finishes. */}
        <circle className="map-start" cx={HOME[0]} cy={HOME[1]} r={(thumb ? 4.5 : 6) * k} strokeWidth={(thumb ? 1.5 : 2) * k} />
        {!thumb && <path className="map-start-flag" d={`M${HOME[0] - 1.6 * k} ${HOME[1] - 2.6 * k} v${5.2 * k} M${HOME[0] - 1.6 * k} ${HOME[1] - 2.6 * k} h${3.6 * k} l${-0.9 * k} ${1.3 * k} l${0.9 * k} ${1.3 * k} h${-3.6 * k}`} strokeWidth={0.9 * k} />}

        {here && (
          <g transform={`translate(${here.pt[0].toFixed(1)} ${here.pt[1].toFixed(1)})`}>
            <circle className="map-you-halo" r={11 * k} />
            <circle className="map-you" r={5.5 * k} strokeWidth={2.2 * k} />
          </g>
        )}
      </g>
    </svg>
  );
}
