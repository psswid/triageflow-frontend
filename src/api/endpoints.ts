export const ENDPOINTS = {
  AUTH: {
    ME: '/api/me',
    LOGIN: '/api/login',
    REGISTER: '/api/register',
  },
  TRIAGE: {
    SUBMIT: '/api/triage/submit',
    STATUS: (id: string) => `/api/triage/status/${id}`,
    ANSWER: (id: string) => `/api/triage/${id}/answer`,
    RESULT: (id: string) => `/api/triage/result/${id}`,
    MY_SUBMISSIONS: '/api/triage/submissions',
  },
  ADMIN: {
    STATS: '/api/admin/stats',
    SUBMISSIONS: '/api/admin/submissions',
    SUBMISSION_DETAIL: (id: string) => `/api/admin/submissions/${id}`,
    USERS: '/api/admin/users',
    SYNTHETIC_GENERATE: '/api/admin/synthetic/generate',
    IMPERSONATE: (id: string) => `/api/admin/users/${id}/impersonate`,
    FAILED_MESSAGES: '/api/admin/failed-messages',
    FAILED_MESSAGE_RETRY: (id: number) => `/api/admin/failed-messages/${id}/retry`,
    FAILED_MESSAGE_DELETE: (id: number) => `/api/admin/failed-messages/${id}`,
  },
} as const;
