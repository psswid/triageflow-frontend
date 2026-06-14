import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageSwitcher } from '../../components/shared/LanguageSwitcher';
import '../../i18n';

describe('LanguageSwitcher', () => {
  it('renders EN and PL buttons', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('PL')).toBeInTheDocument();
  });

  it('has aria-pressed on active language', () => {
    render(<LanguageSwitcher />);
    const buttons = screen.getAllByRole('button');
    const pressed = buttons.filter(b => b.getAttribute('aria-pressed') === 'true');
    expect(pressed.length).toBe(1);
  });

  it('has aria-label on buttons', () => {
    render(<LanguageSwitcher />);
    expect(screen.getByLabelText('Switch to EN')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to PL')).toBeInTheDocument();
  });
});
