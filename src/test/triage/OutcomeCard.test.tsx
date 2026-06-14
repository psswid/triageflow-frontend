import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '../../i18n';
import { OutcomeCard } from '../../features/triage/components/OutcomeCard';

type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';

describe('OutcomeCard', () => {
  const defaultProps = {
    specialist: 'Cardiology',
    urgency: 'MEDIUM' as UrgencyLevel,
    justification: 'Patient shows signs of arrhythmia requiring specialist evaluation.',
  };

  it('renders without crashing with minimal props', () => {
    const { container } = render(
      <OutcomeCard
        specialist="Neurology"
        urgency="LOW"
        justification="Routine checkup."
      />,
    );
    expect(container).toBeInTheDocument();
  });

  it('renders the specialist name correctly', () => {
    render(<OutcomeCard {...defaultProps} />);
    expect(screen.getByText('Recommended: Cardiology')).toBeInTheDocument();
  });

  it('renders the medical justification text', () => {
    render(<OutcomeCard {...defaultProps} />);
    expect(
      screen.getByText(
        'Patient shows signs of arrhythmia requiring specialist evaluation.',
      ),
    ).toBeInTheDocument();
  });

  describe('urgency level visual indicators', () => {
    it.each([
      ['LOW', 'border-l-green-500'],
      ['MEDIUM', 'border-l-yellow-500'],
      ['HIGH', 'border-l-orange-500'],
      ['EMERGENCY', 'border-l-red-500'],
    ] as const)('renders %s urgency with correct left border color', (urgency, expectedBorderClass) => {
      const { container } = render(
        <OutcomeCard
          specialist="Dermatology"
          urgency={urgency}
          justification="Test justification."
        />,
      );
      // The Card component receives the border class via the className prop
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain(expectedBorderClass);
    });
  });
});
