// Calcola il modificatore base da punteggio
const getModificatore = (valore) => Math.floor((valore - 10) / 2);

// Abilità collegate
const mappaAbilitaCaratteristica = {
  "Atletica": "Forza",
  "Furtività": "Destrezza",
  "Rapidità di Mano": "Destrezza",
  "Percezione": "Saggezza",
  "Sopravvivenza": "Saggezza",
  "Intuizione": "Saggezza",
  "Arcano": "Intelligenza",
  "Indagare": "Intelligenza",
  "Storia": "Intelligenza",
  "Religione": "Intelligenza",
  "Persuasione": "Carisma",
  "Raggirare": "Carisma",
  "Intimidire": "Carisma"
};

/**
 * Calcola il bonus totale per una prova, con spiegazione.
 * 
 * @param {object} entita - Il personaggio, mostro o villain.
 * @param {string} tipo - "abilita", "salvezza", "caratteristica"
 * @param {string} nomeProva - Es. "Percezione", "Saggezza", "Forza"
 * @param {number} bonusExtra - Bonus manuale opzionale (es. effetto magico)
 * @returns {object} - { valore: numero, spiegazione: string }
 */
export function getBonusProva(entita, tipo, nomeProva, bonusExtra = 0) {
  const stats = entita?.stats || {};
  const prof = entita?.proficienze || [];
  const ts = entita?.ts_salvezza || {};
  const pb = entita?.proficiencyBonus || 2;

  let valore = 0;
  let spiegazione = "";

  if (tipo === "abilita") {
    const car = mappaAbilitaCaratteristica[nomeProva] || "Saggezza";
    const mod = getModificatore(stats[car.toLowerCase()] || 10);
    const competente = prof.includes(nomeProva);
    valore = mod + (competente ? pb : 0) + bonusExtra;
    spiegazione = `mod ${car}: ${mod} ${competente ? `+ competenza: ${pb}` : ""} ${bonusExtra ? `+ extra: ${bonusExtra}` : ""}`;
  }

  else if (tipo === "salvezza") {
    if (ts[nomeProva] !== undefined) {
      valore = ts[nomeProva] + bonusExtra;
      spiegazione = `bonus TS: ${ts[nomeProva]} ${bonusExtra ? `+ extra: ${bonusExtra}` : ""}`;
    } else {
      const mod = getModificatore(stats[nomeProva.toLowerCase()] || 10);
      valore = mod + bonusExtra;
      spiegazione = `mod ${nomeProva}: ${mod} ${bonusExtra ? `+ extra: ${bonusExtra}` : ""}`;
    }
  }

  else if (tipo === "caratteristica") {
    const mod = getModificatore(stats[nomeProva.toLowerCase()] || 10);
    valore = mod + bonusExtra;
    spiegazione = `mod ${nomeProva}: ${mod} ${bonusExtra ? `+ extra: ${bonusExtra}` : ""}`;
  }

  return { valore, spiegazione: spiegazione.trim() };
}
