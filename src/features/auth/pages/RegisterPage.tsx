import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import type { RegisterRequest, RegisterResponse } from '../../../api/types';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export function RegisterPage() {
  const { t } = useTranslation('auth');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<{ readonly email?: string; readonly password?: string; readonly password_confirmation?: string }>({});

  const register = useMutation({
    mutationFn: (data: RegisterRequest) =>
      apiClient.post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, data).then((r) => r.data),
    onSuccess: () => navigate('/login', { state: { registered: true } }),
    onError: (error: unknown) => {
      const axiosError = error as { readonly response?: { readonly data?: { readonly errors?: readonly { readonly detail?: string }[] } } };
      const errData = axiosError.response?.data;
      if (errData?.errors) {
        const fieldErrors: { email?: string; password?: string; password_confirmation?: string } = {};
        for (const e of errData.errors) {
          if (e.detail?.includes('email')) fieldErrors.email = e.detail;
          if (e.detail?.includes('password')) fieldErrors.password = e.detail;
          if (e.detail?.includes('password_confirmation')) fieldErrors.password_confirmation = e.detail;
        }
        setErrors(fieldErrors);
      }
    },
  });

  const validatePasswordsMatch = (): boolean => {
    if (password !== passwordConfirmation) {
      setErrors((prev) => ({ ...prev, password_confirmation: t('register.passwordMismatch') }));
      return false;
    }
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validatePasswordsMatch()) return;
    register.mutate({ email, password, password_confirmation: passwordConfirmation });
  };

  return (
    <main className="mx-auto max-w-md py-12">
      <Card>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('register.title')}</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input label={t('register.email')} type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />
          <Input label={t('register.password')} type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} required minLength={8} />
          <Input label={t('register.confirmPassword')} type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} error={errors.password_confirmation} required minLength={8} />
          <Button type="submit" className="w-full" isLoading={register.isPending}>
            {register.isPending ? t('register.submitting') : t('register.submit')}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {t('register.haveAccount')}{' '}
          <Link to="/login" className="text-blue-600 underline hover:no-underline dark:text-blue-400">
            {t('register.loginLink')}
          </Link>
        </p>
      </Card>
    </main>
  );
}
