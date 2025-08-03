export const cuoreDiPietra = {
  "id": "cuore-di-pietra",
  "titolo": "Cuore di Pietra",
  "livello": "5",
  "durata": "1 sessione",
  "ambientazione": "Antico santuario sepolto tra le montagne della Corona Infranta. Un luogo di potere dimenticato, ora avvolto da una maledizione che ha trasformato i suoi guardiani in golem di pietra.",
  "tagline": "Un eco tra le rocce chiama i cuori più forti: solo chi sconfigge la maledizione potrà risvegliare il Cuore di Pietra.",
  "atti": [
    {
      "titolo": "Atto I – L’Eco tra le Rocce",
      "obiettivo": "Rintracciare il santuario perduto e scoprire la fonte della maledizione.",
      "contenuto": [
        "Viaggio tra crepacci e templi spezzati.",
        "Confronto con spiriti montani e una guida corrotta.",
        "Visioni profetiche e prime tracce del golem antico."
      ]
    },
    {
      "titolo": "Atto II – Il Santuario Infranto",
      "obiettivo": "Esplorare le rovine e disattivare le trappole arcane.",
      "contenuto": [
        "Enigma delle Tre Lance (protezione elementale).",
        "Combattimenti con guardiani di pietra e statuari animati.",
        "Scoperta del Cuore Sigillato: il nucleo magico pulsante del luogo."
      ]
    },
    {
      "titolo": "Atto III – Il Risveglio o la Distruzione",
      "obiettivo": "Decidere il destino del Cuore di Pietra.",
      "contenuto": [
        "Boss Fight: Golem del Giuramento dimenticato.",
        "Possibilità di purificare l’anima intrappolata nel Cuore.",
        "Finale: chiude o libera il santuario, con effetti sul mondo esterno."
      ]
    }
  ],
    villain: {
    nome: "Custode del Cuore",
    razza: "Costrutto",
    classe: "Paladino decaduto",
    livello: 5,
    obiettivo: "Proteggere il Cuore a ogni costo",
    motivazione: "Un giuramento infranto lo ha condannato a eternità di guardia",
    magia: false,
    comportamento: "Solenne, silenzioso, inarrestabile",
    oggetti: ["Martello da guardia runico"],
    luogoChiave: "Sala del Cuore",
    immagine: "" // eventualmente base64 o URL
  },
  png: [
    {
      nome: "Frida la Scalpellina",
      razza: "Umano",
      ruolo: "Guida",
      legame: "Ha trovato l’ingresso alla Cripta, ma ha perso il fratello lì dentro",
      pregio: "Tenace",
      difetto: "Ossessionata dalla gloria",
      ideale: "Il sapere deve essere riportato alla luce",
      legameNarrativo: "Potrebbe essere costretta ad aiutare o a fuggire",
      immagine: ""
    },
    {
      nome: "Eldrin il Saggio",
      razza: "Elfo",
      ruolo: "Mago",
      legame: "Cerca la conoscenza perduta del santuario",
      pregio: "Saggio",
      difetto: "Distratto",
      ideale: "La conoscenza è potere",
      legameNarrativo: "Potrebbe tradire il gruppo per un antico tomo",
      immagine: ""
    },
    {
      nome: "Brom il Forte",
      razza: "Nano",
      ruolo: "Guerriero",
      legame: "Cerca vendetta contro i golem che hanno distrutto il suo villaggio",
      pregio: "Coraggioso",
      difetto: "Impulsivo",
      ideale: "La forza è la chiave per la libertà",
      legameNarrativo: "Potrebbe sacrificarsi per salvare gli altri",
      immagine: ""
    }
  ],

  mostri: [
    { nome: "Golem di pietra", gs: 5, fonte: "Manuale Mostri" },
    { nome: "Guardiano di pietra", gs: 4, fonte: "Manuale Mostri" },
    { nome: "Spirito della montagna", gs: 3, fonte: "Manuale Mostri" },
    { nome: "Costrutto animato", gs: 2, fonte: "Manuale Mostri" },
    { nome: "Spettri del Giuramento", gs: 3, fonte: "Homebrew" }
  ],
  
  agganci: [
    "Una frana ha rivelato l'ingresso di un tempio dimenticato; i segni di un antico rituale sono visibili.",
    "Un nobile offre una ricompensa per una reliquia di famiglia. Si scopre che è legata al Cuore di Pietra.",
    "Una maga sogna ogni notte la stessa voce di pietra. La guida dice che è un segno del santuario.",
    "Un antico manoscritto parla di un luogo dove la pietra canta. I segni conducono a una montagna lontana.",
    "Un mercante ha un frammento di un antico sigillo. Si dice che sia la chiave per accedere al santuario."
  ]
}