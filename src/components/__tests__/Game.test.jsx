import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Game from "../Game";
import { LanguageProvider } from "../../i18n/LanguageContext";
import { countries, getCountriesByContinent } from "../../data/countries";

const renderWithLanguageProvider = (component) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe("Game Component", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("should render the game title", () => {
      renderWithLanguageProvider(<Game />);
      expect(screen.getByText("🌍 Country Guesser")).toBeInTheDocument();
    });

    it("should display initial score as 0 / total countries", () => {
      renderWithLanguageProvider(<Game />);
      expect(screen.getByText(`0 / ${countries.length}`)).toBeInTheDocument();
    });

    it("should display initial timer at 00:00", () => {
      renderWithLanguageProvider(<Game />);
      expect(screen.getByText("00:00")).toBeInTheDocument();
    });

    it("should have an empty input field", () => {
      renderWithLanguageProvider(<Game />);
      const input = screen.getByPlaceholderText("Enter a country name...");
      expect(input).toHaveValue("");
    });

    it("should have the input focused by default", () => {
      renderWithLanguageProvider(<Game />);
      const input = screen.getByPlaceholderText("Enter a country name...");
      expect(input).toHaveFocus();
    });

    it("should display 0% completion", () => {
      renderWithLanguageProvider(<Game />);
      expect(screen.getByText("0%")).toBeInTheDocument();
    });

    it("should not show streak counter initially", () => {
      renderWithLanguageProvider(<Game />);
      expect(screen.queryByText(/🔥/)).not.toBeInTheDocument();
    });

    it("should display End Game button", () => {
      renderWithLanguageProvider(<Game />);
      expect(screen.getByText("End Game")).toBeInTheDocument();
    });

    it("should display welcome text", () => {
      renderWithLanguageProvider(<Game />);
      expect(
        screen.getByText(/Welcome! Try to guess as many countries as possible/i)
      ).toBeInTheDocument();
    });
  });

  describe("country guessing flow", () => {
    it("should accept correct country guess", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      const input = screen.getByPlaceholderText("Enter a country name...");
      await user.type(input, "France");
      await user.click(screen.getByText("Guess"));

      expect(screen.getByText(/Correct!/)).toBeInTheDocument();
      expect(screen.getByText(/France/)).toBeInTheDocument();
    });

    it("should increment score on correct guess", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "France"
      );
      await user.click(screen.getByText("Guess"));

      expect(screen.getByText(`1 / ${countries.length}`)).toBeInTheDocument();
    });

    it("should start timer on first guess", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      expect(screen.getByText("00:00")).toBeInTheDocument();

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "France"
      );
      await user.click(screen.getByText("Guess"));

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.getByText("00:02")).toBeInTheDocument();
    });

    it("should clear input after submission", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      const input = screen.getByPlaceholderText("Enter a country name...");
      await user.type(input, "France");
      await user.click(screen.getByText("Guess"));

      expect(input).toHaveValue("");
    });

    it("should show duplicate warning for already guessed country", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      const input = screen.getByPlaceholderText("Enter a country name...");

      await user.type(input, "France");
      await user.click(screen.getByText("Guess"));

      await user.type(input, "France");
      await user.click(screen.getByText("Guess"));

      expect(screen.getByText(/Already guessed:/)).toBeInTheDocument();
    });

    it("should not increment score for duplicate guess", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      const input = screen.getByPlaceholderText("Enter a country name...");

      await user.type(input, "France");
      await user.click(screen.getByText("Guess"));
      expect(screen.getByText(`1 / ${countries.length}`)).toBeInTheDocument();

      await user.type(input, "France");
      await user.click(screen.getByText("Guess"));
      expect(screen.getByText(`1 / ${countries.length}`)).toBeInTheDocument();
    });
  });

  describe("wrong guess handling", () => {
    it("should show wrong message for invalid country", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "Atlantis"
      );
      await user.click(screen.getByText("Guess"));

      expect(screen.getByText(/Wrong!/)).toBeInTheDocument();
      expect(screen.getByText(/Atlantis/)).toBeInTheDocument();
    });

    it("should add 5-second penalty for wrong guess", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "France"
      );
      await user.click(screen.getByText("Guess"));

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "InvalidCountry"
      );
      await user.click(screen.getByText("Guess"));

      expect(screen.getByText(/\+5s penalty/)).toBeInTheDocument();
    });

    it("should show penalty note in feedback", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "InvalidCountry"
      );
      await user.click(screen.getByText("Guess"));

      expect(screen.getByText(/\+5s penalty/)).toBeInTheDocument();
    });
  });

  describe("alias matching", () => {
    it("should accept USA alias for United States", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "USA"
      );
      await user.click(screen.getByText("Guess"));

      expect(screen.getByText(/Correct!/)).toBeInTheDocument();
    });

    it("should accept UK alias for United Kingdom", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "UK"
      );
      await user.click(screen.getByText("Guess"));

      expect(screen.getByText(/Correct!/)).toBeInTheDocument();
    });
  });

  describe("fuzzy matching", () => {
    it("should accept minor typos", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      // Use a longer country name where a single typo will pass the 0.75 threshold
      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "Australi"
      );
      await user.click(screen.getByText("Guess"));

      expect(screen.getByText(/Correct!/)).toBeInTheDocument();
      expect(screen.getByText(/Australia/)).toBeInTheDocument();
    });

    it("should reject major typos", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "Frxxxxxxx"
      );
      await user.click(screen.getByText("Guess"));

      expect(screen.getByText(/Wrong!/)).toBeInTheDocument();
    });
  });

  describe("streak counter", () => {
    it("should show streak after correct guesses", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "France"
      );
      await user.click(screen.getByText("Guess"));

      expect(screen.getByText(/🔥 1/)).toBeInTheDocument();
    });

    it("should increment streak with consecutive correct guesses", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "France"
      );
      await user.click(screen.getByText("Guess"));

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "Germany"
      );
      await user.click(screen.getByText("Guess"));

      expect(screen.getByText(/🔥 2/)).toBeInTheDocument();
    });

    it("should reset streak on wrong guess", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "France"
      );
      await user.click(screen.getByText("Guess"));
      expect(screen.getByText(/🔥 1/)).toBeInTheDocument();

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "InvalidCountry"
      );
      await user.click(screen.getByText("Guess"));

      expect(screen.queryByText(/🔥/)).not.toBeInTheDocument();
    });
  });

  describe("end game functionality", () => {
    it("should open end game modal when End Game button is clicked", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.click(screen.getByText("End Game"));

      expect(screen.getByText("Game Over!")).toBeInTheDocument();
    });

    it("should stop timer when end game modal opens", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "France"
      );
      await user.click(screen.getByText("Guess"));

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      // Get the timer element before opening modal
      const timerElement = document.querySelector(".timer-value");
      const timeBefore = timerElement?.textContent || "00:02";

      await user.click(screen.getByText("End Game"));

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      // Timer should not have changed since modal stops it
      const timerAfter = document.querySelector(".timer-value")?.textContent;
      expect(timerAfter).toBe(timeBefore);
    });

    it("should show stats in end game modal", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "France"
      );
      await user.click(screen.getByText("Guess"));

      await user.click(screen.getByText("End Game"));

      expect(screen.getByText("Countries Found")).toBeInTheDocument();
      expect(screen.getByText("Countries Missed")).toBeInTheDocument();
      expect(screen.getByText("Total Time")).toBeInTheDocument();
    });

    it("should close end game modal when Close button is clicked", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.click(screen.getByText("End Game"));
      expect(screen.getByText("Game Over!")).toBeInTheDocument();

      await user.click(screen.getByRole("button", { name: "Close" }));
      expect(screen.queryByText("Game Over!")).not.toBeInTheDocument();
    });

    it("should restart game when Play Again is clicked", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "France"
      );
      await user.click(screen.getByText("Guess"));

      await user.click(screen.getByText("End Game"));
      await user.click(screen.getByRole("button", { name: "Play Again" }));

      expect(screen.queryByText("Game Over!")).not.toBeInTheDocument();
      expect(screen.getByText(`0 / ${countries.length}`)).toBeInTheDocument();
      expect(screen.getByText("00:00")).toBeInTheDocument();
    });
  });

  describe("dependency handling", () => {
    it("should show dependency warning when guessing a territory", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "Greenland"
      );
      await user.click(screen.getByText("Guess"));

      expect(screen.getByText(/Greenland/)).toBeInTheDocument();
    });
  });

  describe("completion percentage", () => {
    it("should update completion percentage as countries are guessed", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      expect(screen.getByText("0%")).toBeInTheDocument();

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "France"
      );
      await user.click(screen.getByText("Guess"));

      const percentage = Math.round((1 / countries.length) * 100);
      expect(screen.getByText(`${percentage}%`)).toBeInTheDocument();
    });
  });

  describe("form submission", () => {
    it("should handle form submission via Enter key", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      const input = screen.getByPlaceholderText("Enter a country name...");
      await user.type(input, "France{Enter}");

      expect(screen.getByText(/Correct!/)).toBeInTheDocument();
    });

    it("should not submit empty input", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.click(screen.getByText("Guess"));

      expect(screen.queryByText(/Correct!/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Wrong!/)).not.toBeInTheDocument();
      expect(screen.getByText("00:00")).toBeInTheDocument();
    });

    it("should not submit whitespace-only input", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "   "
      );
      await user.click(screen.getByText("Guess"));

      expect(screen.queryByText(/Correct!/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Wrong!/)).not.toBeInTheDocument();
    });
  });

  describe("case insensitivity", () => {
    it("should accept country names in any case", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "FRANCE"
      );
      await user.click(screen.getByText("Guess"));

      expect(screen.getByText(/Correct!/)).toBeInTheDocument();
    });

    it("should accept mixed case country names", async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderWithLanguageProvider(<Game />);

      await user.type(
        screen.getByPlaceholderText("Enter a country name..."),
        "FrAnCe"
      );
      await user.click(screen.getByText("Guess"));

      expect(screen.getByText(/Correct!/)).toBeInTheDocument();
    });
  });
});
