import React, { useState } from "react";
import ModalePNG from "./modali/modalePNG";
import ModalePNGNonComune from "./modali/modalePNGNonComune";
import "../styles/gestionePNG.css";

export default function GestionePNG() {
  const [showModal, setShowModal] = useState(false);
  const [tipo, setTipo] = useState(null);

  return (
    <div>
      <h3>Seleziona il tipo di PNG</h3>
      <button className="btn-gestione" onClick={() => { setTipo("Comune"); setShowModal(true); }}>➕ PNG Comune</button>
      <button className="btn-gestione" onClick={() => { setTipo("Non Comune"); setShowModal(true); }}>➕ PNG Non Comune</button>

      {showModal && (
        tipo === "Comune" ? (
          <ModalePNG onClose={() => setShowModal(false)} />
        ) : (
          <ModalePNGNonComune onClose={() => setShowModal(false)} />
        )
      )}
    </div>
  );
}
