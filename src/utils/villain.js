import { getRazzaData } from "./razzaUtils";
import { getNomeClasseIT } from "./classeUtils";
import { getClasseData, isCompetenteIn } from "./classeUtils";

export const generaVillain = () => {
  const nomi = [
    "Tharivax",
    "Malraen",
    "Virella",
    "Dorgal",
    "Zekarith",
    "Asmora",
    "Valgros",
    "Kalthor",
    "Nerith",
    "Zyphira",
    "Gorath",
    "Xelara",
    "Valthrax",
    "Draugon",
    "Morgath",
  ];
  const titoli = [
    "il Corruttore",
    "la Lama Sussurrante",
    "il Rinnegato",
    "la Madre di Spine",
    "l’Architetto del Dolore",
    "la Voce dell’Oscurità",
    "il Signore dei Non Morti",
    "la Regina delle Ombre",
    "il Distruttore di Mondi",
    "l’Erede della Distruzione",
    "il Signore della Morte",
    "la Fiamma Infernale",
    "l’Ombra Infinita",
    "il Custode del Segreto",
  ];
  const razze = [
    "Umano",
    "Tiefling",
    "Elfo",
    "Nano",
    "Elfo Oscuro",
    "Mezzorco",
    "Mezzodemone",
    "Vampiro",
    "Licantropo",
    "Draconico",
    "Goblin",
    "Gnomo",
    "Halfling",
    "Mezzelfo",
    "Orco",
    "Bugbear",
    "Aarakocra",
    "Genasi",
    "Githyanki",
    "Githzerai",
    "Tabaxi",
    "Kobold",
    "Firbolg",
    "Changeling",
    "Shifter",
    "Kalastar",
    "Yuan-ti",
    "Loxodon",
    "Simic Hybrid",
    "Vedalken",
    "Minotauro",
    "Centauro",
    "Tritone",
    "Aasimar",
    "Golem",
    "Fomorian",
    "Oni",
    "Hobgoblin",
    "Kalashtar",
    "Revenant",
    "Warforged",
    "Sahuagin",
    "Merfolk",
    "Gith",
    "Duergar",
  ];
  const classi = [
    "wizard", 
    "paladin", 
    "druid", 
    "warlock", 
    "sorcerer", 
    "cleric", 
    "bard", 
    "fighter", 
    "rogue", 
    "barbarian", 
    "monk", 
    "artificer", 
    "ranger",
  ];
  const background = [
    "un ex eroe, caduto in disgrazia",
    "un sacerdote rinnegato",
    "un erede facoltoso",
    "un ex nobile, ora un paria",
    "un figlio di un demone",
    "un nobile decaduto",
    "un cacciatore di tesori maledetto",
    "un mago tradito",
    "un assassino pentito",
    "un mercenario senza scrupoli",
    "un esiliato da un altro regno",
    "una vittima di una maledizione antica",
  ];
  const obiettivi = [
    "ottenere l’immortalità",
    "sottomettere il mondo",
    "vendicare un torto subito",
    "ottenere la conoscenza proibita",
    "distruggere il regno",
    "sottomettere gli eroi", 
    "ottenere il potere assoluto",
    "risvegliare un antico male",
    "guidare un esercito di non morti",
  ];
  const metodi = [
    "corruzione",
    "guerra psichica",
    "manipolazione mentale",
    "rituali oscuri",
    "sfruttamento di debolezze",
    "alleanze con demoni",
    "necromanzia",
    "manipolazione politica",
    "sacrifici rituali",
    "inganni arcani",
    "alleanze oscure",
    "rituali proibiti",
    "creazione di mostri",
    "trasformazione in un abominio",
    "sfruttamento di antiche reliquie",
    "evocazione di demoni",
    "trasformazione in un lich",
    "creazione di un culto oscuro",
  ];
  const tratti = [
    "voce ipnotica",
    "sguardo penetrante",
    "unghie affilate come rasoi",
    "pelle pallida come la luna",
    "occhi che brillano nell’ombra",
    "pelle crepata come ossidiana",
    "cicatrice a forma di runa",
    "aura opprimente",
    "sorriso inquietante",
    "mani scheletriche",
    "capelli bianchi come la neve",
  ];
  const frasi = [
    "“La speranza è la menzogna più crudele e la verità.... la verità è solo un’illusione.”",
    "“Quando l’ultimo faro si spegnerà, io sarò lì a danzare sui vostri cadaveri.”",
    "“Verrà il giorno in cui farai una scelta… che ti maledirà per sempre. ”",
    "“Ogni vita che salvo è una catena in più che spezzo. Ogni vita che salvo è un servo devoto che mi segue.”",
    "“La morte non è la fine, ma solo l’inizio della mia vera opera.”",
    "“Il potere è la vera libertà ed io ne sono il suo maestro.”",
    "“La tua anima è solo un altro strumento per il mio dominio.”",
    "“La tua sofferenza è la mia gioia, il tuo dolore il mio trionfo.”",
    "“La luce non può esistere senza l’oscurità, e io sono l’ombra che la consuma.”",
    "“Il mio regno si estenderà oltre le stelle, e tu sarai solo un ricordo.”",
    "“La tua vita è un gioco, e io sono il burattinaio che tira i fili.”",
  ];

  const roll = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const rollStat4d6 = () => {
    const rolls = Array.from(
      { length: 4 },
      () => Math.floor(Math.random() * 6) + 1
    );
    rolls.sort((a, b) => a - b);
    return rolls.slice(1).reduce((acc, val) => acc + val, 0); // somma i 3 più alti
  };

  const formatKey = (str) =>
    str
      .toLowerCase()
      .replace(/ /g, "_")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  const getPortraitPath = (razza, classe) => {
    const key = `${formatKey(razza)}_${formatKey(classe)}`;
    return `/villain_avatars/${key}.jpg`;
  };

  const nome = `${roll(nomi)} ${roll(titoli)}`;
  const razza = roll(razze);
  const classe = roll(classi);
   const stats = generaStatsConPriorita(classe, razza);

 function generaStatsConPriorita(classe, razza) {
  const attributi = ["forza", "destrezza", "costituzione", "intelligenza", "saggezza", "carisma"];
  const baseStats = Object.fromEntries(attributi.map(attr => [attr, 0]));
  const usate = new Set();

  const classeData = getClasseData(classe);
  const primary = classeData?.primary_ability?.[0]?.toLowerCase();
  const secondary = classeData?.secondary_ability?.[0]?.toLowerCase();

  // Usa array fisso e bilanciato
  const rolls = [15, 14, 13, 12, 10, 8];

  // Mescola per rendere i villain variabili
  rolls.sort(() => 0.5 - Math.random());

  let idx = 0;

  // 1. Assegna stat primaria
  if (primary && attributi.includes(primary)) {
    baseStats[primary] = rolls[idx++];
    usate.add(primary);
  }

  // 2. Assegna secondaria
  if (secondary && attributi.includes(secondary) && !usate.has(secondary)) {
    baseStats[secondary] = rolls[idx++];
    usate.add(secondary);
  }

  // 3. Assegna le restanti
  const restanti = attributi.filter(attr => !usate.has(attr));
  for (const attr of restanti) {
    baseStats[attr] = rolls[idx++];
  }

  // 4. Applica bonus razziali in sicurezza
  const razzaData = getRazzaData(razza);
  razzaData?.ability_bonuses?.forEach((b) => {
    const key = b.ability_score.toLowerCase();
    if (baseStats[key] !== undefined) {
      baseStats[key] += b.bonus;
    }
  });

  return baseStats;
}

const mod = (val) => Math.floor((val - 10) / 2);
const modifiers = {};
Object.keys(stats).forEach(k => {
  modifiers[k] = mod(stats[k]);
});

 
  const livello = Math.floor(Math.random() * 11) + 5; // da 5 a 15
  const bg = roll(background);
  const obiettivo = roll(obiettivi);
  const metodo = roll(metodi);
  const tratto = roll(tratti);
  const frase = roll(frasi);
  const descrizione = `Un tempo ${bg}, ora determinato a ${obiettivo} attraverso ${metodo}. È noto per il suo aspetto inquietante: ${tratto}.`;
  const ritratto = getPortraitPath(razza, classe);

  return {
    nome,
    razza,
    classe,
    nomeClasseIT: getNomeClasseIT(classe),
    stats,
    modifiers,
    livello,
    background: bg,
    obiettivo,
    metodo,
    tratto,
    frase,
    descrizione,
    ritratto: getPortraitPath(razza, classe),
  };
};
