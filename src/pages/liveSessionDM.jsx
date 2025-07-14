// src/pages/LiveSessionDM.jsx

import React from "react";
import { useParams } from "react-router-dom";
import mockCampagna from "../data/mockSessionData";
import SidebarSessione from "../components/liveSession/sidebarSession";
import SceneViewer from "../components/liveSession/sceneViewer";
import MostriAttivi from "../components/liveSession/mostriAttivi";
import PNGAttivi from "../components/liveSession/pngAttivi";
import LogSessione from "../components/liveSession/logSession";
import ProveRapide from "../components/liveSession/proveRapide";
import Combattimento from "../components/liveSession/combattimento";
import AttaccoRapido from "../components/liveSession/attaccoRapido";
import "../styles/liveSessionDM.css";

const LiveSessionDM = () => {
  const { id } = useParams();
  const campagna = mockCampagna;
  const [eventiLog, setEventiLog] = useState(campagna.eventi);
  const [scenaIndex, setScenaIndex] = useState(0);

  // Recupera la scena attiva dal primo capitolo (per ora)
  const scenaAttiva =
    campagna.capitoli?.[0]?.scene?.[scenaIndex] || campagna.scenaAttiva;
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

  return (
    <div className="live-session">
      <SidebarSessione campagna={campagna} />
      <div className="main-session">
        <SceneViewer scena={scenaAttiva} />
        <div className="nav-scene">
          <button onClick={prevScene}>⬅️ Scena precedente</button>
          <button onClick={nextScene}>➡️ Prossima scena</button>
        </div>
        <div className="widgets-row">
          <MostriAttivi mostri={campagna.mostri} />
          <PNGAttivi png={campagna.png} />
          <ProveRapide
            scena={campagna.scenaAttiva}
            png={[...campagna.png, ...campagna.villain, ...campagna.mostri]} // merge PNG + Villain + Mostri
            onLog={aggiungiEventoLog}
          />
          <Combattimento
            png={campagna.png.filter((p) => p.tipo === "non_comune")}
            villain={campagna.villain}
            mostri={campagna.mostri}
            onUpdate={(ordine) => {
              setEventiLog((prev) => [
                ...prev,
                { tipo: "combattimento", descrizione: "Ordine di iniziativa aggiornato" }
              ]);
            }}
          />
          <AttaccoRapido
            entita={campagna.png.find((p) => p.nome === attore)}
            onLog={aggiungiEventoLog}
          />
        </div>
        <LogSessione eventi={eventiLog} />
      </div>
    </div>
  );
};

export default LiveSessionDM;
