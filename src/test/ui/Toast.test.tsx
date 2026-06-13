import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Toast } from '../../components/ui/Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the message', () => {
    render(<Toast id="1" message="Operation failed" onDismiss={vi.fn()} />);
    expect(screen.getByText('Operation failed')).toBeInTheDocument();
  });

  it('renders dismiss button', () => {
    render(<Toast id="1" message="Test" onDismiss={vi.fn()} />);
    expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button clicked', () => {
    const onDismiss = vi.fn();
    render(<Toast id="1" message="Test" onDismiss={onDismiss} />);
    screen.getByRole('button', { name: /dismiss/i }).click();
    expect(onDismiss).toHaveBeenCalledWith('1');
  });

  it('auto-dismisses after 5 seconds', () => {
    const onDismiss = vi.fn();
    render(<Toast id="1" message="Test" onDismiss={onDismiss} />);

    act(() => { vi.advanceTimersByTime(5000); });

    expect(onDismiss).toHaveBeenCalledWith('1');
  });

  it('does not auto-dismiss before 5 seconds', () => {
    const onDismiss = vi.fn();
    render(<Toast id="1" message="Test" onDismiss={onDismiss} />);

    act(() => { vi.advanceTimersByTime(4000); });

    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('renders error variant with red styling', () => {
    const { container } = render(
      <Toast id="1" message="Test" onDismiss={vi.fn()} variant="error" />,
    );
    expect(container.firstChild).toHaveClass('bg-red-50');
  });

  it('renders warning variant with amber styling', () => {
    const { container } = render(
      <Toast id="1" message="Test" onDismiss={vi.fn()} variant="warning" />,
    );
    expect(container.firstChild).toHaveClass('bg-amber-50');
  });

  it('renders info variant with blue styling', () => {
    const { container } = render(
      <Toast id="1" message="Test" onDismiss={vi.fn()} variant="info" />,
    );
    expect(container.firstChild).toHaveClass('bg-blue-50');
  });
});
