// src/components/modaleMappa.jsx
import React, { useState, useEffect } from "react";
import { salvaInArchivio } from "../../utils/firestoreArchivio";
import Marker from 'react-image-marker';
import "../../styles/modaleMappe.css";

const ModaleMappa = ({ initialData = null, onSave, onClose, campagnaAttiva = null }) => {
  const [titolo, setTitolo] = useState(initialData?.titolo || "");
  const [descrizione, setDescrizione] = useState(initialData?.descrizione || "");
  const [immagine, setImmagine] = useState(initialData?.immagine || "");
  const [collegamento, setCollegamento] = useState({
    campagna: campagnaAttiva?.titolo || initialData?.collegamento?.campagna || "",
    atto: initialData?.collegamento?.atto || "",
    capitolo: initialData?.collegamento?.capitolo || "",
    luogo: initialData?.collegamento?.luogo || ""
  });
  const [pinNarrativi, setPinNarrativi] = useState(initialData?.pinNarrativi || []);
  const [pinSelezionatoIndex, setPinSelezionatoIndex] = useState(null);


  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setImmagine(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSalva = async () => {
    const nuovaMappa = {
      titolo,
      descrizione,
      immagine,
      collegamento,
      pinNarrativi
    };
    if (idCampagna) {
  await salvaInArchivio(`campagne/${idCampagna}/mappe`, nuovaMappa);
    } else {
    await salvaInArchivio("mappe", nuovaMappa);
    }
    onSave(nuovaMappa);
  };

  const aggiungiPin = ({ top, left }) => {
  const nuovoPin = {
    top,
    left,
    tipo: "Altro",
    riferimento: "",
    nota: ""
  };
  setPinNarrativi([...pinNarrativi, nuovoPin]);
};

const aggiornaCampoPin = (campo, valore) => {
  const aggiornati = [...pinNarrativi];
  aggiornati[pinSelezionatoIndex][campo] = valore;
  setPinNarrativi(aggiornati);
};

const rimuoviPin = (index) => {
  const aggiornati = [...pinNarrativi];
  aggiornati.splice(index, 1);
  setPinNarrativi(aggiornati);
  setPinSelezionatoIndex(null);
};

  return (
    <div className="modale-overlay">
      <div className="modale-grande">
        <h2>{initialData ? "Modifica Mappa" : "Crea una Nuova Mappa"}</h2>

        <label>Titolo</label>
        <input type="text" value={titolo} onChange={e => setTitolo(e.target.value)} />

        <label>Descrizione</label>
        <textarea rows="2" value={descrizione} onChange={e => setDescrizione(e.target.value)} />

        <div className="collegamenti">
          {!campagnaAttiva && (
            <>
              <label>Campagna collegata</label>
              <input
                type="text"
                value={collegamento.campagna}
                onChange={e => setCollegamento(prev => ({ ...prev, campagna: e.target.value }))}
              />
            </>
          )}
          <label>Atto</label>
          <input
            type="text"
            value={collegamento.atto}
            onChange={e => setCollegamento(prev => ({ ...prev, atto: e.target.value }))}
          />
          <label>Capitolo</label>
          <input
            type="text"
            value={collegamento.capitolo}
            onChange={e => setCollegamento(prev => ({ ...prev, capitolo: e.target.value }))}
          />
          <label>Luogo</label>
          <input
            type="text"
            value={collegamento.luogo}
            onChange={e => setCollegamento(prev => ({ ...prev, luogo: e.target.value }))}
          />
        </div>

        <label>Upload immagine (PNG/JPG)</label>
        <input type="file" accept="image/*" onChange={handleUpload} />

        {immagine && (
            <div className="mappa-pin-container">
                <Marker
                src={immagine}
                markers={pinNarrativi}
                onAddMarker={aggiungiPin}
                markerComponent={({ top, left }) => (
                    <div
                    className="pin"
                    style={{
                        position: "absolute",
                        top: `${top * 100}%`,
                        left: `${left * 100}%`,
                        transform: "translate(-50%, -100%)",
                        color: "gold",
                        fontWeight: "bold",
                        pointerEvents: "none"
                    }}
                    >
                    📍
                    </div>
                )}
                />
            </div>
            )}

        <label>Editor Dungeon Scrawl (facoltativo)</label>
        <iframe
          src="https://dungeonscrawl.com/editor"
          title="Dungeon Scrawl"
          style={{ width: "100%", height: "400px", border: "1px solid #444", borderRadius: "6px", marginTop: "10px" }}
        />
        {pinSelezionatoIndex !== null && (
  <div className="pin-editor">
    <h4>📌 Modifica Pin Narrativo</h4>
    <label>Tipo</label>
    <select
      value={pinNarrativi[pinSelezionatoIndex].tipo}
      onChange={e => aggiornaCampoPin("tipo", e.target.value)}
    >
      <option>Villain</option>
      <option>PNG</option>
      <option>Mostro</option>
      <option>Capitolo</option>
      <option>Altro</option>
    </select>

    <label>Riferimento</label>
    <input
      type="text"
      value={pinNarrativi[pinSelezionatoIndex].riferimento}
      onChange={e => aggiornaCampoPin("riferimento", e.target.value)}
    />

    <label>Note</label>
    <textarea
      rows="2"
      value={pinNarrativi[pinSelezionatoIndex].nota}
      onChange={e => aggiornaCampoPin("nota", e.target.value)}
    />

    <button onClick={() => setPinSelezionatoIndex(null)}>✅ Chiudi editor</button>
    <button onClick={() => rimuoviPin(pinSelezionatoIndex)}>🗑️ Rimuovi</button>
  </div>
)}

        <div className="bottoni">
          <button onClick={handleSalva}>💾 Salva</button>
          <button onClick={onClose}>❌ Chiudi</button>
        </div>
      </div>
    </div>
  );
};

export default ModaleMappa;
