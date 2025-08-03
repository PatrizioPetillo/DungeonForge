import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PNGAttivi from "../components/liveSession/pngAttivi";
import VillainAttivi from "../components/liveSession/villainAttivi";
import MostriAttivi from "../components/liveSession/mostriAttivi";
import EnigmiAttivi from "../components/liveSession/enigmiAttivi";
import SidebarSession from "../components/liveSession/sidebarSession";
import StatoEntita from "../components/liveSession/statoEntita";
import AttaccoRapido from "../components/liveSession/attaccoRapido";
import ProveRapide from "../components/liveSession/proveRapide";
import Combattimento from "../components/liveSession/combattimento";
import LootSessione from "../components/liveSession/lootSessione";
import LogSession from "../components/liveSession/logSession";
import AttoViewer from "../components/attoViewer";
import { fetchSessioneById } from "../utils/fetchSessioneById";
import "../styles/liveSessionDM.css";

export default function LiveSessionDM({ campagna }) {
  const [attoCorrente, setAttoCorrente] = useState(0);
  const idSessione = campagna?.id || null; // recuperato da useParams() in un contesto reale
  const isOneShot = campagna?.tipo === "predefinita";
  const navigate = useNavigate();


  const handleProssimoAtto = () => {
    if (attoCorrente < campagna.atti.length - 1) {
      setAttoCorrente(attoCorrente + 1);
    }
  };

  const handleAttoPrecedente = () => {
    if (attoCorrente > 0) {
      setAttoCorrente(attoCorrente - 1);
    }
  };

  useEffect(() => {
    document.title = campagna?.titolo || "Sessione";
    const caricaSessione = async () => {
    const dati = await fetchSessioneById(idSessione); // ← recuperato da useParams()
    if (dati) setCampagna(dati.campagna || dati);
  };
  caricaSessione();

  }, [campagna]);

  return (
    <div className="sessione-container">
      <SidebarSession campagna={campagna} />
<button onClick={() => navigate("/dashboard")} className="torna-dashboard">
  ⬅️ Torna alla Dashboard
</button>

      <main className="sessione-main">
        <h2>{campagna.titolo}</h2>
        <p>
          <em>{campagna.tagline}</em>
        </p>
        <p>
          <strong>Ambientazione:</strong> {campagna.ambientazione}
        </p>

        {campagna.atti && (
          <div className="atti-narrativi">
            <h3>
              📖 {campagna.tipo === "predefinita" ? "One-Shot" : "Campagna"} –
              Atti Narrativi
            </h3>
            <div className="navigazione-atti">
              <button
                onClick={handleAttoPrecedente}
                disabled={attoCorrente === 0}
              >
                ⬅️ Atto precedente
              </button>
              <span>
                Atto {attoCorrente + 1} di {campagna.atti.length}
              </span>
              <button
                onClick={handleProssimoAtto}
                disabled={attoCorrente === campagna.atti.length - 1}
              >
                ➡️ Prossimo atto
              </button>
            </div>

            <div className="atto-box">
              <h4>{campagna.atti[attoCorrente].titolo}</h4>
              <p>
                <strong>Obiettivo:</strong>{" "}
                {campagna.atti[attoCorrente].obiettivo}
              </p>
              <ul>
                {campagna.atti[attoCorrente].contenuto.map((c, i) => (
                  <li key={i}>– {c}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <VillainAttivi villain={[campagna.villain]} />
        <PNGAttivi png={campagna.png} />
        <MostriAttivi mostri={campagna.mostri} />
        <EnigmiAttivi enigmi={campagna.enigmi} />
        <StatoEntita
          png={campagna.png}
          villain={[campagna.villain]}
          mostri={campagna.mostri}
        />
        <AttoViewer
          atti={campagna.atti}
          attoCorrente={attoCorrente}
          setAttoCorrente={setAttoCorrente}
          readonly={campagna.tipo === "predefinita"}
        />

        {/* Moduli interattivi visibili solo nelle campagne personalizzabili */}
        {campagna.tipo !== "predefinita" && (
          <>
            <Combattimento
              png={campagna.png}
              villain={[campagna.villain]}
              mostri={campagna.mostri}
            />
            <AttaccoRapido
              png={campagna.png}
              villain={[campagna.villain]}
              mostri={campagna.mostri}
            />
            <ProveRapide png={campagna.png} />
            <LootSessione campagnaId={campagna.id} />
          </>
        )}

        <LogSession campagnaId={campagna.id} />
      </main>
    </div>
  );
}
