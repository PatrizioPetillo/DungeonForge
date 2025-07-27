import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import ModaleDettaglioAvventura from "../modali/modaleDettaglioAvventura";
import "../../styles/avventuraArchivio.css";

export default function AvventuraArchivio({ campagnaId }) {
  const [avventure, setAvventure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modaleDettaglio, setModaleDettaglio] = useState(null);

  const fetchAvventure = async () => {
    try {
      setLoading(true);
      const snap = await getDocs(collection(firestore, "avventure"));
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setAvventure(lista);
      setLoading(false);
    } catch (err) {
      console.error("Errore fetch avventure:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvventure();
  }, []);

  return (
    <div className="avventura-archivio-widget">
      {loading ? (
        <p>Caricamento...</p>
      ) : avventure.length > 0 ? (
        <ul>
          {avventure.map((a) => (
            <li key={a.id} className="avventura-archivio-item">
              <div>
                <strong>{a.titolo}</strong> <span>({a.tema || "—"})</span>
              </div>
              <button onClick={() => setModaleDettaglio(a)}>🔍 Dettagli</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nessuna avventura salvata.</p>
      )}

      {modaleDettaglio && (
        <ModaleDettaglioAvventura
            avventura={modaleDettaglio}
            onClose={() => setModaleDettaglio(null)}
            campagnaId={campagnaId}
            onDeleted={(id) => setAvventure(avventure.filter((a) => a.id !== id))}
            />
      )}
    </div>
  );
}
