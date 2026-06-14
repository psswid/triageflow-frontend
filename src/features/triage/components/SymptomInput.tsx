import { useState, useCallback } from 'react';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';
import { Button } from '../../../components/ui/Button';

interface SymptomInputProps {
  readonly onSubmit: (description: string) => void;
  readonly isSubmitting: boolean;
  readonly error?: string;
}

const MAX_LENGTH = 500;

export function SymptomInput({
  onSubmit,
  isSubmitting,
  error,
}: SymptomInputProps) {
  const { t } = useTranslation('triage');
  const [value, setValue] = useState('');

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim();
    if (trimmed && !isSubmitting) {
      onSubmit(trimmed);
    }
  }, [value, isSubmitting, onSubmit]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  const charsRemaining = MAX_LENGTH - value.length;
  const isNearLimit = charsRemaining < 50;

  return (
    <div className="space-y-4">
      <label
        htmlFor="symptom-description"
        className="block text-lg font-semibold text-gray-900 dark:text-gray-100"
      >
        {t('symptomInput.label')}
      </label>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {t('subtitle')}
      </p>
      <textarea
        id="symptom-description"
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, MAX_LENGTH))}
        onKeyDown={handleKeyDown}
        maxLength={MAX_LENGTH}
        rows={4}
        placeholder={t('symptomInput.placeholder')}
        disabled={isSubmitting}
        className={clsx(
          'w-full rounded-lg border px-4 py-3 text-gray-900 placeholder-gray-400 transition-colors resize-none',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'dark:text-gray-100 dark:bg-gray-800 dark:placeholder-gray-500',
          error
            ? 'border-red-500 dark:border-red-400'
            : 'border-gray-300 dark:border-gray-600',
        )}
      />
      <div className="flex items-center justify-between">
        <span
          className={clsx(
            'text-sm',
            isNearLimit
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-gray-400 dark:text-gray-500',
          )}
        >
          {value.length}/{MAX_LENGTH}
        </span>
        <Button
          onClick={handleSubmit}
          isLoading={isSubmitting}
          disabled={!value.trim() || isSubmitting}
        >
          {isSubmitting ? t('symptomInput.submitting') : t('symptomInput.submit')}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
