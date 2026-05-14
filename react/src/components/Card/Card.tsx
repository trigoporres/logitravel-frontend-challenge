import { useRef } from "react";
import "./Card.css";
import type { Item } from "../../hooks/useList";

interface CardProps {
  items: Item[];
  selected: Set<number>;
  canUndo: boolean;
  onOpenModal: () => void;
  onToggleSelect: (index: number) => void;
  onDoubleClickItem: (index: number) => void;
  onRemoveSelected: () => void;
  onUndo: () => void;
}

export const Card = ({
  items,
  selected,
  canUndo,
  onOpenModal,
  onToggleSelect,
  onDoubleClickItem,
  onRemoveSelected,
  onUndo,
}: CardProps) => {
  const clickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = (index: number) => {
    if (clickTimerRef.current !== null) clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => {
      onToggleSelect(index);
      clickTimerRef.current = null;
    }, 250);
  };

  const handleDoubleClick = (index: number) => {
    if (clickTimerRef.current !== null) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    onDoubleClickItem(index);
  };

  return (
    <>
      <section className="card__content">
        <div className="list-container">
          <ul className="item-list">
            {items.map((item, index) => (
              <li
                key={item.id}
                className={selected.has(index) ? "list-item--active" : ""}
                onClick={() => handleClick(index)}
                onDoubleClick={() => handleDoubleClick(index)}
              >
                {item.value}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <footer className="card__actions">
        <div className="card__actions-left">
          <button
            type="button"
            aria-label="Undo"
            className="card__btn card__btn--secondary"
            onClick={onUndo}
            disabled={!canUndo}
          >
            ↺
          </button>
          <button
            type="button"
            className="card__btn card__btn--secondary"
            onClick={onRemoveSelected}
            disabled={selected.size === 0}
          >
            Delete
          </button>
        </div>
        <button
          type="button"
          className="card__btn card__btn--primary"
          onClick={onOpenModal}
        >
          Add
        </button>
      </footer>
    </>
  );
};
