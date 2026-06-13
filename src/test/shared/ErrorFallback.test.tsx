import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorFallback } from '../../components/shared/ErrorFallback';

describe('ErrorFallback', () => {
  it('renders error message and retry button', () => {
    const onRetry = vi.fn();
    render(<ErrorFallback error={new Error('Network failure')} onRetry={onRetry} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Network failure')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });

  it('calls onRetry when retry is clicked', () => {
    const onRetry = vi.fn();
    render(<ErrorFallback error={new Error('fail')} onRetry={onRetry} />);

    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('renders custom title when provided', () => {
    render(
      <ErrorFallback error={new Error('fail')} onRetry={vi.fn()} title="Custom Title" />,
    );
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('has aria role alert', () => {
    render(<ErrorFallback error={new Error('fail')} onRetry={vi.fn()} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('has collapsible error details', () => {
    render(<ErrorFallback error={new Error('TypeError: cannot read')} onRetry={vi.fn()} />);

    const toggle = screen.getByText(/error details/i);
    expect(toggle).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.getByText('TypeError: cannot read')).toBeInTheDocument();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorFallback error={new Error('fail')} />);

    expect(screen.queryByRole('button', { name: /retry/i })).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('fail')).toBeInTheDocument();
  });
});
