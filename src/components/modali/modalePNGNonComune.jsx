import React, { useState, useEffect } from "react";
import { salvaInArchivio } from "../../utils/firestoreArchivio";
import { generaPNGNonComuneCompleto } from "../../utils/generatorePNGNonComune";
import { armi } from "../../utils/armi";
import { armature } from "../../utils/armature";
import {
  generaHookPNG,
  generaDialogoPNG,
  genera3HookPNG,
  genera3DialoghiPNG
} from "../../utils/narrativeGenerators";
import { toast } from "react-toastify";
import ModaleCollegamento from "../modali/modaleCollegamento";
import "../../styles/modalePNG.css";

const abilitaPerStat = {
  forza: ["Atletica"],
  destrezza: ["Acrobazia", "Furtività", "Rapidità di mano"],
  costituzione: [],
  intelligenza: ["Arcano", "Indagare", "Storia", "Natura", "Religione"],
  saggezza: ["Percezione", "Intuizione", "Medicina", "Sopravvivenza", "Addestrare Animali"],
  carisma: ["Persuasione", "Inganno", "Intrattenere", "Intimidire"]
};

export default function ModalePNGNonComune({ onClose }) {
  const [png, setPng] = useState({});
  const [pngNonComune, setPNGNonComune] = useState({
    nome: "",
    descrizione: "",
    immagine: "",
    statistiche: {
      forza: 0,
      destrezza: 0,
      costituzione: 0,
      intelligenza: 0,
      saggezza: 0,
      carisma: 0
    },
    abilita: [],
    incantesimi: []
  });
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("Generali");
  const [spellSuggeriti, setSpellSuggeriti] = useState([]);
  const [opzioniHook, setOpzioniHook] = useState([]);
const [opzioniDialogo, setOpzioniDialogo] = useState([]);
const [showCollegamento, setShowCollegamento] = useState(false);
const [elementoId, setElementoId] = useState(null);
const [modalePNGNonComuneAperta, setModalePNGNonComuneAperta] = useState(false);


  const tabs = [
    "Generali",
    "Classe",
    "Statistiche",
    "Combattimento",
    ...(png.magia ? ["Magia"] : []),
    "Equipaggiamento",
    "Narrativa"
  ];

  // Funzione per filtrare gli incantesimi in base alla query
  const filtraIncantesimi = (query) => {
  if (!query) {
    setSpellSuggeriti([]);
    return;
  }
  const classeKey = png.classe?.toLowerCase();
  if (!classeKey || !spells[classeKey]) return;

  const listaIncantesimi = [
    ...spells[classeKey].cantrips || [],
    ...Object.values(spells[classeKey]).flat().filter(sp => sp.level > 0)
  ];

  const risultati = listaIncantesimi.filter(sp =>
    sp.name.toLowerCase().includes(query.toLowerCase())
  );

  setSpellSuggeriti(risultati.slice(0, 6)); // max 6 suggerimenti
};

  // Funzione per calcolare la CA dinamica
const calcolaCA = (stats, armature) => {
  let baseCA = 10 + Math.floor((stats.destrezza - 10) / 2);
  armature.forEach(a => {
    if (a.armor_category === "Shield") {
      baseCA += a.armor_class.base;
    } else {
      baseCA = a.armor_class.base;
      if (a.armor_class.dex_bonus) {
        const modDex = Math.floor((stats.destrezza - 10) / 2);
        baseCA += a.armor_class.max_bonus
          ? Math.min(modDex, a.armor_class.max_bonus)
          : modDex;
      }
    }
  });
  return baseCA;
};

// Funzione per calcolare tiro per colpire e danno per un'arma
const calcolaAttacco = (arma, stats, livello) => {
  const modFor = Math.floor((stats.forza - 10) / 2);
  const modDes = Math.floor((stats.destrezza - 10) / 2);
  const profBonus = Math.ceil(livello / 4) + 2;

  let modCaratteristica = modFor;
  if (arma.properties.some(p => p.name === "Finesse") && modDes > modFor) {
    modCaratteristica = modDes;
  }
  if (arma.weapon_range === "Ranged") {
    modCaratteristica = modDes;
  }

  return {
    bonusAttacco: modCaratteristica + profBonus,
    danno: `${arma.damage.damage_dice} + ${modCaratteristica}`
  };
};

const updateSpell = (index, field, value) => {
  const updated = [...png.incantesimi];
  updated[index][field] = value;
  setPng({ ...png, incantesimi: updated });
};

const removeSpell = (index) => {
  const updated = png.incantesimi.filter((_, i) => i !== index);
  setPng({ ...png, incantesimi: updated });
};

  const handleGenera = async () => {
    setLoading(true);
    const nuovoPNG = await generaPNGNonComuneCompleto();
    setPng(nuovoPNG);
    setLoading(false);
  };

  const handleSalva = async () => {
  const data = { ...png, tipo: "non-comune" };
  const result = await salvaInArchivio("png", data);

  if (result.success) {
    data.id = result.id; // aggiungi ID Firestore
    toast.success("✅ PNG Non Comune salvato in Archivio!");

    if (collegaAllaCampagna && onSave) {
      onSave(data);
    }
  } else {
    toast.error("❌ Errore nel salvataggio!");
  }
};


const initialData = {
  nome: "",
  cognome: "",
  razza: "",
  origine: "",
  classe: "",
  sottoclasse: "",
  livello: "",
  velocita: "",
  pf: "",
  ca: "",
  dadoVita: "",
  bonusRaziali: "",
  bonusCompetenza: "",
  abilitaClasse: [],
  tiriSalvezza: {},
  descrizione: "",
  note: "",
};
  useEffect(() => {
  if (pngNonComune) {
    setPNGNonComune(pngNonComune); // o setPNG(...)
  }
}, [pngNonComune]);


  return (
    <div className="modale-overlay">
      <div className="modale-png">
        <div className="modale-png-header">
          <h3>Generatore PNG Non Comune</h3>
          <div className="actions">
            <button onClick={handleGenera}>🎲 Genera</button>
            <button onClick={handleSalva} disabled={!png.nome}>💾 Salva</button>
            {loading && <p className="loading-text">⏳ Salvataggio in corso...</p>}
            <button onClick={onClose}>❌ Chiudi</button>
          </div>
        </div>

        {loading && <p>Generazione in corso...</p>}

        {/* Tabs */}
        <div className="tabs-noncomune">
          {tabs.map((t) => (
            <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        <div className="modale-body">
          {/* TAB GENERALI */}
          {tab === "Generali" && (
            <div className="info-section">
              <div className="form-fields">
                <div className="form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    value={png.nome || ""}
                    onChange={(e) => setPng({ ...png, nome: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Razza</label>
                  <input type="text" value={png.razza || ""} readOnly />
                </div>

                <div className="form-group">
                  <label>Classe</label>
                  <input type="text" value={png.classe || ""} readOnly />
                </div>

                <div className="form-group">
                  <label>Velocità</label>
                  <input type="number" value={png.velocita || ""} readOnly />
                </div>

                <div className="form-group">
                  <label>Livello</label>
                  <input type="number" value={png.livello || ""} readOnly />
                </div>

                {/* Dettagli razza */}
                {png.dettagliRazza && (
                  <div className="background-info">
                    <p><strong>Razza:</strong> {png.razza}</p>
                    {png.linguaggi && png.linguaggi.length > 0 && (
                  <div className="form-group">
                    <label>Linguaggi</label>
                    <input type="text" value={png.linguaggi.join(", ")} readOnly />
                  </div>
                )}
                    <p><strong>Tratti:</strong> {png.dettagliRazza.traits.map(t => t.name).join(", ")}</p>
                  </div>
                )}
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
                      reader.onloadend = () => setPng({ ...png, immagine: reader.result });
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {png.immagine && <img src={png.immagine} alt="Anteprima PNG" />}
              </div>
              <hr />
              {png.privilegiRazza && png.privilegiRazza.length > 0 && (
  <div className="privilegi-razza">
    <h5>Privilegi Razza</h5>
    <ul>
      {png.privilegiRazza.map((priv, i) => (
        <li key={i} className="tooltip-container">
          <span className="privilegio-nome">{priv.nome}</span>
          {priv.descrizione && <span className="tooltip">{priv.descrizione}</span>}
        </li>
      ))}
    </ul>
  </div>
)}

            </div>
          )}

          {/* TAB STATISTICHE */}
          {tab === "Statistiche" && (
            <div className="tab-statistiche">
              <h4>Punteggi Caratteristica</h4>
              {png.bonusRaziali && (
                <div className="bonus-raziali">
                  <strong>Bonus Razziali:</strong> {png.bonusRaziali}
                </div>
              )}

              <div className="stat-grid">
                {Object.entries(png.stats || {}).map(([stat, val]) => {
                  const mod = Math.floor((val - 10) / 2);
                  const isSavingThrow = png.savingThrowsClasse.includes(stat);
                  const tiroSalvezza = isSavingThrow ? `+${png.tiriSalvezza[stat]}` : null;

                  // Abilità collegate a questa caratteristica
                  const abilita = abilitaPerStat[stat] || [];

                  return (
                    <div key={stat} className="stat-box">
                      <h5>{stat.toUpperCase()}</h5>
                      <div className="stat-score">{val}</div>
                      <div className="stat-mod">{mod >= 0 ? `+${mod}` : mod}</div>
                      {isSavingThrow && (
                        <div className="saving-throw">
                          <strong>Tiro Salvezza:</strong> {tiroSalvezza}
                        </div>
                      )}

                      {abilita.length > 0 && (
                        <div className="abilita-box">
                          <strong>Abilità:</strong>
                          {abilita.map((a) => (
                            <label key={a} className="abilita-checkbox">
                              <input
                                type="checkbox"
                                checked={png.abilitaClasse?.includes(a)}
                                onChange={(e) => {
                                  const updated = e.target.checked
                                    ? [...png.abilitaClasse, a]
                                    : png.abilitaClasse.filter((x) => x !== a);
                                  setPng({ ...png, abilitaClasse: updated });
                                }}
                              />
                              {a}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CLASSE */}
          {tab === "Classe" && (
          <div className="tab-classe">
            <h4>Dettagli Classe</h4>

            {/* Sezione Classe e Sottoclasse */}
            <div className="classe-info">
              <div className="form-group">
                <label>Classe</label>
                <input
                  type="text"
                  value={png.classe || ""}
                  onChange={(e) => setPng({ ...png, classe: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Sottoclasse o Archetipo</label>
                <input
                  type="text"
                  value={png.sottoclasse || ""}
                  onChange={(e) => setPng({ ...png, sottoclasse: e.target.value })}
                />
              </div>
            </div>

            {/* PF e CA */}
            <div className="pf-ca">
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
                <label>Bonus Competenza</label>
                <input type="text" value={`+${Math.ceil((png.livello || 1) / 4) + 2}`} readOnly />
              </div>
              <div className="form-group">
                <label>Dado Vita</label>
                <input
                  type="text"
                  value={`d${png.dadoVita || ""}`}
                  readOnly
                />
              </div>
            </div>

            {/* Competenze base */}
            <div className="classe-section">
              <h5>Competenze Base</h5>
              <ul>
                {png.privilegiClasse?.length > 0 ? (
                  png.privilegiClasse.map((p, i) => <li key={i}>{p}</li>)
                ) : (
                  <li>Nessuna competenza definita</li>
                )}
              </ul>
            </div>

            {/* Abilità a scelta */}
            <div className="classe-section">
              <h5>Abilità della Classe</h5>
              <div className="abilita-grid">
                {png.competenzeScelte?.map((abilita, i) => (
                  <label key={i} className="abilita-checkbox">
                    <input
                      type="checkbox"
                      checked={png.abilitaClasse?.includes(abilita)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...png.abilitaClasse, abilita]
                          : png.abilitaClasse.filter((a) => a !== abilita);
                        setPng({ ...png, abilitaClasse: updated });
                      }}
                    />
                    {abilita}
                  </label>
                ))}
              </div>
            </div>

            {/* Privilegi di Classe */}
            <div className="classe-section">
              <h5>Privilegi di Classe (fino al livello {png.livello})</h5>
              {png.privilegiDettagliati?.length > 0 ? (
                <ul className="privilegi-list">
                  {png.privilegiDettagliati.map((priv, i) => (
                    <li key={i} className="tooltip-container">
                      <span className="privilegio-nome">{priv.name}</span>
                      <span className="tooltip">{priv.desc}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nessun privilegio disponibile</p>
              )}
            </div>
          </div>
          )}

          {/* TAB MAGIA */}
          {tab === "Magia" && png.magia && (
            <div className="tab-magia">
              <h4>Gestione Magia</h4>

              {/* Info base */}
              <div className="magia-info-grid">
                <div className="form-group">
                  <label>Stat Magica</label>
                  <input type="text" value={png.magia.caratteristica} readOnly />
                </div>
                <div className="form-group">
                  <label>CD Incantesimi</label>
                  <input type="text" value={png.magia.cd} readOnly />
                </div>
                <div className="form-group">
                  <label>Bonus Attacco</label>
                  <input type="text" value={`+${png.magia.bonusAttacco}`} readOnly />
                </div>
                <div className="form-group">
                  <label>Focus Arcano</label>
                  <input
                    type="text"
                    value={png.magia.focus || ""}
                    onChange={(e) => setPng({ ...png, magia: { ...png.magia, focus: e.target.value } })}
                  />
                </div>
              </div>

              <hr />

              {/* Tabella Slot */}
              <h5>Slot Incantesimi</h5>
              {png.slotIncantesimi.length > 0 ? (
                <table className="slot-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Livello</th>
                      <th>Scuola</th>
                      <th>Gittata</th>
                      <th>Componenti</th>
                      <th>Durata</th>
                      <th>Descrizione</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {png.incantesimi?.map((spell, i) => (
                      <tr key={i}>
                        <td className="tooltip-spell">
                          <span title={spell.descrizione || "Nessuna descrizione"}>{spell.nome}</span>
                        </td>
                        <td><input type="number" value={spell.livello} onChange={(e) => updateSpell(i, "livello", e.target.value)} /></td>
                        <td><input type="text" value={spell.scuola} onChange={(e) => updateSpell(i, "scuola", e.target.value)} /></td>
                        <td><input type="text" value={spell.gittata} onChange={(e) => updateSpell(i, "gittata", e.target.value)} /></td>
                        <td><input type="text" value={spell.componenti} onChange={(e) => updateSpell(i, "componenti", e.target.value)} /></td>
                        <td><input type="text" value={spell.durata} onChange={(e) => updateSpell(i, "durata", e.target.value)} /></td>
                        <td>
                          <textarea value={spell.descrizione} onChange={(e) => updateSpell(i, "descrizione", e.target.value)} />
                        </td>
                        <td><button onClick={() => removeSpell(i)}>❌</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>Nessuno slot disponibile</p>}

              <hr />

              {/* Tabella Incantesimi */}
              <h5>Incantesimi Conosciuti</h5>
              <table className="spell-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Livello</th>
                    <th>Scuola</th>
                    <th>Descrizione</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {png.incantesimi?.length > 0 ? (
                    png.incantesimi.map((spell, i) => (
                      <tr key={i}>
                        <td>
                          <input
                            type="text"
                            value={spell.nome}
                            onChange={(e) => {
                              const updated = [...png.incantesimi];
                              updated[i].nome = e.target.value;
                              setPng({ ...png, incantesimi: updated });
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={spell.livello}
                            onChange={(e) => {
                              const updated = [...png.incantesimi];
                              updated[i].livello = parseInt(e.target.value);
                              setPng({ ...png, incantesimi: updated });
                            }}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={spell.scuola}
                            onChange={(e) => {
                              const updated = [...png.incantesimi];
                              updated[i].scuola = e.target.value;
                              setPng({ ...png, incantesimi: updated });
                            }}
                          />
                        </td>
                        <td>
                          <textarea
                            value={spell.descrizione}
                            onChange={(e) => {
                              const updated = [...png.incantesimi];
                              updated[i].descrizione = e.target.value;
                              setPng({ ...png, incantesimi: updated });
                            }}
                          />
                        </td>
                        <td>
                          <button onClick={() => {
                            const updated = png.incantesimi.filter((_, idx) => idx !== i);
                            setPng({ ...png, incantesimi: updated });
                          }}>❌</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="5">Nessun incantesimo inserito</td></tr>
                  )}
                </tbody>
              </table>

              {/* Aggiunta manuale */}
              <div className="form-group add-spell">
                <input
                  type="text"
                  placeholder="Cerca incantesimo..."
                  onChange={(e) => filtraIncantesimi(e.target.value)}
                />
                {spellSuggeriti.length > 0 && (
                  <ul className="suggestions">
                    {spellSuggeriti.map((sp, idx) => (
                      <li key={idx} onClick={() => {
                        const nuovoInc = {
                          nome: sp.name,
                          livello: sp.level,
                          scuola: sp.school,
                          gittata: sp.range,
                          componenti: sp.components,
                          durata: sp.duration,
                          descrizione: sp.desc
                        };
                        setPng({ ...png, incantesimi: [...(png.incantesimi || []), nuovoInc] });
                        setSpellSuggeriti([]);
                      }}>
                        {sp.name} (Liv. {sp.level})
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="quick-add">
                {[0, 1, 2, 3].map(lv => (
                  <button key={lv} onClick={() => {
                    const classeKey = png.classe?.toLowerCase();
                    if (!classeKey || !spells[classeKey]) return;

                    const disponibili = lv === 0 ? spells[classeKey].cantrips : spells[classeKey][`level${lv}`];
                    if (!disponibili || disponibili.length === 0) return;

                    const scelto = casuale(disponibili);
                    const nuovoInc = {
                      nome: scelto.name,
                      livello: scelto.level,
                      scuola: scelto.school,
                      gittata: scelto.range,
                      componenti: scelto.components,
                      durata: scelto.duration,
                      descrizione: scelto.desc
                    };
                    setPng({ ...png, incantesimi: [...(png.incantesimi || []), nuovoInc] });
                  }}>
                    + Liv {lv === 0 ? "Trucchetto" : lv}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB EQUIPAGGIAMENTO */}
          {tab === "Equipaggiamento" && (
            <div className="tab-equipaggiamento">
              <h4>Armi Equipaggiate</h4>
              <ul className="equip-list">
                {png.armiEquippate?.length > 0 ? (
                  png.armiEquippate.map((arma, i) => (
                    <li key={i} className="equip-item">
                      <strong>{arma.name}</strong> – {arma.damage.damage_dice} {arma.damage.damage_type.name}
                      <br />
                      <small>
                        Proprietà: {arma.properties.map(p => p.name).join(", ")} • Peso: {arma.weight || 0} lb
                      </small>
                      <button onClick={() => {
                        const updated = png.armiEquippate.filter((_, idx) => idx !== i);
                        setPng({ ...png, armiEquippate: updated });
                      }}>❌</button>
                    </li>
                  ))
                ) : (
                  <p>Nessuna arma equipaggiata.</p>
                )}
              </ul>

              <select
                onChange={(e) => {
                  const armaSelezionata = armi.find(a => a.index === e.target.value);
                  if (armaSelezionata) {
                    setPng({ ...png, armiEquippate: [...(png.armiEquippate || []), armaSelezionata] });
                  }
                  e.target.value = "";
                }}
              >
                <option value="">+ Aggiungi arma</option>
                {armi.map((a) => (
                  <option key={a.index} value={a.index}>{a.name}</option>
                ))}
              </select>

              <hr />
              <h4>Armature Indossate</h4>
              <ul className="equip-list">
                {png.armatureIndossate?.length > 0 ? (
                  png.armatureIndossate.map((armor, i) => (
                    <li key={i} className="equip-item">
                      <strong>{armor.name}</strong> – CA base: {armor.armor_class.base}
                      <br />
                      <small>
                        Tipo: {armor.armor_category} • Peso: {armor.weight || 0} lb
                      </small>
                      <button onClick={() => {
                        const updated = png.armatureIndossate.filter((_, idx) => idx !== i);
                        setPng({ ...png, armatureIndossate: updated });
                      }}>❌</button>
                    </li>
                  ))
                ) : (
                  <p>Nessuna armatura indossata.</p>
                )}
              </ul>

              <select
                onChange={(e) => {
                  const armorSelezionata = armature.find(a => a.index === e.target.value);
                  if (armorSelezionata) {
                    const updated = [...(png.armatureIndossate || []), armorSelezionata];

                    // Ricalcolo CA dinamicamente
                    const modDex = Math.floor((png.stats.destrezza - 10) / 2);
                    let nuovaCA = 10 + modDex;
                    updated.forEach(a => {
                      if (a.armor_category === "Shield") {
                        nuovaCA += a.armor_class.base;
                      } else {
                        nuovaCA = a.armor_class.base;
                        if (a.armor_class.dex_bonus) {
                          nuovaCA += a.armor_class.max_bonus
                            ? Math.min(modDex, a.armor_class.max_bonus)
                            : modDex;
                        }
                      }
                    });

                    setPng({ ...png, armatureIndossate: updated, ca: nuovaCA });
                  }
                  e.target.value = "";
                }}
              >
                <option value="">+ Aggiungi armatura</option>
                {armature.map((a) => (
                  <option key={a.index} value={a.index}>{a.name}</option>
                ))}
              </select>

              <div className="ca-display">
                <h5>Classe Armatura Attuale: {png.ca}</h5>
              </div>
              <hr />
              <h4>Oggetti Vari</h4>
              <ul className="equip-list">
                {png.equipVari?.length > 0 ? (
                  png.equipVari.map((obj, i) => (
                    <li key={i} className="equip-item">
                      {obj}
                      <button onClick={() => {
                        const updated = png.equipVari.filter((_, idx) => idx !== i);
                        setPng({ ...png, equipVari: updated });
                      }}>❌</button>
                    </li>
                  ))
                ) : (
                  <p>Nessun oggetto presente.</p>
                )}
              </ul>

              <div className="form-group">
                <input
                  type="text"
                  placeholder="Aggiungi oggetto"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim() !== "") {
                      setPng({ ...png, equipVari: [...(png.equipVari || []), e.target.value.trim()] });
                      e.target.value = "";
                    }
                  }}
                />
                
              </div>
              <hr />
                <h4>Focus Arcano</h4>
                <div className="form-group">
                  <input
                    type="text"
                    value={png.magia?.focus || ""}
                    onChange={(e) => setPng({ ...png, magia: { ...png.magia, focus: e.target.value } })}
                    placeholder="Inserisci o modifica il focus arcano"
                  />
                </div>
            </div>
          )}

          {/* TAB COMBATTIMENTO */}
          {tab === "Combattimento" && (
            <div className="tab-combattimento">
              <h4>Statistiche di Combattimento</h4>

              {/* PF, CA, Velocità */}
              <div className="combat-stats-grid">
                <div className="form-group">
                  <label>PF Attuali</label>
                  <input
                    type="number"
                    value={png.pf || 0}
                    onChange={(e) => setPng({ ...png, pf: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>PF Massimi</label>
                  <input type="number" value={png.pf || 0} readOnly />
                </div>
                <div className="form-group">
                  <label>Classe Armatura</label>
                  <input type="number" value={png.ca || 10} readOnly />
                </div>
                <div className="form-group">
                  <label>Velocità</label>
                  <input type="text" value={`${png.velocita || 9} m`} readOnly />
                </div>
                <div className="form-group">
                  <label>Bonus Competenza</label>
                  <input type="text" value={`+${Math.ceil((png.livello || 1) / 4) + 2}`} readOnly />
                </div>
              </div>

              <hr />

              {/* --- TABELLA ARMI DA MISCHIA --- */}
              <h5>Armi da Mischia</h5>
              <table className="combat-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tiro per colpire</th>
                    <th>Danno</th>
                    <th>Proprietà</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {png.armiEquippate
                    ?.filter(a => a.weapon_range === "Melee")
                    .map((arma, i) => {
                      const modFor = Math.floor((png.stats.forza - 10) / 2);
                      const modDes = Math.floor((png.stats.destrezza - 10) / 2);
                      const profBonus = Math.ceil(png.livello / 4) + 2;

                      let modCaratteristica = modFor;
                      if (
                        arma.properties.some(p => p.name === "Finesse") &&
                        modDes > modFor
                      ) {
                        modCaratteristica = modDes;
                      }

                      const bonusAttacco = modCaratteristica + profBonus;
                      const danno = `${arma.damage.damage_dice} + ${modCaratteristica}`;

                      return (
                        <tr key={i}>
                          <td>{arma.name}</td>
                          <td>
                            <input
                              type="text"
                              value={arma.bonusAttacco || ""}
                              onChange={(e) => {
                                const updated = [...png.armiEquippate];
                                updated[i].bonusAttacco = e.target.value;
                                setPng({ ...png, armiEquippate: updated });
                              }}
                            />
                          </td>
                          <td>
                            {arma.dannoCalcolato || ""}
                            <br />
                            <small>{arma.damage.damage_type.name}</small>
                          </td>
                          <td>
                            {arma.properties.map(p => (
                              <span
                                key={p.name}
                                className="tooltip-prop"
                                title={p.desc}
                              >
                                {p.name}
                              </span>
                            ))}
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                const updated = png.armiEquippate.filter((_, idx) => idx !== i);
                                setPng({ ...png, armiEquippate: updated });
                              }}
                            >
                              ❌
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {/* --- TABELLA ARMI A DISTANZA --- */}
              <h5>Armi a Distanza</h5>
              <table className="combat-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tiro per colpire</th>
                    <th>Danno</th>
                    <th>Proprietà</th>
                    <th>Gittata</th>
                    <th>Munizioni</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {png.armiEquippate
                    ?.filter(a => a.weapon_range === "Ranged")
                    .map((arma, i) => {
                      const modDes = Math.floor((png.stats.destrezza - 10) / 2);
                      const profBonus = Math.ceil(png.livello / 4) + 2;
                      const bonusAttacco = modDes + profBonus;
                      const danno = `${arma.damage.damage_dice} + ${modDes}`;
                      const gittata = arma.properties.find(p => p.name === "Lancio")?.desc || "—";

                      return (
                        <tr key={i}>
                          <td>{arma.name}</td>
                          <td>
                            <input
                              type="text"
                              value={`+${bonusAttacco}`}
                              onChange={(e) => {
                                const updated = [...png.armiEquippate];
                                updated[i].bonusAttacco = e.target.value;
                                setPng({ ...png, armiEquippate: updated });
                              }}
                            />
                          </td>
                          <td>
                            {danno}
                            <br />
                            <small>{arma.damage.damage_type.name}</small>
                          </td>
                          <td>
                            {arma.properties.map(p => (
                              <span
                                key={p.name}
                                className="tooltip-prop"
                                title={p.desc}
                              >
                                {p.name}
                              </span>
                            ))}
                          </td>
                          <td>{gittata}</td>
                          <td>
                            <input
                              type="number"
                              value={arma.munizioni || 0}
                              onChange={(e) => {
                                const updated = [...png.armiEquippate];
                                updated[i].munizioni = e.target.value;
                                setPng({ ...png, armiEquippate: updated });
                              }}
                            />
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                const updated = png.armiEquippate.filter((_, idx) => idx !== i);
                                setPng({ ...png, armiEquippate: updated });
                              }}
                            >
                              ❌
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {/* --- TABELLA ARMATURE --- */}
              <h5>Armature Indossate</h5>
              <table className="combat-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CA Base</th>
                    <th>Tipo</th>
                    <th>Svantaggio</th>
                    <th>Peso (kg)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {png.armatureIndossate?.map((armor, i) => (
                    <tr key={i}>
                      <td>{armor.name}</td>
                      <td>{armor.armor_class.base}</td>
                      <td>{armor.armor_category}</td>
                      <td>{armor.stealth_disadvantage ? "Sì" : "No"}</td>
                      <td>{armor.weight || 0}</td>
                      <td>
                        <button
                          onClick={() => {
                            const updated = png.armatureIndossate.filter((_, idx) => idx !== i);
                            const nuovaCA = calcolaCA(png.stats, updated);

                            setPng({ ...png, armatureIndossate: updated, ca: nuovaCA });
                          }}
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Selettori per aggiungere nuove armi/armature */}
              <div className="add-equip-section">
                <select
                  onChange={(e) => {
                    const armaSelezionata = armi.find(a => a.index === e.target.value);
                    if (armaSelezionata) {
                      const { bonusAttacco, danno } = calcolaAttacco(armaSelezionata, png.stats, png.livello);
                      armaSelezionata.bonusAttacco = `+${bonusAttacco}`;
                      armaSelezionata.dannoCalcolato = danno;

                      setPng({ ...png, armiEquippate: [...(png.armiEquippate || []), armaSelezionata] });
                    }
                    e.target.value = "";
                  }}
                >
                  <option value="">+ Aggiungi arma</option>
                  {armi.map((a) => (
                    <option key={a.index} value={a.index}>{a.name}</option>
                  ))}
                </select>

                <select
                  onChange={(e) => {
                    const armorSelezionata = armature.find(a => a.index === e.target.value);
                    if (armorSelezionata) {
                      const updated = [...(png.armatureIndossate || []), armorSelezionata];
                      const nuovaCA = calcolaCA(png.stats, updated);

                      setPng({ ...png, armatureIndossate: updated, ca: nuovaCA });
                    }
                    e.target.value = "";
                  }}
                >
                  <option value="">+ Aggiungi armatura</option>
                  {armature.map((a) => (
                    <option key={a.index} value={a.index}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* TAB NARRATIVA */}
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
                <textarea
                  style={{ width: "100%", height: "121px" }}
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
