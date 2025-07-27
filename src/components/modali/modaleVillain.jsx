import React, { useState, useEffect } from "react";
import { salvaInArchivio } from "../../utils/firestoreArchivio";
import { generaVillain } from "../../utils/generatoreVillain";
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
const ordineStats = ["forza", "destrezza", "costituzione", "intelligenza", "saggezza", "carisma"];


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
    data.id = result.id; // 🔥 Aggiungi ID al villain
    toast.success("✅ Villain salvato in Archivio!");

    if (collegaAllaCampagna && onSave) {
      onSave(data);
    }
  } else {
    toast.error("❌ Errore nel salvataggio!");
  }
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
                  <input type="text" value={villain.razza || ""} 
                  onChange={(e) => setvillain({ ...villain, razza: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Classe</label>
                  <input type="text" value={villain.classe || ""} 
                  onChange={(e) => {
  const nuovaClasse = e.target.value.toLowerCase();
  const newVillain = { ...villain, classe: nuovaClasse };
  
  if (villain.stats) {
    const principale = statPrincipalePerClasse[nuovaClasse];
    if (principale) {
      const statsArray = Object.entries(newVillain.stats);
      statsArray.sort((a, b) => b[1] - a[1]); // ordina per valore
      const [maxStatName, maxVal] = statsArray[0];
      if (principale !== maxStatName) {
        // Swap: la stat principale diventa la più alta
        const oldValue = newVillain.stats[principale];
        newVillain.stats[principale] = maxVal;
        newVillain.stats[maxStatName] = oldValue;
      }
    }
  }
  setvillain(newVillain);
}} />
                </div>

                <div className="form-group">
                  <label>Velocità</label>
                  <input type="number" value={villain.velocita || ""} 
                  onChange={(e) => setvillain({ ...villain, velocita: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Livello</label>
                  <input type="number" value={villain.livello || ""} 
                  onChange={(e) => setvillain({ ...villain, livello: e.target.value })} />
                </div>

                {/* Dettagli razza */}
                {villain.dettagliRazza && (
                  <div className="background-info">
                    <p><strong>Razza:</strong> {villain.razza}</p>
                    {villain.linguaggi && villain.linguaggi.length > 0 && (
                  <div className="form-group">
                    <label>Linguaggi</label>
                    <input type="text" value={villain.linguaggi.join(", ")} 
                    onChange={(e) => setvillain({ ...villain, linguaggi: e.target.value.split(", ") })} />
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
                {ordineStats.map(stat => {
                  const val = villain.stats[stat] || 0;
                  const mod = Math.floor((val - 10) / 2);
                  const abilita = abilitaPerStat[stat] || [];
                  return (
                    <div key={stat} className="stat-box">
                      <h5>{stat.toUpperCase()}</h5>
                      <input
                        type="number"
                        value={val}
                        onChange={(e) => {
                          const newStats = { ...villain.stats, [stat]: parseInt(e.target.value) || 0 };
                          setvillain({ ...villain, stats: newStats });
                        }}
                      />
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
                <input type="text" value={`+${Math.ceil((villain.livello || 1) / 4) + 2}`} onChange={(e) => setvillain({ ...villain, bonusCompetenza: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Dado Vita</label>
                <input
                  type="text"
                  value={`d${villain.dadoVita || ""}`}
                  onChange={(e) => setvillain({ ...villain, dadoVita: e.target.value })}
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
<div className="magic-actions">
  <button
    onClick={() => {
      const nuovo = { livello: villain.slotIncantesimi.length + 1, slots: 0 };
      setvillain({
        ...villain,
        slotIncantesimi: [...villain.slotIncantesimi, nuovo],
        incantesimi: {
          ...villain.incantesimi,
          livelli: [...(villain.incantesimi?.livelli || []), { livello: nuovo.livello, slots: 0, lista: [] }]
        }
      });
    }}
  >
    + Aggiungi Livello
  </button>
</div>

<table className="slot-table">
  <thead>
    <tr>
      <th>Livello</th>
      <th>Slots Disponibili</th>
      <th>Azioni</th>
    </tr>
  </thead>
  <tbody>
    {villain.slotIncantesimi?.length > 0 ? (
      villain.slotIncantesimi.map((sl, idx) => (
        <tr key={idx}>
          <td>{sl.livello}</td>
          <td>
            <input
              type="number"
              value={sl.slots}
              onChange={(e) => {
                const newSlots = [...villain.slotIncantesimi];
                newSlots[idx].slots = parseInt(e.target.value);
                const newLivelli = [...villain.incantesimi.livelli];
                newLivelli[idx].slots = parseInt(e.target.value);
                setvillain({
                  ...villain,
                  slotIncantesimi: newSlots,
                  incantesimi: { ...villain.incantesimi, livelli: newLivelli }
                });
              }}
            />
          </td>
          <td>
            <button
              className="delete-btn"
              onClick={() => {
                const newSlots = villain.slotIncantesimi.filter((_, i) => i !== idx);
                const newLivelli = villain.incantesimi.livelli.filter((_, i) => i !== idx);
                setvillain({
                  ...villain,
                  slotIncantesimi: newSlots,
                  incantesimi: { ...villain.incantesimi, livelli: newLivelli }
                });
              }}
            >
              ❌
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr><td colSpan="3">Nessuno slot disponibile</td></tr>
    )}
  </tbody>
</table>


<hr />

{/* Tabella Trucchetti */}
<h4>Trucchetti</h4>
<div className="magic-actions">
  <button
    onClick={() => {
      const nuovo = {
        nome: "Nuovo Trucchetto",
        scuola: "?",
        durata: "—",
        gittata: "—",
        descrizione: "Descrizione breve"
      };
      setvillain({
        ...villain,
        incantesimi: {
          ...villain.incantesimi,
          trucchetti: [...(villain.incantesimi.trucchetti || []), nuovo]
        }
      });
    }}
  >
    + Aggiungi Trucchetto
  </button>
</div>

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
          <td><input type="text" value={spell.nome} onChange={(e) => {
            const updated = [...villain.incantesimi.trucchetti];
            updated[i].nome = e.target.value;
            setvillain({ ...villain, incantesimi: { ...villain.incantesimi, trucchetti: updated } });
          }} /></td>
          <td><input type="text" value={spell.scuola} onChange={(e) => {
            const updated = [...villain.incantesimi.trucchetti];
            updated[i].scuola = e.target.value;
            setvillain({ ...villain, incantesimi: { ...villain.incantesimi, trucchetti: updated } });
          }} /></td>
          <td><input type="text" value={spell.durata} onChange={(e) => {
            const updated = [...villain.incantesimi.trucchetti];
            updated[i].durata = e.target.value;
            setvillain({ ...villain, incantesimi: { ...villain.incantesimi, trucchetti: updated } });
          }} /></td>
          <td><input type="text" value={spell.gittata} onChange={(e) => {
            const updated = [...villain.incantesimi.trucchetti];
            updated[i].gittata = e.target.value;
            setvillain({ ...villain, incantesimi: { ...villain.incantesimi, trucchetti: updated } });
          }} /></td>
          <td><textarea value={spell.descrizione} onChange={(e) => {
            const updated = [...villain.incantesimi.trucchetti];
            updated[i].descrizione = e.target.value;
            setvillain({ ...villain, incantesimi: { ...villain.incantesimi, trucchetti: updated } });
          }} /></td>
          <td>
            <button
              onClick={() => {
                const updated = villain.incantesimi.trucchetti.filter((_, idx) => idx !== i);
                setvillain({ ...villain, incantesimi: { ...villain.incantesimi, trucchetti: updated } });
              }}
              className="delete-btn"
            >
              ❌
            </button>
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
    <h4>
      Livello {lvl.livello} (Slots: {lvl.slots})
      <button
        onClick={() => {
          const newLivelli = villain.incantesimi.livelli.filter((_, i) => i !== idx);
          setvillain({ ...villain, incantesimi: { ...villain.incantesimi, livelli: newLivelli } });
        }}
        className="delete-btn"
      >
        ❌ Elimina livello
      </button>
    </h4>

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
              <td><input type="text" value={spell.nome} onChange={(e) => {
                const newLivelli = [...villain.incantesimi.livelli];
                newLivelli[idx].lista[i].nome = e.target.value;
                setvillain({ ...villain, incantesimi: { ...villain.incantesimi, livelli: newLivelli } });
              }} /></td>
              <td><input type="text" value={spell.scuola} onChange={(e) => {
                const newLivelli = [...villain.incantesimi.livelli];
                newLivelli[idx].lista[i].scuola = e.target.value;
                setvillain({ ...villain, incantesimi: { ...villain.incantesimi, livelli: newLivelli } });
              }} /></td>
              <td><input type="text" value={spell.durata} onChange={(e) => {
                const newLivelli = [...villain.incantesimi.livelli];
                newLivelli[idx].lista[i].durata = e.target.value;
                setvillain({ ...villain, incantesimi: { ...villain.incantesimi, livelli: newLivelli } });
              }} /></td>
              <td><input type="text" value={spell.gittata} onChange={(e) => {
                const newLivelli = [...villain.incantesimi.livelli];
                newLivelli[idx].lista[i].gittata = e.target.value;
                setvillain({ ...villain, incantesimi: { ...villain.incantesimi, livelli: newLivelli } });
              }} /></td>
              <td><textarea value={spell.descrizione} onChange={(e) => {
                const newLivelli = [...villain.incantesimi.livelli];
                newLivelli[idx].lista[i].descrizione = e.target.value;
                setvillain({ ...villain, incantesimi: { ...villain.incantesimi, livelli: newLivelli } });
              }} /></td>
              <td>
                <button
                  onClick={() => {
                    const newLivelli = [...villain.incantesimi.livelli];
                    newLivelli[idx].lista.splice(i, 1);
                    setvillain({ ...villain, incantesimi: { ...villain.incantesimi, livelli: newLivelli } });
                  }}
                  className="delete-btn"
                >
                  ❌
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr><td colSpan="6">Nessun incantesimo</td></tr>
        )}
      </tbody>
    </table>

    <button
      onClick={() => {
        const nuovoInc = {
          nome: "Nuovo Incantesimo",
          scuola: "?",
          durata: "—",
          gittata: "—",
          descrizione: "Descrizione breve"
        };
        const newLivelli = [...villain.incantesimi.livelli];
        newLivelli[idx].lista.push(nuovoInc);
        setvillain({ ...villain, incantesimi: { ...villain.incantesimi, livelli: newLivelli } });
      }}
    >
      + Aggiungi Incantesimo
    </button>
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
              <hr />
              {tab === "Equipaggiamento" && (
  <div className="tab-contenuto">
    <h3>⚔️ Armi Equipaggiate</h3>
    {villain.armamento?.armi && villain.armamento.armi.length > 0 ? (
      <ul>
        {villain.armamento.armi.map((arma, i) => (
          <li key={i}>
            <strong>{arma.nome}</strong> – <span>{arma.danno}</span>
            {arma.magico && <span> ✨ Magica</span>}
          </li>
        ))}
      </ul>
    ) : (
      <p>Nessuna arma assegnata</p>
    )}

    <h3>🛡️ Armatura & Scudo</h3>
    {villain.armamento?.armatura ? (
      <p>
        <strong>{villain.armamento.armatura.nome}</strong> (CA Base: {villain.armamento.armatura.CA})
      </p>
    ) : (
      <p>Nessuna armatura</p>
    )}
    {villain.armamento?.scudo && (
      <p>
        <strong>{villain.armamento.scudo.nome}</strong> (+{villain.armamento.scudo.bonus} CA)
      </p>
    )}
    <p><strong>CA Totale:</strong> {villain.ca || "—"}</p>

    <h3>🔮 Oggetti Magici</h3>
    {villain.armamento?.oggettiMagici && villain.armamento.oggettiMagici.length > 0 ? (
      <ul>
        {villain.armamento.oggettiMagici.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    ) : (
      <p>Nessun oggetto magico</p>
    )}
  </div>
)}
              <hr />

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
                  <input type="number" value={villain.pf || 0} onChange={(e) => setvillain({ ...villain, pf: parseInt(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Classe Armatura</label>
                  <input type="number" value={villain.ca || 10} onChange={(e) => setvillain({ ...villain, ca: parseInt(e.target.value) })} />
                </div>
                <div className="form-group">
                  <label>Velocità</label>
                  <input type="text" value={`${villain.velocita || 9} m`} onChange={(e) => setvillain({ ...villain, velocita: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Bonus Competenza</label>
                  <input type="text" value={`+${Math.ceil((villain.livello || 1) / 4) + 2}`} onChange={(e) => setvillain({ ...villain, bonusCompetenza: e.target.value })} />
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
                      <td>
  <input
    type="text"
    value={villain.armaMischia?.name || ""}
    onChange={(e) => setvillain({
      ...villain,
      armaMischia: { ...villain.armaMischia, name: e.target.value }
    })}
  />
</td>
                      <td>
                        <input
                          type="text"
                          value={(() => {
                            const isFinesse = villain.armaMischia.properties?.some(p => p.name.toLowerCase() === "finesse");
                            const modFor = Math.floor((villain.stats.forza - 10) / 2);
                            const modDes = Math.floor((villain.stats.destrezza - 10) / 2);
                            const modBase = isFinesse ? Math.max(modFor, modDes) : modFor;
                          })()}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={`${villain.armaMischia.damage.damage_dice} ${villain.armaMischia.damage.damage_type.name}`}
                          onChange={(e) => setvillain({
                            ...villain,
                            armaMischia: { ...villain.armaMischia, damage: { ...villain.armaMischia.damage, damage_dice: e.target.value.split(" ")[0], damage_type: { name: e.target.value.split(" ")[1] } } }
                          })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={villain.armaMischia.properties?.map(p => p.name).join(", ") || ""}
                          onChange={(e) => {
                            const newProperties = e.target.value.split(",").map(name => ({ name: name.trim() }));
                            setvillain({
                              ...villain,
                              armaMischia: { ...villain.armaMischia, properties: newProperties }
                            });
                          }}
                        />
                      </td>
                      <td>
      <button
        onClick={() =>
          setvillain({
            ...villain,
            armaMischia: null,
          })
        }
        className="delete-btn"
      >
        ❌
      </button>
    </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>Nessuna arma da mischia</p>
              )}
<button
  onClick={() => setvillain({
    ...villain,
    armaMischia: villain.armaMischia || { name: "", damage: "", properties: [] }
  })}
>
  + Aggiungi Arma
</button>

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
                      <td>
                        <input
                          type="text"
                          value={villain.armaDistanza.name}
                          onChange={(e) => setvillain({
                            ...villain,
                            armaDistanza: { ...villain.armaDistanza, name: e.target.value }
                          })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={(() => {
                            const modDes = Math.floor((villain.stats.destrezza - 10) / 2);
                            const prof = villain.armiDiCompetenza?.some(a => a.index === villain.armaDistanza.index)
                              ? Math.ceil(villain.livello / 4) + 2
                              : 0;
                          const bonus = modDes + prof;
                          return bonus >= 0 ? `+${bonus}` : bonus;
                        })()} />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={`${villain.armaDistanza.damage.damage_dice} ${villain.armaDistanza.damage.damage_type.name}`}
                          onChange={(e) => setvillain({
                            ...villain,
                            armaDistanza: { ...villain.armaDistanza, damage: { ...villain.armaDistanza.damage, damage_dice: e.target.value.split(" ")[0], damage_type: { name: e.target.value.split(" ")[1] } } }
                          })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={villain.armaDistanza.properties?.map(p => p.name).join(", ") || ""}
                          onChange={(e) => {
                            const newProperties = e.target.value.split(",").map(name => ({ name: name.trim() }));
                            setvillain({
                              ...villain,
                              armaDistanza: { ...villain.armaDistanza, properties: newProperties }
                            });
                          }}
                        />
                      </td>
                      <td>
      <button
        onClick={() =>
          setvillain({
            ...villain,
            armaDistanza: null,
          })
        }
        className="delete-btn"
      >
        ❌
      </button>
    </td>
                    </tr>
                  </tbody>
                </table>
              ) : (
                <p>Nessuna arma a distanza</p>
              )}

              <button
  onClick={() => setvillain({
    ...villain,
    armaDistanza: villain.armaDistanza || { name: "", damage: "", properties: [] }
  })}
>
  + Aggiungi Arma a Distanza
</button>


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
                      <td>
                        <input
                          type="text"
                          value={villain.armaturaEquipaggiata.name}
                          onChange={(e) => setvillain({
                            ...villain,
                            armaturaEquipaggiata: { ...villain.armaturaEquipaggiata, name: e.target.value }
                          })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={villain.armaturaEquipaggiata.categorie[0]}
                          onChange={(e) => setvillain({
                            ...villain,
                            armaturaEquipaggiata: { ...villain.armaturaEquipaggiata, categorie: [e.target.value] }
                          })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={villain.armaturaEquipaggiata.armor_class.base}
                          onChange={(e) => setvillain({
                            ...villain,
                            armaturaEquipaggiata: { ...villain.armaturaEquipaggiata, armor_class: { ...villain.armaturaEquipaggiata.armor_class, base: e.target.value } }
                          })}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={villain.armaturaEquipaggiata.proprieta?.join(", ") || ""}
                          onChange={(e) => {
                            const newProperties = e.target.value.split(",").map(name => ({ name: name.trim() }));
                            setvillain({
                              ...villain,
                              armaturaEquipaggiata: { ...villain.armaturaEquipaggiata, proprieta: newProperties }
                            });
                          }}
                        />
                      </td>
                      <td>
      <button
        onClick={() =>
          setvillain({
            ...villain,
            armaturaEquipaggiata: null,
          })
        }
        className="delete-btn"
      >
        ❌
      </button>
    </td>
                    </tr>
                    {villain.scudoEquipaggiato && (
                      <tr>
                        <td>
                          <input
                            type="text"
                            value={villain.scudoEquipaggiato.name}
                            onChange={(e) => setvillain({
                              ...villain,
                              scudoEquipaggiato: { ...villain.scudoEquipaggiato, name: e.target.value }
                            })}
                          />
                        </td>
                        <td>Scudo</td>
                        <td>
                          <input
                            type="text"
                            value={villain.scudoEquipaggiato.armor_class.base}
                            onChange={(e) => setvillain({
                              ...villain,
                              scudoEquipaggiato: { ...villain.scudoEquipaggiato, armor_class: { ...villain.scudoEquipaggiato.armor_class, base: e.target.value } }
                            })}
                          />
                        </td>
                        <td>
      <button
        onClick={() =>
          setvillain({
            ...villain,
            scudoEquipaggiato: null,
          })
        }
        className="delete-btn"
      >
        ❌
      </button>
    </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              ) : (
                <p>Nessuna armatura equipaggiata (CA: 10 + Mod Destrezza)</p>
              )}
              <button
                onClick={() => setvillain({
                  ...villain,
                  armaturaEquipaggiata: villain.armaturaEquipaggiata || { name: "", categorie: [""], armor_class: { base: 10 }, proprieta: [] },
                  scudoEquipaggiato: villain.scudoEquipaggiato || { name: "", armor_class: { base: 2 } }
                })}
              >
                + Aggiungi Armatura/Scudo
              </button>
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
