import React, { useState } from "react";
import "../../styles/modaleDettaglioFRD.css";

export default function ModaleDettaglioFRD({ avventura, onClose, onSetScena }) {
  const [stanzaIndex, setStanzaIndex] = useState(0);
  const stanza = avventura.stanze[stanzaIndex];

  return (
    <div className="modale-overlay">
      <div className="modale-frd">
        <div className="modale-header">
          <h2>📖 {avventura.titolo}</h2>
          <button onClick={onClose}>❌</button>
        </div>
        <p><strong>Tema:</strong> {avventura.tema || "—"}</p>
        <hr />

        <h3>Stanza {stanzaIndex + 1} di {avventura.stanze.length}</h3>
        <h4>{stanza.titolo}</h4>
        <p><strong>Scopo:</strong> {stanza.scopo}</p>
        <p>{stanza.descrizione}</p>
        {stanza.trappola && <p>⚠️ Ostacolo: {stanza.trappola}</p>}
        {stanza.dialogo && <blockquote>💬 {stanza.dialogo}</blockquote>}

        <div className="nav-frd">
          <button
            onClick={() => setStanzaIndex((prev) => Math.max(prev - 1, 0))}
            disabled={stanzaIndex === 0}
          >
            ⬅️
          </button>
          <button
            onClick={() =>
              setStanzaIndex((prev) =>
                Math.min(prev + 1, avventura.stanze.length - 1)
              )
            }
            disabled={stanzaIndex === avventura.stanze.length - 1}
          >
            ➡️
          </button>
        </div>

        {onSetScena && (
          <button
            className="btn-primary"
            onClick={() => onSetScena(stanza)}
            style={{ marginTop: "1rem" }}
          >
            ✅ Imposta come Scena Attiva
          </button>
        )}
      </div>
    </div>
  );
}
