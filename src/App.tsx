import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './components/auth/AuthProvider';

export function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
