// statUtils.js

// Lancia 4d6, scarta il dado più basso
export function rollStatistica() {
  const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
  rolls.sort((a, b) => a - b); // ordina per rimuovere il più basso
  return rolls.slice(1).reduce((acc, val) => acc + val, 0);
}

// Calcola modificatore in base al punteggio (standard 5e)
export function getModificatore(stat) {
  return Math.floor((stat - 10) / 2);
}
export const tiraStats = () => {
  const stats = [];
  for (let i = 0; i < 6; i++) {
    let rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => a - b).shift(); // rimuove il più basso
    const total = rolls.reduce((a, b) => a + b, 0);
    stats.push(total);
  }
  return stats;
};

export const calcolaModificatori = (stats) => {
  return {
    str: Math.floor((stats[0] - 10) / 2),
    des: Math.floor((stats[1] - 10) / 2),
    cos: Math.floor((stats[2] - 10) / 2),
    int: Math.floor((stats[3] - 10) / 2),
    sag: Math.floor((stats[4] - 10) / 2),
    car: Math.floor((stats[5] - 10) / 2),
  };
};
