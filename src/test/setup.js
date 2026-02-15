import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock WorldMap and USMap to avoid CDN fetches
vi.mock("../components/WorldMap", () => ({
  default: function WorldMapMock() {
    return null;
  },
}));

vi.mock("../components/USMap", () => ({
  default: function USMapMock() {
    return null;
  },
}));

vi.mock("../components/StateShapeViewer", () => ({
  default: function StateShapeViewerMock({ stateCode, currentIndex, totalStates }) {
    return null;
  },
}));

// Mock canvas-confetti to avoid issues in test environment
vi.mock("canvas-confetti", () => ({
  default: vi.fn(),
}));

// Mock localStorage with actual in-memory storage
const localStorageData = {};
const localStorageMock = {
  getItem: vi.fn((key) => localStorageData[key] || null),
  setItem: vi.fn((key, value) => {
    localStorageData[key] = value;
  }),
  removeItem: vi.fn((key) => {
    delete localStorageData[key];
  }),
  clear: vi.fn(() => {
    Object.keys(localStorageData).forEach(key => delete localStorageData[key]);
  }),
};
global.localStorage = localStorageMock;

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
  // Clear localStorage data but keep mock functions
  Object.keys(localStorageData).forEach(key => delete localStorageData[key]);
});

