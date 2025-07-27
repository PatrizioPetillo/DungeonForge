import React, { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp, getDocs } from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import {
  generaTitoloCasuale,
  generaContenutoCasuale,
  generaHookCasuale
} from "../../utils/generators";
import { esempiStanze } from "../../utils/esempiStanze";
import "../../styles/modaleFiveRoomDungeon.css";

const ModaleFiveRoomDungeon = ({ onClose }) => {
  const [titolo, setTitolo] = useState("");
  const [stanze, setStanze] = useState([
    {
      titolo: "La Porta Sigillata",
      scopo: "Introdurre mistero e minaccia",
      descrizione: "",
      scene: [],
      png: [],
      enigmi: [],
    },
    {
      titolo: "L’Enigma dell’Araldo",
      scopo: "Ostacolo sociale o mentale",
      descrizione: "",
      scene: [],
      png: [],
      enigmi: [],
    },
    {
      titolo: "Rivelazione nel Buio",
      scopo: "Spiegare o confondere",
      descrizione: "",
      scene: [],
      png: [],
      enigmi: [],
    },
    {
      titolo: "La Stanza del Sangue",
      scopo: "Combattimento o climax",
      descrizione: "",
      scene: [],
      png: [],
      enigmi: [],
    },
    {
      titolo: "L’Occhio della Verità",
      scopo: "Rivelazione + scelta finale",
      descrizione: "",
      scene: [],
      png: [],
      enigmi: [],
    },
  ]);
const [esempioCorrente, setEsempioCorrente] = useState("Clicca il dado per generare un esempio.");
  const [sceneDisponibili, setSceneDisponibili] = useState([]);
  const [pngDisponibili, setPngDisponibili] = useState([]);
  const [villainDisponibili, setVillainDisponibili] = useState([]);
  const [mostroDisponibili, setMostroDisponibili] = useState([]);
  const [enigmiDisponibili, setEnigmiDisponibili] = useState([]);
  const [tabAttiva, setTabAttiva] = useState(0);

  const generaAvventura = () => {
    
  const idee = stanzeTemplate.map((nome, i) => ({
    titolo: generaTitoloCasuale(),
    scopo: stanze[i]?.scopo || "",
    descrizione: generaContenutoCasuale(i),
    scene: [],
    png: [],
    enigmi: [],
    personaggi: [],
    dialogo: "",
    durata: "",
    trappola: "",
  }));
  setTitolo(generaHookCasuale()); // Aggancio narrativo
  setStanze(idee);
  toast.info("Five Room Dungeon generato!");
};

  useEffect(() => {
    const fetchDati = async () => {
  try {
    const promises = [];

    // Se abbiamo campagnaId, fetch delle scene
    if (campagnaId) {
      promises.push(getDocs(collection(firestore, `campagne/${campagnaId}/scenes`)));
    } else {
      promises.push(Promise.resolve({ docs: [] })); // placeholder
    }

    // Fetch globali
    promises.push(getDocs(collection(firestore, "png")));
    promises.push(getDocs(collection(firestore, "enigmi")));

    const [sceneSnap, pngSnap, enigmaSnap] = await Promise.all(promises);

    setSceneDisponibili(sceneSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setPngDisponibili(pngSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setEnigmiDisponibili(enigmaSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

    // Villain e mostri
    const villainSnap = await getDocs(collection(firestore, "villain"));
    const mostroSnap = await getDocs(collection(firestore, "mostri"));

    setVillainDisponibili(villainSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setMostroDisponibili(mostroSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

  } catch (err) {
    console.error("Errore fetch dati:", err);
  }
};

    fetchDati();
  }, []);

  const aggiornaStanza = (index, changes) => {
    setStanze((prev) => {
      const nuovo = [...prev];
      nuovo[index] = { ...nuovo[index], ...changes };
      return nuovo;
    });
  };

  const handleSalva = async () => {
  try {
    if (!titolo || stanze.length === 0) {
      toast.error("❌ Inserisci almeno il titolo e una stanza!");
      return;
    }

    const avventura = {
      titolo,
      stanze,
      tema: "Five Room Dungeon",
      createdAt: serverTimestamp(),
      tipo: "fiveRoomDungeon"
    };

    // 🔹 Salva in Archivio
    const docRef = await addDoc(collection(firestore, "avventure"), avventura);
    avventura.id = docRef.id;
    toast.success("✅ Avventura salvata in Archivio!");

    // 🔹 Se collegata alla campagna
    if (typeof collegaAllaCampagna !== "undefined" && collegaAllaCampagna && campagnaId) {
      const campagnaRef = collection(firestore, `campagne/${campagnaId}/avventure`);
      await addDoc(campagnaRef, { ...avventura, collegataCampagna: true });
      toast.success("📌 Avventura collegata alla campagna!");
    }

    if (onSave) onSave(avventura);
    onClose();
  } catch (err) {
    console.error("Errore salvataggio FRD:", err);
    toast.error("❌ Errore durante il salvataggio");
  }
};

  return (
    <div className="modale-overlay">
      <div className="modale-avventura">
        <div className="modale-header">
          <h2>🧭 Five Room Dungeon</h2>
          <div className="icone-header">
            <button onClick={generaAvventura} title="Genera avventura">
              🎲
            </button>
            <button onClick={handleSalva} title="Salva">
              💾
            </button>
            <button onClick={onClose} title="Chiudi">
              ✖️
            </button>
          </div>
        </div>

        <div className="field-group">
          <label>Titolo evocativo:</label>
          <input
            value={stanze[tabAttiva].titolo}
            onChange={(e) =>
              aggiornaStanza(tabAttiva, { titolo: e.target.value })
            }
          />
          <label>Durata stimata (minuti):</label>
          <input
            type="number"
            value={stanze[tabAttiva].durata || ""}
            onChange={(e) =>
              aggiornaStanza(tabAttiva, { durata: e.target.value })
            }
          />

          <label>Scopo narrativo:</label>
          <input
            value={stanze[tabAttiva].scopo}
            onChange={(e) =>
              aggiornaStanza(tabAttiva, { scopo: e.target.value })
            }
          />

          <label>Descrizione della stanza:</label>
          <textarea
            rows={3}
            value={stanze[tabAttiva].descrizione}
            onChange={(e) =>
              aggiornaStanza(tabAttiva, { descrizione: e.target.value })
            }
          />
          <div className="esempio-container">
            <p><strong>Esempio:</strong> {esempioCorrente}</p>
            <button
              onClick={() => {
                let lista;
                switch (tabAttiva) {
                  case 0: lista = esempiStanze.ingresso; break;
                  case 1: lista = esempiStanze.enigma; break;
                  case 2: lista = esempiStanze.twist; break;
                  case 3: lista = esempiStanze.climax; break;
                  case 4: lista = esempiStanze.ricompensa; break;
                  default: lista = [];
                }
                setEsempioCorrente(lista[Math.floor(Math.random() * lista.length)]);
              }}
            >
              🎲 Genera esempio
            </button>
          </div>

          <label>Ostacolo / Trappola:</label>
          <select
            value={stanze[tabAttiva].trappola || ""}
            onChange={(e) =>
              aggiornaStanza(tabAttiva, { trappola: e.target.value })
            }
          >
            <option value="">— Nessuna —</option>
            <option value="Trappola di dardi avvelenati">
              Trappola di dardi avvelenati
            </option>
            <option value="Enigma magico a tempo">Enigma magico a tempo</option>
            <option value="Passaggio occulto con runa esplosiva">
              Passaggio occulto con runa esplosiva
            </option>
            <option value="Specchio illusorio che intrappola">
              Specchio illusorio che intrappola
            </option>
            <option value="Serratura senziente che pone enigmi">
              Serratura senziente che pone enigmi
            </option>
          </select>

          <label>Aggiungi PNG o Villain alla stanza:</label>
          <select
            multiple
            value={stanze[tabAttiva].personaggi || []}
            onChange={(e) =>
              aggiornaStanza(tabAttiva, {
                personaggi: Array.from(e.target.selectedOptions).map(
                  (opt) => opt.value
                ),
              })
            }
          >
            {[...pngDisponibili, ...villainDisponibili].map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} ({p.tipo === "villain" ? "Villain" : "PNG"})
              </option>
            ))}
          </select>

          <label>Dialogo suggerito:</label>
          <textarea
            rows={2}
            placeholder="“Nessuno esce vivo da questo luogo...”"
            value={stanze[tabAttiva].dialogo || ""}
            onChange={(e) =>
              aggiornaStanza(tabAttiva, { dialogo: e.target.value })
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ModaleFiveRoomDungeon;
