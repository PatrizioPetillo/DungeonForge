import React, { useState, useEffect } from "react";
import CapitoloEditor from "./capitoloEditor";
import MostroAPISelector from "./mostroAPISelector";
import MostroManualeForm from "./mostroManualeForm";
import ModaleVillain from "../components/modali/modaleVillain";
import ModalePNG from "../components/modali/modalePNG";
import ModaleLuogo from "../components/modali/modaleLuogo";
import ModaleEnigma from "../components/modali/modaleEnigma";
import ModaleIncontro from "../components/modali/modaleIncontro";
import {
  generaNomeCasuale,
  generaCognomeCasuale,
  generaTitoloCasuale,
  generaHookCasuale,
  generaBlurbCasuale,
  generaLootCasuale,
  generaTesoroIncontro,
  generaTesoroCampagna,
  generaObiettivoScena,
  generaNomeLuogo,
  generaEquipBase,
  tiraStats,
  rand,
  casuale,
  shuffle
} from "../utils/generators";


import { collection, doc, setDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
import { generateId } from "../utils/idUtils";

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
  const [loading, setLoading] = useState(false);
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
const [campagneGenerate, setCampagneGenerate] = useState([]);

// Cache per le API
let racesCache = [];
let classesCache = [];
let monstersCache = [];
let allSpellsCache = [];


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
    { tipo: "One-Shot", capitoli: 1, villain: 1, png: 3, mostri: 3 }
  ];
  const obiettivi = [
  "Recuperare l'artefatto", "Scoprire il traditore", "Proteggere un PNG chiave", "Sconfiggere il villain principale",
  "Esplorare la rovina antica", "Negoziare una tregua", "Scoprire un segreto nascosto", "Salvare una città in pericolo"
];

scene: [
  { titolo: `Scena ${idx + 1}-A`, testo: "Descrizione scena.", obiettivo: casuale(obiettivi), durata: rand(20, 60) },
  { titolo: `Scena ${idx + 1}-B`, testo: "Descrizione scena.", obiettivo: casuale(obiettivi), durata: rand(20, 60) },
  { titolo: `Scena ${idx + 1}-C`, testo: "Descrizione scena.", obiettivo: casuale(obiettivi), durata: rand(20, 60) }
]


  const ambientazioni = ["Forgotten Realms", "Eberron", "Ravenloft", "Exandria"];
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
        { titolo: `Scena ${idx + 1}-B`, testo: "Descrizione scena." }
      ]
    }));

    const villain = await Promise.all(Array.from({ length: config.villain }, generaVillainCasuale));
    const png = await Promise.all(Array.from({ length: config.png }, generaPNGCompleto));
    const mostri = await Promise.all(Array.from({ length: config.mostri }, generaMostroCasuale));
    const luoghi = generaLuoghiCasuali(3);
    const enigmi = generaEnigmiCasuali(2);

    // Distribuzione collegamenti
    const { villain: villainCol, png: pngCol, mostri: mostriCol, enigmi: enigmiCol } =
      distribuisciCollegamenti(capitoli, villain, png, mostri, enigmi);

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
        incontri: lootIncontri
      }
    });
  }

  setCampagneGenerate(campagne);
  setLoading(false);
  


};

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
const sottoclassi = ["Necromante", "Ombra", "Evocatore", "Distruttore", "Occultista"];
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
    incantesimi: []
  };

  // Controlla se la classe è magica
    const spellcastingRes = await fetch(`https://www.dnd5eapi.co/api/classes/${classe}/spellcasting`);
  if (!spellcastingRes.ok) return villain;

  const spellcastingData = await spellcastingRes.json();
  villain.magia = true;
  
