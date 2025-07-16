import React, { useState } from "react";
import CardElemento from "./cardElemento";
import "../styles/archivioSezione.css";

const ArchivioSezione = ({ titolo, dati, categoria }) => {
  const [espanso, setEspanso] = useState(false);

  return (
    <div className={`archivio-section ${espanso ? "expanded" : "collapsed"}`}>
      <div className="archivio-header">
        <h2>{titolo}</h2>
        <button className="btn-add">+ Aggiungi</button>
      </div>

      <div className="card-grid">
        {dati.map((item) => (
          <CardElemento key={item.id} item={item} categoria={categoria} />
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
