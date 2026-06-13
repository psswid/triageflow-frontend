import { useAdminFailedMessages, useRetryFailedMessage, useDeleteFailedMessage } from '../hooks/useAdminFailedMessages';
import { Skeleton } from '../../../components/ui/Skeleton';
import { ErrorFallback } from '../../../components/shared/ErrorFallback';
import { EmptyState } from '../../../components/shared/EmptyState';
import { useToast } from '../../../components/ui/ToastProvider';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function messageTypeLabel(type: string): string {
  const parts = type.split('\\');
  return parts[parts.length - 1] ?? type;
}

export function FailedMessagesTable() {
  const { toast } = useToast();
  const { data: messages, isLoading, error } = useAdminFailedMessages();

  const retryMutation = useRetryFailedMessage(
    undefined,
    (err) => toast.error(`Failed to retry message: ${err.message}`),
  );

  const deleteMutation = useDeleteFailedMessage(
    undefined,
    (err) => toast.error(`Failed to delete message: ${err.message}`),
  );

  const handleRetry = (id: number) => {
    retryMutation.mutate(id);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Delete this failed message? This action cannot be undone.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton variant="table-row" lines={3} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorFallback error={error} />
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <EmptyState
        title="No failed messages"
        description="All messages are processing normally."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Failed At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Error
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Preview
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
          {messages.map((msg) => (
            <tr
              key={msg.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {msg.attributes.messageId}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                {messageTypeLabel(msg.attributes.type)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {formatDate(msg.attributes.failedAt)}
              </td>
              <td className="max-w-xs truncate px-6 py-4 text-sm text-red-600 dark:text-red-400">
                {msg.attributes.error}
              </td>
              <td className="max-w-md truncate px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                {msg.attributes.preview}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleRetry(msg.id)}
                    disabled={retryMutation.isPending}
                    className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Retry
                  </button>
                  <button
                    onClick={() => handleDelete(msg.id)}
                    disabled={deleteMutation.isPending}
                    className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
