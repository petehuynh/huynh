import '@testing-library/jest-dom';

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(className: string): R;
    }
  }
}

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
} as Storage;
global.localStorage = localStorageMock;

// Mock IntersectionObserver
class IntersectionObserverMock implements IntersectionObserver {
  readonly root: Element | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(private callback: IntersectionObserverCallback) {
    setTimeout(() => {
      callback(
        [
          {
            isIntersecting: true,
            boundingClientRect: {} as DOMRectReadOnly,
            intersectionRatio: 1,
            intersectionRect: {} as DOMRectReadOnly,
            rootBounds: null,
            target: document.createElement('div'),
            time: Date.now(),
          },
        ],
        this
      );
    }, 0);
  }

  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  takeRecords = () => [];
}

global.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
) as jest.Mock;

// Mock window.gtag
global.gtag = jest.fn();

// Mock document.head.appendChild for Google Analytics script
const originalAppendChild = document.head.appendChild;
document.head.appendChild = jest.fn((element) => {
  if (element instanceof HTMLScriptElement && element.src.includes('googletagmanager')) {
    return element;
  }
  return originalAppendChild.call(document.head, element);
}); 