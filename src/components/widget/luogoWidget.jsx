// src/components/widget/LuogoWidget.jsx

import React from "react";
import "../../styles/luogoWidget.css";
const LuogoWidget = ({ onClick }) => {
  return (
    <div className="widget-luogo" onClick={onClick}>
      <h3>📍 Luoghi</h3>
      <p>Dalla bettola abbandonata al castello del re, esplora e gestisci tutti i luoghi iconici della tua campagna.</p>
    </div>
  );
};

export default LuogoWidget;
