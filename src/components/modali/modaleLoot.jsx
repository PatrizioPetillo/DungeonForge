import React, { useState, useEffect } from "react";
import { addDoc, collection, getDocs, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import "../../styles/modaleLoot.css";

const ModaleLoot = ({ onClose, campagnaId, destinatari, onSave, onLog }) => {
  const [nome, setNome] = useState("");
  const [rarita, setRarita] = useState("Comune");
  const [descrizione, setDescrizione] = useState("");
  const [assegnatoA, setAssegnatoA] = useState("");
  const [archivio, setArchivio] = useState([]);

  useEffect(() => {
    const fetchArchivio = async () => {
      const snap = await getDocs(collection(firestore, "lootArchivio"));
      setArchivio(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchArchivio();
  }, []);

  const handleSalva = async () => {
    if (!nome) return alert("Inserisci un nome per il loot!");

    const lootData = { nome, rarita, descrizione, assegnatoA, createdAt: serverTimestamp() };

    try {
      const ref = collection(firestore, `campagne/${campagnaId}/loot`);
      const docRef = await addDoc(ref, lootData);
      onSave({ ...lootData, id: docRef.id });
      onLog(`🎁 Loot aggiunto: ${nome} (${rarita}) → ${assegnatoA || "Non assegnato"}`);
      onClose();
    } catch (err) {
      console.error("Errore salvataggio loot:", err);
    }
  };

  const usaArchivio = (item) => {
    setNome(item.nome);
    setRarita(item.rarita || "Comune");
    setDescrizione(item.descrizione || "");
  };

  return (
    <div className="modale-overlay">
      <div className="modale-contenuto">
        <div className="modale-header">
          <h2>💎 Aggiungi Loot</h2>
          <button onClick={onClose}>❌</button>
        </div>

        <label>Nome oggetto:</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} />

        <label>Rarità:</label>
        <select value={rarita} onChange={(e) => setRarita(e.target.value)}>
          <option>Comune</option>
          <option>Non Comune</option>
          <option>Raro</option>
          <option>Molto Raro</option>
          <option>Leggendario</option>
        </select>

        <label>Descrizione:</label>
        <textarea rows={3} value={descrizione} onChange={(e) => setDescrizione(e.target.value)} />

        <label>Assegna a:</label>
        <select value={assegnatoA} onChange={(e) => setAssegnatoA(e.target.value)}>
          <option value="">— Nessuno —</option>
          {destinatari.map((d) => (
            <option key={d.id} value={d.nome}>{d.nome}</option>
          ))}
        </select>

        <div className="azioni">
          <button className="btn-primary" onClick={handleSalva}>✅ Salva</button>
        </div>

        {archivio.length > 0 && (
          <div className="archivio-loot">
            <h4>📚 Archivio Loot</h4>
            <ul>
              {archivio.map((item) => (
                <li key={item.id}>
                  <button onClick={() => usaArchivio(item)}>Usa</button> {item.nome}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModaleLoot;
