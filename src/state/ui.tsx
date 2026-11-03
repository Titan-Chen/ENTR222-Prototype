import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

interface ToastData {
  id: number;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationData {
  id: number;
  title: string;
  body: string;
  to: string;
}

interface Ui {
  toastData: ToastData | null;
  notificationData: NotificationData | null;
  /** Short confirmation for every action (PRD 3.8). Pass an action for undo (PRD 3.7). */
  toast: (message: string, action?: { label: string; onAction: () => void }) => void;
  dismissToast: () => void;
  /** Simulated phone notification (PRD 2.11). */
  notify: (n: Omit<NotificationData, 'id'>) => void;
  dismissNotification: () => void;
}

const Ctx = createContext<Ui | null>(null);

let nextId = 1;

export function UiProvider({ children }: { children: ReactNode }) {
  const [toastData, setToast] = useState<ToastData | null>(null);
  const [notificationData, setNotification] = useState<NotificationData | null>(null);

  const toast = useCallback<Ui['toast']>((message, action) => {
    setToast({ id: nextId++, message, actionLabel: action?.label, onAction: action?.onAction });
  }, []);
  const dismissToast = useCallback(() => setToast(null), []);
  const notify = useCallback<Ui['notify']>((n) => setNotification({ ...n, id: nextId++ }), []);
  const dismissNotification = useCallback(() => setNotification(null), []);

  const value = useMemo(
    () => ({ toastData, notificationData, toast, dismissToast, notify, dismissNotification }),
    [toastData, notificationData, toast, dismissToast, notify, dismissNotification],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUi(): Ui {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useUi must be used inside UiProvider');
  return ctx;
}
