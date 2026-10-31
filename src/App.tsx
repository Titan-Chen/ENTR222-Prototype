import { useEffect, useRef } from 'react';
import { HashRouter, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { House, List, Settings as SettingsIcon } from 'lucide-react';
import { AppStateProvider, useAppState } from './state/AppState';
import { UiProvider } from './state/ui';
import { NotificationBanner, SyncWatcher, Toast } from './components/Feedback';
import { DemoPanel } from './components/DemoPanel';
import Home from './screens/Home';
import Runs from './screens/Runs';
import RunSummary from './screens/RunSummary';
import MoreDetails from './screens/MoreDetails';
import Settings from './screens/Settings';
import Onboarding from './screens/Onboarding';

export default function App() {
  return (
    <HashRouter>
      <AppStateProvider>
        <UiProvider>
          <Device />
        </UiProvider>
      </AppStateProvider>
    </HashRouter>
  );
}

function Device() {
  const { onboarded } = useAppState();
  return (
    <div className="device">
      {onboarded ? <Shell /> : <Onboarding />}
      <NotificationBanner />
      <Toast aboveTabBar={onboarded} />
      <DemoPanel />
    </div>
  );
}

function Shell() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <SyncWatcher />
      <main ref={mainRef} className="screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/runs" element={<Runs />} />
          <Route path="/runs/:id" element={<RunSummary />} />
          <Route path="/runs/:id/details" element={<MoreDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/advanced" element={<MoreDetails />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <TabBar />
    </>
  );
}

function TabBar() {
  const tabs = [
    { to: '/', label: 'Home', icon: House, end: true },
    { to: '/runs', label: 'Runs', icon: List, end: false },
    { to: '/settings', label: 'Settings', icon: SettingsIcon, end: false },
  ];
  return (
    <nav className="tabbar" aria-label="Main">
      {tabs.map(({ to, label, icon: Icon, end }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => (isActive ? 'active' : '')}>
          <Icon size={24} aria-hidden="true" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
