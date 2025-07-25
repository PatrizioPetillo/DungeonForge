import React from "react";
import "../../styles/villainWidget.css";

const VillainWidget = ({ villain, onOpen }) => {
  return (
    <div className="villain-widget" onClick={onOpen}>
      
          <h3>🧿 Villain</h3>
          <p>Crea il tuo antagonista principale</p>
        
    </div>
  );
};

export default VillainWidget;
