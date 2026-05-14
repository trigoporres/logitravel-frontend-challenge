const createList = (listElement, removeButton, undoButton) => {
  const items = [];
  const selected = new Set();
  const history = [];
  let clickTimer = null;

  const renderItems = () => {
    listElement.replaceChildren(
      ...items.map((item, index) => {
        const li = document.createElement("li");
        li.textContent = item;
        li.className = selected.has(index) ? "list-item--active" : "";
        return li;
      }),
    );
    removeButton.disabled = selected.size === 0;
    undoButton.disabled = history.length === 0;
  };

  const addItem = (value) => {
    items.push(value);
    history.push({ type: "add" });
    renderItems();
  };

  listElement.addEventListener("click", (event) => {
    const li = event.target.closest("li");
    if (!li) return;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      const index = [...listElement.children].indexOf(li);
      if (selected.has(index)) {
        selected.delete(index);
      } else {
        selected.add(index);
      }
      li.classList.toggle("list-item--active", selected.has(index));
      removeButton.disabled = selected.size === 0;
      clickTimer = null;
    }, 250);
  });

  listElement.addEventListener("dblclick", (event) => {
    const li = event.target.closest("li");
    if (!li) return;
    clearTimeout(clickTimer);
    clickTimer = null;
    const index = [...listElement.children].indexOf(li);
    history.push({ type: "remove", removed: [{ index, value: items[index] }] });
    items.splice(index, 1);
    selected.clear();
    renderItems();
  });

  removeButton.addEventListener("click", () => {
    if (selected.size === 0) return;
    const removed = [...selected]
      .sort((a, b) => b - a)
      .map((i) => ({ index: i, value: items[i] }));
    removed.forEach(({ index }) => items.splice(index, 1));
    history.push({ type: "remove", removed });
    selected.clear();
    renderItems();
  });

  undoButton.addEventListener("click", () => {
    if (history.length === 0) return;
    const last = history.pop();
    if (last.type === "add") {
      items.pop();
    } else {
      [...last.removed]
        .sort((a, b) => a.index - b.index)
        .forEach(({ index, value }) => items.splice(index, 0, value));
    }
    selected.clear();
    renderItems();
  });

  return { renderItems, addItem };
};

window.listApi = createList(
  document.getElementById("item-list"),
  document.getElementById("remove-item-button"),
  document.getElementById("undo-item-button"),
);
window.listApi.renderItems();
