// src/utils/generators.js

// ==============================
// UTILS
// ==============================
export const casuale = (array) => array[Math.floor(Math.random() * array.length)];
export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const shuffle = (array) => array.sort(() => Math.random() - 0.5);

// Roll stats 4d6 drop lowest
export const tiraStats = () => {
  const stats = [];
  for (let i = 0; i < 6; i++) {
    let rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => a - b).shift();
    stats.push(rolls.reduce((a, b) => a + b, 0));
  }
  return stats;
};

// Traduzioni
export const classiItaliane = {
  barbarian: "Barbaro",
  bard: "Bardo",
  cleric: "Chierico",
  druid: "Druido",
  fighter: "Guerriero",
  monk: "Monaco",
  paladin: "Paladino",
  ranger: "Ranger",
  rogue: "Ladro",
  sorcerer: "Stregone",
  warlock: "Warlock",
  wizard: "Mago",
};

export const razzeItaliane = {
  human: "Umano",
  elf: "Elfo",
  dwarf: "Nano",
  halfling: "Halfling",
  dragonborn: "Dragonide",
  gnome: "Gnomo",
  tiefling: "Tiefling",
  halfOrc: "Mezzo-Orco",
  halfElf: "Mezzo-Elfo",
  aasimar: "Aasimar",
};

// ==============================
// GENERA NOME
// ==============================
export const generaNomeCasuale = () => {
  const prefissi = ["Ar", "Bel", "Dor", "Fen", "Gor", "Lil", "Mor", "Ser", "Zan", "Val", "Xan", "Kyr", "Tyr", "Vyn", "Zyr"];
  const suffissi = ["ath", "ion", "mir", "dor", "vek", "nys", "var", "oth", "lyn", "ryn", "syr", "tar", "zar", "xan", "wyn", "ryn"];
  return (
    prefissi[Math.floor(Math.random() * prefissi.length)] +
    suffissi[Math.floor(Math.random() * suffissi.length)]
  );
};

export const generaCognomeCasuale = () => {
  const parti = ["Black", "Stone", "Iron", "Shadow", "Storm", "Bright", "Dark", "Swift", "Frost", "Fire", "Wind", "Earth", "Sky", "Moon", "Star"];
  const parti2 = ["blade", "fang", "heart", "song", "claw", "fire", "shadow", "storm", "wind", "stone", "light", "night", "dawn", "dusk", "flame"];
  return parti[Math.floor(Math.random() * parti.length)] + parti2[Math.floor(Math.random() * parti2.length)];
};

