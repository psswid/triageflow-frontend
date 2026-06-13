import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Skeleton } from '../../components/ui/Skeleton';

describe('Skeleton', () => {
  it('renders a text skeleton with default variant', () => {
    const { container } = render(<Skeleton />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('space-y-2');
    const block = wrapper.firstChild as HTMLElement;
    expect(block).toHaveClass('animate-pulse');
    expect(block).toHaveClass('rounded');
    expect(block).toHaveClass('bg-gray-200');
  });

  it('renders a card skeleton', () => {
    const { container } = render(<Skeleton variant="card" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('rounded-xl');
  });

  it('renders a stats-grid skeleton (4 cards)', () => {
    const { container } = render(<Skeleton variant="stats-grid" />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('grid');
    expect(wrapper.children.length).toBe(4);
  });

  it('renders a table-row skeleton with given lines', () => {
    const { container } = render(<Skeleton variant="table-row" lines={3} />);
    const el = container.firstChild as HTMLElement;
    expect(el.children.length).toBe(3);
  });

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="my-4" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass('my-4');
  });
});
