import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CountryHintModal from "../CountryHintModal";
import { LanguageProvider } from "../../i18n/LanguageContext";

const renderWithLanguageProvider = (component) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe("CountryHintModal Component", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe("rendering", () => {
    it("should render hint modal for valid country code", () => {
      renderWithLanguageProvider(
        <CountryHintModal countryCode="FR" onClose={mockOnClose} />
      );

      expect(screen.getByText("Country Hint")).toBeInTheDocument();
    });

    it("should render nothing for invalid country code", () => {
      const { container } = renderWithLanguageProvider(
        <CountryHintModal countryCode="XX" onClose={mockOnClose} />
      );

      expect(container.innerHTML).toBe("");
    });

    it("should display country flag image", () => {
      renderWithLanguageProvider(
        <CountryHintModal countryCode="FR" onClose={mockOnClose} />
      );

      const flagImage = screen.getByAltText("Country flag");
      expect(flagImage).toBeInTheDocument();
      expect(flagImage).toHaveAttribute(
        "src",
        "https://flagcdn.com/w160/fr.png"
      );
    });

    it("should display capital city", () => {
      renderWithLanguageProvider(
        <CountryHintModal countryCode="FR" onClose={mockOnClose} />
      );

      expect(screen.getByText("Capital:")).toBeInTheDocument();
      expect(screen.getByText("Paris")).toBeInTheDocument();
    });

    it("should display continent", () => {
      renderWithLanguageProvider(
        <CountryHintModal countryCode="FR" onClose={mockOnClose} />
      );

      expect(screen.getByText("Continent:")).toBeInTheDocument();
      expect(screen.getByText("Europe")).toBeInTheDocument();
    });

    it("should display hint note", () => {
      renderWithLanguageProvider(
        <CountryHintModal countryCode="FR" onClose={mockOnClose} />
      );

      expect(
        screen.getByText("Can you guess this country?")
      ).toBeInTheDocument();
    });
  });

  describe("close functionality", () => {
    it("should call onClose when close button is clicked", () => {
      renderWithLanguageProvider(
        <CountryHintModal countryCode="FR" onClose={mockOnClose} />
      );

      const closeButton = screen.getByText("×");
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when overlay is clicked", () => {
      const { container } = renderWithLanguageProvider(
        <CountryHintModal countryCode="FR" onClose={mockOnClose} />
      );

      const overlay = container.querySelector(".modal-overlay");
      fireEvent.click(overlay);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("should NOT call onClose when modal content is clicked", () => {
      renderWithLanguageProvider(
        <CountryHintModal countryCode="FR" onClose={mockOnClose} />
      );

      const modalContent = document.querySelector(".modal-content");
      fireEvent.click(modalContent);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe("different countries", () => {
    it("should display correct info for Japan", () => {
      renderWithLanguageProvider(
        <CountryHintModal countryCode="JP" onClose={mockOnClose} />
      );

      const flagImage = screen.getByAltText("Country flag");
      expect(flagImage).toHaveAttribute(
        "src",
        "https://flagcdn.com/w160/jp.png"
      );
      expect(screen.getByText("Tokyo")).toBeInTheDocument();
      expect(screen.getByText("Asia")).toBeInTheDocument();
    });

    it("should display correct info for Brazil", () => {
      renderWithLanguageProvider(
        <CountryHintModal countryCode="BR" onClose={mockOnClose} />
      );

      const flagImage = screen.getByAltText("Country flag");
      expect(flagImage).toHaveAttribute(
        "src",
        "https://flagcdn.com/w160/br.png"
      );
      expect(screen.getByText("Brasília")).toBeInTheDocument();
      expect(screen.getByText("South America")).toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should have modal-overlay class", () => {
      const { container } = renderWithLanguageProvider(
        <CountryHintModal countryCode="FR" onClose={mockOnClose} />
      );

      expect(container.querySelector(".modal-overlay")).toBeInTheDocument();
    });

    it("should have hint-modal class on content", () => {
      const { container } = renderWithLanguageProvider(
        <CountryHintModal countryCode="FR" onClose={mockOnClose} />
      );

      expect(container.querySelector(".hint-modal")).toBeInTheDocument();
    });

    it("should have country-flag class on image", () => {
      const { container } = renderWithLanguageProvider(
        <CountryHintModal countryCode="FR" onClose={mockOnClose} />
      );

      expect(container.querySelector(".country-flag")).toBeInTheDocument();
    });
  });
});
