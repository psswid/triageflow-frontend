import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { ToastProvider, useToast } from '../../components/ui/ToastProvider';

function TestConsumer() {
  const { toast } = useToast();
  return (
    <div>
      <button onClick={() => toast.error('Error occurred')}>Trigger Error</button>
      <button onClick={() => toast.warning('Warning message')}>Trigger Warning</button>
      <button onClick={() => toast.info('Info message')}>Trigger Info</button>
    </div>
  );
}

describe('ToastProvider', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('provides toast function via context', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Trigger Error'));
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('stacks multiple toasts', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Trigger Error'));
    fireEvent.click(screen.getByText('Trigger Warning'));

    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('removes toast on dismiss', () => {
    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Trigger Error'));
    expect(screen.getByText('Error occurred')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(screen.queryByText('Error occurred')).not.toBeInTheDocument();
  });

  it('auto-removes toast after timeout', () => {
    vi.useFakeTimers();

    render(
      <ToastProvider>
        <TestConsumer />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Trigger Error'));

    act(() => { vi.advanceTimersByTime(5000); });

    expect(screen.queryByText('Error occurred')).not.toBeInTheDocument();
  });

  it('throws when useToast is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(/must be used within a ToastProvider/i);

    spy.mockRestore();
  });
});
