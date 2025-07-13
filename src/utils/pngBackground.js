// pngBackground.js
import axios from "axios";

// Ottiene tutti i background disponibili
export async function fetchBackgroundList() {
  try {
    const res = await axios.get("https://www.dnd5eapi.co/api/backgrounds");
    return res.data.results; // [{ index, name, url }]
  } catch (error) {
    console.error("Errore nel caricamento lista background:", error);
    return [];
  }
}

// Ottiene i dettagli di un background
export async function fetchBackgroundDetails(index) {
  try {
    const res = await axios.get(`https://www.dnd5eapi.co/api/backgrounds/${index}`);
    const bg = res.data;

    return {
      nome: bg.name,
      descrizione: bg.desc?.join("\n") || "",
      abilità: bg.skill_proficiencies?.map(p => p.name) || [],
      strumenti: bg.tool_proficiencies?.map(p => p.name) || [],
      lingue: bg.languages || [],
      equipaggiamento: bg.starting_equipment?.map(eq => eq.equipment.name) || [],
      talento: bg.feature?.name || "Nessuna feature",
      descrizioneTalento: bg.feature?.desc?.join("\n") || "N/A",
    };
  } catch (error) {
    console.error("Errore nel caricamento dettagli background:", error);
    return null;
  }
}
