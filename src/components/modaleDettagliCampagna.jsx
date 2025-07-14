import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
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
  const [enigmi, setEnigmi] = useState([]);
  const [avventure, setAvventure] = useState([]);

  const pngInScena = tuttiPNG.filter((p) =>
    p.sceneCollegate?.includes(scene.id)
  );
  const villainInScena = villain.sceneCollegate?.includes(scene.id)
    ? villain
    : null;

  const handleChange = (campo, valore) => {
    setDati((prev) => ({ ...prev, [campo]: valore }));
  };

  useEffect(() => {
    if (!campagna?.id) return;

    const fetchIncontri = async () => {
      const ref = collection(firestore, `campagne/${campagna.id}/incontri`);
      const snap = await getDocs(ref);
      const dati = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setIncontri(dati);
    };

    fetchIncontri();
  }, [campagna]);

  useEffect(() => {
    const fetchEnigmi = async () => {
      const snap = await getDocs(collection(firestore, "enigmi"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setEnigmi(data);
    };
    fetchEnigmi();
  }, []);

  useEffect(() => {
    const fetchLuoghi = async () => {
      const snap = await getDocs(collection(firestore, "luoghi"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setLuoghi(data);
    };
    fetchLuoghi();
  }, []);

  useEffect(() => {
    const fetchAvventure = async () => {
      const snap = await getDocs(collection(firestore, "avventure"));
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAvventure(data);
    };
    fetchAvventure();
  }, []);

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
            <h4>🎯 Obiettivo</h4>
<p>{campagna.obiettivo}</p>

<h4>📣 Hook Narrativo</h4>
<p>{campagna.hookNarrativo}</p>

<h4>🏷️ Tag Narrativi</h4>
<ul>
  {campagna.tagNarrativi?.map((tag, i) => <li key={i}>{tag}</li>)}
</ul>

<h4>🧾 Blurb</h4>
<p><em>{campagna.blurb}</em></p>

<h4>⌛ Durata Stimata</h4>
<p>{campagna.durataStimata} {campagna.durataTipo}</p>

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
                                  <p>
                                    <strong>🧑‍🌾 PNG collegati:</strong>
                                  </p>
                                  <ul>
                                    {dati.png
                                      .filter((p) =>
                                        p.sceneCollegate?.includes(scene.id)
                                      )
                                      .map((p, idx) => (
                                        <li key={idx}>
                                          <strong>{p.nome}</strong> –{" "}
                                          {p.occupazione || "senza ruolo"}
                                          {p.sceneCollegate?.length > 0 && (
                                            <div className="collegamenti-png">
                                              <p>
                                                <strong>
                                                  📜 Collegato alle scene:
                                                </strong>
                                              </p>
                                              <ul>
                                                {p.sceneCollegate.map(
                                                  (sceneId, i) => (
                                                    <li key={i}>
                                                      🔗 Scene ID:{" "}
                                                      <code>{sceneId}</code>
                                                    </li>
                                                  )
                                                )}
                                              </ul>
                                            </div>
                                          )}
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              )}
                              <hr />
                              {enigmi.length > 0 && (
                                <div className="blocco-enigmi">
                                  <p>
                                    <strong>🧠 Enigmi collegati:</strong>
                                  </p>
                                  <ul>
                                    {enigmi
                                      .filter((e) =>
                                        e.sceneCollegate?.includes(scene.id)
                                      )
                                      .map((e, idx) => (
                                        <li key={idx}>
                                          {e.titolo} – {e.tipo}
                                          <br />
                                          <em style={{ color: "#B2B9C3" }}>
                                            {e.descrizione?.slice(0, 60)}...
                                          </em>
                                        </li>
                                      ))}
                                  </ul>
                                </div>
                              )}
                              <hr />
                              {villain &&
                                villain.sceneCollegate?.includes(scene.id) && (
                                  <div className="blocco-villain">
                                    <p>
                                      <strong>😈 Villain presente:</strong>
                                    </p>
                                    <p>
                                      <strong>{villain.nome}</strong> –{" "}
                                      {villain.titolo}
                                      <br />
                                      <em style={{ color: "#B2B9C3" }}>
                                        {villain.scopo ||
                                          "Senza scopo dichiarato"}
                                      </em>
                                    </p>
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
          <div className="blocco-luoghi">
            <h3>📍 Luoghi</h3>
            {luoghi.length === 0 ? (
              <p>Nessun luogo registrato.</p>
            ) : (
              <ul>
                {luoghi.map((l) => (
                  <li key={l.id}>
                    <strong>{l.nome}</strong> – {l.tipo}
                    <br />
                    <em>{l.descrizione?.slice(0, 80)}...</em>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "Incontri":
        return (
          <div className="blocco-incontri">
            <h3>🗡️ Incontri & Combattimenti</h3>
            {incontri.length === 0 ? (
              <p>Nessun incontro registrato per questa campagna.</p>
            ) : (
              <ul>
                {incontri.map((i) => (
                  <li key={i.id}>
                    <strong>{i.titolo}</strong> –{" "}
                    {i.data || "Data non specificata"}
                    <br />
                    <em>{i.descrizione?.slice(0, 100)}...</em>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "Enigmi":
        return (
          <div className="blocco-enigmi">
            <h3>🧠 Enigmi della Campagna</h3>
            {enigmi.length === 0 ? (
              <p>Nessun enigma registrato.</p>
            ) : (
              <ul>
                {enigmi.map((e) => (
                  <li key={e.id}>
                    <strong>{e.titolo}</strong> – {e.tipo}
                    <br />
                    <em>{e.descrizione?.slice(0, 80)}...</em>
                    <br />
                    {e.sceneCollegate?.length > 0 && (
                      <button
                        onClick={() => scrollToScene(e.sceneCollegate[0])}
                      >
                        📜 Vai alla Scena
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );

      case "Avventure":
        return (
          <div className="blocco-avventure">
            <h3>🧭 Avventure Modulari</h3>
            {avventure.length === 0 ? (
              <p>Nessuna avventura registrata.</p>
            ) : (
              avventure.map((a) => (
                <div key={a.id} className="avventura-box">
                  <h4>{a.titolo}</h4>
                  <ol>
                    {a.stanze.map((s, i) => (
                      <li key={i}>
                        <strong>Stanza {i + 1}</strong>: {s.descrizione || s}
                        {s.scene?.length > 0 && (
                          <button onClick={() => scrollToScene(s.scene[0])}>
                            📜 Vai alla Scena
                          </button>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>
              ))
            )}
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
          <button
  className="btn-sessione"
  onClick={() => navigate(`/live-session/${campagna.id}`)}
>
  🎲 Entra in sessione
</button>
        </div>
      </div>
    </div>
  );
}

export default ModaleDettagliCampagna;
