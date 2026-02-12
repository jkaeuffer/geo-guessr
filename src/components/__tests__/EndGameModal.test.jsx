import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EndGameModal from "../EndGameModal";
import { LanguageProvider } from "../../i18n/LanguageContext";
import { continents, getCountriesByContinent } from "../../data/countries";

const renderWithLanguageProvider = (component) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe("EndGameModal Component", () => {
  const mockOnClose = vi.fn();
  const mockOnRestart = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    mockOnRestart.mockClear();
  });

  describe("rendering", () => {
    it("should render Game Over title", () => {
      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set()}
          totalTime={0}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByText("Game Over!")).toBeInTheDocument();
    });

    it("should display statistics", () => {
      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set(["FR", "DE", "IT"])}
          totalTime={120}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByText("Countries Found")).toBeInTheDocument();
      expect(screen.getByText("Countries Missed")).toBeInTheDocument();
      expect(screen.getByText("Total Time")).toBeInTheDocument();
    });

    it("should show correct count of guessed countries", () => {
      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set(["FR", "DE", "IT"])}
          totalTime={120}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByText("3")).toBeInTheDocument();
    });

    it("should show correct count of missed countries", () => {
      const guessedCountries = new Set(["FR", "DE", "IT"]);
      const totalCountries = continents.reduce(
        (acc, continent) => acc + getCountriesByContinent(continent).length,
        0
      );
      const missed = totalCountries - guessedCountries.size;

      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={guessedCountries}
          totalTime={120}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByText(missed.toString())).toBeInTheDocument();
    });
  });

  describe("time formatting", () => {
    it("should format time correctly for under a minute", () => {
      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set()}
          totalTime={45}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByText("0:45")).toBeInTheDocument();
    });

    it("should format time correctly for over a minute", () => {
      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set()}
          totalTime={125}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByText("2:05")).toBeInTheDocument();
    });

    it("should format time correctly for exactly one minute", () => {
      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set()}
          totalTime={60}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByText("1:00")).toBeInTheDocument();
    });
  });

  describe("missed countries display", () => {
    it("should show missed countries section when there are missed countries", () => {
      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set(["FR"])}
          totalTime={60}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByText("Missed Countries")).toBeInTheDocument();
    });

    it("should not show missed countries section when all countries guessed", () => {
      const allCountryCodes = continents.flatMap((continent) =>
        getCountriesByContinent(continent).map((c) => c.code)
      );
      const guessedCountries = new Set(allCountryCodes);

      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={guessedCountries}
          totalTime={300}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.queryByText("Missed Countries")).not.toBeInTheDocument();
    });

    it("should group missed countries by continent", () => {
      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set()}
          totalTime={60}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByRole("heading", { name: "Africa" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Europe" })).toBeInTheDocument();
    });

    it("should display mini flags for missed countries", () => {
      const { container } = renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set()}
          totalTime={60}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      const miniFlags = container.querySelectorAll(".mini-flag");
      expect(miniFlags.length).toBeGreaterThan(0);
    });
  });

  describe("buttons", () => {
    it("should render Play Again button", () => {
      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set()}
          totalTime={60}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      expect(
        screen.getByRole("button", { name: "Play Again" })
      ).toBeInTheDocument();
    });

    it("should render Close button", () => {
      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set()}
          totalTime={60}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    it("should call onRestart when Play Again is clicked", () => {
      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set()}
          totalTime={60}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: "Play Again" }));

      expect(mockOnRestart).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when Close is clicked", () => {
      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set()}
          totalTime={60}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      fireEvent.click(screen.getByRole("button", { name: "Close" }));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("styling", () => {
    it("should have modal-overlay class", () => {
      const { container } = renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set()}
          totalTime={60}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      expect(container.querySelector(".modal-overlay")).toBeInTheDocument();
    });

    it("should have end-game-modal class", () => {
      const { container } = renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set()}
          totalTime={60}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      expect(container.querySelector(".end-game-modal")).toBeInTheDocument();
    });

    it("should have game-stats class for statistics section", () => {
      const { container } = renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set()}
          totalTime={60}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      expect(container.querySelector(".game-stats")).toBeInTheDocument();
    });

    it("should have btn-primary class on Play Again button", () => {
      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set()}
          totalTime={60}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      const playAgainButton = screen.getByRole("button", { name: "Play Again" });
      expect(playAgainButton).toHaveClass("btn-primary");
    });

    it("should have btn-secondary class on Close button", () => {
      renderWithLanguageProvider(
        <EndGameModal
          guessedCountries={new Set()}
          totalTime={60}
          onClose={mockOnClose}
          onRestart={mockOnRestart}
        />
      );

      const closeButton = screen.getByRole("button", { name: "Close" });
      expect(closeButton).toHaveClass("btn-secondary");
    });
  });
});
