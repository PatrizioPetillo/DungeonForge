
import React from "react";

export default function AttoViewer({ atti, attoCorrente, setAttoCorrente, readonly = false }) {
  const handleProssimo = () => {
    if (attoCorrente < atti.length - 1) {
      setAttoCorrente(attoCorrente + 1);
    }
  };

  const handlePrecedente = () => {
    if (attoCorrente > 0) {
      setAttoCorrente(attoCorrente - 1);
    }
  };

  const atto = atti[attoCorrente];

  return (
    <section className="atto-viewer">
      <div className="navigazione-atti">
        <button onClick={handlePrecedente} disabled={attoCorrente === 0}>⬅️ Atto precedente</button>
        <span>Atto {attoCorrente + 1} di {atti.length}</span>
        <button onClick={handleProssimo} disabled={attoCorrente === atti.length - 1}>➡️ Prossimo atto</button>
      </div>

      <div className="atto-box">
        <h3>{atto.titolo}</h3>
        <p><strong>Obiettivo:</strong> {atto.obiettivo}</p>
        <ul>
          {atto.contenuto?.map((c, i) => <li key={i}>– {c}</li>)}
        </ul>

        {!readonly && (
          <div className="azioni-atto">
            <button disabled>✅ Segna come completato</button> {/* per futura logica */}
          </div>
        )}
      </div>
    </section>
  );
}
