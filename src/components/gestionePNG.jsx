import React, { useState } from "react";
import ModalePNG from "./modali/modalePNG";
import ModalePNGNonComune from "./modali/modalePNGNonComune";
import "../styles/gestionePNG.css";

export default function GestionePNG() {
  const [showModal, setShowModal] = useState(false);
  const [tipo, setTipo] = useState(null);

  return (
    <div className="gestione-container">
      <h2>⚔️ Generatore PNG ⚔️</h2>
      <p>Scegli il tipo di PNG che vuoi creare per la tua avventura:</p>
      <div className="card-container">
        <div
          className="card"
          onClick={() => {
            setTipo("Comune");
            setShowModal(true);
          }}
        >
          <div className="icon-svg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill="#d4af37"
              viewBox="0 0 24 24"
            >
              <path d="M12 0L15.09 8H24L17.45 12.97 20.54 21 12 16 3.46 21 6.55 12.97 0 8h8.91z" />
            </svg>
          </div>
          <h3>PNG Comune</h3>
          <p>Mercanti, locandieri, popolani. Perfetti per il worldbuilding.</p>
        </div>

        <div
          className="card"
          onClick={() => {
            setTipo("Non Comune");
            setShowModal(true);
          }}
        >
          <div className="icon-svg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              fill="#6e4f9e"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zm0 6.67l-10 5V22h20v-8.33l-10-5z" />
            </svg>
          </div>
          <h3>PNG Non Comune</h3>
          <p>Avventurieri, guerrieri, figure leggendarie per sfide epiche.</p>
        </div>
      </div>

      {showModal &&
        (tipo === "Comune" ? (
          <ModalePNG onClose={() => setShowModal(false)} />
        ) : (
          <ModalePNGNonComune onClose={() => setShowModal(false)} />
        ))}
    </div>
  );
}
