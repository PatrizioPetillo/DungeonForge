import React, { useState } from "react";
import "../styles/modaleDettagliCampagna.css";

function ModaleDettagliCampagna({ campagna, onClose }) {
  const [tab, setTab] = useState("Generale");
  const [dati, setDati] = useState(campagna);
  const [modalitaModifica, setModalitaModifica] = useState(false);
  const [villain, setVillain] = useState(campagna.villain || null);
  const [png, setPng] = useState(campagna.png || []);
  const [mostri, setMostri] = useState(campagna.mostri || []);
  const [luoghi, setLuoghi] = useState(campagna.luoghi || []);
  const [incontri, setIncontri] = useState(campagna.incontri || []);
  const [campagnaId, setCampagnaId] = useState(campagna.id || null);

  const pngInScena = tuttiPNG.filter((p) =>
    p.sceneCollegate?.includes(scene.id)
  );
  const villainInScena = villain.sceneCollegate?.includes(scene.id)
    ? villain
    : null;

  const handleChange = (campo, valore) => {
    setDati((prev) => ({ ...prev, [campo]: valore }));
  };

  const renderTab = () => {
    switch (tab) {
      case "Generale":
        return (
          <div className="tab-content">
            <label>Titolo</label>
            <input
              value={dati.titolo}
              onChange={(e) => handleChange("titolo", e.target.value)}
            />
            <label>Tipo</label>
            <select
              value={dati.tipo}
              onChange={(e) => handleChange("tipo", e.target.value)}
            >
              <option>Campagna lunga</option>
              <option>Mini-campagna</option>
              <option>One-Shot</option>
            </select>
            <label>Ambientazione</label>
            <input
              value={dati.ambientazione}
              onChange={(e) => handleChange("ambientazione", e.target.value)}
            />
            <label>Stato</label>
            <select
              value={dati.stato}
              onChange={(e) => handleChange("stato", e.target.value)}
            >
              <option>Bozza</option>
              <option>Attiva</option>
              <option>Archiviata</option>
            </select>
          </div>
        );

      case "Narrativa":
        return (
          <div className="tab-content">
            <h4>Prologo</h4>
            <textarea
              value={dati.prologo || ""}
              onChange={(e) => handleChange("prologo", e.target.value)}
            />

            <h4>Capitoli</h4>
            {dati.capitoli?.length > 0 ? (
              dati.capitoli.map((capitolo, i) => (
                <div key={i} className="blocco-capitolo">
                  <h5>{capitolo.titolo}</h5>
                  <p>{capitolo.descrizione}</p>

                  {capitolo.scene?.length > 0 && (
                    <>
                      <h6>Scene:</h6>
                      {capitolo.scene.map((scene, j) => (
                        <div key={j} className="blocco-scena">
                          <strong>{scene.titolo}</strong>
                          <p>{scene.descrizione}</p>

                          {scene.mostri?.length > 0 && (
                            <div className="blocco-mostri">
                              <p>
                                <strong>🐲 Mostri:</strong>
                              </p>
                              <ul>
                                {scene.mostri.map((mostro, k) => (
                                  <li key={k}>
                                    <strong>{mostro.nome}</strong> (GS{" "}
                                    {mostro.gs}, CA {mostro.ca}, PF {mostro.pf})
                                    <br />
                                    <em style={{ color: "#B2B9C3" }}>
                                      Fonte:{" "}
                                      {mostro.fonte === "api"
                                        ? "D&D 5e API"
                                        : "Creato manualmente"}
                                    </em>
                                  </li>
                                ))}
                              </ul>
                              {dati.png?.length > 0 && (
  <div className="blocco-png">
    <p><strong>🧑‍🌾 PNG collegati:</strong></p>
    <ul>
      {dati.png
        .filter((p) => p.sceneCollegate?.includes(scene.id))
        .map((p, idx) => (
          <li key={idx}>
            <strong>{p.nome}</strong> – {p.occupazione || 'senza ruolo'}
            {p.sceneCollegate?.length > 0 && (
  <div className="collegamenti-png">
    <p><strong>📜 Collegato alle scene:</strong></p>
    <ul>
      {p.sceneCollegate.map((sceneId, i) => (
        <li key={i}>🔗 Scene ID: <code>{sceneId}</code></li>
      ))}
    </ul>
  </div>
)}

          </li>
        ))}
    </ul>
  </div>
)}

                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))
            ) : (
              <p>Nessun capitolo inserito.</p>
            )}

            <h4>Finale</h4>
            <textarea
              value={dati.finale || ""}
              onChange={(e) => handleChange("finale", e.target.value)}
            />
          </div>
        );

      case "Villain":
        return (
          <div className="tab-content">
            {dati.villain ? (
              <div className="villain-preview">
                <p>
                  <strong>{dati.villain.nome}</strong>
                </p>
                <p>{dati.villain.titolo}</p>
                <p>
                  <em>{dati.villain.descrizione}</em>
                </p>
                {modalitaModifica && (
                  <button
                    onClick={() => console.log("Apertura Archivio Villain")}
                  >
                    🔁 Cambia Villain
                  </button>
                )}
              </div>
            ) : (
              <p>Nessun villain assegnato.</p>
            )}
            <hr />
            {villain.sceneCollegate?.map((sceneId) => (
              <li key={sceneId}>
                <Link to={`/campagna/${campagnaId}/scene/${sceneId}`}>
                  Vai alla scena
                </Link>
              </li>
            ))}
          </div>
        );

      case "PNG":
        return (
          <div className="tab-content">
            {dati.png && dati.png.length > 0 ? (
              <ul className="lista-png">
                {dati.png.map((p) => (
                  <li key={p.id}>
                    <strong>{p.nome}</strong> – {p.occupazione || "senza ruolo"}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nessun PNG selezionato.</p>
            )}
            <hr />

            {modalitaModifica && (
              <button onClick={() => console.log("Apertura Archivio PNG")}>
                + Modifica PNG
              </button>
            )}
          </div>
        );

      case "Mostri":
        return (
          <div className="tab-content">
            {dati.mostri && dati.mostri.length > 0 ? (
              <ul className="lista-mostri">
                {dati.mostri.map((mostro, i) => (
                  <li key={i} className="mostro-item">
                    <h4>{mostro.nome}</h4>
                    <p>
                      GS: {mostro.gs} | CA: {mostro.ca} | PF: {mostro.pf}
                    </p>
                    <p>
                      <strong>Scena:</strong>{" "}
                      {mostro.sceneName || "Non assegnata"}
                      {mostro.sceneId && (
                        <button
                          className="vai-scena-btn"
                          onClick={() => {
                            const scenaTarget = document.getElementById(
                              `scene-${mostro.sceneId}`
                            );
                            if (scenaTarget)
                              scenaTarget.scrollIntoView({
                                behavior: "smooth",
                              });
                          }}
                        >
                          📜 Vai alla Scena
                        </button>
                      )}
                    </p>
                    <p className="mostro-fonte">
                      Fonte:{" "}
                      <em>
                        {mostro.fonte === "api"
                          ? "D&D 5e API"
                          : "Creato manualmente"}
                      </em>
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nessun mostro inserito nella campagna.</p>
            )}
          </div>
        );

      case "Luoghi":
        return (
          <div className="tab-content">
            <p>Luoghi chiave: {dati.luoghi?.length || 0}</p>
            <button>🏰 Aggiungi luogo</button>
          </div>
        );

      case "Incontri":
        return (
          <div className="tab-content">
            <p>Incontri salvati: {dati.incontri?.length || 0}</p>
            <button>⚔️ Aggiungi incontro</button>
          </div>
        );

      default:
        return null;
    }
  };

  const salvaModifiche = () => {
    console.log("Salva in Firestore:", dati);
    onClose();
  };

  const eliminaCampagna = () => {
    console.log("Elimina campagna con id:", campagna.id);
    onClose();
  };

  return (
    <div className="modale-overlay">
      <div className="modale-content">
        <div className="modale-header">
          <h2>📝 Dettagli Campagna</h2>
          <button onClick={onClose}>❌</button>
        </div>

        <div className="tab-selector">
          {[
            "Generale",
            "Narrativa",
            "Villain",
            "PNG",
            "Luoghi",
            "Incontri",
            "Mostri",
          ].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={tab === t ? "active" : ""}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="modale-body">{renderTab()}</div>

        <div className="modale-footer">
          {modalitaModifica ? (
            <>
              <button className="elimina-btn" onClick={eliminaCampagna}>
                🗑️ Elimina
              </button>
              <button className="salva-btn" onClick={salvaModifiche}>
                💾 Salva
              </button>
            </>
          ) : (
            <button
              className="modifica-btn"
              onClick={() => setModalitaModifica(true)}
            >
              ✏️ Modifica
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModaleDettagliCampagna;
