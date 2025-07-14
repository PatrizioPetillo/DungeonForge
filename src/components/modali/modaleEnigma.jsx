import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import "../../styles/enigmaWidget.css";

const modelliEnigma = [
  {
    titolo: "Statue che parlano",
    tipo: "Indovinello",
    descrizione: "Tre statue indicano tre porte: una conduce alla salvezza, le altre alla morte. Devono rispondere a un indovinello per scegliere la porta giusta.",
  },
  {
    titolo: "Piastre a pressione",
    tipo: "Trappola",
    descrizione: "Pavimentazione con piastre. Solo alcune sono sicure. Un calcolo narrativo o prova Destrezza rivelerà il percorso sicuro.",
  },
  {
    titolo: "Le leve segrete",
    tipo: "Puzzle",
    descrizione: "Una parete contiene cinque leve: solo una apre la porta. Indizi parlano di simboli antichi impressi sul terreno.",
  },
  {
    titolo: "Il labirinto speculare",
    tipo: "Enigma",
    descrizione: "I corridoi rimbalzano su specchi magici. Le parole riviste al contrario formano la sequenza da seguire.",
  },
];

const ModaleEnigma = ({ onClose }) => {
  const [enigma, setEnigma] = useState({
    titolo: "",
    tipo: "",
    descrizione: "",
    soluzioni: "",
    creareTrappola: false,
  });

  const generaEnigmaCasuale = () => {
    const random = modelliEnigma[Math.floor(Math.random() * modelliEnigma.length)];
    setEnigma((prev) => ({ ...prev, ...random, soluzioni: "" }));
    toast.info(`Enigma generato: ${random.titolo}`);
  };

  const salvaEnigma = async () => {
    try {
      await addDoc(collection(firestore, "enigmi"), {
        ...enigma,
        createdAt: serverTimestamp(),
      });
      toast.success("Enigma salvato!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Errore salvataggio.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modale-enigma">
        <div className="modale-header">
          <h2>🧠 Enigma / Trappola</h2>
          <div className="icone-header">
            <button onClick={generaEnigmaCasuale} title="Genera casuale">🎲</button>
            <button onClick={salvaEnigma} title="Salva">💾</button>
            <button onClick={onClose} title="Chiudi">✖️</button>
          </div>
        </div>

        <div className="tab-bar">
          {["Dettagli", "Soluzione"].map((t) => (
            <button key={t} className={t === (enigma.tab || "Dettagli") ? "active" : ""} onClick={() => setEnigma((e) => ({ ...e, tab: t }))}>
              {t}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {enigma.tab === "Dettagli" && (
            <>
              <div className="field-group">
                <label>Titolo:</label>
                <input
                  value={enigma.titolo}
                  onChange={(e) => setEnigma((prev) => ({ ...prev, titolo: e.target.value }))}
                />
              </div>
              <div className="field-group">
                <label>Tipo:</label>
                <input
                  value={enigma.tipo}
                  onChange={(e) => setEnigma((prev) => ({ ...prev, tipo: e.target.value }))}
                />
              </div>
              <div className="field-group">
                <label>Descrizione del challenge:</label>
                <textarea
                  rows={4}
                  value={enigma.descrizione}
                  onChange={(e) => setEnigma((prev) => ({ ...prev, descrizione: e.target.value }))}
                />
              </div>
            </>
          )}

          {enigma.tab === "Soluzione" && (
            <div className="field-group">
              <label>Soluzione / Meccanica:</label>
              <textarea
                rows={4}
                placeholder="Es: le statue rispondono se il gruppo collabora..."
                value={enigma.soluzioni}
                onChange={(e) => setEnigma((prev) => ({ ...prev, soluzioni: e.target.value }))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModaleEnigma;
