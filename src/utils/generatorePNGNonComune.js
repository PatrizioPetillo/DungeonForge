// src/utils/pngNonComuneGenerator.js
import { casuale, rand, shuffle, tiraStats, generaNomeCasuale, generaCognomeCasuale, generaDescrizioneEvocativa, razzeItaliane, classiItaliane } from "./generators";
import { backgrounds } from "./backgrounds";
import { armi } from "./armi";
import { armature } from "./armature";

  const statMagicaPerClasse = {
  mago: "intelligenza",
  stregone: "carisma",
  warlock: "carisma",
  bardo: "carisma",
  chierico: "saggezza",
  druido: "saggezza",
  paladino: "carisma",
  ranger: "saggezza",
    monaco: "saggezza",
};

function generaFocusArcano(classe) {
  const focusPerClasse = {
    mago: ["Bastone di quercia inciso", "Cristallo arcano lucente", "Bacchetta d’osso intarsiata", "Libro degli incantesimi con copertina di pelle"],
    stregone: ["Pietra runica cremisi", "Bastone con gemma rossa", "Cristallo pulsante di energia", "Anello con sigillo arcano"],
    warlock: ["Teschio di corvo inciso", "Anello con occhio demoniaco", "Libro di ombre", "Cristallo oscuro"],
    bardo: ["Lira d’argento", "Flauto di osso antico", "Liuto intarsiato di rune", "Tamburo di pelle di drago"],
    chierico: ["Simbolo sacro (Croce d’oro)", "Rosario di perle", "Amuleto con rune divine"],
    druido: ["Totem di corteccia", "Amuleto di pietra verde", "Ramo di quercia runico"],
    ranger: ["Totem Lupo", "Pietra di luna incisa", "Collana di denti", "Bracciale di legno intagliato"],
    paladino: ["Simbolo sacro incastonato in argento (Mezzo Sole)", "Scudo con runa sacra", "Anello di giada con croce"],
    monaco: ["Corda di preghiera", "Amuleto di giada", "Bracciale di meditazione"],
  };
    return casuale(focusPerClasse[classe] || ["Cristallo opalescente"]);
}
// Progressione slot (semplificata per D&D 5e)
const slotPerLivello = {
  1: [2],
  2: [3],
  3: [4, 2],
  4: [4, 3],
  5: [4, 3, 2],
  6: [4, 3, 3],
  7: [4, 3, 3, 1],
  8: [4, 3, 3, 2],
  9: [4, 3, 3, 3, 1],
  10: [4, 3, 3, 3, 2]
};

