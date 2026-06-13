import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { FailedMessageResource } from '../../api/types';

const mockUseAdminFailedMessages = vi.fn();
const mockRetryMutation = { mutate: vi.fn(), isPending: false };
const mockDeleteMutation = { mutate: vi.fn(), isPending: false };

vi.mock('../../features/admin/hooks/useAdminFailedMessages', () => ({
  useAdminFailedMessages: () => mockUseAdminFailedMessages() as Record<string, unknown>,
  useRetryFailedMessage: () => mockRetryMutation,
  useDeleteFailedMessage: () => mockDeleteMutation,
}));

import { ToastProvider } from '../../components/ui/ToastProvider';
import { FailedMessagesTable } from '../../features/admin/components/FailedMessagesTable';

function renderComponent(): void {
  render(
    <ToastProvider>
      <FailedMessagesTable />
    </ToastProvider>,
  );
}

function createMessage(overrides: Partial<FailedMessageResource> = {}): FailedMessageResource {
  return {
    id: 1,
    type: 'failed_message',
    attributes: {
      messageId: 1,
      type: 'App\\Triage\\Application\\Message\\ProcessTriageMessage',
      failedAt: '2026-06-12T10:00:00Z',
      error: 'Connection timed out after 5 seconds',
      preview: 'Test patient needs immediate attention',
      ...overrides.attributes,
    },
    ...overrides,
  };
}



describe('FailedMessagesTable', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders skeleton initially', () => {
    mockUseAdminFailedMessages.mockReturnValue({ data: undefined, isLoading: true, error: null });

    renderComponent();

    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeInTheDocument();
  });

  it('renders ErrorFallback when API call fails', () => {
    mockUseAdminFailedMessages.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Network error'),
    });

    renderComponent();

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('renders empty state when no messages', () => {
    mockUseAdminFailedMessages.mockReturnValue({ data: [], isLoading: false, error: null });

    renderComponent();

    expect(screen.getByText('No failed messages')).toBeInTheDocument();
    expect(
      screen.getByText('All messages are processing normally.'),
    ).toBeInTheDocument();
  });

  it('renders message rows with type, error, preview, and action buttons', () => {
    const messages: readonly FailedMessageResource[] = [
      createMessage({
        id: 1,
        attributes: {
          messageId: 1,
          type: 'App\\Triage\\Application\\Message\\ProcessTriageMessage',
          failedAt: '2026-06-12T10:00:00Z',
          error: 'Connection timed out',
          preview: 'Test patient needs attention',
        },
      }),
      createMessage({
        id: 2,
        attributes: {
          messageId: 2,
          type: 'App\\Synthetic\\Application\\Message\\ProcessSyntheticTurnMessage',
          failedAt: '2026-06-12T11:00:00Z',
          error: 'API rate limit exceeded',
          preview: 'Synthetic case generation',
        },
      }),
    ];

    mockUseAdminFailedMessages.mockReturnValue({ data: messages, isLoading: false, error: null });

    renderComponent();

    // Check type labels (last namespace part)
    expect(screen.getByText('ProcessTriageMessage')).toBeInTheDocument();
    expect(screen.getByText('ProcessSyntheticTurnMessage')).toBeInTheDocument();

    // Check error messages
    expect(screen.getByText('Connection timed out')).toBeInTheDocument();
    expect(screen.getByText('API rate limit exceeded')).toBeInTheDocument();

    // Check previews
    expect(screen.getByText('Test patient needs attention')).toBeInTheDocument();
    expect(screen.getByText('Synthetic case generation')).toBeInTheDocument();

    // Check action buttons (Retry + Delete per row = 4 buttons)
    const retryButtons = screen.getAllByText('Retry');
    const deleteButtons = screen.getAllByText('Delete');
    expect(retryButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it('calls retry mutation on Retry button click', () => {
    const messages: readonly FailedMessageResource[] = [createMessage()];
    mockUseAdminFailedMessages.mockReturnValue({ data: messages, isLoading: false, error: null });

    renderComponent();

    fireEvent.click(screen.getByText('Retry'));

    expect(mockRetryMutation.mutate).toHaveBeenCalledWith(1);
  });

  it('calls delete mutation on Delete button click after confirm', () => {
    const messages: readonly FailedMessageResource[] = [createMessage()];
    mockUseAdminFailedMessages.mockReturnValue({ data: messages, isLoading: false, error: null });

    // Mock window.confirm to return true
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    renderComponent();

    fireEvent.click(screen.getByText('Delete'));

    expect(mockDeleteMutation.mutate).toHaveBeenCalledWith(1);

    window.confirm = originalConfirm;
  });

  it('does not call delete mutation on Delete button click when cancelled', () => {
    const messages: readonly FailedMessageResource[] = [createMessage()];
    mockUseAdminFailedMessages.mockReturnValue({ data: messages, isLoading: false, error: null });

    // Mock window.confirm to return false
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => false);

    renderComponent();

    fireEvent.click(screen.getByText('Delete'));

    expect(mockDeleteMutation.mutate).not.toHaveBeenCalled();

    window.confirm = originalConfirm;
  });
});
