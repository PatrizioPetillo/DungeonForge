// src/components/widget/AvventuraWidget.jsx
import React from "react";
import '../../styles/avventuraWidget.css';

function AvventuraWidget({ onApri }) {
  return (
    <div className="widget-avventura" onClick={onApri}>
      <h3>🧭 Compendio One-Shot</h3>
      <p>
        La creatività è esaurita?
        <span className="link-clickabile"> Clicca QUI</span> per avventure già pronte.
      </p>
    </div>
  );
}



export default AvventuraWidget;
