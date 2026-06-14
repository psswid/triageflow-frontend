import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './components/auth/AuthProvider';
import { Loader } from './components/shared/Loader';

export function App() {
  return (
    <AuthProvider>
      <RouterProvider
        router={router}
        fallbackElement={<Loader message="Loading..." />}
      />
    </AuthProvider>
  );
}
