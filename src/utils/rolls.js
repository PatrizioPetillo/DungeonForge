export function roll(formula) {
  const match = formula.match(/(\d+)d(\d+)(\s*\+\s*(-?\d+))?/);
  if (!match) return { totale: 0, dettagli: "Errore formula" };

  const num = parseInt(match[1], 10);
  const dado = parseInt(match[2], 10);
  const bonus = parseInt(match[4], 10) || 0;

  const tiri = Array.from({ length: num }, () => Math.floor(Math.random() * dado) + 1);
  const totale = tiri.reduce((a, b) => a + b, 0) + bonus;

  return {
    totale,
    dettagli: `${tiri.join(" + ")}${bonus ? ` + ${bonus}` : ""} = ${totale}`
  };
}
