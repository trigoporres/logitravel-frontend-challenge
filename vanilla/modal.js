const openModal = (modal, input) => {
  input.value = "";
  modal.showModal();
  input.focus();
};

const closeModal = (modal) => {
  modal.close();
};

const initModal = ({ modal, input, openModalButton, cancelModalButton, onAddItem }) => {
  openModalButton.addEventListener("click", () => openModal(modal, input));
  cancelModalButton.addEventListener("click", () => closeModal(modal));

  modal.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) return;
    onAddItem(value);
    closeModal(modal);
  });
};
