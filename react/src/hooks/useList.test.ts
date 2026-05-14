import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useList } from "./useList";

describe("useList", () => {
  describe("initial state", () => {
    it("starts with empty items, no selection, and undo disabled", () => {
      const { result } = renderHook(() => useList());

      expect(result.current.items).toEqual([]);
      expect(result.current.selected).toEqual(new Set());
      expect(result.current.canUndo).toBe(false);
    });
  });

  describe("undo", () => {
    it("does nothing when history is empty", () => {
      const { result } = renderHook(() => useList());

      act(() => result.current.undo());

      expect(result.current.items).toEqual([]);
    });

    it("reverses an addItem", () => {
      const { result } = renderHook(() => useList());
      act(() => result.current.addItem("apple"));

      act(() => result.current.undo());

      expect(result.current.items).toEqual([]);
      expect(result.current.canUndo).toBe(false);
    });

    it("reverses a removeByDoubleClick, restoring the item at its original index", () => {
      const { result } = renderHook(() => useList());
      act(() => {
        result.current.addItem("apple");
        result.current.addItem("banana");
        result.current.addItem("cherry");
      });
      act(() => result.current.removeByDoubleClick(1));
      expect(result.current.items).toEqual(["apple", "cherry"]);

      act(() => result.current.undo());

      expect(result.current.items).toEqual(["apple", "banana", "cherry"]);
    });

    it("reverses a removeSelected, restoring multiple items at their original indices", () => {
      const { result } = renderHook(() => useList());
      act(() => {
        result.current.addItem("apple");
        result.current.addItem("banana");
        result.current.addItem("cherry");
        result.current.toggleSelect(0);
        result.current.toggleSelect(2);
      });
      act(() => result.current.removeSelected());
      expect(result.current.items).toEqual(["banana"]);

      act(() => result.current.undo());

      expect(result.current.items).toEqual(["apple", "banana", "cherry"]);
    });

    it("clears selection when undoing", () => {
      const { result } = renderHook(() => useList());
      act(() => {
        result.current.addItem("apple");
        result.current.addItem("banana");
        result.current.toggleSelect(0);
      });

      act(() => result.current.undo());

      expect(result.current.selected).toEqual(new Set());
    });

    it("supports multiple consecutive undos", () => {
      const { result } = renderHook(() => useList());
      act(() => {
        result.current.addItem("apple");
        result.current.addItem("banana");
      });

      act(() => result.current.undo());
      expect(result.current.items).toEqual(["apple"]);

      act(() => result.current.undo());
      expect(result.current.items).toEqual([]);
      expect(result.current.canUndo).toBe(false);
    });
  });

  describe("removeSelected", () => {
    it("does nothing when nothing is selected", () => {
      const { result } = renderHook(() => useList());
      act(() => result.current.addItem("apple"));

      act(() => result.current.removeSelected());

      expect(result.current.items).toEqual(["apple"]);
      expect(result.current.canUndo).toBe(true); // only the add is in history
    });

    it("removes all selected items", () => {
      const { result } = renderHook(() => useList());
      act(() => {
        result.current.addItem("apple");
        result.current.addItem("banana");
        result.current.addItem("cherry");
        result.current.toggleSelect(0);
        result.current.toggleSelect(2);
      });

      act(() => result.current.removeSelected());

      expect(result.current.items).toEqual(["banana"]);
    });

    it("clears selection after removing", () => {
      const { result } = renderHook(() => useList());
      act(() => {
        result.current.addItem("apple");
        result.current.toggleSelect(0);
      });

      act(() => result.current.removeSelected());

      expect(result.current.selected).toEqual(new Set());
    });
  });

  describe("removeByDoubleClick", () => {
    it("removes the item at the given index", () => {
      const { result } = renderHook(() => useList());
      act(() => {
        result.current.addItem("apple");
        result.current.addItem("banana");
      });

      act(() => result.current.removeByDoubleClick(0));

      expect(result.current.items).toEqual(["banana"]);
    });

    it("clears the selection after removal", () => {
      const { result } = renderHook(() => useList());
      act(() => {
        result.current.addItem("apple");
        result.current.addItem("banana");
        result.current.toggleSelect(1);
      });

      act(() => result.current.removeByDoubleClick(0));

      expect(result.current.selected).toEqual(new Set());
    });

  });

  describe("toggleSelect", () => {
    it("selects an item by index", () => {
      const { result } = renderHook(() => useList());
      act(() => result.current.addItem("apple"));

      act(() => result.current.toggleSelect(0));

      expect(result.current.selected).toEqual(new Set([0]));
    });

    it("deselects an already-selected item", () => {
      const { result } = renderHook(() => useList());
      act(() => result.current.addItem("apple"));
      act(() => result.current.toggleSelect(0));

      act(() => result.current.toggleSelect(0));

      expect(result.current.selected).toEqual(new Set());
    });

    it("can select multiple items independently", () => {
      const { result } = renderHook(() => useList());
      act(() => {
        result.current.addItem("apple");
        result.current.addItem("banana");
      });

      act(() => {
        result.current.toggleSelect(0);
        result.current.toggleSelect(1);
      });

      expect(result.current.selected).toEqual(new Set([0, 1]));
    });
  });

  describe("addItem", () => {
    it("appends the value to items and enables undo", () => {
      const { result } = renderHook(() => useList());

      act(() => result.current.addItem("apple"));

      expect(result.current.items).toEqual(["apple"]);
      expect(result.current.canUndo).toBe(true);
    });

    it("appends multiple items in order", () => {
      const { result } = renderHook(() => useList());

      act(() => {
        result.current.addItem("apple");
        result.current.addItem("banana");
      });

      expect(result.current.items).toEqual(["apple", "banana"]);
    });
  });
});
