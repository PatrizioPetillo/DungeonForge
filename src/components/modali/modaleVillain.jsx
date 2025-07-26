import React, { useState } from "react";
import { addDoc, collection, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import { salvaInArchivio } from "../../utils/firestoreArchivio";
import { generaVillainCompleto } from "../../utils/generatoreVillain";
import { classes } from "../../utils/classes";
import { spells } from "../../utils/spells";
import { armi } from "../../utils/armi";
import { armature } from "../../utils/armature";
import { generateBackground } from "../../utils/backgrounds";
import { generaHook } from "../../utils/narrativeGenerators";
import { generaDialogo } from "../../utils/narrativeGenerators";
import "../../styles/modaleVillain.css";

const ModaleVillain = ({ onClose, onSave, villain: initialVillain }) => {
  const [villain, setVillain] = useState(
    initialVillain || {
      nome: "",
      immagine: "",
      razza: "",
      classe: "",
      sottoclasse: "",
      livello: 5,
      pf: 0,
      ca: 10,
      dadoVita: "",
      bonusCompetenza: 2,
      stats: {
        forza: 10,
        destrezza: 10,
        costituzione: 10,
        intelligenza: 10,
        saggezza: 10,
        carisma: 10,
      },
      competenze: [],
      privilegiClasse: [],
      talenti: [],
      armiEquippate: [],
      armatureIndossate: [],
      inventario: "",
      loot: [],
      magia: null,
      narrativa: { obiettivo: "", motivazione: "", origine: "" },
    }
  );

  const [tab, setTab] = useState("Generale");
  const [loading, setLoading] = useState(false);
  const [spellSuggeriti, setSpellSuggeriti] = useState([]);

  // ✅ GENERAZIONE CASUALE
  const handleGenera = () => {
    const nuovo = generaVillainCompleto();
    setVillain(nuovo);
  };

  // ✅ SALVATAGGIO FIRESTORE
  const handleSalva = async () => {
    const ok = await salvaInArchivio("villain", villain);
    if (ok) {
      alert("Villain salvato nell'Archivio!");
      onClose();
    }
  };

  // ✅ AUTOCOMPLETE INCANTESIMI
  const filtraIncantesimi = (query) => {
    if (!query) {
      setSpellSuggeriti([]);
      return;
    }
    const classeKey = villain.classe?.toLowerCase();
    if (!classeKey || !spells[classeKey]) return;

    const listaIncantesimi = [
      ...(spells[classeKey].cantrips || []),
      ...Object.values(spells[classeKey]).flat().filter((sp) => sp.level > 0),
    ];
    const risultati = listaIncantesimi.filter((sp) =>
      sp.name.toLowerCase().includes(query.toLowerCase())
    );
    setSpellSuggeriti(risultati.slice(0, 6));
  };

  return (
    <div className="modale-overlay">
      <div className="modale-villain">
        {/* HEADER */}
        <div className="modale-header">
          <h3>🧿 Villain</h3>
          <div className="actions">
            <button onClick={handleGenera}>🎲 Genera</button>
            <button onClick={handleSalva}>💾 Salva</button>
            <button onClick={onClose}>✖ Chiudi</button>
          </div>
        </div>

        {loading && <p className="loading-text">⏳ Salvataggio...</p>}

        {/* TABS */}
        <div className="tabs">
          {["Generale", "Classe", "Statistiche", "Combattimento", "Equipaggiamento", villain.magia ? "Magia" : null].map(
            (t) =>
              t && (
                <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
                  {t}
                </button>
              )
          )}
        </div>

        {/* CONTENUTO */}
        <div className="modale-body">
          <div className="villain-layout">

            <div className="villain-content">
              {/* TAB GENERALE */}
              {tab === "Generale" && (
                <div className="tab-generale">
                  {/* Riquadro immagine */}
                  <div className="villain-header">
                    <div className="villain-img">
                      {villain.immagine ? (
                        <img src={villain.immagine} alt="Villain" />
                      ) : (
                        <p>Nessuna immagine</p>
                      )}
                      <input
                        type="text"
                        placeholder="URL immagine"
                        value={villain.immagine}
                        onChange={(e) => setVillain({ ...villain, immagine: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Nome */}
                  <div className="form-group">
                    <label>Nome</label>
                    <input
                      type="text"
                      value={villain.nome}
                      onChange={(e) => setVillain({ ...villain, nome: e.target.value })}
                    />
                  </div>

                  {/* Razza e Livello */}
                  <div className="form-group-inline">
                    <div>
                      <label>Razza</label>
                      <input
                        type="text"
                        value={villain.razza}
                        onChange={(e) => setVillain({ ...villain, razza: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>Livello</label>
                      <input
                        type="number"
                        min="5"
                        value={villain.livello}
                        onChange={(e) =>
                          setVillain({ ...villain, livello: parseInt(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  {/* Allineamento */}
                  <div className="form-group">
                    <label>Allineamento</label>
                    <select
                      value={villain.allineamento}
                      onChange={(e) => setVillain({ ...villain, allineamento: e.target.value })}
                    >
                      <option value="">-- Seleziona --</option>
                      {["Legale Malvagio", "Neutrale Malvagio", "Caotico Malvagio", "Antieroe (Caotico Neutrale)"].map(
                        (align) => (
                          <option key={align} value={align}>
                            {align}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Background */}
                  <div className="form-group">
                    <label>Background</label>
                    <input
                      type="text"
                      value={villain.background?.nomeEvocativo || ""}
                      readOnly
                    />
                    {villain.background && (
                      <p className="background-details">
                        {villain.background.feature?.desc || "Nessuna descrizione disponibile"}
                      </p>
                    )}
                  </div>

                  {/* Linguaggi */}
                  <div className="form-group">
                    <label>Linguaggi</label>
                    <input
                      type="text"
                      value={villain.linguaggi?.join(", ") || ""}
                      onChange={(e) =>
                        setVillain({
                          ...villain,
                          linguaggi: e.target.value.split(",").map((l) => l.trim()),
                        })
                      }
                    />
                  </div>

                  {/* Descrizione evocativa */}
                  <div className="form-group">
                    <label>Descrizione evocativa</label>
                    <textarea
                      value={villain.descrizione || ""}
                      onChange={(e) => setVillain({ ...villain, descrizione: e.target.value })}
                    />
                  </div>
                </div>
              )}

              {/* TAB CLASSE */}
              {tab === "Classe" && (
                <div className="tab-classe">
                  {/* Blocco riassuntivo */}
                  <div className="classe-summary">
                    <h4>Riepilogo Classe</h4>
                    <div className="summary-grid">
                      <div>
                        <label>Classe</label>
                        <select
                          value={villain.classe}
                          onChange={(e) =>
                            setVillain({ ...villain, classe: e.target.value })
                          }
                        >
                          <option value="">-- Seleziona --</option>
                          {classes.map((c) => (
                            <option key={c.index} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label>Sottoclasse</label>
                        <input
                          type="text"
                          value={villain.sottoclasse}
                          onChange={(e) =>
                            setVillain({ ...villain, sottoclasse: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label>PF</label>
                        <input
                          type="number"
                          value={villain.pf}
                          onChange={(e) =>
                            setVillain({ ...villain, pf: parseInt(e.target.value) })
                          }
                        />
                      </div>
                      <div>
                        <label>CA</label>
                        <span>{villain.ca}</span>
                      </div>
                      <div>
                        <label>Bonus Comp.</label>
                        <span>+{villain.bonusCompetenza}</span>
                      </div>
                      <div>
                        <label>Dadi Vita</label>
                        <span>{villain.dadoVita}</span>
                      </div>
                    </div>
                  </div>

                  <hr />

                  {/* Competenze */}
                  <div className="competenze-section">
                    <h4>Competenze</h4>
                    {villain.competenze && villain.competenze.length > 0 ? (
                      <ul>
                        {villain.competenze.map((comp, i) => (
                          <li key={i}>
                            <input
                              type="checkbox"
                              checked
                              onChange={(e) => {
                                const updated = villain.competenze.filter(
                                  (_, idx) => idx !== i
                                );
                                setVillain({ ...villain, competenze: updated });
                              }}
                            />
                            {comp}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Nessuna competenza caricata</p>
                    )}
                  </div>

                  <hr />

                  {/* Privilegi di Classe */}
                  <div className="privilegi-section">
                    <h4>Privilegi di Classe</h4>
                    {villain.privilegiClasse && villain.privilegiClasse.length > 0 ? (
                      <ul>
                        {villain.privilegiClasse.map((p, i) => (
                          <li key={i} className="tooltip-container">
                            <span>{p.nome}</span>
                            {p.descrizione && <span className="tooltip">{p.descrizione}</span>}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>Nessun privilegio disponibile</p>
                    )}
                  </div>

                  <hr />

                  {/* Talenti */}
                  <div className="talenti-section">
                    <h4>Talenti</h4>
                    <textarea
                      value={villain.talenti.join(", ")}
                      onChange={(e) =>
                        setVillain({
                          ...villain,
                          talenti: e.target.value.split(",").map((t) => t.trim()),
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* TAB STATISTICHE */}
              {tab === "Statistiche" && (
                <div className="tab-statistiche">
                  <h4>Statistiche e Abilità</h4>
                  <div className="stats-grid">
                    {Object.entries(villain.stats).map(([stat, val]) => {
                      const mod = Math.floor((val - 10) / 2);
                      // Abilità collegate alla caratteristica
                      const abilitaPerStat = {
                        forza: ["Atletica"],
                        destrezza: ["Acrobazia", "Furtività", "Rapidità di mano"],
                        costituzione: [],
                        intelligenza: ["Arcano", "Storia", "Indagare", "Natura", "Religione"],
                        saggezza: ["Percezione", "Sopravvivenza", "Intuizione", "Medicina", "Addestrare Animali"],
                        carisma: ["Inganno", "Persuasione", "Intimidire", "Intrattenere"],
                      };

                      const abilita = abilitaPerStat[stat] || [];

                      // Evidenzia tiri salvezza della classe
                      const savingThrowsClasse = villain.savingThrows || []; // array dei saving throws per classe
                      const isSavingThrow = savingThrowsClasse.includes(stat);

                      return (
                        <div key={stat} className="stat-box">
                          <div className="stat-header">
                            <strong>{stat.toUpperCase()}</strong>
                            {isSavingThrow && <span className="saving-throw-label">TS</span>}
                          </div>
                          <input
                            type="number"
                            value={val}
                            onChange={(e) =>
                              setVillain({
                                ...villain,
                                stats: { ...villain.stats, [stat]: parseInt(e.target.value) },
                              })
                            }
                          />
                          <p>Mod: {mod >= 0 ? `+${mod}` : mod}</p>
                          {abilita.length > 0 && (
                            <div className="abilita-list">
                              {abilita.map((a) => (
                                <label key={a}>
                                  <input type="checkbox" /> {a}
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

              {/* TAB COMBATTIMENTO */}
              {tab === "Combattimento" && (
                <div className="tab-combattimento">
                  {/* Riquadro PF e CA */}
                  <div className="combat-summary">
                    <div>
                      <label>PF Attuali</label>
                      <input
                        type="number"
                        value={villain.pfAttuali || villain.pf}
                        onChange={(e) =>
                          setVillain({ ...villain, pfAttuali: parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <label>PF Massimi</label>
                      <span>{villain.pf}</span>
                    </div>
                    <div>
                      <label>CA</label>
                      <span>{villain.ca}</span>
                    </div>
                    <div>
                      <label>Bonus Comp.</label>
                      <span>+{villain.bonusCompetenza}</span>
                    </div>
                  </div>

                  <hr />

                  {/* Sezione Armi */}
                  <h4>Armi Equipaggiate</h4>
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
                      {villain.armiEquippate.map((arma, i) => {
                        const modCar = Math.floor((villain.stats.forza - 10) / 2); // base: Forza
                        const tiroColpire = modCar + villain.bonusCompetenza;
                        return (
                          <tr key={i}>
                            <td>{arma.name}</td>
                            <td>+{tiroColpire}</td>
                            <td>
                              {arma.damage.damage_dice} + {modCar}{" "}
                              <em>({arma.damage.damage_type.name})</em>
                            </td>
                            <td>
                              {arma.properties.map((p) => (
                                <span key={p.name} className="tooltip-container">
                                  {p.name}
                                  <span className="tooltip">{p.desc || "N/D"}</span>
                                </span>
                              ))}
                            </td>
                            <td>
                              <button
                                onClick={() => {
                                  const updated = villain.armiEquippate.filter((_, idx) => idx !== i);
                                  setVillain({ ...villain, armiEquippate: updated });
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

                  {/* Select per aggiungere arma */}
                  <div className="form-group">
                    <label>Aggiungi Arma</label>
                    <select
                      onChange={(e) => {
                        const arma = armi.find((a) => a.index === e.target.value);
                        if (arma) {
                          setVillain({
                            ...villain,
                            armiEquippate: [...villain.armiEquippate, arma],
                          });
                        }
                      }}
                    >
                      <option value="">-- Seleziona arma --</option>
                      {armi.map((a) => (
                        <option key={a.index} value={a.index}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <hr />

                  {/* Sezione Armature */}
                  <h4>Armature Equipaggiate</h4>
                  <table className="armor-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>CA Base</th>
                        <th>Tipo</th>
                        <th>Svantaggio</th>
                        <th>Peso</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {villain.armatureIndossate.map((a, i) => (
                        <tr key={i}>
                          <td>{a.name}</td>
                          <td>{a.armor_class.base}</td>
                          <td>{a.armor_category}</td>
                          <td>{a.stealth_disadvantage ? "✔" : "✖"}</td>
                          <td>{a.weight}</td>
                          <td>
                            <button
                              onClick={() => {
                                const updated = villain.armatureIndossate.filter((_, idx) => idx !== i);
                                setVillain({ ...villain, armatureIndossate: updated });
                              }}
                            >
                              ❌
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Select per aggiungere armatura */}
                  <div className="form-group">
                    <label>Aggiungi Armatura</label>
                    <select
                      onChange={(e) => {
                        const armatura = armature.find((a) => a.index === e.target.value);
                        if (armatura) {
                          setVillain({
                            ...villain,
                            armatureIndossate: [...villain.armatureIndossate, armatura],
                          });
                        }
                      }}
                    >
                      <option value="">-- Seleziona armatura --</option>
                      {armature.map((a) => (
                        <option key={a.index} value={a.index}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* TAB EQUIPAGGIAMENTO */}
              {tab === "Equipaggiamento" && (
                <div className="tab-equipaggiamento">
                  <h4>Inventario</h4>
                  <textarea
                    placeholder="Inserisci qui gli oggetti nell'inventario..."
                    value={villain.inventario || ""}
                    onChange={(e) => setVillain({ ...villain, inventario: e.target.value })}
                  />

                  <hr />

                  <h4>Loot Speciale</h4>
                  <ul>
                    {villain.loot && villain.loot.length > 0 ? (
                      villain.loot.map((item, i) => (
                        <li key={i}>
                          {item}
                          <button
                            className="btn-remove"
                            onClick={() => {
                              const updated = villain.loot.filter((_, idx) => idx !== i);
                              setVillain({ ...villain, loot: updated });
                            }}
                          >
                            ❌
                          </button>
                        </li>
                      ))
                    ) : (
                      <p>Nessun oggetto speciale aggiunto</p>
                    )}
                  </ul>

                  <div className="form-group-inline">
                    <input
                      type="text"
                      placeholder="Aggiungi oggetto speciale..."
                      id="lootInput"
                    />
                    <button
                      className="btn-add"
                      onClick={() => {
                        const input = document.getElementById("lootInput");
                        if (input.value.trim() !== "") {
                          setVillain({
                            ...villain,
                            loot: [...(villain.loot || []), input.value.trim()],
                          });
                          input.value = "";
                        }
                      }}
                    >
                      + Aggiungi
                    </button>
                  </div>

                  <hr />

                  <h5>Aggiunta rapida di oggetti da Villain</h5>
                  <div className="quick-loot">
                    {["Gemma Insanguinata", "Talismano Maledetto", "Anello Oscuro", "Reliquia Antica"].map(
                      (oggetto, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            setVillain({
                              ...villain,
                              loot: [...(villain.loot || []), oggetto],
                            })
                          }
                        >
                          + {oggetto}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* TAB MAGIA */}
              {tab === "Magia" && villain.magia && (
                <div className="tab-magia">
                  <h4>Magia</h4>
                  <div className="magia-info-grid">
                    <div>
                      <label>CD Incantesimi</label>
                      <span>{villain.magia.cd}</span>
                    </div>
                    <div>
                      <label>Bonus Attacco</label>
                      <span>+{villain.magia.bonusAttacco}</span>
                    </div>
                    <div>
                      <label>Focus Arcano</label>
                      <input
                        type="text"
                        value={villain.magia.focus}
                        onChange={(e) =>
                          setVillain({ ...villain, magia: { ...villain.magia, focus: e.target.value } })
                        }
                      />
                    </div>
                  </div>

                  <hr />

                  {/* Slot Incantesimi */}
                  <h5>Slot Incantesimi</h5>
                  <div className="slots-container">
                    {villain.slotIncantesimi && villain.slotIncantesimi.length > 0 ? (
                      villain.slotIncantesimi.map((slot, i) => (
                        <span key={i} className="slot-box">
                          Liv. {i + 1}: {slot}
                        </span>
                      ))
                    ) : (
                      <p>Nessuno slot disponibile</p>
                    )}
                  </div>

                  <hr />

                  {/* Autocomplete per aggiungere incantesimi */}
                  <div className="form-group">
                    <label>Aggiungi Incantesimo</label>
                    <input
                      type="text"
                      placeholder="Cerca incantesimo..."
                      onChange={(e) => filtraIncantesimi(e.target.value)}
                    />
                    {spellSuggeriti.length > 0 && (
                      <ul className="suggestions">
                        {spellSuggeriti.map((sp, idx) => (
                          <li
                            key={idx}
                            onClick={() => {
                              setVillain({
                                ...villain,
                                incantesimi: [...(villain.incantesimi || []), sp],
                              });
                              setSpellSuggeriti([]);
                            }}
                          >
                            {sp.name} (Liv {sp.level})
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Aggiunta rapida per livello */}
                  <div className="quick-add">
                    {[0, 1, 2, 3].map((lv) => (
                      <button
                        key={lv}
                        onClick={() => {
                          const classeKey = villain.classe?.toLowerCase();
                          if (!classeKey || !spells[classeKey]) return;
                          const disponibili =
                            lv === 0
                              ? spells[classeKey].cantrips
                              : spells[classeKey][`level${lv}`] || [];
                          if (disponibili.length === 0) return;
                          const scelto = disponibili[Math.floor(Math.random() * disponibili.length)];
                          setVillain({
                            ...villain,
                            incantesimi: [...(villain.incantesimi || []), scelto],
                          });
                        }}
                      >
                        + Liv {lv === 0 ? "Trucchetto" : lv}
                      </button>
                    ))}
                  </div>

                  <hr />

                  {/* Lista Incantesimi */}
                  <h5>Incantesimi Conosciuti</h5>
                  <table className="spell-table">
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Livello</th>
                        <th>Scuola</th>
                        <th>Gittata</th>
                        <th>Durata</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {villain.incantesimi && villain.incantesimi.length > 0 ? (
                        villain.incantesimi.map((spell, i) => (
                          <tr key={i}>
                            <td title={spell.desc}>{spell.name}</td>
                            <td>{spell.level}</td>
                            <td>{spell.school}</td>
                            <td>{spell.range}</td>
                            <td>{spell.duration}</td>
                            <td>
                              <button
                                onClick={() => {
                                  const updated = villain.incantesimi.filter((_, idx) => idx !== i);
                                  setVillain({ ...villain, incantesimi: updated });
                                }}
                              >
                                ❌
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6">Nessun incantesimo aggiunto</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* TAB NARRATIVA */}
              {tab === "Narrativa" && (
                <div className="tab-narrativa">
                  <h4>Narrativa</h4>
                  <label>Obiettivo</label>
                  <textarea
                    value={villain.narrativa.obiettivo}
                    onChange={(e) =>
                      setVillain({ ...villain, narrativa: { ...villain.narrativa, obiettivo: e.target.value } })
                    }
                  />
                  <label>Motivazione</label>
                  <textarea
                    value={villain.narrativa.motivazione}
                    onChange={(e) =>
                      setVillain({ ...villain, narrativa: { ...villain.narrativa, motivazione: e.target.value } })
                    }
                  />
                  <label>Origine</label>
                  <textarea
                    value={villain.narrativa.origine}
                    onChange={(e) =>
                      setVillain({ ...villain, narrativa: { ...villain.narrativa, origine: e.target.value } })
                    }
                  />
                  <hr />
                  <div className="narrative-tools">
                    <button
                      onClick={() => setVillain({ ...villain, narrativa: { ...villain.narrativa, hook: generaHook("villain") } })}
                    >
                      🎭 Genera Hook
                    </button>
                    <button
                      onClick={() => setVillain({ ...villain, narrativa: { ...villain.narrativa, dialogo: generaDialogo("villain") } })}
                    >
                      💬 Genera Dialogo
                    </button>
                  </div>
                  <p><strong>Hook:</strong> {villain.narrativa.hook || "Nessun hook generato"}</p>
                  <p><strong>Dialogo:</strong> {villain.narrativa.dialogo || "Nessun dialogo generato"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModaleVillain;
