import { races } from '../data/races';

export const getRazzaData = (nomeRazza) => {
  return races.find(r => r.name.toLowerCase() === nomeRazza.toLowerCase());
};

export const getTrattiRazza = (nomeRazza) => {
  const razza = getRazzaData(nomeRazza);
  return razza?.traits.map(t => `${t.name}: ${t.desc}`) || [];
};

export const getBonusAttributi = (nomeRazza) => {
  const razza = getRazzaData(nomeRazza);
  return razza?.ability_bonuses || [];
};
