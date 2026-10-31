import { forwardRef, useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { Link2, Share2 } from 'lucide-react';
import type { Run } from '../data/runs';
import { fmtDay, fmtDistance, fmtDuration, fmtPace, paceUnit, type Units } from '../lib/format';
import { useAppState } from '../state/AppState';
import { useUi } from '../state/ui';
import { BottomSheet } from './Overlay';
import { RouteSketch } from './RouteSketch';

interface CardProps {
  run: Run;
  insight: string;
  units: Units;
  showHeartRate: boolean;
}

const ShareCard = forwardRef<HTMLDivElement, CardProps>(function ShareCard({ run, insight, units, showHeartRate }, ref) {
  return (
    <div ref={ref} className="share-card">
      <div className="share-card-date">{fmtDay(run.date)}</div>
      <div className="share-card-title">{run.title}</div>
      <div className="share-card-route">
        <RouteSketch id={run.id} />
      </div>
      <div className="share-card-dist">
        {fmtDistance(run.distanceMi, units)}
        <small>{units}</small>
      </div>
      <div className="share-card-stats">
        <div>
          <span>Time</span>
          <strong>{fmtDuration(run.durationSec)}</strong>
        </div>
        <div>
          <span>Pace</span>
          <strong>
            {fmtPace(run.paceSecPerMi, units)}
            {paceUnit(units)}
          </strong>
        </div>
        {showHeartRate && (
          <div>
            <span>Heart rate</span>
            <strong>{run.avgHr} bpm</strong>
          </div>
        )}
      </div>
      <div className="share-card-insight">{insight}</div>
    </div>
  );
});

interface ShareProps {
  run: Run;
  insight: string;
  onClose: () => void;
}

export function ShareSheet(props: ShareProps) {
  return (
    <BottomSheet title="Share your run" onClose={props.onClose}>
      <SharePanel {...props} />
    </BottomSheet>
  );
}

/**
 * Share a run as an image (PRD 1.6, 2.8): Share → Share image → pick an app = 3 taps.
 * Heart rate is off by default, matching the PRD's privacy stance on health data (4.3).
 * Used in a sheet on the run summary and inline on the Home card.
 */
export function SharePanel({ run, insight, onClose }: ShareProps) {
  const { units } = useAppState();
  const { toast } = useUi();
  const cardRef = useRef<HTMLDivElement>(null);
  const [showHeartRate, setShowHeartRate] = useState(false);
  const [busy, setBusy] = useState(false);

  const shareImage = async () => {
    if (!cardRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `run-${run.date.toISOString().slice(0, 10)}.png`, { type: 'image/png' });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: run.title });
        toast('Run shared');
      } else {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = file.name;
        a.click();
        toast('Image saved. Share it from your photos or downloads');
      }
      onClose();
    } catch (e) {
      // The user closed the system share sheet without picking an app.
      if ((e as Error).name !== 'AbortError') toast('Couldn’t create the image. Please try again');
    } finally {
      setBusy(false);
    }
  };

  const copyLink = async () => {
    const url = `${location.origin}${location.pathname}#/runs/${run.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast('Link copied');
      onClose();
    } catch {
      toast('Couldn’t copy the link');
    }
  };

  return (
    <>
      <ShareCard ref={cardRef} run={run} insight={insight} units={units} showHeartRate={showHeartRate} />

      <div className="setting-row" style={{ padding: '12px 0' }}>
        <div className="grow">
          Include heart rate
          <span>Health data stays private unless you add it.</span>
        </div>
        <button
          className="switch"
          role="switch"
          aria-checked={showHeartRate}
          aria-label="Include heart rate"
          onClick={() => setShowHeartRate((v) => !v)}
        />
      </div>

      <div className="stack" style={{ gap: 10 }}>
        <button className="btn btn-primary btn-block" onClick={shareImage} disabled={busy}>
          <Share2 size={18} aria-hidden="true" /> {busy ? 'Preparing image…' : 'Share image'}
        </button>
        <button className="btn btn-secondary btn-block" onClick={copyLink}>
          <Link2 size={18} aria-hidden="true" /> Copy link
        </button>
      </div>
    </>
  );
}
