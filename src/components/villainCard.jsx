import React from "react";
import "../styles/VillainCard.css";

const VillainCard = ({ villain }) => {
  if (!villain) return null;

  const {
    nome,
    razza,
    classe,
    livello,
    obiettivo,
    motivazione,
    comportamento,
    oggetti,
    luogoChiave,
    magia,
    immagine
  } = villain;

  return (
    <div className="villain-card">
      {immagine && <img src={immagine} alt={nome} className="villain-img" />}
      <h3>{nome}</h3>
      {villain.campagnaCollegata && (
  <div className="villain-tag-campagna">
    📌 Campagna: <em>{villain.campagnaCollegata}</em>
  </div>
)}
      <p><strong>Razza:</strong> {razza}</p>
      <p><strong>Classe:</strong> {classe} (Liv. {livello})</p>
      <p><strong>Obiettivo:</strong> {obiettivo}</p>
      <p><strong>Motivazione:</strong> {motivazione}</p>
      <p><strong>Comportamento:</strong> {comportamento}</p>
      <p><strong>Oggetti:</strong> {oggetti}</p>
      <p><strong>Luogo chiave:</strong> {luogoChiave}</p>
      {magia && (
        <div className="villain-magic">
          <strong>Magia:</strong> {magia}
        </div>
      )}
    </div>
  );
};

export default VillainCard;