import { casuale, rand, tiraStats, generaNomeCasuale, generaCognomeCasuale, generaDescrizioneEvocativa } from "./generators";
import { classes } from "./classes"; // API locale
import { razze } from "./races";     // API locale 
import { spells } from "./spells";
import { backgrounds } from "./backgrounds";

const statMagicaPerClasse = {
  mago: "intelligenza",
  stregone: "carisma",
  warlock: "carisma",
  bardo: "carisma",
  chierico: "saggezza",
  druido: "saggezza",
  paladino: "carisma",
  ranger: "saggezza",
  monaco: "saggezza"
};
const abilitaPerStat = {
  forza: ["Atletica"],
  destrezza: ["Acrobazia", "Furtività", "Rapidità di mano"],
  costituzione: [],
  intelligenza: ["Arcano", "Indagare", "Storia", "Natura", "Religione"],
  saggezza: ["Percezione", "Intuizione", "Medicina", "Sopravvivenza", "Addestrare Animali"],
  carisma: ["Persuasione", "Inganno", "Intrattenere", "Intimidire"]
};

export const slotPerClasse = {
  fullCaster: {
    1: [2],
    2: [3],
    3: [4, 2],
    4: [4, 3],
    5: [4, 3, 2],
    6: [4, 3, 3],
    7: [4, 3, 3, 1],
    8: [4, 3, 3, 2],
    9: [4, 3, 3, 3, 1]
  },
  halfCaster: {
    1: [2],
    2: [2],
    3: [3],
    4: [3],
    5: [4, 2],
    6: [4, 2],
    7: [4, 3],
    8: [4, 3],
    9: [4, 3, 2]
  }
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
    return casuale(focusPerClasse[classe] || ["Cristallo mistico con venature luminose"]);
}

export function generaPNGNonComuneCompleto(opzioni = {}) {
  const png = {};

  // 1. Livello
  png.livello = opzioni.livello || rand(3, 10);
  const proficienza = Math.ceil(png.livello / 4) + 2;

  // 2. Razza e Classe (da API locali)
  const razzaKey = casuale(Object.keys(razze));
  const classeKey = casuale(classes.map(c => c.index));

  const razzaData = razze[razzaKey];
  const classeData = classes.find(c => c.index === classeKey);

  png.razza = razzaData.name;
  png.classe = classeData.name;

  // 3. Sottoclasse
  png.sottoclasse = casuale(classeData.subclasses)?.name || "";

  // 4. Nome PNG
  png.nome = `${generaNomeCasuale()} ${generaCognomeCasuale()}`;

  // 5. Stats
  // Ordine preferenze per ogni classe
const prioritaStat = {
  barbaro: ["forza", "costituzione"],
  bardo: ["carisma", "destrezza"],
  chierico: ["saggezza", "costituzione"],
  druido: ["saggezza", "costituzione"],
  guerriero: ["forza", "costituzione"],
  ladro: ["destrezza", "intelligenza"],
  mago: ["intelligenza", "costituzione"],
  monaco: ["destrezza", "saggezza"],
  paladino: ["forza", "carisma"],
  ranger: ["destrezza", "saggezza"],
  stregone: ["carisma", "costituzione"],
  warlock: ["carisma", "costituzione"]
};

// Tiro delle stats e ordinamento
const rolls = tiraStats().sort((a, b) => b - a);
const ordine = ["forza", "destrezza", "costituzione", "intelligenza", "saggezza", "carisma"];
const priorita = prioritaStat[classeKey] || ordine;

// Distribuzione basata sulla priorità
png.stats = {};
let i = 0;
priorita.forEach((stat) => {
  png.stats[stat] = rolls[i++];
});

// Completiamo le rimanenti
ordine.forEach((stat) => {
  if (!png.stats[stat]) {
    png.stats[stat] = rolls[i++];
  }
});

// Aggiunta bonus razziali
razzaData.ability_bonuses.forEach((bonus) => {
  if (png.stats[bonus.ability_score] !== undefined) {
    png.stats[bonus.ability_score] += bonus.bonus;
  }
});

  // 6. Bonus razziali
  png.bonusRaziali = razzaData.ability_bonuses.map(b => `${b.ability_score}: +${b.bonus}`).join(", ") || "Nessuno";

  // 7. Competenze e abilità a scelta
  png.privilegiClasse = classeData.proficiencies;
  png.competenzeScelte = classeData.proficiency_choices[0]?.from || [];
  const sceltaAbilita = classeData.proficiency_choices[0];
const abilitaScelte = [];
if (sceltaAbilita) {
  const opzioni = sceltaAbilita.from;
  for (let i = 0; i < sceltaAbilita.choose; i++) {
    const scelta = casuale(opzioni);
    if (!abilitaScelte.includes(scelta)) abilitaScelte.push(scelta);
  }
}
png.abilitaClasse = abilitaScelte;


  // 8. Privilegi filtrati per livello
  png.privilegiDettagliati = classeData.features.filter(f => f.level <= png.livello);

  // 9. PF e CA
  const modCos = Math.floor((png.stats.costituzione - 10) / 2);
  png.pf = (classeData.hit_die || 8) + (png.livello - 1) * ((classeData.hit_die || 8) / 2 + modCos);
  png.ca = 10 + Math.floor((png.stats.destrezza - 10) / 2);

  // 10. Tiri salvezza
  png.savingThrowsClasse = classeData.saving_throws || [];
png.tiriSalvezza = {};
ordine.forEach((stat) => {
  const mod = Math.floor((png.stats[stat] - 10) / 2);
  png.tiriSalvezza[stat] = mod + (png.savingThrowsClasse.includes(stat) ? proficienza : 0);
});

  // 11. Equipaggiamento
  png.equipIndossato = (classeData.equipaggiamento || ["Abiti comuni", "Zaino", "Razioni"]).join(", ");
  png.equipPortato = "Oggetti vari";

  // 12. Magia
  function getIncantesimiPerClasse(classeKey, livello) {
  const spellData = spells[classeKey];
  if (!spellData) return {};

  const incantesimi = { cantrips: [], level1: [], level2: [] };

  // Trucchetti
  const maxCantrips = Math.min(3 + Math.floor(livello / 4), 6);
  incantesimi.cantrips = spellData.cantrips.slice(0, maxCantrips);

  // Livello 1
  if (spellData.level1) {
    incantesimi.level1 = spellData.level1.slice(0, Math.min(livello + 1, spellData.level1.length));
  }

  // Livello 2 (dal livello 3)
  if (livello >= 3 && spellData.level2) {
    incantesimi.level2 = spellData.level2.slice(0, Math.min(livello - 2, spellData.level2.length));
  }

  return incantesimi;
}
  const classiMagiche = ["mago", "stregone", "warlock", "bardo", "chierico", "druido", "paladino", "ranger"];
  if (classiMagiche.includes(classeKey)) {
    const statMagica = statMagicaPerClasse[classeKey] || "intelligenza";
    const modMagia = Math.floor((png.stats[statMagica] - 10) / 2);
    png.magia = {
      caratteristica: statMagica,
      cd: 8 + modMagia + proficienza,
      bonusAttacco: modMagia + proficienza,
      focus: generaFocusArcano(classeKey)
    };
    png.slotIncantesimi = [4, 3, 2]; // esemplificativo
     png.incantesimi = getIncantesimiPerClasse(classeKey, png.livello);
  }

  // 13. Narrativa
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

  return png;
}
