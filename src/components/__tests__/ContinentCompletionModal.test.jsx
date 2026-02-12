import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import ContinentCompletionModal from "../ContinentCompletionModal";
import { LanguageProvider } from "../../i18n/LanguageContext";

const renderWithLanguageProvider = (component) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe("ContinentCompletionModal Component", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("rendering", () => {
    it("should render celebration message", () => {
      renderWithLanguageProvider(
        <ContinentCompletionModal
          continent="Europe"
          continentColor="#3498db"
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText(/🎉/)).toBeInTheDocument();
      // The text might be slightly different based on translations
      expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    });

    it("should display the continent name in celebration", () => {
      renderWithLanguageProvider(
        <ContinentCompletionModal
          continent="Africa"
          continentColor="#e74c3c"
          onClose={mockOnClose}
        />
      );

      // Check that Africa is mentioned somewhere in the modal
      expect(screen.getByText(/Africa/i)).toBeInTheDocument();
    });

    it("should render close button", () => {
      renderWithLanguageProvider(
        <ContinentCompletionModal
          continent="Europe"
          continentColor="#3498db"
          onClose={mockOnClose}
        />
      );

      expect(screen.getByText("×")).toBeInTheDocument();
    });
  });

  describe("continent color styling", () => {
    it("should apply continent color to border", () => {
      const { container } = renderWithLanguageProvider(
        <ContinentCompletionModal
          continent="Europe"
          continentColor="#3498db"
          onClose={mockOnClose}
        />
      );

      const modalContent = container.querySelector(".celebration-modal");
      expect(modalContent).toHaveStyle({ borderColor: "#3498db" });
    });

    it("should use different color for Africa", () => {
      const { container } = renderWithLanguageProvider(
        <ContinentCompletionModal
          continent="Africa"
          continentColor="#e74c3c"
          onClose={mockOnClose}
        />
      );

      const modalContent = container.querySelector(".celebration-modal");
      expect(modalContent).toHaveStyle({ borderColor: "#e74c3c" });
    });
  });

  describe("auto-close functionality", () => {
    it("should auto-close after 3 seconds", () => {
      renderWithLanguageProvider(
        <ContinentCompletionModal
          continent="Europe"
          continentColor="#3498db"
          onClose={mockOnClose}
        />
      );

      expect(mockOnClose).not.toHaveBeenCalled();

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should not auto-close before 3 seconds", () => {
      renderWithLanguageProvider(
        <ContinentCompletionModal
          continent="Europe"
          continentColor="#3498db"
          onClose={mockOnClose}
        />
      );

      act(() => {
        vi.advanceTimersByTime(2999);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("manual close", () => {
    it("should call onClose when close button is clicked", () => {
      renderWithLanguageProvider(
        <ContinentCompletionModal
          continent="Europe"
          continentColor="#3498db"
          onClose={mockOnClose}
        />
      );

      fireEvent.click(screen.getByText("×"));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when overlay is clicked", () => {
      const { container } = renderWithLanguageProvider(
        <ContinentCompletionModal
          continent="Europe"
          continentColor="#3498db"
          onClose={mockOnClose}
        />
      );

      const overlay = container.querySelector(".modal-overlay");
      fireEvent.click(overlay);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("different continents", () => {
    const testCases = [
      { continent: "Africa", color: "#e74c3c" },
      { continent: "Asia", color: "#f39c12" },
      { continent: "Europe", color: "#3498db" },
      { continent: "North America", color: "#9b59b6" },
      { continent: "South America", color: "#2ecc71" },
      { continent: "Oceania", color: "#1abc9c" },
    ];

    testCases.forEach(({ continent, color }) => {
      it(`should display correct message for ${continent}`, () => {
        renderWithLanguageProvider(
          <ContinentCompletionModal
            continent={continent}
            continentColor={color}
            onClose={mockOnClose}
          />
        );

        expect(
          screen.getByText(new RegExp(`${continent}`, "i"))
        ).toBeInTheDocument();
      });
    });
  });

  describe("cleanup", () => {
    it("should clear timeout when unmounted", () => {
      const { unmount } = renderWithLanguageProvider(
        <ContinentCompletionModal
          continent="Europe"
          continentColor="#3498db"
          onClose={mockOnClose}
        />
      );

      unmount();

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });
});
