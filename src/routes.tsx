import { createBrowserRouter } from 'react-router-dom';
import { MarketingLayout } from './components/layout/MarketingLayout';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AdminRoute } from './components/layout/AdminRoute';
import { NotFoundPage } from './components/shared/NotFoundPage';
import { RouteErrorFallback } from './components/shared/RouteErrorFallback';

// Public marketing pages (eager — they're the landing surface)
import LandingPage from './features/marketing/pages/LandingPage';
import AboutPage from './features/marketing/pages/AboutPage';
import HowItWorksPage from './features/marketing/pages/HowItWorksPage';
import PrivacyPage from './features/marketing/pages/PrivacyPage';
import TermsPage from './features/marketing/pages/TermsPage';
import CookiesPage from './features/marketing/pages/CookiesPage';
import ContactPage from './features/marketing/pages/ContactPage';

// Core app pages (eager — needed immediately after login)
import { VerifyEmailPage } from './features/auth/pages/VerifyEmailPage';
import { TriagePage } from './features/triage/pages/TriagePage';
import { TriageResultPage } from './features/triage/pages/TriageResultPage';
import { MySubmissionsPage } from './features/submissions/pages/MySubmissionsPage';

export const router = createBrowserRouter([
  // ================================================================
  // UNAUTH ROUTES — login, register, verify-email
  // No AppLayout wrapper — standalone pages for unauthenticated users.
  // ================================================================
  {
    errorElement: <RouteErrorFallback />,
    children: [
      {
        path: 'login',
        lazy: () =>
          import('./features/auth/pages/LoginPage').then((m) => ({
            element: <m.LoginPage />,
          })),
      },
      {
        path: 'register',
        lazy: () =>
          import('./features/auth/pages/RegisterPage').then((m) => ({
            element: <m.RegisterPage />,
          })),
      },
      { path: 'verify-email', element: <VerifyEmailPage /> },
    ],
  },

  // ================================================================
  // AUTHENTICATED ROUTES (AppLayout + ProtectedRoute)
  // AppLayout wraps protected and admin routes with the authenticated
  // header/nav.
  // ================================================================
  {
    element: <ProtectedRoute><AppLayout /></ProtectedRoute>,
    errorElement: <RouteErrorFallback />,
    children: [
      { index: true, path: 'triage', element: <TriagePage /> },
      { path: 'triage/:id/result', element: <TriageResultPage /> },
      { path: 'submissions', element: <MySubmissionsPage /> },

      // --- Admin pages (auth + admin role required, lazy loaded) ---
      {
        element: <AdminRoute />,
        errorElement: <RouteErrorFallback />,
        children: [
          {
            path: 'admin',
            lazy: () =>
              import('./features/admin/pages/DashboardPage').then((m) => ({
                element: <m.DashboardPage />,
              })),
          },
          {
            path: 'admin/submissions/:id',
            lazy: () =>
              import('./features/admin/pages/SubmissionDetailPage').then(
                (m) => ({ element: <m.SubmissionDetailPage /> }),
              ),
          },
          {
            path: 'admin/users',
            lazy: () =>
              import('./features/admin/pages/UsersPage').then((m) => ({
                element: <m.UsersPage />,
              })),
          },
        ],
      },
    ],
  },

  // ================================================================
  // PUBLIC MARKETING ROUTES (MarketingLayout)
  // Must come LAST because the catch-all (*) captures everything
  // that didn't match the AppLayout routes above. Public visitors
  // see the MarketingHeader/Footer on all pages including 404.
  // ================================================================
  {
    element: <MarketingLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'cookies', element: <CookiesPage /> },
      { path: 'contact', element: <ContactPage /> },
      // Catch-all 404 under MarketingLayout so public visitors see header/footer
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
