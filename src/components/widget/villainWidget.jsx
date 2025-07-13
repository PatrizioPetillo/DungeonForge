import React from "react";
import "../../styles/villainWidget.css";

const VillainWidget = ({ onClick }) => {
  return (
    <div className="villain-widget" onClick={onClick}>
      <h3>🧿 Villain</h3>
      <p>Genera o crea manualmente un antagonista memorabile per la tua campagna.</p>
    </div>
  );
};

export default VillainWidget;
