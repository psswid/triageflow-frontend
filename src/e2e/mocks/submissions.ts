import type { Page } from '@playwright/test';
import type { ConversationMessage, TriageOutcome } from '../../api/types';

interface MockSubmission {
  readonly id: string;
  readonly status: 'pending' | 'processing' | 'awaiting_answer' | 'completed' | 'failed';
  readonly isSynthetic: boolean;
  readonly outcome: TriageOutcome | null;
  readonly currentTurn: number;
  readonly submittedAt: string;
}

function makeSubmission(overrides?: Partial<MockSubmission>): MockSubmission {
  return {
    id: 'sub-1',
    status: 'completed',
    isSynthetic: false,
    outcome: { specialist: 'CARDIOLOGIST', urgency: 'HIGH', justification: 'Symptoms suggest cardiac evaluation needed.' },
    currentTurn: 2,
    submittedAt: new Date().toISOString(),
    ...overrides,
  };
}

/** Mock GET /api/triage/submissions — returns a list of submissions for the current user. */
export async function mockMySubmissions(page: Page, options?: { empty?: boolean }) {
  await page.route('**/api/triage/submissions', async (route) => {
    const submissions = options?.empty
      ? []
      : [
          makeSubmission({ id: 'sub-1', status: 'completed', outcome: { specialist: 'CARDIOLOGIST', urgency: 'HIGH', justification: 'Cardiac evaluation needed.' }, currentTurn: 2 }),
          makeSubmission({ id: 'sub-2', status: 'awaiting_answer', outcome: null, currentTurn: 1 }),
          makeSubmission({ id: 'sub-3', status: 'failed', outcome: null, currentTurn: 0 }),
        ];

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: submissions.map((s) => ({
        id: s.id,
        type: 'triage_submission' as const,
        attributes: s,
      }))}),
    });
  });
}

/** Mock GET /api/triage/result/{id} — returns full submission with outcome. */
export async function mockTriageResult(page: Page, options?: { notFound?: boolean; submissionId?: string }) {
  const id = options?.submissionId || 'sub-1';
  await page.route(`**/api/triage/result/${id}`, async (route) => {
    if (options?.notFound) {
      await route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ errors: [{ status: '404', title: 'Not found' }] }) });
      return;
    }
    const submission = makeSubmission({ id, status: 'completed' });
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        data: {
          id: submission.id,
          type: 'triage_submission',
          attributes: {
            ...submission,
            conversationHistory: [
              { type: 'initial_description' as const, content: 'I have chest pain and shortness of breath', timestamp: new Date().toISOString() },
              { type: 'question' as const, content: 'How long have you had these symptoms?', timestamp: new Date(Date.now() + 1000).toISOString() },
              { type: 'answer' as const, content: 'About 3 days', timestamp: new Date(Date.now() + 2000).toISOString() },
              { type: 'question' as const, content: 'Does anything make it better or worse?', timestamp: new Date(Date.now() + 3000).toISOString() },
              { type: 'answer' as const, content: 'Worse when I exercise', timestamp: new Date(Date.now() + 4000).toISOString() },
            ] as ConversationMessage[],
            processingDuration: 4500,
            processedAt: new Date().toISOString(),
          },
        },
      }),
    });
  });
}
