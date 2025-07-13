import { classes } from '../data/classes';

const classMap = {
  barbaro: "barbarian",
  bardo: "bard",
  chierico: "cleric",
  druido: "druid",
  guerriero: "fighter",
  monaco: "monk",
  paladino: "paladin",
  ranger: "ranger",
  ladro: "rogue",
  stregone: "sorcerer",
  warlock: "warlock",
  mago: "wizard",
  artefice: "artificer"
};

export const getClasseData = (classe) => {
  const normalized = classMap[classe.toLowerCase()] || classe.toLowerCase();
  return classes.find((c) => c.index === normalized);
};


export const NOMI_CLASSI_IT = {
  artificer: "Artefice",
  barbarian: "Barbaro",
  bard: "Bardo",
  cleric: "Chierico",
  druid: "Druido",
  fighter: "Guerriero",
  monk: "Monaco",
  paladin: "Paladino",
  ranger: "Ranger",
  rogue: "Ladro",
  sorcerer: "Stregone",
  warlock: "Warlock",
  wizard: "Mago",
};

export const getNomeClasseIT = (classe) => {
  return NOMI_CLASSI_IT[classe.toLowerCase()] || capitalize(classe);
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const getProficienzeClasse = (nomeClasse) => {
  const classe = getClasseData(nomeClasse);
  return classe?.proficiencies || [];
};

export const isCompetenteIn = (nomeClasse, tipo) => {
  const profs = getProficienzeClasse(nomeClasse).map(p => p.toLowerCase());
  return profs.some(p => p.includes(tipo.toLowerCase()));
};
