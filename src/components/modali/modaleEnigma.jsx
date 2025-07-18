import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import "../../styles/enigmaWidget.css";

const modelliEnigma = [
  {
    titolo: "Statue che parlano",
    tipo: "Indovinello",
    descrizione: "Tre statue indicano tre porte: una conduce alla salvezza, le altre alla morte. Rispondere correttamente all'indovinello rivelerà la via sicura.",
    indovinello: "Qual è la cosa che cammina con quattro zampe al mattino, due a mezzogiorno e tre alla sera?",
    soluzioni: "L'essere umano (quattro zampe da neonato, due da adulto, con il bastone da anziano).",
  },
  {
    titolo: "Piastre a pressione",
    tipo: "Trappola",
    descrizione: "Pavimentazione con piastre, alcune bianche ed altre nere. Solo alcune sono sicure, le altre faranno cadere il gruppo nel vuoto....",
    soluzioni: "Il gruppo deve posizionarsi sulla piastra più consumata, e poi muoversi come il cavallo degli scacchi: due passi avanti, uno a destra o sinistra.",
  },
  {
    titolo: "Le leve segrete",
    tipo: "Puzzle",
    descrizione: "Una parete contiene cinque leve: solo una apre la porta. Ogni leva ha un simbolo unico. Il gruppo deve fare attenzione: se si tira la leva sbagliata, scatta una trappola.",
    soluzioni: "Non importa quale, ma quando si tira una leva, a metà del percorso, si sente un clic. Si deve tenere la leva in quella posizione, per 3 secondi, per aprire la porta.",
  },
  {
    titolo: "Il labirinto speculare",
    tipo: "Enigma",
    descrizione: "I corridoi rimbalzano su specchi magici. Per uscire, il gruppo deve trovare le parole che li guidano verso l'uscita: un enigma riflessivo.",
    soluzioni: "Le parole riviste al contrario formano la sequenza da seguire.",
  },
];

const ModaleEnigma = ({ onClose }) => {
  
  const [enigma, setEnigma] = useState({
    tab: "Dettagli",
    titolo: "",
    tipo: "",
    descrizione: "",
    soluzioni: "",
    prova: "",
  cd: "",
  effettoFallimento: "",
    creareTrappola: false,
  });
  
  const prove = [
  { abilita: "Intelligenza (Enigmi)", cd: 13 },
  { abilita: "Saggezza (Percezione)", cd: 15 },
  { abilita: "Destrezza (Rapidità di mano)", cd: 14 },
  { abilita: "Carisma (Persuasione)", cd: 12 },
];

const effetti = [
  "1d6 danni da fuoco",
  "Perdita temporanea della vista per 1 minuto",
  "Allarme attivato: mostri in arrivo",
  "Trappola esplosiva (2d8 danni da forza)",
  "Caduta in una fossa (CD 15 Destrezza per evitarla)",
];

  const generaEnigmaCasuale = () => {
  const random = modelliEnigma[Math.floor(Math.random() * modelliEnigma.length)];
  const provaCasuale = prove[Math.floor(Math.random() * prove.length)];
  const effetto = effetti[Math.floor(Math.random() * effetti.length)];

  setEnigma((prev) => ({
    ...prev,
    ...random,
    soluzioni: random.soluzioni,
    prova: provaCasuale.abilita,
    cd: provaCasuale.cd,
    effettoFallimento: effetto,
  }));
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
                <label>Descrizione:</label>
                <textarea
                  rows={4}
                  value={enigma.descrizione}
                  onChange={(e) => setEnigma((prev) => ({ ...prev, descrizione: e.target.value }))}
                />
              </div>
              <hr />
              <div className="field-group">
  <label>Prova richiesta:</label>
  <input
    value={enigma.prova}
    onChange={(e) => setEnigma((prev) => ({ ...prev, prova: e.target.value }))}
    placeholder="Es: Intelligenza (Enigmi)"
  />
</div>
<div className="field-group">
  <label>CD (Classe Difficoltà):</label>
  <input
    type="number"
    value={enigma.cd}
    onChange={(e) => setEnigma((prev) => ({ ...prev, cd: e.target.value }))}
  />
</div>
<div className="field-group">
  <label>Effetto al fallimento:</label>
  <textarea
    rows={2}
    value={enigma.effettoFallimento}
    onChange={(e) => setEnigma((prev) => ({ ...prev, effettoFallimento: e.target.value }))}
    placeholder="Es: Allarme attivato o 1d6 danni da fuoco"
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
