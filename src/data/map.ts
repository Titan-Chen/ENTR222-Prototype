/**
 * A small made-up neighborhood around the persona's home, in a 300 × 300 map
 * space. Routes are drawn along these streets and trails so a runner can follow
 * them turn by turn. Stands in for real map tiles in the prototype.
 */
export type Pt = [number, number];

export const MAP_SIZE = 300;
export const HOME: Pt = [150, 170];

/** Major streets as [x1, y1, x2, y2]. */
export const STREETS: [number, number, number, number][] = [
  [90, 50, 190, 50],
  [90, 90, 300, 90],
  [90, 140, 300, 140],
  [90, 170, 300, 170],
  [90, 210, 300, 210],
  [90, 50, 90, 240],
  [150, 0, 150, 240],
  [200, 90, 200, 240],
  [250, 90, 250, 240],
];

/** Side streets, drawn thinner. */
export const SIDE_STREETS: [number, number, number, number][] = [
  [90, 115, 300, 115],
  [150, 190, 300, 190],
  [120, 50, 120, 90],
  [120, 140, 120, 240],
  [175, 90, 175, 240],
  [225, 90, 225, 240],
  [275, 90, 275, 240],
];

export const PARK = { x: 95, y: 95, w: 50, h: 40 };
export const CAMPUS = { x: 205, y: 145, w: 40, h: 60 };
export const LAKE = { cx: 240, cy: 50, rx: 44, ry: 30 };

/** River centerline, flowing across the south of the map. */
export const RIVER: Pt[] = [[0, 266], [60, 260], [100, 257], [150, 259], [200, 255], [250, 252], [300, 257]];

/** Hills to the west: contour rings around one summit. */
export const HILLS = { cx: 45, cy: 130, rings: [[40, 88], [28, 62], [16, 38]] as Pt[] };

// Trails that leave the street grid. Routes reuse these pieces.
export const RIVER_PATH: Pt[] = RIVER.map(([x, y]) => [x, y - 17]);
export const PARK_PATH: Pt[] = [[145, 133], [122, 129], [101, 118], [104, 99], [128, 97], [145, 104]];
export const HILL_TRAIL: Pt[] = [[90, 170], [62, 178], [40, 162], [30, 132], [44, 102], [68, 92], [90, 90]];
export const RIDGE_TRAIL: Pt[] = [[90, 210], [52, 216], [22, 182], [14, 122], [24, 62], [58, 26], [90, 50]];
export const LAKE_SHORE: Pt[] = Array.from({ length: 33 }, (_, i) => {
  // Start at the lake's west point and go clockwise.
  const a = Math.PI + (i / 32) * Math.PI * 2;
  return [LAKE.cx + (LAKE.rx + 6) * Math.cos(a), LAKE.cy + (LAKE.ry + 6) * Math.sin(a)];
});

export const TRAILS: Pt[][] = [RIVER_PATH, [...PARK_PATH, PARK_PATH[0]], HILL_TRAIL, RIDGE_TRAIL, LAKE_SHORE];

/** Length of a polyline in map units. */
export function pathLength(path: Pt[]) {
  let total = 0;
  for (let i = 1; i < path.length; i++) total += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
  return total;
}

/** The point and heading a fraction (0–1) of the way along a polyline. */
export function pointAlong(path: Pt[], fraction: number): { pt: Pt; angle: number; index: number } {
  const goal = Math.max(0, Math.min(1, fraction)) * pathLength(path);
  let walked = 0;
  for (let i = 1; i < path.length; i++) {
    const [x1, y1] = path[i - 1];
    const [x2, y2] = path[i];
    const seg = Math.hypot(x2 - x1, y2 - y1);
    if (walked + seg >= goal || i === path.length - 1) {
      const t = seg ? Math.min(1, (goal - walked) / seg) : 0;
      return { pt: [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t], angle: (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI, index: i };
    }
    walked += seg;
  }
  return { pt: path[0], angle: 0, index: 1 };
}
