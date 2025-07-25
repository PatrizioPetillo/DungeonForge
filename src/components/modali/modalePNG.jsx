import React, { useState } from "react";
import { completaPNGComune } from "../../utils/generators";
import { salvaInArchivio } from "../../utils/firestoreArchivio";
import {
  generaHookPNG,
  generaDialogoPNG,
  genera3HookPNG,
  genera3DialoghiPNG
} from "../../utils/narrativeGenerators";


import "../../styles/modalePNG.css";

export default function ModalePNGComune({ onClose }) {
  const [png, setPng] = useState({});
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("Generali");
  const [opzioniHook, setOpzioniHook] = useState([]);
const [opzioniDialogo, setOpzioniDialogo] = useState([]);


  const tabs = ["Generali", "Narrativa", "Equipaggiamento"];

  const handleGenera = () => {
    setLoading(true);
    const nuovoPNG = completaPNGComune({});
    setPng({ ...png, ...nuovoPNG }); // sovrascrive con valori generati
    setLoading(false);
  };

  const handleSalva = async () => {
    const data = { ...png, tipo: "Comune" };
    const ok = await salvaInArchivio("png", data);
    if (ok) {
      alert("PNG salvato nell'Archivio!");
      onClose();
    }
  };


  return (
    <div className="modale-overlay">
      <div className="modale-png">
        <div className="modale-png-header">
          <h3>Generatore PNG Comune</h3>
          <div className="actions">
            <button onClick={handleGenera}>🎲 Genera</button>
            <button onClick={handleSalva} disabled={!png.nome}>💾 Salva</button>
            <button onClick={onClose}>❌ Chiudi</button>
          </div>
        </div>

        {loading && <p>Generazione in corso...</p>}

        <div className="tabs">
          {tabs.map((t) => (
            <button
              key={t}
              className={tab === t ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="modale-body">
          {tab === "Generali" && (
            <div className="info-section">
              <div className="form-fields">
                <div className="form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    placeholder="Inserisci il nome"
                    value={png.nome || ""}
                    onChange={(e) => setPng({ ...png, nome: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Razza</label>
                  <select
                    value={png.razza || ""}
                    onChange={(e) => setPng({ ...png, razza: e.target.value })}
                  >
                    <option value="">Seleziona una razza</option>
                    <option value="Aasimar">Aasimar</option>
                    <option value="Bugbear">Bugbear</option>
                    <option value="Dragonide">Dragonide</option>
                    <option value="Elfo">Elfo</option>
                    <option value="Goblin">Goblin</option>
                    <option value="Goliath">Goliath</option>
                    <option value="Gnomo">Gnomo</option>
                    <option value="Halfling">Halfling</option>
                    <option value="Mezzelfo">Mezzelfo</option>
                    <option value="Mezzorco">Mezzorco</option>
                    <option value="Nano">Nano</option>
                    <option value="Tiefling">Tiefling</option>
                    <option value="Umano">Umano</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Mestiere</label>
                  <select
                    value={png.mestiere || ""}
                    onChange={(e) => setPng({ ...png, mestiere: e.target.value })}
                  >
                    <option value="">Seleziona mestiere</option>
                    <option value="Alchimista">Alchimista</option>
                    <option value="Artigiano">Artigiano</option>
                    <option value="Cacciatore">Cacciatore di Taglie</option>
                    <option value="Cameriera">Cameriera</option>
                    <option value="Erborista">Erborista</option>
                    <option value="Guardia">Guardia Cittadina</option>
                    <option value="Locandiere">Locandiere</option>
                    <option value="Mercante">Mercante</option>
                    <option value="Mercenario">Mercenario</option>
                    <option value="Sacerdote">Sacerdote</option>
                    <option value="Sarto">Sarto</option>
                    <option value="Stalliere">Stalliere</option>
                    <option value="Vagabondo">Vagabondo</option>
                  </select>
                </div>
              </div>

              <div className="image-section">
                <label>Immagine PNG</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () =>
                        setPng({ ...png, immagine: reader.result });
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {png.immagine && <img src={png.immagine} alt="Anteprima PNG" />}
              </div>
            </div>
          )}

          {tab === "Narrativa" && (
            <div className="tab-content">
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label>Descrizione</label>
                <textarea
                 rows={4}  // puoi aumentare
  style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                  placeholder="Scrivi una descrizione"
                  value={png.descrizione || ""}
                  onChange={(e) => setPng({ ...png, descrizione: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Origine</label>
                <textarea
                  type="text"
                   rows={4}  // puoi aumentare
  style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                  placeholder="Origine del PNG"
                  value={png.origine || ""}
                  onChange={(e) => setPng({ ...png, origine: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Ruolo</label>
                <input
                  type="text"
                  placeholder="Ruolo narrativo"
                  value={png.ruolo || ""}
                  onChange={(e) => setPng({ ...png, ruolo: e.target.value })}
                />
              </div>
             <hr />
             <div className="narrative-tools">
  <button
    onClick={() => setPng({ ...png, narrativa: { ...png.narrativa, hook: generaHookPNG() } })}
  >
    🎭 Genera Hook
  </button>
  <button
    onClick={() => setPng({ ...png, narrativa: { ...png.narrativa, dialogo: generaDialogoPNG() } })}
  >
    💬 Genera Dialogo
  </button>
  <button onClick={() => setOpzioniHook(genera3HookPNG())}>🎲 3 Hook</button>
  <button onClick={() => setOpzioniDialogo(genera3DialoghiPNG())}>🎲 3 Dialoghi</button>
</div>
{opzioniHook.length > 0 && (
  <div className="varianti-container">
    <h4>Scegli un Hook:</h4>
    {opzioniHook.map((h, i) => (
      <button key={i} onClick={() => {
        setPng({ ...png, narrativa: { ...png.narrativa, hook: h } });
        setOpzioniHook([]);
      }}>
        {h}
      </button>
    ))}
  </div>
)}

{opzioniDialogo.length > 0 && (
  <div className="varianti-container">
    <h4>Scegli un Dialogo:</h4>
    {opzioniDialogo.map((d, i) => (
      <button key={i} onClick={() => {
        setPng({ ...png, narrativa: { ...png.narrativa, dialogo: d } });
        setOpzioniDialogo([]);
      }}>
        {d}
      </button>
    ))}
  </div>
)}


<div className="narrative-results">
  <p><strong>Hook:</strong> {png.narrativa?.hook || "Nessun hook generato"}</p>
  <p><strong>Dialogo:</strong> {png.narrativa?.dialogo || "Nessun dialogo generato"}</p>
</div>
 
            </div>
          )}

          {tab === "Equipaggiamento" && (
            <div className="tab-content">
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label>Cosa indossa</label>
                <input
                  type="text"
                   rows={2}  // puoi aumentare
  style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                  placeholder="Es. Tunica, stivali"
                  value={png.equipIndossato || ""}
                  onChange={(e) => setPng({ ...png, equipIndossato: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label>Cosa porta con sé</label>
                <textarea
                 rows={2}  // puoi aumentare
  style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
                  placeholder="Oggetti trasportati"
                  value={png.equipPortato || ""}
                  onChange={(e) => setPng({ ...png, equipPortato: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
