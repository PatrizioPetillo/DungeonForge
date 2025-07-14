import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";

const ModaleLuogo = ({ onClose, campagnaId }) => {
  const [tab, setTab] = useState("Generale");
  const [sceneDisponibili, setSceneDisponibili] = useState([]);

  const [luogo, setLuogo] = useState({
    nome: "",
    tipo: "",
    immagine: "",
    descrizione: "",
    sceneCollegate: [],
    createdAt: null,
  });

  useEffect(() => {
    if (!campagnaId) return;
    const fetchScene = async () => {
      const snap = await getDocs(collection(firestore, `campagne/${campagnaId}/scenes`));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSceneDisponibili(data);
    };
    fetchScene();
  }, [campagnaId]);

  const salvaLuogo = async () => {
    try {
      await addDoc(collection(firestore, "luoghi"), {
        ...luogo,
        createdAt: serverTimestamp(),
      });
      toast.success("Luogo salvato con successo!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Errore durante il salvataggio.");
    }
  };

    return (
    <div className="modal-overlay">
      <div className="modale modale-luogo">
        <div className="modale-header">
          <h2>📍 Nuovo Luogo</h2>
          <div className="icone-header">
            <button onClick={salvaLuogo}>💾</button>
            <button onClick={onClose}>✖️</button>
          </div>
        </div>

        <div className="tab-bar">
          {["Generale", "Descrizione", "Collegamenti"].map((t) => (
            <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {tab === "Generale" && (
            <>
              <div className="field-group">
                <label>Nome del luogo:</label>
                <input value={luogo.nome} onChange={(e) => setLuogo((l) => ({ ...l, nome: e.target.value }))} />
              </div>
              <div className="field-group">
                <label>Tipo:</label>
                <input value={luogo.tipo} placeholder="Es: Taverna, Bosco, Castello..." onChange={(e) => setLuogo((l) => ({ ...l, tipo: e.target.value }))} />
              </div>
              <div className="field-group">
                <label>URL Immagine (facoltativa):</label>
                <input value={luogo.immagine} onChange={(e) => setLuogo((l) => ({ ...l, immagine: e.target.value }))} />
              </div>
            </>
          )}

          {tab === "Descrizione" && (
            <div className="field-group">
              <label>Descrizione dettagliata:</label>
              <textarea
                rows={8}
                value={luogo.descrizione}
                onChange={(e) => setLuogo((l) => ({ ...l, descrizione: e.target.value }))}
              />
            </div>
          )}

          {tab === "Collegamenti" && (
            <div className="field-group">
              <label>Collega a Scene:</label>
              <select
                multiple
                value={luogo.sceneCollegate}
                onChange={(e) =>
                  setLuogo((l) => ({
                    ...l,
                    sceneCollegate: Array.from(e.target.selectedOptions).map((opt) => opt.value),
                  }))
                }
              >
                {sceneDisponibili.map((scene) => (
                  <option key={scene.id} value={scene.id}>
                    {scene.titolo || "Senza titolo"}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModaleLuogo;
