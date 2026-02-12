import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import StateHintModal from "../StateHintModal";
import { LanguageProvider } from "../../i18n/LanguageContext";

const renderWithLanguageProvider = (component) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe("StateHintModal", () => {
  it("should render state hint modal with state information", () => {
    const onClose = vi.fn();
    renderWithLanguageProvider(
      <StateHintModal stateCode="CA" onClose={onClose} />
    );

    expect(screen.getByText(/State Hint/i)).toBeInTheDocument();
    expect(screen.getByText(/Sacramento/i)).toBeInTheDocument();
    expect(screen.getByText(/West/i)).toBeInTheDocument();
  });

  it("should render state hint modal for Texas", () => {
    const onClose = vi.fn();
    renderWithLanguageProvider(
      <StateHintModal stateCode="TX" onClose={onClose} />
    );

    expect(screen.getByText(/Austin/i)).toBeInTheDocument();
    expect(screen.getByText(/Southwest/i)).toBeInTheDocument();
  });

  it("should not render if state code is invalid", () => {
    const onClose = vi.fn();
    const { container } = renderWithLanguageProvider(
      <StateHintModal stateCode="ZZ" onClose={onClose} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("should call onClose when close button is clicked", () => {
    const onClose = vi.fn();
    renderWithLanguageProvider(
      <StateHintModal stateCode="NY" onClose={onClose} />
    );

    const closeButton = screen.getByText("×");
    closeButton.click();

    expect(onClose).toHaveBeenCalled();
  });
});
