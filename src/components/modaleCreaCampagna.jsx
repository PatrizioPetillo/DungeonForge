import React, { useState } from "react";
import CapitoloEditor from "./capitoloEditor";
import MostroAPISelector from "./mostroAPISelector";
import MostroManualeForm from "./mostroManualeForm";

import "../styles/modaleCreaCampagna.css";

function ModaleCreaCampagna({ onClose }) {
  const [tab, setTab] = useState("Generale");
  const [dati, setDati] = useState({
    titolo: "",
    tipo: "",
    stato: "",
    ambientazione: "",
    obiettivo: "",
    hookNarrativo: "",
    tagNarrativi: [],
    blurb: "",
    durataStimata: "",
    durataTipo: "sessioni",
    prologo: "",
    finale: "",
    capitoli: [],
    villain: null,
    png: [],
    luoghi: [],
    incontri: [],
    mostri: [], // necessario per la nuova tab "Mostri"
  });
  const [showAPISelector, setShowAPISelector] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showAPI, setShowAPI] = useState(false);

  const handleChange = (campo, valore) => {
    setDati((prev) => ({ ...prev, [campo]: valore }));
  };

  const renderTab = () => {
    switch (tab) {
      case "Generale":
        return (
          <div className="tab-content">
            <label>Titolo</label>
            <input
              value={dati.titolo}
              onChange={(e) => handleChange("titolo", e.target.value)}
            />
            <hr />
            {/* 🎯 Obiettivo della Campagna */}
            <label>🎯 Obiettivo</label>
            <textarea
              value={campagna.obiettivo || ""}
              onChange={(e) =>
                setCampagna({ ...campagna, obiettivo: e.target.value })
              }
              placeholder="Es: Sventare l’invasione demoniaca del Piano Materiale..."
              rows={2}
            />

            {/* 📣 Hook Narrativo */}
            <label>📣 Hook Narrativo</label>
            <textarea
              value={campagna.hookNarrativo || ""}
              onChange={(e) =>
                setCampagna({ ...campagna, hookNarrativo: e.target.value })
              }
              placeholder="Es: Una cometa si schianta vicino a un villaggio, scatenando eventi inspiegabili..."
              rows={2}
            />

            {/* 🏷️ Tag Narrativi */}
            <label>🏷️ Tag Narrativi</label>
            <select
              multiple
              value={campagna.tagNarrativi || []}
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setCampagna({ ...campagna, tagNarrativi: selected });
              }}
            >
              <option value="Horror">Horror</option>
              <option value="Investigativo">Investigativo</option>
              <option value="Dungeon Crawl">Dungeon Crawl</option>
              <option value="Comico">Comico</option>
              <option value="Politico">Politico</option>
              <option value="Survival">Survival</option>
              <option value="Epico">Epico</option>
            </select>

            {/* 🧾 Blurb Evocativo */}
            <label>🧾 Blurb Evocativo</label>
            <textarea
              value={campagna.blurb || ""}
              onChange={(e) =>
                setCampagna({ ...campagna, blurb: e.target.value })
              }
              placeholder="Un'avventura in un regno spezzato, dove la verità è sepolta nei sogni..."
              rows={2}
            />

            {/* ⌛ Durata Stimata */}
            <label>⌛ Durata Stimata</label>
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <input
                type="number"
                min={1}
                value={campagna.durataStimata || ""}
                onChange={(e) =>
                  setCampagna({
                    ...campagna,
                    durataStimata: parseInt(e.target.value),
                  })
                }
                placeholder="Es: 8"
                style={{ width: "80px" }}
              />
              <select
                value={campagna.durataTipo || "sessioni"}
                onChange={(e) =>
                  setCampagna({ ...campagna, durataTipo: e.target.value })
                }
              >
                <option value="sessioni">Sessioni</option>
                <option value="settimane">Settimane</option>
              </select>
            </div>

            <label>Tipo</label>
            <select
              value={dati.tipo}
              onChange={(e) => handleChange("tipo", e.target.value)}
            >
              <option>Campagna lunga</option>
              <option>Mini-campagna</option>
              <option>One-Shot</option>
            </select>

            <label>Stato</label>
            <select
              value={dati.stato}
              onChange={(e) => handleChange("stato", e.target.value)}
            >
              <option>Bozza</option>
              <option>Attiva</option>
              <option>Archiviata</option>
            </select>

            <label>Ambientazione</label>
            <select
              value={dati.ambientazione || ""}
              onChange={(e) => handleChange("ambientazione", e.target.value)}
            >
              <option disabled value="">
                Seleziona ambientazione
              </option>
              <option>Forgotten Realms</option>
              <option>Eberron</option>
              <option>Ravenloft</option>
              <option>Dragonlance</option>
              <option>Exandria</option>
              <option value="homebrew">Homebrew</option>
            </select>

            {dati.ambientazione === "homebrew" && (
              <button onClick={() => console.log("Avvia Worldbuilding!")}>
                🛠️ Avvia Worldbuilding
              </button>
            )}
          </div>
        );

      case "Narrativa":
        const aggiornaCapitolo = (index, nuovoCapitolo) => {
          const nuoviCapitoli = [...(dati.capitoli || [])];
          nuoviCapitoli[index] = nuovoCapitolo;
          handleChange("capitoli", nuoviCapitoli);
        };

        const aggiungiCapitolo = () => {
          const nuovo = {
            titolo: "",
            descrizione: "",
            scene: [],
          };
          handleChange("capitoli", [...(dati.capitoli || []), nuovo]);
        };

        const rimuoviCapitolo = (index) => {
          const nuovi = [...(dati.capitoli || [])];
          nuovi.splice(index, 1);
          handleChange("capitoli", nuovi);
        };

        return (
          <div className="tab-content narrativa-tab">
            <label>Prologo</label>
            <textarea
              placeholder="Testo introduttivo..."
              value={dati.prologo || ""}
              onChange={(e) => handleChange("prologo", e.target.value)}
            />

            <h3>📚 Capitoli</h3>
            {(dati.capitoli || []).map((cap, index) => (
              <CapitoloEditor
                key={index}
                capitolo={cap}
                onUpdate={(updated) => aggiornaCapitolo(index, updated)}
                onRemove={() => rimuoviCapitolo(index)}
              />
            ))}
            <button onClick={aggiungiCapitolo}>➕ Aggiungi Capitolo</button>

            <label>Finale</label>
            <textarea
              placeholder="Epica conclusione o finale aperto..."
              value={dati.finale || ""}
              onChange={(e) => handleChange("finale", e.target.value)}
            />
          </div>
        );

      case "Villain":
        return (
          <div className="tab-content">
            <p>🧙‍♂️ Aggiungi un Villain o generane uno</p>
            <button>+ Genera Villain</button>
            <button>+ Scegli dall’Archivio</button>
          </div>
        );
      case "PNG":
        return (
          <div className="tab-content">
            <p>👤 Seleziona PNG salvati o aggiungi nuovi</p>
            <button>+ Genera PNG</button>
            <button>+ Scegli dall’Archivio</button>
          </div>
        );
      case "Luoghi":
        return (
          <div className="tab-content">
            <p>🏰 Inserisci luoghi chiave della campagna</p>
            <button>+ Aggiungi luogo</button>
            <button>+ Scegli dall’Archivio</button>
          </div>
        );

      case "Mostri":
        const aggiungiMostro = (mostro) => {
          handleChange("mostri", [...(dati.mostri || []), mostro]);
        };

        const rimuoviMostro = (index) => {
          const nuovi = [...(dati.mostri || [])];
          nuovi.splice(index, 1);
          handleChange("mostri", nuovi);
        };

        const tutteLeScene =
          dati.capitoli?.flatMap((cap) =>
            cap.scene?.map((s) => ({
              id: s.id,
              titolo: `${cap.titolo} → ${s.titolo}`,
            }))
          ) || [];

        return (
          <div className="tab-content">
            <h4>🧟 Mostri aggiunti ({dati.mostri?.length || 0})</h4>
            {(dati.mostri || []).map((m, i) => (
              <div key={i} className="mostro-box">
                <strong>{m.nome || "Mostro senza nome"}</strong> (GS{" "}
                {m.gs || "?"}) – CA: {m.ca}, PF: {m.pf}
                <br />
                <em>{m.descrizione?.slice(0, 80)}...</em>
                <br />
                <label>
                  Collegato alla scena:
                  <select
                    value={m.scenaAssociata || ""}
                    onChange={(e) => {
                      const nuovi = [...dati.mostri];
                      nuovi[i].scenaAssociata = e.target.value;
                      handleChange("mostri", nuovi);
                    }}
                  >
                    <option value="">-- Nessuna --</option>
                    {tutteLeScene.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.titolo}
                      </option>
                    ))}
                  </select>
                </label>
                <hr />
                <button onClick={() => rimuoviMostro(i)}>❌ Rimuovi</button>
              </div>
            ))}

            <div className="mostro-actions">
              <button onClick={() => setShowManualForm(true)}>
                📝 Crea Mostro Manuale
              </button>
              <button onClick={() => setShowAPISelector(true)}>
                📚 Scegli da API
              </button>
            </div>

            {showAPISelector && (
              <MostroAPISelector
                onAdd={aggiungiMostro}
                onClose={() => setShowAPISelector(false)}
              />
            )}

            {showManualForm && (
              <MostroManualeForm
                onSave={(m) => {
                  aggiungiMostro(m);
                  setShowManualForm(false);
                }}
                onCancel={() => setShowManualForm(false)}
              />
            )}
          </div>
        );

      case "Incontri":
        return (
          <div className="tab-content">
            <p>⚔️ Inserisci mostri, nemici o eventi scriptati</p>
            <button>+ Genera Incontro</button>
            <button>+ Scegli Mostro dall’Archivio</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="modale-overlay">
      <div className="modale-content">
        <div className="modale-header">
          <h2>+ Crea nuova campagna</h2>
          <button onClick={onClose}>❌</button>
        </div>
        <div className="tab-selector">
          {[
            "Generale",
            "Narrativa",
            "Villain",
            "PNG",
            "Luoghi",
            "Mostri",
            "Incontri",
          ].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={tab === t ? "active" : ""}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="modale-body">{renderTab()}</div>
        <div className="modale-footer">
          <button className="salva-btn">💾 Salva Campagna</button>
        </div>
      </div>
    </div>
  );
}

export default ModaleCreaCampagna;
