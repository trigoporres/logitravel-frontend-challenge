import { useState } from "react";

export type Item = { id: string; value: string };

type HistoryEntry =
  | { type: "add" }
  | { type: "remove"; removed: { index: number; item: Item }[] };

export function useList() {
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addItem = (value: string) => {
    const newItem: Item = { id: crypto.randomUUID(), value };
    setItems((prev) => [...prev, newItem]);
    setHistory((prev) => [...prev, { type: "add" }]);
  };

  const toggleSelect = (index: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  };

  const removeByDoubleClick = (index: number) => {
    setHistory((prev) => [
      ...prev,
      { type: "remove", removed: [{ index, item: items[index] }] },
    ]);
    setItems((prev) => prev.filter((_, i) => i !== index));
    setSelected(new Set());
  };

  const removeSelected = () => {
    if (selected.size === 0) return;
    const removed = [...selected]
      .sort((a, b) => b - a)
      .map((i) => ({ index: i, item: items[i] }));
    setItems((prev) => prev.filter((_, i) => !selected.has(i)));
    setHistory((prev) => [...prev, { type: "remove", removed }]);
    setSelected(new Set());
  };

  const undo = () => {
    const last = history.at(-1);
    if (!last) return;
    if (last.type === "add") {
      setItems((p) => p.slice(0, -1));
    } else {
      setItems((p) => {
        const next = [...p];
        [...last.removed]
          .sort((a, b) => a.index - b.index)
          .forEach(({ index, item }) => next.splice(index, 0, item));
        return next;
      });
    }
    setSelected(new Set());
    setHistory((prev) => prev.slice(0, -1));
  };

  return {
    items,
    selected,
    canUndo: history.length > 0,
    addItem,
    toggleSelect,
    removeByDoubleClick,
    removeSelected,
    undo,
  };
}
