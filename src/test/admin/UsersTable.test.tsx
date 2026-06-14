import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '../../i18n';
import type { UserResource } from '../../api/types';

const mockUseAdminUsers = vi.fn();

vi.mock('../../features/admin/hooks/useAdminUsers', () => ({
  useAdminUsers: () => mockUseAdminUsers() as Record<string, unknown>,
}));

// Mock ImpersonateButton to simplify testing (it depends on useAuth, useNavigate, and useMutation)
vi.mock('../../features/admin/components/ImpersonateButton', () => ({
  ImpersonateButton: ({ userId, userEmail }: { userId: string; userEmail: string }) => (
    <div data-testid="impersonate-button" data-user-id={userId} data-user-email={userEmail}>
      ImpersonateButton
    </div>
  ),
}));

import { UsersTable } from '../../features/admin/components/UsersTable';

function createUser(overrides: Partial<UserResource> = {}): UserResource {
  return {
    id: 'user-1',
    type: 'user',
    attributes: {
      email: 'alice@example.com',
      roles: ['ROLE_USER'],
      createdAt: '2026-01-15T10:00:00Z',
      ...overrides.attributes,
    },
    ...overrides,
  };
}

function renderUsersTable(): void {
  render(<UsersTable />);
}

describe('UsersTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton initially', () => {
    mockUseAdminUsers.mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderUsersTable();

    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders ErrorFallback when API call fails', () => {
    mockUseAdminUsers.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error'),
    });

    renderUsersTable();

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('renders user list with email, roles, and ImpersonateButton per row', () => {
    const users: readonly UserResource[] = [
      createUser({
        id: 'user-1',
        attributes: {
          email: 'alice@example.com',
          roles: ['ROLE_USER'],
          createdAt: '2026-01-15T10:00:00Z',
        },
      }),
      createUser({
        id: 'user-2',
        attributes: {
          email: 'bob@example.com',
          roles: ['ROLE_ADMIN'],
          createdAt: '2026-02-20T14:30:00Z',
        },
      }),
    ];

    mockUseAdminUsers.mockReturnValue({ data: users, isLoading: false, error: null });

    renderUsersTable();

    // Verify emails are displayed
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();

    // Verify role badges (ROLE_ prefix stripped in display)
    expect(screen.getByText('USER')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();

    // Verify ImpersonateButton is rendered per user
    const buttons = screen.getAllByTestId('impersonate-button');
    expect(buttons).toHaveLength(2);
    expect(buttons[0]).toHaveAttribute('data-user-id', 'user-1');
    expect(buttons[1]).toHaveAttribute('data-user-id', 'user-2');
  });

  it('filters out system@triageflow.local user', () => {
    const users: readonly UserResource[] = [
      createUser({
        id: 'user-1',
        attributes: {
          email: 'alice@example.com',
          roles: ['ROLE_USER'],
          createdAt: '2026-01-15T10:00:00Z',
        },
      }),
      createUser({
        id: 'system-user',
        attributes: {
          email: 'system@triageflow.local',
          roles: ['ROLE_SYSTEM'],
          createdAt: '2025-01-01T00:00:00Z',
        },
      }),
    ];

    mockUseAdminUsers.mockReturnValue({ data: users, isLoading: false, error: null });

    renderUsersTable();

    // Only the non-system user should be visible
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.queryByText('system@triageflow.local')).not.toBeInTheDocument();
  });

  it("shows 'No users found' EmptyState when user list is empty", () => {
    mockUseAdminUsers.mockReturnValue({ data: [], isLoading: false, error: null });

    renderUsersTable();

    expect(screen.getAllByText('No users found.')[0]).toBeInTheDocument();
  });
});
