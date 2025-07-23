import React, { useState } from "react";
import GestionePNG from "../gestionePNG";
import "../../styles/pngWidget.css";

export default function PngWidget() {
  const [showGestione, setShowGestione] = useState(false);

  return (
    <>
      <div className="png-widget" onClick={() => setShowGestione(true)}>
        <h3>PNG</h3>
        <p>Crea PNG comuni o non comuni per arricchire la tua campagna.</p>
      </div>

      {showGestione && (
        <div className="overlay-gestione">
          <div className="popup-gestione">
            <GestionePNG />
            <button
              className="btn-close"
              onClick={() => setShowGestione(false)}
            >
              ❌
            </button>
          </div>
        </div>
      )}
      </>
  );
}
