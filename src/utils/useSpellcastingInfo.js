import { useEffect, useState } from "react";

export const useSpellcastingInfo = (classe, livello, statMod, proficiencyBonus) => {
  const [isMagical, setIsMagical] = useState(false);
  const [spellcastingAbility, setSpellcastingAbility] = useState(null);
  const [cdIncantesimi, setCdIncantesimi] = useState(null);
  const [bonusAttaccoIncantesimi, setBonusAttaccoIncantesimi] = useState(null);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const fetchSpellcastingInfo = async () => {
      try {
        const res = await fetch(`https://www.dnd5eapi.co/api/classes/${classe}/spellcasting`);
        if (!res.ok) {
          setIsMagical(false);
          return;
        }

        const data = await res.json();
        const ability = data.spellcasting_ability.index;
        setSpellcastingAbility(ability);
        setIsMagical(true);

        // Calcolo CD e bonus
        const statModValue = statMod?.[ability] || 0;
        const cd = 8 + statModValue + proficiencyBonus;
        setCdIncantesimi(cd);
        setBonusAttaccoIncantesimi(statModValue + proficiencyBonus);

        // Slot incantesimi
        const slotRes = await fetch(`https://www.dnd5eapi.co/api/classes/${classe}/levels`);
        const levelsData = await slotRes.json();
        const levelData = levelsData.find(l => l.level === livello);
        const slotsArray = [];
        if (levelData?.spellcasting) {
          for (let i = 1; i <= 9; i++) {
            const chiave = `spell_slots_level_${i}`;
            if (levelData.spellcasting[chiave] > 0) {
              slotsArray.push(levelData.spellcasting[chiave]);
            } else {
              slotsArray.push(0);
            }
          }
          setSlots(slotsArray);
        }
      } catch (err) {
        console.error("Errore fetching spellcasting info:", err);
        setIsMagical(false);
      }
    };

    if (classe && livello) {
      fetchSpellcastingInfo();
    }
  }, [classe, livello, statMod, proficiencyBonus]);

  return {
    isMagical,
    spellcastingAbility,
    cdIncantesimi,
    bonusAttaccoIncantesimi,
    slots,
  };
};
