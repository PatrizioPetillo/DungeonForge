import { casuale, rand, tiraStats, generaNomeCasuale, generaCognomeCasuale, generaDescrizioneEvocativa } from "./generators";
import { classes } from "./classes"; // API locale
import { razze } from "./races";     // API locale 
import { spells } from "./spells";
import { armi } from "./armi";
import { armature } from "./armature";
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

const allineamenti = [
  "Legale Buono",
  "Neutrale Buono",
  "Caotico Buono",
  "Legale Neutrale",
  "Neutrale Puro",
  "Caotico Neutrale",
  "Legale Malvagio",
  "Neutrale Malvagio",
  "Caotico Malvagio"
];

const descrizioneAllineamento = {
  "Legale Buono": "Segue un codice morale e cerca di fare del bene. Crede nell'ordine e nella giustizia.",
  "Neutrale Buono": "Agisce per il bene senza preoccuparsi delle leggi o del caos. Cerca di aiutare gli altri.",
  "Caotico Buono": "Agisce per il bene, ma senza seguire regole o leggi. Valuta le situazioni caso per caso.",
  "Legale Neutrale": "Segue le leggi e l'ordine, ma non si preoccupa del bene o del male.",
  "Neutrale Puro": "Non si schiera né con il bene né con il male. Agisce secondo il proprio interesse.",
  "Caotico Neutrale": "Agisce secondo il proprio impulso, senza preoccuparsi delle leggi o delle conseguenze.",
  "Legale Malvagio": "Segue un codice morale distorto e cerca di fare del male. Crede nell'ordine attraverso la forza.",
  "Neutrale Malvagio": "Agisce per il male senza preoccuparsi delle leggi o del caos. Cerca di ottenere potere.",
  "Caotico Malvagio": "Agisce per il male, ma senza seguire regole o leggi. Valuta le situazioni caso per caso."
};

