import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Loader } from '../../../components/shared/Loader';
import { ErrorBoundary } from '../../../components/shared/ErrorBoundary';
import { Button } from '../../../components/ui/Button';
import { useTriageInterview } from '../hooks/useTriageInterview';
import { SymptomInput } from '../components/SymptomInput';
import { AnswerInput } from '../components/AnswerInput';
import { ConversationBubble } from '../components/ConversationBubble';

export function TriagePage() {
  const navigate = useNavigate();
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const {
    state,
    submit,
    answer,
    conversation,
    currentTurn,
    error,
    reset,
    isAnswering,
    submissionId,
  } = useTriageInterview();

  // Navigate to result page on completion
  useEffect(() => {
    if (state === 'completed' && submissionId) {
      void navigate(`/triage/${submissionId}/result`, { replace: true });
    }
  }, [state, submissionId, navigate]);

  // Auto-scroll to bottom when conversation updates
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleRetry = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <ErrorBoundary>
        <Card>
          <h1 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
            Symptom Check
          </h1>

          {/* STATE: idle — initial symptom input */}
          {/* STATE: submitting — symptom input with loading spinner */}
          {(state === 'idle' || state === 'submitting') && (
            <SymptomInput
              onSubmit={submit}
              isSubmitting={state === 'submitting'}
              error={error ?? undefined}
            />
          )}

          {/* STATE: polling — analyzing with loader */}
          {state === 'polling' && (
            <Loader message="Analyzing your symptoms..." />
          )}

          {/* STATE: awaiting_answer — conversation + answer input */}
          {state === 'awaiting_answer' && (
            <div className="space-y-4">
              {/* Scrollable conversation history */}
              <div className="max-h-96 overflow-y-auto pr-2">
                {conversation.map((msg, idx) => (
                  <ConversationBubble
                    key={`${msg.type}-${idx}`}
                    type={msg.type}
                    content={msg.content}
                    timestamp={msg.timestamp}
                  />
                ))}
                <div ref={conversationEndRef} />
              </div>

              {/* Answer input with turn indicator */}
              <AnswerInput
                onSubmit={answer}
                isSubmitting={isAnswering}
                currentTurn={currentTurn}
                error={error ?? undefined}
              />
            </div>
          )}

          {/* STATE: failed — error with retry button */}
          {state === 'failed' && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-4 rounded-full bg-red-100 p-3 dark:bg-red-900/30">
                <svg
                  className="h-8 w-8 text-red-600 dark:text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Analysis Failed
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {error ?? 'Something went wrong during analysis. Please try again.'}
              </p>
              <Button className="mt-4" onClick={handleRetry}>
                Try Again
              </Button>
            </div>
          )}
        </Card>
      </ErrorBoundary>
    </div>
  );
}
