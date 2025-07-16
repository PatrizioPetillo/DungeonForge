import React, { useState } from "react";
import CapitoloEditor from "./capitoloEditor";
import MostroAPISelector from "./mostroAPISelector";
import MostroManualeForm from "./mostroManualeForm";
import ModaleVillain from "../components/modali/modaleVillain";
import ModalePNG from "../components/modali/modalePNG";
import ModaleLuogo from "../components/modali/modaleLuogo";
import { collection, doc, setDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
import { v4 as uuid } from "uuid";

import "../styles/modaleCreaCampagna.css";

function ModaleCreaCampagna({ onClose }) {
  const [tab, setTab] = useState("Generale");
  const [dati, setDati] = useState({
    titolo: "",
    tipo: "",
    stato: "",
    ambientazione: "",
    obiettivo: "",
    hookNarrativo: "",
    tagNarrativi: [],
    blurb: "",
    durataStimata: "",
    durataTipo: "sessioni",
    prologo: "",
    finale: "",
    capitoli: [],
    villain: null,
    png: [],
    luoghi: [],
    incontri: [],
    mostri: [], // necessario per la nuova tab "Mostri"
  });
  const [showAPISelector, setShowAPISelector] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [modaleVillainAperta, setModaleVillainAperta] = useState(false);
  const [villainAttivo, setVillainAttivo] = useState(null);
  const [modaleArchivioAperta, setModaleArchivioAperta] = useState(false);
  const [villainArchivio, setVillainArchivio] = useState([]);
  const [luoghi, setLuoghi] = useState([]);
  const [modalePNGAperta, setModalePNGAperta] = useState(false);
  const [pngAttivo, setPngAttivo] = useState(null);
  const [modaleArchivioPNGAperta, setModaleArchivioPNGAperta] = useState(false);
  const [archivioPNG, setArchivioPNG] = useState([]);
  const [modaleLuogoAperta, setModaleLuogoAperta] = useState(false);
  const [luogoAttivo, setLuogoAttivo] = useState(null);
  const [campagna, setCampagna] = useState({
    id: null,
    titolo: "",
    tipo: "Campagna lunga",
    stato: "Bozza",
    ambientazione: "",
    obiettivo: "",
    hookNarrativo: "",
    tagNarrativi: [],
    blurb: "",
    durataStimata: "",
    durataTipo: "sessioni",
    prologo: "",
    finale: "",
    capitoli: [],
    villain: [],
    png: [],
    luoghi: [],
    incontri: [],
    mostri: [],
  });
  const [modaleIncontroAperta, setModaleIncontroAperta] = useState(false);
const [incontri, setIncontri] = useState([]);
const [modaleEnigmaAperta, setModaleEnigmaAperta] = useState(false);
const [enigmiCampagna, setEnigmiCampagna] = useState([]);

const apriModaleEnigma = () => {
  setModaleEnigmaAperta(true);
};

const rimuoviEnigma = (index) => {
  const nuovaLista = [...enigmiCampagna];
  nuovaLista.splice(index, 1);
  setEnigmiCampagna(nuovaLista);
};

const apriModaleIncontro = () => {
  setModaleIncontroAperta(true);
};

const rimuoviIncontro = (index) => {
  const nuovaLista = [...incontri];
  nuovaLista.splice(index, 1);
  setIncontri(nuovaLista);
};

const fetchIncontri = async () => {
  const snapshot = await getDocs(collection(firestore, `campagne/${campagna.id}/incontri`));
  setIncontri(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
};

useEffect(() => {
  if (campagna.id) fetchIncontri();
}, [campagna.id]);


  const handleChange = (campo, valore) => {
    setDati((prev) => ({ ...prev, [campo]: valore }));
  };

  const aggiornaVillain = (index, campo, valore) => {
    const updated = [...(campagna.villain || [])];
    updated[index][campo] = valore;
    setCampagna({ ...campagna, villain: updated });
  };

  const rimuoviVillain = (index) => {
    const updated = [...(campagna.villain || [])];
    updated.splice(index, 1);
    setCampagna({ ...campagna, villain: updated });
  };

  const apriModaleVillain = (villain) => {
    setModaleVillainAperta(true);
    setVillainAttivo(villain);
  };

  const apriGeneratoreVillain = () => {
    setVillainAttivo(null); // nessun villain attivo = modalità generazione
    setModaleVillainAperta(true);
  };

  const apriArchivioVillain = async () => {
    const snapshot = await getDocs(collection(firestore, "villain"));
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setVillainArchivio(lista);
    setModaleArchivioAperta(true);
  };

  const selezionaVillainDaArchivio = (v) => {
    setCampagna({
      ...campagna,
      villain: [...(campagna.villain || []), v],
    });
    setModaleArchivioAperta(false);
  };

  const salvaVillainInCampagna = (nuovoVillain) => {
    setCampagna({
      ...campagna,
      villain: [...(campagna.villain || []), nuovoVillain],
    });
    setModaleVillainAperta(false);
  };

  const aggiornaPNG = (index, campo, valore) => {
    const lista = [...(campagna.png || [])];
    lista[index][campo] = valore;
    setCampagna({ ...campagna, png: lista });
  };

  const rimuoviPNG = (index) => {
    const lista = [...(campagna.png || [])];
    lista.splice(index, 1);
    setCampagna({ ...campagna, png: lista });
  };

  const apriModalePNG = (png) => {
    setPngAttivo(png);
    setModalePNGAperta(true);
  };

  const apriGeneratorePNG = () => {
    setPngAttivo(null); // modalità generazione
    setModalePNGAperta(true);
  };

  const apriArchivioPNG = async () => {
    const snapshot = await getDocs(collection(firestore, "png"));
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setArchivioPNG(lista);
    setModaleArchivioPNGAperta(true);
  };

  const selezionaPNGDaArchivio = (png) => {
    setCampagna({
      ...campagna,
      png: [...(campagna.png || []), png],
    });
    setModaleArchivioPNGAperta(false);
  };

  const apriModaleLuogo = () => {
    setLuogoAttivo(null);
    setModaleLuogoAperta(true);
  };

  const modificaLuogo = (index) => {
    setLuogoAttivo({ ...campagna.luoghi[index], index });
    setModaleLuogoAperta(true);
  };

  const rimuoviLuogo = (index) => {
    const luoghi = [...campagna.luoghi];
    luoghi.splice(index, 1);
    setCampagna({ ...campagna, luoghi });
  };

  const nomeScenaDaID = (id) => {
  const scena = campagna.scene?.find(s => s.id === id);
  return scena ? scena.titolo : id;
};

const salvaCampagna = async () => {
  try {
    const campagnaId = campagna.id || uuid();
    const docRef = doc(firestore, "campagne", campagnaId);

    // 1. Salva info principali
    const datiBase = {
      titolo: campagna.titolo,
      tipo: campagna.tipo,
      stato: campagna.stato,
      ambientazione: campagna.ambientazione,
      obiettivo: campagna.obiettivo,
      hookNarrativo: campagna.hookNarrativo,
      tagNarrativi: campagna.tagNarrativi,
      blurb: campagna.blurb,
      durataStimata: campagna.durataStimata,
      durataTipo: campagna.durataTipo,
      prologo: campagna.prologo,
      finale: campagna.finale,
      capitoli: campagna.capitoli || [],
      createdAt: campagna.createdAt || serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(docRef, datiBase);

    // 2. Salva Villain
    const villainColl = collection(docRef, "villain");
    for (const v of campagna.villain || []) {
      await addDoc(villainColl, { ...v, createdAt: serverTimestamp() });
    }

    // 3. Salva PNG
    const pngColl = collection(docRef, "png");
    for (const p of campagna.png || []) {
      await addDoc(pngColl, { ...p, createdAt: serverTimestamp() });
    }

    // 4. Salva Mostri
    const mostriColl = collection(docRef, "mostri");
    for (const m of campagna.mostri || []) {
      await addDoc(mostriColl, { ...m, createdAt: serverTimestamp() });
    }

    // 5. Salva Luoghi
    const luoghiColl = collection(docRef, "luoghi");
    for (const l of campagna.luoghi || []) {
      await addDoc(luoghiColl, { ...l, createdAt: serverTimestamp() });
    }

    // 6. Salva Enigmi
    const enigmiColl = collection(docRef, "enigmi");
    for (const enigma of enigmiCampagna) {
      await addDoc(enigmiColl, { ...enigma, createdAt: serverTimestamp() });
    }

    toast.success("Campagna salvata con successo!");
    onClose?.();

  } catch (err) {
    console.error("Errore durante il salvataggio:", err);
    toast.error("Errore durante il salvataggio");
  }
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
            <hr />
            {/* 🎯 Obiettivo della Campagna */}
            <label>🎯 Obiettivo</label>
            <textarea
              value={campagna.obiettivo || ""}
              onChange={(e) =>
                setCampagna({ ...campagna, obiettivo: e.target.value })
              }
              placeholder="Es: Sventare l’invasione demoniaca del Piano Materiale..."
              rows={2}
            />

            {/* 📣 Hook Narrativo */}
            <label>📣 Hook Narrativo</label>
            <textarea
              value={campagna.hookNarrativo || ""}
              onChange={(e) =>
                setCampagna({ ...campagna, hookNarrativo: e.target.value })
              }
              placeholder="Es: Una cometa si schianta vicino a un villaggio, scatenando eventi inspiegabili..."
              rows={2}
            />

            {/* 🏷️ Tag Narrativi */}
            <label>🏷️ Tag Narrativi</label>
            <select
              multiple
              value={campagna.tagNarrativi || []}
              onChange={(e) => {
                const selected = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setCampagna({ ...campagna, tagNarrativi: selected });
              }}
            >
              <option value="Horror">Horror</option>
              <option value="Investigativo">Investigativo</option>
              <option value="Dungeon Crawl">Dungeon Crawl</option>
              <option value="Comico">Comico</option>
              <option value="Politico">Politico</option>
              <option value="Survival">Survival</option>
              <option value="Epico">Epico</option>
            </select>

            {/* 🧾 Blurb Evocativo */}
            <label>🧾 Blurb Evocativo</label>
            <textarea
              value={campagna.blurb || ""}
              onChange={(e) =>
                setCampagna({ ...campagna, blurb: e.target.value })
              }
              placeholder="Un'avventura in un regno spezzato, dove la verità è sepolta nei sogni..."
              rows={2}
            />

            {/* ⌛ Durata Stimata */}
            <label>⌛ Durata Stimata</label>
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <input
                type="number"
                min={1}
                value={campagna.durataStimata || ""}
                onChange={(e) =>
                  setCampagna({
                    ...campagna,
                    durataStimata: parseInt(e.target.value),
                  })
                }
                placeholder="Es: 8"
                style={{ width: "80px" }}
              />
              <select
                value={campagna.durataTipo || "sessioni"}
                onChange={(e) =>
                  setCampagna({ ...campagna, durataTipo: e.target.value })
                }
              >
                <option value="sessioni">Sessioni</option>
                <option value="settimane">Settimane</option>
              </select>
            </div>

            <label>Tipo</label>
            <select
              value={dati.tipo}
              onChange={(e) => handleChange("tipo", e.target.value)}
            >
              <option>Campagna lunga</option>
              <option>Mini-campagna</option>
              <option>One-Shot</option>
            </select>

            <label>Stato</label>
            <select
              value={dati.stato}
              onChange={(e) => handleChange("stato", e.target.value)}
            >
              <option>Bozza</option>
              <option>Attiva</option>
              <option>Archiviata</option>
            </select>

            <label>Ambientazione</label>
            <select
              value={dati.ambientazione || ""}
              onChange={(e) => handleChange("ambientazione", e.target.value)}
            >
              <option disabled value="">
                Seleziona ambientazione
              </option>
              <option>Forgotten Realms</option>
              <option>Eberron</option>
              <option>Ravenloft</option>
              <option>Dragonlance</option>
              <option>Exandria</option>
              <option value="homebrew">Homebrew</option>
            </select>

            {dati.ambientazione === "homebrew" && (
              <button onClick={() => console.log("Avvia Worldbuilding!")}>
                🛠️ Avvia Worldbuilding
              </button>
            )}
          </div>
        );

      case "Narrativa":
        const aggiornaCapitolo = (index, nuovoCapitolo) => {
          const nuoviCapitoli = [...(dati.capitoli || [])];
          nuoviCapitoli[index] = nuovoCapitolo;
          handleChange("capitoli", nuoviCapitoli);
        };

        const aggiungiCapitolo = () => {
          const nuovo = {
            titolo: "",
            descrizione: "",
            scene: [],
          };
          handleChange("capitoli", [...(dati.capitoli || []), nuovo]);
        };

        const rimuoviCapitolo = (index) => {
          const nuovi = [...(dati.capitoli || [])];
          nuovi.splice(index, 1);
          handleChange("capitoli", nuovi);
        };

        return (
          <div className="tab-content narrativa-tab">
            <label>Prologo</label>
            <textarea
              placeholder="Testo introduttivo..."
              value={dati.prologo || ""}
              onChange={(e) => handleChange("prologo", e.target.value)}
            />

            <h3>📚 Capitoli</h3>
            {(dati.capitoli || []).map((cap, index) => (
              <CapitoloEditor
                key={index}
                capitolo={cap}
                onUpdate={(updated) => aggiornaCapitolo(index, updated)}
                onRemove={() => rimuoviCapitolo(index)}
              />
            ))}
            <button onClick={aggiungiCapitolo}>➕ Aggiungi Capitolo</button>
            <h4>⚠️ Twist Narrativi</h4>
            {(campagna.twistNarrativi || []).map((twist, i) => (
              <textarea
                key={i}
                value={twist}
                onChange={(e) => {
                  const updated = [...campagna.twistNarrativi];
                  updated[i] = e.target.value;
                  setCampagna({ ...campagna, twistNarrativi: updated });
                }}
                placeholder={`Twist #${i + 1}`}
                rows={2}
                style={{ marginBottom: "0.5rem", width: "100%" }}
              />
            ))}
            <button
              onClick={() =>
                setCampagna({
                  ...campagna,
                  twistNarrativi: [...(campagna.twistNarrativi || []), ""],
                })
              }
            >
              ➕ Aggiungi Twist
            </button>

            <h4>🔄 Trame Parallele</h4>
            {(campagna.trameParallele || []).map((trama, i) => (
              <textarea
                key={i}
                value={trama}
                onChange={(e) => {
                  const updated = [...campagna.trameParallele];
                  updated[i] = e.target.value;
                  setCampagna({ ...campagna, trameParallele: updated });
                }}
                placeholder={`Trama parallela #${i + 1}`}
                rows={2}
                style={{ marginBottom: "0.5rem", width: "100%" }}
              />
            ))}
            <button
              onClick={() =>
                setCampagna({
                  ...campagna,
                  trameParallele: [...(campagna.trameParallele || []), ""],
                })
              }
            >
              ➕ Aggiungi Trama
            </button>

            <h4>🧶 Collegamenti Tematici</h4>
            {(campagna.collegamentiTematici || []).map((collegamento, i) => (
              <textarea
                key={i}
                value={collegamento}
                onChange={(e) => {
                  const updated = [...campagna.collegamentiTematici];
                  updated[i] = e.target.value;
                  setCampagna({ ...campagna, collegamentiTematici: updated });
                }}
                placeholder={`Collegamento tematico #${i + 1}`}
                rows={2}
                style={{ marginBottom: "0.5rem", width: "100%" }}
              />
            ))}
            <button
              onClick={() =>
                setCampagna({
                  ...campagna,
                  collegamentiTematici: [
                    ...(campagna.collegamentiTematici || []),
                    "",
                  ],
                })
              }
            >
              ➕ Aggiungi Collegamento
            </button>

            <hr />

            <label>Finale</label>
            <textarea
              placeholder="Epica conclusione o finale aperto..."
              value={dati.finale || ""}
              onChange={(e) => handleChange("finale", e.target.value)}
            />
          </div>
        );
      case "Villain":
        return (
          <div className="tab-content">
            <h3>👿 Villain della Campagna</h3>

            {/* Pulsanti azione */}
            <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
              <button onClick={apriGeneratoreVillain}>+ Genera Villain</button>
              <button onClick={apriArchivioVillain}>
                + Scegli dall’Archivio
              </button>
            </div>

            {/* Lista Villain collegati */}
            {(campagna.villain || []).map((v, i) => (
              <div
                key={i}
                className="villain-box"
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <h4>
                  {v.nome} ({v.classe} Lv.{v.livello})
                </h4>
                <p>
                  <strong>Razza:</strong> {v.razza}
                </p>
                <p>
                  <strong>Frase:</strong> <em>{v.frase}</em>
                </p>

                {/* Campi Narrativi */}
                <label>🎯 Obiettivo Finale</label>
                <textarea
                  value={v.obiettivo || ""}
                  onChange={(e) =>
                    aggiornaVillain(i, "obiettivo", e.target.value)
                  }
                  placeholder="Conquista, resurrezione, distruzione..."
                />

                <label>🕰️ Piano a Lungo Termine</label>
                <textarea
                  value={v.piano || ""}
                  onChange={(e) => aggiornaVillain(i, "piano", e.target.value)}
                  placeholder="Fasi, manipolazioni, tappe"
                />

                <label>🌘 Motivazione o Trauma</label>
                <textarea
                  value={v.motivazione || ""}
                  onChange={(e) =>
                    aggiornaVillain(i, "motivazione", e.target.value)
                  }
                  placeholder="Ossessione, vendetta, tradimento..."
                />

                <label>🐍 Seguaci / Organizzazioni</label>
                <textarea
                  value={v.seguaci || ""}
                  onChange={(e) =>
                    aggiornaVillain(i, "seguaci", e.target.value)
                  }
                  placeholder="Culto della Cenere, mercenari del Velo..."
                />

                <label>🪄 Oggetti o Poteri Speciali</label>
                <textarea
                  value={v.oggetti || ""}
                  onChange={(e) =>
                    aggiornaVillain(i, "oggetti", e.target.value)
                  }
                  placeholder="Corona degli Echi, Pietra del Vuoto..."
                />

                <label>📍 Luogo Chiave Collegato</label>
                <select
                  value={v.luogo || ""}
                  onChange={(e) => aggiornaVillain(i, "luogo", e.target.value)}
                >
                  <option value="">-- Seleziona luogo --</option>
                  {luoghi?.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.nome}
                    </option>
                  ))}
                </select>

                <label>📅 Scena di Apparizione</label>
                <select
                  value={v.sceneApparizione || ""}
                  onChange={(e) =>
                    aggiornaVillain(i, "sceneApparizione", e.target.value)
                  }
                >
                  <option value="">-- Seleziona scena --</option>
                  {campagna.scene?.map((s, idx) => (
                    <option key={idx} value={s.id}>
                      {s.titolo}
                    </option>
                  ))}
                </select>

                {/* Azioni */}
                <div style={{ marginTop: "0.5rem" }}>
                  <button onClick={() => apriModaleVillain(v)}>
                    ✏️ Modifica completa
                  </button>
                  <button
                    onClick={() => rimuoviVillain(i)}
                    style={{ color: "red" }}
                  >
                    🗑️ Rimuovi
                  </button>
                </div>
              </div>
            ))}
            {modaleArchivioAperta && (
              <div className="modaleArchivio">
                <h3>📚 Villain salvati</h3>
                <ul>
                  {villainArchivio.map((v) => (
                    <li key={v.id}>
                      <strong>{v.nome}</strong> (Lv.{v.livello} {v.classe})
                      <button onClick={() => selezionaVillainDaArchivio(v)}>
                        ➕ Aggiungi
                      </button>
                    </li>
                  ))}
                </ul>
                <button onClick={() => setModaleArchivioAperta(false)}>
                  Chiudi
                </button>
              </div>
            )}
            <button onClick={() => setModaleVillainAperta(true)}>
              + Aggiungi Villain
            </button>
            <ModaleVillain
              isOpen={modaleVillainAperta}
              onClose={() => setModaleVillainAperta(false)}
              villain={villainAttivo}
              onSave={salvaVillainInCampagna}
            />
          </div>
        );

      case "PNG":
        return (
          <div className="tab-content">
            <h3>👤 Personaggi Non Giocanti</h3>

            <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
              <button onClick={apriGeneratorePNG}>+ Genera PNG</button>
              <button onClick={apriArchivioPNG}>+ Scegli dall’Archivio</button>
            </div>

            {(campagna.png || []).map((p, i) => (
              <div
                key={i}
                className="png-box"
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <h4>
                  {p.nome} {p.cognome && <>({p.cognome})</>} — {p.tipo}
                </h4>

                <p>
                  <strong>Razza:</strong> {p.razza}
                </p>
                {p.tipo === "Comune" && (
                  <p>
                    <strong>Mestiere:</strong> {p.mestiere || "—"}
                  </p>
                )}
                {p.tipo === "Non Comune" && (
                  <>
                    <p>
                      <strong>Classe:</strong> {p.classe} (Lv.{p.livello})
                    </p>
                    <p>
                      <strong>PF / CA:</strong> {p.pf} / {p.ca}
                    </p>
                  </>
                )}

                {/* Campi narrativi rapidi */}
                <label>🤝 Relazione con i PG</label>
                <select
                  value={p.relazionePg || ""}
                  onChange={(e) =>
                    aggiornaPNG(i, "relazionePg", e.target.value)
                  }
                >
                  <option value="">-- Seleziona --</option>
                  <option>Alleato</option>
                  <option>Mentore</option>
                  <option>Traditore</option>
                  <option>Guida</option>
                  <option>Contatto della Gilda</option>
                  <option>Nemico</option>
                </select>

                <label>📍 Collegamento narrativo</label>
                <input
                  type="text"
                  value={p.collegamento || ""}
                  onChange={(e) =>
                    aggiornaPNG(i, "collegamento", e.target.value)
                  }
                  placeholder="Es: Scena 1, Capitolo 2..."
                />

                {/* Azioni */}
                <div style={{ marginTop: "0.5rem" }}>
                  <button onClick={() => apriModalePNG(p)}>✏️ Modifica</button>
                  <button
                    onClick={() => rimuoviPNG(i)}
                    style={{ color: "red" }}
                  >
                    🗑️ Rimuovi
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "Luoghi":
        return (
          <div className="tab-content">
            <h3>🏰 Luoghi Chiave della Campagna</h3>

            <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
              <button onClick={apriModaleLuogo}>+ Aggiungi luogo</button>
              <button onClick={apriArchivioLuogo}>
                + Scegli dall’Archivio
              </button>
            </div>

            {(campagna.luoghi || []).map((l, i) => (
              <div
                key={i}
                className="luogo-box"
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  marginBottom: "1rem",
                }}
              >
                <h4>
                  {l.nome} ({l.tipo})
                </h4>
                {l.immagine && (
                  <img
                    src={l.immagine}
                    alt={l.nome}
                    style={{
                      maxWidth: "100%",
                      borderRadius: "4px",
                      marginBottom: "0.5rem",
                    }}
                  />
                )}
                <p>
                  <strong>Descrizione:</strong> {l.descrizione?.slice(0, 200)}
                  ...
                </p>
                {l.pngPresenti?.length > 0 && (
  <p><strong>PNG:</strong> {l.pngPresenti.join(", ")}</p>
)}

{l.villainAssociati?.length > 0 && (
  <p><strong>Villain:</strong> {l.villainAssociati.join(", ")}</p>
)}

{l.sceneCollegate?.length > 0 && (
  <p><strong>Scene:</strong> {l.sceneCollegate.map(id => nomeScenaDaID(id)).join(", ")}</p>
)}

                <button onClick={() => modificaLuogo(i)}>✏️ Modifica</button>
                <button
                  onClick={() => rimuoviLuogo(i)}
                  style={{ color: "red" }}
                >
                  🗑️ Rimuovi
                </button>
              </div>
            ))}
          </div>
        );

      case "Mostri":
        const aggiungiMostro = (mostro) => {
          handleChange("mostri", [...(dati.mostri || []), mostro]);
        };

        const rimuoviMostro = (index) => {
          const nuovi = [...(dati.mostri || [])];
          nuovi.splice(index, 1);
          handleChange("mostri", nuovi);
        };

        const tutteLeScene =
          dati.capitoli?.flatMap((cap) =>
            cap.scene?.map((s) => ({
              id: s.id,
              titolo: `${cap.titolo} → ${s.titolo}`,
            }))
          ) || [];

        return (
          <div className="tab-content">
            <h4>🧟 Mostri aggiunti ({dati.mostri?.length || 0})</h4>
            {(dati.mostri || []).map((m, i) => (
              <div key={i} className="mostro-box">
                <strong>{m.nome || "Mostro senza nome"}</strong> (GS{" "}
                {m.gs || "?"}) – CA: {m.ca}, PF: {m.pf}
                <br />
                <em>{m.descrizione?.slice(0, 80)}...</em>
                <br />
                <label>
                  Collegato alla scena:
                  <select
                    value={m.scenaAssociata || ""}
                    onChange={(e) => {
                      const nuovi = [...dati.mostri];
                      nuovi[i].scenaAssociata = e.target.value;
                      handleChange("mostri", nuovi);
                    }}
                  >
                    <option value="">-- Nessuna --</option>
                    {tutteLeScene.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.titolo}
                      </option>
                    ))}
                  </select>
                </label>
                <hr />
                <button onClick={() => rimuoviMostro(i)}>❌ Rimuovi</button>
              </div>
            ))}

            <div className="mostro-actions">
              <button onClick={() => setShowManualForm(true)}>
                📝 Crea Mostro Manuale
              </button>
              <button onClick={() => setShowAPISelector(true)}>
                📚 Scegli da API
              </button>
            </div>

            {showAPISelector && (
              <MostroAPISelector
                onAdd={aggiungiMostro}
                onClose={() => setShowAPISelector(false)}
              />
            )}

            {showManualForm && (
              <MostroManualeForm
                onSave={(m) => {
                  aggiungiMostro(m);
                  setShowManualForm(false);
                }}
                onCancel={() => setShowManualForm(false)}
              />
            )}
          </div>
        );

      case "Incontri":
  return (
    <div className="tab-content">
      <h3>⚔️ Incontri Narrativi e di Combattimento</h3>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={apriModaleIncontro}>+ Genera Incontro</button>
      </div>

      {(incontri || []).map((incontro, i) => (
        <div key={i} className="incontro-box" style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <h4>{incontro.titolo || "Senza titolo"} ({incontro.data || "Data non specificata"})</h4>
          <p><strong>Descrizione:</strong> {incontro.descrizione?.slice(0, 150)}...</p>
          {incontro.sceneCollegate?.length > 0 && (
            <p><strong>Scene collegate:</strong> {incontro.sceneCollegate.join(", ")}</p>
          )}
          {incontro.esito && (
            <p><strong>Esito:</strong> {incontro.esito}</p>
          )}
          <button onClick={() => rimuoviIncontro(i)} style={{ color: "red" }}>🗑️ Rimuovi</button>
        </div>
      ))}
    </div>
  );

  case "Enigmi":
  return (
    <div className="tab-content">
      <h3>🧠 Enigmi, Trappole e Ostacoli</h3>

      <div style={{ marginBottom: "1rem" }}>
        <button onClick={apriModaleEnigma}>+ Genera Enigma</button>
      </div>

      {(enigmiCampagna || []).map((enigma, i) => (
        <div key={i} className="enigma-box" style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
          <h4>{enigma.titolo || "Senza titolo"}</h4>
          <p><strong>Tipo:</strong> {enigma.tipo}</p>
          <p><strong>Descrizione:</strong> {enigma.descrizione?.slice(0, 120)}...</p>
          {enigma.sceneCollegate?.length > 0 && (
            <p><strong>Scene:</strong> {enigma.sceneCollegate.map(id => nomeScenaDaID(id)).join(", ")}</p>
          )}
          <button onClick={() => rimuoviEnigma(i)} style={{ color: "red" }}>🗑️ Rimuovi</button>
        </div>
      ))}
    </div>
  );

      default:
        return null;
    }
  };

  return (
    <div className="modale-overlay">
      <div className="modale-content">
        <div className="modale-header">
          <h2>+ Crea nuova campagna</h2>
          <button onClick={onClose}>❌</button>
        </div>
        <div className="tab-selector">
          {[
            "Generale",
            "Narrativa",
            "Villain",
            "PNG",
            "Luoghi",
            "Mostri",
            "Incontri",
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
          <button
            onClick={salvaCampagna}
            style={{
              padding: "0.6rem 1.2rem",
              backgroundColor: "#D4AF37",
              border: "none",
              color: "#1A1F2B",
              fontWeight: "bold",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            💾 Salva Campagna
          </button>
        </div>
      </div>
      {modalePNGAperta && (
        <ModalePNG
          isOpen={modalePNGAperta}
          onClose={() => setModalePNGAperta(false)}
          png={pngAttivo}
          onSave={(nuovoPNG) => {
            if (!pngAttivo) {
              // PNG nuovo
              setCampagna({
                ...campagna,
                png: [...(campagna.png || []), nuovoPNG],
              });
            } else {
              // PNG esistente → aggiorna
              const aggiornata = [...campagna.png];
              const idx = aggiornata.findIndex((p) => p.id === pngAttivo.id);
              if (idx !== -1) aggiornata[idx] = nuovoPNG;
              setCampagna({ ...campagna, png: aggiornata });
            }
            setModalePNGAperta(false);
          }}
        />
      )}

      {modaleLuogoAperta && (
  <ModaleLuogo
    onClose={() => setModaleLuogoAperta(false)}
    campagnaId={campagna.id || null}
    onSave={(luogoSalvato) => {
      if (luogoAttivo && luogoAttivo.index >= 0) {
        // Modifica
        const aggiornata = [...campagna.luoghi];
        aggiornata[luogoAttivo.index] = luogoSalvato;
        setCampagna({ ...campagna, luoghi: aggiornata });
      } else {
        // Nuovo
        setCampagna({
          ...campagna,
          luoghi: [...(campagna.luoghi || []), luogoSalvato],
        });
      }
      setModaleLuogoAperta(false);
    }}
  />
)}

{modaleIncontroAperta && (
  <ModaleIncontro
    campagnaId={campagna.id}
    onClose={() => {
      setModaleIncontroAperta(false);
      fetchIncontri(); // oppure aggiorna la lista manualmente
    }}
  />
)}
{modaleEnigmaAperta && (
  <ModaleEnigma
    onClose={() => setModaleEnigmaAperta(false)}
    onSave={(nuovoEnigma) => {
      setEnigmiCampagna([...enigmiCampagna, nuovoEnigma]);
      setModaleEnigmaAperta(false);
    }}
    campagnaId={campagna.id}
  />
)}


    </div>
  );
}

export default ModaleCreaCampagna;