const nomiPerRazza = {
  elf: {
    prefissi: ["Ael", "Luth", "Fen", "Cael", "Ery", "Thal", "Syl", "Elan", "Ith", "Nim"],
    suffissi: ["ion", "ar", "eth", "iel", "orn", "wen", "dil", "las", "thil", "riel"],
  },
  dwarf: {
    prefissi: ["Brom", "Thar", "Dur", "Grim", "Kor", "Grom", "Thol", "Bald", "Dwal", "Krag"],
    suffissi: ["gar", "din", "mir", "rak", "run", "dor", "nar", "vik", "zul", "rak"],
  },
  human: {
    prefissi: ["Ed", "Jon", "Mar", "Luc", "Rol", "Sam", "Tom", "Ben", "Max", "Leo"],
    suffissi: ["ric", "ian", "as", "bert", "ardo", "aldo", "ino", "ero", "ano", "ito"],
  },
  tiefling: {
    prefissi: ["Lilith", "Zariel", "Amdusias", "Baal", "Mephistopheles", "Asmodeus", "Belial", "Mammon", "Dispater", "Levistus"],
    suffissi: ["th", "iel", "is", "as", "on"],
  },
  gnome: {
    prefissi: ["Fiz", "Nim", "Zil", "Tink", "Bibb", "Gim", "Wizzle", "Pip", "Jin", "Tink"],
    suffissi: ["bix", "ble", "dle", "fizz", "gix", "nix", "puff", "tink", "wizzle", "zle"],
  },
  dragonborn: {
    prefissi: ["Arj", "Bal", "Dra", "Gor", "Kha", "Rax", "Thur", "Zar", "Vyr", "Xal", "Zyra"],
    suffissi: ["thar", "rax", "dor", "gar", "kor", "zar", "vyrn", "xalith", "thrax", "zaryn", "vyrak"],
  },
  halfOrc: {
    prefissi: ["Gor", "Thog", "Krag", "Rok", "Zug", "Drog", "Mog", "Brog", "Hrog", "Trog", "Zog", "Nar"],
    suffissi: ["nar", "gar", "rok", "thog", "zug", "drog", "mog", "brok", "hrog", "trog", "zog"],
  },
  halfElf: {
    prefissi: ["Ael", "Lia", "Fen", "Cael", "Ery", "Thal", "Syl", "Elan", "Ith", "Nim"],
    suffissi: ["ion", "ar", "eth", "iel", "orn", "wen", "dil", "las", "thil", "riel"],
  },
  aasimar: {
    prefissi: ["Seraph", "Celest", "Lumin", "Astra", "Divin", "Radiant", "Halo", "Glor", "Virtu", "Elys"],
    suffissi: ["iel", "on", "is", "as", "ar", "eth"],
  },
  halfling: {
    prefissi: ["Bil", "Frodo", "Pippin", "Meri", "Sam", "Tuck", "Lobelia", "Rosie", "Daisy", "Ruby"],
    suffissi: ["baggins", "brandybuck", "took", "gamgee", "cotton", "chubb", "burrows", "goodbody", "smallfoot", "underhill"],
  },
};

export function generaNomePerRazza(razza) {
  const set = nomiPerRazza[razza] || null;
  if (set) {
    return (
      casuale(set.prefissi) + casuale(set.suffissi)
    );
  }
  return generaNomeCasuale(); // fallback
}

