import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { generaPNGNonComuneCompleto } from "../../utils/generatorePNGNonComune";
import { armi } from "../../utils/armi";
import { armature } from "../../utils/armature";
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
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("Generali");

  const tabs = [
    "Generali",
    "Classe",
    "Statistiche",
    "Combattimento",
    ...(png.magia ? ["Magia"] : []),
    "Equipaggiamento",
    "Narrativa"
  ];

  const handleGenera = async () => {
    setLoading(true);
    const nuovoPNG = await generaPNGNonComuneCompleto();
    setPng(nuovoPNG);
    setLoading(false);
  };

  const handleSalva = async () => {
    try {
      await addDoc(collection(firestore, "png"), {
        ...png,
        tipo: "Non Comune",
        createdAt: serverTimestamp()
      });
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
                <label>Sottoclasse / Patto</label>
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

              {/* Info base magia */}
              <div className="magia-info-grid">
                <div className="form-group">
                  <label>Stat Magica</label>
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
                  <label>Focus Arcano</label>
                  <input
                    type="text"
                    value={png.magia.focus || ""}
                    onChange={(e) =>
                      setPng({ ...png, magia: { ...png.magia, focus: e.target.value } })
                    }
                  />
                </div>
              </div>
              <hr />
              <h5>Trucchetti</h5>
{renderSpellList(png.incantesimi.cantrips)}

{Object.entries(png.incantesimi)
  .filter(([key]) => key !== "cantrips")
  .map(([level, spells]) => (
    <div key={level}>
      <h5>{level.replace("level", "Livello ")}</h5>
      {renderSpellList(spells)}
    </div>
  ))}


              {/* Tabella Slot */}
              <h5>Slot Incantesimo</h5>
              <table className="slot-table">
                <thead>
                  <tr>
                    {png.slotIncantesimi?.map((_, i) => (
                      <th key={i}>Lv.{i + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {png.slotIncantesimi?.map((slot, i) => (
                      <td key={i}>
                        <input
                          type="number"
                          value={slot}
                          onChange={(e) => {
                            const updatedSlots = [...png.slotIncantesimi];
                            updatedSlots[i] = parseInt(e.target.value);
                            setPng({ ...png, slotIncantesimi: updatedSlots });
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>

              {/* Lista Incantesimi */}
              <h5>Incantesimi Conosciuti</h5>
              <div className="spell-list">
                {png.incantesimi && png.incantesimi.length > 0 ? (
                  png.incantesimi.map((spell, i) => (
                    <div key={i} className="spell-card">
                      <input
                        type="text"
                        value={spell.name || ""}
                        onChange={(e) => {
                          const updatedSpells = [...png.incantesimi];
                          updatedSpells[i].name = e.target.value;
                          setPng({ ...png, incantesimi: updatedSpells });
                        }}
                      />
                      <small>Livello {spell.level} • {spell.school}</small>
                      <textarea
                        value={spell.desc || ""}
                        onChange={(e) => {
                          const updatedSpells = [...png.incantesimi];
                          updatedSpells[i].desc = e.target.value;
                          setPng({ ...png, incantesimi: updatedSpells });
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <p>Nessun incantesimo presente.</p>
                )}
              </div>

              {/* Aggiunta manuale incantesimi */}
              <div className="form-group add-spell">
                <label>Aggiungi Incantesimi (nome, separati da virgola)</label>
                <textarea
                  placeholder="Es: Palla di Fuoco, Scudo"
                  onBlur={(e) => {
                    const nuoviIncantesimi = e.target.value
                      .split(",")
                      .map((name) => ({ name: name.trim(), level: 1, school: "Personalizzato", desc: "" }));
                    setPng({ ...png, incantesimi: [...(png.incantesimi || []), ...nuoviIncantesimi] });
                    e.target.value = "";
                  }}
                />
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
            </div>
          )}

          {/* TAB COMBATTIMENTO */}
          {tab === "Combattimento" && (
            <div className="tab-combattimento">
              <h4>Statistiche di Combattimento</h4>

              {/* PF e CA */}
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
              </div>

              <hr />

              {/* Lista Attacchi */}
              <h5>Attacchi</h5>
              <div className="attacks-list">
                {png.armiEquippate?.length > 0 ? (
                  png.armiEquippate.map((arma, i) => {
                    const modFor = Math.floor((png.stats.forza - 10) / 2);
                    const modDes = Math.floor((png.stats.destrezza - 10) / 2);
                    const profBonus = Math.ceil(png.livello / 4) + 2;

                    // Determina la stat per colpire
                    let modCaratteristica = modFor;
                    if (
                      arma.properties.some((p) => p.name === "Finesse") &&
                      modDes > modFor
                    ) {
                      modCaratteristica = modDes;
                    } else if (arma.weapon_range === "Ranged") {
                      modCaratteristica = modDes;
                    }

                    const bonusAttacco = modCaratteristica + profBonus;
                    const bonusDanno =
                      modCaratteristica >= 0 ? `+${modCaratteristica}` : modCaratteristica;

                    return (
                      <div key={i} className="attack-item">
                        <div className="attack-header">
                          <strong>{arma.name}</strong>
                          <span className="tooltip-icon" title={arma.properties.map(p => `${p.name}: ${p.desc}`).join("\n")}>ℹ️</span>
                        </div>
                        <p>
                          <strong>Attacco:</strong> +{bonusAttacco} •{" "}
                          <strong>Danno:</strong> {arma.damage.damage_dice} {arma.damage.damage_type.name} {bonusDanno}
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p>Nessuna arma equipaggiata.</p>
                )}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
