interface CardProps {
  onOpenModal: () => void;
}

export const Card = ({ onOpenModal }: CardProps) => {
  return (
    <>
      <section className="card__content">
        <div className="list-container">
          <ul id="item-list"></ul>
        </div>
      </section>

      <footer className="card__actions">
        <div className="card__actions-left">
          <button type="button" aria-label="Undo" id="undo-item-button">
            ↺
          </button>
          <button type="button" id="remove-item-button">
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
