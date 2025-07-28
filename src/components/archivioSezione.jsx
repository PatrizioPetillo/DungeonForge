import React, { useState } from "react";
import CardElemento from "./cardElemento";
import "../styles/archivioSezione.css";

const ArchivioSezione = ({ titolo, dati, categoria, collegamenti, onCardClick, onCollegaClick }) => {
  const [espanso, setEspanso] = useState(false);

  const righe = [];
for (let i = 0; i < dati.length; i += 5) {
  righe.push(dati.slice(i, i + 5));
}

  return (
    <div className={`archivio-section ${espanso ? "expanded" : "collapsed"}`}>
      <div className="archivio-header">
        <h2>{titolo}</h2>
        {righe.length > 1 && (
          <button onClick={() => setEspanso(!espanso)} className="btn-toggle">
            {espanso ? "Nascondi" : "Mostra"} Dettagli
          </button>
        )}
      </div>

      {righe.map((riga, index) => (
        <div
          className={`card-grid ${index > 0 && !espanso ? "sfocata" : ""}`}
          key={index}
        >
          {riga.map((item) => (
            <CardElemento
              key={item.id}
              item={item}
              categoria={categoria}
              collegamenti={collegamenti}
              onEdit={(elemento) => onCollegaClick(elemento)}
            />
          ))}
        </div>
      ))}
    </div>

  );
};

export default ArchivioSezione;
