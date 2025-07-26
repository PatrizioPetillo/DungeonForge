import React, { useEffect, useState } from "react";
import { deleteDoc, doc, getDoc, collection, getDocs, setDoc, } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import "../../styles/modaleDettaglioArchivio.css";

export default function ModaleDettaglioArchivio({ id, tipo, collegamentoInfo, onClose, onCollega }) {
  const [dettaglio, setDettaglio] = useState(null);
  const [campagne, setCampagne] = useState([]);
  const [capitoli, setCapitoli] = useState([]);
  const [scene, setScene] = useState([]);
  const [selectedCampagna, setSelectedCampagna] = useState("");
  const [selectedCapitolo, setSelectedCapitolo] = useState("");
  const [selectedScena, setSelectedScena] = useState("");
  const [showCollegaForm, setShowCollegaForm] = useState(false);


  useEffect(() => {
    const fetchDettaglio = async () => {
      const ref = doc(firestore, `archivio/${tipo}`, id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setDettaglio(snap.data());
      }
    };
    const fetchCampagne = async () => {
      const snap = await getDocs(collection(firestore, "campagne"));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCampagne(data);
    };
    
    fetchCampagne();
    fetchDettaglio();
  }, [id, tipo]);

  const caricaCapitoli = async (idCampagna) => {
      const snap = await getDocs(collection(firestore, `campagne/${idCampagna}/capitoli`));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCapitoli(data);
    };

    const caricaScene = async (idCampagna, idCapitolo) => {
      const snap = await getDocs(collection(firestore, `campagne/${idCampagna}/capitoli/${idCapitolo}/scene`));
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setScene(data);
    };

  const confermaCollegamento = async () => {
  if (!selectedCampagna || !selectedCapitolo || !selectedScena) {
    alert("Seleziona campagna, capitolo e scena.");
    return;
  }
  const ref = doc(
    firestore,
    `campagne/${selectedCampagna}/capitoli/${selectedCapitolo}/scene/${selectedScena}/collegamenti/${tipo}`,
    dettaglio.id
  );
  await setDoc(ref, dettaglio);
  alert(`Elemento collegato alla scena con successo!`);
  setShowCollegaForm(false);
  onClose();
};

  const handleElimina = async () => {
    if (window.confirm("Sei sicuro di voler eliminare questo elemento dall'Archivio?")) {
      await deleteDoc(doc(firestore, `archivio/${tipo}`, id));
      alert("Elemento eliminato dall'Archivio!");
      onClose();
    }
  };

  const handleCollega = () => {
    if (onCollega) {
      onCollega(dettaglio);
    }
    onClose();
  };

  if (!dettaglio) return null;

  return (
    <div className="modale-overlay">
      <div className="modale-archivio">
        <div className="modale-header">
          <h3>{dettaglio.nome || dettaglio.titolo || "Dettaglio Archivio"}</h3>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="modale-body">
          {/* Immagine */}
          {dettaglio.immagine && (
            <div className="image-container">
              <img src={dettaglio.immagine} alt="preview" />
            </div>
          )}

          {/* Dettagli principali */}
          <div className="details-container">
            <p><strong>Tipo:</strong> {tipo}</p>
            {dettaglio.classe && <p><strong>Classe:</strong> {dettaglio.classe}</p>}
            {dettaglio.razza && <p><strong>Razza:</strong> {dettaglio.razza}</p>}
            {dettaglio.livello && <p><strong>Livello:</strong> {dettaglio.livello}</p>}
            {dettaglio.allineamento && <p><strong>Allineamento:</strong> {dettaglio.allineamento}</p>}

            {dettaglio.narrativa && (
              <div className="narrativa-box">
                <h4>Narrativa</h4>
                <p>{dettaglio.narrativa.obiettivo && `Obiettivo: ${dettaglio.narrativa.obiettivo}`}</p>
                <p>{dettaglio.narrativa.motivazione && `Motivazione: ${dettaglio.narrativa.motivazione}`}</p>
                <p>{dettaglio.narrativa.origine && `Origine: ${dettaglio.narrativa.origine}`}</p>
                {dettaglio.narrativa.hook && <p><strong>Hook:</strong> {dettaglio.narrativa.hook}</p>}
                {dettaglio.narrativa.dialogo && <p><strong>Dialogo:</strong> “{dettaglio.narrativa.dialogo}”</p>}
              </div>
            )}
          </div>
        </div>

        {/* Azioni */}
        <div className="modale-actions">
          <button className="btn-collega" onClick={() => setShowCollegaForm(!showCollegaForm)}>
  🔗 Collega a Scena
</button>
          <button className="btn-elimina" onClick={handleElimina}>❌ Elimina</button>
        </div>
        {showCollegaForm && (
  <div className="collega-form">
    <h4>Collega a Scena</h4>
    <select
      value={selectedCampagna}
      onChange={(e) => {
        setSelectedCampagna(e.target.value);
        caricaCapitoli(e.target.value);
      }}
    >
      <option value="">-- Seleziona Campagna --</option>
      {campagne.map((c) => (
        <option key={c.id} value={c.id}>{c.nome || c.titolo}</option>
      ))}
    </select>

    <select
      value={selectedCapitolo}
      onChange={(e) => {
        setSelectedCapitolo(e.target.value);
        caricaScene(selectedCampagna, e.target.value);
      }}
      disabled={!selectedCampagna}
    >
      <option value="">-- Seleziona Capitolo --</option>
      {capitoli.map((cap) => (
        <option key={cap.id} value={cap.id}>{cap.titolo}</option>
      ))}
    </select>

    <select
      value={selectedScena}
      onChange={(e) => setSelectedScena(e.target.value)}
      disabled={!selectedCapitolo}
    >
      <option value="">-- Seleziona Scena --</option>
      {scene.map((s) => (
        <option key={s.id} value={s.id}>{s.titolo}</option>
      ))}
    </select>

    <button className="btn-conferma" onClick={confermaCollegamento}>Conferma</button>
  </div>
)}
{collegamentoInfo && (
  <p className="info-collegamento">
    Collegato a: {collegamentoInfo.scena} ({collegamentoInfo.capitolo})
  </p>
)}
      </div>
    </div>
  );
}
