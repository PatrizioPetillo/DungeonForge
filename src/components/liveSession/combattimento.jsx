import React, { useState } from "react";
import StatoEntita from "./statoEntita";


const Combattimento = ({ png, villain, mostri, onUpdate }) => {
  const [partecipanti, setPartecipanti] = useState([]);
  const [ordine, setOrdine] = useState([]);
  const [turnoAttuale, setTurnoAttuale] = useState(0);

  const togglePartecipante = (entita) => {
    setPartecipanti((prev) =>
      prev.includes(entita)
        ? prev.filter(p => p !== entita)
        : [...prev, entita]
    );
  };

  const aggiornaPartecipante = (idx, nuovoStato) => {
  setOrdine((prev) => {
    const nuovo = [...prev];
    nuovo[idx] = nuovoStato;
    return nuovo;
  });
};

  const tiraIniziativa = () => {
    const ordineIniziale = partecipanti.map(p => {
      const modDes = Math.floor(((p.stats?.des || 10) - 10) / 2);
      const dado = Math.floor(Math.random() * 20) + 1;
      return {
        ...p,
        iniziativa: dado + modDes,
        modDes,
        dado
      };
    }).sort((a, b) => b.iniziativa - a.iniziativa);

    setOrdine(ordineIniziale);
    setTurnoAttuale(0);
    if (onUpdate) onUpdate(ordineIniziale);
  };

  const nextTurno = () => {
    setTurnoAttuale((prev) => (prev + 1) % ordine.length);
  };

  return (
    <div className="widget">
      <h3>⚔️ Combattimento</h3>

      <h4>Seleziona i partecipanti:</h4>
      <ul>
        {[...png, ...villain, ...mostri].map((p, idx) => (
          <li key={idx}>
            <label>
              <input
                type="checkbox"
                checked={partecipanti.includes(p)}
                onChange={() => togglePartecipante(p)}
              />
              {p.nome} ({p.stats?.des ? `DES ${p.stats.des}` : '–'})
            </label>
          </li>
        ))}
      </ul>

      <button onClick={tiraIniziativa} disabled={partecipanti.length === 0}>🎲 Tira iniziativa</button>

      {ordine.length > 0 && (
        <>
          <h4>🌀 Ordine di Iniziativa:</h4>
          <ol>
            {ordine.map((p, idx) => (
  <li key={idx} style={{ fontWeight: idx === turnoAttuale ? 'bold' : 'normal' }}>
    {idx === turnoAttuale ? "👉 " : ""}
    {p.nome} – Iniziativa: {p.iniziativa}
    <StatoEntita entita={p} onUpdate={(aggiornato) => aggiornaPartecipante(idx, aggiornato)} />
    <AttaccoRapido
  entita={p}
  bersagli={[...png, ...villain, ...mostri].filter(e => e.nome !== p.nome)}
  onLog={onLog}
/>

  </li>
))}

          </ol>

          <button onClick={nextTurno}>➡️ Prossimo turno</button>
        </>
      )}
    </div>
  );
};

export default Combattimento;
