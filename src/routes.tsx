import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AdminRoute } from './components/layout/AdminRoute';
import { TriagePage } from './features/triage/pages/TriagePage';
import { TriageResultPage } from './features/triage/pages/TriageResultPage';
import { MySubmissionsPage } from './features/submissions/pages/MySubmissionsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/triage" replace /> },

      // Public routes
      {
        path: 'login',
        lazy: () => import('./features/auth/pages/LoginPage').then((m) => ({ element: <m.LoginPage /> })),
      },
      {
        path: 'register',
        lazy: () => import('./features/auth/pages/RegisterPage').then((m) => ({ element: <m.RegisterPage /> })),
      },

      // Protected routes (requires authentication)
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'triage', element: <TriagePage /> },
          { path: 'triage/:id/result', element: <TriageResultPage /> },
          { path: 'submissions', element: <MySubmissionsPage /> },
        ],
      },

      // Admin routes (requires admin role)
      {
        element: <AdminRoute />,
        children: [
          {
            path: 'admin',
            lazy: () => import('./features/admin/pages/DashboardPage').then((m) => ({ element: <m.DashboardPage /> })),
          },
          {
            path: 'admin/submissions/:id',
            lazy: () => import('./features/admin/pages/SubmissionDetailPage').then((m) => ({ element: <m.SubmissionDetailPage /> })),
          },
          {
            path: 'admin/users',
            lazy: () => import('./features/admin/pages/UsersPage').then((m) => ({ element: <m.UsersPage /> })),
          },
        ],
      },
    ],
  },
]);