export async function generaPNGNonComuneCompleto(opzioni = {}) {
  let png = {};

  // 1. Livello
  png.livello = opzioni.livello || rand(3, 10);
    const proficiencies = Math.floor((png.livello + 7) / 4);

  // 2. Razza e Classe
  const razzaKey = opzioni.razza || casuale(Object.keys(razzeItaliane));
png.razza = razzeItaliane[razzaKey] || "Umano";

const classeKey = opzioni.classe || casuale(Object.keys(classiItaliane));
png.classe = classiItaliane[classeKey] || "Guerriero";

  // 2.2 Abilità di Classe e Competenze
  const abilitaPerClasse = {
    guerriero: ["Atletica", "Intimidire"],
    mago: ["Arcano", "Storia"],
    ladro: ["Furtività", "Rapidità di mano"],
    chierico: ["Religione", "Medicina"],
    barbaro: ["Atletica", "Sopravvivenza"],
    druido: ["Natura", "Medicina"],
    ranger: ["Percezione", "Sopravvivenza"],
    bardo: ["Intrattenimento", "Persuasione"],
    monaco: ["Atletica", "Acrobazia"],
    paladino: ["Intimidire", "Religione"],
    stregone: ["Arcano", "Persuasione"],
    warlock: ["Arcano", "Inganno"],
  };
  png.abilitaClasse = abilitaPerClasse[png.classe] || ["Percezione"];
  png.competenzeClasse = ["Armi semplici", "Armature leggere"]; // placeholder
  png.tiriSalvezzaClasse = ["forza", "costituzione"]; // coerente con la classe

  // 3. Nome
  png.nome = `${generaNomeCasuale()} ${generaCognomeCasuale()}`;

  // 4. Stats (4d6 drop lowest)
  const rolls = tiraStats().sort((a, b) => b - a);
  const ordine = ["forza", "destrezza", "costituzione", "intelligenza", "saggezza", "carisma"];
  const statsBase = {};
  ordine.forEach((s, i) => (statsBase[s] = rolls[i]));

  png.stats = statsBase;

  // 5. Background
  const bg = casuale(backgrounds);
  png.background = bg.name;
  png.abilitaBackground = bg.starting_proficiencies.join(", ");
  png.lingueBackground = bg.languages.join(", ") || "Nessuna";

  // 6. Equipaggiamento
  const equipPerClasse = {
    guerriero: ["Spada lunga", "Scudo di legno", "Cotta di maglia", "Razioni x5", "Torcia x2"],
    mago: ["Bastone", "Libro degli incantesimi", "Tunica", "Borsa di componenti", "Focus arcano (Ametista incisa)"],
    ladro: ["Pugnale", "Mantello scuro", "Attrezzi da scasso", "Borsa di monete", "Razioni x5", "Dadi truccati"],
    chierico: ["Morningstar", "Simbolo sacro (Rosario d'ebano)", "Armatura a scaglie", "Scudo di legno", "Razioni x5", "Torcia x2"],
    ranger: ["Arco lungo", "Freccia", "Armatura di cuoio", "Borsa di erbe medicinali", "Razioni x5"],
    druido: ["Bastone", "Totem", "Tunica di pelle", "Borsa di erbe", "Razioni x5", "Totem druidico (Artiglio di lupo)"],
    barbaro: ["Ascia bipenne", "Scudo di legno", "Armatura di pelle", "Razioni x5", "Torcia x2"],
    bardo: ["Lira", "Spada corta", "Abito colorato", "Borsa di monete", "Razioni x5"],
    monaco: ["Bastone corto", "Abito da combattimento", "Sandali di cuoio", "Borsa di monete", "Razioni x5"],
    paladino: ["Spada lunga", "Scudo", "Armatura a piastre", "Razioni x5", "Torcia x2", "Simbolo sacro (Mezzo Sole d'argento)"],
  };
const equip = equipPerClasse[classeKey] || ["Pugnale", "Tunica"];
  png.arma = equip[0];
  png.armatura = equip.find((e) => e.toLowerCase().includes("armatura")) || "Tunica";

  png.dettagliArma = armi.find((a) => a.name === png.arma) || {
    name: png.arma,
    damage: { damage_dice: "1d6", damage_type: { name: "Tagliente" } },
    weapon_range: "Melee"
  };
  png.dettagliArmatura = armature.find((a) => a.name === png.armatura) || {
    name: png.armatura,
    ac: 10,
    type: "Leggera"
  };

  png.equipIndossato = `${png.armatura}, ${png.arma}`;
  png.equipPortato = equip.slice(2).join(", ");

  // 7. Calcola PF e CA e bonus attacco
  const dadiVita = { guerriero: 10, mago: 6, ladro: 8, chierico: 8, barbaro: 12, ranger: 10, druido: 8, bardo: 8, monaco: 8, paladino: 10 };
  const dado = dadiVita[png.classe] || 8;
  const modCos = Math.floor((png.stats.costituzione - 10) / 2);
  const modDes = Math.floor((png.stats.destrezza - 10) / 2);
  png.pf = dado + ((dado / 2 + 1) + modCos) * (png.livello - 1);
  png.ca = png.armatura.includes("maglia")
    ? 16
    : png.armatura.includes("cuoio")
    ? 11 + modDes
    : 10 + modDes;

    const modCar = png.dettagliArma.weapon_range === "Melee"
  ? Math.floor((png.stats.forza - 10) / 2)
  : Math.floor((png.stats.destrezza - 10) / 2);
png.bonusAttacco = modCar + proficiencies;

   // 9. Magia (solo classi magiche)
  const classiMagiche = ["mago", "stregone", "warlock", "bardo", "chierico", "druido", "paladino", "ranger"];
  if (classiMagiche.includes(classeKey)) {
    const statMagica = statMagicaPerClasse[classeKey] || "intelligenza";
    const modMagia = mod(statMagica);
    png.magia = {
      caratteristica: statMagica,
      cd: 8 + modMagia + proficiencies,
      bonusAttacco: modMagia + proficiencies,
      focus: generaFocusArcano(classeKey)
    };
    png.slotIncantesimi = slotPerLivello[png.livello] || [4, 3, 3];
    png.incantesimi = []; // Popolati nella modale via API
  }

  // 9. Narrativa
  png.descrizione = generaDescrizioneEvocativa(png);
  png.origine = casuale([
     "Nato e cresciuto in un piccolo villaggio sulle montagne, dove ha imparato a cacciare e a sopravvivere. Divenuto un cacciatore esperto, ora offre le sue abilità per aiutare gli altri.",
  "Ex soldato ora in cerca di redenzione. Ha combattuto in molte battaglie, ma ora cerca di usare le sue abilità per proteggere i più deboli.",
  "Un orfano che ha imparato a sopravvivere per le strade.  Ora usa le sue abilità per aiutare gli altri e per cercare una famiglia che lo accetti.",
  "Un ex ladro che ha deciso di cambiare vita. Ora usa le sue abilità per aiutare gli altri e per cercare un modo per redimersi.",
  "Un vecchio saggio che ha viaggiato per il mondo. Ora vive in un piccolo villaggio, dove offre la sua saggezza e le sue conoscenze a chi ne ha bisogno.",
  "Un giovane apprendista che ha imparato l'arte della magia da un vecchio maestro. Ora cerca di usare le sue abilità per aiutare gli altri e per scoprire il suo vero potere.",
  "Un mercante che ha viaggiato per il mondo, accumulando ricchezze e conoscenze. Ora vive in un piccolo villaggio, dove offre i suoi beni e le sue conoscenze a chi ne ha bisogno.",
  "Un contadino che ha deciso di lasciare la sua vita semplice per cercare avventure. Ora usa le sue abilità per aiutare gli altri e per scoprire il mondo.",
  "Un ex artigiano che ha deciso di lasciare la sua bottega per cercare avventure. Ora usa le sue abilità per aiutare gli altri e per scoprire il mondo.",

  ]);
  png.ruolo = casuale(["Alleato", "Traditore", "Guida", "Mentore", "Mercante", "Contatto", "Nemico", "Sfidante", "Sostenitore", "Testimone", "Vittima"]);
  png.collegamento = "Collegato a Capitolo 1";

  // 10. Loot
  png.loot = [
    { nome: "Pozione di guarigione", rarita: "Comune" },
    { nome: "Gemma scintillante", rarita: "Comune" },
  ];

  return png;
}
