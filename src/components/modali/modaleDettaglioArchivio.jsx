import React, { useState, useEffect } from "react";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";

import "../../styles/modaleDettaglioArchivio.css";

const ModaleDettaglioArchivio = ({ item, onClose }) => {
  const [campagne, setCampagne] = useState([]);
  const [campagnaSelezionata, setCampagnaSelezionata] = useState("");
  const [capitoloSelezionato, setCapitoloSelezionato] = useState("");
  const [scenaSelezionata, setScenaSelezionata] = useState("");

  const [editItem, setEditItem] = useState(item);

  // Carica campagne disponibili
  useEffect(() => {
    const fetchCampagne = async () => {
      const snap = await getDocs(collection(firestore, "campagne"));
      setCampagne(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchCampagne();
  }, []);

  const handleAggiungi = async () => {
    if (!campagnaSelezionata) {
      alert("Seleziona una campagna");
      return;
    }
    try {
      const ref = doc(firestore, `campagne/${campagnaSelezionata}`);
      const subcoll = collection(ref, `${item.tipoArchivio || "elementi"}`);
      await addDoc(subcoll, {
        ...item,
        collegatoA: {
          capitolo: capitoloSelezionato || null,
          scena: scenaSelezionata || null,
        },
        aggiuntoIl: new Date(),
      });
      alert("Elemento aggiunto alla campagna!");
      onClose();
    } catch (err) {
      console.error("Errore aggiunta elemento:", err);
    }
  };

  const handleSalva = async () => {
    try {
      const docRef = doc(firestore, `archivio/${item.categoria}/${item.id}`);
      await updateDoc(docRef, editItem);
      alert("Elemento aggiornato!");
      onClose();
    } catch (err) {
      console.error("Errore salvataggio:", err);
    }
  };

  const handleElimina = async () => {
    if (!window.confirm("Sei sicuro di voler eliminare questo elemento?")) return;
    try {
      const docRef = doc(firestore, `archivio/${item.categoria}/${item.id}`);
      await deleteDoc(docRef);
      alert("Elemento eliminato!");
      onClose();
    } catch (err) {
      console.error("Errore eliminazione:", err);
    }
  };

  return (
    <div className="modale-overlay">
      <div className="modale-dettaglio">
        <button className="btn-close" onClick={onClose}>❌</button>
        
        <h2>{item.nome}</h2>
        <img
          src={item.immagine || "/img/default.jpg"}
          alt={item.nome}
          className="modale-img"
        />

        <div className="info-blocco">
          <p><strong>Classe:</strong> {item.classe || "-"}</p>
          <p><strong>Livello:</strong> {item.livello || "-"}</p>
          <p><strong>Descrizione:</strong> {item.descrizione || "Nessuna descrizione"}</p>
        </div>

        {/* Aggiungi alla campagna */}
        <div className="aggiungi-blocco">
          <h3>Aggiungi alla Campagna</h3>
          <select value={campagnaSelezionata} onChange={(e) => setCampagnaSelezionata(e.target.value)}>
            <option value="">— Seleziona Campagna —</option>
            {campagne.map((c) => (
              <option key={c.id} value={c.id}>{c.titolo}</option>
            ))}
          </select>

          {campagnaSelezionata && (
            <>
              <input
                type="text"
                placeholder="Capitolo (opzionale)"
                value={capitoloSelezionato}
                onChange={(e) => setCapitoloSelezionato(e.target.value)}
              />
              <input
                type="text"
                placeholder="Scena (opzionale)"
                value={scenaSelezionata}
                onChange={(e) => setScenaSelezionata(e.target.value)}
              />
            </>
          )}

          <button className="btn-primary" onClick={handleAggiungi}>✅ Aggiungi</button>
        </div>

        {/* Pulsanti gestione */}
        <div className="pulsanti-modale">
          <button onClick={handleSalva}>💾 Modifica & Salva</button>
          <button className="btn-danger" onClick={handleElimina}>🗑 Elimina</button>
        </div>
      </div>
    </div>
  );
};

export default ModaleDettaglioArchivio;
