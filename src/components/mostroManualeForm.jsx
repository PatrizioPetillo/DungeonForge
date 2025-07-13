import React, { useState } from 'react';

function MostroManualeForm({ onSave, onCancel }) {
  const [mostro, setMostro] = useState({
    nome: '',
    tipo: '',
    gs: '',
    pf: '',
    ca: '',
    descrizione: '',
    attacchi: [''],
    fonte: 'manuale'
  });

  const aggiornaCampo = (campo, valore) => {
    setMostro({ ...mostro, [campo]: valore });
  };

  const aggiornaAttacco = (index, valore) => {
    const nuovi = [...mostro.attacchi];
    nuovi[index] = valore;
    setMostro({ ...mostro, attacchi: nuovi });
  };

  const aggiungiAttacco = () => {
    setMostro({ ...mostro, attacchi: [...mostro.attacchi, ''] });
  };

  return (
    <div className="manuale-mostro-form">
      <h4>✍️ Crea Mostro Manualmente</h4>

      <input placeholder="Nome" value={mostro.nome} onChange={(e) => aggiornaCampo('nome', e.target.value)} />
      <input placeholder="Tipo" value={mostro.tipo} onChange={(e) => aggiornaCampo('tipo', e.target.value)} />
      <input placeholder="Grado di Sfida (GS)" value={mostro.gs} onChange={(e) => aggiornaCampo('gs', e.target.value)} />
      <input placeholder="Punti Ferita (PF)" value={mostro.pf} onChange={(e) => aggiornaCampo('pf', e.target.value)} />
      <input placeholder="Classe Armatura (CA)" value={mostro.ca} onChange={(e) => aggiornaCampo('ca', e.target.value)} />
      <textarea placeholder="Descrizione" value={mostro.descrizione} onChange={(e) => aggiornaCampo('descrizione', e.target.value)} />

      <h5>Attacchi</h5>
      {mostro.attacchi.map((a, i) => (
        <input key={i} placeholder={`Attacco ${i + 1}`} value={a} onChange={(e) => aggiornaAttacco(i, e.target.value)} />
      ))}
      <button onClick={aggiungiAttacco}>➕ Aggiungi Attacco</button>

      <div className="form-actions">
        <button onClick={() => onSave(mostro)}>✅ Salva</button>
        <button onClick={onCancel}>Annulla</button>
      </div>
    </div>
  );
}

export default MostroManualeForm;
