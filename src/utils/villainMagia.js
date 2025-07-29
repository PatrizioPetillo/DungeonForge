// src/utils/villainMagia.js

export function generaFocusArcano(classe) {
  const focusPerClasse = {
    bard: ["liuto intarsiato", "arpa da viaggio", "flauto runico"],
    cleric: ["simbolo sacro", "medaglione con il simbolo della divinità", "rosario incantato"],
    druid: ["ramo di quercia sacra", "totem animale", "collana di denti di lupo"],
    wizard: ["bacchetta scolpita", "libro degli incantesimi", "cristallo lucente"],
    warlock: ["pietra dell’araldo", "talismano oscuro", "anello incantato"],
    sorcerer: ["draconic crystal", "orbe incantato", "catalizzatore arcano"],
    paladin: ["simbolo sacro inciso sullo scudo", "anello consacrato", "elmo benedetto"],
    ranger: ["amuleto della natura", "simbolo inciso su arco", "pietra della foresta"]
  };

  const lista = focusPerClasse[classe.toLowerCase()] || ["oggetto arcano generico"];
  return lista[Math.floor(Math.random() * lista.length)];
}
