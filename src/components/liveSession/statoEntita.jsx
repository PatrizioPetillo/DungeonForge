import React, { useEffect, useState } from "react";

const StatoEntita = ({ entita, onUpdate, onLog }) => {
  const [pf, setPf] = useState(entita.PF || 0);
  const [ca, setCa] = useState(entita.CA || 10);
  const [condizione, setCondizione] = useState(entita.condizione || "");
  const [condizioniDisponibili, setCondizioniDisponibili] = useState([]);
  const [tooltipCondizione, setTooltipCondizione] = useState("");

  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/conditions")
      .then((res) => res.json())
      .then((data) => setCondizioniDisponibili(data.results.map((c) => c.name)))
      .catch(() => setCondizioniDisponibili([]));
  }, []);

  useEffect(() => {
    if (condizione) {
      const index = condizione.toLowerCase().replace(/\s/g, "-");
      fetch(`https://www.dnd5eapi.co/api/conditions/${index}`)
        .then((res) => res.json())
        .then((data) => {
          setTooltipCondizione(data.desc?.join(" ") || "");
        })
        .catch(() => setTooltipCondizione(""));
    }
  }, [condizione]);

  const aggiorna = () => {
    const aggiornato = { ...entita, PF: pf, CA: ca, condizione };
    onUpdate?.(aggiornato);
    onLog?.(`Aggiornato ${entita.nome}: PF=${pf}, CA=${ca}, Condizione=${condizione || "Nessuna"}`);
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <p><strong>{entita.nome}</strong></p>
      <div>
        PF: <input type="number" value={pf} onChange={(e) => setPf(Number(e.target.value))} />
        CA: <input type="number" value={ca} onChange={(e) => setCa(Number(e.target.value))} />
      </div>
      <div>
        Condizione:
        <select value={condizione} onChange={(e) => setCondizione(e.target.value)}>
          <option value="">Nessuna</option>
          {condizioniDisponibili.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      {condizione && (
        <p style={{ fontSize: "0.8em" }}>{tooltipCondizione || "Descrizione..."}</p>
      )}
      <button onClick={aggiorna}>💾 Aggiorna</button>
    </div>
  );
};

export default StatoEntita;
