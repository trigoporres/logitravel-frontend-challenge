interface CardProps {
  items: string[];
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
  return (
    <>
      <section className="card__content">
        <div className="list-container">
          <ul id="item-list">
            {items.map((item, index) => (
              <li
                key={index}
                className={selected.has(index) ? "list-item--active" : ""}
                onClick={() => onToggleSelect(index)}
                onDoubleClick={() => onDoubleClickItem(index)}
              >
                {item}
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
            id="undo-item-button"
            onClick={onUndo}
            disabled={!canUndo}
          >
            ↺
          </button>
          <button
            type="button"
            id="remove-item-button"
            onClick={onRemoveSelected}
            disabled={selected.size === 0}
          >
            Delete
          </button>
        </div>
        <button type="button" onClick={onOpenModal}>
          Add
        </button>
      </footer>
    </>
  );
};
