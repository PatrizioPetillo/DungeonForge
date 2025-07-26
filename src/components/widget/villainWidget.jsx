import React from "react";
import "../../styles/villainWidget.css";

const VillainWidget = ({ villain, onOpen }) => {
  return (
    <div className="villain-widget" onClick={onOpen}>
      
          <h3>🧿 Villain</h3>
          <p>Genera o crea manualmente un antagonista memorabile per la tua campagna.</p>
        
    </div>
  );
};

export default VillainWidget;
