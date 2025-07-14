// src/components/widget/EnigmaWidget.jsx

import React from "react";
import '../../styles/enigmaWidget.css';

const EnigmaWidget = ({ onClick }) => {
  return (
    <div className="widget-enigma" onClick={onClick}>
      <h3>🧠 Enigmi</h3>
      <p>Genera enigmi logici, trappole o indovinelli per mettere alla prova i tuoi giocatori.</p>
    </div>
  );
};

export default EnigmaWidget;
