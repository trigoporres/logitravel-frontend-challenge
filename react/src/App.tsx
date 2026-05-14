import { useState } from "react";
import "./App.css";
import { Card, Header, Modal } from "./components";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddItem = (value: string) => {
    console.log("add item:", value);
  };

  return (
    <>
      <main className="card">
        <Header />
        <Card onOpenModal={() => setIsModalOpen(true)} />
      </main>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddItem={handleAddItem}
      />
    </>
  );
}

export default App;
