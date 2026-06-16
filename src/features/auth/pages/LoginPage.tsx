import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import type { LoginRequest, LoginResponse } from '../../../api/types';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../hooks/useAuth';

export function LoginPage() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'error' | 'warning'>('error');
  const justRegistered = (location.state as { readonly registered?: boolean } | null)?.registered;

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) =>
      apiClient.post<LoginResponse>(ENDPOINTS.AUTH.LOGIN, data).then((r) => r.data),
    onSuccess: (data) => {
      login(data.token);
      void navigate('/triage', { replace: true });
    },
    onError: (error: unknown) => {
      const axiosError = error as { readonly response?: { readonly data?: { readonly message?: string } } };
      const message = axiosError.response?.data?.message ?? t('login.invalidCredentials');
      setError(message);
      setErrorType(message.toLowerCase().includes('verify') ? 'warning' : 'error');
    },
  });

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); setError(null); loginMutation.mutate({ email, password }); };

  return (
    <main className="mx-auto max-w-md py-12">
      <Card>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('login.title')}</h1>
        {justRegistered && (
          <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
            {t('login.registrationSuccess')}
            <br />
            <span className="text-xs">{t('login.checkMailpit')}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input label={t('login.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label={t('login.password')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && (
            <p className={`text-sm ${
              errorType === 'warning'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-red-600 dark:text-red-400'
            }`}>
              {error}
            </p>
          )}
          <Button type="submit" className="w-full" isLoading={loginMutation.isPending}>
            {loginMutation.isPending ? t('login.submitting') : t('login.submit')}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('login.noAccount')}{' '}
          <Link to="/register" className="text-blue-600 underline hover:no-underline dark:text-blue-400">
            {t('login.registerLink')}
          </Link>
        </p>
      </Card>
    </main>
  );
}
