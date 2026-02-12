import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock canvas-confetti to avoid issues in test environment
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

// Mock window.matchMedia for components that might use it
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor() {
    this.observe = vi.fn();
    this.unobserve = vi.fn();
    this.disconnect = vi.fn();
  }
}

window.IntersectionObserver = MockIntersectionObserver;

// Reset all mocks after each test
afterEach(() => {
  vi.clearAllMocks();
});
