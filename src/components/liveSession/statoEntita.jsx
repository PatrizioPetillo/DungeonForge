import React, { useEffect, useState } from "react";

const StatoEntita = ({ entita, onUpdate }) => {
  const [pf, setPf] = useState(entita.PF || 0);
  const [ca, setCa] = useState(entita.CA || 10);
  const [condizioniDisponibili, setCondizioniDisponibili] = useState([]);
  const [condizione, setCondizione] = useState("");
  const [tooltipCondizione, setTooltipCondizione] = useState("");

  const iconeCondizioni = {
    Blinded: "🙈",
    Charmed: "💘",
    Deafened: "🔇",
    Frightened: "😱",
    Grappled: "🤼",
    Incapacitated: "😵",
    Invisible: "👻",
    Paralyzed: "🧊",
    Petrified: "🪨",
    Poisoned: "☠️",
    Prone: "🛌",
    Restrained: "⛓️",
    Stunned: "💫",
    Unconscious: "🛏️",
  };

  const colorePF = () => {
    if (pf <= (entita.maxPF || 100) * 0.25) return "red";
    if (pf <= (entita.maxPF || 100) * 0.5) return "orange";
    return "green";
  };

  // Fetch condizioni da API ufficiali
  useEffect(() => {
    if (condizione) {
      const index = condizione.toLowerCase().replace(/\s/g, "-");
      fetch(`https://www.dnd5eapi.co/api/conditions/${index}`)
        .then((res) => res.json())
        .then((data) => {
          const descrizione = data.desc?.join(" ") || "";
          setTooltipCondizione(descrizione);
        })
        .catch((err) => {
          setTooltipCondizione("");
        });
    }
  }, [condizione]);

  const aggiorna = () => {
    const aggiornato = { ...entita, PF: pf, CA: ca, condizione };
    if (onUpdate) onUpdate(aggiornato);
  };

  return (
    <div className="widget">
      <h4>{entita.nome}</h4>

      <label>Punti Ferita (PF):</label>
      <input
        type="number"
        value={pf}
        onChange={(e) => setPf(Number(e.target.value))}
        style={{ borderColor: colorePF(), color: colorePF() }}
      />

      <label>Classe Armatura (CA):</label>
      <input
        type="number"
        value={ca}
        onChange={(e) => setCa(Number(e.target.value))}
      />

      <label>Condizione:</label>
      <select
        value={condizione}
        onChange={(e) => setCondizione(e.target.value)}
      >
        <option value="">– Nessuna –</option>
        {condizioniDisponibili.map((c, idx) => (
          <option key={idx} value={c}>
            {iconeCondizioni[c] || "🌀"} {c}
          </option>
        ))}
      </select>

      {condizione && (
        <div
          style={{
            marginTop: "0.5rem",
            fontStyle: "italic",
            fontSize: "0.9em",
          }}
          title={tooltipCondizione}
        >
          {iconeCondizioni[condizione] || "🌀"} <strong>{condizione}</strong>:{" "}
          {tooltipCondizione || "Descrizione non disponibile"}
        </div>
      )}

      <button onClick={aggiorna}>💾 Aggiorna</button>
    </div>
  );
};

export default StatoEntita;
