import React, { useState, useEffect } from "react";
import { salvaPNGFirestore } from '../firebase/salvaPNGFirestore';
import { salvaVillainFirestore } from '../firebase/salvaVillainFirestore';
import { salvaMostroFirestore } from '../firebase/salvaMostroFirestore';
import ModaleVillain from "../components/modali/modaleVillain";
import VillainCard from "./villainCard";
import ModalePNG from "../components/modali/modalePNG";
import ModalePNGNonComune from "../components/modali/modalePNGNonComune";
import ModaleLuogo from "../components/modali/modaleLuogo";
import ModaleEnigma from "../components/modali/modaleEnigma";
import ModaleIncontro from "../components/modali/modaleIncontro";
import ModaleMostro from "../components/modali/modaleMostro";
import {
  generaNomeCasuale,
  generaTitoloCasuale,
  generaHookCasuale,
  generaBlurbCasuale,
  generaLootCasuale,
  rand,
  casuale,
} from "../utils/generators";
import ModaleCompendioOneShot from "../components/modali/modaleCompendioOneShot";
import { oneshotPredefinite } from "../data/oneShots/oneShotData";
import { campagnePredefinite } from "../data/campagne/campagnePredefinite";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
import { eliminaDaArchivio } from "../utils/firestoreArchivio";
import { generateId } from "../utils/idUtils";

import "../styles/modaleCreaCampagna.css";

