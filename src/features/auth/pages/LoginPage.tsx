import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import type { LoginRequest, LoginResponse } from '../../../api/types';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const justRegistered = (location.state as { readonly registered?: boolean } | null)?.registered;

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) =>
      apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, data).then((r) => r.data),
    onSuccess: (data) => {
      login(data.token);
      void navigate('/triage', { replace: true });
    },
    onError: () => setError('Invalid email or password'),
  });

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); setError(null); loginMutation.mutate({ email, password }); };

  return (
    <div className="mx-auto max-w-md py-12">
      <Card>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Login</h1>
        {justRegistered && (
          <p className="mt-2 text-sm text-green-600 dark:text-green-400">Account created! Please login.</p>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>Login</Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline dark:text-blue-400">Register</Link>
        </p>
      </Card>
    </div>
  );
}
