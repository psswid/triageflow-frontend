import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import { useAuth } from '../../../hooks/useAuth';
import { Button } from '../../../components/ui/Button';
import type { ImpersonateResponse } from '../../../api/types';

interface ImpersonateButtonProps {
  readonly userId: string;
  readonly userEmail: string;
}

export function ImpersonateButton({ userId }: ImpersonateButtonProps) {
  const { t } = useTranslation('admin');
  const { impersonate } = useAuth();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () =>
      apiClient
        .post<ImpersonateResponse>(ENDPOINTS.ADMIN.IMPERSONATE(userId))
        .then((r) => r.data),
    onSuccess: (data) => {
      const { token, impersonated } = data.data;
      impersonate(token, impersonated);
      void navigate('/triage');
    },
  });

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => mutation.mutate()}
      isLoading={mutation.isPending}
    >
      {t('dashboard.users.impersonate')}
    </Button>
  );
}
