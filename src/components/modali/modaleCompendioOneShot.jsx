import { useState } from "react";
import "../../styles/modaleCompendioOneShot.css";

export default function ModaleCompendioOneShot({ oneshotPredefinite, setShowCompendio }) {
  const [dettaglio, setDettaglio] = useState(null);

  return (
    <div className="modal-overlay">
      <div className="modale-compendio">
        <button className="chiudi" onClick={() => setShowCompendio(false)}>✖</button>

        {!dettaglio ? (
          <>
            <h2>📚 Compendio di One-Shot</h2>
            {oneshotPredefinite.map((avv, i) => (
              <div key={i} className="card-avventura">
                <h3>{avv.titolo}</h3>
                <p><em>{avv.tagline}</em></p>
                <p><strong>Livello:</strong> {avv.livello} — <strong>Durata:</strong> {avv.durata}</p>
                <div className="bottoni">
                  <button onClick={() => setDettaglio(avv)}>📖 Dettagli</button>
                  <button onClick={() => console.log("Avvia", avv)}>▶ Inizia</button>
                  <button onClick={() => console.log("Collega", avv)}>➕ Collega</button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <h2>{dettaglio.titolo}</h2>
            <p><em>{dettaglio.tagline}</em></p>
            <p><strong>Livello:</strong> {dettaglio.livello} — <strong>Durata:</strong> {dettaglio.durata}</p>

            {dettaglio.villain && (
              <div className="box-villain">
                <h3>🧙‍♂️ Villain: {dettaglio.villain.nome}</h3>
                <p><strong>Razza:</strong> {dettaglio.villain.razza}</p>
                <p><strong>Classe:</strong> {dettaglio.villain.classe} (Liv. {dettaglio.villain.livello})</p>
                <p><strong>Obiettivo:</strong> {dettaglio.villain.obiettivo}</p>
                <p><strong>Motivazione:</strong> {dettaglio.villain.motivazione}</p>
                <p><strong>Comportamento:</strong> {dettaglio.villain.comportamento}</p>
                <p><strong>Oggetti:</strong> {dettaglio.villain.oggetti}</p>
                <p><strong>Luogo chiave:</strong> {dettaglio.villain.luogoChiave}</p>
              </div>
            )}

            {dettaglio.atti?.length > 0 && (
              <>
                <h3>📖 Atti:</h3>
                {dettaglio.atti.map((atto, i) => (
                  <div key={i} className="atto">
                    <p><strong>{atto.titolo}:</strong> {atto.obiettivo}</p>
                  </div>
                ))}
              </>
            )}

            {dettaglio.hookNarrativi?.length > 0 && (
              <>
                <h3>🎯 Hook narrativi:</h3>
                <ul>
                  {dettaglio.hookNarrativi.map((hook, i) => (
                    <li key={i}>{hook}</li>
                  ))}
                </ul>
              </>
            )}

            <div className="bottoni">
              <button onClick={() => setDettaglio(null)}>⬅️ Torna all’elenco</button>
              <button onClick={() => console.log("Avvia", dettaglio)}>▶ Inizia</button>
              <button onClick={() => console.log("Collega", dettaglio)}>➕ Collega</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
