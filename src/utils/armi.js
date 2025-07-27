export function getTooltipProprieta(prop) {
  const descrizioni = {
    "Finesse": "Puoi usare DES al posto di FOR per attacchi e danni.",
    "Leggera": "Puoi usarla in combattimento a due armi.",
    "Pesante": "Richiede Forza alta, svantaggio su Furtività.",
    "Versatile": "Può essere usata a due mani per più danno.",
    "Lancio": "Può essere lanciata a distanza.",
    "A due mani": "Richiede entrambe le mani per essere impugnata.",
    "Portata": "Ha una portata specifica per attacchi a distanza.",
    "Carica": "Richiede un'azione per ricaricare tra gli attacchi.",
    "Incapacita": "Quando colpisce, il bersaglio è incapacitato fino alla fine del suo prossimo turno.",
    "Lunga portata": "Ha una portata estesa per attacchi a distanza.",
    "Svantaggio su Furtività": "L'uso di questa arma ti dà svantaggio sui tiri di Furtività.",
    "Nessuno": "Non infligge danni, ma può avere altri effetti.",
  };
  return descrizioni[prop] || "Proprietà speciale.";
}
export function calcolaBonusAttacco(arma, villain, isDistanza = false) {
  const modFor = Math.floor((villain.stats.forza - 10) / 2);
  const modDes = Math.floor((villain.stats.destrezza - 10) / 2);
  const isFinesse = arma.properties?.some(p => p.name.toLowerCase() === "finesse");
  const modBase = isDistanza ? modDes : (isFinesse ? Math.max(modFor, modDes) : modFor);
  const competente = villain.armiDiCompetenza?.some(a => a.index === arma.index);
  const prof = competente ? Math.ceil(villain.livello / 4) + 2 : 0;
  const bonus = modBase + prof;
  return bonus >= 0 ? `+${bonus}` : bonus;
}