export function completaPNGComune(png) {
  const razzaDescr = razzeItaliane[png.razza] || "individuo";

  const mestieri = ["Locandiere", "Erborista", "Mercante", "Cacciatore", "Studioso", "Ladro", "Guida", "Artigiano", "Guardia cittadina", "Contadino", "Cultista", "Guardiano", "Cacciatore di taglie", "Artista", "Bardo", "Saggio", "Guaritore", "Cavaliere errante", "Esploratore", "Guardaboschi", "Cacciatore di reliquie", "Guardiano del tempio", "Custode della biblioteca", "Maestro di spada", "Alchimista", "Cartografo", "Costruttore di armi", "Mercenario", "Cavaliere errante"];
  const descrizioni = [
    `Un ${razzaDescr.toLowerCase()} robusto con occhi stanchi e mani callose. Capelli grigi e barba incolta. Il viso paffuto, è segnato da anni di lavoro duro. Indossa abiti semplici ed un grembiule macchiato.`,
    `Una giovane ${razzaDescr.toLowerCase()} dai capelli rossi e occhi neri curiosi. Il viso snello è adornato da lentiggini. Indossa abiti colorati e ha un sorriso contagioso. Porta sempre con sé un piccolo cestino pieno di erbe e fiori.`,
    `Un anziano ${razzaDescr.toLowerCase()} gracile con voce roca e passo lento. Porta con sé un bastone intagliato e racconta storie di un tempo passato. Indossa una tunica logora e ha un'espressione gentile.`,
    `Un ${razzaDescr.toLowerCase()} alto e magro, con un'aria misteriosa. I suoi occhi azzurri brillano di intelligenza. Indossa un mantello scuro e ha un'aria di riservatezza. Parla poco, ma quando lo fa, le sue parole sono sagge.`,
    `Una ${razzaDescr.toLowerCase()} robusta con capelli bianchi e occhi verdi penetranti. Il suo viso è segnato da rughe profonde, ma il suo sorriso è caloroso. Indossa abiti semplici e ha un'aria materna. Ama raccontare storie ai bambini del villaggio.`,
    `Un giovane ${razzaDescr.toLowerCase()} con capelli biondi e occhi blu vivaci. Il suo viso è pulito e dall'aria spensierata. Indossa abiti eleganti e ha un sorriso contagioso. Quando non è a corte, ama esplorare i boschi e giocare con gli animali.`,
    `Un ${razzaDescr.toLowerCase()} robusto con barba incolta e occhi scuri. Il suo viso è segnato da cicatrici, ma il suo sorriso è caloroso. Indossa abiti semplici e ha un'aria di saggezza. Ama raccontare storie di battaglie passate.`,
    `Una giovane ${razzaDescr.toLowerCase()} dai capelli castani e occhi verdi. Il suo viso è pulito e dall'aria gentile. Indossa abiti colorati e ha un sorriso contagioso. Ama aiutare gli altri e spesso si offre volontaria per le attività del villaggio.`,
    `Un ragazzo ${razzaDescr.toLowerCase()} con capelli ricci e occhi azzurri. Il suo viso è coperto di lentiggini e ha un sorriso malizioso. Indossa abiti logori e ha un'aria spensierata. Ama giocare con gli altri bambini e spesso si infila nei guai.`,
  ];
  const segni = [
    "Cicatrice sull'occhio destro",
    "Tatuaggio di un drago sul braccio sinistro",
    "Orecchio tagliato",
    "Braccio destro amputato",
    "Dente mancante",
    "Zoppia evidente",
    "Ride nervosamente prima di parlare",
    "Parla in modo confuso e disordinato",
    "Tamburella con le dita quando è nervoso",
    "Si gratta spesso la testa quando è in pensiero",
    "Si morde le labbra quando è in ansia",
    "Si tocca spesso il mento quando riflette",
  ];
  const ruoli = ["Alleato", "Traditore", "Guida", "Mentore", "Mercante", "Contatto", "Nemico", "Sfidante", "Sostenitore", "Testimone", "Vittima"];
const origini = [
  "Nato e cresciuto in un piccolo villaggio sulle montagne, dove ha imparato a cacciare e a sopravvivere. Divenuto un cacciatore esperto, ora offre le sue abilità per aiutare gli altri.",
  "Ex soldato ora in cerca di redenzione. Ha combattuto in molte battaglie, ma ora cerca di usare le sue abilità per proteggere i più deboli.",
  "Un orfano che ha imparato a sopravvivere per le strade.  Ora usa le sue abilità per aiutare gli altri e per cercare una famiglia che lo accetti.",
  "Un ex ladro che ha deciso di cambiare vita. Ora usa le sue abilità per aiutare gli altri e per cercare un modo per redimersi.",
  "Un vecchio saggio che ha viaggiato per il mondo. Ora vive in un piccolo villaggio, dove offre la sua saggezza e le sue conoscenze a chi ne ha bisogno.",
  "Un giovane apprendista che ha imparato l'arte della magia da un vecchio maestro. Ora cerca di usare le sue abilità per aiutare gli altri e per scoprire il suo vero potere.",
  "Un mercante che ha viaggiato per il mondo, accumulando ricchezze e conoscenze. Ora vive in un piccolo villaggio, dove offre i suoi beni e le sue conoscenze a chi ne ha bisogno.",
  "Un contadino che ha deciso di lasciare la sua vita semplice per cercare avventure. Ora usa le sue abilità per aiutare gli altri e per scoprire il mondo.",
  "Un ex artigiano che ha deciso di lasciare la sua bottega per cercare avventure. Ora usa le sue abilità per aiutare gli altri e per scoprire il mondo.",
];
const collegamenti = [
  "Collegato alla Scena: L’imboscata nel bosco",
  "Capitolo 2: Il tradimento del patto",
];

  const equipPerMestiere = {
  Locandiere: { indossa: "Grembiule sporco, camicia semplice", porta: "Chiave di cantina, bottiglia di vino" },
  Erborista: { indossa: "Mantello di lana, cappuccio verde", porta: "Borsa con erbe, mortaio e pestello" },
  Mercante: { indossa: "Tunica ricamata, cappello ampio", porta: "Borsa con monete, registro contabile" },
  Cacciatore: { indossa: "Pelle di cervo, stivali fangosi", porta: "Trappole, coltello da caccia" },
  Studioso: { indossa: "Abito di stoffa, occhiali spessi", porta: "Libro di appunti, calamaio" },
  Ladro: { indossa: "Mantello scuro, cappuccio", porta: "Attrezzi da scasso, monete rubate" },
  Guida: { indossa: "Giacca di pelle, cappello largo", porta: "Mappa consunta, borraccia" },
  Artigiano: { indossa: "Grembiule di cuoio, guanti", porta: "Strumenti da lavoro, pezzi di legno" },
  "Guardia cittadina": { indossa: "Uniforme, elmetto", porta: "Bastone, fischietto" },
  Contadino: { indossa: "Tunica di lino, stivali di paglia", porta: "Forcone, cesto di verdure" },
  Cultista: { indossa: "Cappuccio nero, tunica", porta: "Amuleto oscuro, libro di rituali" },
  "Guardiano": { indossa: "Armatura leggera, scudo", porta: "Chiave del tempio, torcia" },
  "Cacciatore di taglie": { indossa: "Giacca di pelle, stivali robusti", porta: "Bastone da combattimento, borsa con ricompense" },
  "Artista": { indossa: "Abito colorato, berretto", porta: "Strumento musicale, blocco da disegno" },
  Bardo: { indossa: "Abito elegante, mantello", porta: "Strumento musicale, pergamena di canzoni" },
  Saggio: { indossa: "Tunica semplice, mantello", porta: "Bastone, libro di saggezza" },
  Guaritore: { indossa: "Tunica bianca, mantello", porta: "Borsa con erbe curative, amuleto di guarigione" },
  "Cavaliere errante": { indossa: "Armatura leggera, mantello", porta: "Spada corta, scudo" },
  "Esploratore": { indossa: "Giacca di pelle, stivali robusti", porta: "Mappa, bussola" },
  "Guardaboschi": { indossa: "Tunica verde, stivali di cuoio", porta: "Arco, frecce" },
  "Cacciatore di reliquie": { indossa: "Tunica logora, stivali robusti", porta: "Borsa con attrezzi, mappa antica" },
  "Guardiano del tempio": { indossa: "Tunica bianca, mantello", porta: "Chiave del tempio, libro sacro" },
  "Custode della biblioteca": { indossa: "Abito semplice, occhiali", porta: "Libro antico, penna d'oca" },
  "Maestro di spada": { indossa: "Armatura leggera, mantello", porta: "Spada lunga, scudo" },
  Alchimista: { indossa: "Grembiule, occhiali protettivi", porta: "Borsa con ingredienti, alambicco" },
  Cartografo: { indossa: "Giacca di pelle, cappello", porta: "Mappa, bussola" },
  "Costruttore di armi": { indossa: "Grembiule di cuoio, guanti", porta: "Attrezzi da lavoro, pezzi di metallo" },
  Mercenario: { indossa: "Armatura leggera, mantello", porta: "Spada corta, borsa con monete" },
  };
  
  const mestiere = casuale(mestieri);
  const equip = equipPerMestiere[mestiere];

  return {
     ...png,
    nome: `${generaNomePerRazza(png.razza)} ${generaCognomeCasuale()}`,
    mestiere,
    descrizione: casuale(descrizioni),
    segni: casuale(segni),
    ruolo: casuale(ruoli),
    origine: casuale(origini),
    collegamento: casuale(collegamenti),
    equipIndossato: equip?.indossa || "",
  equipPortato: equip?.porta || "",
  armatura: png.armatura || "",
  arma: png.arma || "",
  };
}


