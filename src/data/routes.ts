export interface Route {
  id: string;
  name: string;
  distanceMi: number;
  climbFt: number;
}

/** Sample saved routes near the persona's home. */
export const ROUTES: Route[] = [
  { id: 'block', name: 'Block loop', distanceMi: 1.2, climbFt: 15 },
  { id: 'river', name: 'Riverside', distanceMi: 2.1, climbFt: 20 },
  { id: 'park', name: 'Park circuit', distanceMi: 2.8, climbFt: 60 },
  { id: 'campus', name: 'Campus', distanceMi: 3.1, climbFt: 45 },
  { id: 'hills', name: 'Hill trail', distanceMi: 3.6, climbFt: 240 },
  { id: 'lake', name: 'Lakefront', distanceMi: 4.4, climbFt: 30 },
  { id: 'ridge', name: 'Ridge loop', distanceMi: 5.2, climbFt: 310 },
];

export const HILLY_FT = 150;

export function routeById(id: string | null): Route | undefined {
  return ROUTES.find((r) => r.id === id);
}
