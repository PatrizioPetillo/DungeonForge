// src/pages/LiveSessionDM.jsx

import React, {useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
import SidebarSessione from "../components/liveSession/sidebarSession";
import SceneViewer from "../components/liveSession/sceneViewer";
import MostriAttivi from "../components/liveSession/mostriAttivi";
import PNGAttivi from "../components/liveSession/pngAttivi";
import LogSessione from "../components/liveSession/logSession";
import ProveRapide from "../components/liveSession/proveRapide";
import Combattimento from "../components/liveSession/combattimento";
import AttaccoRapido from "../components/liveSession/attaccoRapido";
import EnigmiAttivi from "../components/liveSession/enigmiAttivi";
import VillainAttivi from "../components/liveSession/villainAttivi";
import "../styles/liveSessionDM.css";
import { onLog } from "firebase/app";

const LiveSessionDM = () => {
  const { id } = useParams();
  const [campagna, setCampagna] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eventiLog, setEventiLog] = useState([]);
  const [scenaIndex, setScenaIndex] = useState(0);

  const [mostraAttaccoLibero, setMostraAttaccoLibero] = useState(false);
  const [ignoraIniziativa, setIgnoraIniziativa] = useState(false);
  const [ignoraTurni, setIgnoraTurni] = useState(false);
  const [sidebarVisibile, setSidebarVisibile] = useState(false);

  // Recupera la scena attiva dal primo capitolo (per ora)
  const scenaAttiva = campagna?.capitoli?.[0]?.scene?.[scenaIndex] || null;
if (loading || !campagna) return <p>Caricamento sessione...</p>;

  const nextScene = () => {
    const scene = campagna.capitoli[0].scene;
    setScenaIndex((prev) => Math.min(prev + 1, scene.length - 1));
  };

  const prevScene = () => {
    setScenaIndex((prev) => Math.max(prev - 1, 0));
  };

  const aggiungiEventoLog = (evento) => {
    setEventiLog((prev) => [...prev, evento]);
  };

  useEffect(() => {
    const fetchCampagna = async () => {
      try {
        const campagnaRef = doc(firestore, "campagne", id);
        const campagnaSnap = await getDoc(campagnaRef);
        const meta = campagnaSnap.data();

        const [villainSnap, pngSnap, mostriSnap, enigmiSnap] =
          await Promise.all([
            getDocs(collection(campagnaRef, "villain")),
            getDocs(collection(campagnaRef, "png")),
            getDocs(collection(campagnaRef, "mostri")),
            getDocs(collection(campagnaRef, "enigmi")),
          ]);

        setCampagna({
          ...meta,
          villain: villainSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
          png: pngSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
          mostri: mostriSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
          enigmi: enigmiSnap.docs.map((d) => ({ id: d.id, ...d.data() })),
        });
        setLoading(false);
      } catch (err) {
        console.error("Errore nel caricamento:", err);
      }
    };

    fetchCampagna();
  }, [id]);

  if (loading || !campagna) return <p>Caricamento sessione...</p>;
  const mostriInScena = campagna.mostri?.filter(m => m.sceneId === scenaAttiva.id);
  const pngInScena = campagna.png?.filter(p => p.sceneCollegate?.includes(scenaAttiva.id));
  const villainInScena = campagna.villain?.filter(v => v.sceneCollegate?.includes(scenaAttiva.id));
  const enigmiInScena = campagna.enigmi?.filter(e => e.sceneCollegate?.includes(scenaAttiva.id));

  return (
    <div className="live-session">
      <button
        className="hamburger"
        onClick={() => setSidebarVisibile(!sidebarVisibile)}
      >
        ☰
      </button>
      <div className={`sidebar-session ${sidebarVisibile ? "visibile" : ""}`}>
        <SidebarSessione campagna={campagna} />
        {sidebarVisibile && (
          <div className="overlay" onClick={() => setSidebarVisibile(false)} />
        )}
      </div>
      <div className="main-session">
        <button onClick={() => setMostraAttaccoLibero(true)}>
          ⚔️ Attacco Libero
        </button>

        <SceneViewer scena={scenaAttiva} />
        <div className="nav-scene">
          <button onClick={prevScene}>⬅️ Scena precedente</button>
          <button onClick={nextScene}>➡️ Prossima scena</button>
        </div>
        <div className="widgets-row">
          <VillainAttivi villain={villainInScena} />
          <EnigmiAttivi enigmi={enigmiInScena} />
          <MostriAttivi mostri={mostriInScena} />
          <PNGAttivi png={pngInScena} />
          <ProveRapide
            scena={{ ...scenaAttiva, enigmi: enigmiInScena }}
            png={[...pngInScena, ...villainInScena, ...mostriInScena]} // merge PNG + Villain + Mostri
            onLog={onLog}
          />
          <Combattimento
            png={pngInScena.filter((p) => p.tipo === "non_comune")}
            villain={villainInScena}
            mostri={mostriInScena}
            onUpdate={(ordine) => {
              setEventiLog((prev) => [
                ...prev,
                {
                  tipo: "combattimento",
                  descrizione: "Ordine di iniziativa aggiornato",
                },
              ]);
            }}
          />
        </div>
        <LogSessione eventi={eventiLog} />
      </div>
      {mostraAttaccoLibero && (
        <div className="modale-attacco-libero">
          <div className="modale-contenuto">
            <h2>⚔️ Attacco Libero</h2>
            <p className="descrizione-evocativa">
              In un momento fuori dagli schemi, un personaggio decide di
              colpire...
            </p>

            <div className="opzioni-speciali">
              <label>
                <input
                  type="checkbox"
                  checked={ignoraIniziativa}
                  onChange={(e) => setIgnoraIniziativa(e.target.checked)}
                />
                Ignora l’iniziativa (attacco improvviso)
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={ignoraTurni}
                  onChange={(e) => setIgnoraTurni(e.target.checked)}
                />
                Attacco fuori dal proprio turno
              </label>
            </div>

            <AttaccoRapido
              png={pngInScena}
              villain={villainInScena}
              mostri={mostriInScena}
              onLog={onLog}
              opzioni={{
                ignoraIniziativa,
                ignoraTurni,
              }}
            />

            <button onClick={() => setMostraAttaccoLibero(false)}>
              ❌ Chiudi
            </button>
          </div>
        </div>
      )}

      <div className="footer-session">
        <p>Sessione DM - Campagna: {campagna.nome}</p>
      </div>
    </div>
  );
};

export default LiveSessionDM;
