import { casuale, rand, tiraStats } from "./generators";
import { classes } from "./classes";
import { razze } from "./races";
import { armi } from "./armi";
import { armature } from "./armature";
import { spells } from "./spells";
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

// Classi magiche
const classiFullCaster = ["wizard", "sorcerer", "cleric", "druid", "bard", "warlock"];
const classiHalfCaster = ["paladin", "ranger"];

// Slot incantesimi (semplificato)
const slotFullCaster = {
  5: [4, 3, 2],
  6: [4, 3, 3],
  7: [4, 3, 3, 1],
};
const slotHalfCaster = {
  5: [4, 2],
  6: [4, 2],
  7: [4, 3],
};

// Stat magica per classe
const statMagicaPerClasse = {
  wizard: "intelligenza",
  sorcerer: "carisma",
  warlock: "carisma",
  bard: "carisma",
  cleric: "saggezza",
  druid: "saggezza",
  paladin: "carisma",
  ranger: "saggezza",
};

// ✅ Focus Arcano evocativo
function generaFocusArcano(classeKey, allineamento) {
  const focusPerClasse = {
    wizard: ["Tomo delle Ombre", "Bastone inciso con rune", "Pergamena vincolata in catene"],
    sorcerer: ["Cristallo pulsante di energia oscura", "Gemma intrisa di sangue antico"],
    warlock: ["Libro proibito avvolto in pelle umana", "Talismano di ossa annerite"],
    bard: ["Liuto d’ebano intarsiato", "Flauto inciso di simboli occulti"],
    cleric: ["Simbolo sacro corrotto", "Calice sacrificale"],
    druid: ["Ramo secco avvolto da spine", "Totem incrinato"],
    paladin: ["Scudo sacro deturpato", "Medaglione divino annerito"],
  };

  const varianteOscura = allineamento.includes("Malvagio")
    ? ["avvolto in ombre", "consacrato nel sangue", "corrotto da energia oscura"]
    : ["antico e crepato", "ornato con rune eteree"];

  const baseFocus = focusPerClasse[classeKey] || ["Cristallo arcano antico"];
  return `${casuale(baseFocus)} ${casuale(varianteOscura)}`;
}

// ✅ Genera classe evocativa
function generaClasseEvocativa(classe) {
  const base = classe;
  const variante = variantiClasse[classe] ? casuale(variantiClasse[classe]) : "";
  return `${base} ${variante}`.trim();
}

// ✅ Filtra armi compatibili
function getArmiCompatibili(classe) {
  if (["Wizard", "Sorcerer", "Warlock"].includes(classe))
    return armi.filter((a) => a.weapon_category === "Simple" && a.weapon_range === "Melee");
  if (["Cleric", "Druid"].includes(classe))
    return armi.filter((a) => a.weapon_category === "Simple");
  if (["Fighter", "Paladin"].includes(classe))
    return armi.filter((a) => a.weapon_category === "Martial");
  return armi;
}

// ✅ Filtra armature compatibili
function getArmatureCompatibili(classe) {
  if (["Wizard", "Sorcerer"].includes(classe)) return [];
  if (["Cleric", "Druid"].includes(classe)) return armature.filter((a) => a.armor_category === "Medium Armor");
  if (["Fighter", "Paladin"].includes(classe)) return armature.filter((a) => a.armor_category === "Heavy Armor");
  return armature.filter((a) => a.armor_category === "Light Armor");
}

