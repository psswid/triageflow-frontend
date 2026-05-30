/* eslint-disable react-hooks/set-state-in-effect -- polling sync requires setState in effects */
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../../../api/client';
import { ENDPOINTS } from '../../../api/endpoints';
import type {
  SubmitTriageRequest,
  SubmitTriageResponse,
  TriageAnswerRequest,
  TriageAnswerResponse,
} from '../../../api/types';
import { useTriagePolling } from './useTriagePolling';

export type InterviewState =
  | 'idle'
  | 'submitting'
  | 'polling'
  | 'awaiting_answer'
  | 'completed'
  | 'failed';

interface ConversationEntry {
  readonly type: 'initial_description' | 'question' | 'answer';
  readonly content: string;
  readonly timestamp: string;
}

interface UseTriageInterviewResult {
  readonly state: InterviewState;
  readonly submit: (description: string) => void;
  readonly answer: (content: string) => void;
  readonly conversation: readonly ConversationEntry[];
  readonly status: string | null;
  readonly currentTurn: number;
  readonly lastQuestion: string | null;
  readonly error: string | null;
  readonly submissionId: string | null;
  readonly isAnswering: boolean;
  readonly reset: () => void;
}

export function useTriageInterview(): UseTriageInterviewResult {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [mutationPhase, setMutationPhase] = useState<'idle' | 'submitting'>('idle');
  const [lastQuestion, setLastQuestion] = useState<string | null>(null);

  // Submit mutation — POST /api/triage/submit
  const submitMutation = useMutation({
    mutationFn: (description: string) =>
      apiClient
        .post<SubmitTriageResponse>(ENDPOINTS.TRIAGE.SUBMIT, {
          initialDescription: description,
        } satisfies SubmitTriageRequest)
        .then((r) => r.data),
    onSuccess: (data, description) => {
      setSubmissionId(data.data.id);
      setConversation([
        {
          type: 'initial_description' as const,
          content: description,
          timestamp: new Date().toISOString(),
        },
      ]);
      setMutationPhase('idle');
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to submit symptoms. Please try again.');
      setMutationPhase('idle');
    },
  });

  // Answer mutation — POST /api/triage/{id}/answer
  const answerMutation = useMutation({
    mutationFn: (content: string) =>
      apiClient
        .post<TriageAnswerResponse>(ENDPOINTS.TRIAGE.ANSWER(submissionId!), {
          content,
        } satisfies TriageAnswerRequest)
        .then((r) => r.data),
    onSuccess: (_data, content) => {
      setConversation((prev) => [
        ...prev,
        {
          type: 'answer' as const,
          content,
          timestamp: new Date().toISOString(),
        },
      ]);
      setMutationPhase('idle');
      setError(null);
    },
    onError: (err: Error) => {
      setError(err.message || 'Failed to submit answer. Please try again.');
    },
  });

  // Polling — enabled when submission exists and mutation isn't submitting
  const isPolling = submissionId !== null && mutationPhase === 'idle';
  const polling = useTriagePolling({
    submissionId: isPolling ? submissionId : null,
  });

  // Track new AI questions from polling results
  useEffect(() => {
    if (
      polling.status === 'awaiting_answer' &&
      polling.lastAssistantMessage &&
      polling.lastAssistantMessage !== lastQuestion
    ) {
      setLastQuestion(polling.lastAssistantMessage);
      const message = polling.lastAssistantMessage;
      setConversation((prev) => [
        ...prev,
        {
          type: 'question' as const,
          content: message,
          timestamp: new Date().toISOString(),
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polling.status, polling.lastAssistantMessage]);

  // Propagate error when poll reports failed
  useEffect(() => {
    if (polling.status === 'failed') {
      setError('Analysis failed. Please try again.');
    }
  }, [polling.status]);

  // Derive UI state from mutation phase + polling status
  const state: InterviewState = useMemo(() => {
    if (mutationPhase === 'submitting') return 'submitting';
    if (!submissionId) return 'idle';

    switch (polling.status) {
      case 'completed':
        return 'completed';
      case 'failed':
        return 'failed';
      case 'awaiting_answer':
        return 'awaiting_answer';
      case 'processing':
      case 'pending':
        return 'polling';
      default:
        return 'polling';
    }
  }, [mutationPhase, submissionId, polling.status]);

  const submit = useCallback(
    (description: string) => {
      if (submissionId !== null) return;
      setError(null);
      setMutationPhase('submitting');
      submitMutation.mutate(description);
    },
    [submissionId, submitMutation],
  );

  const answer = useCallback(
    (content: string) => {
      if (state !== 'awaiting_answer' || !submissionId) return;
      setError(null);
      answerMutation.mutate(content);
    },
    [state, submissionId, answerMutation],
  );

  const reset = useCallback(() => {
    setSubmissionId(null);
    setConversation([]);
    setError(null);
    setMutationPhase('idle');
    setLastQuestion(null);
    submitMutation.reset();
    answerMutation.reset();
  }, [submitMutation, answerMutation]);

  return {
    state,
    submit,
    answer,
    conversation,
    status: polling.status,
    currentTurn: polling.currentTurn,
    lastQuestion,
    error,
    submissionId,
    isAnswering: answerMutation.isPending,
    reset,
  } satisfies UseTriageInterviewResult;
}
