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
    traits: [
      { name: "Versatilità Umano", desc: "Hai competenza in un'abilità a tua scelta." }
    ]
  },
  elf: {
    index: "elf",
    name: "Elfo",
    ability_bonuses: [{ ability_score: "destrezza", bonus: 2 }],
    speed: 9,
    languages: ["Comune", "Elfico"],
    traits: [
      { name: "Scurovisione", desc: "Puoi vedere al buio fino a 18 metri come se fosse luce fioca e in condizioni di oscurità totale come se fosse luce tenue." },
      { name: "Sensi Acuti", desc: "Hai vantaggio nei tiri di Percezione che usano la vista." },
      { name: "Trance", desc: "Puoi meditare profondamente per 4 ore al giorno invece di dormire." }
    ]
  },
  dwarf: {
    index: "dwarf",
    name: "Nano",
    ability_bonuses: [{ ability_score: "costituzione", bonus: 2 }],
    speed: 7.5,
    languages: ["Comune", "Nanico"],
    traits: [
      { name: "Scurovisione", desc: "Puoi vedere al buio fino a 18 metri come se fosse luce fioca e in condizioni di oscurità totale come se fosse luce tenue." },
      { name: "Resistenza Nanica", desc: "Hai vantaggio nei tiri salvezza contro gli incantesimi." },
      { name: "Addestramento alle Armi Naniche", desc: "Hai competenza con le armi da guerra nane." }
    ]
  },
  halfling: {
    index: "halfling",
    name: "Halfling",
    ability_bonuses: [{ ability_score: "destrezza", bonus: 2 }],
    speed: 7.5,
    languages: ["Comune", "Halfling"],
    traits: [
      { name: "Fortunato", desc: "Hai vantaggio nei tiri di dado per le prove di abilità." },
      { name: "Coraggioso", desc: "Hai vantaggio nei tiri salvezza contro la paura." },
      { name: "Agilità Halfling", desc: "Puoi muoverti attraverso lo spazio di creature di taglia maggiore." }
    ]
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
    traits: [
      { name: "Scurovisione", desc: "Puoi vedere al buio fino a 18 metri come se fosse luce fioca e in condizioni di oscurità totale come se fosse luce tenue." },
      { name: "Resistenza Infernale", desc: "Hai resistenza ai danni da fuoco." },
      { name: "Eredità Infernale", desc: "Hai competenza in Intimidire." }
    ]
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
    traits: [
      { name: "Scurovisione", desc: "Puoi vedere al buio fino a 18 metri come se fosse luce fioca e in condizioni di oscurità totale come se fosse luce tenue." },
      { name: "Aggressività", desc: "Puoi usare un'azione bonus per muoverti verso un nemico e fare un attacco con un'arma in mischia." },
      { name: "Tenacia Implacabile", desc: "Hai vantaggio nei tiri salvezza contro la paura." }
    ]
  },
  gnome: {
    index: "gnome",
    name: "Gnomo",
    ability_bonuses: [{ ability_score: "intelligenza", bonus: 2 }],
    speed: 7.5,
    languages: ["Comune", "Gnomesco"],
    traits: [
      { name: "Astuzia Gnoma", desc: "Hai vantaggio nei tiri di Intelligenza (Investigazione) e sui tiri di salvezza contro gli incantesimi." },
      { name: "Scurovisione", desc: "Puoi vedere al buio fino a 18 metri come se fosse luce fioca e in condizioni di oscurità totale come se fosse luce tenue." },
      { name: "Maestria nelle Arti", desc: "Hai competenza in uno strumento musicale a tua scelta." }
    ]
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
    traits: [
      { name: "Soffio Draconico", desc: "Puoi usare un'azione per emettere un soffio di energia draconica." },
      { name: "Resistenza Draconica", desc: "Hai resistenza ai danni del tuo tipo di soffio." }
    ]
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
        traits: [
          { name: "Scurovisione", desc: "Puoi vedere al buio fino a 18 metri come se fosse luce fioca e in condizioni di oscurità totale come se fosse luce tenue." },
          { name: "Furtività Naturale", desc: "Hai vantaggio nei tiri di Furtività." },
          { name: "Forza Bruta", desc: "Quando colpisci con un attacco in mischia, puoi aggiungere il tuo modificatore di Forza al danno." }
        ]
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
        traits: [
          { name: "Scurovisione", desc: "Puoi vedere al buio fino a 18 metri come se fosse luce fioca e in condizioni di oscurità totale come se fosse luce tenue." },
          { name: "Versatilità Mezzelfa", desc: "Puoi scegliere due abilità in cui hai competenza." }
        ]
    },
};
