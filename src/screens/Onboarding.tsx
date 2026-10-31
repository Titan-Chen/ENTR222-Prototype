import { useState, type ReactNode } from 'react';
import { Activity, Bell, BellOff, CalendarCheck, ChevronLeft, Footprints, HeartPulse, Medal, Sprout, TrendingUp, Trophy } from 'lucide-react';
import { useAppState, type Experience, type Goal } from '../state/AppState';
import { useUi } from '../state/ui';

interface Option<T> {
  value: T;
  title: string;
  detail: string;
  icon: ReactNode;
}

const GOALS: Option<Goal>[] = [
  { value: 'fitter', title: 'Get fitter', detail: 'Feel healthier and build some stamina', icon: <HeartPulse /> },
  { value: '5k', title: 'Run a 5K', detail: 'Work up to a race or a 5K distance', icon: <Medal /> },
  { value: 'consistent', title: 'Stay consistent', detail: 'Make running a regular habit', icon: <CalendarCheck /> },
  { value: 'track', title: 'Just track my runs', detail: 'See what I did, no pressure', icon: <Footprints /> },
];

const LEVELS: Option<Experience>[] = [
  { value: 'new', title: 'New to running', detail: 'Just getting started', icon: <Sprout /> },
  { value: 'some', title: 'I run sometimes', detail: 'A few runs a month', icon: <TrendingUp /> },
  { value: 'regular', title: 'I run regularly', detail: 'Most weeks, without thinking about it', icon: <Trophy /> },
];

const NOTIFY: Option<boolean>[] = [
  { value: true, title: 'Yes, let me know', detail: 'One notification when a run summary is ready', icon: <Bell /> },
  { value: false, title: 'Not now', detail: 'You can turn this on later in Settings', icon: <BellOff /> },
];

function Choices<T>({ options, value, onChange, label }: { options: Option<T>[]; value: T | null; onChange: (v: T) => void; label: string }) {
  return (
    <div className="option-list" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button
          key={String(o.value)}
          className="option"
          role="radio"
          aria-checked={value === o.value}
          aria-label={`${o.title}. ${o.detail}`}
          onClick={() => onChange(o.value)}
        >
          <span className="option-icon" aria-hidden="true">
            {o.icon}
          </span>
          <span className="option-text">
            <strong>{o.title}</strong>
            <span>{o.detail}</span>
          </span>
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
      title: 'What brings you here?',
      sub: 'We’ll set up your home screen around it.',
      body: <Choices label="Your goal" options={GOALS} value={goal} onChange={setGoal} />,
      ready: goal !== null,
    },
    {
      title: 'How much do you run?',
      sub: 'So we explain things at the right level.',
      body: <Choices label="Your experience" options={LEVELS} value={experience} onChange={setExperience} />,
      ready: experience !== null,
    },
    {
      title: 'Want a heads-up when your run is ready?',
      sub: 'Runs can take a moment to come over from your watch.',
      body: <Choices label="Notifications" options={NOTIFY} value={notify} onChange={setNotify} />,
      ready: notify !== null,
    },
  ];
  const current = steps[step];
  const last = step === steps.length - 1;

  const next = () => {
    if (!last) return setStep(step + 1);
    update({ onboarded: true, goal: goal!, experience: experience!, notifyOnSync: notify! });
    toast('You’re all set');
  };

  return (
    <div className="onboarding">
      <div className="onboarding-top">
        {step > 0 ? (
          <button className="back-btn" style={{ margin: 0 }} onClick={() => setStep(step - 1)}>
            <ChevronLeft size={22} aria-hidden="true" /> Back
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
        <div className="brand">
          <Activity size={26} aria-hidden="true" /> Welcome to Connect
        </div>
      )}
      <h1>{current.title}</h1>
      <p className="subtle">{current.sub}</p>
      {current.body}

      <div className="onboarding-foot">
        <button className="btn btn-primary btn-block" disabled={!current.ready} onClick={next}>
          {last ? 'Get started' : 'Continue'}
        </button>
      </div>
    </div>
  );
}
