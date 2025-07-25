import { casuale } from "./generators";

// Tabelle base
const prefissi = ["Porto", "Rocca", "Valle", "Monte", "Forte", "Campo", "Lago", "Torre", "Castel"];
const suffissi = ["nebbioso", "oscuro", "argentato", "di Mezzo", "delle Ombre", "verde", "delle Lame"];

const tipi = ["Taverna", "Borgo", "Villaggio", "Città", "Metropoli"];

const risorse = ["Pesca", "Agricoltura", "Miniera", "Commercio", "Allevamento", "Legname", "Spezie", "Artigianato"];
const governi = ["Monarchia", "Consiglio", "Tirannia", "Democrazia", "Teocrazia", "Oligarchia"];
const divinita = ["Avandra", "Melora", "Pelor", "Bahamut", "Kord", "Asmodeus"];
const difese = ["Palizzata", "Guardia cittadina", "Mura di pietra", "Torri di avvistamento", "Mercenari", "Trappole magiche"];
const climi = ["Montagna", "Pianura", "Foresta", "Costa", "Deserto", "Palude", "Ghiacci"];
const peculiarita = [
  "Mercato sotterraneo",
  "Pontili sospesi",
  "Taverne galleggianti",
  "Architettura in legno antico",
  "Festival notturno delle lanterne",
  "Città scavata nella roccia",
  "Canali al posto delle strade"
];
const problemi = [
  "Pirateria dilagante",
  "Tasse eccessive imposte dal governante",
  "Epidemia in corso",
  "Culto oscuro che agisce nell’ombra",
  "Briganti sulla via commerciale",
  "Un drago è stato avvistato nei cieli vicini"
];
const hookNarrativi = [
  "Il borgomastro offre una ricompensa per catturare un gruppo di banditi.",
  "Una serie di sparizioni getta il villaggio nel panico.",
  "Il tempio locale nasconde un segreto millenario.",
  "La città è divisa da una guerra tra gilde rivali.",
  "Un misterioso benefattore cerca avventurieri per un incarico rischioso."
];
const eventi = [
  "Festa del Raccolto",
  "Fiera d’Autunno",
  "Celebrazione della Luna Piena",
  "Gare di combattimento annuali",
  "Mercato notturno delle meraviglie"
];

// Nuove tabelle
const quartieri = [
  "Quartiere dei Mercanti",
  "Distretti dei Templi",
  "Quartiere Nobile",
  "Quartiere Popolare",
  "Porto e Banchine",
  "Quartiere delle Ombre"
];
const gilde = [
  "Gilda dei Mercanti",
  "Lega dei Ladri",
  "Circolo dei Druidi",
  "Fratellanza della Lama",
  "Congrega degli Incantatori",
  "Ordine dei Cacciatori"
];
const leggende = [
  "Un mostro si nasconde sotto le fogne",
  "Una cripta maledetta è sigillata nei sotterranei",
  "Il governante è in realtà un impostore",
  "Un antico tesoro è nascosto nella città"
];
const architettura = [
  "Case in pietra con tetti di ardesia",
  "Strade lastricate di marmo nero",
  "Ponti sospesi tra alte torri",
  "Palazzi con guglie dorate",
  "Capanni di legno annerito"
];
const odori = [
  "Odore di spezie e pesce salato",
  "Aroma di birra e fumo di camino",
  "Nebbia e umidità stagnante",
  "Profumo di incenso sacro",
  "Puzza di sangue e ferro"
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
    "Armand", "Fioren", "Grelkan", "Isolde", "Tassel"
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
