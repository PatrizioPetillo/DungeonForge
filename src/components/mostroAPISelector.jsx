import React, { useEffect, useState } from 'react';
import '../styles/mostroAPISelector.css';

function MostroAPISelector({ onAdd, onClose }) {
  const [listaMostri, setListaMostri] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [dettaglio, setDettaglio] = useState(null);

  useEffect(() => {
    fetch('https://www.dnd5eapi.co/api/monsters')
      .then(res => res.json())
      .then(data => setListaMostri(data.results));
  }, []);

  const caricaDettaglioMostro = (url) => {
    fetch(`https://www.dnd5eapi.co${url}`)
      .then(res => res.json())
      .then(data => setDettaglio(data));
  };

  const aggiungiMostro = () => {
    if (dettaglio) {
      onAdd({
        index: dettaglio.index,
        nome: dettaglio.name,
        tipo: dettaglio.type,
        gs: dettaglio.challenge_rating,
        ca: dettaglio.armor_class,
        pf: dettaglio.hit_points,
        attacchi: dettaglio.actions?.map(a => `${a.name}: ${a.desc}`) || [],
        descrizione: dettaglio.size + ' ' + dettaglio.type,
        fonte: 'api',
      });
      onClose();
    }
  };

  const filtrati = listaMostri.filter(m =>
    m.name.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="api-mostro-selector">
      <h4>📚 Seleziona un mostro</h4>
      <input
        placeholder="Cerca per nome..."
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <div className="mostro-elenco">
        {filtrati.slice(0, 20).map((m) => (
          <div key={m.index} onClick={() => caricaDettaglioMostro(m.url)}>
            {m.name}
          </div>
        ))}
      </div>

      {dettaglio && (
        <div className="mostro-dettaglio">
          <h5>{dettaglio.name}</h5>
          <p><strong>Tipo:</strong> {dettaglio.size} {dettaglio.type}</p>
          <p><strong>GS:</strong> {dettaglio.challenge_rating}</p>
          <p><strong>CA:</strong> {dettaglio.armor_class}</p>
          <p><strong>PF:</strong> {dettaglio.hit_points}</p>
          {dettaglio.actions?.length > 0 && (
            <ul>
              {dettaglio.actions.map((a, i) => (
                <li key={i}><strong>{a.name}</strong>: {a.desc}</li>
              ))}
            </ul>
          )}
          <button onClick={aggiungiMostro}>➕ Aggiungi alla Campagna</button>
        </div>
      )}

      <button onClick={onClose}>Chiudi</button>
    </div>
  );
}

export default MostroAPISelector;
