import React from "react";
import { deleteDoc, doc, addDoc, collection } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import "../../styles/modaleDettaglioAvventura.css";

export default function ModaleDettaglioAvventura({ avventura, onClose, campagnaId, onDeleted }) {
  const handleElimina = async () => {
    try {
      await deleteDoc(doc(firestore, "avventure", avventura.id));
      toast.success("✅ Avventura eliminata!");
      if (onDeleted) onDeleted(avventura.id);
      onClose();
    } catch (err) {
      console.error("Errore eliminazione:", err);
      toast.error("❌ Errore durante eliminazione");
    }
  };

  const handleCollega = async () => {
    try {
      if (!campagnaId) return;
      const campagnaRef = collection(firestore, `campagne/${campagnaId}/avventure`);
      await addDoc(campagnaRef, avventura);
      toast.success("📌 Avventura collegata alla campagna!");
    } catch (err) {
      console.error("Errore collegamento:", err);
      toast.error("❌ Errore nel collegamento");
    }
  };

  return (
    <div className="modale-overlay">
      <div className="modale-dettaglio-avventura">
        <div className="modale-header">
          <h2>{avventura.titolo}</h2>
          <button onClick={onClose}>❌</button>
        </div>
        <p><strong>Tema:</strong> {avventura.tema || "—"}</p>
        <hr />
        <h3>Stanze</h3>
        <ol>
          {avventura.stanze?.map((s, i) => (
            <li key={i}>
              <h4>{s.titolo}</h4>
              <p><strong>Scopo:</strong> {s.scopo}</p>
              <p>{s.descrizione}</p>
              {s.trappola && <p>⚠️ Ostacolo: {s.trappola}</p>}
              {s.dialogo && <blockquote>💬 {s.dialogo}</blockquote>}
            </li>
          ))}
        </ol>
        <hr />
        <div className="azioni">
          {campagnaId && (
            <button className="btn-collega" onClick={handleCollega}>
              📎 Collega alla Campagna
            </button>
          )}
          <button className="btn-delete" onClick={handleElimina}>🗑️ Elimina</button>
        </div>
      </div>
    </div>
  );
}
