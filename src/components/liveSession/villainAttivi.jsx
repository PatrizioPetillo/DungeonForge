// components/live/VillainAttivi.jsx
import React from "react";

const VillainAttivi = ({ villain }) => {
  if (!villain?.length) return null;

  return (
    <div className="widget live-widget">
      <h3>🧙‍♂️ Villain in Scena</h3>
      {villain.map((v) => (
        <div key={v.id} className="box-villain">
          <strong>{v.nome}</strong> – Livello {v.livello}
          <p>{v.motivazione || "Motivazione sconosciuta"}</p>
          <p><em>Classe:</em> {v.classe?.nome || "—"} | <em>Razza:</em> {v.razza?.nome || "—"}</p>
        </div>
      ))}
    </div>
  );
};

export default VillainAttivi;
