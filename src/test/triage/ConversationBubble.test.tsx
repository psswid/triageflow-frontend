import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '../../i18n';
import { ConversationBubble } from '../../features/triage/components/ConversationBubble';

describe('ConversationBubble', () => {
  const timestamp = '2025-06-01T12:00:00Z';

  it('aligns user messages to the right', () => {
    const { container } = render(
      <ConversationBubble type="answer" content="My head hurts" timestamp={timestamp} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('items-end');
  });

  it('aligns assistant messages (questions) to the left', () => {
    const { container } = render(
      <ConversationBubble type="question" content="How long has this been going on?" timestamp={timestamp} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('items-start');
  });

  it('shows a result badge on outcome messages', () => {
    render(
      <ConversationBubble
        type="result"
        content='{"specialist":"Cardiology","urgency":"HIGH","justification":"Chest pain radiating to left arm"}'
        timestamp={timestamp}
      />,
    );

    expect(screen.getByText('Triage result available')).toBeInTheDocument();
  });

  it('renders the message content text', () => {
    render(
      <ConversationBubble type="question" content="Are you experiencing any chest pain?" timestamp={timestamp} />,
    );

    expect(screen.getByText('Are you experiencing any chest pain?')).toBeInTheDocument();
  });

  it('renders a timestamp element', () => {
    const { container } = render(
      <ConversationBubble type="initial_description" content="I feel dizzy" timestamp={timestamp} />,
    );

    // The last child of the wrapper is the timestamp span
    const wrapper = container.firstChild as HTMLElement;
    const timestampEl = wrapper.lastChild as HTMLElement;
    expect(timestampEl.tagName).toBe('SPAN');
    expect(timestampEl.textContent).toBeTruthy();
  });

  it('aligns initial description (user message) to the right', () => {
    const { container } = render(
      <ConversationBubble type="initial_description" content="I feel dizzy" timestamp={timestamp} />,
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain('items-end');
  });
});
