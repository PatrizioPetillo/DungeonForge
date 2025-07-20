import React, { useState } from "react";
import { getBonusAttacco } from "../../utils/getBonusAttacco";
import { roll } from "../../utils/rolls";

const AttaccoRapido = ({ entita, bersagli = [], onLog }) => {
  const armi = entita.armi || []; // array di oggetti arma
  const [arma, setArma] = useState(armi[0] || null);
  const [bersaglio, setBersaglio] = useState(bersagli[0] || null);
  const [ultimoTiro, setUltimoTiro] = useState(null);
  const [numAttacchi, setNumAttacchi] = useState(1);
  const [spellList, setSpellList] = useState([]);
  const [incantesimo, setIncantesimo] = useState(null);
  const [isMagico, setIsMagico] = useState(false);
  const [entitaSelezionata, setEntitaSelezionata] = useState(null);

  const classeMagica = entita.magia ? entita.classe?.toLowerCase() : null;

  const statPerClasse = {
    mago: "intelligenza",
    stregone: "carisma",
    warlock: "carisma",
    chierico: "saggezza",
    druido: "saggezza",
    bardo: "carisma",
    paladino: "carisma",
    ranger: "saggezza",
    artefice: "intelligenza",
  };
  const classeKey = entita.classe?.toLowerCase();
  const statMagica = statPerClasse[classeKey] || "intelligenza";

  if (!arma) return <div>Nessuna arma disponibile</div>;

  const eseguiAttaccoCompleto = () => {
    const risultati = [];

    for (let i = 0; i < numAttacchi; i++) {
      const dado = Math.floor(Math.random() * 20) + 1;
      const { bonusAttacco, dannoFormula, tiroDanno, spiegazione } =
        getBonusAttacco(entita, arma, 0, true);
      const totale = dado + bonusAttacco;
      const caBersaglio = bersaglio?.CA || 10;
      const colpito = totale >= caBersaglio;
      risultati.push(
        `🔁 Attacco ${
          i + 1
        }:\n🎯 ${dado} + ${bonusAttacco} = ${totale} vs CA ${caBersaglio} → ${
          colpito ? "✅ Colpito" : "❌ Mancato"
        }\n💥 Danno: ${dannoFormula} → ${tiroDanno.dettagli}`
      );
    }

    const log =
      `${entita.nome} esegue ${numAttacchi} attacco/i con ${arma.nome} contro ${bersaglio?.nome}:\n` +
      risultati.join("\n\n");

    setUltimoLog(log);
    onLog?.({ tipo: "attacco", descrizione: log });
  };

  useEffect(() => {
    if (isMagico && entita.magia && entita.classe) {
      const classeApi = entita.classe.toLowerCase().replace(/\s+/g, "-");
      fetch(`https://www.dnd5eapi.co/api/classes/${classeApi}/spells`)
        .then((res) => res.json())
        .then((data) => setSpellList(data.results))
        .catch(() => setSpellList([]));
    }
  }, [isMagico, entita]);

  const livelloIncantesimo = 1; // oppure permetti selezione futura
  if (entita.slots?.[livelloIncantesimo] > 0) {
    entita.slots[livelloIncantesimo] -= 1;
    onUpdate?.(entita); // notifica aggiornamento se usi stato globale
  } else {
    alert("❌ Nessuno slot di livello 1 disponibile!");
    return;
  }

  const lanciaIncantesimo = () => {
    if (!incantesimo) return;

    const statMagica = "intelligenza"; // migliora in futuro con classe→stat
    const modStat = Math.floor(((entita.stats?.[statMagica] || 10) - 10) / 2);
    const pb = entita.proficiencyBonus || 2;
    const CD = 8 + modStat + pb;
    const dannoFormula = incantesimo.damage?.damage_at_slot_level?.["1"];
    const tiroDanno = roll(dannoFormula);

    const bers = bersaglio?.nome || "un bersaglio";

    // Caso: incantesimo con tiro per colpire
    if (
      incantesimo.attack_type === "ranged" ||
      incantesimo.attack_type === "melee"
    ) {
      const d20 = Math.floor(Math.random() * 20) + 1;
      const bonus = modStat + pb;
      const totale = d20 + bonus;
      const CA = bersaglio?.CA || 10;
      const colpito = totale >= CA;

      const danno = incantesimo.damage?.damage_at_slot_level?.["1"];
      const log = `${entita.nome} lancia ${incantesimo.name} su ${bers}:
🎯 Tiro per colpire: ${d20} + ${bonus} = ${totale} vs CA ${CA} → ${
        colpito ? "✅ Colpito" : "❌ Mancato"
      }
💥 Danno: ${danno || "?"}
📘 Effetto: ${incantesimo.desc?.[0] || "–"}`;

      setUltimoLog(log);
      onLog?.({ tipo: "incantesimo", descrizione: log });
      return;
    }

    // Caso: incantesimo con tiro salvezza nemico
    if (incantesimo.saving_throw_type) {
      const tipoTS = incantesimo.saving_throw_type;
      const log = `${entita.nome} lancia ${incantesimo.name} su ${bers}:
🧠 Bersaglio deve superare un TS su ${tipoTS} (CD ${CD})
📘 Effetto: ${incantesimo.desc?.[0] || "–"}`;

      setUltimoLog(log);
      onLog?.({ tipo: "incantesimo", descrizione: log });
      return;
    }

    // Caso: incantesimo a colpo automatico (es. Magic Missile)
    const log = `${entita.nome} lancia ${incantesimo.name} su ${bers}:
🎯 Colpo automatico
📘 Effetto: ${incantesimo.desc?.[0] || "–"}`;

    setUltimoLog(log);
    onLog?.({ tipo: "incantesimo", descrizione: log });
  };

  const tiraDanno = () => {
    const { dannoFormula, tiroDanno } = getBonusAttacco(entita, arma, 0, true);
    const log = `${entita.nome} infligge danno con ${arma.nome}: ${dannoFormula} → ${tiroDanno.dettagli}`;
    setUltimoTiro({ tipo: "danno", log });
    onLog?.({ tipo: "danno", descrizione: log });
  };

  return (
    <div className="widget" style={{ marginTop: "1rem" }}>
      <select
        onChange={(e) => {
          const id = e.target.value;
          const entita = [...png, ...villain, ...mostri].find(
            (e) => e.id === id
          );
          setEntitaSelezionata(entita);
        }}
      >
        <option value="">— Seleziona un'entità —</option>
        {[...png, ...villain, ...mostri].map((e) => (
          <option key={e.id} value={e.id}>
            {e.nome}
          </option>
        ))}
      </select>

      <h4>⚔️ Attacco Rapido</h4>
      <label>Arma:</label>
      <select
        value={arma?.nome}
        onChange={(e) => setArma(armi.find((a) => a.nome === e.target.value))}
      >
        {armi.map((a, idx) => (
          <option key={idx} value={a.nome}>
            {a.nome}
          </option>
        ))}
      </select>

      <label>Numero di attacchi:</label>
      <input
        type="number"
        min={1}
        max={10}
        value={numAttacchi}
        onChange={(e) => setNumAttacchi(Number(e.target.value))}
      />

      <hr style={{ margin: "0.5rem 0" }} />
      <label>
        <input
          type="checkbox"
          checked={isMagico}
          onChange={(e) => setIsMagico(e.target.checked)}
        />
        {isMagico && entita.magia && (
          <div
            style={{ fontStyle: "italic", fontSize: "0.9em" }}
            title={`Stat magica: ${statMagica.toUpperCase()} (mod ${modStat})`}
          >
            🧠 Stat magica: <strong>{statMagica.toUpperCase()}</strong> → Bonus:{" "}
            <strong>{modStat}</strong>, CD incantesimo: <strong>{CD}</strong>
          </div>
        )}
        {entita.slots && (
          <div style={{ marginTop: "1rem" }}>
            <strong>🔢 Slot incantesimo:</strong>
            <ul>
              {Object.entries(entita.slots).map(([liv, qty]) => (
                <li key={liv}>
                  Livello {liv}: {qty} slot
                </li>
              ))}
            </ul>
          </div>
        )}
        Attacco magico
      </label>
      {!entita.magia && (
        <p style={{ color: "gray", fontStyle: "italic" }}>
          Questo personaggio non è un incantatore.
        </p>
      )}

      {isMagico && (
        <>
          <label>Incantesimo:</label>
          <select
            onChange={(e) => {
              const spellUrl = e.target.value;
              fetch(`https://www.dnd5eapi.co${spellUrl}`)
                .then((res) => res.json())
                .then((data) => setIncantesimo(data));
            }}
          >
            <option value="">– Seleziona –</option>
            {spellList.map((s, idx) => (
              <option key={idx} value={s.url}>
                {s.name}
              </option>
            ))}
          </select>
        </>
      )}
      <hr style={{ margin: "0.5rem 0" }} />

      <label>Bersaglio:</label>
      <select
        value={bersaglio?.nome}
        onChange={(e) =>
          setBersaglio(bersaglio.find((b) => b.nome === e.target.value))
        }
      >
        {bersagli.map((b, idx) => (
          <option key={idx} value={b.nome}>
            {b.nome} (CA {b.CA || "?"})
          </option>
        ))}
      </select>

      <button onClick={eseguiAttaccoCompleto} style={{ marginTop: "0.5rem" }}>
        🎯 Attacca e Calcola Danno
      </button>

      {isMagico && incantesimo && (
        <button onClick={lanciaIncantesimo}>✨ Lancia Incantesimo</button>
      )}
      {ultimoTiro && (
        <p style={{ fontStyle: "italic", marginTop: "0.5rem" }}>
          {ultimoTiro.log}
        </p>
      )}
      {ultimoLog && (
        <p
          style={{
            fontSize: "0.85em",
            fontStyle: "italic",
            marginTop: "0.5rem",
            whiteSpace: "pre-line",
          }}
        >
          {ultimoLog}
        </p>
      )}
    </div>
  );
};

export default AttaccoRapido;
