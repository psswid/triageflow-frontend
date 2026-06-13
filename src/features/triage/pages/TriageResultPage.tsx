import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { ApiResponse, TriageSubmissionResource } from '../../../api/types';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorFallback } from '../../../components/shared/ErrorFallback';
import { ConversationBubble } from '../components/ConversationBubble';
import { OutcomeCard } from '../components/OutcomeCard';

type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

export function TriageResultPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { status, data, error, refetch } = useQuery<ApiResponse<TriageSubmissionResource>, AxiosError>({
    queryKey: ['triage-result', id],
    queryFn: async () => {
      const response = await apiClient.get<ApiResponse<TriageSubmissionResource>>(
        ENDPOINTS.TRIAGE.RESULT(id!),
      );
      return response.data;
    },
    enabled: !!id,
    retry: (failureCount: number, err: AxiosError) => {
      if (err.response?.status === 404 || err.response?.status === 403) {
        return false;
      }
      return failureCount < 1;
    },
  });

  const isLoading = status === 'pending';

  // Loading state
  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-8">
        <Skeleton variant="text" lines={1} className="h-8 w-1/3" />
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    );
  }

  // Error state — discriminate by HTTP status
  if (status === 'error') {
    const axiosError = error as AxiosError | null;

    if (axiosError?.response?.status === 404) {
      return (
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Result Not Found</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            The requested triage result does not exist or has not been completed yet.
          </p>
          <Button className="mt-6" onClick={() => { void navigate('/triage'); }}>
            New Triage
          </Button>
        </div>
      );
    }

    if (axiosError?.response?.status === 403) {
      return (
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Access Denied</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            You do not have permission to view this triage result.
          </p>
          <Button className="mt-6" onClick={() => { void navigate('/triage'); }}>
            New Triage
          </Button>
        </div>
      );
    }

    // Generic error
    return (
      <ErrorFallback
        error={error as Error}
        onRetry={() => void refetch()}
        title="Something Went Wrong"
      />
    );
  }

  // Success state
  const submission = data.data;
  const outcome = submission.attributes.outcome;
  const conversationHistory = submission.attributes.conversationHistory;

  // Null outcome — submission is still in progress
  if (!outcome) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Triage Result</h1>
        <Card>
          <div className="py-8 text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Analysis in Progress
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              The AI is still analyzing your symptoms. Please check back shortly.
            </p>
            <Button className="mt-6" onClick={() => { void navigate('/triage'); }}>
              Return to Triage
            </Button>
          </div>
        </Card>

        {conversationHistory.length > 0 && (
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Conversation So Far
            </h2>
            <div className="flex flex-col gap-3">
              {conversationHistory.map((msg, i) => (
                <ConversationBubble
                  key={i}
                  type={msg.type}
                  content={msg.content}
                  timestamp={msg.timestamp}
                />
              ))}
            </div>
          </Card>
        )}
      </div>
    );
  }

  // Full result with outcome
  return (
    <div className="mx-auto max-w-3xl space-y-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Triage Result</h1>

      <OutcomeCard
        specialist={outcome.specialist}
        urgency={outcome.urgency as UrgencyLevel}
        justification={outcome.justification}
      />

      {conversationHistory.length > 0 && (
        <Card>
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
            Conversation History
          </h2>
          <div className="flex flex-col gap-3">
            {conversationHistory.map((msg, i) => (
              <ConversationBubble
                key={i}
                type={msg.type}
                content={msg.content}
                timestamp={msg.timestamp}
              />
            ))}
          </div>
        </Card>
      )}

      <div className="flex justify-center pt-4">
        <Button onClick={() => { void navigate('/triage'); }}>New Triage</Button>
      </div>
    </div>
  );
}
