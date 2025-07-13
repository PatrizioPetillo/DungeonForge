// PNG.js
import { getClasseData } from "./classeUtils";
import { getRazzaData } from "./razzaUtils";
import { rollStatistica, getModificatore } from "./statUtils";
import { getRandomFromArray, capitalize } from "./helpers";
import { CLASSI, RAZZE } from "../data/listeBase";

export function generaPNG() {
  // 1. Selezione casuale
  const razza = getRandomFromArray(RAZZE);
  const classe = getRandomFromArray(CLASSI);
  const livello = Math.floor(Math.random() * 10) + 1;

  const razzaData = getRazzaData(razza);
  const classeData = getClasseData(classe);

  // 2. Stats base (4d6 drop lowest)
  const baseStats = {
    forza: rollStatistica(),
    destrezza: rollStatistica(),
    costituzione: rollStatistica(),
    intelligenza: rollStatistica(),
    saggezza: rollStatistica(),
    carisma: rollStatistica(),
  };

  // 3. Applica bonus razziali
  const statsFinali = { ...baseStats };
  if (razzaData?.bonus) {
    Object.entries(razzaData.bonus).forEach(([stat, bonus]) => {
      statsFinali[stat] += bonus;
    });
  }

  // 4. Calcolo modificatori
  const modifiers = {};
  for (const [stat, val] of Object.entries(statsFinali)) {
    modifiers[stat] = getModificatore(val);
  }

  // 5. Equipaggiamento (base se competente)
  const equipaggiamento = {};

  if (classeData?.armi?.length) {
    equipaggiamento.arma = classeData.armi[0]; // prima arma base
  }

  if (classeData?.armature?.length) {
    equipaggiamento.armatura = classeData.armature[0]; // prima armatura base
  }

  equipaggiamento.inventario = ["Borsa di cuoio", "Razione da viaggio", "Pugnale"];

  // 6. Generazione del PNG
  const png = {
    nome: generaNomeCasuale(),
    razza,
    classe,
    nomeClasseIT: capitalize(classe),
    livello,
    stats: statsFinali,
    modifiers,
    pf: 8 + modifiers.costituzione + Math.floor((livello - 1) * 5),
    ca: 10 + modifiers.destrezza,
    equipaggiamento,
    ruolo: getRandomFromArray(["Alleato", "Neutrale", "Ostile", "Mentore", "Traditore"]),
    immagine: generaImmaginePNG(razza, classe),
  };

  return png;
}

// 🔧 Funzioni di supporto (temporanee)
function generaNomeCasuale() {
  const nomi = ["Beldron", "Myra", "Torvik", "Lysra", "Drogan", "Kara"];
  const cognomi = ["Granboccale", "Mantoferreo", "Senzaluce", "Argentor", "Corvoscuro"];
  return `${getRandomFromArray(nomi)} ${getRandomFromArray(cognomi)}`;
}

function generaImmaginePNG(razza, classe) {
  const base = "/img/png/";
  return `${base}${razza}_${classe}.jpg`.toLowerCase();
}
