import React, { useState } from "react";
import ModaleDettaglioArchivio from "../components/modali/modaleDettaglioArchivio";
import "../styles/CardElemento.css";

const CardElemento = ({ item, categoria }) => {
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
          <p><strong>{item.nome}</strong></p>
          <p>{item.classe ? `${item.classe} Lv.${item.livello || "?"}` : item.tipo}</p>
        </div>
      </div>

      {showModal && (
        <ModaleDettaglioArchivio item={{ ...item, categoria, tipoArchivio: categoria }} onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default CardElemento;
