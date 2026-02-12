import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LanguageProvider, useLanguage } from "../LanguageContext";

const TestConsumer = () => {
  const {
    language,
    setLanguage,
    t,
    getCountryName,
    getCountryCapital,
    getContinentName,
  } = useLanguage();

  return (
    <div>
      <div data-testid="language">{language}</div>
      <div data-testid="app-title">{t.appTitle}</div>
      <div data-testid="country-name-fr">{getCountryName("FR")}</div>
      <div data-testid="country-name-de">{getCountryName("DE")}</div>
      <div data-testid="country-capital-fr">{getCountryCapital("FR")}</div>
      <div data-testid="continent-europe">{getContinentName("Europe")}</div>
      <div data-testid="continent-africa">{getContinentName("Africa")}</div>
      <button onClick={() => setLanguage("fr")} data-testid="switch-to-fr">
        French
      </button>
      <button onClick={() => setLanguage("en")} data-testid="switch-to-en">
        English
      </button>
    </div>
  );
};

describe("LanguageContext", () => {
  describe("LanguageProvider", () => {
    it("should provide language context to children", () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );

      expect(screen.getByTestId("language")).toHaveTextContent("en");
    });

    it("should default to English language", () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );

      expect(screen.getByTestId("language")).toHaveTextContent("en");
      expect(screen.getByTestId("app-title")).toHaveTextContent(
        "🌍 Country Guesser"
      );
    });
  });

  describe("setLanguage", () => {
    it("should change language to French", () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );

      fireEvent.click(screen.getByTestId("switch-to-fr"));

      expect(screen.getByTestId("language")).toHaveTextContent("fr");
    });

    it("should change language back to English", () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );

      fireEvent.click(screen.getByTestId("switch-to-fr"));
      fireEvent.click(screen.getByTestId("switch-to-en"));

      expect(screen.getByTestId("language")).toHaveTextContent("en");
    });
  });

  describe("translations (t)", () => {
    it("should return English translations by default", () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );

      expect(screen.getByTestId("app-title")).toHaveTextContent(
        "🌍 Country Guesser"
      );
    });

    it("should return French translations when language is French", () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );

      fireEvent.click(screen.getByTestId("switch-to-fr"));

      // Verify the text changed to French (contains French phrase - "Devine" or "Pays")
      const appTitle = screen.getByTestId("app-title");
      expect(appTitle.textContent).toContain("Pays");
    });
  });

  describe("getCountryName", () => {
    it("should return English country name by default", () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );

      expect(screen.getByTestId("country-name-fr")).toHaveTextContent("France");
      expect(screen.getByTestId("country-name-de")).toHaveTextContent("Germany");
    });

    it("should return French country name when language is French", () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );

      fireEvent.click(screen.getByTestId("switch-to-fr"));

      expect(screen.getByTestId("country-name-fr")).toHaveTextContent("France");
      expect(screen.getByTestId("country-name-de")).toHaveTextContent(
        "Allemagne"
      );
    });
  });

  describe("getCountryCapital", () => {
    it("should return English capital by default", () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );

      expect(screen.getByTestId("country-capital-fr")).toHaveTextContent(
        "Paris"
      );
    });

    it("should return French capital when language is French", () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );

      fireEvent.click(screen.getByTestId("switch-to-fr"));

      expect(screen.getByTestId("country-capital-fr")).toHaveTextContent(
        "Paris"
      );
    });
  });

  describe("getContinentName", () => {
    it("should return English continent name by default", () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );

      expect(screen.getByTestId("continent-europe")).toHaveTextContent("Europe");
      expect(screen.getByTestId("continent-africa")).toHaveTextContent("Africa");
    });

    it("should return French continent name when language is French", () => {
      render(
        <LanguageProvider>
          <TestConsumer />
        </LanguageProvider>
      );

      fireEvent.click(screen.getByTestId("switch-to-fr"));

      expect(screen.getByTestId("continent-europe")).toHaveTextContent("Europe");
      expect(screen.getByTestId("continent-africa")).toHaveTextContent(
        "Afrique"
      );
    });
  });

  describe("useLanguage hook", () => {
    it("should throw error when used outside LanguageProvider", () => {
      const consoleError = console.error;
      console.error = () => {};

      expect(() => render(<TestConsumer />)).toThrow(
        "useLanguage must be used within a LanguageProvider"
      );

      console.error = consoleError;
    });
  });
});
