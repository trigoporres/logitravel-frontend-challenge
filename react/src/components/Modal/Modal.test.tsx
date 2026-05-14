import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Modal } from "./Modal";

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn();
  HTMLDialogElement.prototype.close = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("Modal", () => {
  describe("dialog control", () => {
    it("calls showModal when isOpen is true", () => {
      render(<Modal isOpen={true} onClose={vi.fn()} onAddItem={vi.fn()} />);
      expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1);
    });

    it("calls close when isOpen is false", () => {
      render(<Modal isOpen={false} onClose={vi.fn()} onAddItem={vi.fn()} />);
      expect(HTMLDialogElement.prototype.close).toHaveBeenCalledTimes(1);
    });
  });

  describe("form submission", () => {
    it("does not call onAddItem when the input is empty", () => {
      const onAddItem = vi.fn();
      render(<Modal isOpen={true} onClose={vi.fn()} onAddItem={onAddItem} />);

      fireEvent.click(screen.getByText("Add"));

      expect(onAddItem).not.toHaveBeenCalled();
    });

    it("does not call onAddItem when the input is only whitespace", () => {
      const onAddItem = vi.fn();
      render(<Modal isOpen={true} onClose={vi.fn()} onAddItem={onAddItem} />);

      fireEvent.change(screen.getByPlaceholderText("Type the text here..."), {
        target: { value: "   " },
      });
      fireEvent.click(screen.getByText("Add"));

      expect(onAddItem).not.toHaveBeenCalled();
    });

    it("calls onAddItem with the trimmed value on valid submit", () => {
      const onAddItem = vi.fn();
      render(<Modal isOpen={true} onClose={vi.fn()} onAddItem={onAddItem} />);

      fireEvent.change(screen.getByPlaceholderText("Type the text here..."), {
        target: { value: "  hello world  " },
      });
      fireEvent.click(screen.getByText("Add"));

      expect(onAddItem).toHaveBeenCalledWith("hello world");
    });

    it("calls onClose after a successful submit", () => {
      const onClose = vi.fn();
      render(<Modal isOpen={true} onClose={onClose} onAddItem={vi.fn()} />);

      fireEvent.change(screen.getByPlaceholderText("Type the text here..."), {
        target: { value: "hello" },
      });
      fireEvent.click(screen.getByText("Add"));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("does not call onClose when submit is rejected", () => {
      const onClose = vi.fn();
      render(<Modal isOpen={true} onClose={onClose} onAddItem={vi.fn()} />);

      fireEvent.click(screen.getByText("Add"));

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("error state", () => {
    it("shows an error message when submitting empty", () => {
      render(<Modal isOpen={true} onClose={vi.fn()} onAddItem={vi.fn()} />);

      fireEvent.click(screen.getByText("Add"));

      expect(screen.getByText("This field cannot be empty.")).toBeInTheDocument();
    });

    it("applies error class to the input when submitting empty", () => {
      render(<Modal isOpen={true} onClose={vi.fn()} onAddItem={vi.fn()} />);

      fireEvent.click(screen.getByText("Add"));

      expect(screen.getByPlaceholderText("Type the text here...")).toHaveClass("modal__input--error");
    });

    it("clears the error when the user starts typing", () => {
      render(<Modal isOpen={true} onClose={vi.fn()} onAddItem={vi.fn()} />);
      fireEvent.click(screen.getByText("Add"));

      fireEvent.change(screen.getByPlaceholderText("Type the text here..."), {
        target: { value: "h" },
      });

      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });

    it("clears the error when Cancel is clicked", () => {
      const onClose = vi.fn();
      render(<Modal isOpen={true} onClose={onClose} onAddItem={vi.fn()} />);
      fireEvent.click(screen.getByText("Add"));
      expect(screen.getByText("This field cannot be empty.")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Cancel"));

      expect(screen.queryByText("This field cannot be empty.")).not.toBeInTheDocument();
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("cancel", () => {
    it("calls onClose when Cancel is clicked", () => {
      const onClose = vi.fn();
      render(<Modal isOpen={true} onClose={onClose} onAddItem={vi.fn()} />);

      fireEvent.click(screen.getByText("Cancel"));

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
