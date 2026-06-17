import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAdminSubmission } from '../hooks/useAdminSubmission';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorFallback } from '../../../components/shared/ErrorFallback';
import type { ConversationMessage } from '../../../api/types';

const STATUS_BADGE: Record<string, 'pending' | 'processing' | 'completed' | 'failed'> = {
  pending: 'pending',
  processing: 'processing',
  awaiting_answer: 'processing',
  completed: 'completed',
  failed: 'failed',
};

const URGENCY_BADGE: Record<string, 'low' | 'medium' | 'high' | 'emergency'> = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  EMERGENCY: 'emergency',
};

function ConversationBubble({ message, t }: { message: ConversationMessage; t: (key: string, options?: { defaultValue?: string }) => string }) {
  const isUser = message.type === 'initial_description' || message.type === 'answer';
  const isResult = message.type === 'result';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isResult
            ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800'
            : isUser
              ? 'bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'
              : 'bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700'
        }`}
      >
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          {message.type === 'initial_description' && t('conversation.initialDescription', { defaultValue: 'Initial Description' })}
          {message.type === 'question' && t('conversation.aiQuestion', { defaultValue: 'AI Question' })}
          {message.type === 'answer' && t('conversation.userAnswer', { defaultValue: 'User Answer' })}
          {message.type === 'result' && t('conversation.triageResult', { defaultValue: 'Triage Result' })}
        </p>
        <p className="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap">{message.content}</p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {new Date(message.timestamp).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export function SubmissionDetailPage() {
  const { t } = useTranslation('admin');
  const { id } = useParams<{ id: string }>();
  const { data: submission, isLoading, error, refetch } = useAdminSubmission(id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="text" lines={1} className="h-8 w-1/4" />
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="space-y-4">
        <ErrorFallback
          error={error ?? new Error(t('submissionDetail.notFound'))}
          onRetry={() => void refetch()}
          title={t('submissionDetail.notFound')}
        />
        <div className="text-center">
          <Link
            to="/admin"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            ← {t('submissionDetail.backToList')}
          </Link>
        </div>
      </div>
    );
  }

  const { attributes } = submission;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin"
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          ← {t('submissionDetail.backToList')}
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('submissionDetail.title')}
        </h1>
      </div>

      {/* Submission Info */}
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('submissionDetail.status')}</p>
            <Badge variant={STATUS_BADGE[attributes.status] ?? 'pending'}>{attributes.status}</Badge>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('submissionDetail.user')}</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {attributes.userEmail ?? 'Unknown'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('submissionDetail.synthetic')}</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {attributes.isSynthetic ? 'Synthetic' : 'Real'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('submissionDetail.submittedAt')}</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {new Date(attributes.submittedAt).toLocaleString()}
            </p>
          </div>
          {attributes.processedAt && (
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('submissionDetail.processedAt', 'Processed')}</p>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {new Date(attributes.processedAt).toLocaleString()}
              </p>
            </div>
          )}
          {attributes.processingDuration !== null && (
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('submissionDetail.processingTime')}</p>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {attributes.processingDuration < 60
                  ? `${attributes.processingDuration}s`
                  : `${Math.floor(attributes.processingDuration / 60)}m ${attributes.processingDuration % 60}s`}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Outcome */}
      {attributes.outcome && (
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">{t('submissionDetail.outcome', 'Triage Outcome')}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('submissionDetail.specialist', 'Specialist')}</p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {attributes.outcome.specialist}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('submissionDetail.urgency', 'Urgency')}</p>
              <Badge variant={URGENCY_BADGE[attributes.outcome.urgency] ?? 'medium'}>
                {attributes.outcome.urgency}
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">{t('submissionDetail.justification', 'Justification')}</p>
            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
              {attributes.outcome.justification}
            </p>
          </div>
        </Card>
      )}

      {/* Conversation History */}
      {attributes.conversationHistory && attributes.conversationHistory.length > 0 && (
        <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('submissionDetail.conversation')}
            </h2>
          <div className="space-y-4">
            {attributes.conversationHistory.map((message, index) => (
              <ConversationBubble key={index} message={message} t={t} />
            ))}
          </div>
        </Card>
      )}

      {/* Actions */}
      {attributes.status === 'completed' && (
        <Link
          to={`/triage/${submission.id}/result`}
          className="inline-block text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400"
        >
          {t('submissionDetail.viewAsUser', 'View as User →')}
        </Link>
      )}
    </div>
  );
}
