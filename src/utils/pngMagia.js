// pngMagia.js
import axios from "axios";
import { getProficiencyBonus } from "./statUtils";

// Calcola CD incantesimi e bonus attacco magico
export function calcolaDatiMagici(stats, spellcastingAbility, livello) {
  const modCaratteristica = stats[spellcastingAbility]?.mod ?? 0;
  const proficiency = getProficiencyBonus(livello);

  const cdIncantesimi = 8 + modCaratteristica + proficiency;
  const bonusAttacco = modCaratteristica + proficiency;

  return {
    cdIncantesimi,
    bonusAttacco,
  };
}

// Ottiene i dati magici da API se la classe è magica
export async function getSpellcastingInfo(classeSelezionata) {
  try {
    const { data } = await axios.get(
      `https://www.dnd5eapi.co/api/classes/${classeSelezionata.toLowerCase()}`
    );

    if (!data.spellcasting) return null;

    return {
      spellcastingAbility: data.spellcasting.spellcasting_ability.index,
      spellcastingLevel: data.spellcasting.level,
    };
  } catch (error) {
    console.error("Errore nel recupero spellcasting info:", error);
    return null;
  }
}

// Ottiene la tabella slot da API
export async function getSpellSlots(classeSelezionata, livello) {
  try {
    const { data } = await axios.get(
      `https://www.dnd5eapi.co/api/classes/${classeSelezionata.toLowerCase()}/levels/${livello}`
    );

    if (!data.spellcasting) return null;
    return data.spellcasting; // Contiene gli slot per livello
  } catch (error) {
    console.error("Errore nel recupero slot incantesimi:", error);
    return null;
  }
}

// Genera un array casuale di incantesimi in base al livello
export async function getIncantesimiCasuali(classeSelezionata, livello) {
  try {
    const response = await axios.get("https://www.dnd5eapi.co/api/spells");
    const tutti = response.data.results;

    // Filtra per classe
    const incantesimiClasse = [];
    for (let spell of tutti) {
      const dettagli = await axios.get(`https://www.dnd5eapi.co${spell.url}`);
      if (
        dettagli.data.classes.some(
          (cls) => cls.index === classeSelezionata.toLowerCase()
        )
      ) {
        incantesimiClasse.push(dettagli.data);
      }
    }

    // Filtra per livello adatto
    const disponibili = incantesimiClasse.filter(
      (spell) => spell.level <= livello
    );

    // Restituisce 3 casuali come placeholder
    const scelti = [];
    while (scelti.length < 3 && disponibili.length > 0) {
      const rand = Math.floor(Math.random() * disponibili.length);
      scelti.push(disponibili.splice(rand, 1)[0]);
    }

    return scelti;
  } catch (error) {
    console.error("Errore durante il recupero incantesimi:", error);
    return [];
  }
}
