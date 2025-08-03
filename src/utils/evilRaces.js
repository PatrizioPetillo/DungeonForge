export const evilRaces = {
vampire: {
    index: "vampire",
    name: "Vampiro",
    ability_bonuses: [
      { ability_score: "carisma", bonus: 2 },
      { ability_score: "forza", bonus: 1 }
    ],
    speed: 9,
    languages: ["Comune", "Infernale"],
    traits: [
      { name: "Scurovisione Superiore", desc: "Puoi vedere al buio fino a 36 metri." },
      { name: "Fame di Sangue", desc: "Devi nutrirti di sangue una volta ogni 3 giorni o subire svantaggio su tutte le prove di abilità e attacchi." },
      { name: "Rigenerazione", desc: "Recuperi 5 PF all'inizio del tuo turno se hai almeno 1 PF e se non sei esposto a luce solare." },
      { name: "Debolezza al Sole", desc: "Svantaggio ai tiri per colpire e prove di caratteristica alla luce del sole." }
    ]
  },

  lich: {
    index: "lich",
    name: "Lich",
    ability_bonuses: [
      { ability_score: "intelligenza", bonus: 3 }
    ],
    speed: 9,
    languages: ["Comune", "Abissale", "Telepatia 36m"],
    traits: [
      { name: "Non-Morto", desc: "Hai immunità a veleno, malattie e non necessiti di cibo, aria o sonno." },
      { name: "Filatterio", desc: "Puoi rigenerare il tuo corpo dopo 1d10 giorni se distrutto, a meno che il tuo filatterio non sia anch'esso distrutto." },
      { name: "Aura di Terrore", desc: "Creatura entro 3m che ti vede deve superare un TS Saggezza CD 15 o essere Spaventata per 1 turno." }
    ]
  },

  halfdemon: {
    index: "halfdemon",
    name: "Mezzodemone",
    ability_bonuses: [
      { ability_score: "forza", bonus: 2 },
      { ability_score: "costituzione", bonus: 1 }
    ],
    speed: 9,
    languages: ["Comune", "Demoniaco"],
    traits: [
      { name: "Furia Demoniaca", desc: "Una volta per riposo lungo, puoi ottenere vantaggio su tutti i tiri per colpire per 1 minuto, ma subisci 1d4 danni alla fine di ogni tuo turno." },
      { name: "Resistenza Innata", desc: "Hai resistenza ai danni necrotici e psichici." },
      { name: "Presenza Intimidatoria", desc: "Hai competenza in Intimidire e puoi aggiungere il doppio del bonus di competenza quando lo usi." }
    ]
  }
};