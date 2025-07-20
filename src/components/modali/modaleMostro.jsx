import React, { useState, useEffect } from "react";
import "../../styles/modaleMostro.css";
import { toast } from "react-toastify";
import { serverTimestamp } from "firebase/firestore";
import { addDoc, collection } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import LootBox from "../generatori/lootBox";
import CompendioMostri from "../compendioMostri";

const ModaleMostro = ({ onClose }) => {
  const [tab, setTab] = useState("Generale");
  const [sceneDisponibili, setSceneDisponibili] = useState([]);
  const [sceneCollegate, setSceneCollegate] = useState([]);
  const [campagnaAttiva, setCampagnaAttiva] = useState(null);
  const [mostro, setMostro] = useState({
    nome: "",
    tipo: "",
    allineamento: "",
    quantita: 1,
    pf: "",
    ca: "",
    velocita: "",
    attributi: {
      forza: 10,
      destrezza: 10,
      costituzione: 10,
      intelligenza: 10,
      saggezza: 10,
      carisma: 10,
    },
    attacchi: [],
    azioniLeggendarie: [],
    note: "",
  });

  const tabList = [
    "Generale",
    "Statistiche",
    "Attributi",
    "Attacchi",
    "Azioni Leggendarie",
    "Narrativa",
    "Collegamenti",
    "Incontri"
  ];
  
  const [mostraCompendio, setMostraCompendio] = useState(false);
  const [incontriDisponibili, setIncontriDisponibili] = useState([]);
  const [incontriCollegati, setIncontriCollegati] = useState([]);
  

  useEffect(() => {
  if (!campagnaAttiva?.id) return;

  const ref = collection(firestore, `campagne/${campagnaAttiva.id}/incontri`);
  getDocs(ref).then((snap) => {
    const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setIncontriDisponibili(data);
  });
}, [campagnaAttiva]);

  useEffect(() => {
    if (!campagnaAttiva?.id) return;

    const ref = collection(firestore, `campagne/${campagnaAttiva.id}/scenes`);
    getDocs(ref).then((snap) => {
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSceneDisponibili(data);
    });
  }, [campagnaAttiva]);



  const salvaMostro = async () => {
    try {
      const doc = {
        ...mostro,
        sceneCollegate,
        attacchi: mostro.attacchi || [],
        azioniLeggendarie: mostro.azioniLeggendarie || [],
        incontriCollegati: incontriCollegati || [],
        createdAt: serverTimestamp(),
      };

      // Salvataggio su Firestore (se abilitato)
      await addDoc(collection(firestore, "mostri"), doc);

      console.log("Mostro salvato:", doc);
      toast.success("Mostro salvato con successo!");
      onClose();
    } catch (err) {
      console.error("Errore salvataggio:", err);
      toast.error("Errore durante il salvataggio del mostro.");
    }
  };

  const generaMostroCasuale = async () => {
    try {
      const resLista = await fetch("https://www.dnd5eapi.co/api/monsters");
      const datiLista = await resLista.json();
      const mostroCasuale =
        datiLista.results[Math.floor(Math.random() * datiLista.results.length)];

      const resDati = await fetch(
        `https://www.dnd5eapi.co${mostroCasuale.url}`
      );
      const dati = await resDati.json();

      setMostro({
        nome: dati.name,
        tipo: dati.type,
        allineamento: dati.alignment,
        pf: dati.hit_points,
        ca: dati.armor_class,
        velocita: dati.speed?.walk || "30 ft.",
        attributi: {
          forza: dati.strength,
          destrezza: dati.dexterity,
          costituzione: dati.constitution,
          intelligenza: dati.intelligence,
          saggezza: dati.wisdom,
          carisma: dati.charisma,
        },
        note: dati.description || "",
        attacchi: dati.actions || [],
        azioniLeggendarie: dati.legendary_actions || [],
        quantita: 1,
      });

      toast.success(`Mostro generato: ${dati.name}`);
    } catch (err) {
      console.error("Errore generazione mostro:", err);
      toast.error("Errore durante la generazione del mostro.");
    }
  };

  const apriCompendio = () => {
    setMostraCompendio(true);
  };

  const selezionaMostroDaCompendio = async (index) => {
    const res = await fetch(`https://www.dnd5eapi.co/api/monsters/${index}`);
    const data = await res.json();
    setMostro({
      nome: data.name,
      tipo: data.type,
      allineamento: data.alignment,
      pf: data.hit_points,
      ca: data.armor_class,
      velocita: data.speed?.walk || "30 ft.",
      attributi: {
        forza: data.strength,
        destrezza: data.dexterity,
        costituzione: data.constitution,
        intelligenza: data.intelligence,
        saggezza: data.wisdom,
        carisma: data.charisma,
      },
      note: data.description || "",
      attacchi: data.actions || [],
      azioniLeggendarie: data.legendary_actions || [],
      quantita: 1,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modale-mostro">
        <div className="modale-header">
          <h2>🧟‍♂️ Mostro</h2>
          <div className="icone-header">
            <button onClick={salvaMostro} title="Salva">
              💾
            </button>
            <button onClick={generaMostroCasuale} title="Genera">
              🎲
            </button>
            <button onClick={() => setMostraCompendio(true)} title="Compendio">
              📚
            </button>
            <button onClick={onClose} title="Chiudi">
              ✖️
            </button>
          </div>
        </div>

        <div className="tab-bar">
          {tabList.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={tab === t ? "active" : ""}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {tab === "Generale" && (
            <>
              <div className="field-group">
                <label>Nome:</label>
                <input
                  type="text"
                  value={mostro.nome}
                  onChange={(e) =>
                    setMostro((m) => ({ ...m, nome: e.target.value }))
                  }
                />
              </div>
              <div className="field-group">
                <label>Tipo creatura:</label>
                <input
                  type="text"
                  value={mostro.tipo}
                  onChange={(e) =>
                    setMostro((m) => ({ ...m, tipo: e.target.value }))
                  }
                />
              </div>
              <div className="field-group">
                <label>Allineamento:</label>
                <input
                  type="text"
                  value={mostro.allineamento}
                  onChange={(e) =>
                    setMostro((m) => ({ ...m, allineamento: e.target.value }))
                  }
                />
              </div>

              <div className="field-group">
                <label>Quantità:</label>
                <input
                  type="number"
                  min="1"
                  value={mostro.quantita}
                  onChange={(e) =>
                    setMostro((m) => ({
                      ...m,
                      quantita: parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </>
          )}
          {tab === "Statistiche" && (
            <>
              <div className="field-group">
                <label>Punti Ferita (PF):</label>
                <input
                  type="text"
                  value={mostro.pf}
                  onChange={(e) =>
                    setMostro((m) => ({ ...m, pf: e.target.value }))
                  }
                />
              </div>

              <div className="field-group">
                <label>Classe Armatura (CA):</label>
                <input
                  type="text"
                  value={mostro.ca}
                  onChange={(e) =>
                    setMostro((m) => ({ ...m, ca: e.target.value }))
                  }
                />
              </div>

              <div className="field-group">
                <label>Velocità:</label>
                <input
                  type="text"
                  value={mostro.velocita}
                  onChange={(e) =>
                    setMostro((m) => ({ ...m, velocita: e.target.value }))
                  }
                />
              </div>
            </>
          )}
          {tab === "Attributi" && (
            <div className="stat-grid">
              {Object.entries(mostro.attributi || {}).map(
                ([chiave, valore]) => (
                  <div key={chiave} className="stat-box">
                    <div className="stat-title">{chiave.toUpperCase()}</div>
                    <input
                      type="number"
                      value={valore}
                      onChange={(e) =>
                        setMostro((m) => ({
                          ...m,
                          attributi: {
                            ...m.attributi,
                            [chiave]: parseInt(e.target.value),
                          },
                        }))
                      }
                    />
                    <div className="stat-mod">
                      {`${
                        Math.floor((valore - 10) / 2) >= 0 ? "+" : ""
                      }${Math.floor((valore - 10) / 2)}`}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {tab === "Attacchi" && (
            <div>
              {mostro.attacchi?.map((a, i) => (
                <div key={i} className="field-group gruppo-attacco">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      value={a.name}
                      placeholder="Nome attacco"
                      onChange={(e) => {
                        const updated = [...mostro.attacchi];
                        updated[i].name = e.target.value;
                        setMostro((m) => ({ ...m, attacchi: updated }));
                      }}
                    />
                    <button
                      onClick={() => {
                        const updated = mostro.attacchi.filter(
                          (_, j) => j !== i
                        );
                        setMostro((m) => ({ ...m, attacchi: updated }));
                      }}
                      title="Rimuovi"
                    >
                      ❌
                    </button>
                  </div>
                  <textarea
                    value={a.desc}
                    placeholder="Descrizione dell'attacco"
                    onChange={(e) => {
                      const updated = [...mostro.attacchi];
                      updated[i].desc = e.target.value;
                      setMostro((m) => ({ ...m, attacchi: updated }));
                    }}
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  setMostro((m) => ({
                    ...m,
                    attacchi: [...(m.attacchi || []), { name: "", desc: "" }],
                  }))
                }
              >
                ➕ Aggiungi Attacco
              </button>
            </div>
          )}
          {tab === "Azioni" && (
            <div>
              {mostro.azioniLeggendarie?.map((a, i) => (
                <div key={i} className="field-group gruppo-attacco">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      value={a.name}
                      placeholder="Nome azione"
                      onChange={(e) => {
                        const updated = [...mostro.azioniLeggendarie];
                        updated[i].name = e.target.value;
                        setMostro((m) => ({
                          ...m,
                          azioniLeggendarie: updated,
                        }));
                      }}
                    />
                    <button
                      onClick={() => {
                        const updated = mostro.azioniLeggendarie.filter(
                          (_, j) => j !== i
                        );
                        setMostro((m) => ({
                          ...m,
                          azioniLeggendarie: updated,
                        }));
                      }}
                      title="Rimuovi"
                    >
                      ❌
                    </button>
                  </div>
                  <textarea
                    value={a.desc}
                    placeholder="Descrizione dell’azione leggendaria"
                    onChange={(e) => {
                      const updated = [...mostro.azioniLeggendarie];
                      updated[i].desc = e.target.value;
                      setMostro((m) => ({ ...m, azioniLeggendarie: updated }));
                    }}
                  />
                </div>
              ))}
              <button
                onClick={() =>
                  setMostro((m) => ({
                    ...m,
                    azioniLeggendarie: [
                      ...(m.azioniLeggendarie || []),
                      { name: "", desc: "" },
                    ],
                  }))
                }
              >
                ➕ Aggiungi Azione Leggendaria
              </button>
            </div>
          )}
          {tab === "Narrativa" && (
            <div className="field-group">
              <label>Note / Comportamento / Habitat:</label>
              <textarea
                value={mostro.note}
                onChange={(e) =>
                  setMostro((m) => ({ ...m, note: e.target.value }))
                }
              />
            </div>
          )}
          {tab === "Collegamenti" && (
            <div className="tab-collegamenti">
              <div className="field-group">
                <label>Collega il mostro a una o più scene:</label>
                <select
                  multiple
                  value={sceneCollegate}
                  onChange={(e) =>
                    setSceneCollegate(
                      Array.from(e.target.selectedOptions).map(
                        (opt) => opt.value
                      )
                    )
                  }
                >
                  {sceneDisponibili.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.titolo} ({s.capitoloNome || "senza capitolo"})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {tab === "Incontri" && (
  <div className="tab-incontri">
    <div className="field-group">
      <label>Collega a Incontri o Combattimenti:</label>
      <select
        multiple
        value={incontriCollegati}
        onChange={(e) =>
          setIncontriCollegati(
            Array.from(e.target.selectedOptions).map((opt) => opt.value)
          )
        }
      >
        {incontriDisponibili.map((i) => (
          <option key={i.id} value={i.id}>
            {i.nome || i.titolo || i.id}
          </option>
        ))}
      </select>
    </div>
    {/* BLOCCO LOOT PER MOSTRO */}
<div className="field-group">
  <LootBox loot={mostro.loot} onUpdate={(nuovoLoot) => setMostro({ ...mostro, loot: nuovoLoot })} />

</div>

  </div>
)}

        </div>
      </div>
      {mostraCompendio && (
        <CompendioMostri
          onClose={() => setMostraCompendio(false)}
          onSelezionaMostro={(datiAPI) => {
            setMostro({
              nome: datiAPI.name,
              tipo: datiAPI.type,
              allineamento: datiAPI.alignment,
              pf: datiAPI.hit_points,
              ca: datiAPI.armor_class,
              velocita: datiAPI.speed?.walk || "30 ft.",
              attributi: {
                forza: datiAPI.strength,
                destrezza: datiAPI.dexterity,
                costituzione: datiAPI.constitution,
                intelligenza: datiAPI.intelligence,
                saggezza: datiAPI.wisdom,
                carisma: datiAPI.charisma,
              },
              note: datiAPI.description || "",
              attacchi: datiAPI.actions || [],
              azioniLeggendarie: datiAPI.legendary_actions || [],
              quantita: 1,
            });
          }}
        />
      )}
    </div>
  );
};

export default ModaleMostro;
