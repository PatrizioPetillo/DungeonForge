// src/utils/generators.js
import { backgrounds } from "./backgrounds";

// ==============================
// UTILS
// ==============================
export const casuale = (array) => array[Math.floor(Math.random() * array.length)];
export const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
export const shuffle = (array) => array.sort(() => Math.random() - 0.5);

function calcolaPF(classe, livello, modCostituzione) {
  const dadiVita = { fighter: 10, wizard: 6, rogue: 8, cleric: 8, barbarian: 12 }; // ecc.
  const dado = dadiVita[classe] || 8;
  return dado + ((dado / 2 + 1) + modCostituzione) * (livello - 1);
}

function calcolaCA(armatura, modDestrezza) {
  if (armatura.toLowerCase().includes("piastre")) return 18;
  if (armatura.toLowerCase().includes("maglia")) return 16;
  if (armatura.toLowerCase().includes("cuoio")) return 11 + modDestrezza;
  return 10 + modDestrezza;
}

  export function generaDescrizioneEvocativa(png) {
  const razza = razzeItaliane[png.razza] || "individuo";
  const template = [
    `Un ${razza} dal portamento fiero, occhi attenti e armatura che racconta mille battaglie. `,
    `Una ${razza} avvolta da mistero, con uno sguardo carico di segreti e incantesimi pronti.`,
    `Un ${razza} agile e silenzioso, perfetto per tendere imboscate o sfuggire al pericolo. `,
    `Un ${razza} saggio e compassionevole, con una presenza che infonde calma e sicurezza.`,
    `Un ${razza} robusto e determinato, con una forza che sembra inarrestabile.`,
    `Un ${razza} astuto e scaltro, sempre pronto a cogliere l'occasione al volo.`,
    `Un ${razza} elegante e raffinato, con un talento naturale per la musica e le arti.`,
    `Un ${razza} devoto e leale, pronto a difendere i suoi compagni a costo della vita.`,
    `Un ${razza} curioso e intraprendente, sempre alla ricerca di nuove avventure e scoperte.`,
    `Un ${razza} misterioso e affascinante, con un'aura che attira l'attenzione e suscita ammirazione.`,
  ];
  return casuale(template);
}

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
  const prefissi = ["Ar", "Bel", "Dor", "Fen", "Gor", "Lil", "Mor", "Kan", "Ser", "Zan", "Val", "Xan", "Kyr", "Tyr", "Vyn", "Zyr", "Lyn", "Ryn", "Syl", "Thal", "Ael", "Cael", "Ery", "Ith", "Nim"];
  const suffissi = ["ath", "ion", "mir", "dor", "vek", "nys", "var", "oth", "lyn", "ryn", "syr", "tar", "zar", "xan", "wyn", "ryn", "lyn", "ryn", "ryn"];
  return (
    prefissi[Math.floor(Math.random() * prefissi.length)] +
    suffissi[Math.floor(Math.random() * suffissi.length)]
  );
};

export const generaCognomeCasuale = () => {
  const parti = ["Black", "Stone", "Iron", "Shadow", "Storm", "Bright", "Dark", "Swift", "Frost", "Fire", "Wind", "Earth", "Sky", "Moon", "Star", "Sun", "Night", "Dawn", "Dusk", "Flame", "Spark", "Wave", "Thorn", "Branch", "Leaf"];
  const parti2 = ["blade", "fang", "heart", "song", "claw", "fire", "shadow", "storm", "wind", "stone", "light", "night", "dawn", "dusk", "flame", "spark", "wave", "thorn", "branch", "leaf"];
  return parti[Math.floor(Math.random() * parti.length)] + parti2[Math.floor(Math.random() * parti2.length)];
};

