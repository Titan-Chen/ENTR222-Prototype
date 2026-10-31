import type { Units } from '../lib/format';

export type MetricKey = 'pace' | 'distance' | 'time' | 'heartRate' | 'cadence' | 'climb';

interface MetricInfo {
  /** Everyday label shown on the first layer (PRD 3.3). */
  label: (units: Units) => string;
  /** Technical term, shown on tap. */
  technical: string;
  what: string;
  why: string;
}

// Plain-language explanations for every metric the app shows (PRD 1.4).
export const METRICS: Record<MetricKey, MetricInfo> = {
  pace: {
    label: (u) => (u === 'mi' ? 'Time per mile' : 'Time per km'),
    technical: 'Average pace',
    what: 'How long it took you, on average, to cover each mile or kilometer. A smaller number means you were moving faster.',
    why: 'Over weeks, pace shows whether running is getting easier. Day to day it changes with hills, heat, and how rested you are, so one slow run is nothing to worry about.',
  },
  distance: {
    label: () => 'Distance',
    technical: 'Distance',
    what: 'How far you went, measured by your watch’s GPS.',
    why: 'Slowly adding distance is the safest way to build fitness. A common rule of thumb is to add no more than about 10% a week.',
  },
  time: {
    label: () => 'Time running',
    technical: 'Elapsed time',
    what: 'How long you were running, from start to finish. Time while paused on your watch is not counted.',
    why: 'Time on your feet matters as much as distance. Even 20–30 minutes a few times a week builds a solid base.',
  },
  heartRate: {
    label: () => 'Heart rate',
    technical: 'Average heart rate (bpm)',
    what: 'How many times your heart beat each minute, averaged over the run. Your watch measures it at your wrist.',
    why: 'If your heart rate gets lower at the same pace over time, your fitness is improving. Easy runs should feel comfortable enough to talk.',
  },
  cadence: {
    label: () => 'Steps per minute',
    technical: 'Cadence',
    what: 'How many steps you took each minute, counting both feet.',
    why: 'Quicker, shorter steps are often gentler on your joints. Most casual runners land somewhere between 150 and 180.',
  },
  climb: {
    label: () => 'Uphill',
    technical: 'Elevation gain',
    what: 'The total height you climbed during the run, adding up every uphill section.',
    why: 'Hills make a run harder, so a slower pace on a hilly route can be just as much work as a fast flat one.',
  },
};
