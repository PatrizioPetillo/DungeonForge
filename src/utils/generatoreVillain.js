import { casuale, rand, tiraStats, generaNomeCasuale, generaCognomeCasuale, generaDescrizioneEvocativa } from "./generators";
import { classes } from "./classes"; // API locale
import { razze } from "./races";     // API locale 
import { evilRaces } from "./evilRaces";
import { spells } from "./spells";
import { armi } from "./armi";
import { armature } from "./armature";
import { oggettiMagici } from "./oggettiMagici";
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

const allineamentiMalvagi = [
  { nome: "Caotico Malvagio", descrizione: "Un agente del caos, spinto dal desiderio di distruggere, dominare o liberare impulsi oscuri." },
  { nome: "Neutrale Malvagio", descrizione: "Agisce per interesse personale, senza remore morali, ma senza distruzioni gratuite." },
  { nome: "Legale Malvagio", descrizione: "Obbedisce a un codice o gerarchia, ma i suoi scopi sono crudeli, oppressivi o tirannici." },
  { nome: "Caotico Neutrale", descrizione: "Imprevedibile, instabile, può sembrare alleato ma tradisce con disinvoltura." },
  { nome: "Legale Neutrale", descrizione: "Agisce per un ordine superiore, disinteressato al bene, ma non apertamente crudele." }
];

const abilitaPerStat = {
  forza: ["Atletica"],
  destrezza: ["Acrobazia", "Furtività", "Rapidità di mano"],
  costituzione: [],
  intelligenza: ["Arcano", "Indagare", "Storia", "Natura", "Religione"],
  saggezza: ["Percezione", "Intuizione", "Medicina", "Sopravvivenza", "Addestrare Animali"],
  carisma: ["Persuasione", "Inganno", "Intrattenere", "Intimidire"]
};