const nomiPerRazza = {
  elf: {
    prefissi: ["Ael", "Luth", "Fen", "Cael", "Ery", "Thal", "Syl", "Elan", "Ith", "Nim", "Ari", "Lira", "Fey", "Cyr", "Elen", "Thal", "Sylv", "Elowen", "Ithil"],
    suffissi: ["ion", "ar", "eth", "iel", "orn", "wen", "dil", "las", "thil", "riel", "wen", "dil", "las", "thil", "riel", "wenna", "dilwen", "lasiel", "thilorn"],
  },
  dwarf: {
    prefissi: ["Brom", "Thar", "Dur", "Grim", "Kor", "Grom", "Thol", "Bald", "Dwal", "Krag", "Ragn", "Thur", "Gald", "Baldur", "Dwalin", "Kragar", "Ragnar"],
    suffissi: ["gar", "din", "mir", "rak", "run", "dor", "nar", "vik", "zul", "rak", "dor", "nar", "vik", "zul", "rak", "dor", "nar", "vik", "zul"],
  },
  human: {
    prefissi: ["Ed", "Jon", "Mar", "Luc", "Rol", "Sam", "Tom", "Ben", "Max", "Leo", "Ana", "Eva", "Lia", "Mia", "Nia", "Ria", "Sia", "Tia", "Zia"],
    suffissi: ["ric", "ian", "as", "bert", "ardo", "aldo", "ino", "ero", "ano", "ito", "ino", "ero", "ano", "ito", "ino", "ero", "ano", "ito"],
  },
  tiefling: {
    prefissi: ["Lilith", "Zariel", "Amdusias", "Baal", "Mephistopheles", "Asmodeus", "Belial", "Mammon", "Dispater", "Levistus"],
    suffissi: ["th", "iel", "is", "as", "on", "ar", "eth", "or", "yn", "is", "as", "on", "ar", "eth", "or", "yn"],
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
    suffissi: ["iel", "on", "is", "as", "ar", "eth", "or", "yn", "is", "as", "on", "ar", "eth", "or", "yn"],
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
export const listaMestieri = ["Locandiere", "Erborista", "Mercante", "Cacciatore", "Studioso", "Ladro", "Guida", "Artigiano", "Guardia cittadina", "Contadino", "Cultista", "Guardiano", "Cacciatore di taglie", "Artista", "Bardo", "Saggio", "Guaritore", "Cavaliere errante", "Esploratore", "Guardaboschi", "Cacciatore di reliquie", "Guardiano del tempio", "Custode della biblioteca", "Maestro di spada", "Alchimista", "Cartografo", "Costruttore di armi", "Mercenario", "Cavaliere errante"];
export const listaRuoli = ["Alleato", "Traditore", "Guida", "Mentore", "Mercante", "Contatto", "Nemico", "Sfidante", "Sostenitore", "Testimone", "Vittima", "Spia", "Informatore", "Sfidante", "Protettore", "Rivale", "Confidente", "Avversario", "Compagno", "Sconosciuto", "Benefattore", "Antagonista"];

export function completaPNGComune(png) {
   const razzaKey = png.razza || casuale(Object.keys(razzeItaliane));
  const razzaDescr = razzeItaliane[razzaKey] || "individuo";

  const mestiere = casuale(listaMestieri);
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
    `Un ${razzaDescr.toLowerCase()} anziano con capelli bianchi e occhi azzurri. Il suo viso è segnato da rughe profonde, ma il suo sorriso è caloroso. Indossa abiti semplici e ha un'aria di saggezza. Ama raccontare storie ai bambini del villaggio.`,
    `Un ${razzaDescr.toLowerCase()} giovane con capelli neri e occhi marroni. Il suo viso è pulito e dall'aria seria. Indossa abiti eleganti e ha un'aria di determinazione. Ama studiare e spesso si trova in biblioteca a leggere libri antichi.`,
    `Un ${razzaDescr.toLowerCase()} robusto con barba incolta e occhi scuri. Il suo viso è segnato da cicatrici, ma il suo sorriso è caloroso. Indossa abiti semplici e ha un'aria di saggezza. Ama raccontare storie di battaglie passate.`,
    `Una giovane ${razzaDescr.toLowerCase()} dai capelli biondi e occhi blu. Il suo viso è pulito e dall'aria spensierata. Indossa abiti eleganti e ha un sorriso contagioso. Ama ballare e spesso si esibisce in spettacoli per il villaggio.`,
    `Un ${razzaDescr.toLowerCase()} anziano con capelli bianchi e occhi verdi. Il suo viso è segnato da rughe profonde, ma il suo sorriso è caloroso. Indossa abiti semplici e ha un'aria di saggezza. Ama raccontare storie ai bambini del villaggio.`,
    `Un ${razzaDescr.toLowerCase()} giovane con capelli castani e occhi marroni. Il suo viso è pulito e dall'aria gentile. Indossa abiti colorati e ha un sorriso contagioso. Ama aiutare gli altri e spesso si offre volontaria per le attività del villaggio.`,
  ];
  const segni = [
    "Cicatrice sull'occhio destro che copre con una benda",
    "Tatuaggio di un drago sul braccio sinistro che si estende fino alla mano",
    "Orecchio tagliato proprio alla punta, segno di una vecchia battaglia",
    "Braccio destro amputato, altezza del gomito, sostituito da una protesi di legno che termina con un uncino",
    "Dente mancante sul lato sinistro della bocca, che gli conferisce un'aria minacciosa",
    "Zoppia evidente alla gamba destra, che lo costringe a camminare con un bastone",
    "Ride nervosamente prima di parlare e si gratta spesso la testa",
    "Parla in modo confuso e disordinato quando è sotto pressione",
    "Tamburella con le dita quando sa qualcosa di importante",
    "Si gratta spesso la testa quando è in pensiero o quando è preoccupato",
    "Si morde le labbra quando è in ansia o quando è nervoso",
    "Si tocca spesso il mento quando riflette, guardando in alto.",
  ];
  
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
  "Un giovane esploratore che ha deciso di lasciare la sua casa per scoprire il mondo. Ora usa le sue abilità per aiutare gli altri e per scoprire nuove terre.",
];
const collegamenti = [
  "Collegato alla Scena: L’imboscata nel bosco",
  "Capitolo 2: Il tradimento del patto",
];

  const equipPerMestiere = {
  Locandiere: { indossa: "Grembiule sporco, camicia semplice, pantaloni logori", porta: "Chiave di cantina, bottiglia di vino, panno per pulire" },
  Erborista: { indossa: "Mantello di lana, cappuccio verde", porta: "Borsa con erbe medicinali, mortaio e pestello" },
  Mercante: { indossa: "Tunica ricamata, cappello ampio", porta: "Borsa con monete (15 mo), registro contabile" },
  Cacciatore: { indossa: "Pelle di cervo, stivali fangosi, arco corto", porta: "Trappole, coltello da caccia" },
  Studioso: { indossa: "Abito di stoffa, occhiali spessi, borsa di pelle", porta: "Pergamene con appunti, calamaio, piuma d'oca" },
  Ladro: { indossa: "Mantello scuro, cappuccio, stivali di spessa stoffa", porta: "Attrezzi da scasso, monete false, pugnale" },
  Guida: { indossa: "Giacca di pelle, cappello largo", porta: "Mappa consunta, borraccia, zaino da esploratore" },
  Artigiano: { indossa: "Grembiule di cuoio, guanti", porta: "Strumenti da lavoro, pezzi di legno" },
  "Guardia cittadina": { indossa: "Cotta di maglia, elmetto, stivali in pelle", porta: "Spada lunga, scudo, fischietto" },
  Contadino: { indossa: "Tunica di lino, stivali di stoffa logora", porta: "Forcone, cesto di verdure" },
  Cultista: { indossa: "Cappuccio nero, lunga tunica scura, cinta di corda", porta: "Amuleto oscuro, libro di rituali, pugnale sacrificale" },
  "Guardiano": { indossa: "Armatura a scaglie, Spada lunga, scudo", porta: "Chiave del tempio, torcia, rosario" },
  "Cacciatore di taglie": { indossa: "Giacca di pelle, stivali robusti", porta: "Balestra leggera, borsa con manifesti dei ricercati" },
  "Artista": { indossa: "Abito colorato, berretto, pantaloni larghi", porta: "Blocco da disegno, disegni vari, carboncini" },
  Bardo: { indossa: "Abito elegante, mantello, cappello con fesa", porta: "Piccola Arpa, spartiti vari" },
  Saggio: { indossa: "Tunica semplice, mantello", porta: "Bastone, tomo rilegato" },
  Guaritore: { indossa: "Tunica bianca, mantello", porta: "Borsa con erbe curative, amuleto di guarigione" },
  "Cavaliere errante": { indossa: "Armatura completa, mantello", porta: "Spada corta, scudo" },
  "Esploratore": { indossa: "Giacca di pelle, stivali robusti", porta: "Mappa, bussola" },
  "Guardaboschi": { indossa: "Tunica verde, stivali di cuoio", porta: "Arco, frecce" },
  "Cacciatore di reliquie": { indossa: "Tunica logora, stivali robusti", porta: "Borsa con attrezzi, mappa antica" },
  "Guardiano del tempio": { indossa: "Tunica bianca, mantello", porta: "Chiave del tempio, libro sacro" },
  "Custode della biblioteca": { indossa: "Abito semplice, occhiali", porta: "Libro antico, penna d'oca" },
  "Maestro di spada": { indossa: "Armatura di cuoio, mantello", porta: "Spada lunga, scudo" },
  Alchimista: { indossa: "Grembiule, occhiali protettivi", porta: "Borsa con ingredienti, alambicco" },
  Cartografo: { indossa: "Giacca di pelle, cappello", porta: "Mappa, bussola" },
  "Costruttore di armi": { indossa: "Grembiule di cuoio, guanti", porta: "Attrezzi da lavoro, pezzi di metallo" },
  Mercenario: { indossa: "Armatura di cuoio, mantello", porta: "Spada corta, borsa con monete" },

  };
  
  const equip = equipPerMestiere[mestiere] || { indossa: "Abiti semplici", porta: "Niente di particolare" };

  return {
     ...png,
    nome: `${generaNomePerRazza(png.razza)} ${generaCognomeCasuale()}`,
    razza: razzaDescr,
    mestiere,
    descrizione: casuale(descrizioni),
    segni: casuale(segni),
    ruolo: casuale(listaRuoli),
    origine: casuale(origini),
    collegamento: casuale(collegamenti),
    equipIndossato: equipPerMestiere[mestiere]?.indossa || "Abiti semplici",
    equipPortato: equipPerMestiere[mestiere]?.porta || "Niente di particolare",
  };
}

