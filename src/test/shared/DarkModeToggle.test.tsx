import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DarkModeToggle } from '../../components/shared/DarkModeToggle';
import '../../i18n';

describe('DarkModeToggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('renders a button with accessible label', () => {
    render(<DarkModeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.getAttribute('aria-label')).toBeTruthy();
  });

  it('toggles from light to dark on click', () => {
    render(<DarkModeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('toggles back from dark to light on second click', () => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    render(<DarkModeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('initializes with system preference when no localStorage', () => {
    // Default is light when system pref not explicitly dark
    render(<DarkModeToggle />);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('initializes with saved preference from localStorage', () => {
    localStorage.setItem('theme', 'dark');
    render(<DarkModeToggle />);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