// ==============================
// GENERA NARRATIVA 
// ==============================

export function generaTitoloCasuale() {
  const parole1 = ["Ombre", "Segreti", "Lame", "Sussurri", "Fuoco", "Nebbie", "Tempeste", "Echi", "Sangue", "Destini", "Leggende", "Misteri", "Incantesimi", "Rovine"];
  const parole2 = ["del Destino", "delle Tenebre", "del Sangue", "del Crepuscolo", "della Luce", "dell'Infinito", "della Guerra", "della Magia", "della Fiamma", "dell'Eco", "della Notte", "del Vento", "delle Stelle", "della Luna"];
  return `${parole1[rand(0, parole1.length - 1)]} ${parole2[rand(0, parole2.length - 1)]}`;
}

export function generaBlurbCasuale() {
  const blurbs = [
    "Un mondo spezzato attende il coraggio degli eroi. Tra ",
    "Le ombre non tacciono mai, ma parlano attraverso il vento.",
    "Nulla è come sembra, e ogni scelta nasconde un prezzo.",
  ];
  return casuale(blurbs);
}

export function generaHookCasuale() {
  const hooks = [
    "Un patto infranto scatena poteri oltre la comprensione.",
    "Un assassinio scuote le fondamenta della città.",
    "Un portale arcano si è aperto, e qualcosa sta per passare.",
  ];
  return casuale(hooks);
}

