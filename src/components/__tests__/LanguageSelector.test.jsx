import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import LanguageSelector from "../LanguageSelector";
import { LanguageProvider } from "../../i18n/LanguageContext";

const renderWithLanguageProvider = (component) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe("LanguageSelector Component", () => {
  describe("rendering", () => {
    it("should render two language buttons", () => {
      renderWithLanguageProvider(<LanguageSelector />);

      const buttons = screen.getAllByRole("button");
      expect(buttons).toHaveLength(2);
    });

    it("should render English flag button", () => {
      renderWithLanguageProvider(<LanguageSelector />);

      const englishButton = screen.getByTitle("English");
      expect(englishButton).toBeInTheDocument();
      expect(englishButton).toHaveTextContent("🇬🇧");
    });

    it("should render French flag button", () => {
      renderWithLanguageProvider(<LanguageSelector />);

      const frenchButton = screen.getByTitle("Français");
      expect(frenchButton).toBeInTheDocument();
      expect(frenchButton).toHaveTextContent("🇫🇷");
    });
  });

  describe("initial state", () => {
    it("should have English as default active language", () => {
      renderWithLanguageProvider(<LanguageSelector />);

      const englishButton = screen.getByTitle("English");
      expect(englishButton).toHaveClass("active");

      const frenchButton = screen.getByTitle("Français");
      expect(frenchButton).not.toHaveClass("active");
    });
  });

  describe("language switching", () => {
    it("should switch to French when French button is clicked", () => {
      renderWithLanguageProvider(<LanguageSelector />);

      const frenchButton = screen.getByTitle("Français");
      fireEvent.click(frenchButton);

      expect(frenchButton).toHaveClass("active");
      expect(screen.getByTitle("English")).not.toHaveClass("active");
    });

    it("should switch back to English when English button is clicked", () => {
      renderWithLanguageProvider(<LanguageSelector />);

      // First switch to French
      fireEvent.click(screen.getByTitle("Français"));

      // Then switch back to English
      fireEvent.click(screen.getByTitle("English"));

      expect(screen.getByTitle("English")).toHaveClass("active");
      expect(screen.getByTitle("Français")).not.toHaveClass("active");
    });

    it("should keep current language active when same button clicked", () => {
      renderWithLanguageProvider(<LanguageSelector />);

      const englishButton = screen.getByTitle("English");
      fireEvent.click(englishButton);

      expect(englishButton).toHaveClass("active");
    });
  });

  describe("styling", () => {
    it("should have language-selector class on container", () => {
      const { container } = renderWithLanguageProvider(<LanguageSelector />);

      expect(container.querySelector(".language-selector")).toBeInTheDocument();
    });

    it("should have lang-btn class on buttons", () => {
      const { container } = renderWithLanguageProvider(<LanguageSelector />);

      const buttons = container.querySelectorAll(".lang-btn");
      expect(buttons).toHaveLength(2);
    });

    it("should have flag-icon class on flag spans", () => {
      const { container } = renderWithLanguageProvider(<LanguageSelector />);

      const flagIcons = container.querySelectorAll(".flag-icon");
      expect(flagIcons).toHaveLength(2);
    });
  });
});
