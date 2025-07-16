import React, { useState } from "react";
import { logEvento } from "../../utils/logUtils";
import { getBonusProva } from "../../utils/helpers";

const ProveRapide = ({ scena, png }) => {
  const [entitaSelezionata, setEntitaSelezionata] = useState(null);
  const [tipoProva, setTipoProva] = useState("abilita");
  const [abilita, setAbilita] = useState("");
  const [cd, setCd] = useState("");
  const [enigmaSelezionato, setEnigmaSelezionato] = useState(null);

  const enigmiInScena = scena?.enigmi || [];
  const bonusExtra = 0; // Corretto

  const handleSelectEnigma = (id) => {
    const e = enigmiInScena.find((en) => en.id === id);
    if (e) {
      setEnigmaSelezionato(e);
      setTipoProva("abilita");
      setAbilita(e.prova || "");
      setCd(e.cd || "");
    } else {
      setEnigmaSelezionato(null);
      setAbilita("");
      setCd("");
    }
  };

  const eseguiProva = () => {
    if (!entitaSelezionata || !abilita || !cd) {
      alert("Seleziona un'entità, abilità e CD!");
      return;
    }

    const { valore: bonus, spiegazione } = getBonusProva(
      entitaSelezionata,
      tipoProva,
      abilita,
      bonusExtra
    );

    const tiro = Math.floor(Math.random() * 20) + 1;
    const totale = tiro + bonus;
    const esito = totale >= cd ? "✅ SUCCESSO" : "❌ FALLIMENTO";
    let descrizione = `🎲 Prova: ${abilita} (${entitaSelezionata.nome}) → ${totale} (${tiro}+${bonus}) contro CD ${cd} → ${esito}`;

    if (enigmaSelezionato) {
      descrizione += ` [Enigma: ${enigmaSelezionato.titolo}]`;
      if (esito.includes("FALLIMENTO") && enigmaSelezionato.effettoFallimento) {
        descrizione += ` ⚠ Effetto: ${enigmaSelezionato.effettoFallimento}`;
      }
    }

    logEvento(descrizione);

    // Reset rapido
    setEnigmaSelezionato(null);
    setAbilita("");
    setCd("");
  };

  return (
    <div className="widget widget-prove">
      <h3>🎲 Prove Rapide</h3>

      {/* Selettore PNG */}
      <div className="field-group">
        <label>Entità:</label>
        <select onChange={(e) => {
          const entita = png.find((p) => p.id === e.target.value);
          setEntitaSelezionata(entita);
        }}>
          <option value="">— Seleziona —</option>
          {png.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
      </div>

      {/* Dropdown enigmi */}
      {enigmiInScena.length > 0 && (
        <div className="field-group">
          <label>🧩 Enigma attivo:</label>
          <select onChange={(e) => handleSelectEnigma(e.target.value)}>
            <option value="">— Nessuno —</option>
            {enigmiInScena.map((en) => (
              <option key={en.id} value={en.id}>
                {en.titolo} (Prova: {en.prova}, CD {en.cd})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Campo abilità e CD (solo se non selezionato enigma) */}
      {!enigmaSelezionato && (
        <>
          <div className="field-group">
            <label>Abilità:</label>
            <input
              type="text"
              value={abilita}
              onChange={(e) => setAbilita(e.target.value)}
              placeholder="Es: Atletica"
            />
          </div>
          <div className="field-group">
            <label>CD:</label>
            <input
              type="number"
              value={cd}
              onChange={(e) => setCd(e.target.value)}
            />
          </div>
        </>
      )}

      <button onClick={eseguiProva} className="btn-primary">
        🎲 Lancia Prova
      </button>
    </div>
  );
};

export default ProveRapide;
