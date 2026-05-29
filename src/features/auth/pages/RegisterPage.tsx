import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import type { RegisterRequest, RegisterResponse } from '../../../api/types';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

export function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ readonly email?: string; readonly password?: string }>({});

  const register = useMutation({
    mutationFn: (data: RegisterRequest) =>
      apiClient.post<RegisterResponse>(ENDPOINTS.AUTH.REGISTER, data).then((r) => r.data),
    onSuccess: () => navigate('/login', { state: { registered: true } }),
    onError: (error: unknown) => {
      const axiosError = error as { readonly response?: { readonly data?: { readonly errors?: readonly { readonly detail?: string }[] } } };
      const errData = axiosError.response?.data;
      if (errData?.errors) {
        const fieldErrors: { email?: string; password?: string } = {};
        for (const e of errData.errors) {
          if (e.detail?.includes('email')) fieldErrors.email = e.detail;
          if (e.detail?.includes('password')) fieldErrors.password = e.detail;
        }
        setErrors(fieldErrors);
      }
    },
  });

  const handleSubmit = (e: FormEvent) => { e.preventDefault(); register.mutate({ email, password }); };

  return (
    <div className="mx-auto max-w-md py-12">
      <Card>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Account</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} required minLength={8} />
          <Button type="submit" className="w-full" isLoading={register.isPending}>Register</Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">Login</Link>
        </p>
      </Card>
    </div>
  );
}