const nomiEvocativiClasse = {
  barbarian: "Bruto Insanguinato",
  bard: "Cantore delle Ombre",
  cleric: "Profeta della Morte",
  druid: "Corrotto delle Radici",
  fighter: "Guerriero del Sangue",
  monk: "Asceta del Vuoto",
  paladin: "Paladino Corrotto",
  ranger: "Predatore Notturno",
  rogue: "Assassino Senz’Anima",
  sorcerer: "Figlio del Caos",
  warlock: "Schiavo dell’Abisso",
  wizard: "Evocatore Oscuro"
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
    wizard: ["Bastone di quercia inciso", "Cristallo arcano lucente", "Bacchetta d’osso intarsiata", "Libro degli incantesimi con copertina di pelle"],
    sorcerer: ["Pietra runica cremisi", "Bastone con gemma rossa", "Cristallo pulsante di energia", "Anello con sigillo arcano"],
    warlock: ["Teschio di corvo inciso", "Anello con occhio demoniaco", "Libro di ombre", "Cristallo oscuro"],
    bard: ["Lira d’argento", "Flauto di osso antico", "Liuto intarsiato di rune", "Tamburo di pelle di drago"],
    cleric: ["Simbolo sacro (Croce d’oro)", "Rosario di perle", "Amuleto con rune divine"],
    druid: ["Totem di corteccia", "Amuleto di pietra verde", "Ramo di quercia runico"],
    ranger: ["Totem Lupo", "Pietra di luna incisa", "Collana di denti di bugbear", "Bracciale di legno intagliato"],
    paladin: ["Simbolo sacro incastonato in argento (Mezzo Sole)", "Scudo con runa sacra", "Anello di giada con croce"],
    monk: ["Corda di preghiera", "Amuleto di giada", "Bracciale di meditazione"],
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
// Recupera incantesimi per classe e livello dal dataset spells.js
function getIncantesimiPerClasse(classe, livello) {
  const data = spells[classe];
  if (!data) return [];
  if (livello === 0) {
    return data.cantrips || [];
  }
  return data[`level${livello}`] || [];
}

const potenziaArmaMagica = (arma, livello) => {
  if (!arma) return null;
  const bonus = livello >= 11 ? "+2" : "+1";
  return {
    ...arma,
    nome: `${arma.nome} ${bonus}`,
    danno: `${arma.danno}${bonus}`,
    magico: true
  };
};

const generaOggettiMagici = (livello) => {
  const lista = [];
  const pool = livello >= 13 ? [...oggettiMagici.moltoRaro, ...oggettiMagici.leggendario] :
               livello >= 9 ? [...oggettiMagici.nonComune, ...oggettiMagici.raro] :
               [...oggettiMagici.comune];
  const num = livello >= 15 ? 3 : 1 + Math.floor(Math.random() * 2);
  for (let i = 0; i < num; i++) {
    lista = [...lista, pool[Math.floor(Math.random() * pool.length)]];
  }
  return lista;
};

export function generaVillain(opzioni = {}) {
  const villain = {};
  villain.armamento = {
  armi: [],
  armatura: null,
  scudo: null,
  oggettiMagici: []
};

  // 1. Livello
  villain.livello = opzioni.livello || rand(3, 10);
  const proficienza = Math.ceil(villain.livello / 4) + 2;

  // 2. Razza e Classe (da API locali)
  const razzaKey = casuale(Object.keys(razze).concat(Object.keys(evilRaces)));
  const classeKey = casuale(classes.map(c => c.index));

  const razzaData = razze[razzaKey] || evilRaces[razzaKey];
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
  villain.nomeClasseEvocativo = nomiEvocativiClasse[villain.classe] || villain.classe;
  villain.dadoVita = classeData.hit_die || 8;

  // 3. Sottoclasse
  villain.sottoclasse = casuale(classeData.subclasses)?.name || "";

  // 4. Nome villain
  villain.nome = `${generaNomeCasuale()} ${generaCognomeCasuale()}`;
  const allineamento = allineamentiMalvagi[Math.floor(Math.random() * allineamentiMalvagi.length)];
villain.allineamento = allineamento.nome;
villain.tooltipAllineamento = allineamento.descrizione;


  // 5. Stats
const prioritaStat = {
  barbarian: ["forza", "costituzione"],
  bard: ["carisma", "destrezza"],
  cleric: ["saggezza", "costituzione"],
  druid: ["saggezza", "costituzione"],
  fighter: ["forza", "costituzione"],
  rogue: ["destrezza", "intelligenza"],
  wizard: ["intelligenza", "costituzione"],
  monk: ["destrezza", "saggezza"],
  paladin: ["forza", "carisma"],
  ranger: ["destrezza", "saggezza"],
  sorcerer: ["carisma", "costituzione"],
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


// 6. Bonus razziali
villain.bonusRaziali = razzaData.ability_bonuses.map(b => `${b.ability_score}: +${b.bonus}`).join(", ") || "Nessuno";

// Aggiunta bonus razziali
(razzaData.ability_bonuses || []).forEach(bonus => {
  if (villain.stats[bonus.ability_score] !== undefined) {
    villain.stats[bonus.ability_score] += bonus.bonus;
  }
});

  // 7. Competenze e abilità a scelta
villain.privilegiClasse = classeData.proficiencies || [];

 villain.competenzeScelte = classeData.proficiency_choices?.[0]?.from || [];
  const sceltaAbilita = classeData.proficiency_choices[0];
const abilitaScelte = [];
if (sceltaAbilita) {
  const opzioni = sceltaAbilita.from;
  for (let i = 0; i < sceltaAbilita.choose; i++) {
    const scelta = casuale(opzioni);
    abilitaScelte.push(scelta);
  }
}
villain.abilitaClasse = abilitaScelte;


  // 8. Privilegi filtrati per livello
 villain.privilegiDettagliati = (classeData.features || []).filter(f => f.level <= villain.livello);

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

// Lista armi di competenza
villain.armiDiCompetenza = armi.filter(a =>
  classeData.proficiencies.some(prof =>
    a.categorie.some(cat => cat.toLowerCase().includes(prof.toLowerCase()))
  )
);
  // 11. Equipaggiamento
  const equipBase = equipBasePerClasse[classeKey] || { armi: [], armature: [] };
  
// Funzione helper per match parziale
function hasCategory(item, keyword) {
  return item.categorie.some(c => c.toLowerCase().includes(keyword.toLowerCase()));
}

// --- ARMATURE (OBBLIGATORIE PER CLASSI NON MAGICHE SE COMPETENTI) ---
const competenzeClasse = classeData.proficiencies || [];
const isClasseMagica = ["wizard", "sorcerer", "warlock"].includes(classeKey);

let armatura = null;
let scudo = null;

// Classi NON magiche → sempre un’armatura se competenti
if (!isClasseMagica) {
  if (competenzeClasse.some(prof => prof.toLowerCase().includes("armature pesanti"))) {
    armatura = armature.find(a => a.categorie.includes("Armatura pesante")) || null;
  } else if (competenzeClasse.some(prof => prof.toLowerCase().includes("armature medie"))) {
    armatura = armature.find(a => a.categorie.includes("Armatura media")) || null;
  } else if (competenzeClasse.some(prof => prof.toLowerCase().includes("armature leggere"))) {
    armatura = armature.find(a => a.categorie.includes("Armatura leggera")) || null;
  }

  if (competenzeClasse.some(prof => prof.toLowerCase().includes("scudi"))) {
    scudo = armature.find(a => a.categorie.includes("Scudo")) || null;
  }
} else {
  // Classi magiche → solo armatura leggera se competente
  if (competenzeClasse.some(prof => prof.toLowerCase().includes("armature leggere"))) {
    armatura = armature.find(a => a.categorie.includes("Armatura leggera")) || null;
  }
}

// Salva nel villain
villain.armaturaEquipaggiata = armatura;
villain.scudoEquipaggiato = scudo;


// Armi
const armiScelte = getEquipFromIds(equipBase.armi, armi);
villain.armaMischia = armiScelte.find(a => hasCategory(a, "mischia")) || null;
villain.armaDistanza = armiScelte.find(a => hasCategory(a, "distanza") || hasCategory(a, "arco")) || null;

// Se il kit non ha armi a distanza, scegli una casuale tra competenze
if (!villain.armaDistanza) {
  const armiDistanza = villain.armiDiCompetenza.filter(a => hasCategory(a, "distanza") || hasCategory(a, "arco"));
  villain.armaDistanza = armiDistanza.length > 0 ? casuale(armiDistanza) : null;
}

// Calcolo CA
villain.ca = calcolaCA(villain.stats, [villain.armaturaEquipaggiata, villain.scudoEquipaggiato].filter(Boolean));

// Calcolo CA dinamico
const modDex = Math.floor((villain.stats.destrezza - 10) / 2);
let caBase = 10 + modDex;

if (villain.armaturaEquipaggiata) {
  caBase = villain.armaturaEquipaggiata.armor_class.base;
  if (villain.armaturaEquipaggiata.armor_class.dex_bonus) {
    caBase += villain.armaturaEquipaggiata.armor_class.max_bonus
      ? Math.min(modDex, villain.armaturaEquipaggiata.armor_class.max_bonus)
      : modDex;
  }
}

if (villain.scudoEquipaggiato) {
  caBase += villain.scudoEquipaggiato.armor_class.base;
}
villain.ca = caBase;

// --- SE LIVELLO > 5: ARMI MAGICHE --- //
if (villain.livello > 5) {
  [villain.armaMischia, villain.armaDistanza].forEach(arma => {
    if (arma) {
      arma.magico = true;
      arma.bonus = villain.livello > 10 ? "+2" : "+1";
      arma.nome = `${arma.nome} ${arma.bonus}`;
      arma.danno = arma.danno + arma.bonus; // es. "1d8" → "1d8+1"
    }
  });
}

if (villain.livello > 8) {
  villain.armamento.oggettiMagici = [];
  let pool = oggettiMagici.comune;

  if (villain.livello >= 13) {
    pool = [...oggettiMagici.moltoRaro, ...oggettiMagici.leggendario];
  } else if (villain.livello >= 9) {
    pool = [...oggettiMagici.nonComune, ...oggettiMagici.raro];
  }

  const numOggetti = villain.livello >= 15 ? 3 : 1 + Math.floor(Math.random() * 2); // 1-3 oggetti
  for (let i = 0; i < numOggetti; i++) {
    const oggettoCasuale = pool[Math.floor(Math.random() * pool.length)];
    
villain.armamento.oggettiMagici.push(oggettoCasuale);
  }
}

// Aggiorna equipaggiamento narrativo
villain.equipVari = [
  ...(equipBase.equipaggiamento || []),
  villain.armaturaEquipaggiata ? `Indossa: ${villain.armaturaEquipaggiata.name}` : "",
  villain.scudoEquipaggiato ? `Scudo: ${villain.scudoEquipaggiato.name}` : "",
  villain.armaMischia ? `Arma da mischia: ${villain.armaMischia.name}` : "",
  villain.armaDistanza ? `Arma a distanza: ${villain.armaDistanza.name}` : "",
  "10 torce",
  "Corda di canapa (15 m)",
  "Razions da viaggio (5 giorni)",
  "Otre d’acqua",
  "Acciarino e pietra focaia"
].filter(Boolean);


  // 12. Magia
   // Classi magiche e stat principale coerente con le index italiane
// Classi magiche (in italiano)
const classiMagiche = ["wizard", "sorcerer", "warlock", "cleric", "druid", "bard", "paladin", "ranger"];
if (classiMagiche.includes(classeKey)) {
  const statMagicheMap = {
    wizard: "intelligenza",
    sorcerer: "carisma",
    warlock: "carisma",
    cleric: "saggezza",
    druid: "saggezza",
    bard: "carisma",
    paladin: "carisma",
    ranger: "saggezza"
  };

  const statMagica = statMagicheMap[classeKey] || "carisma";
  const modMagia = Math.floor((villain.stats[statMagica] - 10) / 2);

  villain.magia = {
    statPrincipale: statMagica,
    cd: 8 + modMagia + proficienza,
    bonusAttacco: modMagia + proficienza,
    focus: equipBase.focusArcano || generaFocusArcano(classeKey)
  };

  // Slot incantesimi per classi magiche
const fullCasters = ["wizard", "sorcerer", "warlock", "cleric", "druid", "bard"];
const halfCasters = ["paladin", "ranger"];

// Funzione per tabella slot (semplificata)
function calcolaSlotIncantesimi(livello, tipo) {
  // Tabella base semplificata per livelli 1-9
  const fullCasterSlots = {
    1: [2], 2: [3], 3: [4, 2], 4: [4, 3], 5: [4, 3, 2], 6: [4, 3, 3], 7: [4, 3, 3, 1],
    8: [4, 3, 3, 2], 9: [4, 3, 3, 3, 1], 10: [4, 3, 3, 3, 2],
    11: [4, 3, 3, 3, 2, 1], 12: [4, 3, 3, 3, 2, 1], 13: [4, 3, 3, 3, 2, 1, 1],
    14: [4, 3, 3, 3, 2, 1, 1], 15: [4, 3, 3, 3, 2, 1, 1, 1], 16: [4, 3, 3, 3, 2, 1, 1, 1],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1], 18: [4, 3, 3, 3, 3, 1, 1, 1, 1], 19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
  };
  const slots = fullCasterSlots[livello] || [];
  if (tipo === "half") {
    // Approssimazione: metà caster ottiene slot come full caster di livello /2 (arrotondato per eccesso)
    const halfLevel = Math.ceil(livello / 2);
    return fullCasterSlots[halfLevel] || [];
  }
  return slots;
}

// Determina tipo caster
const casterType = fullCasters.includes(classeKey) ? "full" : halfCasters.includes(classeKey) ? "half" : null;

if (casterType) {
  villain.slotIncantesimi = calcolaSlotIncantesimi(villain.livello, casterType)
    .map((num, idx) => ({ livello: idx + 1, slots: num }));

  // Trucchetti (scegli 2-3 casuali)
const tuttiTrucchetti = getIncantesimiPerClasse(classeKey, 0);
const trucchettiSelezionati = tuttiTrucchetti.length > 0
  ? Array.from({ length: Math.min(3, tuttiTrucchetti.length) }, () => casuale(tuttiTrucchetti))
  : [];

villain.incantesimi = {
  trucchetti: trucchettiSelezionati.map(sp => ({
    nome: sp.name,
    livello: 0,
    scuola: sp.school,
    durata: sp.duration,
    gittata: sp.range,
    descrizione: Array.isArray(sp.desc) ? sp.desc.join(" ") : sp.desc
  })),
  livelli: villain.slotIncantesimi.map(sl => {
    const incDisponibili = getIncantesimiPerClasse(classeKey, sl.livello);
    const numInc = Math.min(sl.slots, incDisponibili.length);
    const incantesimiCasuali = Array.from({ length: numInc }, () => casuale(incDisponibili));

    return {
      livello: sl.livello,
      slots: sl.slots,
      lista: incantesimiCasuali.map(sp => ({
        nome: sp.name,
        livello: sp.level,
        scuola: sp.school,
        durata: sp.duration,
        gittata: sp.range,
        descrizione: Array.isArray(sp.desc) ? sp.desc.join(" ") : sp.desc
      }))
    };
  })
};

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
