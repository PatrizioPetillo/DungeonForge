import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import "../../styles/modalePng.css";

export default function ModalePng({ onClose }) {
  const [tipo, setTipo] = useState("Comune");
  const [tab, setTab] = useState("Generali");
  const [listaRazze, setListaRazze] = useState([]);
  const [listaClassi, setListaClassi] = useState([]);
  const [listaBackgrounds, setListaBackgrounds] = useState([]);
  const [dettagliBackground, setDettagliBackground] = useState(null);
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
    ca: "",
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

  useEffect(() => {
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
  }, [png.classe, png.livello, png.stats]);

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
    const abilita =
      data.skill_proficiencies?.map((a) => a.name).join(", ") || "";
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
        const abilita =
          data.proficiency_choices?.[0]?.from?.map((a) => a.name) || [];

        setPng((prev) => ({
          ...prev,
          tiriSalvezzaClasse: salvezza,
          abilitaClasse: abilita,
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

  // Generazione automatica di un PNG Comune
  const generaPNG = async (isNonComune = false) => {
    const razzeRes = await fetch("https://www.dnd5eapi.co/api/races");
    const razze = await razzeRes.json();
    const classiRes = await fetch("https://www.dnd5eapi.co/api/classes");
    const classi = await classiRes.json();
    const backgroundRes = await fetch(
      "https://www.dnd5eapi.co/api/backgrounds"
    );
    const backgrounds = await backgroundRes.json();

    const nome = generaNomeCasuale();
    const cognome = generaCognomeCasuale();
    const razza = casuale(razze.results).index;
    const background = casuale(backgrounds.results).index;

    const descrizione = `Un ${razza} dall'aspetto misterioso, con tratti distintivi evidenti.`;
    const segni = "Fischia quando è nervoso. Ripete sempre 'Fidati di me'.";
    const origine = "Proviene da un villaggio distrutto, in cerca di vendetta.";
    const relazionePg = "Alleato";
    const collegamento = "Capitolo 1 - Il Villaggio in Fiamme";

    const equipIndossato = "Tunica logora, stivali di cuoio, cappuccio.";
    const equipPortato = "Pugnale nascosto, borsa con spezie, libro logoro.";

    const stats = tiraStats();

    const livello = isNonComune ? rand(1, 10) : null;
    const classe = isNonComune ? casuale(classi.results).index : null;

    const obj = {
      nome,
      cognome,
      razza,
      descrizione,
      segni,
      origine,
      relazionePg,
      collegamento,
      equipIndossato,
      equipPortato,
      tipo: isNonComune ? "Non Comune" : "Comune",
      stats,
      ...(isNonComune && { livello, classe, background }),
    };

    setPng(obj);

    if (isNonComune) {
      await completaPNGNonComune(classe, livello, stats);
    }
  };

  // Generazione automatica di un PNG NonComune
  const completaPNGNonComune = async (classe, livello, stats) => {
    // 1. Spellcasting Info
    const res = await fetch(
      `https://www.dnd5eapi.co/api/classes/${classe}/spellcasting`
    );
    const spellData = res.ok ? await res.json() : null;

    const abilita = spellData?.spellcasting_ability.index || "intelligence";
    const mod = stats[abilita] ? Math.floor((stats[abilita] - 10) / 2) : 0;
    const proficiency = Math.ceil(livello / 4) + 1;
    const cd = 8 + mod + proficiency;
    const bonusAttacco = mod + proficiency;

    setClasseMagica(!!spellData);
    setTipoMagia(spellData?.spellcasting_type || "");
    setDatiMagia({
      caratteristica: abilita,
      cd,
      bonusAttacco,
      focus: "Amuleto con simbolo arcano",
      scuola: "Scuola di Illusione",
      incantesimi: [],
    });

    // 2. Arma casuale
    const armi = ["longsword", "dagger", "shortbow", "mace", "warhammer"];
    const arma = casuale(armi);
    setPng((prev) => ({ ...prev, arma }));

    // 3. Azioni base
    const azioni = [
      "Attacco con " + arma,
      "Ritirata tattica",
      "Urlo intimidatorio",
    ];
    setPng((prev) => ({ ...prev, azioni }));

    // 4. Background + talenti + abilità
    const bgRes = await fetch(
      `https://www.dnd5eapi.co/api/backgrounds/${png.background}`
    );
    const bg = await bgRes.json();
    setPng((prev) => ({
      ...prev,
      abilitaBackground: bg.skill_proficiencies?.map((a) => a.name).join(", "),
      talentiBackground: `${bg.feature?.name}: ${bg.feature?.desc?.[0]}`,
      tiriSalvezza: "For, Cos", // in seguito possiamo calcolarli dalla classe
    }));

    // 5. Incantesimi (opzionali)
    if (spellData) {
      const tuttiRes = await fetch("https://www.dnd5eapi.co/api/spells");
      const tutti = await tuttiRes.json();

      const spellList = [];
      for (const s of tutti.results) {
        const d = await fetch(`https://www.dnd5eapi.co${s.url}`).then((r) =>
          r.json()
        );
        if (d.classes.some((c) => c.index === classe) && d.level <= livello) {
          spellList.push(d);
        }
      }

      const maxSpells =
        spellData.spellcasting_type === "known"
          ? spellData.spells_known?.[livello] || 3
          : mod + livello;

      setDatiMagia((prev) => ({
        ...prev,
        incantesimi: shuffle(spellList).slice(0, maxSpells),
      }));
    }
  };

  const genera4d6 = () => {
    const tiri = Array.from({ length: 6 }).map(() => {
      let dadi = Array.from({ length: 4 }, () => Math.ceil(Math.random() * 6));
      dadi.sort((a, b) => a - b);
      return dadi.slice(1).reduce((a, b) => a + b, 0);
    });
    const newStats = {
      forza: tiri[0],
      destrezza: tiri[1],
      costituzione: tiri[2],
      intelligenza: tiri[3],
      saggezza: tiri[4],
      carisma: tiri[5],
    };
    setPng((prev) => ({ ...prev, stats: newStats }));
  };

  // Tab disponibili in base al tipo PNG
  const tabComune = ["Generali", "Narrativa", "Equipaggiamento"];
  const tabNonComune = [
    ...tabComune,
    "Classe",
    "Statistiche",
    "Combattimento",
    "Magia",
    "Equipaggiamento",
    "Collegamenti",
  ];
  const tabList =
    tipo === "Comune"
      ? ["Generali", "Narrativa", "Equipaggiamento"]
      : [
          "Generali",
          "Narrativa",
          "Classe",
          "Statistiche",
          "Combattimento",
          "Equipaggiamento",
          "Collegamenti",
          ...(classeMagica ? ["Magia"] : []),
        ];

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
            <button
              title="Genera PNG"
              onClick={() => generaPNG(tipo === "Non Comune")}
            >
              🎲
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

              <div className="field-group">
                <label>Cognome:</label>
                <input
                  type="text"
                  value={png.cognome}
                  onChange={(e) => aggiornaCampo("cognome", e.target.value)}
                  placeholder="Es. Manodura"
                />
              </div>

              <div className="field-group">
                <label>Razza:</label>
                <select
                  value={png.razza}
                  onChange={(e) => aggiornaCampo("razza", e.target.value)}
                >
                  <option value="">-- Seleziona razza --</option>
                  {listaRazze.map((razza) => (
                    <option key={razza.index} value={razza.index}>
                      {razza.name}
                    </option>
                  ))}
                </select>
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
                <label>Relazione con i PG:</label>
                <select
                  value={png.relazionePg}
                  onChange={(e) => aggiornaCampo("relazionePg", e.target.value)}
                >
                  <option value="">-- Seleziona --</option>
                  <option>Alleato</option>
                  <option>Amico</option>
                  <option>Traditore</option>
                  <option>Mentore</option>
                  <option>Guida</option>
                  <option>Nemico</option>
                  <option>Mercante</option>
                  <option>Contatto della Gilda</option>
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
          {tab === "Classe" && (
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
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

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
                <label>Punti Ferita (PF):</label>
                <input
                  type="number"
                  value={png.pf}
                  onChange={(e) => aggiornaCampo("pf", e.target.value)}
                  placeholder="Es: 45"
                />
              </div>

              <div className="field-group">
                <label>Classe Armatura (CA):</label>
                <input
                  type="number"
                  value={png.ca}
                  onChange={(e) => aggiornaCampo("ca", e.target.value)}
                  placeholder="Es: 16"
                />
              </div>

              <div className="field-group">
                <label>Tiri Salvezza:</label>
                <input
                  type="text"
                  value={png.tiriSalvezza}
                  onChange={(e) =>
                    aggiornaCampo("tiriSalvezza", e.target.value)
                  }
                  placeholder="Es: FOR, COS"
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
          )}
          {tab === "Statistiche" && (
            <div className="tab-statistiche">
              <h4>Punteggi caratteristica</h4>
              {[
                "forza",
                "destrezza",
                "costituzione",
                "intelligenza",
                "saggezza",
                "carisma",
              ].map((s) => (
                <div key={s} className="field-group">
                  <button onClick={genera4d6}>
                    🎲 Genera stats casuali (4d6)
                  </button>

                  <label>{s.charAt(0).toUpperCase() + s.slice(1)}:</label>
                  <input
                    type="number"
                    min="3"
                    max="20"
                    value={png.stats[s]}
                    onChange={(e) => aggiornaStat(s, e.target.value)}
                  />
                  {Object.keys(bonusRazziali).length > 0 && (
                    <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
                      Bonus razziali:{" "}
                      {Object.entries(bonusRazziali)
                        .map(
                          ([stat, val]) =>
                            `${
                              stat.charAt(0).toUpperCase() + stat.slice(1)
                            } +${val}`
                        )
                        .join(", ")}
                    </p>
                  )}
                </div>
              ))}

              <hr />

              <div className="field-group">
                <label>Tiri Salvezza (dalla classe):</label>
                <p>{png.tiriSalvezzaClasse.join(", ") || "—"}</p>
              </div>

              <div className="field-group">
                <label>Abilità disponibili:</label>
                <ul>
                  {png.abilitaClasse.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {tab === "Combattimento" && (
            <div className="tab-combattimento">
              <div className="field-group">
                <div className="field-group">
                  <label>Classe Armatura (CA):</label>
                  <input
                    type="number"
                    value={png.ca}
                    onChange={(e) => aggiornaCampo("ca", e.target.value)}
                    placeholder="Es: 16"
                  />
                </div>
                <div className="field-group">
                  <label>Bonus Attacco:</label>
                  <input
                    type="number"
                    value={png.bonusAttacco || ""}
                    onChange={(e) =>
                      aggiornaCampo("bonusAttacco", e.target.value)
                    }
                    placeholder="Es: +5"
                  />
                </div>
                <hr />
                <label>Arma equipaggiata:</label>
                <select
                  value={png.arma}
                  onChange={(e) => aggiornaCampo("arma", e.target.value)}
                >
                  <option value="">-- Seleziona arma --</option>
                  <option value="longsword">Spada lunga</option>
                  <option value="shortbow">Arco corto</option>
                  <option value="dagger">Pugnale</option>
                  <option value="warhammer">Martello da guerra</option>
                  <option value="mace">Mazza</option>
                </select>
              </div>

              {png.armaDettagli?.damage?.damage_dice && (
                <div className="arma-info">
                  <p>
                    <strong>Danni:</strong>{" "}
                    {png.armaDettagli.damage.damage_dice}{" "}
                    {png.armaDettagli.damage.damage_type.name}
                  </p>
                  {Array.isArray(png.armaDettagli.properties) && (
                    <p>
                      <strong>Proprietà:</strong>{" "}
                      {png.armaDettagli.properties.map((p, i) => (
                        <span
                          key={i}
                          title={p.desc}
                          style={{
                            textDecoration: "underline dotted",
                            marginRight: "0.5rem",
                          }}
                        >
                          {p.name}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              )}

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
              <div className="field-group">
                <label>Caratteristica incantesimi:</label>
                <p>{datiMagia.caratteristica?.toUpperCase()}</p>
              </div>
              <div className="field-group">
                <label>Scuola / Dominio / Circolo / Patto:</label>
                <input
                  type="text"
                  value={datiMagia.scuola}
                  onChange={(e) =>
                    setDatiMagia((prev) => ({
                      ...prev,
                      scuola: e.target.value,
                    }))
                  }
                  placeholder="Es: Scuola di Illusione, Dominio della Morte..."
                />
              </div>

              <div className="field-group">
                <label>CD Incantesimi:</label>
                <input type="number" value={datiMagia.cd} readOnly />
              </div>

              <div className="field-group">
                <label>Bonus Attacco Magico:</label>
                <input type="number" value={datiMagia.bonusAttacco} readOnly />
              </div>

              <div className="field-group">
                <label>Focus Arcano / Simbolo Sacro:</label>
                <input
                  type="text"
                  value={datiMagia.focus}
                  onChange={(e) =>
                    setDatiMagia((prev) => ({ ...prev, focus: e.target.value }))
                  }
                  placeholder="Es: Bastone di rovere, amuleto del patto, libro sacro..."
                />
              </div>

              <hr />

              <h4>📜 Incantesimi</h4>
              <div className="field-group">
                <p style={{ fontStyle: "italic" }}>
                  {tipoMagia === "prepared"
                    ? `Può preparare fino a ${maxIncantesimi} incantesimi.`
                    : `Può conoscere fino a ${maxIncantesimi} incantesimi.`}
                </p>

                {slotIncantesimi.length > 0 && (
                  <div className="field-group">
                    <label>Slot disponibili:</label>
                    <ul>
                      {slotIncantesimi.map((s, i) => (
                        <li key={i}>
                          Livello {s.livello}: {s.quantita}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <label>Seleziona incantesimo:</label>
                <select
                  onChange={(e) => {
                    const selezionato = incantesimiDisponibili.find(
                      (s) => s.index === e.target.value
                    );
                    if (selezionato) {
                      if (datiMagia.incantesimi.length >= maxIncantesimi) {
                        alert(
                          `Hai raggiunto il limite massimo di incantesimi (${maxIncantesimi})`
                        );
                        return;
                      }
                      setDatiMagia((prev) => ({
                        ...prev,
                        incantesimi: [...prev.incantesimi, selezionato],
                      }));
                    }
                  }}
                >
                  <option value="">-- Aggiungi incantesimo --</option>
                  {incantesimiDisponibili.map((spell) => (
                    <option key={spell.index} value={spell.index}>
                      {spell.name} (Liv. {spell.level})
                    </option>
                  ))}
                </select>
                <ul>
                  {datiMagia.incantesimi.map((spell, i) => (
                    <li key={i} style={{ marginBottom: "0.5rem" }}>
                      <strong
                        title={
                          `Scuola: ${spell.school.name}\n` +
                          `Gittata: ${spell.range}\n` +
                          `Durata: ${spell.duration}\n` +
                          `Componenti: ${spell.components?.join(", ")}`
                        }
                        style={{
                          textDecoration: "underline dotted",
                          cursor: "help",
                        }}
                      >
                        {spell.name}
                      </strong>{" "}
                      – Liv. {spell.level}{" "}
                      <button
                        onClick={() =>
                          setDatiMagia((prev) => ({
                            ...prev,
                            incantesimi: prev.incantesimi.filter(
                              (_, idx) => idx !== i
                            ),
                          }))
                        }
                        title="Rimuovi incantesimo"
                        style={{
                          marginLeft: "0.5rem",
                          background: "none",
                          border: "none",
                          color: "#B2B9C3",
                          cursor: "pointer",
                        }}
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() =>
                  alert("Interfaccia per selezionare incantesimi in arrivo")
                }
                style={{ marginTop: "0.5rem" }}
              >
                ➕ Aggiungi Incantesimi
              </button>
            </div>
          )}
          {tab === "Equipaggiamento" && (
            <div className="tab-equipaggiamento">
              <div className="field-group">
                <label>Cosa indossa:</label>
                <textarea
                  rows={3}
                  value={png.equipIndossato}
                  onChange={(e) =>
                    aggiornaCampo("equipIndossato", e.target.value)
                  }
                  placeholder="Es: Tunica rossa con ricami dorati, anello d’argento, cappuccio consumato..."
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
          {tab === "Collegamenti" && (
            <div className="tab-collegamenti">
              <div className="field-group">
                <label>Collega a Scene esistenti:</label>
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
                  {sceneDisponibili.map((scene) => (
                    <option key={scene.id} value={scene.id}>
                      {scene.titolo} ({scene.capitoloNome || "senza capitolo"})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
