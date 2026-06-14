import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { App } from './App';
import { ToastProvider } from './components/ui/ToastProvider';
import './i18n';
import './styles/index.css';

// Initialize dark mode before React hydrates to prevent flash
const stored = localStorage.getItem('theme');
if (stored === 'dark' || stored === 'light') {
  document.documentElement.classList.toggle('dark', stored === 'dark');
} else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.classList.add('dark');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
);
