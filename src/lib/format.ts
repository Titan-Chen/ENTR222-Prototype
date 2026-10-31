export type Units = 'mi' | 'km';

const KM_PER_MI = 1.609344;

const pad = (n: number) => String(n).padStart(2, '0');

export function toUnits(mi: number, units: Units): number {
  return units === 'mi' ? mi : mi * KM_PER_MI;
}

export function fmtDistance(mi: number, units: Units, digits = 2): string {
  return toUnits(mi, units).toFixed(digits);
}

/** Seconds per mile converted to seconds per chosen unit. */
export function paceInUnits(secPerMi: number, units: Units): number {
  return units === 'mi' ? secPerMi : secPerMi / KM_PER_MI;
}

export function fmtPace(secPerMi: number, units: Units): string {
  const s = Math.round(paceInUnits(secPerMi, units));
  return `${Math.floor(s / 60)}:${pad(s % 60)}`;
}

export function paceUnit(units: Units): string {
  return units === 'mi' ? '/mi' : '/km';
}

export function fmtDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.round(sec % 60);
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`;
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

export function daysBetween(a: Date, b: Date): number {
  return Math.round((startOfDay(a) - startOfDay(b)) / 86_400_000);
}

export function fmtDay(date: Date, now = new Date()): string {
  const diff = daysBetween(now, date);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
}

export function fmtTime(date: Date): string {
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function fmtShortDate(date: Date): string {
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/** Monday of the week containing `date`. */
export function weekStart(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}
