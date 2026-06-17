import type { Page } from '@playwright/test';
import type { ConversationMessage, TriageOutcome } from '../../api/types';

interface TriagePollState {
  submissionId: string;
  turn: number;
  status: 'pending' | 'processing' | 'awaiting_answer' | 'completed';
  lastAssistantMessage: string | null;
  conversationHistory: ConversationMessage[];
  outcome: TriageOutcome | null;
}

function makeDefaultOutcome(): TriageOutcome {
  return {
    specialist: 'GP',
    urgency: 'MEDIUM',
    justification: 'Based on the described symptoms, a general practitioner consultation is appropriate.',
  };
}

/**
 * Creates a state machine that simulates the triage interview progression.
 * - Submit → status: "pending"
 * - Poll 1 → status: "processing"
 * - Poll 2 → status: "awaiting_answer" with first AI question
 * - (after answer) → status: "processing"
 * - Poll 3 → status: "awaiting_answer" with second AI question
 * - (after answer) → status: "processing"
 * - Poll 4 → status: "completed" with final outcome
 *
 * If `quickResult` is true, completes immediately on first poll (1-turn interview).
 */
export function createTriageMachine(quickResult = false) {
  let state: TriagePollState = {
    submissionId: crypto.randomUUID(),
    turn: 0,
    status: 'pending',
    lastAssistantMessage: null,
    conversationHistory: [],
    outcome: null,
  };

  return {
    getState: () => state,

    /** Simulate POST /api/triage/submit — returns 202 with new submission ID. */
    handleSubmit: async (
      route: Parameters<Parameters<Page['route']>[1]>[0],
      request: Parameters<Parameters<Page['route']>[1]>[1],
    ) => {
      const body = JSON.parse(request.postData() || '{}');
      state.conversationHistory = [
        { type: 'initial_description' as const, content: body.initialDescription || '', timestamp: new Date().toISOString() },
      ];
      state.status = quickResult ? 'completed' : 'processing';
      state.submissionId = crypto.randomUUID();

      await route.fulfill({
        status: 202,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: state.submissionId,
            type: 'triage_submission',
            attributes: { status: state.status, submittedAt: new Date().toISOString() },
          },
        }),
      });
    },

    /** Simulate POST /api/triage/{id}/answer — returns 202, moves to processing. */
    handleAnswer: async (
      route: Parameters<Parameters<Page['route']>[1]>[0],
      request: Parameters<Parameters<Page['route']>[1]>[1],
    ) => {
      const body = JSON.parse(request.postData() || '{}');
      state.conversationHistory.push({ type: 'answer' as const, content: body.content || '', timestamp: new Date().toISOString() });
      state.turn += 1;

      // After max turns or enough info, complete
      if (state.turn >= 3) {
        state.status = 'completed';
        state.outcome = makeDefaultOutcome();
        state.lastAssistantMessage = null;
      } else {
        state.status = 'processing';
      }

      await route.fulfill({
        status: 202,
        contentType: 'application/json',
        body: JSON.stringify({
          data: { id: state.submissionId, type: 'triage_submission', attributes: { status: state.status } },
        }),
      });
    },

    /** Simulate GET /api/triage/status/{id} — progresses the state machine on each poll. */
    handleStatus: async (route: Parameters<Parameters<Page['route']>[1]>[0]) => {
      if (state.status === 'processing') {
        // First poll after submit or answer: move to awaiting_answer or completed
        if (state.turn === 0 && !quickResult) {
          // First processing after submit → first question
          state.status = 'awaiting_answer';
          state.lastAssistantMessage = 'Can you describe the pain more specifically? On a scale of 1-10, how severe is it?';
          state.conversationHistory.push({
            type: 'question' as const,
            content: state.lastAssistantMessage!,
            timestamp: new Date().toISOString(),
          });
        } else if (state.turn >= 3) {
          // Max turns reached — complete
          state.status = 'completed';
          state.outcome = makeDefaultOutcome();
          state.lastAssistantMessage = null;
        } else if (state.turn > 0) {
          // Subsequent processing after answer → next question or complete
          state.status = 'awaiting_answer';
          state.lastAssistantMessage = 'How long have you been experiencing these symptoms?';
          state.conversationHistory.push({
            type: 'question' as const,
            content: state.lastAssistantMessage!,
            timestamp: new Date().toISOString(),
          });
        } else {
          state.status = 'awaiting_answer';
          state.lastAssistantMessage = 'Can you describe the pain more specifically?';
          state.conversationHistory.push({
            type: 'question' as const,
            content: state.lastAssistantMessage!,
            timestamp: new Date().toISOString(),
          });
        }
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: {
            id: state.submissionId,
            type: 'triage_submission',
            attributes: {
              status: state.status,
              currentTurn: state.turn,
              lastAssistantMessage: state.lastAssistantMessage,
            },
          },
        }),
      });
    },
  };
}

/**
 * Register all triage-related API mocks on a page.
 * Uses a state machine to simulate interview progression.
 */
export async function mockTriageApi(page: Page, options?: { quickResult?: boolean }) {
  const machine = createTriageMachine(options?.quickResult);

  await page.route('**/api/triage/submit', async (route, request) => {
    if (request.method() === 'POST') {
      await machine.handleSubmit(route, request);
    } else {
      await route.continue();
    }
  });

  await page.route('**/api/triage/*/answer', async (route, request) => {
    if (request.method() === 'POST') {
      await machine.handleAnswer(route, request);
    } else {
      await route.continue();
    }
  });

  await page.route('**/api/triage/status/*', async (route) => {
    await machine.handleStatus(route);
  });

  await page.route('**/api/triage/result/*', async (route) => {
    const state = machine.getState();
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          id: state.submissionId,
          type: 'triage_submission',
          attributes: {
            status: state.status,
            isSynthetic: false,
            outcome: state.outcome,
            currentTurn: state.turn,
            conversationHistory: state.conversationHistory,
            processingDuration: state.status === 'completed' ? 4500 : null,
            submittedAt: new Date().toISOString(),
            processedAt: state.status === 'completed' ? new Date().toISOString() : null,
          },
        },
      }),
    });
  });
}

/**
 * Mock 404 response for a specific triage submission status/result.
 */
export async function mockTriageNotFound(page: Page) {
  await page.route('**/api/triage/status/*', async (route) => {
    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ errors: [{ status: '404', title: 'Submission not found' }] }),
    });
  });
  await page.route('**/api/triage/result/*', async (route) => {
    await route.fulfill({
      status: 404,
      contentType: 'application/json',
      body: JSON.stringify({ errors: [{ status: '404', title: 'Submission not found' }] }),
    });
  });
}
