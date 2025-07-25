import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import { generaLuogo } from "../../utils/generatoreLuogo"; // Nuovo generatore
import "../../styles/modaleLuogo.css";

const ModaleLuogo = ({ onClose, onSave, luogo: initialLuogo }) => {
  const [luogo, setLuogo] = useState(
    initialLuogo || {
      nome: "",
      tipo: "",
      popolazione: 0,
      descrizione: "",
      immagine: "",
      risorse: [],
      autorita: { governante: "", governo: "" },
      religione: { principale: "", secondaria: "" },
      difese: [],
      clima: "",
      peculiarita: [],
      problema: "",
      hook: "",
      eventi: [],
      architettura: "",
      atmosfera: "",
      quartieri: [],
      gilde: [],
      leggende: [],
      collegamenti: { png: [], villain: [], capitoli: [] }
    }
  );

  const [tab, setTab] = useState("Generale");
  const [loading, setLoading] = useState(false);

  // GENERAZIONE CASUALE
  const handleGenera = () => {
    const nuovoLuogo = generaLuogo();
    setLuogo(nuovoLuogo);
  };

  // SALVATAGGIO FIRESTORE
  const handleSalva = async () => {
    if (!luogo.nome) {
      alert("Inserisci almeno il nome del luogo!");
      return;
    }
    setLoading(true);
    try {
      const dataToSave = {
        ...luogo,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await addDoc(collection(firestore, "luoghi"), dataToSave);
      alert("✅ Luogo salvato con successo!");
      setLoading(false);
      if (onSave) onSave(dataToSave);
      onClose();
    } catch (err) {
      console.error("Errore salvataggio luogo:", err);
      setLoading(false);
      alert("❌ Errore durante il salvataggio.");
    }
  };

  return (
    <div className="modale-overlay">
      <div className="modale-luogo">
        {/* HEADER */}
        <div className="modale-header">
          <h3>🌍 Luogo</h3>
          <div className="actions">
            <button onClick={handleGenera}>🎲 Genera</button>
            <button onClick={handleSalva}>💾 Salva</button>
            <button onClick={onClose}>✖ Chiudi</button>
          </div>
        </div>

        {loading && <p className="loading-text">⏳ Salvataggio in corso...</p>}

        {/* TABS */}
        <div className="tabs">
          {["Generale", "Dettagli", "Narrativa", "Collegamenti"].map((t) => (
            <button
              key={t}
              className={tab === t ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* CONTENUTO */}
        <div className="modale-body">
          {/* TAB GENERALE */}
          {tab === "Generale" && (
            <div className="tab-generale">
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  value={luogo.nome}
                  onChange={(e) => setLuogo({ ...luogo, nome: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Tipo</label>
                <select
                  value={luogo.tipo}
                  onChange={(e) => setLuogo({ ...luogo, tipo: e.target.value })}
                >
                  <option value="">-- Seleziona --</option>
                  {["Taverna", "Borgo", "Villaggio", "Città", "Metropoli"].map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Popolazione</label>
                <input
                  type="number"
                  value={luogo.popolazione}
                  onChange={(e) => setLuogo({ ...luogo, popolazione: parseInt(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label>Immagine (URL)</label>
                <input
                  type="text"
                  value={luogo.immagine}
                  onChange={(e) => setLuogo({ ...luogo, immagine: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Clima</label>
                <input
                  type="text"
                  value={luogo.clima}
                  onChange={(e) => setLuogo({ ...luogo, clima: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Descrizione</label>
                <textarea
                  value={luogo.descrizione}
                  onChange={(e) => setLuogo({ ...luogo, descrizione: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* TAB DETTAGLI */}
          {tab === "Dettagli" && (
            <div className="tab-dettagli">
              <div className="form-group">
                <label>Risorse Principali</label>
                <input
                  type="text"
                  value={luogo.risorse.join(", ")}
                  onChange={(e) => setLuogo({ ...luogo, risorse: e.target.value.split(",").map(s => s.trim()) })}
                />
              </div>

              <div className="form-group">
                <label>Autorità</label>
                <input
                  type="text"
                  placeholder="Governante"
                  value={luogo.autorita.governante}
                  onChange={(e) =>
                    setLuogo({ ...luogo, autorita: { ...luogo.autorita, governante: e.target.value } })
                  }
                />
                <input
                  type="text"
                  placeholder="Tipo di governo"
                  value={luogo.autorita.governo}
                  onChange={(e) =>
                    setLuogo({ ...luogo, autorita: { ...luogo.autorita, governo: e.target.value } })
                  }
                />
              </div>

              <div className="form-group">
                <label>Religione</label>
                <input
                  type="text"
                  placeholder="Divinità principale"
                  value={luogo.religione.principale}
                  onChange={(e) =>
                    setLuogo({ ...luogo, religione: { ...luogo.religione, principale: e.target.value } })
                  }
                />
                <input
                  type="text"
                  placeholder="Culto secondario"
                  value={luogo.religione.secondaria}
                  onChange={(e) =>
                    setLuogo({ ...luogo, religione: { ...luogo.religione, secondaria: e.target.value } })
                  }
                />
              </div>

              <div className="form-group">
                <label>Difese</label>
                <input
                  type="text"
                  value={luogo.difese.join(", ")}
                  onChange={(e) => setLuogo({ ...luogo, difese: e.target.value.split(",").map(s => s.trim()) })}
                />
              </div>

              <div className="form-group">
                <label>Architettura</label>
                <input
                  type="text"
                  value={luogo.architettura}
                  onChange={(e) => setLuogo({ ...luogo, architettura: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Atmosfera</label>
                <input
                  type="text"
                  value={luogo.atmosfera}
                  onChange={(e) => setLuogo({ ...luogo, atmosfera: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* TAB NARRATIVA */}
          {tab === "Narrativa" && (
            <div className="tab-narrativa">
              <div className="form-group">
                <label>Peculiarità</label>
                <input
                  type="text"
                  value={luogo.peculiarita.join(", ")}
                  onChange={(e) => setLuogo({ ...luogo, peculiarita: e.target.value.split(",").map(s => s.trim()) })}
                />
              </div>

              <div className="form-group">
                <label>Problema locale</label>
                <input
                  type="text"
                  value={luogo.problema}
                  onChange={(e) => setLuogo({ ...luogo, problema: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Hook narrativo</label>
                <textarea
                  value={luogo.hook}
                  onChange={(e) => setLuogo({ ...luogo, hook: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Leggende</label>
                <input
                  type="text"
                  value={luogo.leggende.join(", ")}
                  onChange={(e) => setLuogo({ ...luogo, leggende: e.target.value.split(",").map(s => s.trim()) })}
                />
              </div>

              <div className="form-group">
                <label>Eventi</label>
                <input
                  type="text"
                  value={luogo.eventi.join(", ")}
                  onChange={(e) => setLuogo({ ...luogo, eventi: e.target.value.split(",").map(s => s.trim()) })}
                />
              </div>
            </div>
          )}

          {/* TAB COLLEGAMENTI */}
          {tab === "Collegamenti" && (
            <div className="tab-collegamenti">
              <p>In futuro qui inseriremo i collegamenti con PNG, Villain e Scene.</p>
            </div>
          )}
        </div>
        <div className="luogo-img">
      {luogo.immagine ? (
        <img src={luogo.immagine} alt={luogo.nome || "Luogo"} />
      ) : (
        <p>Nessuna immagine</p>
      )}
    </div>
      </div>
    </div>
  );
};

export default ModaleLuogo;
