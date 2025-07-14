// src/components/widget/AvventuraWidget.jsx

import React from "react";
import '../../styles/avventuraWidget.css';

const AvventuraWidget = ({ onClick }) => {
  return (
    <div className="widget-avventura" onClick={onClick}>
      <h3>🧭 Avventure Modulari</h3>
      <p>Crea rapidamente una mini avventura in 5 stanze con il metodo Five Room Dungeon.</p>
    </div>
  );
};

export default AvventuraWidget;
