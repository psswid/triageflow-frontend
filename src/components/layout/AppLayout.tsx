import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ImpersonationBanner } from './ImpersonationBanner';
import { CookieBanner } from '../shared/CookieBanner';
import { useAuth } from '../../hooks/useAuth';

export function AppLayout() {
  const { isAuthenticated, isAdmin, isImpersonating, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={logout} />
      {isImpersonating && <ImpersonationBanner />}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  );
}
