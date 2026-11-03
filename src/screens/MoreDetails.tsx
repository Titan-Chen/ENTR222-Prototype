import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const RUN_DETAILS = ['Lap splits', 'Heart rate zones', 'Running dynamics', 'Training effect', 'VO2 max', 'Performance charts'];
const ADVANCED_SETTINGS = ['Custom data screens', 'Heart rate zone thresholds', 'Sensors & accessories', 'Advanced mode'];

/**
 * Stand-in for the second layer (PRD 3.1). Layer 2 is post-MVP, so in the real
 * product this would open the existing Connect screens.
 */
export default function MoreDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const items = id ? RUN_DETAILS : ADVANCED_SETTINGS;

  return (
    <div className="stack">
      <div>
        <button className="back-btn" onClick={() => (window.history.state?.idx > 0 ? navigate(-1) : navigate('/'))}>
          <ChevronLeft size={22} aria-hidden="true" /> Back
        </button>
        <header className="page-header">
          <h1>{id ? 'More details' : 'Advanced'}</h1>
          <p className="subtle">
            {id
              ? 'For runners who want every number. In the full app, this opens the existing Connect activity screens.'
              : 'Detailed settings for experienced users. In the full app, this opens the existing Connect settings.'}
          </p>
        </header>
      </div>

      <div className="card">
        <h2 style={{ fontSize: 16 }}>{id ? 'Available here' : 'Settings here'}</h2>
        <ul className="locked-list">
          {items.map((item) => (
            <li key={item}>
              <span>{item}</span>
              <span>Existing screen</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="hint">The redesign of this layer is planned for a later release.</p>
    </div>
  );
}