export function generaObiettivoScena() {
  const obiettivi = [
    "Recuperare l'artefatto sacro",
    "Proteggere il PNG chiave",
    "Scoprire l'identità del traditore",
  ];
  return casuale(obiettivi);
}

export function generaNomeLuogo() {
  const nomi = [
    "La Cripta dell'Eco",
    "Le Sale delle Ombre",
    "Il Faro del Destino",
    "Bosco dei Sospiri",
  ];
  return casuale(nomi);
}

// ==============================
// EQUIP BASE
// ==============================
export const generaEquipBase = (classe) => {
  const equipaggiamento = {
    guerriero: ["Spada lunga", "Scudo", "Cotta di maglia", "Scudo di legno", "Razioni x5", "Torcia x2"],
    mago: ["Bastone", "Libro degli incantesimi", "Tunica", "Borsa di componenti", "Focus arcano (Ametista incisa)"],
    ladro: ["Pugnale", "Mantello scuro", "Attrezzi da scasso", "Borsa di monete", "Razioni x5"],
    chierico: ["Morningstar", "Simbolo sacro (Rosario d'ebano)", "Armatura a scaglie", "Scudo di legno", "Razioni x5", "Torcia x2"],
    ranger: ["Arco lungo", "Freccia", "Armatura di cuoio", "Borsa di erbe medicinali", "Razioni x5"],
    druido: ["Bastone", "Totem", "Tunica di pelle", "Borsa di erbe", "Razioni x5", "Totem druidico (Artiglio di lupo)"],
    barbaro: ["Ascia bipenne", "Scudo di legno", "Armatura di pelle", "Razioni x5", "Torcia x2"],
    bardo: ["Lira", "Spada corta", "Abito colorato", "Borsa di monete", "Razioni x5"],
    monaco: ["Bastone corto", "Abito da combattimento", "Sandali di cuoio", "Borsa di monete", "Razioni x5"],
    paladino: ["Spada lunga", "Scudo", "Armatura a piastre", "Razioni x5", "Torcia x2", "Simbolo sacro (Croce d'argento)"],
  };
  return equipaggiamento[classe.toLowerCase()] || ["Equip generico"];
};

// ==============================
// STEP GENERATION FUNCTIONS
// ==============================
export async function generaLivelloETipo(png) {
  const livello = png.tipo === "Non Comune" ? rand(1, 10) : 1;
  return {
    ...png,
    livello,
    nome: `${generaNomeCasuale()} ${generaCognomeCasuale()}`,
  };
}

export async function generaRazza(png) {
  const razze = await (await fetch("https://www.dnd5eapi.co/api/races")).json();
  const scelta = casuale(razze.results);
  const razzaDet = await (await fetch(`https://www.dnd5eapi.co${scelta.url}`)).json();

  return {
    ...png,
    razza: scelta.index,
    bonusRazza: razzaDet.ability_bonuses.map((b) => `${b.ability_score.name} +${b.bonus}`),
    razzaDettaglio: razzaDet,
  };
}

