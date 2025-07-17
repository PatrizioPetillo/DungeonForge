import React, { useState, useEffect } from "react";

const ModaleOggetti = ({ onClose, onAggiungi }) => {
  const [oggetti, setOggetti] = useState([]);
  const [dettagliOggetto, setDettagliOggetto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [termineRicerca, setTermineRicerca] = useState("");

  // Cache globale per API
  let cacheOggetti = [];

  useEffect(() => {
    const fetchOggetti = async () => {
      setLoading(true);
      if (cacheOggetti.length === 0) {
        const res = await fetch("https://www.dnd5eapi.co/api/magic-items");
        const data = await res.json();
        cacheOggetti = data.results;
      }
      setOggetti(cacheOggetti);
      setLoading(false);
    };
    fetchOggetti();
  }, []);

  const mostraDettagli = async (url) => {
    const res = await fetch(`https://www.dnd5eapi.co${url}`);
    const data = await res.json();
    setDettagliOggetto(data);
  };

  const oggettiFiltrati = termineRicerca
    ? oggetti.filter((o) =>
        o.name.toLowerCase().includes(termineRicerca.toLowerCase())
      )
    : oggetti;

  return (
    <div className="modale">
      <div className="modale-contenuto">
        <h2>📚 Oggetti Magici</h2>
        <button onClick={onClose}>❌ Chiudi</button>
        <input
          type="text"
          placeholder="Cerca oggetto..."
          value={termineRicerca}
          onChange={(e) => setTermineRicerca(e.target.value)}
          style={{ margin: "0.5rem 0" }}
        />

        {loading && <p>Caricamento oggetti...</p>}

        {!loading && (
          <div className="lista-oggetti">
            {oggettiFiltrati.slice(0, 30).map((o, idx) => (
              <div key={idx} className="oggetto-card">
                <p>{o.name}</p>
                <button onClick={() => mostraDettagli(o.url)}>Dettagli</button>
              </div>
            ))}
          </div>
        )}

        {dettagliOggetto && (
          <div className="dettagli-oggetto">
            <h3>{dettagliOggetto.name}</h3>
            <p><strong>Rarità:</strong> {dettagliOggetto.rarity?.name || "—"}</p>
            <p><strong>Tipo:</strong> {dettagliOggetto.equipment_category?.name}</p>
            <p>{dettagliOggetto.desc?.join(" ")}</p>
            <button onClick={() => onAggiungi(dettagliOggetto)}>➕ Aggiungi alla Campagna</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModaleOggetti;
