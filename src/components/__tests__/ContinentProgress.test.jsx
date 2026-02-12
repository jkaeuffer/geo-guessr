import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ContinentProgress from "../ContinentProgress";
import { LanguageProvider } from "../../i18n/LanguageContext";
import { continents, getCountriesByContinent } from "../../data/countries";

const renderWithLanguageProvider = (component) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe("ContinentProgress Component", () => {
  describe("rendering", () => {
    it("should render progress bars for all 6 continents", () => {
      renderWithLanguageProvider(
        <ContinentProgress guessedCountries={new Set()} />
      );

      expect(screen.getByText("Africa")).toBeInTheDocument();
      expect(screen.getByText("Asia")).toBeInTheDocument();
      expect(screen.getByText("Europe")).toBeInTheDocument();
      expect(screen.getByText("North America")).toBeInTheDocument();
      expect(screen.getByText("South America")).toBeInTheDocument();
      expect(screen.getByText("Oceania")).toBeInTheDocument();
    });

    it("should show 0/total for each continent when no countries guessed", () => {
      renderWithLanguageProvider(
        <ContinentProgress guessedCountries={new Set()} />
      );

      continents.forEach((continent) => {
        const total = getCountriesByContinent(continent).length;
        expect(screen.getByText(`0/${total}`)).toBeInTheDocument();
      });
    });
  });

  describe("progress calculation", () => {
    it("should update progress when countries are guessed", () => {
      const guessedCountries = new Set(["FR", "DE", "IT"]);
      renderWithLanguageProvider(
        <ContinentProgress guessedCountries={guessedCountries} />
      );

      const europeTotal = getCountriesByContinent("Europe").length;
      expect(screen.getByText(`3/${europeTotal}`)).toBeInTheDocument();
    });

    it("should show correct progress for multiple continents", () => {
      const guessedCountries = new Set([
        "FR",
        "DE", // Europe
        "US",
        "CA", // North America
        "JP", // Asia
      ]);
      renderWithLanguageProvider(
        <ContinentProgress guessedCountries={guessedCountries} />
      );

      const europeTotal = getCountriesByContinent("Europe").length;
      const northAmericaTotal =
        getCountriesByContinent("North America").length;
      const asiaTotal = getCountriesByContinent("Asia").length;

      expect(screen.getByText(`2/${europeTotal}`)).toBeInTheDocument();
      expect(screen.getByText(`2/${northAmericaTotal}`)).toBeInTheDocument();
      expect(screen.getByText(`1/${asiaTotal}`)).toBeInTheDocument();
    });

    it("should correctly handle all countries in a continent guessed", () => {
      const oceaniaCountries = getCountriesByContinent("Oceania");
      const guessedCountries = new Set(oceaniaCountries.map((c) => c.code));

      renderWithLanguageProvider(
        <ContinentProgress guessedCountries={guessedCountries} />
      );

      expect(
        screen.getByText(`${oceaniaCountries.length}/${oceaniaCountries.length}`)
      ).toBeInTheDocument();
    });
  });

  describe("trophy emoji for completed continents", () => {
    it("should show trophy emoji when continent is complete", () => {
      const oceaniaCountries = getCountriesByContinent("Oceania");
      const guessedCountries = new Set(oceaniaCountries.map((c) => c.code));

      renderWithLanguageProvider(
        <ContinentProgress guessedCountries={guessedCountries} />
      );

      expect(screen.getByText(/Oceania.*🏆/)).toBeInTheDocument();
    });

    it("should not show trophy emoji for incomplete continent", () => {
      renderWithLanguageProvider(
        <ContinentProgress guessedCountries={new Set(["AU"])} />
      );

      expect(screen.queryByText(/Oceania.*🏆/)).not.toBeInTheDocument();
      expect(screen.getByText("Oceania")).toBeInTheDocument();
    });

    it("should show trophy for multiple completed continents", () => {
      const oceaniaCountries = getCountriesByContinent("Oceania");
      const southAmericaCountries = getCountriesByContinent("South America");
      const guessedCountries = new Set([
        ...oceaniaCountries.map((c) => c.code),
        ...southAmericaCountries.map((c) => c.code),
      ]);

      renderWithLanguageProvider(
        <ContinentProgress guessedCountries={guessedCountries} />
      );

      expect(screen.getByText(/Oceania.*🏆/)).toBeInTheDocument();
      expect(screen.getByText(/South America.*🏆/)).toBeInTheDocument();
    });
  });

  describe("progress bar styling", () => {
    it("should have progress-bar and progress-fill elements", () => {
      const { container } = renderWithLanguageProvider(
        <ContinentProgress guessedCountries={new Set()} />
      );

      expect(container.querySelectorAll(".progress-bar")).toHaveLength(6);
      expect(container.querySelectorAll(".progress-fill")).toHaveLength(6);
    });

    it("should set progress fill width based on percentage", () => {
      const oceaniaCountries = getCountriesByContinent("Oceania");
      const halfOceania = oceaniaCountries.slice(
        0,
        Math.floor(oceaniaCountries.length / 2)
      );
      const guessedCountries = new Set(halfOceania.map((c) => c.code));

      const { container } = renderWithLanguageProvider(
        <ContinentProgress guessedCountries={guessedCountries} />
      );

      const progressFills = container.querySelectorAll(".progress-fill");
      const oceaniaFill = Array.from(progressFills).find((el) => {
        const style = el.getAttribute("style");
        return style && parseFloat(style.match(/width:\s*(\d+)/)?.[1]) > 0;
      });

      expect(oceaniaFill).toBeDefined();
    });
  });

  describe("container structure", () => {
    it("should have continent-progress-container class", () => {
      const { container } = renderWithLanguageProvider(
        <ContinentProgress guessedCountries={new Set()} />
      );

      expect(
        container.querySelector(".continent-progress-container")
      ).toBeInTheDocument();
    });

    it("should have continent-progress class for each continent", () => {
      const { container } = renderWithLanguageProvider(
        <ContinentProgress guessedCountries={new Set()} />
      );

      expect(container.querySelectorAll(".continent-progress")).toHaveLength(6);
    });
  });
});
