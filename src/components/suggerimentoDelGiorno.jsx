import React, { useEffect, useState } from 'react';
import '../styles/suggerimentoDelGiorno.css';

const suggerimenti = [
  "Non descrivere il dungeon. Fai vivere il dungeon.",
  "Un PNG mediocre è solo un PNG con fame e motivazioni.",
  "I dadi cadono, ma la tensione va costruita.",
  "Se non hanno paura... stai sbagliando bestiario.",
  "Dai un nome alla taverna. O lo daranno loro (e sarà stupido).",
  "La mappa mentale è più importante della mappa grafica.",
  "Lascia un dettaglio fuori posto. I giocatori lo divoreranno.",
  "Un buon villain parla poco, agisce tanto.",
  "Non preparare tutto. Prepara bene l'improvvisazione.",
  "Il tuo mondo è vivo. Non lo sai, ma i PNG lo sanno.",
  "Il dungeon è un personaggio. Non un semplice sfondo. Fallo interagire con i giocatori.",
  "Ricorda: anche il tavolo è un PNG.",
  "Alterna delle sessioni dedicate alla narrazione pura, senza combattimenti.",
];

function SuggerimentoDelGiorno() {
  const [frase, setFrase] = useState('');

  useEffect(() => {
    const index = Math.floor(Math.random() * suggerimenti.length);
    setFrase(suggerimenti[index]);
  }, []);

  return (
    <div className="suggerimento-giorno">
      <em>{frase}</em>
    </div>
  );
}

export default SuggerimentoDelGiorno;
