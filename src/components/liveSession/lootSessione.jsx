import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import ModaleLoot from "../modali/modaleLoot";
import "../../styles/lootSessione.css";

const raritaOptions = ["Comune", "Non Comune", "Raro", "Molto Raro", "Leggendario"];
const nomiLoot = [
  "Amuleto delle Ombre", "Anello del Drago", "Spada di Ghiaccio", 
  "Mantello del Crepuscolo", "Bacchetta del Potere", "Pergamena Antica"
];

export default function LootSessione({ campagnaId, destinatari, onLog }) {
  const [loot, setLoot] = useState([]);
  const [modaleOpen, setModaleOpen] = useState(false);

  // Fetch loot già assegnato
  useEffect(() => {
    const fetchLoot = async () => {
      const snap = await getDocs(collection(firestore, `campagne/${campagnaId}/loot`));
      const lista = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLoot(lista);
    };
    fetchLoot();
  }, [campagnaId]);

  // Genera loot casuale
  const generaLootCasuale = async () => {
    const nome = nomiLoot[Math.floor(Math.random() * nomiLoot.length)];
    const rarita = raritaOptions[Math.floor(Math.random() * raritaOptions.length)];
    const descrizione = `Un oggetto misterioso: ${nome}, avvolto da energie arcane.`;

    const lootData = {
      nome,
      rarita,
      descrizione,
      assegnatoA: "",
      createdAt: serverTimestamp()
    };

    try {
      const ref = collection(firestore, `campagne/${campagnaId}/loot`);
      const docRef = await addDoc(ref, lootData);
      const nuovoLoot = { ...lootData, id: docRef.id };
      setLoot([...loot, nuovoLoot]);
      onLog(`🎲 Generato loot casuale: ${nome} (${rarita})`);
    } catch (err) {
      console.error("Errore generazione loot:", err);
    }
  };

  // Raggruppa loot per destinatario
  const lootRaggruppato = destinatari.reduce((acc, d) => {
    acc[d.nome] = loot.filter((l) => l.assegnatoA === d.nome);
    return acc;
  }, { "Non assegnato": loot.filter((l) => !l.assegnatoA) });

  return (
    <div className="widget loot-sessione">
      <h3>💎 Loot Sessione</h3>
      <div className="azioni-loot">
        <button className="btn-primary" onClick={() => setModaleOpen(true)}>+ Aggiungi Loot</button>
        <button className="btn-secondary" onClick={generaLootCasuale}>🎲 Genera Loot</button>
      </div>

      {Object.keys(lootRaggruppato).map((dest) => (
        <div key={dest} className="gruppo-loot">
          <h4>{dest}</h4>
          {lootRaggruppato[dest].length > 0 ? (
            <ul>
              {lootRaggruppato[dest].map((l) => (
                <li key={l.id}><strong>{l.nome}</strong> ({l.rarita})</li>
              ))}
            </ul>
          ) : (
            <p>Nessun loot</p>
          )}
        </div>
      ))}

      {modaleOpen && (
        <ModaleLoot
          onClose={() => setModaleOpen(false)}
          campagnaId={campagnaId}
          destinatari={destinatari}
          onLog={onLog}
          onSave={(nuovo) => setLoot([...loot, nuovo])}
        />
      )}
    </div>
  );
}
