import React, { useState } from "react";
import CardElemento from "./cardElemento";
import "../styles/archivioSezione.css";

const ArchivioSezione = ({ titolo, dati, categoria, collegamenti, onCardClick, onCollegaClick }) => {
  const [espanso, setEspanso] = useState(false);

  const filtraDati = (lista) => {
  return lista.filter((item) => {
    const nome = (item.nome || item.titolo || "").toLowerCase();
    const matchSearch = nome.includes(searchTerm.toLowerCase());

    const isCollegato = collegamenti[item.id] !== undefined;
    if (filtro === "collegati" && !isCollegato) return false;
    if (filtro === "non-collegati" && isCollegato) return false;

    return matchSearch;
  });
};

  return (
    <div className={`archivio-section ${espanso ? "expanded" : "collapsed"}`}>
      <div className="archivio-header">
        <h2>{titolo}</h2>
        <button onClick={() => setEspanso(!espanso)} className="btn-toggle">
          {espanso ? "Nascondi" : "Mostra"} Dettagli
        </button>
      </div>

      <div className="card-grid">
        {dati.map((item) => (
          <CardElemento
      key={item.id}
      item={item}
      categoria={categoria}
      collegamenti={collegamenti}
      onEdit={(elemento) => onCollegaClick(elemento)} // rimuoviamo dopo
    />
        ))}
      </div>

      {!espanso && dati.length > 5 && (
        <div className="fade-overlay">
          <button onClick={() => setEspanso(true)} className="btn-expand">
            Mostra altro
          </button>
        </div>
      )}
    </div>
  );
};

export default ArchivioSezione;
