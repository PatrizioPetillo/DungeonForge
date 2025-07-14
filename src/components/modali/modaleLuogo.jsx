import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../../firebase/firebaseConfig";
import { toast } from "react-toastify";
import "../../styles/modaleLuogo.css";
const ModaleLuogo = ({ onClose, campagnaId }) => {
  const [tab, setTab] = useState("Generale");
  const [sceneDisponibili, setSceneDisponibili] = useState([]);

  const [luogo, setLuogo] = useState({
    nome: "",
    tipo: "",
    immagine: "",
    descrizione: "",
    sceneCollegate: [],
    createdAt: null,
  });
  const generaLuogoCasuale = () => {
    const tipi = [
      "Taverna",
      "Foresta",
      "Rovina",
      "Castello",
      "Santuario",
      "Villaggio",
      "Caverna",
      "Tempio",
      "Palude",
      "Faro",
      "Isola",
      "Cittadella",
      "Accampamento",
      "Fortezza",
      "Labirinto",
      "Cimitero",
      "Mercato",
      "Biblioteca",
      "Arena",
      "Giardino",
      "Miniera",
      "Sotterraneo",
      "Spiaggia",
      "Passo di Montagna",
      "Fiume",
      "Cascata",
      "Ponte",
      "Torre",
      "Porto",
      "Città",
      "Villaggio di pescatori",
      "Fattoria",
      "Castello abbandonato",
      "Rifugio dei ladri",
    ];
    const descrizioni = [
      "Un luogo avvolto da misteri antichi e leggende dimenticate. Si vocifera che qui si nasconda un tesoro perduto. Molti viaggiatori si sono persi tra le sue strade.",
      "Le sue mura trasudano memorie di guerre e amori perduti. Un tempo era un centro di potere, ora è solo un'ombra di ciò che era.",
      "Un rifugio sicuro... o forse una trappola ben mascherata. I suoi abitanti sono noti per la loro ospitalità, ma anche per i loro segreti.",
      "Luogo di potere, protetto da simboli arcani e creature silenziose. Solo i più coraggiosi osano avventurarsi qui.",
      "Un punto di passaggio dove il tempo sembra essersi fermato. I viaggiatori raccontano storie di incontri straordinari e magie dimenticate.",
      "La natura qui si è ripresa ciò che l'uomo aveva conquistato. Le piante crescono rigogliose e gli animali sembrano osservare ogni passo.",
      "Ogni pietra sembra osservare chi osa attraversarne la soglia. Un luogo di saggezza antica, dove le storie si intrecciano con la realtà.",
      "Un luogo di ritrovo per avventurieri e mercanti. Le sue strade sono animate da suoni, colori e profumi che raccontano storie di terre lontane.",
      "Un luogo di pace e meditazione, dove il tempo scorre lentamente. I visitatori possono trovare rifugio dalle tempeste del mondo esterno.",
      "Un luogo di conflitto e alleanze, dove le forze del bene e del male si scontrano in battaglie epiche.",
      "Il paesaggio è dominato da una grande quercia, sotto la quale si dice che gli spiriti degli antichi si riuniscano per discutere del destino del mondo.",
      "Un antico castello in rovina, le cui torri si stagliano contro il cielo. Si dice che sia infestato dai fantasmi dei suoi antichi abitanti.",
      "Questo villaggio è noto per la sua fiera annuale, dove gli abitanti si sfidano in giochi e competizioni per onorare gli dei.",
      "Un luogo di culto dedicato a una divinità dimenticata, con statue e simboli che raccontano storie di un'epoca passata.",
      "Un antico faro che guida i marinai attraverso le tempeste. Si dice che la sua luce sia alimentata da un cristallo magico.",
      "Il tempio è circondato da una piccolo bosco incantato, dove gli alberi sembrano muoversi e le creature magiche si nascondono tra le fronde.",
      "Un luogo di ritrovo per i ladri e gli avventurieri, dove si scambiano informazioni e si pianificano colpi audaci.",
      "Un antico cimitero, dove le tombe raccontano storie di eroi e traditori. Si dice che di notte gli spiriti dei defunti si riuniscano per discutere del loro destino.",
      "Questo accampamento è noto per la sua ospitalità e per le storie che i viaggiatori raccontano intorno al fuoco. Si dice che gli spiriti della foresta proteggano i suoi abitanti.",
      "Il Sotterraneo si districa tra cunicoli e gallerie, con antiche iscrizioni sbiadite sulle mura e graffi lungo tutte le arcate. L'umidità trasuda dalle pareti e l'odore di muffa è persistente.",
    ];
    const nomi = [
      "Il Rintocco Infranto",
      "La Quercia delle Ombre",
      "Rocca del Tramonto",
      "Le Lame Seppellite",
      "Bocca del Silenzio",
      "Fenditura del Sogno",
      "L'Ultima Campana",
      "L'Accampamento Spezzato",
      "Il Faro di Cristallo",
      "La Torre del Vento",
      "Il Villaggio dei Sussurri",
      "La Valle dei Ricordi",
      "Il Ponte delle Stelle",
      "La Caverna del Tempo",
      "Il Giardino delle Illusioni",
      "Il Labirinto della Luna",
      "La Spiaggia dei Sogni Perduti",
      "Il Castello delle Nebbie",
      "L'Isola dei Segreti",
      "La Miniera degli Echi",
      "Il Santuario della Luce",
      "La Fattoria dei Fantasmi",
      "Il Mercato delle Meraviglie",
      "La Biblioteca dei Sogni",
      "L'Arena dei Campioni",
      "Il Giardino delle Fate",
      "La Miniera di Cristallo",
      "Il Passo del Drago",
      "Il Fiume delle Stelle",
      "La Cascata dei Sussurri",
      "Il Ponte dei Desideri",
      "La Torre del Mago",
    ];

    const tipo = tipi[Math.floor(Math.random() * tipi.length)];
    const nome = nomi[Math.floor(Math.random() * nomi.length)];
    const descrizione =
      descrizioni[Math.floor(Math.random() * descrizioni.length)];

    setLuogo((l) => ({
      ...l,
      nome,
      tipo,
      descrizione,
      immagine: "",
      sceneCollegate: [],
    }));

    toast.info("Luogo generato casualmente");
  };

  useEffect(() => {
    if (!campagnaId) return;
    const fetchScene = async () => {
      const snap = await getDocs(
        collection(firestore, `campagne/${campagnaId}/scenes`)
      );
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setSceneDisponibili(data);
    };
    fetchScene();
  }, [campagnaId]);

  const salvaLuogo = async () => {
    try {
      await addDoc(collection(firestore, "luoghi"), {
        ...luogo,
        createdAt: serverTimestamp(),
      });
      toast.success("Luogo salvato con successo!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Errore durante il salvataggio.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modale-luogo">
        <div className="modale-header">
          <h2>📍 Nuovo Luogo</h2>
          <div className="icone-header">
            <button onClick={generaLuogoCasuale} title="Genera luogo casuale">
              🎲
            </button>
            <button onClick={salvaLuogo} title="Salva">
              💾
            </button>
            <button onClick={onClose} title="Chiudi">
              ✖️
            </button>
          </div>
        </div>

        <div className="tab-bar">
          {["Generale", "Descrizione", "Collegamenti"].map((t) => (
            <button
              key={t}
              className={tab === t ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {tab === "Generale" && (
            <>
              <div className="field-group">
                <label>Nome del luogo:</label>
                <input
                  value={luogo.nome}
                  onChange={(e) =>
                    setLuogo((l) => ({ ...l, nome: e.target.value }))
                  }
                />
              </div>
              <div className="field-group">
                <label>Tipo:</label>
                <input
                  value={luogo.tipo}
                  placeholder="Es: Taverna, Bosco, Castello..."
                  onChange={(e) =>
                    setLuogo((l) => ({ ...l, tipo: e.target.value }))
                  }
                />
              </div>
              <div className="field-group">
                <label>URL Immagine (facoltativa):</label>
                <input
                  value={luogo.immagine}
                  onChange={(e) =>
                    setLuogo((l) => ({ ...l, immagine: e.target.value }))
                  }
                />
              </div>
            </>
          )}

          {tab === "Descrizione" && (
            <div className="field-group">
              <label>Descrizione dettagliata:</label>
              <textarea
                rows={8}
                value={luogo.descrizione}
                onChange={(e) =>
                  setLuogo((l) => ({ ...l, descrizione: e.target.value }))
                }
              />
            </div>
          )}

          {tab === "Collegamenti" && (
            <div className="field-group">
              <label>Collega a Scene:</label>
              <select
                multiple
                value={luogo.sceneCollegate}
                onChange={(e) =>
                  setLuogo((l) => ({
                    ...l,
                    sceneCollegate: Array.from(e.target.selectedOptions).map(
                      (opt) => opt.value
                    ),
                  }))
                }
              >
                {sceneDisponibili.map((scene) => (
                  <option key={scene.id} value={scene.id}>
                    {scene.titolo || "Senza titolo"}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModaleLuogo;
