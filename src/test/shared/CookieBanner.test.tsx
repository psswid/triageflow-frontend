import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CookieBanner } from '../../components/shared/CookieBanner';
import '../../i18n';

describe('CookieBanner', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders when no consent is stored', () => {
    render(<CookieBanner />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('hides when consent is already stored', () => {
    localStorage.setItem('cookieConsent', 'true');
    const { container } = render(<CookieBanner />);
    expect(container.textContent).toBe('');
  });

  it('dismisses on button click', () => {
    const { container } = render(<CookieBanner />);
    fireEvent.click(screen.getByRole('button'));
    expect(container.textContent).toBe('');
  });
});
