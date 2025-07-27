export function getTooltipArmatura(prop) {
  const descrizioni = {
    "Svantaggio su Furtività": "Hai svantaggio ai tiri di Furtività.",
    "Richiede For 13": "Devi avere Forza almeno 13 per indossarla senza penalità.",
    "Richiede For 15": "Devi avere Forza almeno 15 per indossarla senza penalità.",
    "Dex bonus": "Puoi aggiungere il tuo bonus di Destrezza alla Classe Armatura (CA), fino a un massimo di 2.",
    "Max Dex bonus": "Il tuo bonus di Destrezza è limitato a un massimo di 2 quando indossi questa armatura.",
    "Base": "La Classe Armatura (CA) di base fornita da questa armatura.",
  };
  return descrizioni[prop] || "Proprietà dell'armatura.";
}

export const armature = [
  {
    index: "padded-armor",
    name: "Armatura imbottita",
    categorie: ["Armatura leggera"],
    armor_class: { base: 11, dex_bonus: true },
    proprieta: ["Svantaggio su Furtività"]
  },
  {
    index: "leather-armor",
    name: "Armatura di cuoio",
    categorie: ["Armatura leggera"],
    armor_class: { base: 11, dex_bonus: true },
    proprieta: []
  },
  {
    index: "studded-leather",
    name: "Armatura di cuoio borchiata",
    categorie: ["Armatura leggera"],
    armor_class: { base: 12, dex_bonus: true },
    proprieta: []
  },
  {
    index: "hide-armor",
    name: "Armatura di pelle dura",
    categorie: ["Armatura media"],
    armor_class: { base: 12, dex_bonus: true, max_bonus: 2 },
    proprieta: []
  },
  {
    index: "chain-shirt",
    name: "Cotta di maglia",
    categorie: ["Armatura media"],
    armor_class: { base: 13, dex_bonus: true, max_bonus: 2 },
    proprieta: []
  },
  {
    index: "scale-mail",
    name: "Corazza a scaglie",
    categorie: ["Armatura media"],
    armor_class: { base: 14, dex_bonus: true, max_bonus: 2 },
    proprieta: ["Svantaggio su Furtività"]
  },
  {
    index: "breastplate",
    name: "Corazza",
    categorie: ["Armatura media"],
    armor_class: { base: 14, dex_bonus: true, max_bonus: 2 },
    proprieta: []
  },
  {
    index: "half-plate",
    name: "Mezza armatura",
    categorie: ["Armatura media"],
    armor_class: { base: 15, dex_bonus: true, max_bonus: 2 },
    proprieta: ["Svantaggio su Furtività"]
  },
  {
    index: "chain-mail",
    name: "Maglia ad anelli",
    categorie: ["Armatura pesante"],
    armor_class: { base: 16, dex_bonus: false },
    proprieta: ["Richiede For 13", "Svantaggio su Furtività"]
  },
  {
    index: "splint",
    name: "Armatura a piastre",
    categorie: ["Armatura pesante"],
    armor_class: { base: 17, dex_bonus: false },
    proprieta: ["Richiede For 15", "Svantaggio su Furtività"]
  },
  {
    index: "plate",
    name: "Armatura completa",
    categorie: ["Armatura pesante"],
    armor_class: { base: 18, dex_bonus: false },
    proprieta: ["Richiede For 15", "Svantaggio su Furtività"]
  },
  {
    index: "shield",
    name: "Scudo",
    categorie: ["Scudo"],
    armor_class: { base: 2, dex_bonus: false },
    proprieta: []
  }
];
