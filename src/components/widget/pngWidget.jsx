import React from "react";
import "../../styles/pngWidget.css";

export default function PngWidget({ onClick }) {
  return (
    <div className="widget-png" onClick={onClick}>
      <h3>👤 PNG</h3>
      <p>Crea PNG comuni o non comuni per arricchire la tua campagna con personaggi memorabili.</p>
    </div>
  );
}
