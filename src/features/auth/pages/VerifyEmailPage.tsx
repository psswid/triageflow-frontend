import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../../api/client';
import { Card } from '../../../components/ui/Card';
import { Loader } from '../../../components/shared/Loader';

type VerificationStatus = 'loading' | 'success' | 'already_verified' | 'invalid_token' | 'expired' | 'error';

export function VerifyEmailPage() {
  const { t } = useTranslation('auth');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<VerificationStatus>(() =>
    token ? 'loading' : 'error',
  );
  const [message, setMessage] = useState(() =>
    token ? '' : t('verifyEmail.invalidToken'),
  );

  useEffect(() => {
    if (!token) return;

    apiClient
      .get<{ readonly message: string }>(`/api/verify-email?token=${encodeURIComponent(token)}`)
      .then((r) => {
        const msg = r.data?.message ?? '';
        if (msg === 'Email already verified') {
          setStatus('already_verified');
        } else {
          setStatus('success');
        }
        setMessage(msg);
      })
      .catch((err) => {
        const detail =
          (err as { readonly response?: { readonly data?: { readonly error?: string } } }).response?.data
            ?.error ?? 'Verification failed.';
        if (detail === 'Verification token has expired') {
          setStatus('expired');
        } else {
          setStatus('invalid_token');
        }
        setMessage(detail);
      });
  }, [token]);

  return (
    <div className="mx-auto max-w-md py-12">
      <Card>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('verifyEmail.title')}</h1>

        {status === 'loading' && (
          <div className="mt-4">
            <Loader message={t('verifyEmail.verifying')} />
          </div>
        )}

        {status === 'success' && (
          <div className="mt-4 space-y-4">
            <p className="text-green-600 dark:text-green-400">{message || t('verifyEmail.success')}</p>
            <Link
              to="/login"
              className="inline-block text-blue-600 hover:underline dark:text-blue-400"
            >
              {t('verifyEmail.goToLogin')}
            </Link>
          </div>
        )}

        {status === 'already_verified' && (
          <div className="mt-4 space-y-4">
            <p className="text-blue-600 dark:text-blue-400">{message || t('verifyEmail.alreadyVerified')}</p>
            <Link
              to="/login"
              className="inline-block text-blue-600 hover:underline dark:text-blue-400"
            >
              {t('verifyEmail.goToLogin')}
            </Link>
          </div>
        )}

        {status === 'invalid_token' && (
          <div className="mt-4">
            <p className="text-red-600 dark:text-red-400">{message}</p>
          </div>
        )}

        {status === 'expired' && (
          <div className="mt-4 space-y-2">
            <p className="text-amber-600 dark:text-amber-400">{message}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('verifyEmail.expiredToken')}
            </p>
            <Link
              to="/register"
              className="inline-block text-blue-600 hover:underline dark:text-blue-400"
            >
              {t('register.title')}
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="mt-4">
            <p className="text-red-600 dark:text-red-400">{message}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
