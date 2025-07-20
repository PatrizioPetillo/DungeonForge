import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { generaPNGStepByStep, razzeItaliane, classiItaliane } from "../../utils/generators";
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
  const [listaBackgrounds, setListaBackgrounds] = useState([]);
  const [dettagliBackground, setDettagliBackground] = useState(null);
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

    fetch("https://www.dnd5eapi.co/api/backgrounds")
      .then((res) => res.json())
      .then((data) => setListaBackgrounds(data.results));
  }, []);

  {/*useEffect(() => {
    if (!png.classe) return;

    const loadSpellcasting = async () => {
      try {
        const res = await fetch(
          `https://www.dnd5eapi.co/api/classes/${png.classe}/spellcasting`
        );
        if (!res.ok) {
          setClasseMagica(false);
          setTipoMagia("");
          return;
        }

        const data = await res.json();
        setClasseMagica(true);
        setTipoMagia(data.spellcasting_type); // 'prepared' o 'known'

        const abilita = data.spellcasting_ability.index;
        setDatiMagia((prev) => ({
          ...prev,
          caratteristica: abilita,
        }));

        const modStat = png.stats?.[abilita.toLowerCase()] || 0;
        const proficiency = Math.ceil(png.livello / 4) + 1;
        const cd = 8 + modStat + proficiency;
        const bonus = modStat + proficiency;

        setDatiMagia((prev) => ({
          ...prev,
          cd,
          bonusAttacco: bonus,
        }));

        // Calcolo massimo incantesimi
        if (data.spellcasting_type === "prepared") {
          setMaxIncantesimi(modStat + png.livello);
        } else if (data.spellcasting_type === "known") {
          // fetch classe principale per tabella
          const clsRes = await fetch(
            `https://www.dnd5eapi.co/api/classes/${png.classe}`
          );
          const clsData = await clsRes.json();
          const known = clsData.spellcasting?.spells_known?.[png.livello] || 0;
          setMaxIncantesimi(known);
        }

        // Calcolo slot per livello
        const clsRes = await fetch(
          `https://www.dnd5eapi.co/api/classes/${png.classe}`
        );
        const clsData = await clsRes.json();
        const slot = clsData.spellcasting?.spell_slots_level_1
          ? Object.entries(clsData.spellcasting).filter(([k, _]) =>
              k.startsWith("spell_slots_level_")
            )
          : [];
        setSlotIncantesimi(
          slot.map(([k, v]) => ({
            livello: k.replace("spell_slots_level_", ""),
            quantita: v,
          }))
        );
      } catch (err) {
        console.error("Errore caricamento spellcasting:", err);
        setClasseMagica(false);
      }
    };

    loadSpellcasting();
  }, [png.classe, png.livello, png.stats]); */}

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

  const selezionaBackground = async (valore) => {
    aggiornaCampo("background", valore);
    if (!valore) return setDettagliBackground(null);

    const res = await fetch(
      `https://www.dnd5eapi.co/api/backgrounds/${valore}`
    );
    const data = await res.json();

    // Estrai abilità, talenti, ecc.
    const abilita = Array.isArray(bg?.skill_proficiencies)
      ? bg.skill_proficiencies.map((a) => a.name).join(", ")
      : "Nessuna";
    const talento = data.feature?.name || "—";
    const descrizioneTalento = data.feature?.desc?.join(" ") || "";
    const strumenti =
      data.tool_proficiencies?.map((t) => t.name).join(", ") || "";
    const lingue = data.languages?.join(", ") || "";

    setDettagliBackground({
      abilita,
      talento,
      descrizioneTalento,
      strumenti,
      lingue,
    });

    // Popola anche i campi PNG se vuoi salvarli
    aggiornaCampo("abilitaBackground", abilita);
    aggiornaCampo("talentiBackground", `${talento}: ${descrizioneTalento}`);
  };

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
    await generaPNGStepByStep(setPng, tipo, setStepCorrente);
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
  const tabComune = ["Generali",  "Equipaggiamento", "Narrativa"];
  const tabNonComune = [
    ...tabComune,
    "Statistiche",
    "Combattimento",
    "Magia",
    "Equipaggiamento",
  ];
  const tabList =
    tipo === "Comune"
      ? ["Generali",  "Equipaggiamento", "Narrativa",]
      : [
          "Generali",
          "Statistiche",
          "Combattimento",
          "Equipaggiamento",
          "Narrativa",
          ...(classeMagica ? ["Magia"] : []),
        ];

        const handleCambioArma = async (nuovaArma) => {
  if (!nuovaArma) return;

  try {
    const res = await fetch(`https://www.dnd5eapi.co/api/equipment/${nuovaArma.toLowerCase().replace(/\s+/g, "-")}`);
    if (!res.ok) return;
    const armaDettaglio = await res.json();

    const modCar = armaDettaglio.weapon_range === "Melee"
      ? Math.floor((png.stats.forza - 10) / 2)
      : Math.floor((png.stats.destrezza - 10) / 2);

    const proficiency = Math.ceil(png.livello / 4) + 2;
    const bonusAttacco = proficiency + modCar;

    setPng((prev) => ({
      ...prev,
      arma: nuovaArma,
      dettagliArma: armaDettaglio,
      bonusAttacco
    }));
  } catch (error) {
    console.error("Errore nel cambio arma:", error);
  }
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

    <Lottie animationData={calderoneAnim} loop={true} className="calderone-lottie" />
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
              <div className="field-group">
                <label>Nome:</label>
                <input
                  type="text"
                  value={png.nome}
                  onChange={(e) => aggiornaCampo("nome", e.target.value)}
                  placeholder="Es. Gundra"
                />
              </div>

              {/* <div className="field-group">
                <label>Cognome:</label>
                <input
                  type="text"
                  value={png.cognome}
                  onChange={(e) => aggiornaCampo("cognome", e.target.value)}
                  placeholder="Es. Manodura"
                />
              </div> */}

              <label>📸 Immagine Villain</label>
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

              <div className="field-group">
                <label>Razza:</label>
                <select
  value={png.razza}
  onChange={(e) => aggiornaCampo("razza", e.target.value)}
>
                  <option value="">-- Seleziona razza --</option>
                  {listaRazze.map((razza) => (
                        <option key={razza.index} value={razza.index}>
                          {razzeItaliane[razza.name] || razza.name}
                        </option>
                  ))}
                </select>
                {tipo === "Non Comune" && (
  <p>
    <em>{png.bonusRazza?.join(", ")}</em>
  </p>
)}

              </div>
              <div className="tab-classe">
              <div className="field-group">
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
              </div>
              {png.sottoclasse && (
  <div className="sottoclasse-box" style={{ marginTop: "15px" }}>
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
              </div>
              <div className="field-group">
                <h4>Competenze di Classe</h4>
                <ul>
                  {png.competenzeClasse.map((c, i) => (
                    <li key={i} title={c.descrizione}>
                      {c.nome}
                    </li>
                  ))}
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
                <label>Tiri Salvezza:</label>
                <input
  type="text"
  value={Object.entries(png.tiriSalvezzaClasse || {})
    .map(([k,v]) => `${k} +${v}`)
    .join(", ") || "—"}
  readOnly
/>
              </div>

              <div className="field-group">
                <label>Background:</label>
                <select
                  value={png.background}
                  onChange={(e) => selezionaBackground(e.target.value)}
                >
                  <option value="">-- Seleziona background --</option>
                  {listaBackgrounds.map((bg) => (
                    <option key={bg.index} value={bg.index}>
                      {bg.name}
                    </option>
                  ))}
                </select>
              </div>

              {dettagliBackground && (
                <div className="background-dettagli">
                  <p>
                    <strong>Abilità:</strong> {dettagliBackground.abilita}
                  </p>
                  <p>
                    <strong>Strumenti:</strong> {dettagliBackground.strumenti}
                  </p>
                  <p>
                    <strong>Lingue:</strong> {dettagliBackground.lingue}
                  </p>
                  <p>
                    <strong>Talento:</strong> {dettagliBackground.talento}
                  </p>
                  <p>{dettagliBackground.descrizioneTalento}</p>
                </div>
              )}
            </div>

              {tipo === "Comune" && (
                <div className="field-group">
                  <label>Mestiere:</label>
                  <select
                    value={png.mestiere}
                    onChange={(e) => aggiornaCampo("mestiere", e.target.value)}
                  >
                    <option value="">-- Seleziona mestiere --</option>
                    <option>Locandiere</option>
                    <option>Erborista</option>
                    <option>Mercante</option>
                    <option>Cacciatore</option>
                    <option>Studioso</option>
                    <option>Ladro</option>
                    <option>Guida</option>
                  </select>
                </div>
              )}
              <div className="field-group">
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
                <textarea
                  rows={2}
                  value={png.segni}
                  onChange={(e) => aggiornaCampo("segni", e.target.value)}
                  placeholder="Es. Fischietta nei momenti di tensione; 'Ah, la gioventù...' è la sua frase tipica."
                />
              </div>
            </div>
          )}
          
          {tab === "Statistiche" && (
            <div className="stats-grid">
              {png.stats &&
                Object.entries(png.stats).map(([chiave, valore], i) => {
                  const mod = Math.floor((valore - 10) / 2);
                  const mappa = {
                    forza: "Strength",
                    destrezza: "Dexterity",
                    costituzione: "Constitution",
                    intelligenza: "Intelligence",
                    saggezza: "Wisdom",
                    carisma: "Charisma",
                  };
                  const bonusRaz =
                    png.bonusRazza?.find((b) => b.includes(mappa[chiave])) ||
                    "—";

                  const abilitaCollegate =
                    png.abilita?.filter((a) => a.caratteristica === chiave) ||
                    [];

                  return (
                    <div key={i} className="stat-box">
                      <h4>{chiave.toUpperCase()}</h4>
                      <p style={{ fontSize: "1.5rem" }}>{valore}</p>
                      <p>Mod: {mod >= 0 ? `+${mod}` : mod}</p>
                      <small>Bonus razziale: {bonusRaz}</small>
                      <hr />
                      
                        {abilitaCollegate.map((a, idx) => (
                          <div key={idx}>
                            {a.nome}{" "}
                            {a.competente && (
                              <span style={{ color: "#FFD700" }}>★</span>
                            )}
                          </div>
                        ))} : <small>Nessuna abilità</small>
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
  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
    <div><strong>PF:</strong> {png.pf || "-"}</div>
    <div><strong>CA:</strong> {png.ca || "-"}</div>
  </div>

  {/* Tabella Armi */}
  <h4>Attacchi e Armi</h4>
  <table className="tabella-combattimento">
    <thead>
      <tr>
        <th>Nome</th>
        <th>Bonus</th>
        <th>Danno</th>
        <th>Proprietà</th>
      </tr>
    </thead>
    <tbody>
      {png.dettagliArma ? (
        <tr>
          <td
  title={`Categoria: ${png.dettagliArma.weapon_category}\nRange: ${png.dettagliArma.weapon_range}`}
>{png.dettagliArma.name}</td>
          <td>+{png.bonusAttacco || 0}</td>
          <td>
            {png.dettagliArma.damage?.damage_dice || "-"}{" "}
            {png.dettagliArma.damage?.damage_type?.name || ""}
          </td>
          <td>
  {png.dettagliArma.properties?.map((p, idx) => (
    <span
      key={idx}
      title={`Proprietà: ${p.name}`}
      style={{ marginRight: "8px", cursor: "help" }}
    >
      {p.name}
    </span>
  )) || "-"}
</td>

        </tr>
      ) : (
        <tr>
          <td colSpan="4" style={{ textAlign: "center" }}>Nessuna arma assegnata</td>
        </tr>
      )}
    </tbody>
  </table>

  {/* Select per cambiare arma */}
  {png.armiCompatibili && png.armiCompatibili.length > 0 && (
    <div style={{ marginTop: "10px" }}>
      <label><strong>Sostituisci arma:</strong></label>
      <select
        value={png.arma || ""}
        onChange={(e) => handleCambioArma( e.target.value)}
      >
        <option value="">-- Seleziona --</option>
        {png.armiCompatibili.map((a, i) => (
          <option key={i} value={a}>{a}</option>
        ))}
      </select>
    </div>
  )}

  {/* Select per cambiare armatura */}
  {png.armatureCompatibili && png.armatureCompatibili.length > 0 && (
    <div style={{ marginTop: "10px" }}>
      <label><strong>Sostituisci armatura:</strong></label>
      <select
        value={png.armatura || ""}
        onChange={(e) => aggiornaCampo("armatura", e.target.value)}
      >
        <option value="">-- Seleziona --</option>
        {png.armatureCompatibili.map((arm, i) => (
          <option key={i} value={arm}>{arm}</option>
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
      <p><strong>Caratteristica:</strong> {png.magia.caratteristica.toUpperCase()}</p>
      <p><strong>CD Incantesimi:</strong> {png.magia.cd}</p>
      <p><strong>Bonus Attacco Magico:</strong> +{png.magia.bonusAttaccoMagico}</p>
      <p><strong>Focus:</strong> {png.magia.focus}</p>

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
                const res = await fetch(`https://www.dnd5eapi.co${spell.url}`);
                const dettagli = await res.json();
                alert(`${dettagli.name}\n${dettagli.desc.join("\n")}`);
              }}
              style={{ cursor: "pointer", color: "#FFD700" }}
              title="Clicca per dettagli"
            >
              {spell.name} {spell.level === 0 ? "(Trucchetto)" : `(Lv.${spell.level})`}
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
  rows={3}
  value={[png.armatura, png.arma, png.equipIndossato].filter(Boolean).join(", ")}
  onChange={(e) => aggiornaCampo("equipIndossato", e.target.value)}
/>
              </div>

              <div className="field-group">
                <label>Cosa porta con sé:</label>
                <textarea
                  rows={3}
                  value={png.equipPortato}
                  onChange={(e) =>
                    aggiornaCampo("equipPortato", e.target.value)
                  }
                  placeholder="Es: Borsa con erbe, piccolo pugnale arrugginito, pergamena arrotolata..."
                />
              </div>
            </div>
          )}
          {tab === "Narrativa" && (
            <div className="tab-narrativa">
              <div className="field-group">
                <label>Origine del PNG:</label>
                <textarea
                  rows={3}
                  value={png.origine}
                  onChange={(e) => aggiornaCampo("origine", e.target.value)}
                  placeholder="Da dove viene? Qual è il suo passato?"
                />
              </div>

              <div className="field-group">
                <label>🎭 Ruolo Narrativo</label>
                <select
                  value={png.ruolo || ""}
                  onChange={(e) => aggiornaCampo("ruolo", e.target.value)}
                >
                  <option value="">-- Seleziona ruolo --</option>
                  <option>Alleato</option>
                  <option>Amico</option>
                  <option>Traditore</option>
                  <option>Mentore</option>
                  <option>Guida</option>
                  <option>Nemico</option>
                  <option>Mercante</option>
                  <option>Contatto</option>
                  <option>Informatore</option>
                </select>
              </div>

              <div className="field-group">
                <label>Collegamento a scena/capitolo:</label>
                <input
                  type="text"
                  value={png.collegamento}
                  onChange={(e) =>
                    aggiornaCampo("collegamento", e.target.value)
                  }
                  placeholder="Es: Capitolo 2 - Il Bosco di Tenebra / Scena: L’incontro al bivio"
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