// ✅ Generatore completo Villain
export function generaVillainCompleto() {
  const villain = {};

  // Livello
  villain.livello = rand(5, 10);
  villain.bonusCompetenza = Math.ceil(villain.livello / 4) + 2;

  // Classe e razza
  const classeData = casuale(classes);
  villain.classe = classeData.name;
  villain.classeEvocativa = generaClasseEvocativa(villain.classe);
  villain.sottoclasse = casuale(classeData.subclasses || []).name || "";

  const razzaKey = casuale(Object.keys(razze));
  const razzaData = razze[razzaKey];
  villain.razza = razzaData.name;

  // Allineamento
  villain.allineamento = casuale([
    "Legale Malvagio",
    "Neutrale Malvagio",
    "Caotico Malvagio",
    "Antieroe (Caotico Neutrale)"
  ]);

  // Background evocativo
  const bg = casuale(backgrounds);
  const nomeEvocativo = `${bg.name} ${casuale(variantiBackground)}`;
  villain.background = { ...bg, nomeEvocativo };

  // Linguaggi
  villain.linguaggi = ["Comune", ...(razzaData.languages || []), ...(bg.languages || []), casuale(["Infernale", "Abyssale", "Draconico"])];

  // Narrativa base
  villain.narrativa = {
    obiettivo: casuale([
      "Conquistare un regno per vendetta personale dopo un tradimento",
      "Evocare un dio oscuro per portare caos e distruzione ",
      "Distruggere la capitale del regno per dimostrare la propria potenza",
      "Recuperare un artefatto proibito per ottenere un potere inimmaginabile",
      "Corrompere un eroe leggendario per trasformarlo in un servitore oscuro",
      "Sottomettere un antico spirito per usarlo come arma contro i propri nemici",
      "Iniziare un rituale per risvegliare un'entità primordiale e scatenare il caos",
      "Creare un esercito di non morti per conquistare il mondo",
    ]),
    motivazione: casuale(["Vendetta", "Potere", "Profezia oscura"]),
    origine: casuale([
      "Ex eroe caduto in disgrazia ed ormai dimenticato",
      "Discendente di una dinastia maledetta",
      "Servo di un'entità ultraterrena dimenticata",
      "Un tempo un nobile, ora un tiranno senza pietà",
      "Un antico spirito risvegliato da un rituale proibito",
      "Un tempo un potente mago, ora un lich assetato di potere",
      "Un tempo un paladino, ora un traditore della luce",
    ])
  };

  villain.descrizione = `Un ${villain.razza} ${villain.classeEvocativa} di livello ${villain.livello}, allineamento ${villain.allineamento}. È animato da ${villain.narrativa.motivazione} e desidera ${villain.narrativa.obiettivo}.`;

  // Statistiche
  const prioritaStat = {
    Barbarian: ["forza", "costituzione"],
    Bard: ["carisma", "destrezza"],
    Cleric: ["saggezza", "costituzione"],
    Druid: ["saggezza", "costituzione"],
    Fighter: ["forza", "costituzione"],
    Rogue: ["destrezza", "intelligenza"],
    Wizard: ["intelligenza", "costituzione"],
    Paladin: ["forza", "carisma"],
    Ranger: ["destrezza", "saggezza"],
    Sorcerer: ["carisma", "costituzione"],
    Warlock: ["carisma", "costituzione"]
  };

  const rolls = tiraStats().sort((a, b) => b - a);
  const ordine = ["forza", "destrezza", "costituzione", "intelligenza", "saggezza", "carisma"];
  const priorita = prioritaStat[villain.classe] || ordine;

  villain.stats = {};
  let i = 0;
  priorita.forEach(stat => (villain.stats[stat] = rolls[i++]));
  ordine.forEach(stat => {
    if (!villain.stats[stat]) villain.stats[stat] = rolls[i++];
  });

  // Bonus razziali
  razzaData.ability_bonuses.forEach(b => {
    if (villain.stats[b.ability_score] !== undefined) {
      villain.stats[b.ability_score] += b.bonus;
    }
  });

  // PF e CA
  const modCos = Math.floor((villain.stats.costituzione - 10) / 2);
  villain.dadoVita = classeData.hit_die || 8;
  villain.pf = villain.dadoVita + (villain.livello - 1) * (villain.dadoVita / 2 + 1 + modCos);

  // Equipaggiamento coerente
  const armiCompatibili = getArmiCompatibili(villain.classe);
  const armaPrimaria = casuale(armiCompatibili);
  const armaSecondaria = casuale(armiCompatibili.filter(a => a.index !== armaPrimaria.index));
  villain.armiEquippate = [armaPrimaria, armaSecondaria].filter(Boolean);

  const armatureCompatibili = getArmatureCompatibili(villain.classe);
  const armatura = armatureCompatibili.length > 0 ? casuale(armatureCompatibili) : null;
  villain.armatureIndossate = armatura ? [armatura] : [];

  // Calcolo CA
  let caBase = armatura?.armor_class?.base || 10;
  const modDes = Math.floor((villain.stats.destrezza - 10) / 2);
  if (armatura?.armor_class?.dex_bonus) {
    caBase += armatura.armor_class.max_bonus ? Math.min(modDes, armatura.armor_class.max_bonus) : modDes;
  }
  villain.ca = caBase;

  // Inventario (base + background + classe)
  let inventario = [...equipVariBase];
  if (oggettiBackground[bg.name]) inventario.push(...oggettiBackground[bg.name]);
  if (oggettiClasse[villain.classe]) inventario.push(...oggettiClasse[villain.classe]);
  villain.inventario = inventario.join(", ");

  // Loot speciale
  villain.loot = [casuale(lootVillain), casuale(lootVillain)];
  if (Math.random() > 0.4) villain.loot.push(casuale(lootVillain));

  // Competenze e privilegi
  villain.competenze = classeData.proficiencies.map(p => p.name);
  villain.privilegiClasse = (classeData.class_features || []).map(f => ({
    nome: f.name,
    descrizione: f.desc || ""
  }));
  villain.talenti = ["Talento Generico"]; // Placeholder

  // Magia
  if (classiFullCaster.includes(villain.classe.toLowerCase()) || classiHalfCaster.includes(villain.classe.toLowerCase())) {
    const statMagica = statMagicaPerClasse[villain.classe.toLowerCase()] || "intelligenza";
    const modMagia = Math.floor((villain.stats[statMagica] - 10) / 2);

    villain.magia = {
      caratteristica: statMagica,
      cd: 8 + modMagia + villain.bonusCompetenza,
      bonusAttacco: modMagia + villain.bonusCompetenza,
      focus: generaFocusArcano(villain.classe.toLowerCase(), villain.allineamento)
    };

    villain.slotIncantesimi = classiFullCaster.includes(villain.classe.toLowerCase())
      ? slotFullCaster[villain.livello] || []
      : slotHalfCaster[villain.livello] || [];

    const spellData = spells[villain.classe.toLowerCase()] || {};
    villain.incantesimi = [];

    if (spellData.cantrips) villain.incantesimi.push(...spellData.cantrips.slice(0, 2));
    for (let lvl = 1; lvl <= 3; lvl++) {
      if (spellData[`level${lvl}`]) {
        villain.incantesimi.push(...spellData[`level${lvl}`].slice(0, 2));
      }
    }
  } else {
    villain.magia = null;
  }

  return villain;
}
