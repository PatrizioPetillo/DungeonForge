// src/components/widget/MostroWidget.jsx
import React from "react";
import "../../styles/mostroWidget.css";

const MostroWidget = ({ onClick }) => {
  return (
    <div className="widget-mostro" onClick={onClick}>
      <h3>👹 Mostri</h3>
      <p>Crea o consulta mostri per la tua campagna.</p>
    </div>
  );
};

export default MostroWidget;
