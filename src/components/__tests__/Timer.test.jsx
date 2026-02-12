import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Timer from "../Timer";

describe("Timer Component", () => {
  describe("time formatting", () => {
    it("should render 0 seconds as 00:00", () => {
      render(<Timer time={0} isRunning={false} />);
      expect(screen.getByText("00:00")).toBeInTheDocument();
    });

    it("should render single digit seconds with leading zero", () => {
      render(<Timer time={5} isRunning={false} />);
      expect(screen.getByText("00:05")).toBeInTheDocument();
    });

    it("should render minutes correctly", () => {
      render(<Timer time={65} isRunning={false} />);
      expect(screen.getByText("01:05")).toBeInTheDocument();
    });

    it("should render double digit minutes", () => {
      render(<Timer time={725} isRunning={false} />);
      expect(screen.getByText("12:05")).toBeInTheDocument();
    });

    it("should handle large times (over an hour)", () => {
      render(<Timer time={3661} isRunning={false} />);
      expect(screen.getByText("61:01")).toBeInTheDocument();
    });
  });

  describe("timer icon", () => {
    it("should render timer emoji icon", () => {
      render(<Timer time={0} isRunning={false} />);
      expect(screen.getByText("⏱️")).toBeInTheDocument();
    });
  });

  describe("running state", () => {
    it("should have running class when isRunning is true", () => {
      const { container } = render(<Timer time={0} isRunning={true} />);
      expect(container.querySelector(".timer")).toHaveClass("running");
    });

    it("should not have running class when isRunning is false", () => {
      const { container } = render(<Timer time={0} isRunning={false} />);
      expect(container.querySelector(".timer")).not.toHaveClass("running");
    });
  });

  describe("prop updates", () => {
    it("should update when time prop changes", () => {
      const { rerender } = render(<Timer time={0} isRunning={false} />);
      expect(screen.getByText("00:00")).toBeInTheDocument();

      rerender(<Timer time={30} isRunning={false} />);
      expect(screen.getByText("00:30")).toBeInTheDocument();

      rerender(<Timer time={90} isRunning={false} />);
      expect(screen.getByText("01:30")).toBeInTheDocument();
    });

    it("should update running state when prop changes", () => {
      const { container, rerender } = render(
        <Timer time={0} isRunning={false} />
      );
      expect(container.querySelector(".timer")).not.toHaveClass("running");

      rerender(<Timer time={0} isRunning={true} />);
      expect(container.querySelector(".timer")).toHaveClass("running");
    });
  });
});
