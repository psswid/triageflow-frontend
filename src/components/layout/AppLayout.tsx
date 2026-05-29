import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { useAuth } from '../../hooks/useAuth';

export function AppLayout() {
  const { isAuthenticated, isAdmin, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header isAuthenticated={isAuthenticated} isAdmin={isAdmin} onLogout={logout} />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
