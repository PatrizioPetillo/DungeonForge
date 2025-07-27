import React, { useState, useEffect } from "react";
import { salvaInArchivio } from "../../utils/firestoreArchivio";
import { generaVillain } from "../../utils/generatoreVillain";
import { eliminaDaArchivio } from "../utils/firestoreArchivio";
import { armi, getTooltipProprieta } from "../../utils/armi";
import { armature } from "../../utils/armature";
import {
  generaHookVillain,
  generaDialogoVillain,
  genera3HookVillain,
  genera3DialoghiVillain
} from "../../utils/narrativeGenerators";
import { toast } from "react-toastify";
import ModaleCollegamento from "../modali/modaleCollegamento";
import "../../styles/modaleVillain.css";

const abilitaPerStat = {
  forza: ["Atletica"],
  destrezza: ["Acrobazia", "Furtività", "Rapidità di mano"],
  costituzione: [],
  intelligenza: ["Arcano", "Indagare", "Storia", "Natura", "Religione"],
  saggezza: ["Percezione", "Intuizione", "Medicina", "Sopravvivenza", "Addestrare Animali"],
  carisma: ["Persuasione", "Inganno", "Intrattenere", "Intimidire"]
};

export default function ModaleVillain({ onClose }) {
  const [villain, setvillain] = useState({});
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("Generali");
  const [spellSuggeriti, setSpellSuggeriti] = useState([]);
  const [opzioniHook, setOpzioniHook] = useState([]);
const [opzioniDialogo, setOpzioniDialogo] = useState([]);
const [showCollegamento, setShowCollegamento] = useState(false);
const [elementoId, setElementoId] = useState(null);

  const tabs = [
    "Generali",
    "Classe",
    "Statistiche",
    "Combattimento",
    ...(villain.magia ? ["Magia"] : []),
    "Equipaggiamento",
    "Narrativa"
  ];

  // Funzione per filtrare gli incantesimi in base alla query
  const filtraIncantesimi = (query) => {
  if (!query) {
    setSpellSuggeriti([]);
    return;
  }
  const classeKey = villain.classe?.toLowerCase();
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
function calcolaAttacco(arma, villain, isDistanza = false) {
  const modFor = Math.floor((villain.stats.forza - 10) / 2);
  const modDes = Math.floor((villain.stats.destrezza - 10) / 2);
  const isFinesse = arma.properties?.some(p => p.name.toLowerCase() === "finesse");
  const modBase = isDistanza ? modDes : (isFinesse ? Math.max(modFor, modDes) : modFor);
  const competente = villain.armiDiCompetenza?.some(a => a.index === arma.index);
  const prof = competente ? Math.ceil(villain.livello / 4) + 2 : 0;
  const bonus = modBase + prof;
  return bonus >= 0 ? `+${bonus}` : bonus;
}
const updateSpell = (index, field, value) => {
  const updated = [...villain.incantesimi];
  updated[index][field] = value;
  setvillain({ ...villain, incantesimi: updated });
};

const removeSpell = (index) => {
  const updated = villain.incantesimi.filter((_, i) => i !== index);
  setvillain({ ...villain, incantesimi: updated });
};

  const handleGenera = async () => {
    setLoading(true);
    const nuovovillain = await generaVillain();
    setvillain(nuovovillain);
    setLoading(false);
  };
  
const handleSalva = async () => {
  const data = { ...villain, tipo: "villain" };
  const result = await salvaInArchivio("villain", data);

    if (result.success) {
-    toast.success("✅ Villain salvato!");
-    setElementoId(result.id);
-    setShowCollegamento(true);
+    toast.success("✅ Villain salvato in Archivio!");
  } else {
    toast.error("❌ Errore nel salvataggio!");
  }
};

const rimuoviVillain = async (index) => {
  const updated = [...campagna.villain];
  const villainToRemove = updated[index];

  // Elimina dall'archivio se ha ID
  if (villainToRemove.id) {
    const result = await eliminaDaArchivio("villain", villainToRemove.id);
    if (!result.success) {
      console.error("Errore eliminazione villain dall'archivio");
    }
  }

  // Rimuovi da stato locale
  updated.splice(index, 1);
  setCampagna({ ...campagna, villain: updated });
};

useEffect(() => {
  if (villain) {
    setvillain(villain); // o setPNG(...)
  }
}, [villain]);

  return (
    <div className="modale-overlay">
      <div className="modale-villain">
        <div className="modale-villain-header">
          <h3>Generatore Villain</h3>
          <div className="actions">
            <button onClick={handleGenera}>🎲 Genera</button>
            <button onClick={handleSalva} disabled={!villain.nome}>💾 Salva</button>
            {loading && <p className="loading-text">⏳ Creazione in corso...</p>}
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
                    value={villain.nome || ""}
                    onChange={(e) => setvillain({ ...villain, nome: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Razza</label>
                  <input type="text" value={villain.razza || ""} readOnly />
                </div>

                <div className="form-group">
                  <label>Classe</label>
                  <input type="text" value={villain.classe || ""} readOnly />
                </div>

                <div className="form-group">
                  <label>Velocità</label>
                  <input type="number" value={villain.velocita || ""} readOnly />
                </div>

                <div className="form-group">
                  <label>Livello</label>
                  <input type="number" value={villain.livello || ""} readOnly />
                </div>

                {/* Dettagli razza */}
                {villain.dettagliRazza && (
                  <div className="background-info">
                    <p><strong>Razza:</strong> {villain.razza}</p>
                    {villain.linguaggi && villain.linguaggi.length > 0 && (
                  <div className="form-group">
                    <label>Linguaggi</label>
                    <input type="text" value={villain.linguaggi.join(", ")} readOnly />
                  </div>
                )}
                    <p><strong>Tratti:</strong> {villain.dettagliRazza.traits.map(t => t.name).join(", ")}</p>
                  </div>
                )}
              </div>

              <div className="image-section">
                <label>Immagine villain</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setvillain({ ...villain, immagine: reader.result });
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {villain.immagine && <img src={villain.immagine} alt="Anteprima villain" />}
              </div>
              <hr />
              {villain.privilegiRazza && villain.privilegiRazza.length > 0 && (
  <div className="privilegi-razza">
    <h5>Privilegi Razza</h5>
    <ul>
      {villain.privilegiRazza.map((priv, i) => (
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
              {villain.bonusRaziali && (
                <div className="bonus-raziali">
                  <strong>Bonus Razziali:</strong> {villain.bonusRaziali}
                </div>
              )}
              <div className="saving-throw">
  <h4>Tiri Salvezza</h4>
<ul className="saving-throws-list">
  {villain.tiriSalvezza?.length > 0 ? (
    villain.tiriSalvezza.map((ts, i) => (
      <li key={i}>
        ✅ {ts.stat.toUpperCase()}: {ts.bonus >= 0 ? `+${ts.bonus}` : ts.bonus}
      </li>
    ))
  ) : (
    <li>Nessuna competenza nei TS</li>
  )}
</ul>

</div>

              <div className="stat-grid">
                {Object.entries(villain.stats || {}).map(([stat, val]) => {
                  const mod = Math.floor((val - 10) / 2);
                  const isSavingThrow = villain.savingThrowsClasse.includes(stat);
                  const tiroSalvezza = isSavingThrow ? `+${villain.tiriSalvezza[stat]}` : null;

                  // Abilità collegate a questa caratteristica
                  const abilita = abilitaPerStat[stat] || [];

                  return (
                    <div key={stat} className="stat-box">
                      <h5>{stat.toUpperCase()}</h5>
                      <div className="stat-score">{val}</div>
                      <div className="stat-mod">{mod >= 0 ? `+${mod}` : mod}</div>

                      {abilita.length > 0 && (
                        <div className="abilita-box">
                          <strong>Abilità:</strong>
                          {abilita.map((a) => (
                            <label key={a} className="abilita-checkbox">
                              <input
                                type="checkbox"
                                checked={villain.abilitaClasse?.includes(a)}
                                onChange={(e) => {
                                  const updated = e.target.checked
                                    ? [...villain.abilitaClasse, a]
                                    : villain.abilitaClasse.filter((x) => x !== a);
                                  setvillain({ ...villain, abilitaClasse: updated });
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
                  value={villain.classe || ""}
                  onChange={(e) => setvillain({ ...villain, classe: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Sottoclasse o Archetipo</label>
                <input
                  type="text"
                  value={villain.sottoclasse || ""}
                  onChange={(e) => setvillain({ ...villain, sottoclasse: e.target.value })}
                />
              </div>
            </div>

            {/* PF e CA */}
            <div className="pf-ca">
              <div className="form-group">
                <label>PF</label>
                <input
                  type="number"
                  value={villain.pf || ""}
                  onChange={(e) => setvillain({ ...villain, pf: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>CA</label>
                <input
                  type="number"
                  value={villain.ca || ""}
                  onChange={(e) => setvillain({ ...villain, ca: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Bonus Competenza</label>
                <input type="text" value={`+${Math.ceil((villain.livello || 1) / 4) + 2}`} readOnly />
              </div>
              <div className="form-group">
                <label>Dado Vita</label>
                <input
                  type="text"
                  value={`d${villain.dadoVita || ""}`}
                  readOnly
                />
              </div>
            </div>

            {/* Competenze base */}
            <div className="classe-section">
              <h5>Competenze Base</h5>
              <ul>
                {villain.privilegiClasse?.length > 0 ? (
                  villain.privilegiClasse.map((p, i) => <li key={i}>{p}</li>)
                ) : (
                  <li>Nessuna competenza definita</li>
                )}
              </ul>
            </div>

            {/* Abilità a scelta */}
            <div className="classe-section">
              <h5>Abilità della Classe</h5>
              <div className="abilita-grid">
                {villain.competenzeScelte?.map((abilita, i) => (
                  <label key={i} className="abilita-checkbox">
                    <input
                      type="checkbox"
                      checked={villain.abilitaClasse?.includes(abilita)}
                      onChange={(e) => {
                        const updated = e.target.checked
                          ? [...villain.abilitaClasse, abilita]
                          : villain.abilitaClasse.filter((a) => a !== abilita);
                        setvillain({ ...villain, abilitaClasse: updated });
                      }}
                    />
                    {abilita}
                  </label>
                ))}
              </div>
            </div>

            {/* Privilegi di Classe */}
            <div className="classe-section">
              <h5>Privilegi di Classe (fino al livello {villain.livello})</h5>
              {villain.privilegiDettagliati?.length > 0 ? (
                <ul className="privilegi-list">
                  {villain.privilegiDettagliati.map((priv, i) => (
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
          {tab === "Magia" && villain.magia && (
            <div className="tab-magia">
              <h4>Gestione Magia</h4>

              {/* Info Magia */}
<div className="magia-info-grid">
  <p><strong>Stat Magica:</strong> {villain.magia.statPrincipale.toUpperCase()} </p>
  <p><strong>CD Incantesimi:</strong> {villain.magia.cd}</p>
  <p><strong>Bonus Attacco:</strong> +{villain.magia.bonusAttacco}</p>
  <p><strong>Focus Arcano:</strong> {villain.magia.focus}</p>
</div>

<hr />

{/* Tabella Slot */}
<h4>Slot Incantesimi</h4>
{villain.slotIncantesimi && villain.slotIncantesimi.length > 0 ? (
  <table className="slot-table">
    <thead>
      <tr>
        <th>Livello</th>
        <th>Slots Disponibili</th>
        <th>Incantesimi Conosciuti</th>
      </tr>
    </thead>
    <tbody>
      {villain.slotIncantesimi.map((sl, idx) => {
        const incCount = villain.incantesimi?.livelli?.[idx]?.lista?.length || 0;
        return (
          <tr key={idx}>
            <td>{sl.livello}</td>
            <td>{sl.slots}</td>
            <td>{incCount}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
) : (
  <p>Nessuno slot disponibile</p>
)}


<hr />

{/* Tabella Trucchetti */}
<h4>Trucchetti</h4>
<table className="spell-table">
  <thead>
    <tr>
      <th>Nome</th>
      <th>Scuola</th>
      <th>Durata</th>
      <th>Gittata</th>
      <th>Descrizione</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {villain.incantesimi?.trucchetti?.length > 0 ? (
      villain.incantesimi.trucchetti.map((spell, i) => (
        <tr key={i}>
          <td>{spell.nome}</td>
          <td>{spell.scuola}</td>
          <td>{spell.durata}</td>
          <td>{spell.gittata}</td>
          <td>
            <span title={spell.descrizione}>
              {spell.descrizione.slice(0, 40)}...
            </span>
          </td>
          <td>
            <button onClick={() => {
              const updated = villain.incantesimi.trucchetti.filter((_, idx) => idx !== i);
              setvillain({
                ...villain,
                incantesimi: { ...villain.incantesimi, trucchetti: updated }
              });
            }}>❌</button>
          </td>
        </tr>
      ))
    ) : (
      <tr><td colSpan="6">Nessun trucchetto</td></tr>
    )}
  </tbody>
</table>

<hr />

{/* Incantesimi per livello */}
{villain.incantesimi?.livelli?.map((lvl, idx) => (
  <div key={idx} className="spell-section">
    <h4>Livello {lvl.livello} (Slots: {lvl.slots})</h4>
    <table className="spell-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Scuola</th>
          <th>Durata</th>
          <th>Gittata</th>
          <th>Descrizione</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {lvl.lista.length > 0 ? (
          lvl.lista.map((spell, i) => (
            <tr key={i}>
              <td>{spell.nome}</td>
              <td>{spell.scuola}</td>
              <td>{spell.durata}</td>
              <td>{spell.gittata}</td>
              <td>
                <span title={spell.descrizione}>
                  {spell.descrizione.slice(0, 40)}...
                </span>
              </td>
              <td>
                <button onClick={() => {
                  const newLivelli = [...villain.incantesimi.livelli];
                  newLivelli[idx].lista.splice(i, 1);
                  setvillain({
                    ...villain,
                    incantesimi: { ...villain.incantesimi, livelli: newLivelli }
                  });
                }}>❌</button>
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan="6">Nessun incantesimo</td></tr>
        )}
      </tbody>
    </table>
    <button onClick={() => {
      const nuovoInc = {
        nome: "Nuovo Incantesimo",
        scuola: "?",
        durata: "—",
        gittata: "—",
        descrizione: "Descrizione breve"
      };
      const newLivelli = [...villain.incantesimi.livelli];
      newLivelli[idx].lista = [...lvl.lista, nuovoInc];
      setvillain({
        ...villain,
        incantesimi: { ...villain.incantesimi, livelli: newLivelli }
      });
    }}>+ Aggiungi Incantesimo</button>
  </div>
))}


            </div>
          )}

          {/* TAB EQUIPAGGIAMENTO */}
          {tab === "Equipaggiamento" && (
            <div className="tab-equipaggiamento">
              <h4>Inventario</h4>
              <ul className="equip-list">
                {villain.equipVari?.length > 0 ? (
                  villain.equipVari.map((obj, i) => (
                    <li key={i} className="equip-item">
                      {obj}
                      <button onClick={() => {
                        const updated = villain.equipVari.filter((_, idx) => idx !== i);
                        setvillain({ ...villain, equipVari: updated });
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
                      setvillain({ ...villain, equipVari: [...(villain.equipVari || []), e.target.value.trim()] });
                      e.target.value = "";
                    }
                  }}
                />
                <hr />
              {villain.magia && (
                <>
                <h4>Focus Arcano</h4>
                <div className="form-group">
                  <input
                    type="text"
                    value={villain.magia?.focus || ""}
                    onChange={(e) => setvillain({ ...villain, magia: { ...villain.magia, focus: e.target.value } })}
                    placeholder="Inserisci o modifica il focus arcano"
                  />
                </div>
                </>
              )}
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
                    value={villain.pf || 0}
                    onChange={(e) => setvillain({ ...villain, pf: parseInt(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>PF Massimi</label>
                  <input type="number" value={villain.pf || 0} readOnly />
                </div>
                <div className="form-group">
                  <label>Classe Armatura</label>
                  <input type="number" value={villain.ca || 10} readOnly />
                </div>
                <div className="form-group">
                  <label>Velocità</label>
                  <input type="text" value={`${villain.velocita || 9} m`} readOnly />
                </div>
                <div className="form-group">
                  <label>Bonus Competenza</label>
                  <input type="text" value={`+${Math.ceil((villain.livello || 1) / 4) + 2}`} readOnly />
                </div>
              </div>

              <hr />

              {/* --- ARMA DA MISCHIA --- */}
              <h4>⚔️ Arma da Mischia</h4>
              {villain.armaMischia ? (
                <table className="combat-table">
                  <thead>
                    <tr>
                      <th>Arma</th>
                      <th>Bonus Attacco</th>
                      <th>Danno</th>
                      <th>Proprietà</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{villain.armaMischia.name}</td>
                      <td>
                        {(() => {
                          const isFinesse = villain.armaMischia.properties?.some(p => p.name.toLowerCase() === "finesse");
                          const modFor = Math.floor((villain.stats.forza - 10) / 2);
                          const modDes = Math.floor((villain.stats.destrezza - 10) / 2);
                          const modBase = isFinesse ? Math.max(modFor, modDes) : modFor;
                          const prof = villain.armiDiCompetenza?.some(a => a.index === villain.armaMischia.index)
                            ? Math.ceil(villain.livello / 4) + 2
                            : 0;
                          const bonus = modBase + prof;
                          return bonus >= 0 ? `+${bonus}` : bonus;
                        })()}
                      </td>
                      <td>{villain.armaMischia.damage.damage_dice} {villain.armaMischia.damage.damage_type.name}</td>
                      <td>
                        {villain.armaMischia.properties?.map((p, i) => (
                          <span key={i} title={getTooltipProprieta(p.name)}>
                            {p.name}{i < villain.armaMischia.properties.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>Nessuna arma da mischia</p>
              )}

              <hr />

              {/* --- ARMA A DISTANZA --- */}
              <h4>🏹 Arma a Distanza</h4>
              {villain.armaDistanza ? (
                <table className="combat-table">
                  <thead>
                    <tr>
                      <th>Arma</th>
                      <th>Bonus Attacco</th>
                      <th>Danno</th>
                      <th>Proprietà</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{villain.armaDistanza.name}</td>
                      <td>
                        {(() => {
                          const modDes = Math.floor((villain.stats.destrezza - 10) / 2);
                          const prof = villain.armiDiCompetenza?.some(a => a.index === villain.armaDistanza.index)
                            ? Math.ceil(villain.livello / 4) + 2
                            : 0;
                          const bonus = modDes + prof;
                          return bonus >= 0 ? `+${bonus}` : bonus;
                        })()}
                      </td>
                      <td>{villain.armaDistanza.damage.damage_dice} {villain.armaDistanza.damage.damage_type.name}</td>
                      <td>
                        {villain.armaDistanza.properties?.map((p, i) => (
                          <span key={i} title={getTooltipProprieta(p.name)}>
                            {p.name}{i < villain.armaDistanza.properties.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>Nessuna arma a distanza</p>
              )}

              <hr />

              {/* --- ARMATURA E SCUDO --- */}
              <h4>🛡️ Armatura Equipaggiata</h4>
              {villain.armaturaEquipaggiata ? (
                <table className="combat-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th>CA Base</th>
                      <th>Proprietà</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{villain.armaturaEquipaggiata.name}</td>
                      <td>{villain.armaturaEquipaggiata.categorie[0]}</td>
                      <td>{villain.armaturaEquipaggiata.armor_class.base}</td>
                      <td>{villain.armaturaEquipaggiata.proprieta?.join(", ") || "-"}</td>
                    </tr>
                    {villain.scudoEquipaggiato && (
                      <tr>
                        <td>{villain.scudoEquipaggiato.name}</td>
                        <td>Scudo</td>
                        <td>+{villain.scudoEquipaggiato.armor_class.base}</td>
                        <td>-</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <p>Nessuna armatura equipaggiata (CA: 10 + Mod Destrezza)</p>
              )}

              <p><strong>CA Totale:</strong> {villain.ca}</p>
            </div>
          )}


          {/* TAB NARRATIVA */}
          {tab === "Narrativa" && (
            <div className="tab-content">
              <div className="form-group" style={{ gridColumn: "span 2" }}>
                <label>Descrizione</label>
                <textarea
                  rows="8"
                  placeholder="Descrizione del villain"
                  value={villain.descrizione || ""}
                  onChange={(e) => setvillain({ ...villain, descrizione: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Origine</label>
                <textarea
                  rows="6"
                  placeholder="Origine"
                  value={villain.origine || ""}
                  onChange={(e) => setvillain({ ...villain, origine: e.target.value })}
                />  
              </div>
              
              <hr />
  <div className="narrative-tools">
  <button
    onClick={() => setvillain({ ...villain, narrativa: { ...villain.narrativa, hook: generaHookVillain() } })}
  >
    🎭 Genera Hook
  </button>
  <button
    onClick={() => setvillain({ ...villain, narrativa: { ...villain.narrativa, dialogo: generaDialogoVillain() } })}
  >
    💬 Genera Dialogo
  </button>
  <button onClick={() => setOpzioniHook(genera3HookVillain())}>🎲 3 Hook</button>
  <button onClick={() => setOpzioniDialogo(genera3DialoghiVillain())}>🎲 3 Dialoghi</button>
</div>


{opzioniHook.length > 0 && (
  <div className="varianti-container">
    <h4>Scegli un Hook:</h4>
    {opzioniHook.map((h, i) => (
      <button key={i} onClick={() => {
        setvillain({ ...villain, narrativa: { ...villain.narrativa, hook: h } });
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
        setvillain({ ...villain, narrativa: { ...villain.narrativa, dialogo: d } });
        setOpzioniDialogo([]);
      }}>
        {d}
      </button>
    ))}
  </div>
)}


<div className="narrative-results">
  <p><strong>Hook:</strong> {villain.narrativa?.hook || "Nessun hook generato"}</p>
  <p><strong>Dialogo:</strong> {villain.narrativa?.dialogo || "Nessun dialogo generato"}</p>
</div>

            </div>
          )}
        </div>
        {showCollegamento && (
  <ModaleCollegamento
    idElemento={elementoId}
    tipoElemento="villain"
    onClose={() => setShowCollegamento(false)}
  />
)}
      </div>
    </div>
  );
}
