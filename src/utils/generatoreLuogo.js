import { casuale } from "./generators";

// Tabelle base
const prefissi = ["Porto", "Rocca", "Valle", "Monte", "Forte", "Campo", "Lago", "Torre", "Castel", "Villaggio", "Città", "Borgo", "Isola", "Foresta", "Pianura", "Deserto", "Palude", "Rovine", "Caverna", "Tempio"];
const suffissi = ["nebbioso", "oscuro", "argentato", "di Mezzo", "delle Ombre", "verde", "delle Lame", "delle Stelle", "della Luna", "delle Acque", "delle Fiamme", "della Tempesta", "della Terra", "dell'Aria", "del Vento", "del Fuoco", "del Gelo", "del Tuono", "del Fulmine"];

const tipi = ["Taverna", "Borgo", "Villaggio", "Città", "Metropoli", "Castello", "Fortezza", "Tempio", "Accampamento", "Rifugio", "Accademia", "Mercato", "Porto", "Miniera", "Fattoria", "Villaggio di Pescatori", "Villaggio di Cacciatori", "Bordello", "Accampamento Nomade", "Villaggio di Artigiani", "Villaggio di Alchimisti", "Villaggio di Maghi", "Villaggio di Guerrieri", "Villaggio di Ladri", "Villaggio di Druidi", "Villaggio di Chierici", "Villaggio di Bardi"];

const risorse = ["Pesca", "Agricoltura", "Miniera", "Commercio", "Allevamento", "Legname", "Spezie", "Artigianato", "Prostituzione", "Mercenari", "Alchimia", "Incantesimi", "Artefatti magici"];
const governi = ["Monarchia", "Consiglio", "Tirannia", "Democrazia", "Teocrazia", "Oligarchia", "Anarchia", "Clan", "Corporazione", "Gilda"];
const divinita = ["Avandra", "Melora", "Pelor", "Bahamut", "Kord", "Asmodeus", "Vecna", "Lolth", "Tiamat", "Corellon", "Sehanine", "Ioun", "Erathis", "Raven Queen", "Moradin", "Gruumsh"];
const difese = ["Palizzata", "Guardia cittadina", "Mura di pietra", "Torri di avvistamento", "Mercenari", "Trappole magiche"];
const climi = ["Montuoso", "Pianura", "Boschivo", "Costiero", "Desertico", "Paludoso", "Ghiacciato", "Città sotterranea", "Isolano", "Rovine antiche", "Cavernoso", "Lacustre", "Vulcanico", "Tempesta perenne"];
const peculiarita = [
  "Mercato sotterraneo segreto",
  "Pontili sospesi sopra l'acqua",
  "Mercato galleggiante famoso nel regno",
  "Architettura in legno antico e pietra",
  "Festival notturno delle lanterne luminescenti",
  "Città scavata nella roccia",
  "Canali al posto delle strade",
  "Galeone arenato che funge da taverna",
  "Antico tempio al centro della piazza",
];
const problemi = [
  "Pirateria dilagante sulle rotte commerciali",
  "Tasse eccessive imposte dal governante locale",
  "Epidemia in corso tra la popolazione",
  "Culto oscuro che agisce nell’ombra ",
  "Briganti sulla via commerciale principale",
  "Un drago è stato avvistato nei cieli vicini",
  "Un antico sigillo è stato rotto, liberando aberrazioni contronatura",
  "Un potente mago ha lanciato un incantesimo che ha causato il caos",
  "Un antico artefatto è stato rubato e ora è in mano a un gruppo di ladri",
];
const hookNarrativi = [
  "Il borgomastro offre una ricompensa per catturare un gruppo di banditi.",
  "Una serie di sparizioni getta il villaggio nel panico.",
  "Il tempio locale nasconde un segreto millenario.",
  "La città è divisa da una guerra tra gilde rivali.",
  "Un misterioso benefattore cerca avventurieri per un incarico rischioso.",
  "Un antico libro di incantesimi è stato rubato dalla biblioteca della città.",
  "Un vecchio eroe chiede aiuto per fermare un cultista oscuro.",
  "Un messaggero porta notizie di un attacco imminente da parte di un esercito nemico.",
  "Un vecchio manufatto magico è stato risvegliato e minaccia di distruggere la città",
];
const eventi = [
  "Festa del Raccolto d’Oro",
  "Fiera d’Autunno delle Meraviglie",
  "Celebrazione della Luna Piena",
  "Gare di combattimento annuali per il titolo di Campione",
  "Mercato notturno delle meraviglie e delle rarità",
  "Processione in onore della divinità locale",
  "Rituale di purificazione delle acque",
  "Cerimonia di incoronazione del nuovo governante",
];

