import React from "react";
import { generaLootCasualePerPNG } from "../../utils/generators";

const LootBox = ({ loot, onUpdate }) => (
  <div>
    <strong>🎁 Loot:</strong>
    {loot && loot.length > 0 ? (
      <ul>
        {loot.map((item, idx) => (
          <li key={idx}>
            {item.nome} ({item.rarita})
          </li>
        ))}
      </ul>
    ) : (
      <p>Nessun loot assegnato.</p>
    )}
    <button onClick={() => onUpdate(generaLootCasualePerPNG(2))}>🔄 Rigenera Loot</button>
  </div>
);

export default LootBox;
