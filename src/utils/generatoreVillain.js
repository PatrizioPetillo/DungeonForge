import { casuale, rand, tiraStats, generaNomeCasuale, generaCognomeCasuale, generaDescrizioneEvocativa } from "./generators";
import { classes } from "./classes"; // API locale
import { razze } from "./races";     // API locale 
import { spells } from "./spells";
import { armi } from "./armi";
import { armature } from "./armature";
import { backgrounds } from "./backgrounds";

// Tabelle di supporto
const equipVariBase = [
  "Corda di canapa (15m)",
  "Otre d’acqua",
  "10 torce",
  "Pozione di guarigione",
  "Zaino",
  "Kit da esploratore",
];

const lootVillain = [
  "Gemma Insanguinata",
  "Talismano Maledetto",
  "Anello Oscuro",
  "Reliquia Antica",
  "Pergamena Proibita",
  "Pugnale Cerimoniale",
];

const frasiLoot = [
  "Avvolto in una leggera foschia scura, questo oggetto emana un'aura di potere oscuro.",
  "Le rune incise su questo talismano pulsano di energia maligna.",
  "Questo pugnale sembra assorbire la luce intorno a sé, lasciando solo un'ombra.",
  "Un antico sigillo è inciso su questa gemma, promettendo potere a chi lo possiede.",
  "Questo anello sembra emanare un freddo innaturale, come se contenesse un'anima intrappolata.",
  "La superficie di questa reliquia è coperta da un sottile strato di cenere, come se fosse stata in un incendio.",
  "Questo oggetto sembra pulsare leggermente, come se avesse un cuore oscuro.",
  "Questo anello sembra assorbire la luce intorno a sé.",
];

const oggettiBackground = {
  "Nobile": ["Sigillo di famiglia", "Anello con stemma"],
  "Spia": ["Kit da avvelenatore", "Mantello nero"],
  "Eremita": ["Diario di profezie", "Amuleto runico"],
  "Accolito": ["Simbolo sacro profanato", "Calice rituale"],
};

const oggettiClasse = {
  Fighter: ["Pietra per affilare", "Arma di riserva", "Olio per armature"],
  Paladin: ["Simbolo sacro corrotto", "Ampolla di acqua nera", "Mantello rituale"],
  Rogue: ["Strumenti da ladro", "Mantello scuro", "Pozione di veleno"],
  Wizard: ["Tomo antico", "Pergamena arcana", "Sacchetto di reagenti"],
  Sorcerer: ["Cristallo runico", "Ampolla di sangue magico"],
  Warlock: ["Libro proibito", "Simbolo di un patrono oscuro"],
  Cleric: ["Rosario profanato", "Calice rituale"],
  Druid: ["Totem spezzato", "Pietra runica", "Sacchetto di semi"],
};

const variantiClasse = {
  Fighter: ["del Sangue", "Campione Oscuro", "Guerriero Maledetto"],
  Paladin: ["Rinnegato", "Crociato Oscuro", "Vendicatore Empio"],
  Rogue: ["delle Ombre", "Assassino Silente", "Predatore Notturno"],
  Wizard: ["delle Ombre", "Arcanista Corrotto", "Evocatore delle Tenebre"],
  Sorcerer: ["della Carne", "Vincolato al Caos", "Incantatore Empio"],
  Warlock: ["del Patto Oscuro", "Vincolato all'Abisso", "Servo degli Dei Neri"],
  Cleric: ["Empio", "Sacerdote Corrotto", "Profeta della Rovina"],
  Druid: ["degli Alberi Morti", "Sciamano Oscuro", "Guardiano Corrotto"],
};

const variantiBackground = ["Corrotto", "Oscuro", "Caduto", "Perduto", "Segreto"];

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

