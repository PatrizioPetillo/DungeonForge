import { roll } from "./rolls";
// Stat suggerite per ogni tipo di attacco
const statPerTipo = {
  melee: "Forza",
  ranged: "Destrezza",
  finesse: "Destrezza" // o Forza, gestibile manualmente
};

// Calcola modificatore stat
const getModificatore = (val) => Math.floor((val - 10) / 2);

/**
 * Calcola il bonus all'attacco e il danno.
 * 
 * @param {object} entita - PNG, Villain, Mostro con stats
 * @param {object} arma - Oggetto arma, es: { nome, tipo: "melee", dado: "1d8", statUsata?, competente: true }
 * @param {number} bonusExtra - Bonus magico o situazionale
 * @returns {object} - { bonusAttacco, dannoBase, spiegazione }
 */

export function getBonusAttacco(entita, arma, bonusExtra = 0, eseguiTiro = false) {
  const stats = entita?.stats || {};
  const proficiencyBonus = entita?.proficiencyBonus || 2;

  const tipo = arma.tipo || "melee";
  const statUsata = arma.statUsata || statPerTipo[tipo] || "Forza";

  const modStat = getModificatore(stats[statUsata.toLowerCase()] || 10);
  const competente = arma.competente !== false;

  const bonusAttacco = modStat + (competente ? proficiencyBonus : 0) + bonusExtra;
  const dannoFormula = `${arma.dado} + ${modStat}`;
  const tiroDanno = eseguiTiro ? roll(dannoFormula) : null;

  const spiegazione = `mod ${statUsata}: ${modStat}${competente ? ` + competenza: ${proficiencyBonus}` : ""}${bonusExtra ? ` + extra: ${bonusExtra}` : ""}`;

  return {
    bonusAttacco,
    dannoFormula,
    tiroDanno,
    spiegazione
  };
}
