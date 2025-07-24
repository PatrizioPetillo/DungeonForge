export const razze = {
  human: {
    index: "human",
    name: "Umano",
    ability_bonuses: [
      { ability_score: "forza", bonus: 1 },
      { ability_score: "destrezza", bonus: 1 },
      { ability_score: "costituzione", bonus: 1 },
      { ability_score: "intelligenza", bonus: 1 },
      { ability_score: "saggezza", bonus: 1 },
      { ability_score: "carisma", bonus: 1 }
    ],
    speed: 9,
    languages: ["Comune"],
    traits: ["Versatilità Umano"]
  },
  elf: {
    index: "elf",
    name: "Elfo",
    ability_bonuses: [{ ability_score: "destrezza", bonus: 2 }],
    speed: 9,
    languages: ["Comune", "Elfico"],
    traits: ["Scurovisione", "Sensi Acuti", "Trance"]
  },
  dwarf: {
    index: "dwarf",
    name: "Nano",
    ability_bonuses: [{ ability_score: "costituzione", bonus: 2 }],
    speed: 7.5,
    languages: ["Comune", "Nanico"],
    traits: ["Scurovisione", "Resistenza Nanica", "Addestramento alle Armi Nane"]
  },
  halfling: {
    index: "halfling",
    name: "Halfling",
    ability_bonuses: [{ ability_score: "destrezza", bonus: 2 }],
    speed: 7.5,
    languages: ["Comune", "Halfling"],
    traits: ["Fortunato", "Coraggioso", "Agilità Halfling"]
  },
  tiefling: {
    index: "tiefling",
    name: "Tiefling",
    ability_bonuses: [
      { ability_score: "carisma", bonus: 2 },
      { ability_score: "intelligenza", bonus: 1 }
    ],
    speed: 9,
    languages: ["Comune", "Infernale"],
    traits: ["Scurovisione", "Resistenza Infernale", "Eredità Infernale"]
  },
  "half-orc": {
    index: "half-orc",
    name: "Mezzorco",
    ability_bonuses: [
      { ability_score: "forza", bonus: 2 },
      { ability_score: "costituzione", bonus: 1 }
    ],
    speed: 9,
    languages: ["Comune", "Orchesco"],
    traits: ["Scurovisione", "Aggressività", "Tenacia Implacabile"]
  },
  gnome: {
    index: "gnome",
    name: "Gnomo",
    ability_bonuses: [{ ability_score: "intelligenza", bonus: 2 }],
    speed: 7.5,
    languages: ["Comune", "Gnomesco"],
    traits: ["Astuzia Gnoma", "Scurovisione", "Maestria nelle Arti"]
  },
  dragonborn: {
    index: "dragonborn",
    name: "Dragonide",
    ability_bonuses: [
      { ability_score: "forza", bonus: 2 },
      { ability_score: "carisma", bonus: 1 }
    ],
    speed: 9,
    languages: ["Comune", "Draconico"],
    traits: ["Soffio Draconico", "Resistenza Draconica"]
  },
    bugbear: {
        index: "bugbear",
        name: "Bugbear",
        ability_bonuses: [
        { ability_score: "forza", bonus: 2 },
        { ability_score: "destrezza", bonus: 1 }
        ],
        speed: 9,
        languages: ["Comune", "Bugbear"],
        traits: ["Scurovisione", "Furtività Naturale", "Forza Bruta"]
    },
    halfelf: {
        index: "halfelf",
        name: "Mezzelfo",
        ability_bonuses: [
            { ability_score: "carisma", bonus: 2 },
            { ability_score: "destrezza", bonus: 1 },
            { ability_score: "intelligenza", bonus: 1 }
        ],
        speed: 9,
        languages: ["Comune", "Elfico"],
        traits: ["Scurovisione", "Versatilità Mezzelfa"]
    },
};
