/** Decorative loop shape for a run, generated from its id so each run looks different but stable. */
function seeded(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function RouteSketch({ id, stroke = '#fff' }: { id: string; stroke?: string }) {
  const rand = seeded(id);
  const waves = [1, 2, 3].map((k) => ({ k: k + 1, amp: 6 + rand() * 10, phase: rand() * Math.PI * 2 }));
  const stretch = 0.75 + rand() * 0.5;
  const points: [number, number][] = [];
  const n = 60;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    const r = 36 + waves.reduce((sum, w) => sum + w.amp * Math.sin(w.k * t + w.phase), 0) * 0.6;
    points.push([50 + r * Math.cos(t) * stretch, 50 + r * Math.sin(t)]);
  }
  const d = points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const [sx, sy] = points[0];
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d={d} fill="none" stroke={stroke} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" opacity="0.9" />
      <circle cx={sx} cy={sy} r="4.5" fill="#4ade80" stroke="#0b0d10" strokeWidth="1.5" />
    </svg>
  );
}
