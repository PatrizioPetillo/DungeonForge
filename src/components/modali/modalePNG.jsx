import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { armi } from "../../utils/armi";
import { armature } from "../../utils/armature";
import {
  generaPNGStepByStep,
  razzeItaliane,
  classiItaliane,
  listaMestieri,
  generaNomePerRazza,
  aggiornaDescrizioneConRazza,
} from "../../utils/generators";
import { backgrounds } from "../../utils/backgrounds";
import Lottie from "lottie-react";
import calderoneAnim from "../../assets/lottie/Animation-Calderone.json";
import { caricaImmagine } from "../../utils/helpers";
import "../../styles/modalePng.css";

export default function ModalePng({ onClose }) {
  const [tipo, setTipo] = useState("Comune");
  const [loading, setLoading] = useState(false);
  const [campagnaAttiva, setCampagnaAttiva] = useState(null); // da passare come prop o contesto
  const [tab, setTab] = useState("Generali");
  const [listaRazze, setListaRazze] = useState([]);
  const [listaClassi, setListaClassi] = useState([]);
  const [stepCorrente, setStepCorrente] = useState(0);
  const [totaleStep, setTotaleStep] = useState(8);
  const [bonusRazziali, setBonusRazziali] = useState({});
  const [classeMagica, setClasseMagica] = useState(false);
  const [datiMagia, setDatiMagia] = useState({
    caratteristica: "",
    cd: "",
    bonusAttacco: "",
    scuola: "",
    focus: "",
    incantesimi: [],
  });
  const [incantesimiDisponibili, setIncantesimiDisponibili] = useState([]);
  const [tipoMagia, setTipoMagia] = useState(""); // 'prepared' o 'known'
  const [slotIncantesimi, setSlotIncantesimi] = useState([]);
  const [maxIncantesimi, setMaxIncantesimi] = useState(0);
  const [png, setPng] = useState({
    nome: "",
    cognome: "",
    razza: "",
    mestiere: "",
    descrizione: "",
    segni: "",
    origine: "",
    relazionePg: "",
    collegamento: "",
    equipIndossato: "",
    equipPortato: "",
    // Campi aggiuntivi per PNG non comuni
    classe: "",
    livello: 1,
    background: "",
    pf: "",
    ca: "",
    tiriSalvezza: "",
    abilitaBackground: "",
    talentiBackground: "",
    stats: {
      forza: 10,
      destrezza: 10,
      costituzione: 10,
      intelligenza: 10,
      saggezza: 10,
      carisma: 10,
    },
    tiriSalvezzaClasse: [],
    abilitaClasse: [],
    arma: "",
    armaDettagli: null,
    azioni: [""],
    tipo: "Non Comune",
    magia: classeMagica,
    focus: datiMagia.focus,
    scuolaMagica: datiMagia.scuola,
    cdIncantesimi: datiMagia.cd,
    bonusAttaccoMagico: datiMagia.bonusAttacco,
    incantesimi: datiMagia.incantesimi.map((s) => ({
      name: s.name,
      level: s.level,
      school: s.school.name,
      range: s.range,
      duration: s.duration,
      components: s.components,
      desc: s.desc?.[0],
    })),
    createdAt: serverTimestamp(),
  });
  const [sceneDisponibili, setSceneDisponibili] = useState([]);
  const [sceneCollegate, setSceneCollegate] = useState([]);

  const calcolaModCaratteristica = (valore) => {
  if (!valore) return 0;
  return Math.floor((valore - 10) / 2);
};

  const abilitaPerStat = {
    forza: ["Atletica"],
    destrezza: ["Acrobazia", "Furtività", "Rapidità di mano"],
    costituzione: [],
    intelligenza: ["Arcano", "Storia", "Indagare", "Natura", "Religione"],
    saggezza: [
      "Percezione",
      "Medicina",
      "Sopravvivenza",
      "Intuizione",
      "Addestrare animali",
    ],
    carisma: ["Persuasione", "Inganno", "Intimidire", "Intrattenere"],
  };

  const mappa = {
                    forza: "Strength",
                    destrezza: "Dexterity",
                    costituzione: "Constitution",
                    intelligenza: "Intelligence",
                    saggezza: "Wisdom",
                    carisma: "Charisma",
                  };

  useEffect(() => {
    if (!campagnaAttiva?.id) return;

    const ref = collection(firestore, `campagne/${campagnaAttiva.id}/scenes`);
    getDocs(ref).then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSceneDisponibili(data);
    });
  }, [campagnaAttiva]);

  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/races")
      .then((res) => res.json())
      .then((data) => setListaRazze(data.results));

    fetch("https://www.dnd5eapi.co/api/classes")
      .then((res) => res.json())
      .then((data) => setListaClassi(data.results));
  }, []);

  const toggleAbilita = (abilita) => {
    setPng((prev) => {
      const abilitaClasse = prev.abilitaClasse.includes(abilita)
        ? prev.abilitaClasse.filter((a) => a !== abilita)
        : [...prev.abilitaClasse, abilita];
      return { ...prev, abilitaClasse };
    });
  };

  useEffect(() => {
    if (!png.classe) return;

    const fetchIncantesimiClasse = async () => {
      try {
        const response = await fetch("https://www.dnd5eapi.co/api/spells");
        const data = await response.json();

        const incantiFiltrati = [];
        for (const spell of data.results) {
          const res = await fetch(`https://www.dnd5eapi.co${spell.url}`);
          const dettagli = await res.json();

          const appartieneClasse = dettagli.classes.some(
            (cls) => cls.index === png.classe
          );
          if (appartieneClasse && dettagli.level <= png.livello) {
            incantiFiltrati.push(dettagli);
          }
        }

        setIncantesimiDisponibili(incantiFiltrati);
      } catch (err) {
        console.error("Errore nel caricamento incantesimi:", err);
      }
    };

    fetchIncantesimiClasse();
  }, [png.classe, png.livello]);

  useEffect(() => {
    if (!png.arma) return;

    const fetchDettagliArma = async () => {
      const res = await fetch(
        `https://www.dnd5eapi.co/api/equipment/${png.arma}`
      );
      const data = await res.json();

      // Recupera dettagli proprietà (async)
      const props = await Promise.all(
        (data.properties || []).map(async (p) => {
          const propRes = await fetch(`https://www.dnd5eapi.co${p.url}`);
          const propData = await propRes.json();
          return {
            name: propData.name,
            desc: propData.desc?.[0] || "—",
          };
        })
      );

      setPng((prev) => ({
        ...prev,
        armaDettagli: { ...data, properties: props },
      }));
    };

    fetchDettagliArma();
  }, [png.arma]);

  useEffect(() => {
    if (!png.razza) return;
    fetch(`https://www.dnd5eapi.co/api/races/${png.razza}`)
      .then((res) => res.json())
      .then((data) => {
        const bonuses = data.ability_bonuses?.reduce((acc, b) => {
          acc[b.ability_score.name.toLowerCase()] = b.bonus;
          return acc;
        }, {});
        setBonusRazziali(bonuses);
      });
  }, [png.razza]);

  useEffect(() => {
    if (!png.classe) return;

    fetch(`https://www.dnd5eapi.co/api/classes/${png.classe}`)
      .then((res) => res.json())
      .then((data) => {
        const salvezza = data.saving_throws?.map((s) => s.name) || [];
        const incantesimi = data.spells?.map((s) => s.name) || [];
        const abilita = Array.isArray(data.proficiency_choices?.[0]?.from)
          ? data.proficiency_choices[0].from.map((p) => p.name)
          : [];

        setPng((prev) => ({
          ...prev,
          tiriSalvezzaClasse: salvezza,
          abilitaClasse: abilita,
          incantesimi: incantesimi,
        }));
      });
  }, [png.classe]);

  const aggiornaCampo = (campo, valore) => {
    setPng((prev) => ({ ...prev, [campo]: valore }));
  };

  const aggiornaStat = (stat, valore) => {
    setPng((prev) => ({
      ...prev,
      stats: { ...prev.stats, [stat]: Number(valore) },
    }));
  };

  const toggleTipo = () => {
    setTipo((prev) => (prev === "Comune" ? "Non Comune" : "Comune"));
    setTab("Generali"); // resetta tab
  };

  const handleGenerazione = async () => {
  setLoading(true);
  setStepCorrente(0);
  try {
    const nuovoPng = await generaPNGStepByStep(setPng, tipo, setStepCorrente);
    if (nuovoPng.magia) setClasseMagica(true);
  } catch (err) {
    console.error("Errore generazione PNG:", err);
  } finally {
    setLoading(false);
  }
};


  const handleSalvaPNG = async () => {
    try {
      const doc = {
        ...png,
        tipo,
        magia: classeMagica,
        focus: datiMagia.focus,
        scuolaMagica: datiMagia.scuola,
        cdIncantesimi: datiMagia.cd,
        bonusAttaccoMagico: datiMagia.bonusAttacco,
        incantesimi: datiMagia.incantesimi.map((s) => ({
          name: s.name,
          level: s.level,
          school: s.school.name,
          range: s.range,
          duration: s.duration,
          components: s.components,
          desc: s.desc?.[0],
        })),
        sceneCollegate,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(firestore, "png"), doc);
      toast.success("PNG salvato con successo!");
    } catch (err) {
      console.error("Errore salvataggio PNG:", err);
      toast.error("Errore durante il salvataggio.");
    }
  };

  // Tab disponibili in base al tipo PNG
  const tabComune = ["Generali", "Narrativa", "Equipaggiamento"];
  const tabNonComune = [
    ...tabComune,
    "Competenze ed Abilità",
    "Statistiche",
    "Combattimento",
    "Magia",
    "Equipaggiamento",
  ];
  const tabList =
    tipo === "Comune"
      ? ["Generali", "Narrativa", "Equipaggiamento"]
      : [
          "Generali",
          "Narrativa",
          "Competenze ed Abilità",
          "Statistiche",
          "Combattimento",
          "Equipaggiamento",
          ...(classeMagica ? ["Magia"] : []),
        ];

        const handleCambioArmatura = (nuovaArmatura) => {
  const armaturaDettaglio = armature.find((a) => a.name === nuovaArmatura);
  if (!armaturaDettaglio) return;

  setPng((prev) => ({
    ...prev,
    armatura: nuovaArmatura,
    dettagliArmatura: armaturaDettaglio
  }));
};


