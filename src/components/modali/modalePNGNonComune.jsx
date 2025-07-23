import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { generaPNGNonComuneCompleto } from "../../utils/generatorePNGNonComune";
import "../../styles/modalePNG.css";

export default function ModalePNGNonComune({ onClose }) {
  const [png, setPng] = useState({});
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("Generali");

  const tabs = [
    "Generali",
    "Narrativa",
    "Statistiche",
    "Competenze",
    "Combattimento",
    ...(png.magia ? ["Magia"] : []),
    "Equipaggiamento"
  ];

  const razze = ["Umano", "Elfo", "Nano", "Mezzorco", "Halfling", "Tiefling"];
  const classi = ["Guerriero", "Mago", "Ladro", "Chierico", "Barbaro", "Bardo", "Druido", "Paladino", "Ranger", "Stregone", "Warlock"];
  const background = ["Soldato", "Nobile", "Popolano", "Eremita", "Marinaio", "Artigiano"];

  const handleGenera = async () => {
    setLoading(true);
    const nuovoPNG = await generaPNGNonComuneCompleto();
    setPng({ ...nuovoPNG, ...png }); // mantiene eventuali modifiche manuali
    setLoading(false);

    // Fetch incantesimi reali da API
  if (nuovoPNG.magia) {
    fetchIncantesimi(nuovoPNG.classe.toLowerCase(), nuovoPNG.livello);
  }
  };

  const fetchIncantesimi = async (classe, livello) => {
  try {
    const res = await fetch("https://www.dnd5eapi.co/api/spells");
    const data = await res.json();
    const spells = data.results;

    // Filtra per classe
    const spellsFiltrati = spells.filter((s) => s.url.includes(classe));

    // Seleziona 5 incantesimi casuali fino al livello del PNG
    const selected = [];
    for (let i = 0; i < 5 && spellsFiltrati.length > 0; i++) {
      const spell = spellsFiltrati.splice(Math.floor(Math.random() * spellsFiltrati.length), 1)[0];
      const detail = await fetch(`https://www.dnd5eapi.co${spell.url}`).then((r) => r.json());
      if (detail.level <= livello) {
        selected.push({
          name: detail.name,
          level: detail.level,
          school: detail.school.name,
          desc: detail.desc[0] || ""
        });
      }
    }

    setPng((prev) => ({ ...prev, incantesimi: selected }));
  } catch (error) {
    console.error("Errore fetch incantesimi:", error);
  }
};

  const handleSalva = async () => {
    try {
      const doc = {
        ...png,
        tipo: "Non Comune",
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(firestore, "png"), doc);
      alert("PNG Non Comune salvato con successo!");
    } catch (err) {
      console.error("Errore salvataggio PNG:", err);
      alert("Errore durante il salvataggio.");
    }
  };

  return (
    <div className="modale-overlay">
      <div className="modale-png">
        <div className="modale-png-header">
          <h3>Generatore PNG Non Comune</h3>
          <div className="actions">
            <button onClick={handleGenera}>🎲 Genera</button>
            <button onClick={handleSalva} disabled={!png.nome}>💾 Salva</button>
            <button onClick={onClose}>❌ Chiudi</button>
          </div>
        </div>

        {loading && <p>Generazione in corso...</p>}

        {/* Tabs */}
        <div className="tab-selector">
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
                {/* Nome */}
                <div className="form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    placeholder="Inserisci il nome"
                    value={png.nome || ""}
                    onChange={(e) => setPng({ ...png, nome: e.target.value })}
                  />
                </div>

                {/* Razza */}
                <div className="form-group">
                  <label>Razza</label>
                  <select
                    value={png.razza || ""}
                    onChange={(e) => setPng({ ...png, razza: e.target.value })}
                  >
                    <option value="">Seleziona una razza</option>
                    {razze.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                {/* Classe */}
                <div className="form-group">
                  <label>Classe</label>
                  <select
                    value={png.classe || ""}
                    onChange={(e) => setPng({ ...png, classe: e.target.value })}
                  >
                    <option value="">Seleziona una classe</option>
                    {classi.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Livello */}
                <div className="form-group">
                  <label>Livello</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    placeholder="1-20"
                    value={png.livello || ""}
                    onChange={(e) => setPng({ ...png, livello: parseInt(e.target.value) })}
                  />
                </div>

                {/* Background */}
                <div className="form-group">
                  <label>Background</label>
                  <select
                    value={png.background || ""}
                    onChange={(e) => setPng({ ...png, background: e.target.value })}
                  >
                    <option value="">Seleziona background</option>
                    {background.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
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
                  placeholder="Descrizione del PNG"
                  value={png.descrizione || ""}
                  onChange={(e) => setPng({ ...png, descrizione: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Origine</label>
                <input
                  type="text"
                  placeholder="Origine"
                  value={png.origine || ""}
                  onChange={(e) => setPng({ ...png, origine: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Ruolo</label>
                <input
                  type="text"
                  placeholder="Ruolo"
                  value={png.ruolo || ""}
                  onChange={(e) => setPng({ ...png, ruolo: e.target.value })}
                />
              </div>
            </div>
          )}

          {tab === "Statistiche" && (
            <div className="tab-content">
              {Object.entries(png.stats || {}).map(([stat, val]) => (
                <div key={stat} className="form-group">
                  <label>{stat.toUpperCase()}</label>
                  <input
                    type="number"
                    value={val || ""}
                    onChange={(e) =>
                      setPng({
                        ...png,
                        stats: { ...png.stats, [stat]: parseInt(e.target.value) }
                      })
                    }
                  />
                </div>
              ))}
            </div>
          )}

          {tab === "Competenze" && (
            <div className="tab-content">
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label>Abilità di Classe</label>
                <input
                  type="text"
                  value={(png.abilitaClasse || []).join(", ")}
                  onChange={(e) =>
                    setPng({ ...png, abilitaClasse: e.target.value.split(",") })
                  }
                />
              </div>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label>Lingue</label>
                <input
                  type="text"
                  value={png.lingueBackground || ""}
                  onChange={(e) => setPng({ ...png, lingueBackground: e.target.value })}
                />
              </div>
            </div>
          )}

          {tab === "Combattimento" && (
            <div className="tab-content">
              <div className="form-group">
                <label>PF</label>
                <input
                  type="number"
                  value={png.pf || ""}
                  onChange={(e) => setPng({ ...png, pf: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>CA</label>
                <input
                  type="number"
                  value={png.ca || ""}
                  onChange={(e) => setPng({ ...png, ca: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Arma</label>
                <input
                  type="text"
                  value={png.arma || ""}
                  onChange={(e) => setPng({ ...png, arma: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Armatura</label>
                <input
                  type="text"
                  value={png.armatura || ""}
                  onChange={(e) => setPng({ ...png, armatura: e.target.value })}
                />
              </div>
            </div>
          )}

          {tab === "Magia" && png.magia && (
            <div className="tab-magia">
              {/* Info base magia */}
              <div className="magia-info-grid">
                <div className="form-group">
                  <label>Caratteristica Magica</label>
                  <input
                    type="text"
                    value={png.magia.caratteristica || ""}
                    onChange={(e) =>
                      setPng({ ...png, magia: { ...png.magia, caratteristica: e.target.value } })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>CD Incantesimi</label>
                  <input
                    type="number"
                    value={png.magia.cd || ""}
                    onChange={(e) =>
                      setPng({ ...png, magia: { ...png.magia, cd: parseInt(e.target.value) } })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Bonus Attacco Magico</label>
                  <input
                    type="number"
                    value={png.magia.bonusAttacco || ""}
                    onChange={(e) =>
                      setPng({ ...png, magia: { ...png.magia, bonusAttacco: parseInt(e.target.value) } })
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Focus</label>
                  <input
                    type="text"
                    value={png.magia.focus || ""}
                    onChange={(e) =>
                      setPng({ ...png, magia: { ...png.magia, focus: e.target.value } })
                    }
                  />
                </div>
              </div>

              {/* Tabella Slot Incantesimi */}
              <h4>Slot Incantesimi</h4>
              <table className="slot-table">
                <thead>
                  <tr>{png.slotIncantesimi.map((_, i) => <th key={i}>Lv.{i + 1}</th>)}</tr>
                </thead>
                <tbody>
                  <tr>{png.slotIncantesimi.map((slot, i) => <td key={i}>{slot}</td>)}</tr>
                </tbody>
              </table>

              {/* Lista Incantesimi */}
              <h4>Incantesimi Conosciuti</h4>
              <div className="spell-list">
                {png.incantesimi && png.incantesimi.length > 0 ? (
                  png.incantesimi.map((spell, i) => (
                    <div key={i} className="spell-card">
                      <strong>{spell.name}</strong> (Lv.{spell.level}) - {spell.school}
                      <p>{spell.desc}</p>
                    </div>
                  ))
                ) : (
                  <p>Nessun incantesimo disponibile</p>
                )}
              </div>

              {/* Aggiunta manuale incantesimi */}
              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label>Aggiungi Incantesimi (nome, separati da virgola)</label>
                <textarea
                  placeholder="Es: Palla di Fuoco, Scudo"
                  onBlur={(e) =>
                    setPng({
                      ...png,
                      incantesimi: e.target.value.split(",").map((name) => ({
                        name: name.trim(),
                        level: 1,
                        school: "Personalizzato",
                        desc: "Incantesimo personalizzato"
                      }))
                    })
                  }
                />
              </div>
            </div>
          )}

          {tab === "Equipaggiamento" && (
            <div className="tab-content">
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label>Cosa indossa</label>
                <input
                  type="text"
                  value={png.equipIndossato || ""}
                  onChange={(e) => setPng({ ...png, equipIndossato: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label>Cosa porta con sé</label>
                <textarea
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
