const openModal = (modal, input) => {
  input.value = "";
  modal.showModal();
  input.focus();
};

const closeModal = (modal) => {
  modal.close();
};

const initModal = ({ modal, input, openModalButton, cancelModalButton, onAddItem }) => {
  const errorMsg = document.createElement("p");
  errorMsg.className = "modal__error";
  errorMsg.setAttribute("role", "alert");
  input.insertAdjacentElement("afterend", errorMsg);

  const showError = () => {
    input.classList.add("modal__input--error");
    input.setAttribute("aria-describedby", "input-error");
    errorMsg.id = "input-error";
    errorMsg.textContent = "This field cannot be empty.";
  };

  const clearError = () => {
    input.classList.remove("modal__input--error");
    input.removeAttribute("aria-describedby");
    errorMsg.textContent = "";
  };

  const handleClose = () => {
    clearError();
    closeModal(modal);
  };

  openModalButton.addEventListener("click", () => openModal(modal, input));
  cancelModalButton.addEventListener("click", handleClose);
  input.addEventListener("input", clearError);

  modal.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value) {
      showError();
      return;
    }
    onAddItem(value);
    handleClose();
  });
};