const handleCambioArma = (nuovaArma) => {
  const armaDettaglio = armi.find((a) => a.name === nuovaArma);
  if (!armaDettaglio) return;

  const modCar =
    armaDettaglio.weapon_range === "Melee"
      ? Math.floor((png.stats.forza - 10) / 2)
      : Math.floor((png.stats.destrezza - 10) / 2);

  const proficiency = Math.ceil(png.livello / 4) + 2;
  const bonusAttacco = proficiency + modCar;

  setPng((prev) => ({
    ...prev,
    arma: nuovaArma,
    dettagliArma: armaDettaglio,
    bonusAttacco,
  }));
};


  // Generazione automatica

  return (
    <div className="modale-overlay">
      <div className="modale-png">
        {/* Header */}
        <div className="modale-png-header">
          <div className="toggle">
            <span style={{ fontWeight: tipo === "Comune" ? "bold" : "normal" }}>
              PNG Comune
            </span>
            <label className="switch">
              <input
                type="checkbox"
                checked={tipo === "Non Comune"}
                onChange={toggleTipo}
              />
              <span className="slider" />
            </label>
            <span
              style={{ fontWeight: tipo === "Non Comune" ? "bold" : "normal" }}
            >
              Non Comune
            </span>
          </div>
          <div className="actions">
            {loading && (
              <div className="overlay-loading">
                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(stepCorrente / totaleStep) * 100}%` }}
                    ></div>
                    <span className="progress-text">{`Fase ${stepCorrente} di ${totaleStep}`}</span>
                  </div>
                </div>

                <Lottie
                  animationData={calderoneAnim}
                  loop={true}
                  className="calderone-lottie"
                />
                <p className="loading-text">Creando il PNG...</p>
              </div>
            )}

            <button onClick={handleGenerazione} className="btn-genera">
              🎲 Genera PNG
            </button>

            <button title="Salva PNG" onClick={handleSalvaPNG}>
              💾
            </button>
            <button onClick={onClose} title="Chiudi">
              ❌
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="tab-selector">
          {tabList.map((t) => (
            <button
              key={t}
              className={tab === t ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Corpo Tab */}
        <div className="modale-body">
          {tab === "Generali" && (
            <div className="tab-generali">
              <div className="generali-right">
                <label>📸 Immagine PNG</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file)
                      caricaImmagine(file, (base64) =>
                        setPng((prev) => ({ ...prev, immagine: base64 }))
                      );
                  }}
                />
                {png.immagine && <img src={png.immagine} alt="PNG" />}
              </div>
              <div className="generali-left">
                <div className="field-group">
                  <label>Nome:</label>
                  <input
                    type="text"
                    value={png.nome}
                    onChange={(e) => aggiornaCampo("nome", e.target.value)}
                    placeholder="Es. Gundra"
                  />

                  <label>Razza:</label>
                  <select
                    value={png.razza}
                    onChange={(e) => {
                      const nuovaRazza = e.target.value;
                      setPng((prev) => ({
                        ...prev,
                        razza: nuovaRazza,
                        nome: generaNomePerRazza(nuovaRazza),
                        descrizione: aggiornaDescrizioneConRazza(
                          prev.descrizione,
                          nuovaRazza
                        ),
                      }));
                    }}
                  >
                    <option value="">-- Seleziona razza --</option>
                    {listaRazze.map((razza) => (
                      <option key={razza.index} value={razza.index}>
                        {razzeItaliane[razza.name] || razza.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {tipo === "Non Comune" && (
                <div className="field-group">
                  <label>Livello:</label>
                  <select
                    value={png.livello}
                    onChange={(e) =>
                      aggiornaCampo("livello", Number(e.target.value))
                    }
                  >
                    {[...Array(20)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>

                  <hr />
                  <label>Classe:</label>
                  <select
                    value={png.classe}
                    onChange={(e) => aggiornaCampo("classe", e.target.value)}
                  >
                    <option value="">-- Seleziona classe --</option>
                    {listaClassi.map((cls) => (
                      <option key={cls.index} value={cls.index}>
                        {classiItaliane[cls.index] || cls.name}
                      </option>
                    ))}
                  </select>
                  {png.sottoclasse && (
                    <div
                      className="sottoclasse-box"
                      style={{ marginTop: "15px" }}
                    >
                      <h4>Sottoclasse: {png.sottoclasse.nome}</h4>
                      <p>{png.sottoclasse.descrizione}</p>
                      {png.sottoclasse.privilegi.length > 0 && (
                        <>
                          <h5>Privilegi:</h5>
                          <ul>
                            {png.sottoclasse.privilegi.map((p, i) => (
                              <li key={i}>{p}</li>
                            ))}
                          </ul>
                        </>
                      )}
                    </div>
                  )}

                  <div className="field-group">
                    <label>Background:</label>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <select
  value={png.background || ""}
  onChange={(e) => aggiornaCampo("background", e.target.value)}
>
  <option value="">-- Seleziona background --</option>
  {backgrounds.map((bg) => (
    <option key={bg.index} value={bg.name}>{bg.name}</option>
  ))}
</select>

                      {png.dettagliBackground && (
  <div className="tooltip-content">
    <strong>{png.dettagliBackground.nome}</strong>
    <p><em>{png.dettagliBackground.descrizioneBreve}</em></p>
    <p>Strumenti: {png.dettagliBackground.strumenti}</p>
    <p>Lingue: {png.dettagliBackground.lingue}</p>
  </div>
)}


                    </div>
                  </div>
                </div>
              )}
              <div className="field-group">
{tipo === "Comune" && (
  <>
                <label>Mestiere:</label>
                <select
                  value={png.mestiere}
                  onChange={(e) => aggiornaCampo("mestiere", e.target.value)}
                >
                  <option value="">-- Seleziona mestiere --</option>
                  {listaMestieri.map((m, i) => (
                    <option key={i} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
  </>
                )}

                <label>Descrizione / Aspetto:</label>
                <textarea
                  rows={3}
                  value={png.descrizione}
                  onChange={(e) => aggiornaCampo("descrizione", e.target.value)}
                  placeholder="Es. Basso, calvo, con una cicatrice sull'occhio destro..."
                />
              </div>

              <div className="field-group">
  <label>Segni particolari:</label>
  <input
    type="text"
    value={png.segni || ""}
    onChange={(e) => aggiornaCampo("segni", e.target.value)}
  />
</div>

            </div>
          )}
          {tab === "Narrativa" && (
            <div className="tab-narrativa">
              <div className="field-group">
  <label>Origine del PNG:</label>
  <textarea
    value={png.origine || ""}
    onChange={(e) => aggiornaCampo("origine", e.target.value)}
  />
</div>
<div className="field-group">
  <label>Ruolo narrativo:</label>
  <input
    type="text"
    value={png.ruolo || ""}
    onChange={(e) => aggiornaCampo("ruolo", e.target.value)}
  />
</div>
<div className="field-group">
  <label>Collegamento:</label>
  <input
    type="text"
    value={png.collegamento || ""}
    onChange={(e) => aggiornaCampo("collegamento", e.target.value)}
  />
</div>

            </div>
          )}
          {tab === "Competenze ed Abilità" && (
            <div className="tab-classe">
              <div className="field-group">
                
                <h4>Background</h4>
                <p>
                  <strong>Abilità:</strong> {png.abilitaBackground || "—"}
                </p>
                <p>
                  <strong>Talento:</strong> {png.talentiBackground || "—"}
                </p>
              </div>

              <hr />

              <div className="field-group">
                <h4>Competenze di Classe</h4>
                <ul>
                  {png.competenzeClasse?.length > 0 ? (
                    png.competenzeClasse.map((c, i) => <li key={i}>{c}</li>)
                  ) : (
                    <li>Nessuna competenza disponibile</li>
                  )}
                </ul>
              </div>

              <hr />

              <div className="classe-dettagli">
                {/* Privilegi di Classe */}
                <h4>Privilegi di Classe</h4>
                {png.talenti && png.talenti.length > 0 ? (
                  (() => {
                    const talentiUnici = {};
                    png.talenti.forEach((t) => {
                      if (!talentiUnici[t.nome]) {
                        talentiUnici[t.nome] = {
                          descrizione: t.descrizione,
                          livelli: [t.livello],
                        };
                      } else {
                        talentiUnici[t.nome].livelli.push(t.livello);
                      }
                    });

                    return (
                      <table className="tabella-talenti">
                        <thead>
                          <tr>
                            <th>Livello</th>
                            <th>Privilegio</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(talentiUnici).map(
                            ([nome, data], i) => (
                              <tr key={i}>
                                <td>{data.livelli.join(", ")}</td>
                                <td title={data.descrizione}>{nome}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    );
                  })()
                ) : (
                  <p>Nessun privilegio disponibile.</p>
                )}
              </div>

              <div className="field-group">
              <h4>Tiri Salvezza</h4>
              <ul>
                {png.tiriSalvezzaClasse?.map((ts, i) => {
                  const mod = calcolaModCaratteristica(png.stats[mappa[ts]]);
                  const bonusCompetenza = Math.ceil(png.livello / 4) + 2;
                  return (
                    <li key={i}>
                      {ts}: {mod + bonusCompetenza} <small>(mod {mod} + prof {bonusCompetenza})</small>
                    </li>
                  );
                })}
              </ul>
              </div>
            </div>
          )}
          {tab === "Statistiche" && (
            <div className="stats-grid">
              {png.stats &&
                Object.entries(png.stats).map(([chiave, valore], i) => {
                  const mod = Math.floor((valore - 10) / 2);
                  
                  const bonusRaz =
                    png.bonusRazza?.find((b) => b.includes(mappa[chiave])) ||
                    "—";

                  const abilitaCollegate = abilitaPerStat[chiave] || [];

                  return (
                    <div key={i} className="stat-box">
                      <h4>{chiave.toUpperCase()}</h4>
                      <p style={{ fontSize: "1.5rem" }}>{valore}</p>
                      <p>Mod: {mod >= 0 ? `+${mod}` : mod}</p>
                      <small>Bonus razziale: {png.bonusRazziali?.[mappa[chiave].toLowerCase()] || 0}</small>
                      <hr className="separator"/>
                      {abilitaCollegate.length > 0 ? (
                        abilitaCollegate.map((a, idx) => (
  <label key={idx}>
    <input
      type="checkbox"
      checked={png.abilitaClasse.includes(a)}
      onChange={() => toggleAbilita(a)}
    />
    {a}
  </label>
                        ))
                      ) : (
                        <small>Nessuna abilità</small>
                      )}
                    </div>
                  );
                })}
            </div>
          )}
          {tab === "Combattimento" && (
            <div className="tab-combattimento">
              <div className="combattimento-sezione">
                <h3>Combattimento</h3>

                {/* Punti Ferita e Classe Armatura */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <div>
                    <strong>PF:</strong> {png.pf || "-"}
                  </div>
                  <div>
                    <strong>CA:</strong> {png.ca || "-"}
                  </div>
                  <p><strong>Bonus Competenza:</strong> +{Math.ceil(png.livello / 4) + 2}</p>

                </div>

                {/* Tabella Armi */}
                <h4>Armi</h4>
{png.dettagliArma ? (
  <table>
    <thead>
      <tr>
        <th>Nome</th>
        <th>Danno</th>
        <th>Tipo</th>
        <th>Proprietà</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>{png.dettagliArma.name}</td>
        <td>{png.dettagliArma.damage.damage_dice}</td>
        <td>{png.dettagliArma.damage.damage_type.name}</td>
        <td>{png.dettagliArma.properties.map((p) => p.name).join(", ")}</td>
      </tr>
    </tbody>
  </table>
) : (
  <p>Nessuna arma selezionata</p>
)}



                <h4>Armatura</h4>
<table>
<thead><tr><th>Nome</th><th>CA Base</th></tr></thead>
<tbody>
<tr><td>{png.armatura}</td><td>{png.ca}</td></tr>
</tbody>
</table>


                {/* Select per cambiare arma */}
                {png.armiCompatibili && png.armiCompatibili.length > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    <label>
                      <strong>Sostituisci arma:</strong>
                    </label>
                    <select
                      value={png.arma || ""}
                      onChange={(e) => handleCambioArma(e.target.value)}
                    >
                      <option value="">-- Seleziona --</option>
                      {png.armiCompatibili.map((a, i) => (
                        <option key={i} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Select per cambiare armatura */}
                {png.armatureCompatibili &&
                  png.armatureCompatibili.length > 0 && (
                    <div style={{ marginTop: "10px" }}>
                      <label>
                        <strong>Sostituisci armatura:</strong>
                      </label>
                      <select
                        value={png.armatura || ""}
                        onChange={(e) =>
                          aggiornaCampo("armatura", e.target.value)
                        }
                      >
                        <option value="">-- Seleziona --</option>
                        {png.armatureCompatibili.map((arm, i) => (
                          <option key={i} value={arm}>
                            {arm}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
              </div>

              <hr />

              <h4>⚔️ Azioni del PNG</h4>
              {Array.isArray(png.azioni) &&
                png.azioni.map((azione, index) => (
                  <div key={index} className="field-group">
                    <label>Azione {index + 1}:</label>
                    <input
                      type="text"
                      value={azione}
                      onChange={(e) => {
                        const nuove = [...png.azioni];
                        nuove[index] = e.target.value;
                        aggiornaCampo("azioni", nuove);
                      }}
                      placeholder="Es: Attacco con spada lunga +5, 1d8+3 danni taglienti"
                    />
                  </div>
                ))}

              <button
                onClick={() => aggiornaCampo("azioni", [...png.azioni, ""])}
                style={{ marginTop: "0.5rem" }}
              >
                ➕ Aggiungi Azione
              </button>
            </div>
          )}
          {tab === "Magia" && classeMagica && (
            <div className="tab-magia">
              {png.magia ? (
                <>
                  <h4>Info Magia</h4>
                  <p>
                    <strong>Caratteristica:</strong>{" "}
                    {png.magia.caratteristica.toUpperCase()}
                  </p>
                  <p>
                    <strong>CD Incantesimi:</strong> {png.magia.cd}
                  </p>
                  <p>
                    <strong>Bonus Attacco Magico:</strong> +
                    {png.magia.bonusAttaccoMagico}
                  </p>
                  <p>
                    <strong>Focus:</strong> {png.magia.focus}
                  </p>

                  <h4>Slot Incantesimi</h4>
                  <table className="tabella-slot">
                    <thead>
                      <tr>
                        <th>Livello</th>
                        {[...Array(9)].map((_, i) => (
                          <th key={i}>{i + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Slot</td>
                        {png.slotIncantesimi.map((slot, i) => (
                          <td key={i}>{slot || "-"}</td>
                        ))}
                      </tr>
                    </tbody>
                  </table>

                  <h4>Incantesimi Conosciuti</h4>
                  {png.incantesimi?.length > 0 ? (
                    <ul>
                      {png.incantesimi.map((spell, i) => (
                        <li
                          key={i}
                          onClick={async () => {
                            const res = await fetch(
                              `https://www.dnd5eapi.co${spell.url}`
                            );
                            const dettagli = await res.json();
                            alert(
                              `${dettagli.name}\n${dettagli.desc.join("\n")}`
                            );
                          }}
                          style={{ cursor: "pointer", color: "#FFD700" }}
                          title="Clicca per dettagli"
                        >
                          {spell.name}{" "}
                          {spell.level === 0
                            ? "(Trucchetto)"
                            : `(Lv.${spell.level})`}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Nessun incantesimo disponibile.</p>
                  )}
                </>
              ) : (
                <p>Questa classe non possiede capacità magiche.</p>
              )}
            </div>
          )}
          {tab === "Equipaggiamento" && (
            <div className="tab-equipaggiamento">
              <div className="field-group">
                <label>Cosa indossa:</label>
               <textarea
  readOnly
  value={`${png.armatura || ""}, ${png.arma || ""}${png.equipPortato ? ", " + png.equipPortato : ""}`}
/>

              </div>

              <div className="field-group">
                <label>Cosa porta con sé:</label>
                <textarea
                  rows={3}
                  value={png.equipPortato || ""}
                  onChange={(e) =>
                    aggiornaCampo("equipPortato", e.target.value)
                  }
                  placeholder="Es: Borsa con erbe, piccolo pugnale arrugginito, pergamena arrotolata..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  console.log(png.stats);
}
