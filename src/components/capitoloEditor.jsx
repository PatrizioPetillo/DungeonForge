import React from 'react';
import '../styles/capitoloEditor.css';

function CapitoloEditor({ capitolo, onUpdate, onRemove }) {
  const aggiornaCampo = (campo, valore) => {
    onUpdate({ ...capitolo, [campo]: valore });
  };

  const aggiornaScene = (index, nuovaScene) => {
    const mostriNellaScena = mostri?.filter(m => m.scenaAssociata === scena.id) || [];
    const nuoveScene = [...capitolo.scene];
    nuoveScene[index] = nuovaScene;
    aggiornaCampo('scene', nuoveScene);
  };

  const aggiungiScena = () => {
    const nuovaScene = { titolo: '', testo: '', png: [], villain: [], mostri: [], prove: [] };
    aggiornaCampo('scene', [...(capitolo.scene || []), nuovaScene]);
  };

  const rimuoviScena = (index) => {
    const nuoveScene = [...capitolo.scene];
    nuoveScene.splice(index, 1);
    aggiornaCampo('scene', nuoveScene);
  };

  return (
    <div className="capitolo-editor">
      <div className="capitolo-intestazione">
        <input
          placeholder="Titolo Capitolo"
          value={capitolo.titolo}
          onChange={(e) => aggiornaCampo('titolo', e.target.value)}
        />
        <textarea
          placeholder="Descrizione generale del capitolo..."
          value={capitolo.descrizione}
          onChange={(e) => aggiornaCampo('descrizione', e.target.value)}
        />
        <button onClick={onRemove}>🗑️ Elimina Capitolo</button>
      </div>

      <div className="scene-list">
        <h4>Scene</h4>
        {capitolo.scene?.map((scene, index) => (
          <div key={index} className="scene-box">
            <input
              placeholder="Titolo scena"
              value={scene.titolo}
              onChange={(e) => aggiornaScene(index, { ...scene, titolo: e.target.value })}
            />
            <textarea
              placeholder="Testo narrativo della scena..."
              value={scene.testo}
              onChange={(e) => aggiornaScene(index, { ...scene, testo: e.target.value })}
            />
            <hr />
            {mostriNellaScena.length > 0 && (
  <div className="scene-mostri">
    <h5>🧟‍♂️ Mostri in questa scena:</h5>
    <ul>
      {mostriNellaScena.map((m, i) => (
        <li key={i}>
          <strong>{m.nome}</strong> (GS {m.gs}, CA {m.ca}, PF {m.pf})
        </li>
      ))}
    </ul>
  </div>
)}
            
            <button onClick={() => rimuoviScena(index)}>❌ Rimuovi Scena</button>
          </div>
        ))}
        <button onClick={aggiungiScena}>➕ Aggiungi Scena</button>
      </div>
    </div>
  );
}

export default CapitoloEditor;
