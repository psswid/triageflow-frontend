import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '../../i18n';

// Mock scrollIntoView which jsdom doesn't implement
Element.prototype.scrollIntoView = vi.fn();

// Mock react-router-dom useNavigate
const mockNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

// Mock useTriageInterview hook
const mockUseTriageInterview = vi.fn();

vi.mock('../../features/triage/hooks/useTriageInterview', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  useTriageInterview: () => mockUseTriageInterview(),
}));

import { TriagePage } from '../../features/triage/pages/TriagePage';

// Mock the Loader component to simplify testing
vi.mock('../../components/shared/Loader', () => ({
  Loader: ({ message }: { readonly message?: string }) => (
    <div data-testid="loader">{message ?? 'Loading...'}</div>
  ),
}));

function createDefaultState() {
  return {
    state: 'idle' as const,
    submit: vi.fn(),
    answer: vi.fn(),
    conversation: [] as readonly {
      readonly type: 'initial_description' | 'question' | 'answer';
      readonly content: string;
      readonly timestamp: string;
    }[],
    status: null as string | null,
    currentTurn: 0,
    lastQuestion: null as string | null,
    error: null as string | null,
    submissionId: null as string | null,
    reset: vi.fn(),
  };
}

describe('TriagePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('idle state', () => {
    it('renders initial symptom input form', () => {
      mockUseTriageInterview.mockReturnValue(createDefaultState());

      render(<TriagePage />);

      expect(screen.getByText('New Triage')).toBeInTheDocument();
      expect(screen.getByText('Describe your symptoms')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /submit/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/severe headache/i),
      ).toBeInTheDocument();
    });

    it('renders character counter at 0/500', () => {
      mockUseTriageInterview.mockReturnValue(createDefaultState());

      render(<TriagePage />);

      expect(screen.getByText('0/500')).toBeInTheDocument();
    });
  });

  describe('submitting state', () => {
    it('renders symptom input with loading spinner', () => {
      mockUseTriageInterview.mockReturnValue({
        ...createDefaultState(),
        state: 'submitting',
      });

      render(<TriagePage />);

      expect(screen.getByText('Describe your symptoms')).toBeInTheDocument();
      // Submit button should be present but disabled/loading
      const submitButton = screen.getByRole('button', { name: /analyzing/i });
      expect(submitButton).toBeDisabled();
    });

    it('calls submit when button is clicked in idle state', () => {
      const mockSubmit = vi.fn();
      mockUseTriageInterview.mockReturnValue({
        ...createDefaultState(),
        submit: mockSubmit,
      });

      render(<TriagePage />);

      const textarea = screen.getByPlaceholderText(/severe headache/i);
      fireEvent.change(textarea, {
        target: { value: 'I have a headache' },
      });

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(mockSubmit).toHaveBeenCalledWith('I have a headache');
    });

    it('does not call submit when textarea is empty', () => {
      const mockSubmit = vi.fn();
      mockUseTriageInterview.mockReturnValue({
        ...createDefaultState(),
        submit: mockSubmit,
      });

      render(<TriagePage />);

      const submitButton = screen.getByRole('button', { name: /submit/i });
      fireEvent.click(submitButton);

      expect(mockSubmit).not.toHaveBeenCalled();
    });
  });

  describe('polling state', () => {
    it('renders analyzing loader', () => {
      mockUseTriageInterview.mockReturnValue({
        ...createDefaultState(),
        state: 'polling',
      });

      render(<TriagePage />);

      expect(screen.getByTestId('loader')).toBeInTheDocument();
      expect(
        screen.getByText('AI is analyzing your symptoms...'),
      ).toBeInTheDocument();
    });
  });

  describe('awaiting_answer state', () => {
    it('renders conversation history and answer input', () => {
      mockUseTriageInterview.mockReturnValue({
        ...createDefaultState(),
        state: 'awaiting_answer',
        currentTurn: 1,
        conversation: [
          {
            type: 'initial_description',
            content: 'I have a headache',
            timestamp: '2026-01-01T12:00:00Z',
          },
          {
            type: 'question',
            content: 'Where is the pain located?',
            timestamp: '2026-01-01T12:00:05Z',
          },
        ],
      });

      render(<TriagePage />);

      // Check conversation is rendered
      expect(screen.getByText('I have a headache')).toBeInTheDocument();
      expect(
        screen.getByText('Where is the pain located?'),
      ).toBeInTheDocument();

      // Check answer input is rendered
      expect(
        screen.getByPlaceholderText('Type your answer here...'),
      ).toBeInTheDocument();
      expect(screen.getByText('Question 1 of 3')).toBeInTheDocument();

      // Check send button
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
    });

    it('calls answer function when send is clicked', () => {
      const mockAnswer = vi.fn();
      mockUseTriageInterview.mockReturnValue({
        ...createDefaultState(),
        state: 'awaiting_answer',
        currentTurn: 2,
        conversation: [],
        answer: mockAnswer,
      });

      render(<TriagePage />);

      const input = screen.getByPlaceholderText('Type your answer here...');
      fireEvent.change(input, { target: { value: 'On the left side' } });

      const sendButton = screen.getByRole('button', { name: /send/i });
      fireEvent.click(sendButton);

      expect(mockAnswer).toHaveBeenCalledWith('On the left side');
    });

    it('shows Question X of 3 indicator', () => {
      mockUseTriageInterview.mockReturnValue({
        ...createDefaultState(),
        state: 'awaiting_answer',
        currentTurn: 2,
        conversation: [],
      });

      render(<TriagePage />);

      expect(screen.getByText('Question 2 of 3')).toBeInTheDocument();
    });

    it('shows Final question when currentTurn exceeds max', () => {
      mockUseTriageInterview.mockReturnValue({
        ...createDefaultState(),
        state: 'awaiting_answer',
        currentTurn: 4,
        conversation: [],
      });

      render(<TriagePage />);

      expect(screen.getByText('Final question')).toBeInTheDocument();
    });
  });

  describe('completed state', () => {
    it('navigates to result page', () => {
      mockUseTriageInterview.mockReturnValue({
        ...createDefaultState(),
        state: 'completed',
        submissionId: 'sub-123',
      });

      render(<TriagePage />);

      expect(mockNavigate).toHaveBeenCalledWith('/triage/sub-123/result', {
        replace: true,
      });
    });
  });

  describe('failed state', () => {
    it('renders error message and try again button', () => {
      const mockReset = vi.fn();
      mockUseTriageInterview.mockReturnValue({
        ...createDefaultState(),
        state: 'failed',
        error: 'AI processing failed',
        reset: mockReset,
      });

      render(<TriagePage />);

      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
      expect(screen.getByText('AI processing failed')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /try again/i }),
      ).toBeInTheDocument();
    });

    it('calls reset when try again is clicked', () => {
      const mockReset = vi.fn();
      mockUseTriageInterview.mockReturnValue({
        ...createDefaultState(),
        state: 'failed',
        error: 'Analysis failed',
        reset: mockReset,
      });

      render(<TriagePage />);

      const retryButton = screen.getByRole('button', { name: /try again/i });
      fireEvent.click(retryButton);

      expect(mockReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('error display', () => {
    it('displays error in symptom input when present', () => {
      mockUseTriageInterview.mockReturnValue({
        ...createDefaultState(),
        state: 'submitting',
        error: 'Connection failed',
      });

      render(<TriagePage />);

      expect(screen.getByText('Connection failed')).toBeInTheDocument();
    });
  });
});
