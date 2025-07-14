// components/live/EnigmiAttivi.jsx
import React from "react";

const EnigmiAttivi = ({ enigmi }) => {
  if (!enigmi?.length) return null;

  return (
    <div className="widget live-widget">
      <h3>🧩 Enigmi Attivi</h3>
      {enigmi.map((e) => (
        <div key={e.id} className="box-enigma">
          <strong>{e.titolo}</strong>
          <p><em>Tipo:</em> {e.tipo || "—"}</p>
          <p><em>Difficoltà:</em> {e.cd ? `CD ${e.cd}` : "—"}</p>
          <p>{e.descrizione?.slice(0, 120)}...</p>
          <hr />
          <p><strong>Prova:</strong> {e.prova || "—"} <strong>CD:</strong> {e.cd || "—"}</p>
{e.effettoFallimento && (
  <p className="pericolo">💥 Fallimento: {e.effettoFallimento}</p>
)}
{e.soluzioni && <details><summary>✅ Soluzione</summary><p>{e.soluzioni}</p></details>}

        </div>
      ))}
    </div>
  );
};

export default EnigmiAttivi;
