import { getClasseData } from "./classeUtils";

export const generateEquipment = async (classe, livello) => {
  const tipoClasse = classe.toLowerCase();
  let equipment = [];

  // 1. Fetch proficienze classe via API
  let profs = [];
  try {
    const res = await fetch(`https://www.dnd5eapi.co/api/classes/${tipoClasse}`);
      if (!res.ok) {
    throw new Error(`Classe non trovata: ${tipoClasse} (${res.status})`);
  }
    const data = await res.json();
    profs = data.proficiencies.map(p => p.index);
  } catch (err) {
    console.error("Errore nel fetch proficienze classe:", err);
  }

  // 2. Armi – statiche per ora in base a classe
  const weaponCat = profs.includes("martial-weapons") ? "martial-weapons" : "simple-weapons";

  try {
    const res = await fetch(`https://www.dnd5eapi.co/api/equipment-categories/${weaponCat}`);
    const data = await res.json();
    const arma = data.equipment[Math.floor(Math.random() * data.equipment.length)];
    equipment.push({ nome: arma.name, tipo: "arma", fonte: "api" });
  } catch (err) {
    console.error("Errore arma:", err);
  }

  // 3. Armature – solo se la classe è competente in almeno una categoria
const haCompetenzaArmatura = ["light-armor", "medium-armor", "heavy-armor"].some(cat => profs.includes(cat));
let armorCat = null;

if (haCompetenzaArmatura) {
  if (profs.includes("heavy-armor")) armorCat = "heavy-armor";
  else if (profs.includes("medium-armor")) armorCat = "medium-armor";
  else if (profs.includes("light-armor")) armorCat = "light-armor";

  if (armorCat) {
    try {
      const res = await fetch(`https://www.dnd5eapi.co/api/equipment-categories/${armorCat}`);
      const data = await res.json();
      const armatura = data.equipment[Math.floor(Math.random() * data.equipment.length)];
      equipment = [...equipment, { nome: armatura.name, tipo: "armatura", fonte: "api" }];
    } catch (err) {
      console.error("Errore armatura:", err);
    }
  }
}

  // 4. Oggetti utili
  const utilityItems = [
    "Pozione di invisibilità",
    "Focus arcano inciso",
    "Pergamena maledetta",
    "Amuleto runico",
    "Gemma parlante"
  ];
  const oggettoUtili = utilityItems.sort(() => 0.5 - Math.random()).slice(0, 1);
  oggettoUtili.forEach((n) =>{
    equipment.push({ nome: n, tipo: "oggetto", fonte: "custom" });
  });

  // 5. Oggetto magico se livello alto
  if (livello >= 10) {
    try {
      const res = await fetch(`https://www.dnd5eapi.co/api/magic-items`);
      const data = await res.json();
      const oggettoMagico = data.results[Math.floor(Math.random() * data.results.length)];
      equipment = [...equipment, { nome: oggettoMagico.name, tipo: "magico", fonte: "api" }];
    } catch (err) {
      console.error("Errore oggetto magico:", err);
    }
  }

  return equipment;
};

export const generaInventarioCasuale = (classe) => {
  const oggettiGenerali = [
    "torcia", "sacca", "corda di canapa (15mt)", "pelle di animale", "borraccia", "flauto", "dente inciso", "erbe rare", "piccolo diario", "carta da gioco truccata"
  ];

  const oggettiClasse = {
    rogue: ["grimaldelli", "mantello scuro", "fiala di veleno", "scatola di trappole"],
    wizard: ["pergamene", "inchiostro arcano", "compendio magico", "sfera di cristallo"],
    cleric: ["ampolla di acqua santa", "rosario", "candela benedetta", "libro di preghiere"],
    druid: ["semi di quercia", "fungo raro", "campanella", "bastone di legno antico"],
    barbarian: ["talismano tribale", "scheletro animale", "pezzo di corazza", "fune intrecciata", "cranio intarsiato"],
    paladin: ["manoscritto sacro", "sigillo dell’ordine", "pergamena con giuramento", "scudo decorato"],
    bard: ["strumento musicale", "lettera d’amore", "libro di poesie", "maschera teatrale"],
    sorcerer: ["cristallo crepato", "tatuaggio incantato", "runa sigillata", "bottiglia di polvere magica"],
    artificer: ["ingranaggio misterioso", "ricetta alchemica", "strumento di creazione", "pezzo di metallo raro", "attrezzi"],
    ranger: ["freccia incantata", "feticcio di legno", "boccale di birra artigianale", "collana di denti di lupo"],
    warlock: ["sigillo del patto", "anello oscuro", "talismano di potere", "bottiglia di sangue incantato"]
  };

  const inventario = [];

  // Aggiungi oggetti generici
  for (let i = 0; i < 2 + Math.floor(Math.random() * 3); i++) {
    inventario = [...inventario, oggettiGenerali[Math.floor(Math.random() * oggettiGenerali.length)]];
  }

  const classeKey = getClasseData(classe)?.index;
  const specifici = oggettiClasse[classeKey] || [];
  if (specifici.length) {
    inventario = [...inventario, specifici[Math.floor(Math.random() * specifici.length)]];
  }

  // Aggiungi oro e possibilità di oggetto magico
  const monete = (Math.floor(Math.random() * 10) + 1) * 10;
  inventario = [...inventario, `${monete} monete d'oro`];

  if (Math.random() < 0.25) {
    inventario = [...inventario, "oggetto magico comune (da generare)"];
  }

  return inventario;
};

