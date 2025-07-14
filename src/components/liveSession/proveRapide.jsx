import React, { useState, useEffect } from "react";
import { getBonusProva } from "../../utils/helpers";
import { getBonusAttacco } from "../../utils/getBonusAttacco";

const ProveRapide = ({ scena, png, onLog }) => {
  const [abilita, setAbilita] = useState("Percezione");
  const [cd, setCd] = useState(10);
  const [attore, setAttore] = useState("");
  const [risultato, setRisultato] = useState(null);
  const [modalita, setModalita] = useState("normale");
  const [tipoProva, setTipoProva] = useState("abilita"); // o "caratteristica"
const [caratteristica, setCaratteristica] = useState("Forza");

const entitaSelezionata = png.find(p => p.nome === attore);
const { valore: bonus, spiegazione } = getBonusProva(entitaSelezionata, tipoProva, abilita, bonusExtra);
const { bonusAttacco, dannoFormula, tiroDanno } =
  getBonusAttacco(mostro, armaSelezionata, 0, true);

  const caratteristicheBase = [
  "Forza", "Destrezza", "Costituzione",
  "Intelligenza", "Saggezza", "Carisma"
];

const abilitaDisponibili = [
  "Atletica", "Furtività", "Rapidità di Mano",
  "Arcano", "Indagare", "Storia", "Religione",
  "Sopravvivenza", "Percezione", "Intuizione",
  "Persuasione", "Raggirare", "Intimidire"
];


  useEffect(() => {
    if (scena?.proveConsigliate?.length) {
      const provaDefault = scena.proveConsigliate[0];
      setAbilita(provaDefault.abilita);
      setCd(provaDefault.cd);
    }
  }, [scena]);

  const lanciaProva = () => {
  const dado1 = Math.floor(Math.random() * 20) + 1;
  const dado2 = Math.floor(Math.random() * 20) + 1;

  let tiro = dado1;
  let note = "";

  if (modalita === "vantaggio") {
    tiro = Math.max(dado1, dado2);
    note = `(${dado1}, ${dado2}) → vantaggio`;
  } else if (modalita === "svantaggio") {
    tiro = Math.min(dado1, dado2);
    note = `(${dado1}, ${dado2}) → svantaggio`;
  } else {
    note = `(${dado1})`;
  }

  const totale = tiro + bonus;
  const successo = totale >= cd;
  const nomeProva = tipoProva === "caratteristica" ? caratteristica : tipoProva === "salvezza" ? `TS ${caratteristica}` : abilita;

  const risultato = { tiro, bonus, totale, successo, nomeProva, attore, note };

  setRisultato(risultato);

  if (onLog) {
    onLog({
  tipo: "prova",
  descrizione: `${attore} tenta una Prova su ${nomeProva} ${modalita !== "normale" ? `(${modalita}) ` : ""}${note} → ${totale} → ${successo ? "✅ Successo" : "❌ Fallimento"}`
});
  }
};


  return (
    <div className="widget">
      <h3>🎯 Prove Rapide</h3>

      {scena?.proveConsigliate?.length > 0 && (
        <div style={{ marginBottom: '0.5rem' }}>
          <strong>Prove suggerite:</strong>
          <ul>
            {scena.proveConsigliate.map((p, idx) => (
              <li key={idx}>{p.abilita} (CD {p.cd})</li>
            ))}
          </ul>
        </div>
      )}

      <label>Chi tenta la prova:</label>
      <select value={attore} onChange={(e) => setAttore(e.target.value)}>
  <option value="">– Seleziona –</option>
  {png.map((p, idx) => (
    <option key={idx} value={p.nome}>
      {p.nome} {p.ruolo?.toLowerCase().includes("arcinemico") ? "(Villain)" : "(Mostro)"}
    </option>
  ))}
</select>

<hr style={{ margin: '1rem 0' }} />

      <label>CD:</label>
      <input type="number" value={cd} onChange={(e) => setCd(Number(e.target.value))} />

      <label>Bonus:</label>
      <input type="number" value={bonus} onChange={(e) => setBonus(Number(e.target.value))} />

      <hr style={{ margin: '1rem 0' }} />

      <label>Tipo di prova:</label>
<select value={tipoProva} onChange={(e) => setTipoProva(e.target.value)}>
  <option value="caratteristica">Caratteristica</option>
  <option value="abilita">Abilità</option>
    <option value="salvezza">Tiro Salvezza</option>
</select>

{tipoProva === "caratteristica" && (
  <label>
    Caratteristica:
    <select value={caratteristica} onChange={(e) => setCaratteristica(e.target.value)}>
      {caratteristicheBase.map((c, idx) => (
        <option key={idx} value={c}>{c}</option>
      ))}
    </select>
  </label>
)}

{tipoProva === "abilita" && (
  <label>
    Abilità:
    <select value={abilita} onChange={(e) => setAbilita(e.target.value)}>
      {abilitaDisponibili.map((a, idx) => (
        <option key={idx} value={a}>{a}</option>
      ))}
    </select>
  </label>
)}

<label>Tipo di tiro:</label>
<select value={modalita} onChange={(e) => setModalita(e.target.value)}>
  <option value="normale">Normale</option>
  <option value="vantaggio">Con vantaggio</option>
  <option value="svantaggio">Con svantaggio</option>
</select>

{tipoProva === "salvezza" && (
  <label>
    Tiro Salvezza su:
    <select value={caratteristica} onChange={(e) => setCaratteristica(e.target.value)}>
      {caratteristicheBase.map((c, idx) => (
        <option key={idx} value={c}>{c}</option>
      ))}
    </select>
  </label>
)}
      <button onClick={lanciaProva}>Tira il d20</button>

      {risultato && (
        <div style={{ marginTop: '1rem' }}>
         <p title={spiegazione}>
  <strong>Tiro:</strong> {risultato.tiro} + {bonus} = {risultato.totale}
</p>
          <p style={{ color: risultato.successo ? "green" : "red" }}>
            {risultato.successo ? "✅ Successo!" : "❌ Fallimento!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProveRapide;