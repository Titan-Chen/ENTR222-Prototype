import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { TODAY_RUN_ID } from '../data/runs';
import { useAppState } from '../state/AppState';
import { useUi } from '../state/ui';

export function Toast({ aboveTabBar }: { aboveTabBar: boolean }) {
  const { toastData, dismissToast } = useUi();

  useEffect(() => {
    if (!toastData) return;
    const t = setTimeout(dismissToast, toastData.onAction ? 5000 : 2800);
    return () => clearTimeout(t);
  }, [toastData, dismissToast]);

  return (
    <div role="status" aria-live="polite">
      {toastData && (
        <div key={toastData.id} className={`toast${aboveTabBar ? '' : ' no-tabbar'}`}>
          <span>{toastData.message}</span>
          {toastData.onAction && (
            <button
              onClick={() => {
                toastData.onAction?.();
                dismissToast();
              }}
            >
              {toastData.actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export function NotificationBanner() {
  const { notificationData, dismissNotification } = useUi();
  const navigate = useNavigate();

  useEffect(() => {
    if (!notificationData) return;
    const t = setTimeout(dismissNotification, 7000);
    return () => clearTimeout(t);
  }, [notificationData, dismissNotification]);

  if (!notificationData) return null;
  return (
    <button
      key={notificationData.id}
      className="notification"
      onClick={() => {
        dismissNotification();
        navigate(notificationData.to);
      }}
    >
      <span className="notification-icon" aria-hidden="true">
        <Activity size={22} />
      </span>
      <span className="notification-text">
        <span className="notification-app">Connect · now</span>
        <span className="notification-title" style={{ display: 'block' }}>
          {notificationData.title}
        </span>
        <span className="notification-body" style={{ display: 'block' }}>
          {notificationData.body}
        </span>
      </span>
    </button>
  );
}

/**
 * When sync finishes (PRD 2.11): if the user has moved away from Home, show a
 * phone-style notification; on Home the sync banner already says it's ready.
 */
export function SyncWatcher() {
  const { syncCompletions, notifyOnSync } = useAppState();
  const { notify } = useUi();
  const { pathname } = useLocation();
  const pathRef = useRef(pathname);
  pathRef.current = pathname;

  useEffect(() => {
    if (syncCompletions === 0 || !notifyOnSync || pathRef.current === '/') return;
    notify({
      title: 'Your run summary is ready',
      body: 'Tap to see how today’s run went.',
      to: `/runs/${TODAY_RUN_ID}`,
    });
    // Only react to a new completion, not to setting changes.
  }, [syncCompletions]);

  return null;
}
