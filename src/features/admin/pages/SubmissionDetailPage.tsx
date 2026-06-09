import { useParams, Link } from 'react-router-dom';
import { useAdminSubmission } from '../hooks/useAdminSubmission';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Spinner } from '../../../components/ui/Spinner';
import { EmptyState } from '../../../components/shared/EmptyState';
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

function ConversationBubble({ message }: { message: ConversationMessage }) {
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
          {message.type === 'initial_description' && 'Initial Description'}
          {message.type === 'question' && 'AI Question'}
          {message.type === 'answer' && 'User Answer'}
          {message.type === 'result' && 'Triage Result'}
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
  const { id } = useParams<{ id: string }>();
  const { data: submission, isLoading, error } = useAdminSubmission(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner />
      </div>
    );
  }

  if (error || !submission) {
    return (
      <EmptyState
        title="Submission not found"
        description="The requested submission could not be loaded."
        action={
          <Link
            to="/admin"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            ← Back to Dashboard
          </Link>
        }
      />
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
          ← Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Submission Detail
        </h1>
      </div>

      {/* Submission Info */}
      <Card className="p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</p>
            <Badge variant={STATUS_BADGE[attributes.status] ?? 'pending'}>{attributes.status}</Badge>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">User</p>
            <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
              {attributes.userEmail ?? 'Unknown'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {attributes.isSynthetic ? 'Synthetic' : 'Real'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Submitted</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
              {new Date(attributes.submittedAt).toLocaleString()}
            </p>
          </div>
          {attributes.processedAt && (
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Processed</p>
              <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">
                {new Date(attributes.processedAt).toLocaleString()}
              </p>
            </div>
          )}
          {attributes.processingDuration !== null && (
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Duration</p>
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
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">Triage Outcome</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Specialist</p>
              <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                {attributes.outcome.specialist}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Urgency</p>
              <Badge variant={URGENCY_BADGE[attributes.outcome.urgency] ?? 'medium'}>
                {attributes.outcome.urgency}
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Justification</p>
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
            Conversation History
          </h2>
          <div className="space-y-4">
            {attributes.conversationHistory.map((message, index) => (
              <ConversationBubble key={index} message={message} />
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
          View as User →
        </Link>
      )}
    </div>
  );
}
