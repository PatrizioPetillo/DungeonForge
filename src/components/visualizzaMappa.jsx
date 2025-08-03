// src/components/visualizzaMappa.jsx
import React from "react";

const getEmojiForTipo = (tipo) => {
  switch (tipo) {
    case "Villain": return "🧛‍♂️";
    case "PNG": return "🧑‍🌾";
    case "Mostro": return "💀";
    case "Capitolo": return "📖";
    case "Enigma": return "🧩";
    case "Luogo": return "📍";
    default: return "❓";
  }
};


const VisualizzaMappa = ({ mappa }) => {
  return (
    <div className="mappa-pin-container">
      <img src={mappa.immagine} alt={mappa.titolo} style={{ width: "100%", borderRadius: "8px" }} />

      {mappa.pinNarrativi?.map((pin, i) => (
        <div
          key={i}
          className="pin"
          style={{
            position: "absolute",
            top: `${pin.top * 100}%`,
            left: `${pin.left * 100}%`,
            transform: "translate(-50%, -100%)"
          }}
          title={`${pin.tipo}: ${pin.riferimento || "(senza nome)"}`}
        >
          {getEmojiForTipo(pin.tipo)}
        </div>
      ))}
    </div>
  );
};

export default VisualizzaMappa;
