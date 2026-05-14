const openModal = (modal, input) => {
  input.value = "";
  modal.showModal();
  input.focus();
};

const closeModal = (modal) => {
  modal.close();
};

const initModal = ({ modal, input, openModalButton, cancelModalButton }) => {
  openModalButton.addEventListener("click", () => openModal(modal, input));
  cancelModalButton.addEventListener("click", () => closeModal(modal));

  modal.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) {
      return;
    }

    window.listApi.addItem(value);
    closeModal(modal);
  });
};

initModal({
  modal: document.getElementById("item-modal"),
  input: document.getElementById("new-item-input"),
  openModalButton: document.getElementById("open-modal-button"),
  cancelModalButton: document.getElementById("cancel-modal-button"),
});