export async function generaClasse(png) {
  if (png.tipo === "Comune") return png;

  const classi = await (await fetch("https://www.dnd5eapi.co/api/classes")).json();
  const scelta = casuale(classi.results);
  const classeDet = await (await fetch(`https://www.dnd5eapi.co${scelta.url}`)).json();

  const isMagica = await fetch(`https://www.dnd5eapi.co/api/classes/${scelta.index}/spellcasting`).then((res) => res.ok);

  return {
    ...png,
    classe: scelta.index,
    classeDettaglio: classeDet,
    magia: isMagica,
  };
}

export async function generaStats(png) {
  const rolls = tiraStats().sort((a, b) => b - a);
  const priorita = {
    barbarian: ["forza", "costituzione", "destrezza"],
    fighter: ["forza", "costituzione", "destrezza"],
    wizard: ["intelligenza", "costituzione", "saggezza"],
    cleric: ["saggezza", "forza", "costituzione"],
    rogue: ["destrezza", "carisma", "intelligenza"],
  };
  const ordine = priorita[png.classe] || ["forza", "destrezza", "costituzione", "intelligenza", "saggezza", "carisma"];

  const statsBase = {};
  ordine.forEach((s, i) => (statsBase[s] = rolls[i]));

  // Applica bonus razziali
  const statsFinali = { ...statsBase };
  png.razzaDettaglio.ability_bonuses.forEach((b) => {
    if (b.ability_score.index === "str") statsFinali.forza += b.bonus;
    if (b.ability_score.index === "dex") statsFinali.destrezza += b.bonus;
    if (b.ability_score.index === "con") statsFinali.costituzione += b.bonus;
    if (b.ability_score.index === "int") statsFinali.intelligenza += b.bonus;
    if (b.ability_score.index === "wis") statsFinali.saggezza += b.bonus;
    if (b.ability_score.index === "cha") statsFinali.carisma += b.bonus;
  });

  return { ...png, stats: statsFinali };
}

export async function generaCompetenze(png) {
  const { classeDettaglio } = png;

  const abilitaScelte = [];
  for (const choice of classeDettaglio.proficiency_choices || []) {
    if (choice.choose > 0) {
      const opzioni = (choice.from?.options || []).map((opt) => opt.item?.name).filter(Boolean);
      abilitaScelte.push(...shuffle(opzioni).slice(0, choice.choose));
    }
  }

  return {
    ...png,
    abilitaClasse: abilitaScelte,
    competenzeClasse: classeDettaglio.proficiencies.map((p) => p.name),
  };
}

export async function generaMagia(png) {
  const res = await fetch(`https://www.dnd5eapi.co/api/classes/${png.classe}/spellcasting`);
  if (!res.ok) return png;
  const spellData = await res.json();

  const abilitaMagia = spellData.spellcasting_ability.index;
  const modMagia = Math.floor((png.stats[abilitaMagia] - 10) / 2);
  const proficiency = Math.ceil(png.livello / 4) + 2;

  const cd = 8 + modMagia + proficiency;
  const bonusAttacco = modMagia + proficiency;

  const spellsFetched = [];
  for (let lvl = 0; lvl <= png.livello; lvl++) {
    const resLvl = await fetch(`https://www.dnd5eapi.co/api/spells?classes=${png.classe}&level=${lvl}`);
    const data = await resLvl.json();
    spellsFetched.push(...data.results);
  }

  return {
    ...png,
    magia: { caratteristica: abilitaMagia, cd, bonusAttacco, focus: spellData.spellcasting_focus?.join(", ") || "Nessun focus" },
    incantesimi: shuffle(spellsFetched).slice(0, png.livello + 3),
  };
}

export async function generaEquipaggiamento(png) {
  const equipBase = generaEquipBase(png.classe);
  return {
    ...png,
    arma: equipBase.find((e) => e.toLowerCase().includes("spada") || e.toLowerCase().includes("pugnale")) || "Pugnale",
    armatura: equipBase.find((e) => e.toLowerCase().includes("armatura") || e.toLowerCase().includes("cuoio")) || "Abiti comuni",
    equipIndossato: equipBase.join(", "),
  };
}

