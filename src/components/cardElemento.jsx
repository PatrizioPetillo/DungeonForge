import React, { useState } from "react";
import ModaleDettaglioArchivio from "../components/modali/modaleDettaglioArchivio";
import "../styles/CardElemento.css";

const CardElemento = ({ item, categoria, collegamenti  }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="card-elemento"
        style={{ backgroundImage: `url(${item.immagine || "/img/default.jpg"})` }}
        onClick={() => setShowModal(true)}
      >
        <div className="badge-status">{item.status || "Salvato"}</div>
        <div className="card-footer">
          <h4>{item.nome || item.titolo}</h4>
          {collegamenti[item.id] && (
            <span className="badge-collegato">
              ✔ Collegato a: {collegamenti[item.id].scena} ({collegamenti[item.id].capitolo})
            </span>
          )}
        </div>
      </div>

      {showModal && (
  <ModaleDettaglioArchivio
    id={item.id}
    tipo={categoria}
    collegamentoInfo={collegamenti[item.id] || null}
    onClose={() => setShowModal(false)}
  />
)}
    </>
  );
};

export default CardElemento;
