import React from 'react';
import '../styles/campagnaCard.css';


function CampagnaCard({ titolo, stato = 'Bozza', immagine = '/default-campaign.jpg', onClick }) {
  const campagna = {
    blurb: "Una breve descrizione della campagna che cattura l'attenzione.",
    obiettivo: "Raggiungere il livello 10 e sconfiggere il drago antico.",
    tagNarrativi: ["Fantasy", "Avventura", "Eroi"],
    durataStimata: "3 mesi",
    durataTipo: "Settimanale"
  };
  
  return (
    <div className="campagna-card" onClick={onClick}>
      <div className="campagna-img" style={{ backgroundImage: `url(${immagine})` }}></div>
      <div className="campagna-info">
        <h3 className="campagna-titolo">{titolo}</h3>
        <p><em>{campagna.blurb}</em></p>
<p style={{ fontSize: "0.85em", color: "#999" }}>
  🎯 {campagna.obiettivo?.slice(0, 80)}...
</p>
<p style={{ fontSize: "0.8em", color: "#bbb" }}>
  🏷️ {campagna.tagNarrativi?.join(", ")} | ⌛ {campagna.durataStimata} {campagna.durataTipo}
</p>

        <span className={`campagna-stato ${stato.toLowerCase()}`}>{stato}</span>
      </div>
    </div>
  );
}

export default CampagnaCard;