function fallbackStep(png, stepIndex) {
  switch (stepIndex) {
    case 0: // Livello
      return { ...png, livello: 3, nome: "Fallback PNG" };
    case 1: // Razza
      return { ...png, razza: "human", bonusRazza: ["Forza +1"], razzaDettaglio: {} };
    case 2: // Classe
      return { ...png, classe: "fighter", magia: false, classeDettaglio: {} };
    case 3: // Stats
      return { ...png, stats: { forza: 14, destrezza: 12, costituzione: 13, intelligenza: 10, saggezza: 11, carisma: 9 } };
    case 4: // Competenze
      return { ...png, abilitaClasse: ["Atletica"], competenzeClasse: ["Armi semplici"] };
    case 5: // Equipaggiamento
      return { ...png, arma: "Spada lunga", armatura: "Armatura di cuoio", equipIndossato: "Mantello logoro" };
    default:
      return png;
  }
}
export function generaLootCasuale(livello = 1, tipo = "generico") {
  const lootBase = [
    { nome: "Pozione di guarigione", rarita: "Comune" },
    { nome: "Gemma scintillante", rarita: "Comune" },
    { nome: "Pugnale arrugginito", rarita: "Comune" },
    { nome: "Borsa di monete (10 mo)", rarita: "Comune" },
    { nome: "Morningstar", rarita: "Comune" },
    { nome: "Scudo di legno", rarita: "Comune" },
    { nome: "Armatura di cuoio", rarita: "Comune" },
  ];
  const lootMagico = [
    { nome: "Spada Lunga +1", rarita: "Non Comune" },
    { nome: "Anello di protezione", rarita: "Raro" },
    { nome: "Bastone del potere", rarita: "Molto Raro" },
    { nome: "Pergamena di Teletrasporto", rarita: "Non Comune" },
    { nome: "Mantello dell'invisibilità", rarita: "Raro" },
    { nome: "Elmo della mente", rarita: "Molto Raro" },
  ];
  if (livello >= 5 && Math.random() > 0.5) lootBase.push(casuale(lootMagico));
  return shuffle(lootBase).slice(0, livello > 10 ? 3 : 2);
}

export function generaTesoroIncontro(gradoSfida = 1) {
  return generaLootCasuale(gradoSfida, "incontro");
}

export function generaTesoroCampagna() {
  return [
    ...generaLootCasuale(5),
    { nome: "Artefatto leggendario", rarita: "Leggendario" },
    { nome: "Pergamena antica", rarita: "Raro" },
    { nome: "Cristallo magico", rarita: "Molto Raro" },
    { nome: "Borsa di gemme preziose", rarita: "Raro" },
    { nome: "Libro di incantesimi", rarita: "Raro" },
  ];
}

// ==============================
// GENERA LOOT CASUALE PER PNG
// ==============================
export function generaLootCasualePerPNG(png) {
  const livello = png.livello || 1;

  // Logica loot: più livello = più oggetti rari
  let rarita;
  if (livello <= 4) rarita = "Comune";
  else if (livello <= 8) rarita = "Non Comune";
  else rarita = "Raro";

  // Classi magiche → possibilità di pergamene/incantesimi
  const loot = [];
  loot.push({ nome: "Pozione di Guarigione", rarita: "Comune" });

  if (rarita === "Non Comune" || rarita === "Raro") {
    loot.push({
      nome: png.magia ? "Pergamena di Incantesimo" : "Arma +1",
      rarita,
    });
  }

  return loot;
}

