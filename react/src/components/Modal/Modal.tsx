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
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [isOpen]);

  const handleClose = () => {
    setValue("");
    setHasError(false);
    onClose();
  };

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setHasError(true);
      return;
    }
    onAddItem(trimmed);
    handleClose();
  };

  return (
    <dialog ref={dialogRef} className="modal" aria-labelledby="modal-title" onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2 id="modal-title">Add item to list</h2>
        <label htmlFor="new-item-input" className="sr-only">
          New item
        </label>
        <input
          id="new-item-input"
          type="text"
          placeholder="Type the text here..."
          className={`modal__input${hasError ? " modal__input--error" : ""}`}
          value={value}
          onChange={(e) => { setValue(e.target.value); setHasError(false); }}
          autoFocus
          aria-describedby={hasError ? "input-error" : undefined}
        />
        {hasError && (
          <p id="input-error" className="modal__error" role="alert">
            This field cannot be empty.
          </p>
        )}
        <div className="modal__actions">
          <button type="submit" className="modal__btn modal__btn--primary">Add</button>
          <button type="button" className="modal__btn modal__btn--secondary" onClick={handleClose}>
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
};
