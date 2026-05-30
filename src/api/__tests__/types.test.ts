import { describe, it, expect } from 'vitest';
import type {
  ConversationMessage,
  TriageSubmissionResource,
  TriageStatusResource,
  TriageOutcome,
  TriageResultResource,
  TriageSubmissionsListResponse,
} from '../types';

describe('ConversationMessage', () => {
  it('has no role field — type encodes sender', () => {
    const msg: ConversationMessage = {
      type: 'question',
      content: 'How long have you had this symptom?',
      timestamp: '2026-05-30T00:00:00Z',
    };

    // Verify structure: only type, content, timestamp
    expect(msg).toHaveProperty('type');
    expect(msg).toHaveProperty('content');
    expect(msg).toHaveProperty('timestamp');
    expect(msg).not.toHaveProperty('role');
  });

  it('accepts all valid type values', () => {
    const types: ConversationMessage['type'][] = [
      'initial_description',
      'question',
      'answer',
      'result',
    ];

    types.forEach((t) => {
      const msg: ConversationMessage = {
        type: t,
        content: 'test',
        timestamp: '2026-05-30T00:00:00Z',
      };
      expect(msg.type).toBe(t);
    });
  });
});

describe('TriageOutcome', () => {
  it('has specialist, urgency, justification fields', () => {
    const outcome: TriageOutcome = {
      specialist: 'Neurologist',
      urgency: 'HIGH',
      justification: 'Severe headache with photophobia suggests neurological issue',
    };

    expect(outcome).toHaveProperty('specialist');
    expect(outcome).toHaveProperty('urgency');
    expect(outcome).toHaveProperty('justification');
  });
});

describe('TriageStatusResource', () => {
  it('accepts awaiting_answer in status union', () => {
    const resource: TriageStatusResource = {
      id: 'abc-123',
      type: 'triage_submission',
      attributes: {
        status: 'awaiting_answer',
        currentTurn: 2,
        lastAssistantMessage: 'Are you experiencing any nausea?',
      },
    };

    expect(resource.attributes.status).toBe('awaiting_answer');
  });

  it('has currentTurn and lastAssistantMessage in attributes', () => {
    const resource: TriageStatusResource = {
      id: 'abc-123',
      type: 'triage_submission',
      attributes: {
        status: 'processing',
        currentTurn: 1,
        lastAssistantMessage: null,
      },
    };

    expect(resource.attributes).toHaveProperty('currentTurn');
    expect(resource.attributes).toHaveProperty('lastAssistantMessage');
    expect(resource.attributes.currentTurn).toBe(1);
    expect(resource.attributes.lastAssistantMessage).toBeNull();
  });
});

describe('TriageSubmissionResource', () => {
  it('no longer has standalone specialist/urgency/justification — uses outcome object', () => {
    const resource: TriageSubmissionResource = {
      id: 'abc-123',
      type: 'triage_submission',
      attributes: {
        status: 'completed',
        isSynthetic: false,
        outcome: {
          specialist: 'Cardiologist',
          urgency: 'HIGH', // Match expected domain value
          justification: 'Chest pain with radiating arm pain',
        },
        currentTurn: 2,
        conversationHistory: [
          {
            type: 'initial_description',
            content: 'Chest pain',
            timestamp: '2026-05-30T00:00:00Z',
          },
        ],
        processingDuration: 15.5,
        submittedAt: '2026-05-30T00:00:00Z',
        processedAt: '2026-05-30T00:00:15Z',
      },
    };

    // Old standalone fields shouldn't exist
    expect(resource.attributes).not.toHaveProperty('specialist');
    expect(resource.attributes).not.toHaveProperty('urgency');
    expect(resource.attributes).not.toHaveProperty('justification');
    // New outcome field should exist
    expect(resource.attributes).toHaveProperty('outcome');
    expect(resource.attributes.outcome?.specialist).toBe('Cardiologist');
    expect(resource.attributes).toHaveProperty('currentTurn');
  });

  it('accepts awaiting_answer in status union', () => {
    const resource: TriageSubmissionResource = {
      id: 'abc-123',
      type: 'triage_submission',
      attributes: {
        status: 'awaiting_answer',
        isSynthetic: false,
        outcome: null,
        currentTurn: 1,
        conversationHistory: [],
        processingDuration: null,
        submittedAt: '2026-05-30T00:00:00Z',
        processedAt: null,
      },
    };

    expect(resource.attributes.status).toBe('awaiting_answer');
    expect(resource.attributes.outcome).toBeNull();
  });
});

describe('TriageResultResource', () => {
  it('includes full conversationHistory and outcome', () => {
    const resource: TriageResultResource = {
      id: 'abc-123',
      type: 'triage_submission',
      attributes: {
        status: 'completed',
        isSynthetic: false,
        outcome: {
          specialist: 'Cardiologist',
          urgency: 'HIGH',
          justification: 'Chest pain with radiating arm pain',
        },
        currentTurn: 2,
        conversationHistory: [
          {
            type: 'initial_description',
            content: 'Chest pain',
            timestamp: '2026-05-30T00:00:00Z',
          },
          {
            type: 'question',
            content: 'Does the pain radiate to your arm?',
            timestamp: '2026-05-30T00:00:05Z',
          },
          {
            type: 'answer',
            content: 'Yes, to my left arm',
            timestamp: '2026-05-30T00:00:10Z',
          },
          {
            type: 'result',
            content: '',
            timestamp: '2026-05-30T00:00:15Z',
          },
        ],
        processingDuration: 15.5,
        submittedAt: '2026-05-30T00:00:00Z',
        processedAt: '2026-05-30T00:00:15Z',
      },
    };

    expect(resource.attributes.outcome).not.toBeNull();
    expect(resource.attributes.conversationHistory).toHaveLength(4);
  });
});

describe('TriageSubmissionsListResponse', () => {
  it('has readonly data array of TriageSubmissionResource', () => {
    const response: TriageSubmissionsListResponse = {
      data: [],
    };

    expect(response.data).toEqual([]);
  });
});