export function generaContenutoCasuale(indice) {
  const pool = [
    [
      "Una porta runica, sigillata da tempo, richiede un incantesimo per essere aperta",
      "Qualcuno ha rubato il focus arcano dello stregone Siggo. Lauta ricompensa per chi lo riporterà",
      "Un urlo riecheggia appena entrate nella stanza. Un fantasma appare, chiedendo aiuto",
      "Un antico mosaico custodisce un segreto proibito che può cambiare il destino del gruppo",
      "La vecchia Hanoe, la maga del villaggio, ha lasciato un messaggio: 'La chiave è nascosta tra le stelle'",
    ],
    [
      "Un enigma posto da uno spirito antico per accedere alla stanza successiva",
      "Un PNG mente per proteggere qualcosa. Il gruppo deve scoprire la verità",
      "L'erborista del villaggio offre un indizio cruciale: 'La chiave è nascosta tra le radici dell'albero sacro'",
      "Una statua osserva con occhi di giada, pronta a muoversi. Il gruppo deve risolvere un indovinello per passare",
      "La vecchia torre di Keldaras è avvolta da un'aura di magia oscura. Un incantesimo di protezione impedisce l'ingresso",
    ],
    [
      "Una stanza piena di simboli dimenticati che brillano lievemente di magia antica",
      "Il diario di un avventuriero caduto riporta un messaggio criptico: 'La chiave è nel cuore della bestia'",
      "Un altare profanato emana energia oscura che corrompe l'aria circostante",
      "Un antico sigillo magico protegge un tesoro. Il gruppo deve recitare una formula per spezzarlo",
      "Nel crocevia fuori la foresta di Soodati, un gruppo di druidi ha eretto un cerchio di pietre. Si dice che chiunque entri senza il loro permesso venga trasformato in un animale",
    ],
    [
      "Un golem sorveglia l’area circostante. Per passare, il gruppo deve risolvere un enigma.",
      "Un antico libro di incantesimi è aperto su un leggio. Della polvere arcana fluttua leggera sopra di esso.",
      "Un’orda improvvisa blocca l’uscita. Tra i nemici, un mago lancia incantesimi di illusione per confondere il gruppo.",
      "Una trappola magica minaccia di distruggere il gruppo. Per disattivarla, devono recitare una formula antica.",
      "Nella rotta commerciale tra le città di Venera e Solithar, un gruppo di mercanti è stato attaccato da briganti. Il gruppo deve recuperare i beni rubati.",
    ],
    [
      "Un artefatto arcano contorto da un incantesimo di protezione",
      "Una creatura chiede aiuto per fuggire da un incantesimo di prigionia",
      "Un portale instabile si apre, ma verso dove?",
      "Il vecchio casolare Ferendor è diventato un luogo infestato. Perchè? si vocifera di ombre e strane luci nella notte...",
      "Una nebba perenne avvolte il villaggio marino di Sargoth. Si dice che sia il risultato di un antico rituale fallito",
    ]
  ];

  return pool[indice] ? casuale(pool[indice]) : "Un evento inaspettato si manifesta";
}


// ==============================
// ORCHESTRATORE
// ==============================
export async function generaPNGStepByStep(setPng, tipo = "Non Comune", setStepCorrente = null) {
  let png = { tipo };
  if (tipo === "Comune") {
  png = completaPNGComune(png);
  setPng(png);
  return png; // chiudi qui, niente stats, magie, loot extra
}


  const steps = [
    generaLivelloETipo,
    generaRazza,
    generaClasse,
    generaStats,
    generaCompetenze,
    generaEquipaggiamento,
  ];

  if (setStepCorrente) setStepCorrente(0);

  for (let i = 0; i < steps.length; i++) {
    const stepFn = steps[i];
    try {
      png = await stepFn(png);
    } catch (error) {
      console.warn(`Errore nello step ${i + 1}: uso fallback`, error);
      png = fallbackStep(png, i); // Funzione di fallback
    }
    setPng(png);
    if (setStepCorrente) setStepCorrente(i + 1);
    await new Promise((res) => setTimeout(res, 300));
  }

   try {
    png.loot = generaLootCasualePerPNG(png);
  } catch {
    png.loot = [{ nome: "Pugnale arrugginito", rarita: "Comune" }];
  }
  setPng(png);
  if (setStepCorrente) setStepCorrente(steps.length + 1);

  if (png.magia) {
    try {
      png = await generaMagia(png);
    } catch (error) {
      console.warn("Errore magia: uso fallback", error);
      png.magia = { caratteristica: "int", cd: 12, bonusAttacco: 4, focus: "Cristallo" };
      png.incantesimi = [{ name: "Dardo Incantato", level: 1 }, { name: "Trucchetto: Luce", level: 0 }];
    }
    setPng(png);
  }

}


