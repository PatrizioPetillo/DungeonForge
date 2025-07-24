export const spells = {
  wizard: {
    cantrips: [
      { name: "Luce", level: 0, school: "Evocazione", casting_time: "1 azione", range: "Contatto", components: "V, M", duration: "1 ora", desc: "Illumina un oggetto con luce brillante." },
      { name: "Mano Magica", level: 0, school: "Evocazione", casting_time: "1 azione", range: "9 m", components: "V, S", duration: "1 minuto", desc: "Crea una mano spettrale per manipolare oggetti." },
      { name: "Trucchetto del Fuoco", level: 0, school: "Evocazione", casting_time: "1 azione", range: "18 m", components: "V, S", duration: "Istantanea", desc: "Infligge danni da fuoco a una creatura." },
      { name: "Riparare", level: 0, school: "Trasmutazione", casting_time: "1 azione", range: "Contatto", components: "V, S, M", duration: "Istantanea", desc: "Ripara un oggetto danneggiato."},
        { name: "Guida", level: 0, school: "Divinazione", casting_time: "1 azione", range: "Contatto", components: "V, S", duration: "Istantanea", desc: "Aumenta la precisione di un attacco." }

    ],
    level1: [
      { name: "Dardo Incantato", level: 1, school: "Evocazione", casting_time: "1 azione", range: "36 m", components: "V, S", duration: "Istantanea", desc: "Lancia 3 dardi magici che colpiscono automaticamente." },
      { name: "Scudo", level: 1, school: "Abiurazione", casting_time: "1 reazione", range: "Sé stesso", components: "V, S", duration: "1 round", desc: "Aumenta la CA di +5 fino al prossimo turno." },
        { name: "Armatura Magica", level: 1, school: "Abiurazione", casting_time: "1 azione", range: "Sé stesso", components: "V, S, M", duration: "8 ore", desc: "Conferisce una CA di 13 + modificatore Destrezza." },
        { name: "Identificare", level: 1, school: "Divinazione", casting_time: "1 minuto", range: "Contatto", components: "V, S, M", duration: "Istantanea", desc: "Identifica un oggetto magico o un incantesimo." },

    ],
    level2: [
      { name: "Invisibilità", level: 2, school: "Illusione", casting_time: "1 azione", range: "Contatto", components: "V, S, M", duration: "1 ora", desc: "Rende invisibile una creatura." },
      { name: "Raggio di Gelo", level: 2, school: "Evocazione", casting_time: "1 azione", range: "36 m", components: "V, S", duration: "Istantanea", desc: "Infligge danni da freddo a una creatura." },
        { name: "Volare", level: 2, school: "Trasmutazione", casting_time: "1 azione", range: "Contatto", components: "V, S, M", duration: "10 minuti", desc: "Conferisce la capacità di volare a una creatura." }
    ],
    level3: [
      { name: "Palla di Fuoco", level: 3, school: "Evocazione", casting_time: "1 azione", range: "45 m", components: "V, S, M", duration: "Istantanea", desc: "Esplosione di fuoco che infligge danni ingenti." },
      { name: "Fulmine", level: 3, school: "Evocazione", casting_time: "1 azione", range: "36 m", components: "V, S", duration: "Istantanea", desc: "Infligge danni da fulmine a una creatura." },

    ],
    level4: [
      { name: "Muro di Fuoco", level: 4, school: "Evocazione", casting_time: "1 azione", range: "36 m", components: "V, S, M", duration: "1 minuto", desc: "Crea un muro di fiamme che infligge danni." },

    ],
    level5: [
      { name: "Teletrasporto", level: 5, school: "Trasmutazione", casting_time: "1 azione", range: "3 m", components: "V", duration: "Istantanea", desc: "Teletrasporta te e altri a grande distanza." },
        { name: "Tempesta di Ghiaccio", level: 5, school: "Evocazione", casting_time: "1 azione", range: "36 m", components: "V, S, M", duration: "Istantanea", desc: "Infligge danni da freddo a tutte le creature in un'area." },

    ],
    level6: [
      { name: "Disintegrazione", level: 6, school: "Trasmutazione", casting_time: "1 azione", range: "18 m", components: "V, S, M", duration: "Istantanea", desc: "Riduce una creatura o oggetto in polvere." },
        { name: "Muro di Forza", level: 6, school: "Evocazione", casting_time: "1 azione", range: "9 m", components: "V, S, M", duration: "10 minuti", desc: "Crea un muro impenetrabile di forza." }
    ],
    level7: [
      { name: "Porta Dimensionale", level: 7, school: "Trasmutazione", casting_time: "1 azione", range: "150 m", components: "V", duration: "Istantanea", desc: "Crea un portale per viaggiare tra luoghi distanti." },
        { name: "Tempesta di Fulmini", level: 7, school: "Evocazione", casting_time: "1 azione", range: "36 m", components: "V, S, M", duration: "Istantanea", desc: "Infligge danni da fulmine a tutte le creature in un'area." }
    ]
  },

  cleric: {
    cantrips: [
      { name: "Luce Sacra", level: 0, school: "Evocazione", casting_time: "1 azione", range: "18 m", components: "V, S", duration: "Istantanea", desc: "Infligge danni radianti a un nemico." }
    ],
    level1: [
      { name: "Cura Ferite", level: 1, school: "Evocazione", casting_time: "1 azione", range: "Contatto", components: "V, S", duration: "Istantanea", desc: "Guarisce ferite di una creatura." }
    ],
    level2: [
      { name: "Silenzio", level: 2, school: "Illusione", casting_time: "1 azione", range: "36 m", components: "V, S", duration: "10 minuti", desc: "Zona in cui non si possono produrre suoni." }
    ]
  },

  warlock: {
    cantrips: [
      { name: "Deflagrazione Occulta", level: 0, school: "Evocazione", casting_time: "1 azione", range: "36 m", components: "V, S", duration: "Istantanea", desc: "Un raggio di energia oscura infligge danni." }
    ],
    level1: [
      { name: "Armatura di Agathys", level: 1, school: "Abiurazione", casting_time: "1 azione", range: "Sé stesso", components: "V, S, M", duration: "1 ora", desc: "Protezione magica che infligge danni a chi ti colpisce." }
    ]
  },

  druid: {
    cantrips: [
      { name: "Guidare", level: 0, school: "Evocazione", casting_time: "1 azione", range: "Contatto", components: "V, S", duration: "1 minuto", desc: "Conferisce vantaggio a una prova di abilità." }
    ],
    level1: [
      { name: "Entangle", level: 1, school: "Evocazione", casting_time: "1 azione", range: "27 m", components: "V, S", duration: "1 minuto", desc: "Piante intrappolano creature in un'area." }
    ]
  },

  bard: {
    cantrips: [
      { name: "Tagliente Derisione", level: 0, school: "Incantamento", casting_time: "1 azione", range: "18 m", components: "V", duration: "Istantanea", desc: "Insulto magico che infligge danni psichici." }
    ]
  },

  paladin: {
    level1: [
      { name: "Imposizione delle Mani", level: 1, school: "Abiurazione", casting_time: "1 azione", range: "Contatto", components: "V, S", duration: "Istantanea", desc: "Guarisce o rimuove malattie." }
    ]
  },

  ranger: {
    level1: [
      { name: "Marchio del Cacciatore", level: 1, school: "Divinazione", casting_time: "1 azione bonus", range: "27 m", components: "V", duration: "1 ora", desc: "Marchia un nemico per infliggere più danni." }
    ]
  }
};
