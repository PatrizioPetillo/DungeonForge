import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
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

  const handleChange = (campo, valore) => {
    setDati((prev) => ({ ...prev, [campo]: valore }));
  };

  useEffect(() => {
    if (!campagna?.id) return;

    const fetchDatiCampagna = async () => {
      try {
        const campagnaRef = doc(firestore, "campagne", campagna.id);
        const campagnaSnap = await getDoc(campagnaRef);
        const meta = campagnaSnap.data();

        const [
          villainSnap,
          pngSnap,
          mostriSnap,
          luoghiSnap,
          enigmiSnap,
          incontriSnap,
        ] = await Promise.all([
          getDocs(collection(campagnaRef, "villain")),
          getDocs(collection(campagnaRef, "png")),
          getDocs(collection(campagnaRef, "mostri")),
          getDocs(collection(campagnaRef, "luoghi")),
          getDocs(collection(campagnaRef, "enigmi")),
          getDocs(collection(campagnaRef, "incontri")),
        ]);

        setDati(meta);
        setVillain(villainSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setPng(pngSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setMostri(mostriSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLuoghi(luoghiSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setEnigmi(enigmiSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setIncontri(incontriSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Errore nel fetch:", err);
      }
    };

    fetchDatiCampagna();
  }, [campagna?.id]);

  const getNomeScena = (id) => {
    const scena = campagna.capitoli
      ?.flatMap((c) => c.scene || [])
      .find((s) => s.id === id);
    return scena?.titolo || id;
  };

  const getNomeLuogo = (id) => {
    const l = campagna.luoghi?.find((l) => l.id === id);
    return l?.nome || id;
  };

  const generaRecapNarrativo = (campagna) => {
    const {
      nome,
      ambientazione,
      hookNarrativo,
      obiettivo,
      blurb,
      villain = [],
      luoghi = [],
      capitoli = [],
      temiRicorrenti,
      twist,
    } = campagna;

    const villainMain = villain[0];
    const villainFrase = villainMain
      ? `Il principale antagonista è ${villainMain.nome}, spinto da ${
          villainMain.motivazione || "una motivazione oscura"
        }.`
      : "";

    const luoghiFrase = luoghi.length
      ? `I luoghi centrali includono ${luoghi.map((l) => l.nome).join(", ")}.`
      : "";

    const sceneTitoli = capitoli
      .flatMap((c) => c.scene?.map((s) => s.titolo))
      .filter(Boolean);
    const sceneFrase = sceneTitoli.length
      ? `Le scene principali si snodano attraverso: ${sceneTitoli.join(", ")}.`
      : "";

    return `
La campagna "${nome}" è ambientata in ${
      ambientazione || "un mondo ancora indefinito"
    }. 
${
  hookNarrativo
    ? `L'avventura si apre con questo gancio narrativo: ${hookNarrativo}`
    : ""
}
${blurb ? blurb + "." : ""}
${obiettivo ? `L'obiettivo dei personaggi è: ${obiettivo}.` : ""}
${villainFrase}
${luoghiFrase}
${sceneFrase}
${twist ? `Tra i colpi di scena figurano: ${twist}.` : ""}
${
  temiRicorrenti ? `Tematicamente, la campagna esplora: ${temiRicorrenti}.` : ""
}
  `.trim();
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
            <h4>🎯 Obiettivo</h4>
            <p>{campagna.obiettivo}</p>

            <h4>📣 Hook Narrativo</h4>
            <p>{campagna.hookNarrativo}</p>

            <h4>🏷️ Tag Narrativi</h4>
            <ul>
              {campagna.tagNarrativi?.map((tag, i) => (
                <li key={i}>{tag}</li>
              ))}
            </ul>

            <h4>🧾 Blurb</h4>
            <p>
              <em>{campagna.blurb}</em>
            </p>

            <h4>⌛ Durata Stimata</h4>
            <p>
              {campagna.durataStimata} {campagna.durataTipo}
            </p>

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
                          <strong>
                            {scene.titolo}
                            {scene.mostri?.length > 0 && (
                              <span className="badge tag-combat">Combat</span>
                            )}
                            {enigmi.some((e) =>
                              e.sceneCollegate?.includes(scene.id)
                            ) && (
                              <span className="badge tag-enigma">Enigma</span>
                            )}
                            {!scene.mostri?.length &&
                              !enigmi.some((e) =>
                                e.sceneCollegate?.includes(scene.id)
                              ) && (
                                <span className="badge tag-narrativa">
                                  Narrativa
                                </span>
                              )}
                          </strong>
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
                                  {p.sceneCollegate?.map((sceneId, i) => (
                                    <li key={i}>
                                      🔗 Scena:{" "}
                                      <code>{getNomeScena(sceneId)}</code>
                                      <button
                                        onClick={() => {
                                          const el = document.getElementById(
                                            `scene-${sceneId}`
                                          );
                                          if (el)
                                            el.scrollIntoView({
                                              behavior: "smooth",
                                            });
                                        }}
                                      >
                                        📜 Vai alla scena
                                      </button>
                                    </li>
                                  ))}
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
                              {villain.length > 0 ? (
                                villain.map((v) => (
                                  <div key={v.id}>
                                    <p><strong>{v.nome}</strong></p>
                                    <p>{v.titolo}</p>
                                    <p><em>{v.descrizione}</em></p>
                                  </div>
                                ))
                              ) : (
                                <p>Nessun villain assegnato.</p>
                              )}

                            </div>
                          )}
                        </div>
                      ))}
                      {dati.twistNarrativi?.length > 0 && (
                        <>
                          <h4>⚠️ Twist Narrativi</h4>
                          <ul>
                            {dati.twistNarrativi.map((twist, i) => (
                              <li key={i} style={{ marginBottom: "0.5rem" }}>
                                {twist}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      <hr />
                      {dati.trameParallele?.length > 0 && (
                        <>
                          <h4>🔄 Trame Parallele</h4>
                          <ul>
                            {dati.trameParallele.map((trama, i) => (
                              <li key={i} style={{ marginBottom: "0.5rem" }}>
                                {trama}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
                      <hr />
                      {dati.collegamentiTematici?.length > 0 && (
                        <>
                          <h4>🧶 Collegamenti Tematici</h4>
                          <ul>
                            {dati.collegamentiTematici.map((link, i) => (
                              <li key={i} style={{ marginBottom: "0.5rem" }}>
                                {link}
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
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

      case "PNG":
        return (
          <div className="tab-content">
            <h3>👤 PNG </h3>
            {dati.png && dati.png.length > 0 ? (
              <ul className="lista-png">
                {dati.png.map((p) => (
                  <li key={p.id}>
                    <strong>{p.nome}</strong> – {p.occupazione || "senza ruolo"}
                    {p.sceneCollegate?.length > 0 && (
                      <ul>
                        {p.sceneCollegate.map((sceneId, i) => (
                          <li key={i}>
                            📍 <code>{getNomeScena(sceneId)}</code>
                            <button
                              onClick={() => {
                                const el = document.getElementById(
                                  `scene-${sceneId}`
                                );
                                if (el)
                                  el.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                  });
                              }}
                            >
                              📜 Vai alla scena
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nessun PNG selezionato.</p>
            )}
          </div>
        );
      case "Villain":
        return (
          <div className="tab-content">
            {villain.map((v) => <div key={v.id}>
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
            </div>
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
            <h3>🧠 Enigmi e Trappole</h3>

            {dati.enigmi?.map((e) => (
              <div key={e.id} className="box-enigma">
                <strong>{e.titolo}</strong> – <em>{e.tipo}</em>
                <p>{e.descrizione}</p>
                <p>
                  🧠 Prova: {e.prova || "—"} | 🎯 CD: {e.cd || "—"}
                </p>
                {e.effettoFallimento && (
                  <p>💥 Effetto al fallimento: {e.effettoFallimento}</p>
                )}
                {e.soluzioni && <p>✅ Soluzione: {e.soluzioni}</p>}
              </div>
            ))}
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
            "Enigmi",
            "Avventure",
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
          <div className="section recap-campagna">
            <h3>📜 Riassunto della Campagna</h3>
            <p>
              <strong>Titolo:</strong> {dati.nome}
            </p>
            <p>
              <strong>Ambientazione:</strong> {dati.ambientazione || "—"}
            </p>
            <p>
              <strong>Tag:</strong> {dati.tag?.join(", ") || "—"}
            </p>
            <p>
              <strong>Durata stimata:</strong> {dati.durataStimata || "—"}
            </p>

            {dati.blurb && (
              <p>
                <strong>Blurb:</strong> {dati.blurb}
              </p>
            )}
            {dati.hookNarrativo && (
              <p>
                <strong>Hook Narrativo:</strong> {dati.hookNarrativo}
              </p>
            )}
            {dati.obiettivo && (
              <p>
                <strong>Obiettivo dei PG:</strong> {dati.obiettivo}
              </p>
            )}

            {dati.villain?.length > 0 && (
              <p>
                <strong>Villain principale:</strong> {dati.villain[0].nome}{" "}
                – {dati.villain[0].motivazione}
              </p>
            )}

            {dati.twist && (
              <p>
                <strong>Twist Narrativi:</strong> {dati.twist}
              </p>
            )}
            {dati.sottotrame && (
              <p>
                <strong>Trame Parallele:</strong> {dati.sottotrame}
              </p>
            )}
            {dati.temiRicorrenti && (
              <p>
                <strong>Temi Ricorrenti:</strong> {dati.temiRicorrenti}
              </p>
            )}

            {dati.luoghi?.length > 0 && (
              <p>
                <strong>Luoghi chiave:</strong>{" "}
                {dati.luoghi.map((l) => l.nome).join(", ")}
              </p>
            )}

            {dati.capitoli?.length > 0 && (
              <p>
                <strong>Scene principali:</strong>{" "}
                {dati.capitoli
                  .flatMap((c) => c.scene?.map((s) => s.titolo))
                  .join(", ")}
              </p>
            )}
          </div>
          <hr />
          {dati && (
            <div className="recap-generato">
              <h4>🧠 Riassunto Narrativo Generato</h4>
              <p style={{ whiteSpace: "pre-wrap" }}>
                {generaRecapNarrativo(dati)}
              </p>
            </div>
          )}

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
