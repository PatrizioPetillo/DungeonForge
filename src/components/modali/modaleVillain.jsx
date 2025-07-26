import React, { useState } from "react";
import { generaVillainCompleto } from "../../utils/generatoreVillain";
import { salvaInArchivio } from "../../utils/firestoreArchivio";
import {
  genera3HookVillain,
  genera3DialoghiVillain
} from "../../utils/narrativeGenerators";
import "../../styles/modaleVillain.css";

export default function ModaleVillain({ onClose }) {
  const [villain, setVillain] = useState({});
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("Generali");
  const [promptIA, setPromptIA] = useState("");
  const [opzioniHook, setOpzioniHook] = useState([]);
  const [opzioniDialogo, setOpzioniDialogo] = useState([]);

  const tabs = [
    "Generali",
    "Classe",
    "Statistiche",
    "Combattimento",
    ...(villain.magia ? ["Magia"] : []),
    "Equipaggiamento",
    "Narrativa"
  ];

  const handleGenera = async () => {
    setLoading(true);
    const nuovo = await generaVillainCompleto();
    setVillain(nuovo);
    setLoading(false);
  };

  const handleSalva = async () => {
    const ok = await salvaInArchivio("villain", villain);
    if (ok) {
      alert("Villain salvato nell'Archivio!");
      onClose();
    }
  };

  const abilitaPerStat = {
    forza: ["Atletica"],
    destrezza: ["Acrobazia", "Furtività", "Rapidità di mano"],
    costituzione: [],
    intelligenza: ["Arcano", "Indagare", "Storia", "Natura", "Religione"],
    saggezza: ["Percezione", "Intuizione", "Medicina", "Sopravvivenza", "Addestrare Animali"],
    carisma: ["Persuasione", "Inganno", "Intrattenere", "Intimidire"]
  };

  return (
    <div className="modale-overlay">
      <div className="modale-villain">
        <div className="modale-villain-header">
          <h3>Generatore Villain</h3>
          <div className="actions">
            <button onClick={handleGenera}>🎲 Genera</button>
            <button onClick={handleSalva} disabled={!villain.nome}>💾 Salva</button>
            {loading && <p className="loading-text">⏳ Generazione in corso...</p>}
            <button onClick={onClose}>❌ Chiudi</button>
          </div>
        </div>

        {/* Tabs */}
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

        {/* Contenuto tab */}
        <div className="modale-body">
          {/* TAB GENERALI */}
          {tab === "Generali" && (
            <div>
              <div className="form-fields">
                <p><strong>Nome:</strong> {villain.nome || "—"}</p>
                <p><strong>Razza:</strong> {villain.razza || "—"}</p>
                <p><strong>Classe:</strong> {villain.classeEvocativa || villain.classe || "—"}</p>
                <p><strong>Allineamento:</strong> {villain.allineamento || "—"}</p>
                <p><strong>Background evocativo:</strong> {villain.background?.nomeEvocativo || "—"}</p>
              </div>

              {/* AI Assistita */}
              <div className="ai-section">
                <h4>🤖 Generazione Assistita da AI</h4>
                <p className="ai-hint">Suggerisci uno stile, motivazione o potere.</p>
                <textarea
                  placeholder="Es: Un vampiro carismatico ossessionato dal dominio mentale..."
                  value={promptIA}
                  onChange={(e) => setPromptIA(e.target.value)}
                  className="ai-textarea"
                />
                <button disabled className="btn-ai">🚧 Integrazione API in sviluppo</button>
              </div>
            </div>
          )}

          {/* TAB CLASSE */}
          {tab === "Classe" && (
            <div>
              <h4>Competenze</h4>
              <ul>
                {villain.competenze?.length > 0
                  ? villain.competenze.map((c, i) => <li key={i}>{c}</li>)
                  : <li>Nessuna competenza definita</li>}
              </ul>
              <h4>Abilità</h4>
              <ul>
                {villain.abilitaClasse?.length > 0
                  ? villain.abilitaClasse.map((a, i) => <li key={i}>{a.name || a}</li>)
                  : <li>Nessuna abilità selezionata</li>}
              </ul>
              <h4>Privilegi di Classe e Razza</h4>
              <ul>
                {villain.privilegiDettagliati?.map((p, i) => (
                  <li key={i} title={p.desc || ""}>{p.name}</li>
                ))}
                {villain.privilegiRazza?.map((p, i) => (
                  <li key={i} title={p.descrizione || ""}>{p.nome}</li>
                ))}
              </ul>
            </div>
          )}

          {/* TAB STATISTICHE */}
          {tab === "Statistiche" && (
            <div>
              <h4>Punteggi Caratteristica</h4>
              <div className="stat-grid">
                {["forza", "destrezza", "costituzione", "intelligenza", "saggezza", "carisma"].map((stat) => {
                  const val = villain.stats?.[stat];
                  const mod = val ? Math.floor((val - 10) / 2) : 0;
                  const abilita = abilitaPerStat[stat] || [];
                  return (
                    <div key={stat} className="stat-box">
                      <h5>{stat.toUpperCase()}</h5>
                      <div className="stat-score">{val || "-"}</div>
                      <div className="stat-mod">{mod >= 0 ? `+${mod}` : mod}</div>
                      <small>Abilità: {abilita.join(", ")}</small>
                    </div>
                  );
                })}
              </div>
              <p><strong>Bonus razziali:</strong> {villain.bonusRaziali}</p>
            </div>
          )}

          {/* TAB COMBATTIMENTO */}
          {tab === "Combattimento" && (
            <div>
              <h4>⚔️ Armi Equipaggiate</h4>
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
                  {villain.armiEquippate?.map((arma, i) => {
                    const isFinesse = arma.properties?.some(p => p.name.toLowerCase() === "finesse");
                    const modFor = Math.floor((villain.stats?.forza - 10) / 2);
                    const modDes = Math.floor((villain.stats?.destrezza - 10) / 2);
                    const modBase = isFinesse ? Math.max(modFor, modDes) : modFor;
                    const bonusAttacco = modBase + Math.ceil(villain.livello / 4) + 2;
                    return (
                      <tr key={i}>
                        <td>{arma.name}</td>
                        <td>{bonusAttacco >= 0 ? `+${bonusAttacco}` : bonusAttacco}</td>
                        <td>{arma.damage?.damage_dice || "-"} {arma.damage?.damage_type?.name || ""}</td>
                        <td>{arma.properties?.map(p => p.name).join(", ") || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <h4>🛡️ Armature</h4>
              <ul>
                {villain.armatureIndossate?.map((arm, i) => (
                  <li key={i}>{arm.name} (CA Base: {arm.armor_class.base})</li>
                ))}
              </ul>
              <p><strong>CA Totale:</strong> {villain.ca}</p>
            </div>
          )}

          {/* TAB MAGIA */}
          {tab === "Magia" && villain.magia && (
            <div>
              <p><strong>Stat Magica:</strong> {villain.magia.caratteristica?.toUpperCase()}</p>
              <p><strong>CD Incantesimi:</strong> {villain.magia.cd}</p>
              <p><strong>Bonus Attacco:</strong> +{villain.magia.bonusAttacco}</p>
              <p><strong>Focus Arcano:</strong> {villain.magia.focus}</p>

              {["0", "1", "2", "3", "4", "5"].map(lvl => {
                const spells = villain.incantesimi?.filter(sp => sp.livello === parseInt(lvl));
                if (!spells || spells.length === 0) return null;
                return (
                  <div key={lvl}>
                    <h5>{lvl === "0" ? "Trucchetti" : `Livello ${lvl}`}</h5>
                    <ul>
                      {spells.map((sp, i) => (
                        <li key={i} title={sp.descrizione}>{sp.nome} ({sp.scuola})</li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB EQUIPAGGIAMENTO */}
          {tab === "Equipaggiamento" && (
            <div>
              <h4>Inventario</h4>
              <ul>
                {villain.equipVari?.length > 0
                  ? villain.equipVari.map((item, i) => <li key={i}>{item}</li>)
                  : <li>Nessun oggetto</li>}
              </ul>
              <h4>Loot Speciale</h4>
              <ul>
                {villain.loot?.map((l, i) => {
                  const [nome, descrizione] = l.split(" — ");
                  return (
                    <li key={i} className="tooltip-container">
                      <strong>{nome}</strong>
                      <span className="tooltip">{descrizione}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* TAB NARRATIVA */}
          {tab === "Narrativa" && (
            <div>
              <h4>🖤 Descrizione</h4>
              <p>{villain.descrizione}</p>
              <h4>📜 Origine</h4>
              <p>{villain.narrativa?.origine}</p>
              <h4>🎯 Obiettivo</h4>
              <p>{villain.narrativa?.obiettivo}</p>
              <h4>🔥 Motivazione</h4>
              <p>{villain.narrativa?.motivazione}</p>

              <h4>🎭 Hook Narrativi</h4>
              <button onClick={() => setOpzioniHook(genera3HookVillain())}>🎲 Genera Hook</button>
              <ul>
                {opzioniHook.map((hook, i) => (
                  <li key={i} onClick={() => setVillain({ ...villain, hook })}>{hook}</li>
                ))}
              </ul>

              <h4>💬 Dialoghi Iconici</h4>
              <button onClick={() => setOpzioniDialogo(genera3DialoghiVillain())}>🎲 Genera Dialogo</button>
              <ul>
                {opzioniDialogo.map((dialogo, i) => (
                  <li key={i} onClick={() => setVillain({ ...villain, dialogo })}>{dialogo}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