// Nuove tabelle
const quartieri = [
  "Quartiere dei Mercanti",
  "Quartiere degli Artigiani",
  "Distretti dei Templi",
  "Quartiere Nobile",
  "Quartiere dei Ladri",
  "Quartiere Popolare",
  "Porto e Banchine",
  "Zona Industriale",
  "Zona dei Giardini e Parchi",
  "Quartiere delle Ombre"
];
const gilde = [
  "Gilda dei Mercanti",
  "Lega dei Ladri",
  "Circolo dei Druidi",
  "Congregazione degli Alchimisti",
  "Fratellanza della Lama",
  "Ordine dei Maghi",
  "Associazione degli Esploratori",
  "Congrega degli Incantatori",
  "Ordine dei Cacciatori",
  "Gilda dei Costruttori",
];
const leggende = [
  "Un mostro si nasconde sotto le fogne",
  "Una cripta maledetta è sigillata nei sotterranei",
  "Il governante è in realtà un impostore",
  "Un antico tesoro è nascosto nella città",
  "Un antico spirito vaga per le strade di notte",
  "Un portale verso un altro piano è nascosto in un vecchio tempio",
];
const architettura = [
  "Case in pietra con tetti di ardesia",
  "Strade lastricate di marmo nero",
  "Ponti sospesi tra alte torri",
  "Case a graticcio con travi di legno",
  "Castelli con torri merlate",
  "Palazzi con guglie dorate",
  "Capanni di legno annerito",
  "Case di fango e paglia",
  "Strade di ciottoli colorati",
];
const odori = [
  "Odore di spezie e pesce salato",
  "Aroma di birra e fumo di camino",
  "Nebbia e umidità stagnante",
  "Profumo di fiori e erbe aromatiche",
  "Puzza di rifiuti e fogne",
  "Profumo di incenso sacro",
  "Puzza di sangue e ferro",
  "Aroma di legno bruciato e resina",
  "Odore di terra bagnata e muschio",
];

// Funzione principale
export function generaLuogo() {
  const tipo = casuale(tipi);
  let popolazione;
  switch (tipo) {
    case "Taverna": popolazione = 10; break;
    case "Borgo": popolazione = casuale([50, 100, 150]); break;
    case "Villaggio": popolazione = casuale([200, 400, 600]); break;
    case "Città": popolazione = casuale([2000, 5000, 10000]); break;
    case "Metropoli": popolazione = casuale([15000, 30000, 50000]); break;
  }

  const nome = tipo === "Taverna"
    ? `La ${casuale(["Sirena", "Drago", "Luna", "Volpe", "Fenice"])} ${casuale(["Rossa", "Nera", "Dorata", "Argento"])}` 
    : `${casuale(prefissi)} ${casuale(suffissi)}`;

  const governante = `${casuale(["Borgomastro", "Conte", "Sindaco", "Duca"])} ${casuale([
    "Armand", "Fioren", "Grelkan", "Isolde", "Tassel", "Vesper", "Zarath", "Eldrin", "Morgath", "Thalindra", "Cyran", "Liora", "Valen", "Kallista", "Dorian"
  ])}`;

  const luogo = {
    nome,
    tipo,
    popolazione,
    descrizione: `Un ${tipo.toLowerCase()} ${casuale(["vivace", "silenzioso", "misterioso", "decadente"])}, noto per ${casuale(peculiarita)}.`,
    risorse: [casuale(risorse), casuale(risorse)],
    autorita: {
      governante,
      governo: casuale(governi)
    },
    religione: {
      principale: casuale(divinita),
      secondaria: casuale(divinita)
    },
    difese: [casuale(difese), casuale(difese)],
    clima: casuale(climi),
    peculiarita: [casuale(peculiarita), casuale(peculiarita)],
    problema: casuale(problemi),
    hook: casuale(hookNarrativi),
    eventi: [casuale(eventi)],
    architettura: casuale(architettura),
    atmosfera: casuale(odori),
    quartieri: tipo === "Città" || tipo === "Metropoli" ? [casuale(quartieri), casuale(quartieri)] : [],
    gilde: tipo !== "Taverna" ? [casuale(gilde), casuale(gilde)] : [],
    leggende: tipo !== "Taverna" ? [casuale(leggende)] : [],
    immagine: null,
    collegamenti: {
      png: [],
      villain: [],
      capitoli: []
    }
  };

  return luogo;
}
