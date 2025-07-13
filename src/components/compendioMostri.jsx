import React, { useEffect, useState } from "react";
import "../../styles/compendioMostri.css";

const CompendioMostri = ({ onClose, onSelezionaMostro }) => {
  const [listaMostri, setListaMostri] = useState([]);
  const [filtrati, setFiltrati] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/monsters")
      .then((res) => res.json())
      .then((data) => {
        const ordinati = data.results.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setListaMostri(ordinati);
        setFiltrati(ordinati);
      });
  }, []);

  useEffect(() => {
    setFiltrati(
      listaMostri.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, listaMostri]);

  const selezionaMostro = async (index) => {
    const res = await fetch(`https://www.dnd5eapi.co/api/monsters/${index}`);
    const data = await res.json();
    onSelezionaMostro(data);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modale-compendio">
        <div className="modale-header">
          <h3>📚 Compendio Mostri</h3>
          <button onClick={onClose}>✖️</button>
        </div>
        <input
          type="text"
          placeholder="Cerca mostro..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="lista-mostri">
          {filtrati.map((m) => (
            <li key={m.index} onClick={() => selezionaMostro(m.index)}>
              {m.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompendioMostri;