export function generaVillainCompleto(opzioni = {}) {
  const villain = {};

  // 1. Livello
  villain.livello = opzioni.livello || rand(3, 10);
  const proficienza = Math.ceil(villain.livello / 4) + 2;

  // 2. Razza e Classe (da API locali)
  const razzaKey = casuale(Object.keys(razze));
  const classeKey = casuale(classes.map(c => c.index));

  const razzaData = razze[razzaKey];
  const classeData = classes.find(c => c.index === classeKey);

  villain.razza = razzaData.name;
  villain.linguaggi = razzaData.languages || [];
  // Privilegi e talenti razziali
  villain.privilegiRazza = (razzaData.traits || []).map(trait => ({
    nome: trait.name,
    descrizione: trait.desc || ""
  }));
  villain.velocita = razzaData.speed || 9; // in metri
  const varianteClasse = casuale(variantiClasse[classeData.name] || []);
villain.classeEvocativa = `${villain.classe} ${varianteClasse}`;

  villain.dadoVita = classeData.hit_die || 8;

  // 3. Sottoclasse
  villain.sottoclasse = casuale(classeData.subclasses)?.name || "";

  // 4. Nome villain
  villain.nome = `${generaNomeCasuale()} ${generaCognomeCasuale()}`;

  const allineamenti = [
  "Legale Malvagio",
  "Neutrale Malvagio",
  "Caotico Malvagio",
  "Legale Neutrale",
  "Neutrale Puro",
  "Caotico Neutrale"
];

villain.allineamento = casuale(allineamenti);


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
villain.stats = {};
let i = 0;
priorita.forEach((stat) => {
  villain.stats[stat] = rolls[i++];
});

// Completiamo le rimanenti
ordine.forEach((stat) => {
  if (!villain.stats[stat]) {
    villain.stats[stat] = rolls[i++];
  }
});

// Aggiunta bonus razziali
razzaData.ability_bonuses.forEach((bonus) => {
  if (villain.stats[bonus.ability_score] !== undefined) {
    villain.stats[bonus.ability_score] += bonus.bonus;
  }
});

  // 6. Bonus razziali
  villain.bonusRaziali = razzaData.ability_bonuses.map(b => `${b.ability_score}: +${b.bonus}`).join(", ") || "Nessuno";

  // 7. Competenze e abilità a scelta
  villain.privilegiClasse = classeData.proficiencies;
  villain.competenzeScelte = classeData.proficiency_choices[0]?.from || [];
  const sceltaAbilita = classeData.proficiency_choices[0];
const abilitaScelte = [];
if (sceltaAbilita) {
  const opzioni = sceltaAbilita.from;
  for (let i = 0; i < sceltaAbilita.choose; i++) {
    const scelta = casuale(opzioni);
    if (!abilitaScelte.includes(scelta)) abilitaScelte.push(scelta);
  }
}
villain.abilitaClasse = abilitaScelte;


  // 8. Privilegi filtrati per livello
  villain.privilegiDettagliati = classeData.features.filter(f => f.level <= villain.livello);

  // 9. PF e CA
  const modCos = Math.floor((villain.stats.costituzione - 10) / 2);
  villain.pf = (classeData.hit_die || 8) + (villain.livello - 1) * ((classeData.hit_die || 8) / 2 + modCos);
  villain.ca = 10 + Math.floor((villain.stats.destrezza - 10) / 2);

  // 10. Tiri salvezza
  villain.savingThrowsClasse = classeData.saving_throws || [];
villain.tiriSalvezza = {};
ordine.forEach((stat) => {
  const mod = Math.floor((villain.stats[stat] - 10) / 2);
  villain.tiriSalvezza[stat] = mod + (villain.savingThrowsClasse.includes(stat) ? proficienza : 0);
});

  // 11. Equipaggiamento
  const equipBase = equipBasePerClasse[classeKey] || { armi: [], armature: [] };
villain.armiEquippate = getEquipFromIds(equipBase.armi, armi);
villain.armatureIndossate = getEquipFromIds(equipBase.armature, armature);
// Ricalcolo CA dinamica
villain.ca = calcolaCA(villain.stats, villain.armatureIndossate);
villain.equipVari = [
  ...(equipBase.equipaggiamento || []),
  "10 torce",
  "Corda di canapa (15 m)",
  "Razions da viaggio (5 giorni)",
  "Otre d’acqua",
  "Acciarino e pietra focaia"
];
// Aggiunta equipaggiamento base
villain.equipVari.push(...equipVariBase);
// Aggiunta oggetti casuali
villain.equipVari.push(...Array.from({ length: rand(1, 3) }, () => casuale(lootVillain)));
// Aggiunta equipaggiamento specifico per classe
villain.equipVari.push(...(equipBase.equipaggiamento || []));
// Aggiunta armi e armature specifiche
villain.armiEquippate.push(...getEquipFromIds(classeData.starting_equipment?.weapons || [], armi));
villain.armatureIndossate.push(...getEquipFromIds(classeData.starting_equipment?.armor || [], armature));
villain.loot = [
  `${casuale(lootVillain)} — ${casuale(frasiLoot)}`,
];

// Focus arcano se presente
if (equipBase.focusArcano) {
  villain.focusArcano = equipBase.focusArcano;
}

villain.equipVari.push(...(oggettiClasse[classeData.name] || []));
const bg = casuale(Object.keys(oggettiBackground));
villain.background = { nomeEvocativo: `${bg} ${casuale(variantiBackground)}` };
villain.equipVari.push(...oggettiBackground[bg]);



// Penalità se indossa armatura pesante senza forza minima
villain.armatureIndossate.forEach(a => {
  if (a.armor_category === "Heavy" && a.strength_minimum && villain.stats.forza < a.strength_minimum) {
    villain.velocita -= 3; // riduzione di 3 metri
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
    const modMagia = Math.floor((villain.stats[statMagica] - 10) / 2);

    villain.magia = {
      caratteristica: statMagica,
      cd: 8 + modMagia + proficienza,
      bonusAttacco: modMagia + proficienza,
      focus: generaFocusArcano(classeKey.toLowerCase())
    };

    villain.slotIncantesimi = classiFullCaster.includes(classeKey)
    ? slotFullCaster[villain.livello] || []
    : slotHalfCaster[villain.livello] || [];

  const spellData = spells[classeKey];
  villain.incantesimi = [];

  if (spellData) {
    // Cantrips
    const maxCantrips = Math.min(3 + Math.floor(villain.livello / 4), spellData.cantrips?.length || 0);
    villain.incantesimi.push(
      ...spellData.cantrips.slice(0, maxCantrips).map(sp => ({
        nome: sp.name,
        livello: sp.level,
        scuola: sp.school,
        gittata: sp.range,
        componenti: sp.components,
        durata: sp.duration,
        descrizione: sp.desc
      }))
    );


    // Incantesimi per livello
    for (let lvl = 1; lvl <= villain.livello && lvl <= 5; lvl++) {
      const key = `level${lvl}`;
      if (spellData[key]) {
        const numSpells = Math.min(2, spellData[key].length);
        villain.incantesimi.push(
          ...spellData[key].slice(0, numSpells).map(sp => ({
            nome: sp.name,
            livello: sp.level,
            scuola: sp.school,
            gittata: sp.range,
            componenti: sp.components,
            durata: sp.duration,
            descrizione: sp.desc
          }))
        );
      }
    }
  }
}  
  
  // 13. Narrativa
  villain.descrizione = generaDescrizioneEvocativa(villain);
  villain.origine = casuale([
  "Un tempo un eroe, ora corrotto da un potere antico che lo ha trasformato in ciò che odiava.",
  "Figlio di un culto oscuro, allevato per essere il prescelto di un dio dimenticato.",
  "Un mago brillante caduto in disgrazia, ossessionato dalla conoscenza proibita.",
  "Un ex campione della luce che ha giurato vendetta dopo il tradimento del suo ordine.",
  "Un nobile decaduto che trama per riprendersi il potere con ogni mezzo.",
  "Un guerriero sopravvissuto a mille battaglie, deciso a imporre un nuovo ordine con il ferro e il sangue.",
  "Creato da un rituale proibito, è la fusione di carne, ombra e follia.",
  "Una vittima del fato che ora cerca di piegare il destino alla propria volontà.",
  "Un servo devoto di un’entità cosmica che brama il caos eterno.",
  "Il portatore di una maledizione millenaria, costretto a distruggere tutto ciò che ama.",
  "Un assassino leggendario, la cui fama è superata solo dalla sua sete di sangue.",
  "Un ex eroe caduto in disgrazia, ora un simbolo di terrore per coloro che un tempo proteggeva."
]);
  villain.narrativa = {
  obiettivo: casuale([
    "Conquistare un regno caduto in rovina e riportarlo alla gloria passata", 
    "Vendicarsi dei traditori che hanno distrutto la sua vita", 
    "Risvegliare un potere antico per dominare il mondo",
    "Recuperare un artefatto perduto che gli conferisce poteri divini",
    "Proteggere un antico santuario dedicato a Bane, il dio della guerra e della conquista",
    "Soggiogare un antico drago cosi che possa usarne il potere per i suoi scopi",
    "Sconfiggere un antico demone e prenderne il posto come suo successore",
    "Liberare un potente spirito maligno per scatenare il caos nel mondo",
    "Diventare il campione di un'entità oscura e diffondere la sua influenza",
    "Sottomettere un antico ordine di cavalieri per usarne le risorse e l'influenza",
  ]),
  motivazione: casuale([
    "Ossessione per il potere e il dominio, determinato a sottomettere chiunque osi opporsi",
    "Desiderio di vendetta per un torto subito, disposto a tutto pur di ottenere giustizia",
    "Servizio a un'entità oscura che gli ha conferito poteri proibiti in cambio della sua anima",
    "Ricerca di conoscenza proibita, disposto a sacrificare tutto per scoprire i segreti dell'universo",
    "Ambizione sfrenata di diventare il più grande eroe o villain della storia, cercando fama e gloria",
    "Desiderio di proteggere i più deboli, ma con metodi estremi e violenti che lo portano a scontrarsi con gli eroi",
    "Volontà di dimostrare la propria superiorità, cercando di sconfiggere chiunque lo sfidi",
    "Ricerca di un senso di appartenenza, ma attraverso mezzi distruttivi che lo allontanano da chi ama",
    "Desiderio di creare un nuovo ordine mondiale, dove solo i più forti sopravvivono",
    "Fuga da un passato traumatico, cercando di ricostruire la propria identità"
  ]),
  origine: villain.origine // già generata
};


  return villain;
}
