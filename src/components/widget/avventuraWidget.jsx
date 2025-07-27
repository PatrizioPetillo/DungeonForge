import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import ModaleFiveRoomDungeon from "../modali/modaleFiveRoomDungeon";
import { toast } from "react-toastify";
import "../../styles/avventuraWidget.css";

export default function AvventuraWidget({ campagnaId = null }) {
  const [avventure, setAvventure] = useState([]);
  const [modaleOpen, setModaleOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch avventure dall'archivio
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

  // Elimina avventura da Firestore
  const eliminaAvventura = async (id) => {
    try {
      await deleteDoc(doc(firestore, "avventure", id));
      setAvventure(avventure.filter((a) => a.id !== id));
      toast.success("✅ Avventura eliminata!");
    } catch (err) {
      console.error("Errore eliminazione avventura:", err);
      toast.error("❌ Errore durante eliminazione");
    }
  };

  return (
    <div className="widget-avventure">
      <h3>🧭 Avventure Modulari</h3>

      <button
        onClick={() => setModaleOpen(true)}
        className="btn-primary"
        style={{ marginBottom: "1rem" }}
      >
        + Nuova Avventura
      </button>

      {loading ? (
        <p>Caricamento...</p>
      ) : avventure.length > 0 ? (
        <ul className="avventura-list">
          {avventure.map((a) => (
            <li key={a.id} className="avventura-item">
              <div className="avventura-info">
                <strong>{a.titolo}</strong>
                <span className="tema">{a.tema || "—"}</span>
              </div>
              <div className="azioni">
                {campagnaId && (
                  <button
                    className="btn-collega"
                    onClick={() => {
                      toast.info(`📎 Collegamento a campagna ${campagnaId}`);
                      // TODO: logica per collegare campagna (aggiunge a campagne/{id}/avventure)
                    }}
                  >
                    📎 Collega
                  </button>
                )}
                <button
                  className="btn-delete"
                  onClick={() => eliminaAvventura(a.id)}
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nessuna avventura creata.</p>
      )}

      {/* Modale Five Room Dungeon */}
      {modaleOpen && (
        <ModaleFiveRoomDungeon
          collegaAllaCampagna={false} // il widget non collega di default
          onSave={(nuovaAvventura) => {
            setAvventure([...avventure, nuovaAvventura]);
            setModaleOpen(false);
          }}
          onClose={() => setModaleOpen(false)}
        />
      )}
    </div>
  );
}
