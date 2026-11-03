import { HILL_TRAIL, HOME, LAKE_SHORE, PARK_PATH, RIDGE_TRAIL, RIVER_PATH, type Pt } from './map';

export interface Route {
  id: string;
  name: string;
  distanceMi: number;
  climbFt: number;
  /** Turn-by-turn loop on the neighborhood map, starting and ending at home. */
  path: Pt[];
}

const loop = (...pts: Pt[]): Pt[] => [HOME, ...pts, HOME].filter((p, i, a) => i === 0 || p[0] !== a[i - 1][0] || p[1] !== a[i - 1][1]);
const riverside = RIVER_PATH.filter(([x]) => x >= 150 && x <= 250);

/** Sample saved routes near the persona's home. */
export const ROUTES: Route[] = [
  { id: 'block', name: 'Block loop', distanceMi: 1.2, climbFt: 15, path: loop([200, 170], [200, 210], [150, 210]) },
  { id: 'river', name: 'Riverside', distanceMi: 2.1, climbFt: 20, path: loop([150, 210], ...riverside, [250, 170]) },
  { id: 'park', name: 'Park circuit', distanceMi: 2.8, climbFt: 60, path: loop([150, 140], ...PARK_PATH, [150, 90], [90, 90], [90, 170]) },
  { id: 'campus', name: 'Campus', distanceMi: 3.1, climbFt: 45, path: loop([150, 140], [250, 140], [250, 210], [150, 210]) },
  { id: 'hills', name: 'Hill trail', distanceMi: 3.6, climbFt: 240, path: loop(...HILL_TRAIL, [150, 90]) },
  { id: 'lake', name: 'Lakefront', distanceMi: 4.4, climbFt: 30, path: loop([150, 50], ...LAKE_SHORE, [200, 90], [200, 170]) },
  { id: 'ridge', name: 'Ridge loop', distanceMi: 5.2, climbFt: 310, path: loop([150, 210], ...RIDGE_TRAIL, [150, 50], [150, 90], [200, 90], [200, 170]) },
];

export const HILLY_FT = 150;

export function routeById(id: string | null | undefined): Route | undefined {
  return ROUTES.find((r) => r.id === id);
}

/** The saved route a run most likely followed, by distance. */
export function closestRoute(distanceMi: number): Route {
  return ROUTES.reduce((a, b) => (Math.abs(b.distanceMi - distanceMi) < Math.abs(a.distanceMi - distanceMi) ? b : a));
}
