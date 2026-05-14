import { useState } from "react";

type HistoryEntry =
  | { type: "add" }
  | { type: "remove"; removed: { index: number; value: string }[] };

export function useList() {
  const [items, setItems] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const addItem = (value: string) => {
    setItems((prev) => [...prev, value]);
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
      { type: "remove", removed: [{ index, value: items[index] }] },
    ]);
    setItems((prev) => prev.filter((_, i) => i !== index));
    setSelected(new Set());
  };

  const removeSelected = () => {
    if (selected.size === 0) return;
    const removed = [...selected]
      .sort((a, b) => b - a)
      .map((i) => ({ index: i, value: items[i] }));
    setItems((prev) => prev.filter((_, i) => !selected.has(i)));
    setHistory((prev) => [...prev, { type: "remove", removed }]);
    setSelected(new Set());
  };

  const undo = () => {
    setHistory((prev) => {
      const last = prev.at(-1);
      if (!last) return prev;
      if (last.type === "add") {
        setItems((p) => p.slice(0, -1));
      } else {
        setItems((p) => {
          const next = [...p];
          [...last.removed]
            .sort((a, b) => a.index - b.index)
            .forEach(({ index, value }) => next.splice(index, 0, value));
          return next;
        });
      }
      setSelected(new Set());
      return prev.slice(0, -1);
    });
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
