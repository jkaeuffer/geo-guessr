import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GameModeSelector from "../GameModeSelector";
import { LanguageProvider } from "../../i18n/LanguageContext";

const renderWithLanguageProvider = (component) => {
  return render(<LanguageProvider>{component}</LanguageProvider>);
};

describe("GameModeSelector Component", () => {
  describe("initial render", () => {
    it("should render trigger button with current mode", () => {
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="classic" onModeChange={onModeChange} />
      );

      expect(screen.getByText("🌍")).toBeInTheDocument();
      expect(screen.getByText("Classic")).toBeInTheDocument();
      expect(screen.getByText("▼")).toBeInTheDocument();
    });

    it("should not show dropdown menu initially", () => {
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="classic" onModeChange={onModeChange} />
      );

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("should display correct mode when selectedMode is timed", () => {
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="timed" onModeChange={onModeChange} />
      );

      expect(screen.getByText("⏱️")).toBeInTheDocument();
      expect(screen.getByText("Timed")).toBeInTheDocument();
    });

    it("should display correct mode when selectedMode is africa", () => {
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="africa" onModeChange={onModeChange} />
      );

      expect(screen.getByText("🦁")).toBeInTheDocument();
      expect(screen.getByText("Africa")).toBeInTheDocument();
    });
  });

  describe("dropdown interaction", () => {
    it("should open dropdown menu when trigger is clicked", async () => {
      const user = userEvent.setup();
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="classic" onModeChange={onModeChange} />
      );

      const trigger = screen.getByRole("button", { expanded: false });
      await user.click(trigger);

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("should display all 8 mode options when opened", async () => {
      const user = userEvent.setup();
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="classic" onModeChange={onModeChange} />
      );

      await user.click(screen.getByRole("button", { expanded: false }));

      expect(screen.getByRole("menuitem", { name: /Classic/i })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: /Timed/i })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: /Africa/i })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: /Asia/i })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: /Europe/i })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: /North America/i })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: /South America/i })).toBeInTheDocument();
      expect(screen.getByRole("menuitem", { name: /Oceania/i })).toBeInTheDocument();
    });

    it("should close dropdown when trigger is clicked again", async () => {
      const user = userEvent.setup();
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="classic" onModeChange={onModeChange} />
      );

      const trigger = screen.getByRole("button", { expanded: false });
      await user.click(trigger);
      expect(screen.getByRole("menu")).toBeInTheDocument();

      await user.click(trigger);
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("should have aria-expanded attribute reflecting state", async () => {
      const user = userEvent.setup();
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="classic" onModeChange={onModeChange} />
      );

      const trigger = screen.getByRole("button", { expanded: false });
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      await user.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("mode selection", () => {
    it("should call onModeChange when a mode is selected", async () => {
      const user = userEvent.setup();
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="classic" onModeChange={onModeChange} />
      );

      await user.click(screen.getByRole("button", { expanded: false }));
      await user.click(screen.getByRole("menuitem", { name: /Timed/i }));

      expect(onModeChange).toHaveBeenCalledWith("timed");
    });

    it("should close dropdown after selecting a mode", async () => {
      const user = userEvent.setup();
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="classic" onModeChange={onModeChange} />
      );

      await user.click(screen.getByRole("button", { expanded: false }));
      await user.click(screen.getByRole("menuitem", { name: /Africa/i }));

      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });

    it("should highlight currently selected mode in menu", async () => {
      const user = userEvent.setup();
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="timed" onModeChange={onModeChange} />
      );

      await user.click(screen.getByRole("button", { expanded: false }));

      const timedOption = screen.getByRole("menuitem", { name: /Timed/i });
      expect(timedOption).toHaveClass("selected");
    });
  });

  describe("outside click behavior", () => {
    it("should close dropdown when clicking outside", async () => {
      const user = userEvent.setup();
      const onModeChange = vi.fn();
      const { container } = renderWithLanguageProvider(
        <GameModeSelector selectedMode="classic" onModeChange={onModeChange} />
      );

      await user.click(screen.getByRole("button", { expanded: false }));
      expect(screen.getByRole("menu")).toBeInTheDocument();

      await user.click(container);
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  describe("keyboard navigation", () => {
    it("should close dropdown when Escape key is pressed", async () => {
      const user = userEvent.setup();
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="classic" onModeChange={onModeChange} />
      );

      await user.click(screen.getByRole("button", { expanded: false }));
      expect(screen.getByRole("menu")).toBeInTheDocument();

      await user.keyboard("{Escape}");
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });

  describe("accessibility", () => {
    it("should have proper ARIA attributes on trigger", () => {
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="classic" onModeChange={onModeChange} />
      );

      const trigger = screen.getByRole("button");
      expect(trigger).toHaveAttribute("aria-haspopup", "menu");
      expect(trigger).toHaveAttribute("aria-expanded");
    });

    it("should have role=menu on dropdown", async () => {
      const user = userEvent.setup();
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="classic" onModeChange={onModeChange} />
      );

      await user.click(screen.getByRole("button", { expanded: false }));

      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("should have role=menuitem on all options", async () => {
      const user = userEvent.setup();
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="classic" onModeChange={onModeChange} />
      );

      await user.click(screen.getByRole("button", { expanded: false }));

      const menuItems = screen.getAllByRole("menuitem");
      expect(menuItems).toHaveLength(9); // Updated for US States mode
    });
  });

  describe("visual feedback", () => {
    it("should add 'open' class to trigger when dropdown is open", async () => {
      const user = userEvent.setup();
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="classic" onModeChange={onModeChange} />
      );

      const trigger = screen.getByRole("button");
      expect(trigger).not.toHaveClass("open");

      await user.click(trigger);
      expect(trigger).toHaveClass("open");
    });

    it("should remove 'open' class when dropdown is closed", async () => {
      const user = userEvent.setup();
      const onModeChange = vi.fn();
      renderWithLanguageProvider(
        <GameModeSelector selectedMode="classic" onModeChange={onModeChange} />
      );

      const trigger = screen.getByRole("button");
      await user.click(trigger);
      expect(trigger).toHaveClass("open");

      await user.click(trigger);
      expect(trigger).not.toHaveClass("open");
    });
  });
});