export const armi = [
  {
    index: "club",
    name: "Randello",
    categorie: ["Armi semplici", "Mischia"],
    damage: { damage_dice: "1d4", damage_type: { name: "Contundente" } },
    properties: [{ name: "Leggera" }]
  },
  {
    index: "dagger",
    name: "Pugnale",
    categorie: ["Armi semplici", "Mischia", "A distanza"],
    damage: { damage_dice: "1d4", damage_type: { name: "Perforante" } },
    properties: [{ name: "Finesse" }, { name: "Leggera" }, { name: "Lancio (6/18m)" }]
  },
  {
    index: "battleaxe",
    name: "Ascia da battaglia",
    categorie: ["Armi da guerra", "Mischia"],
    damage: { damage_dice: "1d8", damage_type: { name: "Tagliente" } },
    properties: [{ name: "Versatile (1d10)" }]
  },
  {
    index: "longsword",
    name: "Spada lunga",
    categorie: ["Armi da guerra", "Mischia"],
    damage: { damage_dice: "1d8", damage_type: { name: "Tagliente" } },
    properties: [{ name: "Versatile (1d10)" }]
  },
  {
    index: "shortsword",
    name: "Spada corta",
    categorie: ["Armi da guerra", "Mischia"],
    damage: { damage_dice: "1d6", damage_type: { name: "Perforante" } },
    properties: [{ name: "Finesse" }, { name: "Leggera" }]
  },
  {
    index: "warhammer",
    name: "Martello da guerra",
    categorie: ["Armi da guerra", "Mischia"],
    damage: { damage_dice: "1d8", damage_type: { name: "Contundente" } },
    properties: [{ name: "Versatile (1d10)" }]
  },
  {
    index: "greatsword",
    name: "Spadone",
    categorie: ["Armi da guerra", "Mischia"],
    damage: { damage_dice: "2d6", damage_type: { name: "Tagliente" } },
    properties: [{ name: "Pesante" }, { name: "A due mani" }]
  },
  {
    index: "longbow",
    name: "Arco lungo",
    categorie: ["Armi da guerra", "A distanza"],
    damage: { damage_dice: "1d8", damage_type: { name: "Perforante" } },
    properties: [{ name: "Pesante" }, { name: "A due mani" }, { name: "Portata (45/180m)" }]
  },
  {
    index: "shortbow",
    name: "Arco corto",
    categorie: ["Armi semplici", "A distanza"],
    damage: { damage_dice: "1d6", damage_type: { name: "Perforante" } },
    properties: [{ name: "Portata (24/96m)" }, { name: "A due mani" }]
  },
  {
    index: "crossbow-light",
    name: "Balestra leggera",
    categorie: ["Armi semplici", "A distanza"],
    damage: { damage_dice: "1d8", damage_type: { name: "Perforante" } },
    properties: [{ name: "Carica" }, { name: "A due mani" }, { name: "Portata (24/96m)" }]
  },
  {
    index: "crossbow-heavy",
    name: "Balestra pesante",
    categorie: ["Armi da guerra", "A distanza"],
    damage: { damage_dice: "1d10", damage_type: { name: "Perforante" } },
    properties: [{ name: "Carica" }, { name: "Pesante" }, { name: "A due mani" }, { name: "Portata (30/120m)" }]
  },
  {
    index: "sling",
    name: "Fionda",
    categorie: ["Armi semplici", "A distanza"],
    damage: { damage_dice: "1d4", damage_type: { name: "Contundente" } },
    properties: [{ name: "Leggera" }, { name: "Portata (6/18m)" }]
  },
  {
    index: "quarterstaff",
    name: "Bastone",
    categorie: ["Armi semplici", "Mischia"],
    damage: { damage_dice: "1d6", damage_type: { name: "Contundente" } },
    properties: [{ name: "Versatile (1d8)" }, { name: "Leggera" }]
  },
  {
    index: "handaxe",
    name: "Ascia da lancio",
    categorie: ["Armi semplici", "Mischia", "A distanza"],
    damage: { damage_dice: "1d6", damage_type: { name: "Tagliente" } },
    properties: [{ name: "Leggera" }, { name: "Lancio (6/18m)" }]
  },
  {
    index: "javelin",
    name: "Giavellotto",
    categorie: ["Armi semplici", "Mischia", "A distanza"],
    damage: { damage_dice: "1d6", damage_type: { name: "Perforante" } },
    properties: [{ name: "Lancio (9/27m)" }]
  },
  {
    index: "spear",
    name: "Lancia",
    categorie: ["Armi semplici", "Mischia", "A distanza"],
    damage: { damage_dice: "1d6", damage_type: { name: "Perforante" } },
    properties: [{ name: "Versatile (1d8)" }, { name: "Lancio (6/18m)" }]
  },
  {
    index: "rapier",
    name: "Rapiere",
    categorie: ["Armi da guerra", "Mischia"],
    damage: { damage_dice: "1d8", damage_type: { name: "Perforante" } },
    properties: [{ name: "Finesse" }]
  },
  {
    index: "trident",
    name: "Tridente",
    categorie: ["Armi semplici", "Mischia", "A distanza"],
    damage: { damage_dice: "1d6", damage_type: { name: "Perforante" } },
    properties: [{ name: "Versatile (1d8)" }, { name: "Lancio (9/27m)" }]
  },
  {
    index: "whip",
    name: "Frusta",
    categorie: ["Armi semplici", "Mischia"],
    damage: { damage_dice: "1d4", damage_type: { name: "Tagliente" } },
    properties: [{ name: "Finesse" }, { name: "Lunga portata (3m)" }]
  },
  {
    index: "net",
    name: "Rete",
    categorie: ["Armi semplici", "A distanza"],
    damage: { damage_dice: "0", damage_type: { name: "Nessuno" } },
    properties: [{ name: "Lancio (3/9m)" }, { name: "Incapacita" }]
  },
  {
    index: "maul",
    name: "Martello da guerra",
    categorie: ["Armi da guerra", "Mischia"],
    damage: { damage_dice: "2d6", damage_type: { name: "Contundente" } },
    properties: [{ name: "Pesante" }, { name: "A due mani" }]
  },
  {
    index: "scimitar",
    name: "Scimitarra",
    categorie: ["Armi da guerra", "Mischia"],
    damage: { damage_dice: "1d6", damage_type: { name: "Tagliente" } },
    properties: [{ name: "Finesse" }, { name: "Leggera" }]
  },
  {
    index: "lance",
    name: "Lancia",
    categorie: ["Armi semplici", "Mischia"],
    damage: { damage_dice: "1d12", damage_type: { name: "Perforante" } },
    properties: [{ name: "A due mani" }, { name: "Lunga portata (3m)" }]
  },

];
