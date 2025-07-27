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

export function generaVillain(opzioni = {}) {
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
  villain.classe = classeData.name;
  villain.dadoVita = classeData.hit_die || 8;

  // 3. Sottoclasse
  villain.sottoclasse = casuale(classeData.subclasses)?.name || "";

  // 4. Nome villain
  villain.nome = `${generaNomeCasuale()} ${generaCognomeCasuale()}`;

  // 5. Stats
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
const rolls = tiraStats().sort((a, b) => b - a); // valori decrescenti
const ordine = ["forza", "destrezza", "costituzione", "intelligenza", "saggezza", "carisma"];
const priorita = prioritaStat[classeKey] || ordine;

// Reset stats
villain.stats = {};

// 1. Stat principale (es. INT per mago)
const statPrincipale = priorita[0];
villain.stats[statPrincipale] = rolls.shift(); // assegna il più alto alla stat chiave

// 2. Stat secondaria (es. Cos per mago)
const statSecondaria = priorita[1];
villain.stats[statSecondaria] = rolls.shift();

// 3. Le restanti stat in ordine casuale
ordine.forEach(stat => {
  if (!villain.stats[stat]) {
    villain.stats[stat] = rolls.shift();
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
 // Normalizza i TS della classe
villain.savingThrowsClasse = (classeData.saving_throws || []).map(ts => ts.toLowerCase());

// Calcolo TS solo per caratteristiche competenti
villain.tiriSalvezza = villain.savingThrowsClasse.map(stat => {
  const mod = Math.floor((villain.stats[stat] - 10) / 2);
  return {
    stat,
    bonus: mod + proficienza
  };
});

  // 11. Equipaggiamento
  const equipBase = equipBasePerClasse[classeKey] || { armi: [], armature: [] };
// 1. Filtra le armi e armature di competenza
villain.armiDiCompetenza = armi.filter(a =>
  a.categorie.some(cat => classeData.proficiencies.includes(cat))
);

villain.armatureIndossate = [];
villain.armatureDiCompetenza = armature.filter(a =>
  a.categorie.some(cat => classeData.proficiencies.includes(cat))
);

// Seleziona arma da mischia
const armiMischia = villain.armiDiCompetenza.filter(a => a.categorie.includes("Mischia"));
villain.armaMischia = armiMischia.length > 0
  ? casuale(armiMischia)
  : armi.find(a => a.index === "dagger");

  // Seleziona arma a distanza
const armiDistanza = villain.armiDiCompetenza.filter(a => a.categorie.includes("A distanza"));
villain.armaDistanza = armiDistanza.length > 0
  ? casuale(armiDistanza)
  : null;

// 3. Seleziona un'armatura coerente (preferendo la più protettiva possibile)
const armatureOrdinate = villain.armatureDiCompetenza.sort((a, b) => (b.armor_class.base) - (a.armor_class.base));
villain.armaturaEquipaggiata = armatureOrdinate.length > 0
  ? armatureOrdinate[0]
  : armature.find(a => a.index === "leather-armor");

// 4. Controlla se lo scudo è tra le competenze e aggiungilo
villain.scudoEquipaggiato = villain.armatureDiCompetenza.find(a => a.categorie.includes("Scudo")) || null;

// 5. Calcola CA dinamica
const modDex = Math.floor((villain.stats.destrezza - 10) / 2);
let caBase = villain.armaturaEquipaggiata.armor_class.base;
if (villain.armaturaEquipaggiata.armor_class.dex_bonus) {
  caBase += villain.armaturaEquipaggiata.armor_class.max_bonus
    ? Math.min(modDex, villain.armaturaEquipaggiata.armor_class.max_bonus)
    : modDex;
}
if (villain.scudoEquipaggiato) caBase += villain.scudoEquipaggiato.armor_class.base;

villain.ca = caBase;

villain.equipVari = [
  ...(equipBase.equipaggiamento || []),
  "10 torce",
  "Corda di canapa (15 m)",
  "Razions da viaggio (5 giorni)",
  "Otre d’acqua",
  "Acciarino e pietra focaia"
];
// Focus arcano se presente
if (equipBase.focusArcano) {
  villain.focusArcano = equipBase.focusArcano;
}

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
  villain.descrizione = casuale([
    `Un ${villain.razza} dall'aspetto inquietante. Alt, per la propria razza, con occhi che brillano di una luce sinistra. La sua voce è profonda e carismatica, capace di incantare o terrorizzare chiunque la ascolti. Il viso è segnato da cicatrici, segno di una vita di battaglie e tradimenti.
    Indossa vesti prettamente scure, decorate con simboli arcani, e brandisce un'arma che sembra pulsare di energia oscura. La sua presenza è opprimente, come se l'aria stessa si piegasse alla sua volontà.`,
    `Un ${villain.razza} di bassa statura, ma con una presenza che riempie la stanza. I suoi occhi sono freddi e calcolatori, e il suo sorriso è più un ghigno che un gesto amichevole. Indossa abiti eleganti ma logori, e porta con sé un bastone intarsiato che sembra avere una vita propria.
    La sua voce è melodiosa, ma le sue parole sono velenose. Si muove con grazia felina, e ogni suo gesto è calcolato per impressionare o intimidire. La sua aura è quella di un maestro della manipolazione, capace di piegare gli altri alla sua volontà senza sforzo.`,
    `Un ${villain.razza} alto e muscoloso, con una cicatrice che gli attraversa il volto. I suoi occhi sono di un blu profondo, e la sua voce è roca e potente. La pelle di un leggero color bronzo è segnata da cicatrici e tatuaggi che raccontano storie di battaglie passate. Indossa un'armatura pesante, segnata da numerose battaglie, e brandisce un'enorme spada che sembra essere stata forgiata in un altro mondo.
    La sua presenza è imponente, e il suo sguardo è quello di un guerriero esperto, pronto a combattere fino alla morte. La sua pelle è segnata da tatuaggi tribali che raccontano storie di vittorie e onore, e il suo atteggiamento è quello di un leader nato, capace di ispirare paura e rispetto in egual misura.`,
    `Un ${villain.razza} di aspetto fragile, ma con un'intelligenza acuta. I suoi occhi sono di un verde brillante, e la sua voce è calma e misurata. Indossa abiti semplici, ma eleganti, e porta con sé un libro di incantesimi che sembra emanare un'aura di potere. La sua presenza è quella di un intellettuale, capace di risolvere enigmi e problemi complessi con facilità.
    La sua mente è un labirinto di conoscenze arcane, e ogni parola che pronuncia è carica di significato. La sua voce è melodiosa, e il suo sguardo è quello di un maestro della magia, capace di incantare o distruggere con un semplice gesto.`,
    `Un ${villain.razza} di aspetto inquietante, con una pelle pallida e occhi che sembrano scrutare l'anima. La sua voce è bassa e sussurrante, capace di incutere timore in chiunque la ascolti. Indossa abiti scuri, decorati con simboli arcani, e porta con sé un libro di incantesimi che sembra pulsare di energia oscura.
    La sua presenza è opprimente, come se l'aria stessa si piegasse alla sua volontà. La sua pelle è segnata da cicatrici e tatuaggi che raccontano storie di oscurità e potere, e il suo sguardo è quello di un maestro della magia oscura, capace di evocare creature terribili e incantesimi proibiti.`,
    `Un ${villain.razza} di aspetto elegante, con un sorriso che può incantare o ingannare. I suoi occhi sono di un grigio profondo, e la sua voce è melodiosa e persuasiva. Indossa abiti raffinati, decorati con gemme preziose, e porta con sé un bastone intarsiato che sembra avere una vita propria.
    La sua presenza è quella di un maestro della manipolazione, capace di piegare gli altri alla sua volontà con un semplice sguardo. La sua mente è un labirinto di inganni e strategie, e ogni parola che pronuncia è carica di significato. Il suo sorriso è quello di un maestro del gioco, capace di muovere le pedine sullo scacchiere della vita con abilità e astuzia.`,
    `Un ${villain.razza} di aspetto minaccioso, con una cicatrice che gli attraversa il volto e occhi che brillano di una luce sinistra. La sua voce è profonda e carismatica, capace di incutere timore in chiunque la ascolti. Indossa un'armatura pesante, segnata da numerose battaglie, e brandisce un'enorme spada che sembra essere stata forgiata in un altro mondo.
    La sua presenza è imponente, e il suo sguardo è quello di un guerriero esperto, pronto a combattere fino alla morte. La sua pelle è segnata da cicatrici e tatuaggi che raccontano storie di vittorie e onore, e il suo atteggiamento è quello di un leader nato, capace di ispirare paura e rispetto in egual misura.`,
    `Un ${villain.razza} dall'aspetto elegante, con una pelle pallida e occhi che sembrano scrutare l'anima. La sua voce è bassa e sussurrante, capace di incutere timore in chiunque la ascolti. Indossa abiti scuri, decorati con simboli arcani, e porta con sé un libro di incantesimi che sembra pulsare di energia oscura.
    La sua presenza è opprimente, come se l'aria stessa si piegasse alla sua volontà. La sua pelle è segnata da cicatrici e tatuaggi che raccontano storie di oscurità e potere, e il suo sguardo è quello di un maestro della magia oscura, capace di evocare creature terribili e incantesimi proibiti.`,
    `Un ${villain.razza} di aspetto inquietante, con una pelle pallida e occhi che brillano di una luce sinistra. La sua voce è profonda e carismatica, capace di incutere timore in chiunque la ascolti. Indossa vesti prettamente scure, decorate con simboli arcani, e brandisce un'arma che sembra pulsare di energia oscura. Indossa un'armatura leggera, ma resistente, che gli consente di muoversi agilmente sul campo di battaglia.
    Ha una presenza leggera e agile, capace di muoversi con grazia felina. La sua voce è melodiosa, ma le sue parole sono velenose. Si muove con grazia felina, e ogni suo gesto è calcolato per impressionare o intimidire. La sua aura è quella di un maestro della manipolazione, capace di piegare gli altri alla sua volontà senza sforzo.`,
  ]);
  villain.origine = casuale([
  "Un tempo un eroe, ora corrotto da un potere antico che lo ha trasformato in ciò che odiava. Determinato a dimostrare la propria superiorità, cerca di sconfiggere chiunque lo sfidi.",
  "Figlio di un culto oscuro, allevato per essere il prescelto di un dio dimenticato. La sua vita è un susseguirsi di rituali e sacrifici, e ora cerca di risvegliare il potere del suo dio per dominare il mondo.",
  "Un mago brillante caduto in disgrazia, ossessionato dalla conoscenza proibita. Ha trascorso anni a studiare antichi tomi e a praticare rituali oscuri, e ora cerca di risvegliare un potere antico per dominare il mondo.",
  "Un ex campione della luce che ha giurato vendetta dopo il tradimento del suo ordine. Ora si è unito a un culto oscuro, cercando di risvegliare un potente spirito maligno per scatenare il caos nel mondo.",
  "Un nobile decaduto che trama per riprendersi il potere con ogni mezzo. La sua vita è un susseguirsi di intrighi e tradimenti, e ora cerca di sottomettere un antico ordine di cavalieri per usarne le risorse e l'influenza.",
  "Un guerriero sopravvissuto a mille battaglie, deciso a imporre un nuovo ordine con il ferro e il sangue. La sua vita è un susseguirsi di battaglie e conquiste, e ora cerca di conquistare un regno caduto in rovina e riportarlo alla gloria passata.",
  "Creato da un rituale proibito, è la fusione di carne, ombra e follia. La sua esistenza è un tormento, e ora cerca di liberarsi dalla maledizione che lo affligge.",
  "Una vittima del fato che ora cerca di piegare il destino alla propria volontà. La sua vita è un susseguirsi di eventi tragici e oscuri, e ora cerca di creare un nuovo ordine mondiale, dove solo i più forti sopravvivono.",
  "Un servo devoto di un’entità cosmica che brama il caos eterno. La sua vita è un susseguirsi di rituali e sacrifici, e ora cerca di liberare un potente spirito maligno per scatenare il caos nel mondo.",
  "Il portatore di una maledizione millenaria, costretto a distruggere tutto ciò che ama. La sua vita è un susseguirsi di tragedie e distruzioni, e ora cerca di fuggire da un passato traumatico, cercando di ricostruire la propria identità.",
  "Un assassino leggendario, la cui fama è superata solo dalla sua sete di sangue. La sua vita è un susseguirsi di omicidi e tradimenti, e ora cerca di dimostrare la propria superiorità, cercando di sconfiggere chiunque lo sfidi.",
  "Un ex eroe caduto in disgrazia, ora un simbolo di terrore per coloro che un tempo proteggeva. La sua vita è un susseguirsi di battaglie e tradimenti, e ora cerca di vendicarsi dei traditori che hanno distrutto la sua vita.",
]);
  villain.narrativa = {
  obiettivo: casuale([
    "Conquistare un regno caduto in rovina e riportarlo alla gloria passata con la forza e l'inganno.",
    "Vendicarsi dei traditori che hanno distrutto la sua vita e della sua reputazione, distruggendo chiunque osi opporsi.",
    "Risvegliare un potere antico per dominare il mondo e piegare le forze oscure alla sua volontà.",
    "Recuperare un artefatto perduto che gli conferisce poteri divini e lo rende invincibile.",
    "Proteggere un antico santuario dedicato a Bane, il dio della guerra e della conquista , e usarne il potere per i suoi scopi.",
    "Soggiogare un antico drago cosi che possa usarne il potere per i suoi scopi e diventare il suo campione.",
    "Sconfiggere un antico demone e prenderne il posto come suo successore e campione.",
    "Liberare un potente spirito maligno per scatenare il caos nel mondo e piegare le forze oscure alla sua volontà.",
    "Diventare il campione di un'entità oscura e diffondere la sua influenza nel mondo, seminando il caos e la distruzione.",
    "Sottomettere un antico ordine di cavalieri per usarne le risorse e l'influenza per i suoi scopi.",
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
