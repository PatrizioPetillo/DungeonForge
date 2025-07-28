import React, { useState, useEffect } from "react";
import Lottie from "lottie-react";
import loadingAnim from "../../assets/lottie/Animation-Calderone.json";
import { completaPNGComune } from "../../utils/generators";
import { salvaInArchivio } from "../../utils/firestoreArchivio";
import {
  generaHookPNG,
  generaDialogoPNG,
  genera3HookPNG,
  genera3DialoghiPNG
} from "../../utils/narrativeGenerators";
import { toast } from "react-toastify";
import ModaleCollegamento from "../modali/modaleCollegamento";
import { collegaElementoACampagna } from "../../utils/campagneUtils";
import "../../styles/modalePNG.css";

export default function ModalePNGComune({ onClose }) {
  const [png, setPng] = useState({});
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("Generali");
  const [opzioniHook, setOpzioniHook] = useState([]);
const [opzioniDialogo, setOpzioniDialogo] = useState([]);
const [showCollegamento, setShowCollegamento] = useState(false);
const [elementoId, setElementoId] = useState(null);
const [isSaving, setIsSaving] = useState(false);


  const tabs = ["Generali", "Narrativa", "Equipaggiamento"];

  const handleGenera = () => {
    setLoading(true);
    const nuovoPNG = completaPNGComune({});
    setPng({ ...png, ...nuovoPNG }); // sovrascrive con valori generati
    setLoading(false);
  };

  const handleSalva = async () => {
     setIsSaving(true);
  const data = { ...png, tipo: "comune" };
  const result = await salvaInArchivio("png", data);

  if (result.success) {
    data.id = result.id; // 🔥 Aggiungi ID al PNG
    toast.success("✅ PNG salvato in Archivio!");

    if (collegaElementoACampagna && onSave) {
      onSave(data);
    }
    setTimeout(() => {
      setIsSaving(false);
      onClose(); // chiude la modale
    }, 1000);
  } else {
    toast.error("❌ Errore nel salvataggio!");
  }
};


    const initialData = {
  nome: "",
  cognome: "",
  razza: "",
  mestiere: "",
  descrizione: "",
  note: "",
};

    useEffect(() => {
  if (png) {
    setPng(png); // o setPNG(...)
  }
}, [png]);


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
        {isSaving && (
          <div className="saving-overlay">
            <Lottie animationData={loadingAnim} style={{ height: 120 }} loop />
            <p>Salvataggio in corso...</p>
          </div>
        )}

        <div className="tabs-comune">
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
                    <option value="Guardaboschi">Guardaboschi</option>
                    <option value="Guaritore">Guaritore</option>
                    <option value="Guardia">Guardia Cittadina</option>
                    <option value="Locandiere">Locandiere</option>
                    <option value="Mercante">Mercante</option>
                    <option value="Mercenario">Mercenario</option>
                    <option value="Sacerdote">Sacerdote</option>
                    <option value="Sarto">Sarto</option>
                    <option value="Stalliere">Stalliere</option>
                    <option value="Vagabondo">Vagabondo</option>
                    <option value="Veterinario">Veterinario</option>
                    <option value="Viandante">Viandante</option>
                    <option value="Studioso">Studioso</option>
                    <option value="Ladro">Ladro</option>
                    <option value="Guida">Guida</option>
                    <option value="Artigiano">Artigiano</option>
                    <option value="Guardia cittadina">Guardia cittadina</option>
                    <option value="Contadino">Contadino</option>
                    <option value="Cultista">Cultista</option>
                    <option value="Guardiano">Guardiano</option>
                    <option value="Cacciatore di taglie">Cacciatore di taglie</option>
                    <option value="Artista">Artista</option>
                    <option value="Bardo">Bardo</option>
                    <option value="Saggio">Saggio</option>
                    <option value="Guaritore">Guaritore</option>
                    <option value="Cavaliere errante">Cavaliere errante</option>
                    <option value="Esploratore">Esploratore</option>
                    <option value="Guardaboschi">Guardaboschi</option>
                    <option value="Cacciatore di reliquie">Cacciatore di reliquie</option>
                    <option value="Guardiano del tempio">Guardiano del tempio</option>
                    <option value="Custode della biblioteca">Custode della biblioteca</option>
                    <option value="Maestro di spada">Maestro di spada</option>
                    <option value="Alchimista">Alchimista</option>
                    <option value="Cartografo">Cartografo</option>
                    <option value="Costruttore di armi">Costruttore di armi</option>
                    <option value="Mercenario">Mercenario</option>
                    <option value="Cavaliere errante">Cavaliere errante</option>
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
        {showCollegamento && (
  <ModaleCollegamento
    idElemento={elementoId}
    tipoElemento="png"
    onClose={() => setShowCollegamento(false)}
  />
)}

      </div>
    </div>
  );
}
