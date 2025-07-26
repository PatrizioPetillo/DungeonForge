import React, { useState } from "react";
import { salvaInArchivio } from "../../utils/firestoreArchivio";
import { generaVillainCompleto } from "../../utils/generatoreVillain";
import { armi } from "../../utils/armi";
import { armature } from "../../utils/armature";
import {
  generaHookvillain,
  generaDialogovillain,
  genera3Hookvillain,
  genera3Dialoghivillain
} from "../../utils/narrativeGenerators";

import "../../styles/modaleVillain.css";

export default function ModaleVillain({ onClose }) {
  const [villain, setVillain] = useState({});
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("Generali");
  const [spellSuggeriti, setSpellSuggeriti] = useState([]);
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
    const nuovoVillain = await generaVillainCompleto();
    setVillain(nuovoVillain);
    setLoading(false);
  };

  const handleSalva = async () => {
    const data = { ...villain, tipo: "Villain" };
    const ok = await salvaInArchivio("villain", data);
    if (ok) {
      alert("Villain salvato nell'Archivio!");
      onClose();
    }
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
                    onChange={(e) => setVillain({ ...villain, nome: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Razza</label>
                  <input type="text" value={villain.razza || ""} readOnly />
                </div>

                <div className="form-group">
                  <label>Classe</label>
                  <input type="text" value={villain.classeEvocativa || ""} readOnly />
                </div>

                <div className="form-group">
                  <label>Livello</label>
                  <input type="number" value={villain.livello || ""} readOnly />
                </div>

                <div className="form-group">
                  <label>Allineamento</label>
                  <input type="text" value={villain.allineamento || ""} readOnly />
                </div>

                <div className="form-group">
                  <label>Background</label>
                  <input type="text" value={villain.background?.nomeEvocativo || ""} readOnly />
                </div>
              </div>

              <div className="image-section">
                <label>Immagine Villain</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setVillain({ ...villain, immagine: reader.result });
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {villain.immagine && <img src={villain.immagine} alt="Anteprima villain" />}
              </div>
            </div>
          )}

          {/* TAB STATISTICHE */}
          {tab === "Statistiche" && (
            <div className="tab-statistiche">
              <h4>Punteggi Caratteristica</h4>
              <div className="stat-grid">
                {["forza", "destrezza", "costituzione", "intelligenza", "saggezza", "carisma"].map((stat) => {
                  const val = villain.stats?.[stat];
                  const mod = val ? Math.floor((val - 10) / 2) : 0;
                  return (
                    <div key={stat} className="stat-box">
                      <h5>{stat.toUpperCase()}</h5>
                      <div className="stat-score">{val || "-"}</div>
                      <div className="stat-mod">{mod >= 0 ? `+${mod}` : mod}</div>
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
              <p><strong>Sottoclasse:</strong> {villain.sottoclasse || "N/A"}</p>
              <p><strong>PF:</strong> {villain.pf || "-"} | <strong>CA:</strong> {villain.ca || "-"}</p>
              <h5>Competenze</h5>
              <ul>
                {villain.competenze?.length > 0 ? villain.competenze.map((c, i) => (
                  <li key={i}>{c}</li>
                )) : <li>Nessuna competenza definita</li>}
              </ul>
              <h5>Privilegi di Classe</h5>
              <ul>
                {villain.privilegiClasse?.length > 0 ? villain.privilegiClasse.map((p, i) => (
                  <li key={i}>{p.nome}</li>
                )) : <li>Nessun privilegio definito</li>}
              </ul>
            </div>
          )}

          {/* TAB COMBATTIMENTO */}
          {tab === "Combattimento" && (
            <div className="tab-combattimento">
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
                    // Controlla se l'arma ha proprietà finesse
                    const isFinesse = arma.properties?.some(p => p.name.toLowerCase() === "finesse");
                    const modFor = Math.floor((villain.stats?.forza - 10) / 2);
                    const modDes = Math.floor((villain.stats?.destrezza - 10) / 2);
                    const modBase = isFinesse ? Math.max(modFor, modDes) : modFor;

                    // Aggiungi bonus competenza se villain è competente
                    const competente = villain.competenze?.some(c => c.toLowerCase().includes(arma.weapon_category.toLowerCase()));
                    const bonusAttacco = modBase + (competente ? Math.ceil(villain.livello / 4) + 2 : 0);

                    return (
                      <tr key={i}>
                        <td>{arma.name}</td>
                        <td>{bonusAttacco >= 0 ? `+${bonusAttacco}` : bonusAttacco}</td>
                        <td>{arma.damage.damage_dice} {arma.damage.damage_type.name}</td>
                        <td>{arma.properties?.map(p => p.name).join(", ")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <h4>🛡️ Armature</h4>
              <ul>
                {villain.armatureIndossate?.map((arm, i) => (
                  <li key={i}>
                    {arm.name} (CA Base: {arm.armor_class.base})  
                  </li>
                ))}
              </ul>
              <p><strong>CA Totale:</strong> {villain.ca} <em>(Base + Destrezza + Scudo)</em></p>
            </div>
          )}

          {/* TAB MAGIA */}
          {tab === "Magia" && villain.magia && (
            <div className="tab-magia">
              <h4>✨ Dettagli Magici</h4>
              <p><strong>Stat Magica:</strong> {villain.magia.caratteristica?.toUpperCase()}</p>
              <p><strong>CD Incantesimi:</strong> {villain.magia.cd}</p>
              <p><strong>Bonus Attacco:</strong> +{villain.magia.bonusAttacco}</p>
              {villain.magia.focus && (
                <p><strong>Focus Arcano:</strong> {villain.magia.focus}</p>
              )}

              {/* Slot Incantesimi */}
              <h4>📜 Slot Incantesimi</h4>
              <div className="slot-container">
                {villain.slotIncantesimi?.length > 0 ? villain.slotIncantesimi.map((slot, i) => (
                  <span key={i} className="slot-pill">Liv. {i + 1}: {slot}</span>
                )) : <p>Nessuno slot disponibile</p>}
              </div>

              {/* Lista Incantesimi */}
              <h4>📖 Incantesimi</h4>
              <ul className="spell-list">
                {villain.incantesimi?.map((spell, i) => (
                  <li key={i} className="spell-item" title={spell.descrizione}>
                    <strong>{spell.nome}</strong> (Lv {spell.livello}) - {spell.scuola}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* TAB EQUIPAGGIAMENTO */}
          {tab === "Equipaggiamento" && (
            <div>
              <h4>Inventario</h4>
              <p>{villain.inventario || "Nessun oggetto"}</p>
              <h4>Loot Speciale</h4>
              <ul className="loot-list">
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
            <div className="tab-narrativa">
              <h4>🖤 Descrizione Evocativa</h4>
              <p className="narrativa-test">{villain.descrizione || "—"}</p>
              <h4>📜 Origine Oscura</h4>
              <p className="narrativa-test">{villain.narrativa?.origine || "—"}</p>

              <h4>🎯 Obiettivo</h4>
              <p className="narrativa-test">{villain.narrativa?.obiettivo || "—"}</p>

              <h4>🔥 Motivazione</h4>
              <p className="narrativa-test">{villain.narrativa?.motivazione || "—"}</p>

              <div className="hook-dialogo">
                <h4>🎭 Hook Narrativo</h4>
                <button
                  onClick={() => setOpzioniHook(genera3Hookvillain())}
                  className="btn-secondary"
                >
                  🎲 Genera Hook
                </button>
                <ul>
                  {opzioniHook.map((hook, i) => (
                    <li key={i} onClick={() => setVillain({ ...villain, hook })}>
                      {hook}
                    </li>
                  ))}
                </ul>

                <h4>💬 Dialogo Iconico</h4>
                <button
                  onClick={() => setOpzioniDialogo(genera3Dialoghivillain())}
                  className="btn-secondary"
                >
                  🎲 Genera Dialogo
                </button>
                <ul>
                  {opzioniDialogo.map((dialogo, i) => (
                    <li key={i} onClick={() => setVillain({ ...villain, dialogo })}>
                      {villain.dialogo}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Mostra hook e dialogo scelti */}
              {villain.hook && (
                <p><strong>Hook scelto:</strong> {villain.hook}</p>
              )}
              {villain.dialogo && (
                <p><strong>Dialogo iconico:</strong> "{villain.dialogo}"</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
