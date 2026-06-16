import { useState, useCallback, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/Button';

interface AnswerInputProps {
  readonly onSubmit: (content: string) => void;
  readonly isSubmitting: boolean;
  readonly currentTurn: number;
  readonly error?: string;
}

const MAX_LENGTH = 300;
const MAX_TURNS = 3;

export function AnswerInput({
  onSubmit,
  isSubmitting,
  currentTurn,
  error,
}: AnswerInputProps) {
  const { t } = useTranslation('triage');
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting]);

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && !isSubmitting) {
      onSubmit(trimmed);
      setValue('');
    }
  }, [value, isSubmitting, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const charsRemaining = MAX_LENGTH - value.length;
  const isNearLimit = charsRemaining < 30;
  const turnLabel =
    currentTurn > MAX_TURNS
      ? `Final question`
      : `Question ${currentTurn} of ${MAX_TURNS}`;

  return (
    <div className="space-y-3 border-t border-gray-200 pt-4 dark:border-gray-700">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {turnLabel}
      </p>
      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_LENGTH))}
          onKeyDown={handleKeyDown}
          maxLength={MAX_LENGTH}
          placeholder={t('answerInput.placeholder')}
          disabled={isSubmitting}
          ref={inputRef}
          className={clsx(
            'flex-1 rounded-lg border px-4 py-2 text-gray-900 placeholder-gray-400 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-blue-500',
            'dark:text-gray-100 dark:bg-gray-800 dark:placeholder-gray-500',
            error
              ? 'border-red-500 dark:border-red-400'
              : 'border-gray-300 dark:border-gray-600',
          )}
        />
        <Button
          onClick={handleSubmit}
          isLoading={isSubmitting}
          disabled={!value.trim() || isSubmitting}
          size="sm"
        >
          {t('answerInput.submit')}
        </Button>
      </div>
      <span
        className={clsx(
          'text-xs',
          isNearLimit
            ? 'text-amber-600 dark:text-amber-400'
            : 'text-gray-400 dark:text-gray-500',
        )}
      >
        {value.length}/{MAX_LENGTH}
      </span>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
