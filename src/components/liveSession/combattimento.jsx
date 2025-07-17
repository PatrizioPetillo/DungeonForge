import React, { useState } from "react";
import StatoEntita from "./statoEntita";
import AttaccoRapido from "./attaccoRapido";
import "../../styles/combattimento.css";

const Combattimento = ({ png, villain, mostri, onLog }) => {
  const [partecipanti, setPartecipanti] = useState([]);
  const [ordine, setOrdine] = useState([]);
  const [turnoAttuale, setTurnoAttuale] = useState(0);

  const togglePartecipante = (entita) => {
    setPartecipanti((prev) =>
      prev.includes(entita)
        ? prev.filter((p) => p !== entita)
        : [...prev, entita]
    );
  };

  const tiraIniziativa = () => {
    const ordineIniziale = partecipanti
      .map((p) => {
        const modDes = Math.floor(((p.stats?.des || 10) - 10) / 2);
        const dado = Math.floor(Math.random() * 20) + 1;
        return { ...p, iniziativa: dado + modDes, modDes, dado };
      })
      .sort((a, b) => b.iniziativa - a.iniziativa);
    setOrdine(ordineIniziale);
    setTurnoAttuale(0);
    onLog?.("Ordine iniziativa calcolato");
  };

  const nextTurno = () => {
  if (ordine.length === 0) return;
  let next = (turnoAttuale + 1) % ordine.length;

  // Skip se condizione = "Stunned" o "Paralyzed"
  let skipCount = 0;
  while (
    ordine[next].condizione &&
    ["Stunned", "Paralyzed"].includes(ordine[next].condizione) &&
    skipCount < ordine.length
  ) {
    onLog(`⚠️ Turno saltato: ${ordine[next].nome} (${ordine[next].condizione})`);
    next = (next + 1) % ordine.length;
    skipCount++;
  }

  setTurnoAttuale(next);
  onLog(`👉 Ora tocca a ${ordine[next].nome}`);
};


  const resetCombattimento = () => {
    setPartecipanti([]);
    setOrdine([]);
    setTurnoAttuale(0);
    onLog?.("Combattimento resettato");
  };

  return (
    <div className="widget combattimento">
      <h3>⚔️ Combattimento</h3>
      <ul>
        {[...png, ...villain, ...mostri].map((p) => (
          <li key={p.id} className={idx === turnoAttuale ? "turno-attivo" : ""}>
            <input
              type="checkbox"
              checked={partecipanti.includes(p)}
              onChange={() => togglePartecipante(p)}
            />
            {p.nome}
          </li>
          
        ))}
        
      </ul>
      <button onClick={tiraIniziativa} disabled={partecipanti.length === 0}>🎲 Iniziativa</button>
      <button onClick={resetCombattimento}>🔄 Reset</button>

      {ordine.length > 0 && (
        <>
          <h4>Turno: {ordine[turnoAttuale].nome}</h4>
          <ol>
            {ordine.map((p, idx) => (
              <li key={p.id} style={{ fontWeight: idx === turnoAttuale ? "bold" : "normal" }}>
                {idx === turnoAttuale ? "👉" : ""} {p.nome} (Iniziativa {p.iniziativa})
                <StatoEntita entita={p} onUpdate={() => {}} onLog={onLog} />
                {idx === turnoAttuale && (
                  <AttaccoRapido
                    entita={p}
                    bersagli={ordine.filter((b) => b.id !== p.id)}
                    onLog={onLog}
                  />
                )}
              </li>
            ))}
          </ol>
          <button onClick={nextTurno}>➡️ Prossimo Turno</button>
        </>
      )}
    </div>
  );
};

export default Combattimento;
