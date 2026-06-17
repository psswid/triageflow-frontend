import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom doesn't implement matchMedia — stub for tests
const noop = vi.fn();
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: noop,
    removeListener: noop,
    addEventListener: noop,
    removeEventListener: noop,
    dispatchEvent: () => false,
  })),
});

// jsdom doesn't implement IntersectionObserver — stub for TableOfContents
/* eslint-disable @typescript-eslint/no-empty-function */
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly scrollMargin: string = '';
  readonly thresholds: readonly number[] = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}
/* eslint-enable @typescript-eslint/no-empty-function */
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});
