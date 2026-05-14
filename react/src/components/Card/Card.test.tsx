import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Card } from "./Card";
import type { Item } from "../../hooks/useList";

const makeItems = (...values: string[]): Item[] =>
  values.map((value, i) => ({ id: String(i), value }));

const defaultProps = {
  items: makeItems("apple", "banana"),
  selected: new Set<number>(),
  canUndo: false,
  onOpenModal: vi.fn(),
  onToggleSelect: vi.fn(),
  onDoubleClickItem: vi.fn(),
  onRemoveSelected: vi.fn(),
  onUndo: vi.fn(),
};

describe("Card", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders all items", () => {
      render(<Card {...defaultProps} />);
      expect(screen.getByText("apple")).toBeInTheDocument();
      expect(screen.getByText("banana")).toBeInTheDocument();
    });

    it("applies active class only to selected items", () => {
      render(<Card {...defaultProps} selected={new Set([0])} />);
      expect(screen.getByText("apple")).toHaveClass("list-item--active");
      expect(screen.getByText("banana")).not.toHaveClass("list-item--active");
    });
  });

  describe("button states", () => {
    it("disables Delete when nothing is selected", () => {
      render(<Card {...defaultProps} selected={new Set()} />);
      expect(screen.getByText("Delete")).toBeDisabled();
    });

    it("enables Delete when at least one item is selected", () => {
      render(<Card {...defaultProps} selected={new Set([1])} />);
      expect(screen.getByText("Delete")).not.toBeDisabled();
    });

    it("disables Undo when canUndo is false", () => {
      render(<Card {...defaultProps} canUndo={false} />);
      expect(screen.getByRole("button", { name: "Undo" })).toBeDisabled();
    });

    it("enables Undo when canUndo is true", () => {
      render(<Card {...defaultProps} canUndo={true} />);
      expect(screen.getByRole("button", { name: "Undo" })).not.toBeDisabled();
    });
  });

  describe("button callbacks", () => {
    it("calls onOpenModal when Add is clicked", () => {
      const onOpenModal = vi.fn();
      render(<Card {...defaultProps} onOpenModal={onOpenModal} />);
      fireEvent.click(screen.getByText("Add"));
      expect(onOpenModal).toHaveBeenCalledTimes(1);
    });

    it("calls onRemoveSelected when Delete is clicked", () => {
      const onRemoveSelected = vi.fn();
      render(<Card {...defaultProps} selected={new Set([0])} onRemoveSelected={onRemoveSelected} />);
      fireEvent.click(screen.getByText("Delete"));
      expect(onRemoveSelected).toHaveBeenCalledTimes(1);
    });

    it("calls onUndo when Undo is clicked", () => {
      const onUndo = vi.fn();
      render(<Card {...defaultProps} canUndo={true} onUndo={onUndo} />);
      fireEvent.click(screen.getByRole("button", { name: "Undo" }));
      expect(onUndo).toHaveBeenCalledTimes(1);
    });
  });

  describe("single click — 250ms timer", () => {
    it("does not call onToggleSelect before the delay", () => {
      const onToggleSelect = vi.fn();
      render(<Card {...defaultProps} onToggleSelect={onToggleSelect} />);

      fireEvent.click(screen.getByText("apple"));
      vi.advanceTimersByTime(249);

      expect(onToggleSelect).not.toHaveBeenCalled();
    });

    it("calls onToggleSelect with the item index after 250ms", () => {
      const onToggleSelect = vi.fn();
      render(<Card {...defaultProps} onToggleSelect={onToggleSelect} />);

      fireEvent.click(screen.getByText("apple"));
      vi.advanceTimersByTime(250);

      expect(onToggleSelect).toHaveBeenCalledTimes(1);
      expect(onToggleSelect).toHaveBeenCalledWith(0);
    });

    it("calls onToggleSelect with the correct index for the second item", () => {
      const onToggleSelect = vi.fn();
      render(<Card {...defaultProps} onToggleSelect={onToggleSelect} />);

      fireEvent.click(screen.getByText("banana"));
      vi.advanceTimersByTime(250);

      expect(onToggleSelect).toHaveBeenCalledWith(1);
    });
  });

  describe("double click", () => {
    it("calls onDoubleClickItem immediately without calling onToggleSelect", () => {
      const onToggleSelect = vi.fn();
      const onDoubleClickItem = vi.fn();
      render(<Card {...defaultProps} onToggleSelect={onToggleSelect} onDoubleClickItem={onDoubleClickItem} />);

      // Browser fires click → click → dblclick on a double click
      fireEvent.click(screen.getByText("apple"));
      fireEvent.click(screen.getByText("apple"));
      fireEvent.dblClick(screen.getByText("apple"));
      vi.runAllTimers();

      expect(onDoubleClickItem).toHaveBeenCalledTimes(1);
      expect(onDoubleClickItem).toHaveBeenCalledWith(0);
      expect(onToggleSelect).not.toHaveBeenCalled();
    });
  });
});
