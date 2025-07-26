import React, { useState } from "react";
import { salvaInArchivio } from "../../utils/firestoreArchivio";
import { toast } from "react-toastify";
import {
  generaHookEnigma,
  generaFraseEnigma,
  genera3HookEnigma,
  genera3FrasiEnigma
} from "../../utils/narrativeGenerators";

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
  const [opzioniHook, setOpzioniHook] = useState([]);
const [opzioniFrasi, setOpzioniFrasi] = useState([]);

  
  const prove = [
  { abilita: "Intelligenza (Enigmi)", cd: 13 },
  { abilita: "Saggezza (Percezione)", cd: 15 },
  { abilita: "Destrezza (Rapidità di mano)", cd: 14 },
  { abilita: "Carisma (Persuasione)", cd: 12 },
  { abilita: "Forza (Atletica)", cd: 16 },
  { abilita: "Intelligenza (Arcana)", cd: 18 },
  { abilita: "Intelligenza (Storia)", cd: 17 },
  { abilita: "Saggezza (Intuizione)", cd: 14 },
];

const effetti = [
  "1d6 danni da fuoco",
  "Perdita temporanea della vista per 1 minuto",
  "Allarme attivato: un basso vibrare sembra provenire dalle pareti. In lontananza, ruggiti e versi si avvicinano",
  "Trappola esplosiva (2d8 danni da forza)",
  "Caduta in una fossa (CD 15 Destrezza per evitarla)",
  "Inizio di un combattimento con un mostro nascosto",
  "Rallentamento del gruppo (movimento dimezzato per 1 minuto)",
  "Inversione del movimento per 1 minuto (destra diventa sinistra e viceversa)",
  "Rivelazione di un passaggio segreto che conduce a una stanza nascosta",
  "Rivelazione di un oggetto magico nascosto che può essere utile",
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

 const handleSalva = async () => {
    const ok = await salvaInArchivio("enigmi", enigma);
    if (ok) {
      alert("Enigma salvato nell'Archivio!");
      onClose();
    }
  };
  
  return (
    <div className="modal-overlay">
      <div className="modale-enigma">
        <div className="modale-header">
          <h2>🧠 Enigma / Trappola</h2>
          <div className="icone-header">
            <button onClick={generaEnigmaCasuale} title="Genera casuale">🎲</button>
            <button onClick={handleSalva} title="Salva">💾</button>
            <button onClick={onClose} title="Chiudi">✖️</button>
          </div>
        </div>

        <div className="tabs">
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
              <div className="narrative-tools">
  <button onClick={() => setEnigma({ ...enigma, narrativa: { ...enigma.narrativa, hook: generaHookEnigma() } })}>🎭 Genera Hook</button>
  <button onClick={() => setEnigma({ ...enigma, narrativa: { ...enigma.narrativa, frase: generaFraseEnigma() } })}>💬 Genera Frase</button>
  <button onClick={() => setOpzioniHook(genera3HookEnigma())}>🎲 3 Hook</button>
  <button onClick={() => setOpzioniFrasi(genera3FrasiEnigma())}>🎲 3 Frasi</button>
</div>

{opzioniHook.length > 0 && (
  <div className="varianti-container">
    <h4>Scegli un Hook:</h4>
    {opzioniHook.map((h, i) => (
      <button key={i} onClick={() => {
        setEnigma({ ...enigma, narrativa: { ...enigma.narrativa, hook: h } });
        setOpzioniHook([]);
      }}>
        {h}
      </button>
    ))}
  </div>
)}

{opzioniFrasi.length > 0 && (
  <div className="varianti-container">
    <h4>Scegli una Frase:</h4>
    {opzioniFrasi.map((f, i) => (
      <button key={i} onClick={() => {
        setEnigma({ ...enigma, narrativa: { ...enigma.narrativa, frase: f } });
        setOpzioniFrasi([]);
      }}>
        {f}
      </button>
    ))}
  </div>
)}

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
