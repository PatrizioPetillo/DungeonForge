import React, { useState, useEffect } from "react";
import { getCampagne, collegaElementoACampagna } from "../../utils/collegamentoUtils";

export default function ModaleCollegamento({ idElemento, tipoElemento, onClose }) {
  const [campagne, setCampagne] = useState([]);
  const [capitoli, setCapitoli] = useState([]);
  const [scene, setScene] = useState([]);

  const [campagnaSelezionata, setCampagnaSelezionata] = useState("");
  const [capitoloSelezionato, setCapitoloSelezionato] = useState("");
  const [scenaSelezionata, setScenaSelezionata] = useState("");

  useEffect(() => {
    (async () => {
      const listaCampagne = await getCampagne();
      setCampagne(listaCampagne);
    })();
  }, []);

  // TODO: fetch capitoli e scene reali (Firestore)
  useEffect(() => {
    if (campagnaSelezionata) {
      // Qui andrà una query Firestore per i capitoli
      setCapitoli([
        { id: "cap1", nome: "Prologo" },
        { id: "cap2", nome: "Capitolo 1" }
      ]);
    }
  }, [campagnaSelezionata]);

  useEffect(() => {
    if (capitoloSelezionato) {
      // Query Firestore per le scene del capitolo
      setScene([
        { id: "sc1", nome: "Scena 1" },
        { id: "sc2", nome: "Scena 2" }
      ]);
    }
  }, [capitoloSelezionato]);

  const handleCollega = async () => {
    await collegaElementoACampagna(campagnaSelezionata, capitoloSelezionato, scenaSelezionata, {
      id: idElemento,
      tipo: tipoElemento
    });
    alert(`✅ ${tipoElemento} collegato alla campagna!`);
    onClose();
  };

  return (
    <div className="modale-overlay">
      <div className="modale">
        <h3>Collega a Campagna</h3>

        <select value={campagnaSelezionata} onChange={e => setCampagnaSelezionata(e.target.value)}>
          <option value="">Seleziona Campagna</option>
          {campagne.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>

        <select disabled={!campagnaSelezionata} value={capitoloSelezionato} onChange={e => setCapitoloSelezionato(e.target.value)}>
          <option value="">Seleziona Capitolo</option>
          {capitoli.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
        </select>

        <select disabled={!capitoloSelezionato} value={scenaSelezionata} onChange={e => setScenaSelezionata(e.target.value)}>
          <option value="">Seleziona Scena</option>
          {scene.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
        </select>

        <div className="actions">
          <button onClick={handleCollega} disabled={!scenaSelezionata}>Collega</button>
          <button onClick={onClose}>Annulla</button>
        </div>
      </div>
    </div>
  );
}