const abilitaPerStat = {
  forza: ["Atletica"],
  destrezza: ["Acrobazia", "Furtività", "Rapidità di mano"],
  costituzione: [],
  intelligenza: ["Arcano", "Indagare", "Storia", "Natura", "Religione"],
  saggezza: ["Percezione", "Intuizione", "Medicina", "Sopravvivenza", "Addestrare Animali"],
  carisma: ["Persuasione", "Inganno", "Intrattenere", "Intimidire"]
};

  const equipBasePerClasse = {
  barbaro: { armi: ["battleaxe"], armature: ["leather-armor"], equipaggiamento: ["Abiti comuni", "Zaino", "Razioni"] },
  bardo: { armi: ["dagger"], armature: ["leather-armor"], equipaggiamento: ["Abiti comuni", "Zaino", "Razioni", "Liuto di quercia bianca"], focusArcano: generaFocusArcano("bard") },
  chierico: { armi: ["warhammer"], armature: ["chain-mail", "shield"], equipaggiamento: ["Abiti comuni", "Giaciglio", "Libro di preghiere", "Zaino", "Razioni"], focusArcano: generaFocusArcano("cleric") },
  druido: { armi: ["dagger"], armature: ["leather-armor"], equipaggiamento: ["Abiti comuni", "Zaino", "Razioni"], focusArcano: generaFocusArcano("druid") },
  guerriero: { armi: ["longsword"], armature: ["chain-mail", "shield"], equipaggiamento: ["Abiti comuni", "Zaino", "Razioni"] },
  ladro: { armi: ["shortsword"], armature: ["leather-armor"], equipaggiamento: ["Abiti comuni", "Zaino", "Razioni"] },
  mago: { armi: ["dagger"], armature: [], equipaggiamento: ["Abiti comuni", "Zaino", "Razioni"], focusArcano: generaFocusArcano("wizard") },
  monaco: { armi: ["shortsword"], armature: [], equipaggiamento: ["Abiti comuni", "Zaino", "Razioni"] },
  paladino: { armi: ["longsword"], armature: ["chain-mail", "shield"], equipaggiamento: ["Abiti comuni", "Zaino", "Razioni"], focusArcano: generaFocusArcano("paladin") },
  ranger: { armi: ["longbow", "shortsword"], armature: ["leather-armor"], equipaggiamento: ["Abiti comuni", "Zaino", "Razioni"] },
  stregone: { armi: ["dagger"], armature: [], equipaggiamento: ["Abiti comuni", "Zaino", "Razioni"], focusArcano: generaFocusArcano("sorcerer") },
  warlock: { armi: ["dagger"], armature: [], equipaggiamento: ["Abiti comuni", "Zaino", "Razioni"], focusArcano: generaFocusArcano("warlock") }
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

function calcolaCA(stats, armatureEquip) {
  let baseCA = 10 + Math.floor((stats.destrezza - 10) / 2);
  armatureEquip.forEach(a => {
    if (a.armor_category === "Shield") {
      baseCA += a.armor_class.base;
    } else {
      baseCA = a.armor_class.base;
      if (a.armor_class.dex_bonus) {
        const modDex = Math.floor((stats.destrezza - 10) / 2);
        baseCA += a.armor_class.max_bonus
          ? Math.min(modDex, a.armor_class.max_bonus)
          : modDex;
      }
    }
  });
  return baseCA;
}

  function getEquipFromIds(ids, lista) {
  return lista.filter(item => ids.includes(item.index));
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

  const allineamentoKey = casuale(allineamenti);

  png.razza = razzaData.name;
  png.linguaggi = razzaData.languages || [];
  png.allineamento = allineamentoKey;
  // Privilegi e talenti razziali
  png.privilegiRazza = (razzaData.traits || []).map(trait => ({
    nome: trait.name,
    descrizione: trait.desc || ""
  }));
  png.velocita = razzaData.speed || 9; // in metri
  png.classe = classeData.name;
  png.dadoVita = classeData.hit_die || 8;

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

// 5A. Linguaggi
const linguaggi = razzaData.languages || [];
png.linguaggi = linguaggi;

  // 6. Bonus razziali
  png.bonusRazziali = razzaData.ability_bonuses.map(b => `${b.ability_score}: +${b.bonus}`).join(", ") || "Nessuno";

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
  const equipBase = equipBasePerClasse[classeKey] || { armi: [], armature: [] };
png.armiEquippate = getEquipFromIds(equipBase.armi, armi);
png.armatureIndossate = getEquipFromIds(equipBase.armature, armature);
// Ricalcolo CA dinamica
png.ca = calcolaCA(png.stats, png.armatureIndossate);
png.equipVari = [
  ...(equipBase.equipaggiamento || []),
  "10 torce",
  "Corda di canapa (15 m)",
  "Razions da viaggio (5 giorni)",
  "Otre d’acqua",
  "Acciarino e pietra focaia"
];
// Focus arcano se presente
if (equipBase.focusArcano) {
  png.focusArcano = equipBase.focusArcano;
}


// Penalità se indossa armatura pesante senza forza minima
png.armatureIndossate.forEach(a => {
  if (a.armor_category === "Heavy" && a.strength_minimum && png.stats.forza < a.strength_minimum) {
    png.velocita -= 3; // riduzione di 3 metri
  }
});

  // 12. Magia
  // Tabella slot per full caster (wizard, cleric, sorcerer, bard, druid)
const slotFullCaster = {
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

// Tabella slot per half caster (paladin, ranger)
const slotHalfCaster = {
  1: [],
  2: [2],
  3: [3],
  4: [3],
  5: [4, 2],
  6: [4, 2],
  7: [4, 3],
  8: [4, 3],
  9: [4, 3, 2],
  10: [4, 3, 3]
};
const classiFullCaster = ["wizard", "sorcerer", "warlock", "bard", "cleric", "druid"];
const classiHalfCaster = ["paladin", "ranger"];
   
  // Se la classe è magica, aggiungiamo le statistiche magiche
  if (classiFullCaster.includes(classeKey) || classiHalfCaster.includes(classeKey)) {
    const statMagica = statMagicaPerClasse[classeKey] || "intelligenza";
    const modMagia = Math.floor((png.stats[statMagica] - 10) / 2);

    png.magia = {
      caratteristica: statMagica,
      cd: 8 + modMagia + proficienza,
      bonusAttacco: modMagia + proficienza,
      focus: generaFocusArcano(classeKey.toLowerCase())
    };

    png.slotIncantesimi = classiFullCaster.includes(classeKey)
    ? slotFullCaster[png.livello] || []
    : slotHalfCaster[png.livello] || [];

  const spellData = spells[classeKey];
  png.incantesimi = [];

  if (spellData) {
    // Cantrips
    const maxCantrips = Math.min(3 + Math.floor(png.livello / 4), spellData.cantrips?.length || 0);
    png.incantesimi = [
  ...png.incantesimi,
  (spellData.cantrips || []).slice(0, maxCantrips).map(sp => ({
        nome: sp.name,
        livello: sp.level,
        scuola: sp.school,
        gittata: sp.range,
        componenti: sp.components,
        durata: sp.duration,
        descrizione: sp.desc
      }))
    ];


    // Incantesimi per livello
    for (let lvl = 1; lvl <= png.livello && lvl <= 5; lvl++) {
      const key = `level${lvl}`;
      if (spellData[key]) {
        const numSpells = Math.min(2, spellData[key].length);
        png.incantesimi = [
  ...png.incantesimi,
  ...spellData.cantrips.slice(0, maxCantrips).map(sp => ({
            nome: sp.name,
            livello: sp.level,
            scuola: sp.school,
            gittata: sp.range,
            componenti: sp.components,
            durata: sp.duration,
            descrizione: sp.desc
          }))
         ];
      }
    }
  }
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