export function aggiornaDescrizioneConRazza(descrizioneVecchia, nuovaRazza) {
  const razzaDescr = razzeItaliane[nuovaRazza] || "individuo";
  return descrizioneVecchia.replace(/(umano|elfo|nano|individuo)/gi, razzaDescr.toLowerCase());
}
export function generaEquipaggiamentoNonComune(png) {
  const equipBase = generaEquipBase(png.classe.toLowerCase());
  const arma = equipBase.find(e => e.toLowerCase().includes("spada") || e.toLowerCase().includes("pugnale")) || "Pugnale";
  const armatura = equipBase.find(e => e.toLowerCase().includes("armatura") || e.toLowerCase().includes("cuoio")) || "Abiti comuni";
  const armaDettaglio = armi.find(a => a.name === arma);

  return {
    ...png,
    arma,
    dettagliArma: armaDettaglio || null,
    armatura,
    equipIndossato: `${armatura}, ${arma}`,
    equipPortato: equipBase.filter(e => e !== arma && e !== armatura).join(", "),
  };
}

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
    paladino: ["Spada lunga", "Scudo", "Armatura a piastre", "Razioni x5", "Torcia x2", "Simbolo sacro (Mezzo Sole d'argento)"],
  };
  return equipaggiamento[classe.toLowerCase()] || ["Equip generico"];
};

// ==============================
// STEP GENERATION FUNCTIONS
// ==============================


export async function generaBackground(png) {
  const scelta = casuale(backgrounds);
  return {
    ...png,
    background: scelta.name,
    abilitaBackground: scelta.starting_proficiencies.join(", "),
    talentiBackground: `${scelta.feature.name}: ${scelta.feature.desc[0]}`,
    strumentiBackground: scelta.tool_proficiencies.join(", ") || "Nessuno",
    lingueBackground: scelta.languages.join(", ") || "Nessuna",
    dettagliBackground: {
      nome: scelta.name,
      descrizioneBreve: scelta.feature.desc[0],
      strumenti: scelta.tool_proficiencies.join(", ") || "Nessuno",
      lingue: scelta.languages.join(", ") || "Nessuna",
    },
  };
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


