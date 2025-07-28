import React, { useState, useEffect, useContext } from "react";
import { aggiungiNotaDiario, recuperaNoteDiario, eliminaNotaDiario } from "../firebase/firestoreDiario";
import { DMContext } from "../context/DMContext";
import { useDM } from "../context/DMContext";
import "../styles/diarioNarratore.css";

const DiarioNarratore = () => {
  const { dm, dmId, loading } = useDM();
  const [note, setNote] = useState([]);
  const [testo, setTesto] = useState("");
  const [mostraNote, setMostraNote] = useState(true); // 🔄 toggle visibilità

  useEffect(() => {
    if (dmId) {
      recuperaNoteDiario(dmId).then(setNote);
    }
  }, [dmId]);

  const handleAggiungiNota = async () => {
    if (!testo.trim()) return;
    const docRef = await aggiungiNotaDiario(dmId, testo);
    const nuovaNota = {
      id: docRef.id,
      contenuto: testo,
      timestamp: new Date().toISOString()
    };
    setNote([nuovaNota, ...note]);
    setTesto("");
    setMostraNote(true); // mostra le note appena aggiunta
  };

  const handleEliminaNota = async (id) => {
    await eliminaNotaDiario(dmId, id);
    setNote(note.filter(n => n.id !== id));
  };

  return (
    <section className="dashboard-section diario-narratore">
      <h2>📓 Diario del Narratore</h2>
      <p className="section-desc">Appunti sparsi, idee, bozze di trame o colpi di scena.</p>

      <div className="form-nuova-nota">
        <textarea
          value={testo}
          onChange={(e) => setTesto(e.target.value)}
          placeholder="Scrivi una nuova nota..."
        />
        <button onClick={handleAggiungiNota}>Aggiungi nota</button>
      </div>

      {note.length > 0 && (
        <button className="toggle-notes-btn" onClick={() => setMostraNote(!mostraNote)}>
          {mostraNote ? "📂 Nascondi Note" : "📂 Mostra Note"}
        </button>
      )}

      {mostraNote && (
        <ul className="lista-note">
          {note.map((n) => (
            <li key={n.id}>
              <span>{n.contenuto}</span>
              <button className="elimina-btn" onClick={() => handleEliminaNota(n.id)}>🗑️</button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default DiarioNarratore;
