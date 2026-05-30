export interface ApiResponse<T> {
  readonly data: T;
}

export interface ApiError {
  readonly errors: readonly {
    readonly status: string;
    readonly code?: string;
    readonly title: string;
    readonly detail?: string;
  }[];
}

// --- User ---
export interface UserResource {
  readonly id: string;
  readonly type: 'user';
  readonly attributes: {
    readonly email: string;
    readonly roles: readonly string[];
    readonly createdAt: string;
  };
}

// --- Auth ---
export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface LoginResponse {
  readonly token: string;
}

export interface RegisterRequest {
  readonly email: string;
  readonly password: string;
}

export interface RegisterResponse {
  readonly data: UserResource;
}

// --- Triage Submission ---
export interface ConversationMessage {
  readonly type: 'initial_description' | 'question' | 'answer' | 'result';
  readonly content: string;
  readonly timestamp: string;
}

export interface TriageOutcome {
  readonly specialist: string;
  readonly urgency: string;
  readonly justification: string;
}

export interface TriageSubmissionResource {
  readonly id: string;
  readonly type: 'triage_submission';
  readonly attributes: {
    readonly status: 'pending' | 'processing' | 'awaiting_answer' | 'completed' | 'failed';
    readonly isSynthetic: boolean;
    readonly outcome: TriageOutcome | null;
    readonly currentTurn: number;
    readonly conversationHistory: readonly ConversationMessage[];
    readonly processingDuration: number | null;
    readonly submittedAt: string;
    readonly processedAt: string | null;
  };
}

export interface TriageStatusResource {
  readonly id: string;
  readonly type: 'triage_submission';
  readonly attributes: {
    readonly status: 'pending' | 'processing' | 'awaiting_answer' | 'completed' | 'failed';
    readonly currentTurn: number;
    readonly lastAssistantMessage: string | null;
  };
}

export interface SubmitTriageRequest {
  readonly initialDescription: string;
}

export interface SubmitTriageResponse {
  readonly data: {
    readonly id: string;
    readonly type: 'triage_submission';
    readonly attributes: {
      readonly status: 'pending' | 'processing' | 'awaiting_answer' | 'completed' | 'failed';
      readonly submittedAt: string;
    };
  };
}

export interface TriageAnswerRequest {
  readonly content: string;
}

export interface TriageAnswerResponse {
  readonly data: {
    readonly id: string;
    readonly type: 'triage_submission';
    readonly attributes: {
      readonly status: 'pending' | 'processing' | 'awaiting_answer' | 'completed' | 'failed';
    };
  };
}

export interface TriageResultResource {
  readonly id: string;
  readonly type: 'triage_submission';
  readonly attributes: {
    readonly status: 'completed';
    readonly isSynthetic: boolean;
    readonly outcome: TriageOutcome;
    readonly currentTurn: number;
    readonly conversationHistory: readonly ConversationMessage[];
    readonly processingDuration: number | null;
    readonly submittedAt: string;
    readonly processedAt: string;
  };
}

export interface TriageSubmissionsListResponse {
  readonly data: readonly TriageSubmissionResource[];
}

// --- Admin ---
export interface DashboardStats {
  readonly total: number;
  readonly synthetic: number;
  readonly pending: number;
  readonly processing: number;
  readonly completed: number;
  readonly failed: number;
  readonly avgProcessingDuration: number | null;
  readonly bySpecialist: readonly { readonly specialist: string; readonly count: number }[];
  readonly byUrgency: readonly { readonly urgency: string; readonly count: number }[];
}

export interface ImpersonateResponse {
  readonly data: {
    readonly token: string;
    readonly impersonated: string;
  };
}
