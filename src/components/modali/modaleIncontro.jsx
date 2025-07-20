import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getDocs } from "firebase/firestore";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import LootBox from "../generatori/lootBox";
import "../../styles/modaleMostro.css"; // Assicurati di avere gli stili corretti

export const ModaleIncontro = ({ campagnaId, onClose }) => {
  const [tab, setTab] = useState("Generale");
  const [incontro, setIncontro] = useState({
    titolo: "",
    descrizione: "",
    data: "",
    pngCoinvolti: [],
    villainCoinvolti: [],
    mostriCoinvolti: [],
    sceneCollegate: [],
    note: "",
    esito: "",
  });

  const [sceneDisponibili, setSceneDisponibili] = useState([]);
  const [pngSalvati, setPngSalvati] = useState([]);
  const [villainSalvati, setVillainSalvati] = useState([]);
  const [mostriSalvati, setMostriSalvati] = useState([]);

  useEffect(() => {
    if (!campagnaId) return;

    const loadData = async () => {
  const [sSnap, pSnap, vSnap, mSnap] = await Promise.all([
    getDocs(collection(firestore, `campagne/${campagnaId}/scenes`)),
    getDocs(collection(firestore, "png")),
    getDocs(collection(firestore, "villain")),
    getDocs(collection(firestore, "mostri")),
  ]);

  setSceneDisponibili(sSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  setPngSalvati(pSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  setVillainSalvati(vSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
  setMostriSalvati(mSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
};

    loadData();
  }, [campagnaId]);

  const salvaIncontro = async () => {
    try {
      await addDoc(collection(firestore, `campagne/${campagnaId}/incontri`), {
        ...incontro,
        createdAt: serverTimestamp(),
      });
      toast.success("Incontro salvato!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Errore nel salvataggio dell'incontro.");
    }
  };

  return (
  <div className="modal-overlay">
    <div className="modale-incontro">
      <div className="modale-header">
        <h2>⚔️ Nuovo Incontro</h2>
        <div className="icone-header">
          <button onClick={salvaIncontro}>💾</button>
          <button onClick={onClose}>✖️</button>
        </div>
      </div>

      <div className="tab-bar">
        {["Generale", "Partecipanti", "Collegamenti", "Note / Esito"].map((t) => (
          <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tab === "Generale" && (
          <>
            <div className="field-group">
              <label>Titolo:</label>
              <input value={incontro.titolo} onChange={(e) => setIncontro((i) => ({ ...i, titolo: e.target.value }))} />
            </div>
            <div className="field-group">
              <label>Descrizione:</label>
              <textarea value={incontro.descrizione} onChange={(e) => setIncontro((i) => ({ ...i, descrizione: e.target.value }))} />
            </div>
            <div className="field-group">
              <label>Data evento:</label>
              <input type="date" value={incontro.data} onChange={(e) => setIncontro((i) => ({ ...i, data: e.target.value }))} />
            </div>
            {/* BLOCCO LOOT PER INCONTRO */}
<div className="field-group">
  <LootBox loot={incontro.loot} onUpdate={(nuovoLoot) => setIncontro((prev) => ({ ...prev, loot: nuovoLoot }))} />
</div>

          </>
        )}

        {tab === "Partecipanti" && (
  <>
    <div className="field-group">
      <label>PNG Coinvolti:</label>
      <select
        multiple
        value={incontro.pngCoinvolti}
        onChange={(e) =>
          setIncontro((prev) => ({
            ...prev,
            pngCoinvolti: Array.from(e.target.selectedOptions).map((opt) => opt.value),
          }))
        }
      >
        {pngSalvati.map((png) => (
          <option key={png.id} value={png.id}>
            {png.nome} ({png.razza || "Razza?"})
          </option>
        ))}
      </select>
    </div>

    <div className="field-group">
      <label>Villain Coinvolti:</label>
      <select
        multiple
        value={incontro.villainCoinvolti}
        onChange={(e) =>
          setIncontro((prev) => ({
            ...prev,
            villainCoinvolti: Array.from(e.target.selectedOptions).map((opt) => opt.value),
          }))
        }
      >
        {villainSalvati.map((v) => (
          <option key={v.id} value={v.id}>
            {v.nome} ({v.classe || "Classe?"})
          </option>
        ))}
      </select>
    </div>

    <div className="field-group">
      <label>Mostri Coinvolti:</label>
      <select
        multiple
        value={incontro.mostriCoinvolti}
        onChange={(e) =>
          setIncontro((prev) => ({
            ...prev,
            mostriCoinvolti: Array.from(e.target.selectedOptions).map((opt) => opt.value),
          }))
        }
      >
        {mostriSalvati.map((m) => (
          <option key={m.id} value={m.id}>
            {m.nome} ×{m.quantita || 1}
          </option>
        ))}
      </select>
    </div>
  </>
)}

        {tab === "Collegamenti" && (
  <div className="field-group">
    <label>Collega a Scene:</label>
    <select
      multiple
      value={incontro.sceneCollegate}
      onChange={(e) =>
        setIncontro((prev) => ({
          ...prev,
          sceneCollegate: Array.from(e.target.selectedOptions).map((opt) => opt.value),
        }))
      }
    >
      {sceneDisponibili.map((scene) => (
        <option key={scene.id} value={scene.id}>
          {scene.titolo || "Senza titolo"} ({scene.capitoloNome || "Capitolo?"})
        </option>
      ))}
    </select>
  </div>
)}

        {tab === "Note / Esito" && (
          <>
            <div className="field-group">
              <label>Note dell'incontro:</label>
              <textarea value={incontro.note} onChange={(e) => setIncontro((i) => ({ ...i, note: e.target.value }))} />
            </div>
            <div className="field-group">
              <label>Esito:</label>
              <textarea value={incontro.esito} onChange={(e) => setIncontro((i) => ({ ...i, esito: e.target.value }))} />
            </div>
          </>
        )}
      </div>
    </div>
  </div>
);
}

export default ModaleIncontro;
