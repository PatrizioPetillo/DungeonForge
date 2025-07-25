export const classes = [
  {
    index: "barbarian",
    name: "Barbaro",
    hit_die: 12,
    proficiencies: ["Armi semplici", "Armi da guerra", "Armature leggere", "Armature medie", "Scudi"],
    proficiency_choices: [
      {
        choose: 2,
        type: "skills",
        from: ["Atletica", "Percezione", "Sopravvivenza", "Intimidire", "Furtività", "Addestrare Animali"]
      }
    ],
    subclasses: [
      { name: "Cammino del Berserker", desc: "Pura rabbia combattiva" },
      { name: "Cammino del Totem", desc: "Legame con gli spiriti animali" }
    ],
    features: [
      { level: 1, name: "Rabbia", desc: "Entra in uno stato di furia per aumentare i danni" },
      { level: 2, name: "Attacco Sconsiderato", desc: "Attacchi con vantaggio sacrificando la difesa" }
    ]
  },
  {
    index: "bard",
    name: "Bardo",
    hit_die: 8,
    proficiencies: ["Armi semplici", "Spade corte", "Balestre leggere", "Liuto", "Flauto"],
    proficiency_choices: [
      {
        choose: 3,
        type: "skills",
        from: ["Acrobazia", "Inganno", "Intimidire", "Persuasione", "Intrattenere", "Storia", "Arcano"]
      }
    ],
    subclasses: [
      { name: "Collegio della Sapienza", desc: "Bardo studioso" },
      { name: "Collegio del Valore", desc: "Bardo guerriero" }
    ],
    features: [
      { level: 1, name: "Ispirazione Bardica", desc: "Inspira i tuoi alleati con parole o musica" },
      { level: 2, name: "Canto di Riposo", desc: "Rigenera i compagni durante il riposo" }
    ]
  },
  {
    index: "cleric",
    name: "Chierico",
    hit_die: 8,
    proficiencies: ["Armi semplici", "Armature leggere", "Armature medie", "Scudi"],
    proficiency_choices: [
      {
        choose: 2,
        type: "skills",
        from: ["Medicina", "Religione", "Intuizione", "Persuasione", "Storia"]
      }
    ],
    subclasses: [
      { name: "Dominio della Vita", desc: "Guaritore sacro" },
      { name: "Dominio della Guerra", desc: "Combattente divino" }
    ],
    features: [
      { level: 1, name: "Incantesimi", desc: "Accedi alla magia divina" },
      { level: 2, name: "Canale Divino", desc: "Evoca poteri divini" }
    ]
  },
  {
    index: "druid",
    name: "Druido",
    hit_die: 8,
    proficiencies: ["Bastoni", "Fionde", "Scimitarre", "Scudi di legno"],
    proficiency_choices: [
      {
        choose: 2,
        type: "skills",
        from: ["Arcano", "Medicina", "Natura", "Religione", "Sopravvivenza"]
      }
    ],
    subclasses: [
      { name: "Circolo della Terra", desc: "Legame con la natura" },
      { name: "Circolo della Luna", desc: "Mutazioni animali" }
    ],
    features: [
      { level: 1, name: "Incantesimi", desc: "Accedi alla magia naturale" },
      { level: 2, name: "Forma Selvatica", desc: "Trasformazione in animali" }
    ]
  },
  {
    index: "fighter",
    name: "Guerriero",
    hit_die: 10,
    proficiencies: ["Armi semplici", "Armi da guerra", "Armature leggere", "Armature medie", "Armature pesanti", "Scudi"],
    proficiency_choices: [
      {
        choose: 2,
        type: "skills",
        from: ["Acrobazia", "Atletica", "Percezione", "Sopravvivenza", "Intimidire"]
      }
    ],
    subclasses: [
      { name: "Cavaliere", desc: "Maestro d'armi" },
      { name: "Campione", desc: "Combattente versatile" }
    ],
    features: [
      { level: 1, name: "Secondo Soffio", desc: "Rigenerazione rapida in battaglia" },
      { level: 2, name: "Attacco Extra", desc: "Colpisci due volte per attacco" }
    ]
  },
  {
    index: "monk",
    name: "Monaco",
    hit_die: 8,
    saving_throws: ["Forza", "Destrezza"],
    proficiencies: ["Armi semplici", "Spade corte"],
    proficiency_choices: [
      {
        choose: 2,
        type: "skills",
        from: ["Acrobazia", "Atletica", "Furtività", "Storia", "Religione", "Intuizione"]
      },
      {
        choose: 1,
        type: "tools",
        from: ["Strumenti da artigiano", "Strumento musicale a scelta"]
      }
    ],
    subclasses: [
      { name: "Via della Mano Aperta", desc: "Maestro del corpo" },
      { name: "Via dell'Ombra", desc: "Tecniche furtive" }
    ],
    features: [
      { level: 1, name: "Difesa senza Armatura", desc: "A partire dal 1° livello, finché un monaco non indossa alcuna armatura e non impugna uno scudo, la sua CA è pari a 10 + mod. Destrezza + mod. Saggezza." },
        { level: 1, name: "Arti Marziali", desc: "Un monaco ottiene i seguenti benefici finché è senz'armi o impugna armi da monaco: - Un monaco può usare Destrezza anziché Forza per tiri per colpire ed i tiri per i Danni; - Un monaco può tirare un d4 al posto dei normali danni del suo colpo senz'armi o della sua arma da monaco; Quando un monaco usa l'azione Attacco con un colpo senz'armi o un'arma da monaco nel suo turno, può effettuare un colpo senz'armi come azione bonus." },
      { level: 2, name: "Ki", desc: "A partire dal 2° livello, un monaco può attingere all'energia interiore chiamata Ki per potenziare le sue abilità. Ha un numero di punti Ki pari al suo livello da monaco. Può spendere questi punti per utilizzare le seguenti abilità: - Difesa Paziente; - Passo del Vento; - Raffica di Colpi."},
        { level: 2, name: "Movimento senza Armatura", desc: "Al 2° livello, la velocità di un monaco aumenta di 3 metri finché il monaco non indossa alcuna armatura e non impugna uno scudo." },
        { level: 3, name: "Tradizione Monastica", desc: "Il monaco si vota ad una tradizione monastica: la Via della Mano Aperta, la Via dell'Ombra o la Via dei Quattro Elementi. La tradizione scelta conferisce ulteriori poteri e abilità al 3° livello e poi di nuovo al 6°, 11° e 17° livello." },
        { level: 3, name: "Deviare Proiettili", desc: "Al 3° livello, un monaco può usare la sua reazione per deviare o afferrare un proiettile quando colpito dall'attacco con un'arma a distanza. Quando lo fa, il danno che subisce è ridotto di 1d10 + il mod. Destrezza + il livello del monaco. Se riduce i danni a 0, può afferrare il proiettile e spendere un punto Ki per rilanciarlo indietro." },
        { level: 4, name: "Aumento Punteggio Caratteristica", desc: "Al 4° livello, poi all'8°, al 12°, al 16° ed al 19°, un monaco può aumentare uno dei suoi punteggi di caratteristica di 2, o due punteggi di caratteristica di 1. Non è possibile aumentare un punteggio di caratteristica oltre 20 in questo modo." },
        { level: 4, name: "Caduta Lenta", desc: "Al 4° livello, un monaco può usare la sua reazione quando cade per ridurre gli eventuali danni da caduta di un ammontare pari a cinque volte il suo livello da monaco."},
        { level: 5, name: "Attacco Extra", desc: "A partire dal 5° livello, un monaco può attaccare due volte, invece di una, quando effettua l'azione Attacco durante il suo turno." },
        { level: 5, name: "Colpo Stordente", desc: "Al 5° livello, un monaco può usare un'azione bonus per tentare di stordire un avversario colpito da un attacco senz'armi. L'avversario deve superare un tiro salvezza su Saggezza con CD pari a 8 + il mod. Destrezza del monaco + il livello del monaco, oppure sarà stordito fino alla fine del turno successivo del monaco." },
    { level: 6, name: "Colpi Ki Potenziati", desc: "Al 6° livello, i colpi senz'armi del monaco infliggono danni maggiori. Il dado danni dei colpi senz'armi aumenta a d6." },
    { level: 7, name: "Elusione", desc: "A partire dal 7° livello, un monaco può evitare i danni da area con un tiro salvezza riuscito. Se supera il tiro salvezza, subisce solo la metà dei danni." },
    { level: 7, name: "Mente Lucida", desc: "Al 7° livello, un monaco ottiene resistenza ai danni psichici e vantaggio ai tiri salvezza contro incantesimi e altri effetti che influenzano la mente." },
    { level: 10, name: "Purezza del Corpo", desc: "A partire dal 10° livello, un monaco diventa immune a malattie e veleni grazie alla sua disciplina." },
    { level: 13, name: "Lingua del Sole e della Luna", desc: "Al 13° livello, un monaco può parlare, leggere e scrivere qualsiasi lingua grazie alla sua connessione con il Ki." },
    { level: 14, name: "Anima Adamantina", desc: "A partire dal 14° livello, un monaco può usare la sua reazione per ridurre i danni subiti da un attacco a distanza di un ammontare pari al suo livello da monaco." },
    { level: 15, name: "Colpo senza Tempo", desc: "Al 15° livello, un monaco può usare un'azione bonus per effettuare un attacco senz'armi come se fosse il suo turno, senza spendere punti Ki." },
    { level: 18, name: "Corpo Vuoto", desc: "A partire dal 18° livello, un monaco può entrare in uno stato di meditazione profonda per un minuto, diventando immune a tutti i danni e agli effetti fino alla fine del suo turno." },
    
    ]
    },
  {
    index: "paladin",
    name: "Paladino",
    hit_die: 10,
    saving_throws: ["Saggezza", "Carisma"],
    proficiencies: ["Armi semplici", "Armi da guerra", "Armature leggere", "Armature medie", "Armature pesanti", "Scudi"],
    proficiency_choices: [
      {
        choose: 2,
        type: "skills",
        from: ["Atletica", "Intimidire", "Intuizione", "Medicina", "Religione", "Persuasione"]
      }
    ],
    subclasses: [
      { name: "Giuramento di Devozione", desc: "Difensore della giustizia" },
      { name: "Giuramento della Vendetta", desc: "Cacciatore implacabile" }
    ],
    features: [
        { level: 1, name: "Percezione del Divino", desc: "Un paladino percepisce la presenza del male particolarmente forte come se un fetore assalisse le sue narici, mentre una forte presenza del bene equivale per lui ad una musica celestiale. Con un'azione, un paladino può proiettare le sue percezioni attorno a sè per avvertire la presenza di queste forze. Fino alla fine del suo turno successivo, il paladino conosce l'ubicazione di ogni celeste, immondo o non morto entro 18 metri da lui. Questo privilegio può essere usato un numero di volte pari a 1 + il suo modificatore di Carisma." },
      { level: 1, name: "Imposizione delle Mani", desc: "Un paladino possiede una riserva di poteri curativi che si ricostituisce ad ogni riposo lungo. Grazie a ciò, il paladino può ripristinare un numero totale di punti ferita pari a cinque volte il proprio livello da paladino. con un'azione, il paladino può toccare una creatura per ripristinare un certo numero di punti ferita. In alternativa, può spendere 5 punti ferita dalla sua riserva per curare il bersaglio da una malattia o neutralizzare un veleno." },
        { level: 2, name: "Stile di Combattimento", desc: "Al 2° livello, un paladino adotta uno stile di combattimento in cui specializzarsi tra: - Combattere con Armi Possenti; - Difesa; - Duellare; - Protezione." },
        { level: 2, name: "Incantesimi", desc: "Al 2° livello, un paladino ottiene accesso agli incantesimi." },
        { level: 2, name: "Punizione Divina", desc: "Al 2° livello, quando il paladino colpisce una creatura con un attacco con un'arma da mischia, può spendere uno slot incantesimo per infliggere danni radiosi, in aggiunta ai danni dell'arma. I danni extra sono 2d8 per uno slot di 1° livello, più 1d8 per ogni livello di incantesimo superiore, fino ad un massimo di 5d8. I danni aumentano di 1d8 contro non morti o immondi." },
        { level: 3, name: "Salute Divina", desc: "Giunto al 3° livello, un paladino diventa immune alle malattie grazie alla magia divina." },
        { level: 3, name: "Giuramento Sacro", desc: "Al 3° livello, il paladino formula il giuramento che lo vincolerà alla sua vocazione. Deve scegliere tra: Giuramento di Devozione, Giuramento degli Antichi o Giuramento di Vendetta. Ogni giuramento conferisce privilegi speciali al 3° livello e poi di nuovo al 7°, al 15° ed al 20°." },
        { level: 4, name: "Aumento Punteggio Caratteristica", desc: "Al 4° livello, poi all'8°, al 12°, al 16° ed al 19°, un paladino può aumentare uno dei suoi punteggi di caratteristica di 2, o due punteggi di caratteristica di 1. Non è possibile aumentare un punteggio di caratteristica oltre 20 in questo modo." },
        { level: 5, name: "Attacco Extra", desc: "A partire dal 5° livello, un paladino può attaccare due volte, invece di una, quando effettua l'azione Attacco durante il suo turno." },
        { level: 6, name: "Aura di Protezione", desc: "A partire dal 6° livello, il paladino emana un'aura che protegge i suoi alleati. Ogni alleato che si trova entro 3 metri dal paladino aggiunge il suo modificatore di Carisma ai tiri salvezza." },
        { level: 10, name: "Aura di Coraggio", desc: "A partire dal 10° livello, l'aura del paladino aumenta la determinazione dei suoi alleati. Ogni alleato che si trova entro 3 metri dal paladino ha vantaggio sui tiri salvezza contro la paura." },
        { level: 11, name: "Punizione Divina Migliorata", desc: "A partire dall'11° livello, quando il paladino colpisce una creatura con un attacco con un'arma da mischia, può spendere uno slot incantesimo per infliggere danni radianti aggiuntivi. I danni extra sono 3d8 per uno slot di 1° livello, più 1d8 per ogni livello di incantesimo superiore, fino ad un massimo di 6d8. I danni aumentano di 1d8 contro non morti o immondi." },
        { level: 14, name: "Tocco Purificatore", desc: "A partire dal 14° livello, il paladino può usare l'Imposizione delle Mani per curare se stesso o un alleato a distanza di 9 metri." },
        { level: 18, name: "Aure Migliorate", desc: "A partire dal 18° livello, l'aura del paladino infonde coraggio nei suoi alleati. Ogni alleato che si trova entro 3 metri dal paladino non può essere spaventato." },
    ]
  },
  {
    index: "ranger",
    name: "Ranger",
    hit_die: 10,
    saving_throws: ["Forza", "Destrezza"],
    proficiencies: ["Armi semplici", "Armi da guerra", "Armature leggere", "Armature medie", "Scudi"],
    proficiency_choices: [
      {
        choose: 3,
        type: "skills",
        from: ["Atletica", "Indagare", "Intuizione", "Sopravvivenza", "Percezione", "Furtività", "Addestrare Animali", "Natura"]
      }
    ],
    subclasses: [
      { name: "Cacciatore", desc: "Esperto di predazione" },
      { name: "Signore delle Bestie", desc: "Compagno animale" }
    ],
    features: [
      { level: 1, name: "Nemico Prescelto", desc: "Il ranger sceglie un tipo di creatura come nemico prescelto. Ottiene vantaggi nelle prove di Sopravvivenza effettuate per seguire le tracce dei suoi nemici prescelti, nonché alle prove di Intelligenza per ricordare le informazioni su di esse. Quando ottiene questo privilegio, il ranger apprende anche un linguaggio a sua scelta tra quelli parlati dal suo nemico prescelto (purché ne parli uno). Il ranger sceglie un nemico prescelto al 6° ed al 14° livello." },
      { level: 1, name: "Esploratore Nato", desc: "Il ranger sceglie un tipo di terreno prescelto. Quando effettua una prova di Intelligenza o di Saggezza relativa al suo terreno prescelto, raddoppia il suo bonus di competenza se usa un'abilità in cui possiede competenza. Quando viaggia per un'ora o più, in una regione del suo terreno prescelto, ottiene i seguenti benefici: - il terreno difficile non rallenta il gruppo; - il suo gruppo non può smarrirsi, se non per cause magiche; - Anche se il ranger è impegnato, rimane allerta nei confronti dei potenziali pericoli; - se il ranger viaggia da solo, può muoversi furtivamente a passo normale; - quando foraggia, il ranger trova il doppio del cibo che troverebbe normalmente; - quando segue tracce di altre creature, ne conosce il numero esatto, le loro taglie e da quanto tempo sono passate nell'area. Il ranger sceglie altri tipi di terreno al 6° ed al 10° livello." },
      { level: 2, name: "Stile di Combattimento", desc: "Al 2° livello, il ranger adotta uno stile di combattimento in cui specializzarsi scegliendo tra le seguenti opzioni: - Combattere con Due Armi; - Difesa; - Duellare; - Tiro." },
      { level: 2, name: "Incantesimi", desc: "Accedi alla magia della Natura per lanciare incantesimi in modo simile ad un druido." },
      { level: 3, name: "Archetipo Ranger", desc: "Al 3° livello, il ranger sceglie un archetipo che gli conferisce privilegi speciali, di nuovo al 7°. all'11° ed al 15° livello. Gli archetipi del ranger sono: Cacciatore o Signore delle Bestie." },
      { level: 3, name: "Consapevolezza Primordiale", desc: "A partire dal 3° livello, il ranger può usare la sua azione e spendere uno slot per concentrare la sua percezione. Per 1 minuto per ogni livello dello slot incantesimi speso, il ranger può percepire se le creature sono presenti entro 1.5 km da lui (o entro 9km se si trova nel suo terreno prescelto)." },
      { level: 4, name: "Aumento Punteggio Caratteristica", desc: "Al 4° livello, e poi di nuovo all'8°, 10°, 12°, 16° e 19° livello, un ranger può aumentare il punteggio di uno dei suoi valori di caratteristica di 2 punti, oppure può scegliere di aumentare due valori di caratteristica di 1 punto ciascuno." },
        { level: 5, name: "Attacco Extra", desc: "A partire dal 5° livello, il ranger può attaccare due volte, invece di una, quando effettua l'azione Attacco durante il suo turno." },
        { level: 8, name: "Andatura sul Territorio", desc: "A partire dall'8° livello, il ranger può muoversi attraverso il terreno difficile non magico senza subire penalità per il terreno difficile. Inoltre dispone di vantaggio ai TS contro vegetali creati magicamente." },
        { level: 10, name: "Nascondersi in Piena Vista", desc: "A partire dal 10° livello, il ranger può impiegare 1 minuto per mimetizzarsi con l'ambiente. Deve essere in grado di accedere a fango fresco, terriccio, vegetali, fuliggine ecetera. Una volta mimetizzatosi, può tentare di nascondersi appiattendosi contro una parete o un albero. Il ranger ottiene un bonus di +10 alle prove di Furtività fintanto che rimane immobile." },
        { level: 14, name: "Svanire", desc: "A partire dal 14° livello, il ranger può usare la sua azione di Nascondersi come azione bonus nel suo turno." },
        { level: 18, name: "Sensi Ferini", desc: "A partire dal 18° livello, il ranger sviluppa un senso soprannaturale che gli permette di combattere con creature che non è in grado di vedere. Quando un ranger attacca una creatura che non è in grado di vedere, la sua incapacità nel localizzarla non impone svantaggio ai tiri per colpire. Inoltre è consapevole dell'ubicazione di qualsiasi creatura invisibile entro 9 metri da lui." },
        { level: 20, name: "Sterminatore di Nemici", desc: "Al 20° livello, il ranger diventa un cacciatore impeccabile. Una volta per ogni suo turno può aggiungere il suo Modificatore di Saggezza al tiro per colpire o al tiro per i danni contro uno dei suoi nemici prescelti." }
    
    ]
  },
  {
    index: "rogue",
    name: "Ladro",
    hit_die: 8,
    proficiencies: ["Armature leggere", "Armi semplici", "Balestre leggere", "Spade corte", "Spade lunghe", "Stocchi"],
    proficiency_choices: [
      {
        choose: 4,
        type: "skills",
        from: ["Acrobazia", "Atletica", "Intimidire", "Intrattenere", "Percezione", "Persuasione", "Inganno", "Furtività", "Rapidità di mano", "Intuizione", "Indagare"]
      }
    ],
    subclasses: [
      { name: "Assassino", desc: "Maestro degli agguati" },
      { name: "Furfante", desc: "Specialista in agilità" },
        { name: "Mistificatore Arcano", desc: "Combina magia e furtività" }
    ],
    features: [
      { level: 1, name: "Attacco Furtivo", desc: "A partire dal 1° livello, ed una volta per turno, il ladro può infliggere 1d6 danni extra ad una creatura che colpisce con un attacco, se dispone di vantaggio al tiro per colpire. l'attacco deve utilizzare un'arma accurata o a distanza." },
      { level: 1, name: "Maestria", desc: "Al 1° livello, un ladro sceglie due tra le sue competenze nelle abilità, oppure una sua competenza in un'abilità e la competenza negli arnesi da scasso. Il suo bonus di competenza raddoppia per ogni prova di caratteristica effettuata usando una delle competenze scelte." },
      { level: 1, name: "Gergo Ladresco", desc: "Il ladro ha appreso il gergo ladresco, un misto di dialetto, termini colloquiali e codici che gli permette di nascondere messaggi in una conversazione apparentemente normale. Inoltre, il ladro capisce una serie di segni segreti e simboli usati per trasmettere semplici messaggi brevi." },
      { level: 2, name: "Azione Scaltra", desc: "A partire dal 2° livello, la prontezza e l'agilità di un ladro gli consentono di muoversi in fretta. Il ladro può effettuare un'azione bonus di Disimpegno, Nascondersi o Scatto in ognuno dei suoi turni in combattimento." },
      { level: 3, name: "Archetipo Ladresco", desc: "Al 3° livello, un ladro sceglie un archetipo ladresco che gli conferisce privilegi speciali. Gli archetipi ladreschi sono: Assassino, Furfante o Mistificatore Arcano." },
      { level: 4, name: "Aumento Punteggio Caratteristica", desc: "Al 4° livello, e poi di nuovo all'8°, 10°, 12°, 16° e 19° livello, un ladro può aumentare il punteggio di uno dei suoi valori di caratteristica di 2 punti, oppure può scegliere di aumentare due valori di caratteristica di 1 punto ciascuno." },
      { level: 5, name: "Schivata Prodigiosa", desc: "A partire dal 5° livello, quando un ladro viene attaccato, può usare la sua reazione per dimezzare i danni che subirebbe dall'attacco." },
        { level: 7, name: "Elusione", desc: "A partire dal 7° livello, quando il ladro è soggetto ad un effetto che gli consente di effettuare un TS su Destrezza per dimezzare i danni, non subisce alcun danno se supera il tiro e soltanto la metà dei danni se lo fallisce." },
        { level: 11, name: "Dote Affidabile", desc: "All'11° livello, un ladro ha affinato le abilità da lui scelte. Ogni volta che effettua una prova di caratteristica che gli permette di aggiungere il suo bonus di competenza, considera un tiro del d20 pari o inferiore a 9 come se fosse un 10." },
        { level: 14, name: "Percezione Cieca", desc: "A partire dal 14° livello, se il ladro è in grado di sentire, è consapevole dell'ubicazione di ogni creatura nascosta o invisibile entro 3 metri da lui." },
        { level: 15, name: "Mente Sfuggente", desc: "A partire dal 15° livello, il ladro sviluppa una maggiore resistenza mentale. Ottiene competenza nei TS su Saggezza." },
        { level: 18, name: "Inafferrabile", desc: "A partire dal 18° livello, a meno che non sia incapacitato, nessun tiro per colpire effettuato contro il ladro dispone di vantaggio." },
        { level: 20, name: "Colpo di Fortuna", desc: "Al 20° livello, se l'attacco del ladro manca un bersaglio entro gittata, il ladro può trasformare l'attacco fallito in un attacco di successo. In alternativa, se fallisce una prova di caratteristica, può considerare il risultato del tiro del d20 come un 20. Una volta utilizzato, il ladro deve completare un riposo breve o lungo per poterlo utilizzare di nuovo." }
    ]
  },
  {
    index: "sorcerer",
    name: "Stregone",
    hit_die: 6,
    saving_throws: ["Costituzione", "Carisma"],
    sorcerer_points: [{ level: 1, points: 0 }, { level: 2, points: 2 }, { level: 3, points: 3 }, { level: 4, points: 4 }, { level: 5, points: 5 }, { level: 6, points: 6 }, { level: 7, points: 7 }, { level: 8, points: 8 }, { level: 9, points: 9 }, { level: 10, points: 10 }, { level: 11, points: 11 }, { level: 12, points: 12 }, { level: 13, points: 13 }, { level: 14, points: 14 }, { level: 15, points: 15 }, { level: 16, points: 16 }, { level: 17, points: 17 }, { level: 18, points: 18 }, { level: 19, points: 19 }, { level: 20, points: 20 }],
    proficiencies: ["Balestre leggere", "Bastoni ferrati", "Dardi", "Fionde", "Pugnali"],
    proficiency_choices: [
      {
        choose: 2,
        type: "skills",
        from: ["Arcano", "Inganno", "Intimidire", "Intuizione", "Persuasione", "Religione"]
      }
    ],
    subclasses: [
      { name: "Origine Draconica", desc: "Potere del sangue draconico" },
      { name: "Magia Selvaggia", desc: "Poteri imprevedibili" }
    ],
    features: [
      { level: 1, name: "Incantesimi", desc: "Un evento nel passato dello stregone o nella vita di un suo parente o antenato ha lasciato su di lui un segno indelebile, infondendogli una fonte di magia arcana. E' questa fonte di magia ad alimentare i suoi incantesimi." },
      { level: 1, name: "Origine Stregonesca", desc: "Il giocatore sceglie un'origine stregonesca che definisca la fonte di dei poteri innati dello stregone: Discendenza Draconica o Magia Selvaggia. Questa scelta conferisce allo stregone alcuni privilegi al 1° livello e poi di nuovo al 6°, 14° e 18°" },
      { level: 2, name: "Fonte di Magia", desc: "A partire dal 2° livello, lo stregone può attingere alla sua fonte di magia per lanciare incantesimi. Il numero di punti stregoneschi a disposizione aumenta con il livello dello stregone." },
      { level: 3, name: "Metamagia", desc: "A partire dal 3° livello, poi al 10° e poi al 17°, lo stregone sviluppa la capacità di plasmare i propri incantesimi ed ottiene queste opzioni di Incantesimo di Metamagia a scelta: Celato, Distante, Esteso, Intensificato, Potenziato, Preciso, Raddoppiato, Rapido" },
      { level: 4, name: "Aumento Punteggio Caratteristica", desc: "Al 4° livello, e poi di nuovo all'8°, 10°, 12°, 16° e 19° livello, uno stregone può aumentare il punteggio di uno dei suoi valori di caratteristica di 2 punti, oppure può scegliere di aumentare due valori di caratteristica di 1 punto ciascuno." },
      { level: 20, name: "Ripristino Stregonesco", desc: "Al 20° livello, uno stregone recupera 4 punti stregoneria spesi ogni volta che completa un riposo breve." }
    ]
  },
  {
    index: "warlock",
    name: "Warlock",
    hit_die: 8,
    saving_throws: ["Saggezza", "Carisma"],
    proficiencies: ["Armi semplici", "Balestre leggere"],
    proficiency_choices: [
      {
        choose: 2,
        type: "skills",
        from: ["Arcano", "Inganno", "Intimidire", "Storia", "Religione"]
      }
    ],
    subclasses: [
      { name: "Patto del Fiend", desc: "Patti con demoni e diavoli" },
      { name: "Patto del Grande Antico", desc: "Patti con entità cosmiche" }
    ],
    features: [
      { level: 1, name: "Patrono Ultraterreno", desc: "Un warlock stipula un patto con un essere extraplanare a sua scelta: Signore Fatato, Immondo o Grande Antico. La scelta del patrono gli conferisce alcuni privilegi al 1° livello e poi ancora al 6°, 10° e 14°." },
      { level: 2, name: "Suppliche Occulte", desc: "Dedicandosi allo studio, un warlock ha scoperto come usare alcune suppliche occulte che gli conferiscono persistenti doti magiche. Al 2° livello ottiene due suppliche a sua scelta. Ai livelli superiori, ottiene ulteriori suppliche a sua scelta. Quando acquisisce un nuovo livello, il warlock può scegliere una delle suppliche che conosce e sostituirla con un'altra che potrebbe imparare a quel livello."},
      { level: 3, name: "Dono del Patto", desc: "Al 3° livello, il patrono elargisce al warlock un dono per ricompensarlo dei suoi fedeli servigi. Il warlock ottiene uno dei privilegi seguenti a sua scelta: Patto della Catena, Patto della Lama o Patto del Tomo." },
      { level: 4, name: "Aumento Punteggio Caratteristica", desc: "Al 4° livello, e poi di nuovo all'8°, 10°, 12°, 16° e 19° livello, un warlock può aumentare il punteggio di uno dei suoi valori di caratteristica di 2 punti, oppure può scegliere di aumentare due valori di caratteristica di 1 punto ciascuno." },
      { level: 11, name: "Arcanum Mistico", desc: "Al 11° livello, il patrono rivela al warlock un segreto magico chiamato Arcanum. Il warlock sceglie un incantesimo di 6° livello dalla lista degli incantesimi da warlock come Arcanum. Il warlock può lanciare tale incantesimo senza spendere slot. Deve completare un riposo lungo prima di poterlo utilizzare di nuovo. Ai livelli successivi, il warlock ottiene altri incantesimi a sua scelta da lanciare in questo modo: un incantesimo di 7° al 13° livello, un incantesimo di 8° al 15° livello ed un incantesimo di 9° al 17° livello." },
      { level: 20, name: "Maestro dell'Occulto", desc: "Al 20° livello, un warlock può lanciare un incantesimo del suo libro degli incantesimi senza spendere uno slot incantesimo. Può farlo una volta per riposo lungo." }
    ]
  },
  {
    index: "wizard",
    name: "Mago",
    hit_die: 6,
    saving_throws: ["Intelligenza", "Saggezza"],
    proficiencies: ["Bastoni", "Pugnali", "Balestre leggere"],
    proficiency_choices: [
      {
        choose: 2,
        type: "skills",
        from: ["Arcano", "Storia", "Indagare", "Religione", "Intuizione"]
      }
    ],
    subclasses: [
      { name: "Tradizione Arcana", desc: "Scuola di magia" }
    ],
    features: [
      { level: 1, name: "Incantesimi", desc: "Un mago possiede che contiene sei incantesimi da mago di 1° livello a sua scelta. Questo libro contiene tutti gli incantesimi conosciuti ad eccezione dei Trucchetti, che sono impressi nelal mente dell'incantatore." },
      { level: 1, name: "Recupero Arcano", desc: "Una volta al giorno, quando completa un riposo breve, il mago sceglie quali slot recuperare. Questi slot possono avere un livello totale pari o inferiore alla metà del livello del mago." },
      { level: 2, name: "Tradizione Arcana", desc: "Al 2° livello, un mago sceglie una tradizione arcana che modellerà la sua pratica di magia: Abiurazione, Ammaliamento, Divinazione, Evocazione, Illusione, Invocazione, Necromanzia, Trasmutazione." },
      { level: 4, name: "Aumento Punteggio Caratteristica", desc: "Al 4° livello, e poi di nuovo all'8°, 12°, 16° e 19° livello, un mago può aumentare il punteggio di uno dei suoi valori di caratteristica di 2 punti, oppure può scegliere di aumentare due valori di caratteristica di 1 punto ciascuno." },
      { level: 6, name: "Privilegio della Tradizione Arcana", desc: "La scuola scelta conferisce al mago alcuni privilegi al 2° livello e poi di nuovo al 6°, 10° e 14° livello"},
      { level: 18, name: "Maestria negli Incantesimi", desc: "Il mago raggiunge una tale padronanza nell'uso di certi incantesimi da poterli lanciare a volontà. Egli sceglie un incantesimo di 1° ed uno di 2° livello, dal suo libro degli incantesimi, da lanciare al loro livello più basso senza spendere slot. Dedicando 8 ore di studio, il mago può cambiare incantesimi, purché dello stesso livello." },
        { level: 20, name: "Incantesimi Personali", desc: "Quando un mago arriva al 20° livello, padroneggia due potenti incantesimi che sia in grado di lancare con minimo sforzo. Il mago sceglie due incantesimi da mago di 3° livello contenuti nel suo libro come suoi incantesimi personali. Il mago li considera sempre preparati, non li conta ai fini di determinare il numero di incantesimi preparati e può lanciare ognuno di quegli incantesimi una volta al 3° livello senza spendere uno slot." }
    ]
  }
];
