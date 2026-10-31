export interface Run {
  id: string;
  date: Date;
  title: string;
  distanceMi: number;
  durationSec: number;
  paceSecPerMi: number;
  avgHr: number;
  cadence: number;
  elevationFt: number;
  calories: number;
}

// Sample persona: a casual runner, 2–3 runs a week, slowly getting faster.
// Dates are relative to today so the data always looks current in testing.
// [daysAgo, miles, pace sec/mi, avg HR, cadence spm, elevation ft, start hour]
const RAW: [number, number, number, number, number, number, number][] = [
  [0, 3.4, 588, 152, 164, 92, 7],
  [2, 2.6, 602, 149, 162, 40, 18],
  [4, 4.1, 615, 155, 161, 120, 8],
  [7, 3.1, 596, 151, 163, 64, 7],
  [9, 2.8, 610, 150, 161, 38, 18],
  [12, 3.5, 620, 156, 160, 88, 9],
  [14, 2.5, 605, 148, 162, 30, 7],
  [16, 3.0, 625, 154, 159, 70, 18],
  [19, 3.8, 632, 158, 158, 110, 8],
  [21, 2.4, 618, 151, 160, 26, 7],
  [24, 3.2, 640, 157, 158, 80, 18],
  [26, 2.7, 628, 153, 159, 44, 7],
  [28, 3.0, 645, 158, 157, 60, 9],
  [31, 2.2, 638, 154, 157, 22, 18],
  [35, 2.9, 652, 160, 156, 58, 8],
  [38, 2.5, 648, 157, 156, 35, 7],
  [42, 2.0, 660, 159, 155, 18, 18],
  [47, 2.3, 665, 161, 154, 28, 8],
];

function titleFor(hour: number): string {
  if (hour < 12) return 'Morning run';
  if (hour < 17) return 'Afternoon run';
  return 'Evening run';
}

export const ALL_RUNS: Run[] = RAW.map(([daysAgo, mi, pace, hr, cadence, elev, hour]) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, 12, 0, 0);
  return {
    id: `run-${daysAgo}`,
    date,
    title: titleFor(hour),
    distanceMi: mi,
    durationSec: Math.round(mi * pace),
    paceSecPerMi: pace,
    avgHr: hr,
    cadence,
    elevationFt: elev,
    calories: Math.round(mi * 105),
  };
});

/** The run that "syncs from the watch" when the app opens. */
export const TODAY_RUN_ID = ALL_RUNS[0].id;
