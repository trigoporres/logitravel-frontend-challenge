import { useEffect, useRef, useState } from "react";
import "./Modal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (value: string) => void;
}

export const Modal = ({ isOpen, onClose, onAddItem }: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [value, setValue] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      setValue("");
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onAddItem(trimmed);
    onClose();
  };

  return (
    <dialog ref={dialogRef} aria-labelledby="modal-title" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <h2 id="modal-title">Add item to list</h2>
        <label htmlFor="new-item-input" className="sr-only">
          New item
        </label>
        <input
          id="new-item-input"
          type="text"
          placeholder="Type the text here..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
        <div>
          <button type="submit" id="add-item-button">Add</button>
          <button type="button" id="cancel-modal-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
};
