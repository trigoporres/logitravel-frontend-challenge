import { useState } from "react";
import "./App.css";
import { Card, Header, Modal } from "./components";
import { useList } from "./hooks/useList";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { items, selected, canUndo, addItem, toggleSelect, removeByDoubleClick, removeSelected, undo } =
    useList();

  return (
    <>
      <main className="card">
        <Header />
        <Card
          items={items}
          selected={selected}
          canUndo={canUndo}
          onOpenModal={() => setIsModalOpen(true)}
          onToggleSelect={toggleSelect}
          onDoubleClickItem={removeByDoubleClick}
          onRemoveSelected={removeSelected}
          onUndo={undo}
        />
      </main>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddItem={addItem}
      />
    </>
  );
}

export default App;
