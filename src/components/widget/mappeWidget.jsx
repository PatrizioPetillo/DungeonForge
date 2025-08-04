// src/components/widgetMappe.jsx
import React, { useState, useEffect } from "react";
import ModaleMappa from "../modali/modaleMappe";
import { getMappeArchivio } from "../../utils/firestoreArchivio";
import "../../styles/mappeWidget.css";

const WidgetMappe = () => {
  const [mappe, setMappe] = useState([]);
  const [mostraModale, setMostraModale] = useState(false);
  const [mappaSelezionata, setMappaSelezionata] = useState(null);

  useEffect(() => {
    const fetchMappe = async () => {
      const archivio = await getMappeArchivio();
      setMappe(archivio || []);
    };
    fetchMappe();
  }, []);

  const aggiornaMappa = (nuova) => {
    setMappe(prev =>
      mappaSelezionata
        ? prev.map((m, i) => (i === mappaSelezionata ? nuova : m))
        : [...prev, nuova]
    );
    setMostraModale(false);
    setMappaSelezionata(null);
  };

  return (
    <div className="widget-mappe">
      <h3>Mappe e Cartografia</h3>
      <p>Gestisci le mappe della tua campagna e dai vita a nuovi luoghi da esplorare.</p>

      {mappe.map((mappa, index) => (
        <div key={index} className="card">
          <h4>{mappa.titolo}</h4>
          <p>{mappa.descrizione}</p>
          {mappa.immagine && (
            <img
              src={mappa.immagine}
              alt={mappa.titolo}
              style={{ width: "100%", borderRadius: "6px", marginTop: "8px" }}
            />
          )}
          <button onClick={() => {
            setMappaSelezionata(index);
            setMostraModale(true);
          }}>
            ✏️ Modifica
          </button>
        </div>
      ))}

      <button onClick={() => setMostraModale(true)}>➕ Crea nuova mappa</button>

      {mostraModale && (
        <ModaleMappa
          initialData={mappaSelezionata !== null ? mappe[mappaSelezionata] : null}
          onSave={aggiornaMappa}
          onClose={() => {
            setMostraModale(false);
            setMappaSelezionata(null);
          }}
        />
      )}
    </div>
  );
};

export default WidgetMappe;
