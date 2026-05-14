export const Modal = () => {
  return (
    <dialog id="item-modal" aria-labelledby="modal-title">
      <form method="dialog">
        <h2 id="modal-title">Add item to list</h2>
        <label htmlFor="new-item-input" className="sr-only">
          New item
        </label>
        <input
          id="new-item-input"
          type="text"
          placeholder="Type the text here..."
        />
        <div>
          <button type="submit" id="add-item-button">
            Add
          </button>
          <button type="button" id="cancel-modal-button">
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
};