villain.dominio = `Dominio della ${casuale(domini)}`;
villain.sottoclasse = casuale(sottoclassi);
villain.incantesimiPrincipali = villain.incantesimi.slice(0, 3).map(sp => sp.name);

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
    const spellsList = await fetch("https://www.dnd5eapi.co/api/spells").then(r => r.json());
    const dettagliPromises = spellsList.results.map(s =>
      fetch(`https://www.dnd5eapi.co${s.url}`).then(r => r.json())
    );
    allSpellsCache = await Promise.all(dettagliPromises);
    console.log(`Cache incantesimi popolata con ${allSpellsCache.length} incantesimi.`);
  }
  return allSpellsCache;
};

  const allSpells = await loadAllSpells();
  const filtrati = allSpells.filter(sp =>
    sp.level <= livello && sp.classes.some(c => c.index === classe)
  );

  villain.incantesimi = filtrati
    .sort(() => 0.5 - Math.random())
    .slice(0, maxIncantesimi)
    .map(sp => ({
      name: sp.name,
      level: sp.level,
      school: sp.school.name,
      range: sp.range,
      duration: sp.duration,
      components: sp.components,
      desc: sp.desc?.[0] || ""
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
  const ruoliNarrativi = ["Guida", "Traditore", "Contatto", "Mentore", "Alleato Temporaneo", "Rivale", "Sfidante", "Guardiano", "Guardia cittadina", "Saggio", "Bibliotecario", "Mercante", "Artigiano", "Cacciatore di taglie", "Mago errante"];
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
  const dettagli = await fetch(`https://www.dnd5eapi.co${random.url}`).then(r => r.json());
  return {
    nome: dettagli.name,
    tipo: dettagli.type,
    pf: dettagli.hit_points,
    ca: dettagli.armor_class,
    gs: dettagli.challenge_rating
  };
};
// Luoghi (statico)
const generaLuoghiCasuali = (count) => {
  const NOMI = ["Il Faro delle Ombre", "Bosco delle Nebbie", "Fortezza di Sangue", "Taverna del Corvo"];
  const DESCR = [
    "Un luogo avvolto da misteri e leggende dimenticate.",
    "Le sue mura trasudano memorie di guerre passate.",
    "Un rifugio sicuro... o una trappola mortale."
  ];
  const TIPI = ["Foresta", "Rovina", "Taverna", "Castello"];
  const PERICOLI = ["Trappole", "Creature Selvagge", "Incantesimi Maledetti", "Illusioni Pericolose", "Aberrazioni", "Mostro", "Ostacolo Ambientale", "Nessuno"];
  return Array.from({ length: count }, () => ({
    nome: casuale(NOMI),
    tipo: casuale(TIPI),
    descrizione: casuale(DESCR),
    pericolo: casuale(PERICOLI)
  }));
};

// Enigmi (statico)
const generaEnigmiCasuali = (count) => {
  const ENIGMI = [
    { titolo: "Statue che parlano", tipo: "Indovinello", descrizione: "Tre statue indicano tre porte, solo una è sicura." },
    { titolo: "Piastre a pressione", tipo: "Trappola", descrizione: "Piastrelle che crollano se calpestate male." },
    { titolo: "Le leve segrete", tipo: "Puzzle", descrizione: "Cinque leve, solo una apre la porta giusta." }
  ];
  return Array.from({ length: count }, () => casuale(ENIGMI));
};

// Distribuisce collegamenti tra scene ed entità
const distribuisciCollegamenti = (capitoli, villain, png, mostri, enigmi) => {
  const scene = capitoli.flatMap((cap) => cap.scene || []);

  // Villain → ultima scena ultimo capitolo
  if (villain.length > 0 && scene.length > 0) {
    villain.forEach((v, i) => {
      const targetScene = scene[scene.length - 1 - i] || scene[scene.length - 1];
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

  const livelloGruppo = Math.max(1, Math.floor(
    (png.reduce((sum, p) => sum + (p.livello || 1), 0) + (villain.reduce((sum, v) => sum + (v.livello || 5), 0))) /
    (png.length + villain.length || 1)
  ));

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
               <div>
                <strong>{v.nome}</strong> ({v.classe} Lv.{v.livello})
                {v.magia && (
                  <ul>
                    {v.incantesimi.slice(0, 3).map((spell, idx) => (
                      <li key={idx} className="tooltip" data-tip={`Scuola: ${spell.school}\nGittata: ${spell.range}\n${spell.desc}`}>

                        ✨ {spell.name} (Lv.{spell.level})
                      </li>
                    ))}
                  </ul>
                )}
              </div>


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
                {/* Loot del Villain */}
{v.loot && v.loot.length > 0 && (
  <div style={{ marginTop: "0.5rem" }}>
    <strong>🎁 Loot:</strong>
    <ul>
      {v.loot.map((item, idx) => (
        <li key={idx} className="tooltip" data-tip={`Rarità: ${item.rarita}\nDescrizione: Oggetto evocativo`}>

          {item.nome} ({item.rarita})
        </li>
      ))}
    </ul>
    <button
      onClick={() => {
        const updated = [...campagna.villain];
        updated[i].loot = generaLootCasuale(2);
        setCampagna({ ...campagna, villain: updated });
      }}
      style={{ marginTop: "0.5rem" }}
    >
      🔄 Rigenera Loot
    </button>
  </div>
)}

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
            {showVillainModal && (
  <ModaleVillain onClose={() => setShowVillainModal(false)} />
)}
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
                <div>
  <strong>{m.nome}</strong> (GS {m.gs}) – CA: {m.ca}, PF: {m.pf}
  <div title={`Tipo: ${m.tipo}\nAttacchi: ${m.attacchi?.map(a => a.name).join(", ") || "N/D"}`}>
    🛡️ Hover per dettagli
  </div>
                <br />
                <em>{m.descrizione?.slice(0, 80)}...</em>
</div>
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
          {incontro.loot && (
  <div>
    <strong>🎁 Loot:</strong>
    <ul>
      {incontro.loot.map((l, idx) => (
        <li key={idx}>{l.nome} ({l.rarita})</li>
      ))}
    </ul>
    <button
      onClick={() => {
        const updated = [...incontri];
        updated[i].loot = generaLootCasuale(2);
        setIncontri(updated);
      }}
    >
      🔄 Rigenera Loot
    </button>
  </div>
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
  <div style={{ display: "flex", gap: "0.5rem" }}>
    <button onClick={generaCampagneComplete}>🎲 Genera Libreria di Campagne</button>
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
{campagneGenerate.length > 0 && (
  <div className="campagne-grid" style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
    {campagneGenerate.map((c, i) => (
  <div key={i} className="campagna-card" style={{ border: "1px solid #ccc", padding: "1rem" }}>
    <h4>{c.titolo}</h4>
    <p><strong>{c.tipo}</strong> — {c.ambientazione}</p>
    <p><em>{c.hookNarrativo}</em></p>
    <p>
      📚 Capitoli: {c.capitoli.length} | 👿 Villain: {c.villain.length} | 👤 PNG: {c.png.length} | 🧟 Mostri: {c.mostri.length}
    </p>
    <p>⏳ Durata stimata: {c.durataStimata} {c.durataTipo}</p>

    {/* Anteprima loot */}
    {c.loot && (c.loot.villain?.length > 0 || c.loot.incontri?.length > 0) && (
      <p>
  Loot Villain: {c.loot.villain?.slice(0, 2).map(l => `${l.nome} (${l.rarita})`).join(", ")}
  <br />
  Loot Incontri: {c.loot.incontri?.slice(0, 2).map(l => `${l.nome} (${l.rarita})`).join(", ")}
</p>

    )}

    <button onClick={() => setCampagna(c)}>📥 Importa in Editor</button>
  </div>
))}

  </div>
)}


    </div>
  );
}

export default ModaleCreaCampagna;
