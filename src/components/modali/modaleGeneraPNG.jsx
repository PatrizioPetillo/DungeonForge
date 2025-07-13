import React, { useState } from "react";
import { salvaPNGFirestore } from "../../firebase/salvaPNGFirestore";
import GeneratorePNG from "../generatori/generatorePNG";
import "../../styles/modaleGeneraPNG.css";

const ModalGeneratoreDiVolti = ({ onClose }) => {
  const [tipo, setTipo] = useState("Comune");
  const [pngGenerato, setPngGenerato] = useState(null);
  const [scenaCollegata, setScenaCollegata] = useState("");
  const [notaRapida, setNotaRapida] = useState("");
  const [noteTestuali, setNoteTestuali] = useState("");

  const toggleTipo = () => {
    setTipo((prev) => (prev === "Comune" ? "Non Comune" : "Comune"));
    setPngGenerato(null); // resetta se si cambia tipo
  };

  const handleGenera = () => {
    setPngGenerato(null); // forza il reset
    setTimeout(() => setPngGenerato({ rigenera: true }), 50); // workaround per forzare la rigenerazione
  };

  const handleSalva = async () => {
  if (!pngGenerato) return alert("Genera prima un PNG!");
  const pngCompleto = {
    ...pngGenerato,
    tipo,
    scenaCollegata,
    notaRapida,
    noteTestuali,
    preferito: false,
  };
  await salvaPNGFirestore(pngCompleto);
  onClose();
};

  return (
    <div className="modal-generatore">
      <div className="modal-header">
        <h2>Generatore di Volti</h2>
        <button onClick={onClose}>✖</button>
      </div>

      <div className="modal-content">
        <div className="toggle-section">
          <label>Tipo PNG:</label>
          <button className={`toggle-btn ${tipo}`} onClick={toggleTipo}>
            {tipo}
          </button>
        </div>

        <button className="genera-btn" onClick={handleGenera}>
          🎲 Genera PNG Casuale
        </button>

        {pngGenerato && (
          <div className="generatore-wrapper">
            <GeneratorePNG
              tipo={tipo}
              onGenerato={setPngGenerato}
              predefinito={pngGenerato}
              modificabile={true}
            />

            <div className="collegamenti-extra">
              <label>Collega a Scena:</label>
              <input
                type="text"
                value={scenaCollegata}
                onChange={(e) => setScenaCollegata(e.target.value)}
                placeholder="Es: La Vecchia Taverna"
              />

              <label>Nota Rapida:</label>
              <select
                value={notaRapida}
                onChange={(e) => setNotaRapida(e.target.value)}
              >
                <option value="">- Seleziona -</option>
                <option value="Alleato">🤝 Alleato</option>
                <option value="Nemico">☠️ Nemico</option>
                <option value="Traditore">🗡️ Traditore</option>
                <option value="Neutrale">⚖️ Neutrale</option>
              </select>

              <label>Note del DM:</label>
              <textarea
                rows={3}
                value={noteTestuali}
                onChange={(e) => setNoteTestuali(e.target.value)}
                placeholder="Annotazioni riservate al DM..."
              />
            </div>
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button onClick={handleSalva}>💾 Salva PNG</button>
      </div>
    </div>
  );
};

export default ModalGeneratoreDiVolti;