function ModaleCreaCampagna({
  onClose,
  campagnaId,
  onSave,
  collegaAllaCampagna,
}) {
  const [tab, setTab] = useState("Generale");
  const [showCompendio, setShowCompendio] = useState(false);
  const [campagnaSelezionata, setCampagnaSelezionata] = useState(null);
  const [villainCollegato, setVillainCollegato] = useState("");
  const [mostroCollegato, setMostroCollegato] = useState("");
  const [villainGenerato, setVillainGenerato] = useState(false);
const [villainCreato, setVillainCreato] = useState(null);
  const [pngSelezionato, setPngSelezionato] = useState(null);
  const [pngGenerati, setPngGenerati] = useState(false);

  const [pngIndexCorrente, setPngIndexCorrente] = useState(-1);
  const [showPng, setShowPng] = useState(false);
  const [modaleVillainAperta, setModaleVillainAperta] = useState(false);
  const [mostroSelezionato, setMostroSelezionato] = useState(null);
  const [showMostro, setShowMostro] = useState(false);
  const [villainAttivo, setVillainAttivo] = useState(null);
  const [modaleArchivioAperta, setModaleArchivioAperta] = useState(false);
  const [villainArchivio, setVillainArchivio] = useState([]);
  const [enigmaSelezionato, setEnigmaSelezionato] = useState(null);
const [enigmaIndex, setEnigmaIndex] = useState(-1);
const [showModaleEnigma, setShowModaleEnigma] = useState(false);
  const [modalePNGAperta, setModalePNGAperta] = useState(false);
  const [modalePNGNonComuneAperta, setModalePNGNonComuneAperta] =
    useState(false);
  const [pngAttivo, setPngAttivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modaleArchivioPNGAperta, setModaleArchivioPNGAperta] = useState(false);
  const [archivioPNG, setArchivioPNG] = useState([]);
  const [modaleLuogoAperta, setModaleLuogoAperta] = useState(false);
  const [luogoAttivo, setLuogoAttivo] = useState(null);
  const [showModaleVillain, setShowModaleVillain] = useState(false);

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
const [mostroIndexCorrente, setMostroIndexCorrente] = useState(-1);
  const [campagneGenerate, setCampagneGenerate] = useState([]);
  const [luogoSelezionato, setLuogoSelezionato] = useState(null);
const [luogoIndexCorrente, setLuogoIndexCorrente] = useState(-1);
const [showLuogo, setShowLuogo] = useState(false);
  const [incontroSelezionato, setIncontroSelezionato] = useState(null);
const [incontroIndex, setIncontroIndex] = useState(-1);
const [showModaleIncontro, setShowModaleIncontro] = useState(false);
  const [campagnaPredefinita, setCampagnaPredefinita] = useState("");
const [campagnaPredefinitaSelezionata, setCampagnaPredefinitaSelezionata] = useState(false);
const [mostraModaleVillain, setMostraModaleVillain] = useState(false);

  const applicaOneShot = (oneShot) => {
    const nuoviCapitoli = oneShot.atti.map((atto, i) => ({
      titolo: atto.titolo,
      descrizione: `${atto.obiettivo}\n${atto.contenuto.join(" ")}`,
    }));

    setCampagna((prev) => ({
      ...prev,
      titolo: oneShot.titolo,
      ambientazione: oneShot.ambientazione,
      durataStimata: oneShot.durata || "1 sessione",
      durataTipo: "sessione",
      obiettivo: oneShot.atti[oneShot.atti.length - 1].obiettivo,
      tagNarrativi: ["One-Shot", "Avventura rapida"],
      blurb: oneShot.tagline,
      capitoli: nuoviCapitoli,
      villain: [{ nome: oneShot.villain }],
      mostri: oneShot.mostri.map((nome) => ({
        nome,
        fonte: "oneShot",
      })),
    }));
  };

  // Cache per le API
  let racesCache = [];
  let classesCache = [];
  let monstersCache = [];
  let allSpellsCache = [];

  const apriModaleEnigma = () => {
    setModaleEnigmaAperta(true);
  };

  const rimuoviEnigma = async (index) => {
    const updated = [...enigmiCampagna];
    const enigma = updated[index];

    if (enigma.id) {
      await eliminaDaArchivio("enigmi", enigma.id);
    }

    updated.splice(index, 1);
    setEnigmiCampagna(updated);
  };

  const apriModaleIncontro = () => {
    setModaleIncontroAperta(true);
  };

  const rimuoviIncontro = async (index) => {
    const updated = [...incontri];
    const incontro = updated[index];

    if (incontro.id) {
      await eliminaDaArchivio("incontri", incontro.id);
    }

    updated.splice(index, 1);
    setIncontri(updated);
  };

  const rimuoviMostro = async (index) => {
    const updated = [...campagna.mostri];
    const mostro = updated[index];

    if (mostro.id) {
      await eliminaDaArchivio("mostri", mostro.id);
    }

    updated.splice(index, 1);
    setCampagna({ ...campagna, mostri: updated });
  };

  const fetchIncontri = async () => {
    const snapshot = await getDocs(
      collection(firestore, `campagne/${campagna.id}/incontri`)
    );
    setIncontri(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    if (campagna.id) fetchIncontri();
  }, [campagna.id]);

  const aggiornaVillain = (index, campo, valore) => {
    const updated = [...(campagna.villain || [])];
    updated[index][campo] = valore;
    setCampagna({ ...campagna, villain: updated });
  };

  const rimuoviVillain = async (index) => {
    const updated = [...campagna.villain];
    const villain = updated[index];

    if (villain.id) {
      await eliminaDaArchivio("villain", villain.id);
    }

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

  const rimuoviPNG = async (index) => {
    const updated = [...campagna.png];
    const png = updated[index];

    if (png.id) {
      await eliminaDaArchivio("png", png.id);
    }

    updated.splice(index, 1);
    setCampagna({ ...campagna, png: updated });
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

  const rimuoviLuogo = async (index) => {
    const updated = [...campagna.luoghi];
    const luogo = updated[index];

    if (luogo.id) {
      await eliminaDaArchivio("luoghi", luogo.id);
    }

    updated.splice(index, 1);
    setCampagna({ ...campagna, luoghi: updated });
  };

  const nomeScenaDaID = (id) => {
    const scena = campagna.scene?.find((s) => s.id === id);
    return scena ? scena.titolo : id;
  };

  const salvaCampagna = async () => {
    try {
      const campagnaId = campagna.id || generateId();
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
        nuovoVillain.campagnaCollegata = campagnaSelezionata.id || campagnaSelezionata.nome;
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

  const generaCampagneComplete = async () => {
    setLoading(true);
    const tipi = [
      { tipo: "Campagna lunga", capitoli: 5, villain: 2, png: 8, mostri: 8 },
      { tipo: "Mini-campagna", capitoli: 3, villain: 1, png: 5, mostri: 5 },
      { tipo: "One-Shot", capitoli: 1, villain: 1, png: 3, mostri: 3 },
    ];
    const obiettivi = [
      "Recuperare l'artefatto 'La Clessidra di Gunthar', in grado di fermare il tempo per pochi minuti",
      "Scoprire il traditore",
      "Proteggere un PNG chiave",
      "Sconfiggere il villain principale",
      "Esplorare le antiche rovine della Torre di NorthUlia",
      "Negoziare una tregua tra le fila del clan barbarico dei 'Berber'",
      "Scoprire un segreto nascosto",
      "Salvare una città in pericolo",
    ];

    scene: [
      {
        titolo: `Scena ${idx + 1}-A`,
        testo: "Descrizione scena.",
        obiettivo: casuale(obiettivi),
        durata: rand(20, 60),
      },
      {
        titolo: `Scena ${idx + 1}-B`,
        testo: "Descrizione scena.",
        obiettivo: casuale(obiettivi),
        durata: rand(20, 60),
      },
      {
        titolo: `Scena ${idx + 1}-C`,
        testo: "Descrizione scena.",
        obiettivo: casuale(obiettivi),
        durata: rand(20, 60),
      },
    ];

    const ambientazioni = [
      "Forgotten Realms",
      "Eberron",
      "Ravenloft",
      "Exandria",
      "Dark Sun",
      "Spelljammer",
      "Planescape",
    ];
    const campagne = [];

    for (let i = 0; i < 6; i++) {
      const config = tipi[i % tipi.length];
      const titolo = generaTitoloCasuale();
      const hook = generaHookCasuale();
      const blurb = generaBlurbCasuale();
      const prologo = `Prologo: ${generaPrologoCasuale()}`;
      const finale = `Finale: ${generaFinaleCasuale()}`;

      // Capitoli con 2 scene per capitolo
      const capitoli = Array.from({ length: config.capitoli }, (_, idx) => ({
        titolo: `Capitolo ${idx + 1}`,
        descrizione: `Evento narrativo ${idx + 1}`,
        scene: [
          { titolo: `Scena ${idx + 1}-A`, testo: "Descrizione scena." },
          { titolo: `Scena ${idx + 1}-B`, testo: "Descrizione scena." },
        ],
      }));

      const villain = await Promise.all(
        Array.from({ length: config.villain }, generaVillainCasuale)
      );
      const png = await Promise.all(
        Array.from({ length: config.png }, generaPNGCompleto)
      );
      const mostri = await Promise.all(
        Array.from({ length: config.mostri }, generaMostroCasuale)
      );
      const luoghi = generaLuoghiCasuali(3);
      const enigmi = generaEnigmiCasuali(2);

      // Distribuzione collegamenti
      const {
        villain: villainCol,
        png: pngCol,
        mostri: mostriCol,
        enigmi: enigmiCol,
      } = distribuisciCollegamenti(capitoli, villain, png, mostri, enigmi);

      const lootVillain = generaLootCasuale(2); // Loot raro per villain boss
      const lootIncontri = generaLootCasuale(2); // Loot generico per incontri medi

      villain[villain.length - 1].loot = lootVillain; // Assegna loot al boss finale
      const incontri = generaIncontri(capitoli, villainCol, pngCol, mostriCol);
      if (incontri[1]) incontri[1].loot = generaLootCasuale(2);

      campagne.push({
        titolo,
        tipo: config.tipo,
        stato: "Bozza",
        ambientazione: casuale(ambientazioni),
        durataStimata: config.capitoli * 2,
        durataTipo: "sessioni",
        hookNarrativo: hook,
        blurb,
        prologo,
        finale,
        capitoli,
        villain: villainCol,
        png: pngCol,
        mostri: mostriCol,
        luoghi,
        enigmi: enigmiCol,
        incontri,
        loot: {
          villain: lootVillain,
          incontri: lootIncontri,
        },
      });
    }

    setCampagneGenerate(campagne);
    setLoading(false);
  };

  function generaDatiCampagna(campagna) {
  if (campagna.pngCoinvolti) {
    campagna.pngCoinvolti.forEach(p => salvaPNGFirestore(p));
  }
  if (campagna.villain) {
    salvaVillainFirestore(campagna.villain);
  }
  if (campagna.mostri) {
    campagna.mostri.forEach(m => salvaMostroFirestore(m));
  }
  alert("PNG, Villain e Mostri generati con successo!");
}

  const generaFinaleCasuale = () => {
    const finali = [
      "La battaglia finale si avvicina ed il destino del mondo è in gioco. I nostri eroi dovranno affrontare il loro passato e le loro paure.",
      "Un sacrificio inaspettato cambierà il corso della storia. La vittoria avrà un prezzo.",
      "La verità sarà svelata, e le alleanze saranno messe alla prova. Solo i più forti sopravvivranno.",
      "Un antico male si risveglia e solo gli eroi più audaci possono affrontarlo. Ma forse la luce è destinata a spegnersi...",
      "Un'ultima speranza si fa strada nell'oscurità, ma il tempo sta per scadere.",
      "Il destino del mondo è appeso a un filo. I nostri eroi dovranno fare una scelta impossibile.",
    ];
    return casuale(finali);
  };

  const generaPrologoCasuale = () => {
    const prologhi = [
      "Un oscuro presagio si avvicina, e solo gli eroi più audaci possono affrontarlo.",
      "Un antico male si risveglia, minacciando di inghiottire il mondo.",
      "Un mistero avvolge la terra, e solo i più coraggiosi possono svelarlo.",
      "Un destino intrecciato con il passato attende coloro che osano sfidarlo.",
      "Un'epica avventura inizia con un semplice gesto, ma le conseguenze saranno immense.",
      "Un segreto dimenticato si risveglia, e il tempo stringe per fermarlo.",
    ];
    return casuale(prologhi);
  };

  /* Funzioni di generazione casuale villain */
  const generaVillainCasuale = async () => {
    const getRaces = async () => {
      if (racesCache.length === 0) {
        const res = await fetch("https://www.dnd5eapi.co/api/races");
        const data = await res.json();
        racesCache = data.results;
      }
      return racesCache;
    };
    const getClasses = async () => {
      if (classesCache.length === 0) {
        const res = await fetch("https://www.dnd5eapi.co/api/classes");
        const data = await res.json();
        classesCache = data.results;
      }
      return classesCache;
    };

    const classe = casuale(await getClasses()).index;
    const domini = ["Morte", "Guerra", "Inganno", "Tempesta", "Conoscenza"];
    const sottoclassi = [
      "Necromante",
      "Ombra",
      "Evocatore",
      "Distruttore",
      "Occultista",
    ];
    const razza = casuale(await getRaces()).index;
    const livello = rand(5, 10);

    // Nome e dettagli base
    const villain = {
      nome: generaNomeCasuale(),
      razza,
      classe,
      livello,
      frase: "La luce è destinata a spegnersi...",
      motivazione: "Vendetta contro gli dei",
      scopo: "Aprire un portale oscuro",
      magia: false,
      incantesimi: [],
    };

    // Controlla se la classe è magica
    const spellcastingRes = await fetch(
      `https://www.dnd5eapi.co/api/classes/${classe}/spellcasting`
    );
    if (!spellcastingRes.ok) return villain;

    const spellcastingData = await spellcastingRes.json();
    villain.magia = true;

    villain.dominio = `Dominio della ${casuale(domini)}`;
    villain.sottoclasse = casuale(sottoclassi);
    villain.incantesimiPrincipali = villain.incantesimi
      .slice(0, 3)
      .map((sp) => sp.name);

    const stat = spellcastingData.spellcasting_ability.index;
    const modStat = rand(2, 5);
    const maxIncantesimi =
      spellcastingData.spellcasting_type === "known"
        ? 4 + Math.floor(livello / 2)
        : modStat + livello;

    // Carica incantesimi in cache se vuota
    const loadAllSpells = async () => {
      if (allSpellsCache.length === 0) {
        console.log("Caricamento incantesimi in cache...");
        const spellsList = await fetch(
          "https://www.dnd5eapi.co/api/spells"
        ).then((r) => r.json());
        const dettagliPromises = spellsList.results.map((s) =>
          fetch(`https://www.dnd5eapi.co${s.url}`).then((r) => r.json())
        );
        allSpellsCache = await Promise.all(dettagliPromises);
        console.log(
          `Cache incantesimi popolata con ${allSpellsCache.length} incantesimi.`
        );
      }
      return allSpellsCache;
    };

    const allSpells = await loadAllSpells();
    const filtrati = allSpells.filter(
      (sp) => sp.level <= livello && sp.classes.some((c) => c.index === classe)
    );

    villain.incantesimi = filtrati
      .sort(() => 0.5 - Math.random())
      .slice(0, maxIncantesimi)
      .map((sp) => ({
        name: sp.name,
        level: sp.level,
        school: sp.school.name,
        range: sp.range,
        duration: sp.duration,
        components: sp.components,
        desc: sp.desc?.[0] || "",
      }));

    return villain;
  };

  const generaPNGCompleto = async () => {
    const getRaces = async () => {
      if (racesCache.length === 0) {
        const res = await fetch("https://www.dnd5eapi.co/api/races");
        const data = await res.json();
        racesCache = data.results;
      }
      return racesCache;
    };
    const getClasses = async () => {
      if (classesCache.length === 0) {
        const res = await fetch("https://www.dnd5eapi.co/api/classes");
        const data = await res.json();
        classesCache = data.results;
      }
      return classesCache;
    };

    const classi = await getClasses();
    const ruoliNarrativi = [
      "Guida",
      "Traditore",
      "Contatto",
      "Mentore",
      "Alleato Temporaneo",
      "Rivale",
      "Sfidante",
      "Guardiano",
      "Guardia cittadina",
      "Saggio",
      "Bibliotecario",
      "Mercante",
      "Artigiano",
      "Cacciatore di taglie",
      "Mago errante",
    ];
    return {
      nome: generaNomeCasuale(),
      razza: casuale(await getRaces()).index,
      classe: casuale(classi).index,
      livello: rand(1, 8),
      tipo: "Non Comune",
      ruoloNarrativo: casuale(ruoliNarrativi),
    };
  };

  // Mostro
  const generaMostroCasuale = async () => {
    if (monstersCache.length === 0) {
      const res = await fetch("https://www.dnd5eapi.co/api/monsters");
      const data = await res.json();
      monstersCache = data.results;
    }
    const random = casuale(monstersCache);
    const dettagli = await fetch(`https://www.dnd5eapi.co${random.url}`).then(
      (r) => r.json()
    );
    return {
      nome: dettagli.name,
      tipo: dettagli.type,
      pf: dettagli.hit_points,
      ca: dettagli.armor_class,
      gs: dettagli.challenge_rating,
    };
  };
  // Luoghi (statico)
  const generaLuoghiCasuali = (count) => {
    const NOMI = [
      "Il Faro delle Ombre",
      "Bosco delle Nebbie",
      "Fortezza di Sangue",
      "Taverna del Corvo",
    ];
    const DESCR = [
      "Un luogo avvolto da misteri e leggende dimenticate.",
      "Le sue mura trasudano memorie di guerre passate.",
      "Un rifugio sicuro... o una trappola mortale.",
    ];
    const TIPI = ["Foresta", "Rovina", "Taverna", "Castello"];
    const PERICOLI = [
      "Trappole",
      "Creature Selvagge",
      "Incantesimi Maledetti",
      "Illusioni Pericolose",
      "Aberrazioni",
      "Mostro",
      "Ostacolo Ambientale",
      "Nessuno",
    ];
    return Array.from({ length: count }, () => ({
      nome: casuale(NOMI),
      tipo: casuale(TIPI),
      descrizione: casuale(DESCR),
      pericolo: casuale(PERICOLI),
    }));
  };

  // Enigmi (statico)
  const generaEnigmiCasuali = (count) => {
    const ENIGMI = [
      {
        titolo: "Statue che parlano",
        tipo: "Indovinello",
        descrizione: "Tre statue indicano tre porte, solo una è sicura.",
      },
      {
        titolo: "Piastre a pressione",
        tipo: "Trappola",
        descrizione: "Piastrelle che crollano se calpestate male.",
      },
      {
        titolo: "Le leve segrete",
        tipo: "Puzzle",
        descrizione: "Cinque leve, solo una apre la porta giusta.",
      },
    ];
    return Array.from({ length: count }, () => casuale(ENIGMI));
  };

  // Distribuisce collegamenti tra scene ed entità
  const distribuisciCollegamenti = (capitoli, villain, png, mostri, enigmi) => {
    const scene = capitoli.flatMap((cap) => cap.scene || []);

    // Villain → ultima scena ultimo capitolo
    if (villain.length > 0 && scene.length > 0) {
      villain.forEach((v, i) => {
        const targetScene =
          scene[scene.length - 1 - i] || scene[scene.length - 1];
        v.sceneAssociata = targetScene.titolo;
      });
    }

    // PNG → prime scene di alcuni capitoli
    png.forEach((p, i) => {
      const idx = i % scene.length;
      p.sceneAssociata = scene[idx].titolo;
    });

    // Mostri → scene intermedie
    mostri.forEach((m, i) => {
      const idx = (i + 1) % scene.length;
      m.sceneAssociata = scene[idx].titolo;
    });

    // Enigmi → prime scene di capitoli intermedi
    enigmi.forEach((e, i) => {
      const idx = (i + 1) % scene.length;
      e.sceneAssociata = scene[idx].titolo;
    });

    return { villain, png, mostri, enigmi };
  };

  const calcolaDifficolta = (gsTotale, livelloGruppo) => {
    if (gsTotale <= livelloGruppo / 2) return "Facile";
    if (gsTotale <= livelloGruppo) return "Medio";
    return "Difficile";
  };

  // Genera incontri automatici
  const generaIncontri = (capitoli, villain, png, mostri) => {
    const scene = capitoli.flatMap((cap) => cap.scene || []);
    if (scene.length === 0) return [];

    const livelloGruppo = Math.max(
      1,
      Math.floor(
        (png.reduce((sum, p) => sum + (p.livello || 1), 0) +
          villain.reduce((sum, v) => sum + (v.livello || 5), 0)) /
          (png.length + villain.length || 1)
      )
    );

    const incontri = [];

    // Incontro narrativo
    incontri.push({
      titolo: "Dialoghi e Segreti",
      descrizione: "Un incontro carico di tensione sociale e segreti nascosti.",
      difficolta: "Facile",
      pngCoinvolti: png.slice(0, 2).map((p) => p.nome),
      villainCoinvolti: [],
      mostriCoinvolti: [],
      sceneCollegate: [scene[0].titolo],
    });

    // Incontro di combattimento
    const mostriComb = mostri.slice(0, 2);
    const gsTotaleComb = mostriComb.reduce((sum, m) => sum + (m.gs || 1), 0);
    incontri.push({
      titolo: "Agguato nella Nebbia",
      descrizione: "Mostri sbucano dall'oscurità, pronti a tendere un agguato.",
      difficolta: calcolaDifficolta(gsTotaleComb, livelloGruppo),
      pngCoinvolti: [],
      villainCoinvolti: [],
      mostriCoinvolti: mostriComb.map((m) => m.nome),
      sceneCollegate: [scene[Math.floor(scene.length / 2)].titolo],
    });

    // Incontro Boss
    const villainBoss = villain[villain.length - 1];
    const mostroBoss = mostri[mostri.length - 1];
    const gsTotaleBoss = (villainBoss.livello / 2 || 3) + (mostroBoss.gs || 1);
    incontri.push({
      titolo: "Scontro Finale",
      descrizione: "Il villain rivela il suo piano. È il momento della verità.",
      difficolta: calcolaDifficolta(gsTotaleBoss, livelloGruppo),
      pngCoinvolti: [],
      villainCoinvolti: [villainBoss.nome],
      mostriCoinvolti: [mostroBoss.nome],
      sceneCollegate: [scene[scene.length - 1].titolo],
    });
    if (incontri[incontri.length - 1].difficolta === "Facile") {
      incontri[incontri.length - 1].loot = generaLootCasuale(1, "Comune");
    } else if (incontri[incontri.length - 1].difficolta === "Medio") {
      incontri[incontri.length - 1].loot = generaLootCasuale(2, "Non Comune");
    } else {
      incontri[incontri.length - 1].loot = [
        ...generaLootCasuale(1, "Raro"),
        ...generaLootCasuale(1, "Non Comune"),
      ];
    }

    return incontri;
  };

  function autoriempiCampagna(campagna) {
  setCampagna({
  titolo: campagna.titolo || "",
  tipo: campagna.tipo || "",
  stato: campagna.stato || "Bozza",
  ambientazione: campagna.ambientazione || "",
  obiettivo: campagna.obiettivo || "",
  hookNarrativo: campagna.hookNarrativo || "",
  tagNarrativi: campagna.tagNarrativi || [],
  blurb: campagna.blurb || "",
  durataStimata: campagna.durata || "",
  durataTipo: campagna.durataTipo || "sessioni",
  prologo: campagna.prologo || "",
  finale: campagna.finale || "",
  capitoli: campagna.atti || [],
  villain: campagna.villain ? [campagna.villain] : [],
  png: campagna.pngCoinvolti || [],
  mostri: campagna.mostri || [],
  luoghi: campagna.luoghi || [],
  incontri: campagna.incontri || campagna.icontri || [],
  media: campagna.media || {},
});
if (campagnaPredefinita.villain && !campagna.villain) {
  setCampagna(prev => ({ ...prev, villain: campagnaPredefinita.villain }));
}

if (campagnaPredefinita.blurb) {
  setCampagna(prev => ({ ...prev, blurb: campagnaPredefinita.blurb }));
}

if (campagnaPredefinita.mostri) {
  setCampagna(prev => ({ ...prev, mostri: campagnaPredefinita.mostri }));
}
if (campagnaPredefinita.png) {
  setCampagna(prev => ({ ...prev, png: campagnaPredefinita.png }));
}
if (campagnaPredefinita.pngCoinvolti) {
  setCampagna(prev => ({ ...prev, png: campagnaPredefinita.pngCoinvolti }));
}
if (campagnaPredefinita.luoghi) {
  setCampagna(prev => ({ ...prev, luoghi: campagnaPredefinita.luoghi }));
}
if (campagnaPredefinita.enigmi) {
  setCampagna(prev => ({ ...prev, enigmi: campagnaPredefinita.enigmi }));
}
if (campagnaPredefinita.incontri) {
  setCampagna(prev => ({ ...prev, incontri: campagnaPredefinita.incontri }));
}
if (campagnaPredefinita.blurb) {
  setCampagna(prev => ({ ...prev, blurb: campagnaPredefinita.blurb }));
}
if (campagnaPredefinita.obiettivo) {
  setCampagna(prev => ({ ...prev, obiettivo: campagnaPredefinita.obiettivo }));
}
if (campagnaPredefinita.finale) {
  setCampagna(prev => ({ ...prev, finale: campagnaPredefinita.finale }));
}
if (campagnaPredefinita.mostri) {
  setCampagna(prev => ({ ...prev, mostri: campagnaPredefinita.mostri }));
}
}

  useEffect(() => {
  if (campagnaPredefinita) {
    const campagna = campagnePredefinite.find(
      c => c.titolo === campagnaPredefinita
    );
    if (campagna) {
      autoriempiCampagna(campagna); // puoi anche spostare qui la logica
      generaDatiCampagna(campagna);
      setCampagnaPredefinitaSelezionata(true);
    }
  }
}, [campagnaPredefinita]);

useEffect(() => {
  if (
    campagnaSelezionata &&
    campagnaSelezionata.villainPredefinito &&
    !villainGenerato
  ) {
    generaVillainConDati(campagnaSelezionata.villainPredefinito);
  }
}, [campagnaSelezionata]);

const aggiornaMostri = (index, updatedMostro) => {
  const nuovi = [...campagna.mostri];
  nuovi[index] = updatedMostro;
  setCampagna(prev => ({ ...prev, mostri: nuovi }));
};

const generaVillainConDati = async (datiNarrativi) => {
  const nuovoVillain = await generaVillain();

  // Aggiunta narrativa dalla campagna predefinita
  nuovoVillain.narrativa = {
    hook: datiNarrativi.hook || "",
    dialogo: datiNarrativi.dialogo || "",
    scopo: datiNarrativi.scopo || "",
    piano: datiNarrativi.piano || "",
    motivazione: datiNarrativi.motivazione || "",
    scenaApparizione: datiNarrativi.scenaApparizione || "",
  };

  // Collegamento automatico alla campagna
  nuovoVillain.campagnaCollegata = campagnaSelezionata?.id || campagnaSelezionata?.nome;

  // Salva in archivio
  await salvaInArchivio("villain", nuovoVillain);

  // Salva nella campagna attuale
  setCampagna(prev => ({
    ...prev,
    villain: nuovoVillain,
  }));

  // Stato locale
  setVillainCreato(nuovoVillain);
  setVillainGenerato(true);
};

useEffect(() => {
  if (
    campagnaSelezionata &&
    campagnaSelezionata.pngPredefiniti &&
    !pngGenerati
  ) {
    generaPNGPredefiniti(campagnaSelezionata.pngPredefiniti);
  }
}, [campagnaSelezionata]);


const generaPNGPredefiniti = async (listaPng) => {
  const pngCreati = [];

  for (const dati of listaPng) {
    const nuovoPNG = await generaPNG(dati.tipo || "comune");

    nuovoPNG.nome = dati.nome;
    nuovoPNG.razza = dati.razza || "Umano";
    nuovoPNG.mestiere = dati.mestiere || "";
    nuovoPNG.relazioneConPG = dati.relazione || "";
    nuovoPNG.collegamentoNarrativo = dati.collegamentoNarrativo || "";
    nuovoPNG.campagnaCollegata = campagnaSelezionata?.id || campagnaSelezionata?.nome;

    await salvaInArchivio("png", nuovoPNG);
    pngCreati.push(nuovoPNG);
  }

  setCampagna(prev => ({
    ...prev,
    png: pngCreati,
  }));

  setPngGenerati(true);
};


  const renderTab = () => {
    switch (tab) {
      case "Generale":
        return (
          <div className="tab-generale">
            <div className="info-campagna">
            <label>Titolo</label>
            <input
              type="text"
              value={campagna.titolo || ""}
              onChange={(e) =>
                setCampagna((prev) => ({ ...prev, titolo: e.target.value }))
              }
              disabled={campagnaPredefinitaSelezionata}
            />

            <label>Tipo di avventura</label>
            <input
              type="text"
              value={campagna.tipo || ""}
              onChange={(e) =>
                setCampagna((prev) => ({ ...prev, tipo: e.target.value }))
              }
              disabled={campagnaPredefinitaSelezionata}
            />

            <label>Ambientazione</label>
            <input
              type="text"
              value={campagna.ambientazione || ""}
              onChange={(e) =>
                setCampagna((prev) => ({ ...prev, ambientazione: e.target.value }))
              }
              disabled={campagnaPredefinitaSelezionata}
            />

            <label>Durata stimata</label>
            <input
              type="text"
              value={campagna.durataStimata || ""}
              onChange={(e) =>
                setCampagna((prev) => ({ ...prev, durataStimata: e.target.value }))
              }
              disabled={campagnaPredefinitaSelezionata}
            />

            <label>Livello consigliato</label>
            <input
              type="text"
              value={campagna.livelloConsigliato || ""}
              onChange={(e) =>
                setCampagna((prev) => ({ ...prev, livelloConsigliato: e.target.value }))
              }
              disabled={campagnaPredefinitaSelezionata}
            />

            <label>Difficoltà</label>
            <select
              value={campagna.difficoltà || ""}
              onChange={(e) =>
                setCampagna((prev) => ({ ...prev, difficoltà: e.target.value }))
              }
              disabled={campagnaPredefinitaSelezionata}
            >
              <option value="">-- Seleziona --</option>
              <option value="Bassa">Bassa</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>

            

            <label>Tag tematici</label>
            <input
              type="text"
              placeholder="Separati da virgole"
              value={(campagna.tagTematici || []).join(", ")}
              onChange={(e) =>
                setCampagna((prev) => ({
                  ...prev,
                  tagTematici: e.target.value.split(",").map((t) => t.trim()),
                }))
              }
              disabled={campagnaPredefinitaSelezionata}
            />
            </div>
            <label>Obiettivo</label>
            <textarea
              rows={6}
              value={campagna.obiettivo || ""}
              onChange={(e) =>
                setCampagna((prev) => ({ ...prev, obiettivo: e.target.value }))
              }
              disabled={campagnaPredefinitaSelezionata}
            />

            <label>Blurb (descrizione evocativa)</label>
              <textarea
                rows={4}
                value={campagna.blurb || ""}
                onChange={(e) =>
                  setCampagna(prev => ({ ...prev, blurb: e.target.value }))
                }
                disabled={campagnaPredefinitaSelezionata}
              />
          </div>
        );

      case "Narrativa":
          return (
            <div className="tab-narrativa">
              <h4>Prologo</h4>
              <textarea
                rows={6}
                placeholder="Es. 'Un oscuro presagio si avvicina, e solo gli eroi più audaci possono affrontarlo.'"
                value={campagna.prologo || ""}
                onChange={(e) =>
                  setCampagna((prev) => ({ ...prev, prologo: e.target.value }))
                }
                disabled={campagnaPredefinitaSelezionata}
              />

              <h4>Atti</h4>
              {(campagna.atti || []).map((atto, i) => (
                <div key={i} className="box-atto">
                  <label>Titolo Atto</label>
                  <input
                    type="text"
                    value={atto.titolo || ""}
                    onChange={(e) => {
                      const atti = [...campagna.atti];
                      atti[i].titolo = e.target.value;
                      setCampagna((prev) => ({ ...prev, atti }));
                    }}
                    disabled={campagnaPredefinitaSelezionata}
                  />

                  <label>Obiettivo Narrativo</label>
                  <textarea
                    value={atto.obiettivo || ""}
                    onChange={(e) => {
                      const atti = [...campagna.atti];
                      atti[i].obiettivo = e.target.value;
                      setCampagna((prev) => ({ ...prev, atti }));
                    }}
                    disabled={campagnaPredefinitaSelezionata}
                  />

                  <h5>Capitoli</h5>
                  {(atto.capitoli || []).map((cap, j) => (
                    <div key={j} className="capitolo-box">
                      <label>Titolo Capitolo</label>
                      <input
                        type="text"
                        value={cap.titolo || ""}
                        onChange={(e) => {
                          const atti = [...campagna.atti];
                          atti[i].capitoli[j].titolo = e.target.value;
                          setCampagna((prev) => ({ ...prev, atti }));
                        }}
                      />

                      <label>Eventi chiave</label>
                      <textarea
                        value={(cap.eventi || []).join("\n")}
                        onChange={(e) => {
                          const atti = [...campagna.atti];
                          atti[i].capitoli[j].eventi = e.target.value
                            .split("\n")
                            .map((ev) => ev.trim())
                            .filter(Boolean);
                          setCampagna((prev) => ({ ...prev, atti }));
                        }}
                      />

                      <button
                        onClick={() => {
                          const atti = [...campagna.atti];
                          atti[i].capitoli.splice(j, 1);
                          setCampagna((prev) => ({ ...prev, atti }));
                        }}
                      >
                        🗑️ Rimuovi Capitolo
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const atti = [...campagna.atti];
                      const nuovoCapitolo = { titolo: "", eventi: [] };
                      if (!atti[i].capitoli) atti[i].capitoli = [];
                      atti[i].capitoli.push(nuovoCapitolo);
                      setCampagna((prev) => ({ ...prev, atti }));
                    }}
                    disabled={campagnaPredefinitaSelezionata}
                  >
                    ➕ Aggiungi Capitolo
                  </button>

                  <hr />
                </div>
              ))}

              <button
                onClick={() => {
                  const nuovi = [...(campagna.atti || [])];
                  nuovi.push({ titolo: "", obiettivo: "", capitoli: [] });
                  setCampagna((prev) => ({ ...prev, atti: nuovi }));
                }}
                disabled={campagnaPredefinitaSelezionata}
              >
                ➕ Aggiungi Atto
              </button>

              <h4>Finale</h4>
              <textarea
                rows={4}
                placeholder="Es. 'La battaglia finale si avvicina ed il destino del mondo è in gioco. I nostri eroi dovranno affrontare il loro passato e le loro paure.'"
                value={campagna.finale || ""}
                onChange={(e) =>
                  setCampagna((prev) => ({ ...prev, finale: e.target.value }))
                }
                disabled={campagnaPredefinitaSelezionata}
              />
            </div>
          );

        const aggiornaCapitolo = (index, campo, valore) => {
          setCampagna((prev) => {
            const nuovi = [...prev.capitoli];
            nuovi[index][campo] = valore;
            return { ...prev, capitoli: nuovi };
          });
        };

        const aggiungiCapitolo = () => {
          const nuovo = {
            titolo: "",
            descrizione: "",
            scene: [],
          };
          setCampagna(prev => ({
  ...prev,
  capitoli: [...(prev.capitoli || []), nuovo]
}));
        };

        const rimuoviCapitolo = (index) => {
          const nuovi = [...(campagna.capitoli || [])];
          nuovi.splice(index, 1);
          setCampagna(prev => ({
  ...prev,
  capitoli: [...(prev.capitoli || []), nuovo]
}));
        };

        return (
          <div className="tab-content narrativa-tab">
            <label>Prologo</label>
            <textarea
              placeholder="Testo introduttivo..."
              value={campagna.prologo || ""}
              disabled={campagnaPredefinitaSelezionata}
              onChange={(e) => setCampagna(prev => ({ ...prev, prologo: e.target.value }))}
            />
            <hr />
            <h3>📚 Atti</h3>
            {campagna.capitoli?.map((cap, i) => (
              <div key={i} className="blocco-capitolo">
                
                <input
                  value={cap.titolo}
                  disabled={campagnaPredefinitaSelezionata}
                  onChange={(e) =>
                    aggiornaCapitolo(i, "titolo", e.target.value)
                  }
                />
                <br />
                <label>Descrizione</label>
                <textarea
                  value={cap.descrizione}
                  disabled={campagnaPredefinitaSelezionata}
                  onChange={(e) =>
                    aggiornaCapitolo(i, "descrizione", e.target.value)
                  }
                />
              </div>
            ))}
            <button onClick={aggiungiCapitolo}>➕ Aggiungi Capitolo</button>
            <h4>⚠️ Twist Narrativi</h4>
            {(campagna.twistNarrativi || []).map((twist, i) => (
              <textarea
                key={i}
                value={twist}
                disabled={campagnaPredefinitaSelezionata}
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
                disabled={campagnaPredefinitaSelezionata}
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
                disabled={campagnaPredefinitaSelezionata}
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
              disabled={campagnaPredefinitaSelezionata}
              value={campagna.finale || ""}
              onChange={(e) => setCampagna("finale", e.target.value)}
            />
          </div>
        );

      
        return (
          <div className="tab-content">
            <h3>👿 Villain della Campagna</h3>

            {/* Pulsanti azione */}
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => {
                  setMostraModaleVillain(true);
                  setVillainCollegato(campagna.titolo || ""); // campagna attuale
                }}
              >
                + Crea Villain legato alla Campagna
              </button>
              <button onClick={apriGeneratoreVillain}>+ Crea Villain</button>
              <button onClick={apriArchivioVillain}>
                + Scegli dall’Archivio
              </button>
            </div>

            {/* Lista Villain collegati */}
            {campagna.villain && (
              <VillainCard villain={campagna.villain} />
            )}
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

            {mostraModaleVillain && (
              <ModaleVillain
                isOpen={mostraModaleVillain}
                onClose={() => setMostraModaleVillain(false)}
                villain={villainAttivo}
                onSave={(villainCreato) => {
                  setCampagna(prev => ({ ...prev, villain: villainCreato }));
                  setShowModaleVillain(false);
                }}
                collegaAllaCampagna={true}
                collegamentoCampagna={campagnaIdAttiva}

              />
            )}
          </div>
        );

      case "Villain":
        return (
          <div className="tab-villain">

            {campagna.villain ? (
              <div className="villain-card">
                <h4>{campagna.villain.nome} —</h4>
                <p>
                  <strong>Razza:</strong> {campagna.villain.razza}<br />
                  <strong>Classe:</strong> {campagna.villain.className || campagna.villain.classe} <br />
                  <strong>Livello:</strong> {campagna.villain.livello}
                </p>
                <p><strong>🎯 Obiettivo:</strong> {campagna.villain.obiettivo}</p>
                <p><strong>📍 Luogo chiave:</strong> {campagna.villain.luogoChiave}</p>
                <p><strong>🧠 Motivazione:</strong> {campagna.villain.motivazione}</p>
                <p><strong>🗣️ Comportamento:</strong> {campagna.villain.comportamento}</p>
                <img
                  src={campagna.villain.immagine}
                  alt="Villain"
                  className="villain-img"
                  style={{ maxWidth: "250px", borderRadius: "6px", marginTop: "1rem" }}
                />
                {!campagnaPredefinitaSelezionata && (
                  <>
                    <button onClick={() => setShowModaleVillain(true)}>✏️ Modifica</button>
                    <button onClick={() => {
                      setCampagna(prev => ({ ...prev, villain: null }));
                    }}>🗑️ Rimuovi</button>
                  </>
                )}
              </div>
            ) : (
              !campagnaPredefinitaSelezionata && (
                <button onClick={() => setShowModaleVillain(true)}>
                  ➕ Crea Villain
                </button>
              )
            )}

            {showModaleVillain && (
              <ModaleVillain
                initialData={campagna.villain}
                onSave={(villainCreato) => {
                  setCampagna(prev => ({ ...prev, villain: villainCreato }));
                  setShowModaleVillain(false);
                }}
                onClose={() => setShowModaleVillain(false)}
                collegaAllaCampagna={true}
              />
            )}
          </div>
        );

      case "PNG":
        return (
          <div className="tab-png">
            {(campagna.png || []).map((png, i) => (
              <div key={i} className="png-card">
                <h4>{png.nome} —</h4>
                <p><strong>Razza:</strong> {png.razza}</p>
                <p><strong>Mestiere:</strong> {png.mestiere || "—"}</p>
                <p><strong>Classe:</strong> {png.classe || "—"}</p>
                <p><strong>Livello:</strong> {png.livello || "—"}</p>
                <p><strong>Tipo:</strong> {png.tipo || "—"}</p>
                <p><strong>Ruolo Narrativo:</strong> {png.ruoloNarrativo || "—"}</p>
                <p><strong>Relazione con i PG:</strong> {png.relazione || "—"}</p>
                <p><strong>Collegamento narrativo:</strong> {png.collegamentoNarrativo || "—"}</p>
                {png.immagine && (
                  <img
                    src={png.immagine}
                    alt={png.nome}
                    style={{ maxWidth: "200px", marginTop: "10px", borderRadius: "6px" }}
                  />
                )}
                {!campagnaPredefinitaSelezionata && (
                  <>
                    <button onClick={() => {
                      setPngSelezionato(png);
                      setPngIndexCorrente(i);
                      setShowPng(true);
                    }}>
                      ✏️ Modifica
                    </button>
                    <button onClick={() => {
                      const nuovi = [...campagna.png];
                      nuovi.splice(i, 1);
                      setCampagna(prev => ({ ...prev, png: nuovi }));
                    }}>
                      🗑️ Rimuovi
                    </button>
                  </>
                )}
                <hr />
              </div>
            ))}

            {!campagnaPredefinitaSelezionata && (
              <button onClick={() => {
                setPngSelezionato(null);
                setPngIndexCorrente(-1);
                setShowPng(true);
              }}>
                ➕ Aggiungi PNG
              </button>
            )}

            {showPng && (
              <ModalePNG
                initialData={pngSelezionato}
                onSave={(dati) => {
                  const nuovi = [...(campagna.png || [])];
                  if (pngIndexCorrente >= 0) {
                    nuovi[pngIndexCorrente] = dati;
                  } else {
                    nuovi.push(dati);
                  }
                  setCampagna(prev => ({ ...prev, png: nuovi }));
                  setShowPng(false);
                }}
                onClose={() => setShowPng(false)}
                collegaAllaCampagna={true}
              />
            )}
          </div>
        );      

      case "Luoghi":
        return (
          <div className="tab-luoghi">
            {(campagna.luoghi || []).map((luogo, i) => (
              <div key={i} className="luogo-card">
                <h4>{luogo.nome}</h4>
                <p><strong>Tipo:</strong> {luogo.tipo || "—"}</p>
                <p>{luogo.descrizione || "Nessuna descrizione fornita."}</p>

                {luogo.immagine && (
                  <div className="img-container">
                    <img
                      src={luogo.immagine}
                      alt={luogo.nome}
                      className="img-miniatura"
                    />
                    <div className="img-hover-overlay">
                      <img
                        src={luogo.immagine}
                        alt={luogo.nome}
                        className="img-ingrandita"
                      />
                    </div>
                  </div>
                )}

                {!campagnaPredefinitaSelezionata && (
                  <>
                    <button onClick={() => {
                      setLuogoSelezionato(luogo);
                      setLuogoIndexCorrente(i);
                      setShowLuogo(true);
                    }}>
                      ✏️ Modifica
                    </button>
                    <button onClick={() => {
                      const nuovi = [...campagna.luoghi];
                      nuovi.splice(i, 1);
                      setCampagna(prev => ({ ...prev, luoghi: nuovi }));
                    }}>
                      🗑️ Rimuovi
                    </button>
                  </>
                )}

                <hr />
              </div>
            ))}

            {!campagnaPredefinitaSelezionata && (
              <button onClick={() => {
                setLuogoSelezionato(null);
                setLuogoIndexCorrente(-1);
                setShowLuogo(true);
              }}>
                ➕ Aggiungi Luogo
              </button>
            )}

            {showLuogo && (
              <ModaleLuogo
                initialData={luogoSelezionato}
                onSave={(luogoCreato) => {
                  const nuovi = [...(campagna.luoghi || [])];
                  if (luogoIndexCorrente >= 0) {
                    nuovi[luogoIndexCorrente] = luogoCreato;
                  } else {
                    nuovi.push(luogoCreato);
                  }
                  setCampagna(prev => ({ ...prev, luoghi: nuovi }));
                  setShowLuogo(false);
                }}
                onClose={() => setShowLuogo(false)}
                collegaAllaCampagna={true}
              />
            )}
          </div>
        );

      case "Mostri":
  return (
    <div className="tab-content tab-mostri">
      <h3>Mostri della Campagna</h3>
      {campagna.mostri?.map((mostro, i) => (
        <div key={i} className="card">
          <h4>{mostro.nome}</h4>
          <p><strong>Tipo:</strong> {mostro.tipo}</p>
          <p><strong>Grado di Sfida (GS):</strong> {mostro.gs}</p>
          <p><strong>Collegamento:</strong> {mostro.collegamentoNarrativo || "—"}</p>
          <button onClick={() => {
            setMostroSelezionato(mostro);
            setMostroIndexCorrente(i);
            setShowMostro(true);
          }}>✏️ Modifica</button>
          <button onClick={() => {
            const nuovi = [...campagna.mostri];
            nuovi.splice(i, 1);
            setCampagna(prev => ({ ...prev, mostri: nuovi }));
          }}>🗑️ Rimuovi</button>
        </div>
      ))}
      <button onClick={() => {
        setMostroSelezionato(null);
        setMostroIndexCorrente(-1);
        setShowMostro(true);
      }}>➕ Aggiungi Mostro</button>

      {showMostro && (
        <ModaleMostro
          initialData={mostroSelezionato}
          onSave={(datiMostro) => {
            if (mostroIndexCorrente === -1) {
              setCampagna(prev => ({
                ...prev,
                mostri: [...(prev.mostri || []), datiMostro],
              }));
            } else {
              aggiornaMostri(mostroIndexCorrente, datiMostro);
            }
            setShowMostro(false);
          }}
          onClose={() => setShowMostro(false)}
          collegaAllaCampagna={true}
        />
      )}
    </div>
  );

      case "Incontri":
        return (
          <div className="tab-incontri">
            {(campagna.incontri || []).map((incontro, i) => (
              <div key={i} className="incontro-card">
                <h4>{incontro.nome}</h4>
                <p><strong>📄 Descrizione:</strong> {incontro.descrizione}</p>
                <p><strong>🎭 PNG:</strong> {(incontro.png || []).join(", ") || "—"}</p>
                <p><strong>👹 Mostri:</strong> {(incontro.mostri || []).join(", ") || "—"}</p>
                <p><strong>😈 Villain:</strong> {(incontro.villain || []).join(", ") || "—"}</p>
                <p><strong>📚 Collegamento:</strong> {incontro.collegamento || "—"}</p>
                <p><strong>🎯 Esito:</strong> {incontro.esito || "—"}</p>

                {!campagnaPredefinitaSelezionata && (
                  <>
                    <button onClick={() => {
                      setIncontroSelezionato(incontro);
                      setIncontroIndex(i);
                      setShowModaleIncontro(true);
                    }}>
                      ✏️ Modifica
                    </button>
                    <button onClick={() => {
                      const nuovi = [...campagna.incontri];
                      nuovi.splice(i, 1);
                      setCampagna(prev => ({ ...prev, incontri: nuovi }));
                    }}>
                      🗑️ Rimuovi
                    </button>
                  </>
                )}

                <hr />
              </div>
            ))}

            {!campagnaPredefinitaSelezionata && (
              <button onClick={() => {
                setIncontroSelezionato(null);
                setIncontroIndex(-1);
                setShowModaleIncontro(true);
              }}>
                ➕ Aggiungi Incontro
              </button>
            )}

            {showModaleIncontro && (
              <ModaleIncontro
                initialData={incontroSelezionato}
                onSave={(i) => {
                  const nuovi = [...(campagna.incontri || [])];
                  if (incontroIndex >= 0) {
                    nuovi[incontroIndex] = i;
                  } else {
                    nuovi.push(i);
                  }
                  setCampagna(prev => ({ ...prev, incontri: nuovi }));
                  setShowModaleIncontro(false);
                }}
                onClose={() => setShowModaleIncontro(false)}
                atti={campagna.atti || []}
                listaPng={(campagna.png || []).map(p => p.nome)}
                listaMostri={(campagna.mostri || []).map(m => m.nome)}
                listaVillain={campagna.villain ? [campagna.villain.nome] : []}
              />
            )}
          </div>
        );

      case "Enigmi":
  return (
    <div className="tab-enigmi">
      {(campagna.enigmi || []).map((enigma, i) => (
        <div key={i} className="enigma-card">
          <h4>{enigma.nome || `Enigma ${i + 1}`}</h4>

          <p><strong>Tipo:</strong> {enigma.tipo}</p>
          <p><strong>Difficoltà:</strong> {enigma.difficoltà || "—"}</p>
          <p><strong>Descrizione:</strong><br />{enigma.descrizione}</p>
          {enigma.soluzione && (
            <p><strong>Soluzione:</strong> {enigma.soluzione}</p>
          )}

          {!campagnaPredefinitaSelezionata && (
            <>
              <button onClick={() => {
                setEnigmaSelezionato(enigma);
                setEnigmaIndex(i);
                setShowModaleEnigma(true);
              }}>
                ✏️ Modifica
              </button>
              <button onClick={() => {
                const nuovi = [...campagna.enigmi];
                nuovi.splice(i, 1);
                setCampagna(prev => ({ ...prev, enigmi: nuovi }));
              }}>
                🗑️ Rimuovi
              </button>
            </>
          )}

          <hr />
        </div>
      ))}

      {!campagnaPredefinitaSelezionata && (
        <button onClick={() => {
          setEnigmaSelezionato(null);
          setEnigmaIndex(-1);
          setShowModaleEnigma(true);
        }}>
          ➕ Aggiungi Enigma o Trappola
        </button>
      )}

      {showModaleEnigma && (
        <ModaleEnigma
          initialData={enigmaSelezionato}
          onSave={(e) => {
            const nuovi = [...(campagna.enigmi || [])];
            if (enigmaIndex >= 0) {
              nuovi[enigmaIndex] = e;
            } else {
              nuovi.push(e);
            }
            setCampagna(prev => ({ ...prev, enigmi: nuovi }));
            setShowModaleEnigma(false);
          }}
          onClose={() => setShowModaleEnigma(false)}
          collegaAllaCampagna={true}
        />
      )}
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
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <div className="predefinita-select">
  <label htmlFor="campagnaPredefinita">Campagna Predefinita:</label>
  <select
    id="campagnaPredefinita"
    value={campagnaPredefinita || ""}
    disabled={campagnaPredefinitaSelezionata}
    onChange={(e) => {
  const nome = e.target.value;
  const campagna = campagnePredefinite.find(c => c.titolo === nome || c.nome === nome);
  if (campagna) {
    setCampagnaPredefinita(nome);
    setCampagnaPredefinitaSelezionata(nome);
    autoriempiCampagna(campagna);
  }
}}

  >
    <option value="">— Seleziona una campagna —</option>
    {campagnePredefinite.map((c, i) => (
      <option key={i} value={c.titolo}>
        {c.titolo}
      </option>
    ))}
  </select>
  {campagnaPredefinita && (
    <button onClick={() => {
      setCampagnaPredefinita("");
      setCampagnaPredefinitaSelezionata(false);
    }}>
      🔄 Reset
    </button>
  )}
</div>

            {campagnaSelezionata && (
  <button
    className="reset-campagna-btn"
    onClick={() => {
      setCampagna({
        titolo: "",
        descrizione: "",
        ambientazione: "",
        durataStimata: "",
        livelloConsigliato: "",
        tagTematici: [],
        hookNarrativi: [],
        atti: [],
        villain: null,
        png: [],
        mostri: [],
        luoghi: []
      });
      setCampagnaSelezionata(null);
    }}
  >
    ❌ Reset Campagna
  </button>
)}

            <button onClick={onClose}>❌</button>
          </div>
        </div>
        {loading && (
          <div style={{ textAlign: "center", margin: "1rem" }}>
            <p>⏳ Generazione in corso... Attendere qualche secondo</p>
          </div>
        )}

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
        {campagnaSelezionata?.media?.immagineCopertina && (
  <div className="immagine-copertina-sfumata">
    <img src={campagnaSelezionata.media.immagineCopertina} alt="Copertina campagna" />
    <h2 className="titolo-campagna-overlay">{campagnaSelezionata.nome}</h2>
  </div>
)}

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

      {showCompendio && (
        <ModaleCompendioOneShot
          oneshotPredefinite={oneshotPredefinite}
          setShowCompendio={setShowCompendio}
        />
      )}

      {modalePNGNonComuneAperta && (
        <ModalePNGNonComune
          isOpen={modalePNGNonComuneAperta}
          onClose={() => setModalePNGNonComuneAperta(false)}
          collegaAllaCampagna={true}
          onSave={(nuovoPNG) => {
            setCampagna({
              ...campagna,
              png: [...(campagna.png || []), nuovoPNG],
            });
            setModalePNGNonComuneAperta(false);
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
      {showCompendio && (
        <ModaleCompendioOneShot
          onClose={() => setShowCompendio(false)}
          onSeleziona={(oneShot) => {
            applicaOneShot(oneShot);
            setShowCompendio(false);
          }}
        />
      )}

      {campagneGenerate.length > 0 && (
        <div
          className="campagne-grid"
          style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}
        >
          {campagneGenerate.map((c, i) => (
            <div
              key={i}
              className="campagna-card"
              style={{ border: "1px solid #ccc", padding: "1rem" }}
            >
              <h4>{c.titolo}</h4>
              <p>
                <strong>{c.tipo}</strong> — {c.ambientazione}
              </p>
              <p>
                <em>{c.hookNarrativo}</em>
              </p>
              <p>
                📚 Capitoli: {c.capitoli.length} | 👿 Villain:{" "}
                {c.villain.length} | 👤 PNG: {c.png.length} | 🧟 Mostri:{" "}
                {c.mostri.length}
              </p>
              <p>
                ⏳ Durata stimata: {c.durataStimata} {c.durataTipo}
              </p>

              {/* Anteprima loot */}
              {c.loot &&
                (c.loot.villain?.length > 0 || c.loot.incontri?.length > 0) && (
                  <p>
                    Loot Villain:{" "}
                    {c.loot.villain
                      ?.slice(0, 2)
                      .map((l) => `${l.nome} (${l.rarita})`)
                      .join(", ")}
                    <br />
                    Loot Incontri:{" "}
                    {c.loot.incontri
                      ?.slice(0, 2)
                      .map((l) => `${l.nome} (${l.rarita})`)
                      .join(", ")}
                  </p>
                )}

              <button onClick={() => setCampagna(c)}>
                📥 Importa in Editor
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ModaleCreaCampagna;
