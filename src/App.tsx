import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './components/auth/AuthProvider';
import { Loader } from './components/shared/Loader';

function ThemeInit() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (stored === 'dark' || (!stored && prefersDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  return null;
}

export function App() {
  return (
    <>
      <ThemeInit />
      <AuthProvider>
        <RouterProvider
          router={router}
          fallbackElement={<Loader message="Loading..." />}
        />
      </AuthProvider>
    </>
  );
}
