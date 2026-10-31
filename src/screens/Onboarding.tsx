import { useState, type ReactNode } from 'react';
import { Activity, ArrowRight, Bell, BellOff, Check, CalendarCheck, ChevronLeft, Footprints, HeartPulse, Medal, Sprout, TrendingUp, Trophy } from 'lucide-react';
import { useAppState, type Experience, type Goal } from '../state/AppState';
import { useUi } from '../state/ui';

interface Option<T> {
  value: T;
  title: string;
  detail: string;
  icon: ReactNode;
}

const GOALS: Option<Goal>[] = [
  { value: 'fitter', title: 'Fitter', detail: 'Feel healthier and build some stamina', icon: <HeartPulse /> },
  { value: '5k', title: 'Run a 5K', detail: 'Work up to a race or a 5K distance', icon: <Medal /> },
  { value: 'consistent', title: 'Habit', detail: 'Make running a regular habit', icon: <CalendarCheck /> },
  { value: 'track', title: 'Just track', detail: 'See what I did, no pressure', icon: <Footprints /> },
];

const LEVELS: Option<Experience>[] = [
  { value: 'new', title: 'New', detail: 'Just getting started', icon: <Sprout /> },
  { value: 'some', title: 'Sometimes', detail: 'A few runs a month', icon: <TrendingUp /> },
  { value: 'regular', title: 'Regularly', detail: 'Most weeks, without thinking about it', icon: <Trophy /> },
];

const NOTIFY: Option<boolean>[] = [
  { value: true, title: 'On', detail: 'One notification when a run summary is ready', icon: <Bell /> },
  { value: false, title: 'Off', detail: 'You can turn this on later in Settings', icon: <BellOff /> },
];

function Choices<T>({ options, value, onChange, label }: { options: Option<T>[]; value: T | null; onChange: (v: T) => void; label: string }) {
  return (
    <div className="option-grid" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          className="option tile"
          role="radio"
          aria-checked={value === o.value}
          aria-label={`${o.title}. ${o.detail}`}
          onClick={() => onChange(o.value)}
        >
          <span className="option-icon" aria-hidden="true">
            {o.icon}
          </span>
          <strong aria-hidden="true">{o.title}</strong>
        </button>
      ))}
    </div>
  );
}

/** Three quick questions, under a minute (PRD 3.6). */
export default function Onboarding() {
  const { update } = useAppState();
  const { toast } = useUi();
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState<Goal | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [notify, setNotify] = useState<boolean | null>(null);

  const steps = [
    {
      title: 'Your goal',
      body: <Choices label="Your goal" options={GOALS} value={goal} onChange={setGoal} />,
      ready: goal !== null,
    },
    {
      title: 'How often do you run?',
      body: <Choices label="Your experience" options={LEVELS} value={experience} onChange={setExperience} />,
      ready: experience !== null,
    },
    {
      title: 'Run ready alert',
      body: <Choices label="Notifications" options={NOTIFY} value={notify} onChange={setNotify} />,
      ready: notify !== null,
    },
  ];
  const current = steps[step];
  const last = step === steps.length - 1;

  const next = () => {
    if (!last) return setStep(step + 1);
    update({ onboarded: true, goal: goal!, experience: experience!, notifyOnSync: notify! });
    toast('All set');
  };

  return (
    <div className="onboarding">
      <div className="onboarding-top">
        {step > 0 ? (
          <button className="icon-btn back-icon" onClick={() => setStep(step - 1)} aria-label="Back">
            <ChevronLeft size={26} aria-hidden="true" />
          </button>
        ) : (
          <span />
        )}
        <div className="dots" aria-label={`Step ${step + 1} of ${steps.length}`} role="img">
          {steps.map((_, i) => (
            <span key={i} className={i === step ? 'on' : ''} />
          ))}
        </div>
      </div>

      {step === 0 && (
        <div className="brand" aria-label="Welcome to Connect">
          <Activity size={34} aria-hidden="true" />
        </div>
      )}
      <h1>{current.title}</h1>
      {current.body}

      <div className="onboarding-foot">
        <button className="round-btn big primary" disabled={!current.ready} onClick={next} aria-label={last ? 'Get started' : 'Continue'}>
          {last ? <Check size={28} aria-hidden="true" /> : <ArrowRight size={28} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
