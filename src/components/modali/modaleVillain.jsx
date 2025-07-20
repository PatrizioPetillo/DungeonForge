import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import {
  generaNomeCasuale, generaLootCasuale,
  razzeItaliane, classiItaliane,
  tiraStats,
  rand,
  casuale,
  shuffle
} from "../../utils/generators";

import LootBox from "../generatori/lootBox";
import { firestore } from "../../firebase/firebaseConfig";
import { caricaImmagine } from "../../utils/helpers";

import "../../styles/modaleVillain.css";

const ModaleVillain = ({ onClose }) => {
  const [villain, setVillain] = useState({
    nome: "",
    cognome: "",
    razza: "",
    classe: "",
    livello: 5,
    sottoclasse: "",
    divinita: "",
    scopo: "",
    motivazione: "",
    spinta: "",
    frase: "",
  });

  const [tab, setTab] = useState("Generale");
  const [razze, setRazze] = useState([]);
  const [classi, setClassi] = useState([]);
  const [sottoclassi, setSottoclassi] = useState([]);
  const [stats, setStats] = useState({
    forza: 10,
    destrezza: 10,
    costituzione: 10,
    intelligenza: 10,
    saggezza: 10,
    carisma: 10,
  });
  const [modificatori, setModificatori] = useState({});
  const [tiriSalvezza, setTiriSalvezza] = useState([]);
  const [abilitaRazza, setAbilitaRazza] = useState([]);
  const [abilitaClasse, setAbilitaClasse] = useState([]);
  const [abilitaDisponibili, setAbilitaDisponibili] = useState([]);
  const [abilitaScelte, setAbilitaScelte] = useState([]);
  const [maxAbilita, setMaxAbilita] = useState(2);
  const [talentiBackground, setTalentiBackground] = useState("");
  const [arma, setArma] = useState("");
  const [armiDisponibili, setArmiDisponibili] = useState([]);
  const [armaDettagli, setArmaDettagli] = useState(null);
  const [azioni, setAzioni] = useState(["Attacco base"]);
  const [ca, setCa] = useState(10);
  const [classeMagica, setClasseMagica] = useState(false);
  const [tipoMagia, setTipoMagia] = useState(""); // "prepared" o "known"
  const [datiMagia, setDatiMagia] = useState({
    caratteristica: "",
    cd: 10,
    bonusAttacco: 2,
    focus: "",
    scuola: "",
    incantesimi: [],
  });
  const [listaIncantesimi, setListaIncantesimi] = useState([]);
  const [slotIncantesimi, setSlotIncantesimi] = useState([]);
  const [maxIncantesimi, setMaxIncantesimi] = useState(0);
  const [sceneDisponibili, setSceneDisponibili] = useState([]);
const [sceneCollegate, setSceneCollegate] = useState([]);
  const [campagnaAttiva, setCampagnaAttiva] = useState(null);

  // Fetch campagne attive da Firestore
  useEffect(() => {
  if (!campagnaAttiva?.id) return;

  const scenesRef = collection(firestore, `campagne/${campagnaAttiva.id}/scenes`);
  getDocs(scenesRef).then(snapshot => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setSceneDisponibili(data);
  });
}, [campagnaAttiva]);

  // Fetch razze, classi e sottoclassi da un'API o da un file locale
  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/races")
      .then((res) => res.json())
      .then((data) => setRazze(data.results));

    fetch("https://www.dnd5eapi.co/api/classes")
      .then((res) => res.json())
      .then((data) => setClassi(data.results));

    fetch("https://www.dnd5eapi.co/api/subclasses")
      .then((res) => res.json())
      .then((data) => setSottoclassi(data.results));
  }, []);

  // Fetch modificatori di razza quando la razza cambia
  useEffect(() => {
    if (!villain.razza) return;

    fetch(`https://www.dnd5eapi.co/api/races/${villain.razza}`)
      .then((res) => res.json())
      .then((data) => {
        const modificatoriRazza = {};
        data.ability_bonuses.forEach((bonus) => {
          modificatoriRazza[bonus.ability_score.index] = bonus.bonus;
        });
        setModificatori(modificatoriRazza);
      });
  }, [villain.razza]);

  // Fetch tiri salvezza quando la classe cambia
  useEffect(() => {
    if (!villain.classe) return;

    fetch(`https://www.dnd5eapi.co/api/classes/${villain.classe}`)
      .then((res) => res.json())
      .then((data) => {
        setTiriSalvezza(data.saving_throws?.map((s) => s.name) || []);
      });
  }, [villain.classe]);

  // Fetch abilità di razza quando la razza cambia
  useEffect(() => {
    if (!villain.razza) return;

    fetch(`https://www.dnd5eapi.co/api/races/${villain.razza}`)
      .then((res) => res.json())
      .then((data) => {
        setAbilitaRazza(data.starting_proficiencies?.map((p) => p.name) || []);
      });
  }, [villain.razza]);

  // Fetch abilità di classe quando la classe cambia
  useEffect(() => {
    if (!villain.classe) return;

    fetch(`https://www.dnd5eapi.co/api/classes/${villain.classe}`)
      .then((res) => res.json())
      .then((data) => {
        setAbilitaClasse(data.proficiencies?.map((p) => p.name) || []);
      });
  }, [villain.classe]);

  // Fetch abilità disponibili quando la classe cambia
  useEffect(() => {
    if (!villain.classe) return;

    fetch(`https://www.dnd5eapi.co/api/classes/${villain.classe}`)
      .then((res) => res.json())
      .then((data) => {
        const abilita = data.proficiency_choices?.find(
          (c) => c.from[0].name.includes("Abilità") || c.desc.includes("skills")
        );
        const nomi =
          abilita?.from.map((a) => a.name.replace("Skill: ", "")) || [];
        setAbilitaDisponibili(nomi);
        setMaxAbilita(abilita?.choose || 2);
        setAbilitaScelte([]); // reset ogni volta che cambia classe
      });
  }, [villain.classe]);

  // Fetch talenti di background quando il background cambia
  useEffect(() => {
    if (!villain.background) return;

    fetch(`https://www.dnd5eapi.co/api/backgrounds/${villain.background}`)
      .then((res) => res.json())
      .then((data) => {
        setTalentiBackground(`${data.feature.name}: ${data.feature.desc[0]}`);
      });
  }, [villain.background]);

  // Fetch dettagli arma quando l'arma cambia
  useEffect(() => {
    if (!arma) return;

    fetch(`https://www.dnd5eapi.co/api/equipment/${arma}`)
      .then((res) => res.json())
      .then((data) => setArmaDettagli(data));
  }, [arma]);

  // Fetch armi disponibili all'avvio
  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/equipment-categories/weapon")
      .then((res) => res.json())
      .then((data) => setArmiDisponibili(data.equipment || []));
  }, []);

  // Fetch classe magica e incantesimi quando la classe e il livello cambiano
  useEffect(() => {
    if (!villain.classe || villain.livello < 1) return;

    fetch(`https://www.dnd5eapi.co/api/classes/${villain.classe}/spellcasting`)
      .then((res) => {
        if (!res.ok) {
          setClasseMagica(false);
          setTipoMagia("");
          return;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;

        setClasseMagica(true);
        setTipoMagia(data.spellcasting_type); // "prepared" o "known"

        const stat = data.spellcasting_ability.index;
        const mod = stats[stat] ? Math.floor((stats[stat] - 10) / 2) : 0;
        const proficiency = Math.ceil(villain.livello / 4) + 1;

        setDatiMagia((prev) => ({
          ...prev,
          caratteristica: stat,
          cd: 8 + mod + proficiency,
          bonusAttacco: mod + proficiency,
          focus: "Amuleto intarsiato",
        }));

        // Recupero classe per spell slots
        return fetch(`https://www.dnd5eapi.co/api/classes/${villain.classe}`);
      })
      .then((res) => res?.json())
      .then((classeData) => {
        if (!classeData?.spellcasting) return;

        const known =
          classeData.spellcasting.spells_known?.[villain.livello] || 0;
        const slot = Object.entries(classeData.spellcasting)
          .filter(([k]) => k.startsWith("spell_slots_level_"))
          .map(([k, v]) => ({
            livello: k.replace("spell_slots_level_", ""),
            quantita: v,
          }));

        setMaxIncantesimi(
          tipoMagia === "known"
            ? known
            : stats[datiMagia.caratteristica] + villain.livello
        );
        setSlotIncantesimi(slot);
      });
  }, [villain.classe, villain.livello, stats]);

  // Fetch incantesimi quando la classe e il livello cambiano
  useEffect(() => {
    if (!villain.classe || villain.livello < 1) return;

    fetch("https://www.dnd5eapi.co/api/spells")
      .then((res) => res.json())
      .then(async (data) => {
        const dettagli = await Promise.all(
          data.results
            .slice(0, 300)
            .map((s) =>
              fetch(`https://www.dnd5eapi.co${s.url}`).then((r) => r.json())
            )
        );

        const filtrati = dettagli.filter(
          (s) =>
            s.level <= villain.livello &&
            s.classes.some((c) => c.index === villain.classe)
        );

        setListaIncantesimi(filtrati);
      });
  }, [villain.classe, villain.livello]);

  const calcolaBonusAttacco = () => {
    if (!armaDettagli || !stats) return null;

    const usaForza = armaDettagli.properties?.some(
      (p) => p.index === "versatile" || p.index === "heavy"
    );
    const statRilevante = usaForza ? "forza" : "destrezza";
    const modStat = Math.floor((stats[statRilevante] - 10) / 2);
    const proficiency = Math.ceil(villain.livello / 4) + 1;

    return modStat + proficiency;
  };


  // Funzione per aggiornare i campi del villain
  const aggiornaCampo = (campo, valore) => {
    setVillain((prev) => ({ ...prev, [campo]: valore }));
  };

  const generaVillain = async () => {
    // 1. Nome + Razza + Classe + Livello + Background
    const [razze, classi, backgrounds] = await Promise.all([
      fetch("https://www.dnd5eapi.co/api/races").then((r) => r.json()),
      fetch("https://www.dnd5eapi.co/api/classes").then((r) => r.json()),
      fetch("https://www.dnd5eapi.co/api/backgrounds").then((r) => r.json()),
    ]);

    const razza = casuale(razze.results);
    const classe = casuale(classi.results);
    const tutteSottoclassi = await fetch(
      "https://www.dnd5eapi.co/api/subclasses"
    )
      .then((r) => r.json())
      .then((data) => data.results);
    const sottoclassiClasse = tutteSottoclassi.filter(
      (s) => s.url.includes(`/api/subclasses/`) && s.url.includes(classe.index)
    );
    const sottoclasseScelta = casuale(sottoclassiClasse);
    const sottoclasseDettagli = await fetch(
      `https://www.dnd5eapi.co${sottoclasseScelta.url}`
    ).then((r) => r.json());

    const livello = rand(5, 10);
    const background = casuale(backgrounds.results);

    const nome = generaNomeCasuale();
    
    // 2. Stats 4d6 + Bonus razziali
    const stats = tiraStats(); // restituisce oggetto {forza, destrezza, ...}
    const bonusRazza = await fetch(`https://www.dnd5eapi.co${razza.url}`).then(
      (r) => r.json()
    );
    const modRazza = {};
    bonusRazza.ability_bonuses.forEach(
      (b) => (modRazza[b.ability_score.index] = b.bonus || 0)
    );
    const statsFinali = Object.fromEntries(
      Object.entries(stats).map(([k, v]) => [k, v + (modRazza[k] || 0)])
    );

    // 3. CA + arma coerente
    const arma = "longsword"; // in futuro scegli da /equipment-categories/weapon
    const armaDettagli = await fetch(
      `https://www.dnd5eapi.co/api/equipment/${arma}`
    ).then((r) => r.json());
    const usaForza = armaDettagli.properties?.some(
      (p) => p.index === "heavy" || p.index === "versatile"
    );
    const modAttacco = Math.floor(
      (statsFinali[usaForza ? "forza" : "destrezza"] - 10) / 2
    );
    const proficiency = Math.ceil(livello / 4) + 1;
    const bonusAttacco = modAttacco + proficiency;
    const ca =
      10 +
      (statsFinali["destrezza"]
        ? Math.floor((statsFinali["destrezza"] - 10) / 2)
        : 0);

    // 4. Background, talenti, tiri salvezza
    const bgData = await fetch(`https://www.dnd5eapi.co${background.url}`).then(
      (r) => r.json()
    );
    const talentoBG = `${bgData.feature.name}: ${bgData.feature.desc?.[0]}`;

    const classeData = await fetch(
      `https://www.dnd5eapi.co/api/classes/${classe.index}`
    ).then((r) => r.json());
    const tiriSalvezza = classeData.saving_throws?.map((t) => t.name) || [];
    const profClasse = classeData.proficiencies?.map((p) => p.name) || [];

    // 5. Equipaggiamento
    const equipIndossato = "Mantello nero bordato oro, armatura rinforzata";
    const equipPortato = `Chiave scheletrica, ${talentoBG}, antico grimorio rotto`;

    // 6. Narrativa e Scopo
    const aspetto = "Occhi senza pupille, cicatrice a forma di X sul volto";
    const voce = "Sibilante e grave, riecheggia nei sogni";
    const frase = "La luce è una bugia raccontata ai deboli.";
    const comportamento = "Calcolatore, crudele, ama i monologhi";
    const divinita = "Vecchio Dio delle Ombre";
    const motivazione = "Vendetta verso l'ordine che lo ha esiliato";
    const scopo = "Schiavitù dell'intero pantheon";
    const spinta = "Ha visto il vero volto degli dèi e ne è uscito folle";

    // 7. Incantesimi (se magico)
    const spellcasting = await fetch(
      `https://www.dnd5eapi.co/api/classes/${classe.index}/spellcasting`
    );
    let datiMagia = null;
    let incantesimi = [];

    if (spellcasting.ok) {
      const spellData = await spellcasting.json();
      const stat = spellData.spellcasting_ability.index;
      const mod = statsFinali[stat]
        ? Math.floor((statsFinali[stat] - 10) / 2)
        : 0;
      const maxInc =
        spellData.spellcasting_type === "known"
          ? spellData.spells_known?.[livello] || 4
          : mod + livello;

      const allSpells = await fetch("https://www.dnd5eapi.co/api/spells").then(
        (r) => r.json()
      );
      const dettagli = await Promise.all(
        allSpells.results
          .slice(0, 300)
          .map((s) =>
            fetch(`https://www.dnd5eapi.co${s.url}`).then((r) => r.json())
          )
      );
      incantesimi = dettagli.filter(
        (s) =>
          s.level <= livello && s.classes.some((c) => c.index === classe.index)
      );
      datiMagia = {
        caratteristica: stat,
        cd: 8 + mod + proficiency,
        bonusAttacco: mod + proficiency,
        focus: "Fiala di sangue runico",
        scuola: "Scuola del Terrore",
        incantesimi: shuffle(incantesimi).slice(0, maxInc),
      };
    }

    // 8. Assembla
    villain.loot = generaLootCasuale(villain.livello, villain.classe);
    setVillain({
      nome,
      cognome,
      razza: razza.index,
      classe: classe.index,
      sottoclasse: sottoclasseScelta.index,
      sottoclasseNome: sottoclasseDettagli.name,
      sottoclasseFlavor: sottoclasseDettagli.subclass_flavor,
      sottoclasseDesc: sottoclasseDettagli.desc?.join("\n") || "",
      livello,
      background: background.index,
      stats: statsFinali,
      ca,
      arma,
      armaDettagli,
      bonusAttacco,
      equipIndossato,
      equipPortato,
      tiriSalvezza,
      profClasse,
      aspetto,
      voce,
      frase,
      comportamento,
      divinita,
      motivazione,
      scopo,
      spinta,
      tipo: "Villain",
    });

    if (datiMagia) {
      setClasseMagica(true);
      setDatiMagia(datiMagia);
    } else {
      setClasseMagica(false);
    }
  };

  const abilitaPerStat = {
    forza: ["Atletica"],
    destrezza: ["Acrobazia", "Furtività", "Rapidità di mano"],
    costituzione: [],
    intelligenza: ["Arcano", "Indagare", "Storia", "Natura", "Religione"],
    saggezza: [
      "Percezione",
      "Intuizione",
      "Medicina",
      "Sopravvivenza",
      "Addestrare animali",
    ],
    carisma: ["Persuasione", "Raggirare", "Intimidire", "Intrattenere"],
  };

  const handleSalvaVillain = async () => {
    try {
      const doc = {
        ...villain,
        tipo: "Villain",
        abilitaClasse: abilitaScelte,
        magia: classeMagica,
        createdAt: serverTimestamp(),
        focus: datiMagia?.focus || null,
        scuolaMagica: datiMagia?.scuola || null,
        cdIncantesimi: datiMagia?.cd || null,
        bonusAttaccoMagico: datiMagia?.bonusAttacco || null,
        incantesimi:
          datiMagia?.incantesimi?.map((s) => ({
            name: s.name,
            level: s.level,
            school: s.school.name,
            range: s.range,
            duration: s.duration,
            components: s.components,
            desc: s.desc?.[0],
          })) || [],
          sceneCollegate,
      };

      await addDoc(collection(firestore, "villain"), doc);
      toast.success("Villain salvato con successo!");
    } catch (err) {
      console.error("Errore salvataggio Villain:", err);
      toast.error("Errore durante il salvataggio.");
    }
  };

  const tabList = [
    "Generale",
    "Scopo",
    "Statistiche",
    "Combattimento",
    "Magia",
    "Equipaggiamento",
    "Narrativa",
    "Collegamenti",
  ];

  return (
    <div className="modale-overlay" onClick={onClose}>
      <div className="modale-villain" onClick={(e) => e.stopPropagation()}>
        <div className="modale-header">
          <h2>🎭 Crea Villain</h2>
          <div className="icone-header">
            <button title="Genera casualmente" onClick={generaVillain}>
              🎲
            </button>
            <button title="Salva villain" onClick={handleSalvaVillain}>
              💾
            </button>
            <button title="Chiudi" onClick={onClose}>
              ❌
            </button>
          </div>
        </div>

        <div className="tab-selector">
          {tabList.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={t === tab ? "attiva" : ""}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="modale-body">
          {tab === "Generale" && (
            <div className="tab-generale">
              <div className="field-group">
                <label>Nome:</label>
                <input
                  type="text"
                  value={villain.nome || ""}
                  onChange={(e) =>
                    setVillain((prev) => ({ ...prev, nome: e.target.value }))
                  }
                />
                <label>📸 Immagine Villain</label>
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
  const file = e.target.files[0];
  if (file) caricaImmagine(file, (base64) => setVillain((prev) => ({ ...prev, immagine: base64 })));
}}
/>
{villain.immagine && (
  <img
    src={villain.immagine}
    alt={villain.nome}
    style={{ width: "120px", borderRadius: "8px" }}
  />
)}

              </div>

              <div className="field-group">
                <label>Cognome:</label>
                <input
                  type="text"
                  value={villain.cognome || ""}
                  onChange={(e) =>
                    setVillain((prev) => ({ ...prev, cognome: e.target.value }))
                  }
                />
              </div>

              <div className="field-group">
                <label>Razza:</label>
                <select
                  value={villain.razza}
                  onChange={(e) => aggiornaCampo("razza", e.target.value)}
                >
                  <option value="">-- Seleziona razza --</option>
                  {razze.map((r) => (
                    <option key={r.index} value={r.index}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label>Classe:</label>
                <select
                  value={villain.classe}
                  onChange={(e) => aggiornaCampo("classe", e.target.value)}
                >
                  <option value="">-- Seleziona classe --</option>
                  {classi.map((c) => (
                    <option key={c.index} value={c.index}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <label>📖 Dominio / Giuramento / Patto</label>
<input
  type="text"
  value={villain.dominio || ""}
  onChange={(e) => aggiorna("dominio", e.target.value)}
  placeholder="Es: Dominio della Morte, Giuramento di Vendetta..."
/>

<label>🧩 Sottoclasse</label>
<input
  type="text"
  value={villain.sottoclasse || ""}
  onChange={(e) => aggiorna("sottoclasse", e.target.value)}
  placeholder="Es: Necromante, Ombra, Evocatore..."
/>

              </div>

              <div className="field-group">
                <label>Livello (min. 5):</label>
                <input
                  type="number"
                  min="5"
                  value={villain.livello || ""}
                  onChange={(e) =>
                    setVillain((prev) => ({
                      ...prev,
                      livello: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="field-group">
                <label>Sottoclasse / Archetipo:</label>
                <input
                  type="text"
                  value={villain.sottoclasse || ""}
                  onChange={(e) =>
                    setVillain((prev) => ({
                      ...prev,
                      sottoclasse: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}

          {tab === "Scopo" && (
            <div className="tab-scopo">
              <div className="field-group">
                <label>Aspetto fisico:</label>
                <textarea
                  value={villain.aspetto || ""}
                  onChange={(e) =>
                    setVillain((v) => ({ ...v, aspetto: e.target.value }))
                  }
                  placeholder="Es: Pelle pallida, occhi gialli, cicatrici rituali..."
                />
              </div>

              <div className="field-group">
                <label>Voce e tono:</label>
                <textarea
                  value={villain.voce || ""}
                  onChange={(e) =>
                    setVillain((v) => ({ ...v, voce: e.target.value }))
                  }
                  placeholder="Es: Sottile e tagliente, con eco distante..."
                />
              </div>

              <div className="field-group">
                <label>Comportamento tipico:</label>
                <textarea
                  value={villain.comportamento || ""}
                  onChange={(e) =>
                    setVillain((v) => ({ ...v, comportamento: e.target.value }))
                  }
                  placeholder="Es: Manipolatore, sadico, riflessivo, teatrale..."
                />
              </div>

              <div className="field-group">
                <label>Frase d'apertura / motto:</label>
                <input
                  type="text"
                  value={villain.frase || ""}
                  onChange={(e) =>
                    setVillain((v) => ({ ...v, frase: e.target.value }))
                  }
                  placeholder="Es: 'Ogni luce è destinata a spegnersi...'"
                />
              </div>

              <div className="field-group">
                <label>Origine del Villain:</label>
                <textarea
                  value={villain.origine || ""}
                  onChange={(e) =>
                    setVillain((v) => ({ ...v, origine: e.target.value }))
                  }
                  placeholder="Storia e passaggi chiave che lo hanno reso ciò che è ora..."
                />
              </div>

              <div className="field-group">
                <label>Legame con i personaggi:</label>
                <input
                  type="text"
                  value={villain.legamePG || ""}
                  onChange={(e) =>
                    setVillain((v) => ({ ...v, legamePG: e.target.value }))
                  }
                  placeholder="Es: Ex maestro di uno dei PG, o nemico giurato del clan..."
                />
              </div>

              <hr />

              <div className="field-group">
                <label>Divinità venerata:</label>
                <input
                  type="text"
                  value={villain.divinita || ""}
                  onChange={(e) =>
                    setVillain((v) => ({ ...v, divinita: e.target.value }))
                  }
                  placeholder="Es: Vecchio Dio del Dolore"
                />
              </div>

              <div className="field-group">
                <label>Motivazione personale:</label>
                <textarea
                  value={villain.motivazione || ""}
                  onChange={(e) =>
                    setVillain((v) => ({ ...v, motivazione: e.target.value }))
                  }
                  placeholder="Es: Vuole vendicarsi di una casata nobiliare, ecc..."
                />
              </div>

              <div className="field-group">
                <label>Scopo finale:</label>
                <textarea
                  value={villain.scopo || ""}
                  onChange={(e) =>
                    setVillain((v) => ({ ...v, scopo: e.target.value }))
                  }
                  placeholder="Es: Aprire un portale verso un regno demoniaco"
                />
              </div>

              <div className="field-group">
                <label>Cosa lo spinge all'azione:</label>
                <textarea
                  value={villain.spinta || ""}
                  onChange={(e) =>
                    setVillain((v) => ({ ...v, spinta: e.target.value }))
                  }
                  placeholder="Es: Sogni profetici, visioni, disperazione..."
                />
              </div>
            </div>
          )}

          {tab === "Statistiche" && (
            <div className="tab-statistiche">
              <button onClick={tiraStats}>🎲 Genera statistiche (4d6)</button>
              <div className="stat-grid">
                {Object.entries(stats).map(([chiave, valore]) => {
                  const modRazza = modificatori[chiave] || 0;
                  const totale = valore + modRazza;
                  const mod = Math.floor((totale - 10) / 2);
                  const abilita = abilitaPerStat[chiave] || [];

                  return (
                    <div key={chiave} className="stat-box">
                      <div className="stat-title">{chiave.toUpperCase()}</div>
                      <div className="stat-score">{totale}</div>
                      <div className="stat-mod">
                        {mod >= 0 ? `+${mod}` : mod}
                      </div>
                      <ul className="stat-abilita">
                        {abilita.map((a, idx) => (
                          <li key={idx}>{a}</li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              <hr />
              <div className="field-group">
                <label>Tiri Salvezza:</label>
                <p>{tiriSalvezza.join(", ") || "—"}</p>
              </div>

              <div className="field-group">
                <label>Abilità di Razza:</label>
                <p>{abilitaRazza.join(", ") || "—"}</p>
              </div>

              <div className="field-group">
                <label>Abilità (scegline max {maxAbilita}):</label>
                <div className="abilita-checkboxes">
                  {abilitaDisponibili.map((abilita) => (
                    <label key={abilita} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={abilitaScelte.includes(abilita)}
                        disabled={
                          !abilitaScelte.includes(abilita) &&
                          abilitaScelte.length >= maxAbilita
                        }
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setAbilitaScelte((prev) =>
                            checked
                              ? [...prev, abilita]
                              : prev.filter((a) => a !== abilita)
                          );
                        }}
                      />
                      {abilita}
                    </label>
                  ))}
                </div>
              </div>

              {talentiBackground && (
                <div className="field-group">
                  <label>Talento da Background:</label>
                  <p>
                    <em>{talentiBackground}</em>
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === "Combattimento" && (
            <div className="tab-combattimento">
              <div className="field-group">
                <label>Classe Armatura (CA):</label>
                <input
                  type="number"
                  value={ca || ""}
                  onChange={(e) => setCa(parseInt(e.target.value))}
                />
              </div>

              <div className="field-group">
                <label>Arma equipaggiata:</label>
                <select value={arma} onChange={(e) => setArma(e.target.value)}>
                  <option value="">-- Seleziona arma --</option>
                  {armiDisponibili.map((armaObj) => (
                    <option key={armaObj.index} value={armaObj.index}>
                      {armaObj.name}
                    </option>
                  ))}
                </select>
              </div>

              {armaDettagli && (
                <div className="arma-info">
                  <p>
                    <strong>Danni:</strong> {armaDettagli.damage.damage_dice}{" "}
                    {armaDettagli.damage.damage_type.name}
                  </p>
                  <p>
                    <strong>Bonus Attacco:</strong> +{calcolaBonusAttacco()}
                  </p>
                  <p>
                    <strong>Proprietà:</strong>{" "}
                    {armaDettagli.properties.map((p, i) => (
                      <span
                        key={i}
                        title={p.desc || "Nessuna descrizione"}
                        style={{
                          textDecoration: "underline dotted",
                          marginRight: "0.5rem",
                        }}
                      >
                        {p.name}
                      </span>
                    ))}
                  </p>
                </div>
              )}

              <div className="field-group">
                <label>Azioni del Villain:</label>
                <textarea
                  value={azioni.join("\n")}
                  onChange={(e) => setAzioni(e.target.value.split("\n"))}
                  placeholder="Es: Attacco con spada, Intimidazione, Urlo magico..."
                />
              </div>
            </div>
          )}

          {tab === "Magia" && classeMagica && (
            <div className="tab-magia">
              <div className="field-group">
                <label>Focus arcano:</label>
                <input
                  type="text"
                  value={datiMagia.focus || ""}
                  onChange={(e) =>
                    setDatiMagia({ ...datiMagia, focus: e.target.value })
                  }
                />
              </div>

              <div className="field-group">
                <label>Scuola / Patto / Dominio:</label>
                <input
                  type="text"
                  value={datiMagia.scuola}
                  onChange={(e) =>
                    setDatiMagia({ ...datiMagia, scuola: e.target.value })
                  }
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
                <label>Incantesimi selezionati:</label>
                <ul>
                  {datiMagia.incantesimi.map((s, i) => (
                    <li key={i}>
                      <span
                        title={`${s.school.name} – ${s.range}, ${s.duration}`}
                      >
                        {s.name} (liv. {s.level})
                      </span>
                      <button
                        onClick={() =>
                          setDatiMagia((prev) => ({
                            ...prev,
                            incantesimi: prev.incantesimi.filter(
                              (_, idx) => idx !== i
                            ),
                          }))
                        }
                        title="Rimuovi"
                      >
                        ❌
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="field-group">
                <label>Seleziona incantesimo:</label>
                <select
                  onChange={(e) => {
                    const spell = listaIncantesimi.find(
                      (s) => s.index === e.target.value
                    );
                    if (!spell) return;
                    if (datiMagia.incantesimi.length >= maxIncantesimi) {
                      alert("Hai raggiunto il numero massimo di incantesimi.");
                      return;
                    }
                    setDatiMagia((prev) => ({
                      ...prev,
                      incantesimi: [...prev.incantesimi, spell],
                    }));
                  }}
                >
                  <option value="">-- Scegli un incantesimo --</option>
                  {listaIncantesimi.map((s) => (
                    <option key={s.index} value={s.index}>
                      {s.name} (Lv. {s.level})
                    </option>
                  ))}
                </select>
              </div>

              <p style={{ fontStyle: "italic" }}>
                Tipo magia: {tipoMagia} – max {maxIncantesimi} incantesimi.
              </p>
              {slotIncantesimi.length > 0 && (
                <div className="field-group">
                  <label>Slot disponibili:</label>
                  <ul>
                    {slotIncantesimi.map((s, i) => (
                      <li key={i}>
                        Lv {s.livello}: {s.quantita}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {tab === "Equipaggiamento" && (
            <div className="tab-equipaggiamento">
              <div className="field-group">
                <label>Equipaggiamento indossato:</label>
                <textarea
                  rows={3}
                  value={villain.equipIndossato || ""}
                  onChange={(e) =>
                    setVillain((prev) => ({
                      ...prev,
                      equipIndossato: e.target.value,
                    }))
                  }
                  placeholder="Es: Armatura di cuoio rinforzato, mantello viola, corona fratturata..."
                />
              </div>

              <div className="field-group">
                <label>Equipaggiamento portato:</label>
                <textarea
                  rows={3}
                  value={villain.equipPortato || ""}
                  onChange={(e) =>
                    setVillain((prev) => ({
                      ...prev,
                      equipPortato: e.target.value,
                    }))
                  }
                  placeholder="Es: Pergamena sigillata, anello con pietra nera, pozione rossa..."
                />
              </div>

              <div className="field-group">
                <LootBox loot={villain.loot} onUpdate={(nuovoLoot) => setVillain({ ...villain, loot: nuovoLoot })} />

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
                      {scene.titolo} ({scene.capitoloNome})
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
};

export default ModaleVillain;
