import { clsx } from 'clsx';

type MessageType = 'initial_description' | 'question' | 'answer' | 'result';

interface ConversationBubbleProps {
  readonly type: MessageType;
  readonly content: string;
  readonly timestamp: string;
}

export function ConversationBubble({
  type,
  content,
  timestamp,
}: ConversationBubbleProps) {
  const isUser = type === 'initial_description' || type === 'answer';
  const isResult = type === 'result';

  return (
    <div
      className={clsx(
        'flex flex-col mb-4',
        isUser ? 'items-end' : 'items-start',
      )}
    >
      <div
        className={clsx(
          'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap',
          isResult &&
            'border-l-4 border-blue-500 bg-blue-50 text-gray-900 dark:border-blue-400 dark:bg-blue-950 dark:text-gray-100',
          isUser &&
            'bg-blue-600 text-white dark:bg-blue-500',
          !isUser && !isResult &&
            'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100',
        )}
      >
        {content}
        {isResult && (
          <span className="mt-1 block text-xs opacity-70">Triage outcome</span>
        )}
      </div>
      <span
        className={clsx(
          'mt-1 text-xs',
          isUser ? 'text-right' : 'text-left',
          'text-gray-400 dark:text-gray-500',
        )}
      >
        {new Date(timestamp).toLocaleTimeString()}
      </span>
    </div>
  );
}
