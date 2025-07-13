import React, {useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import PngWidget from "../components/widget/pngWidget";
import VillainWidget from "../components/widget/villainWidget";
import ModaleVillain from "../components/modali/modaleVillain";
import ModalePng from "../components/modali/modalePNG";
import ModaleCreaCampagna from '../components/modaleCreaCampagna';
import ModaleDettagliCampagna from '../components/modaleDettagliCampagna';
import CampagnaCard from '../components/campagnaCard';
import SuggerimentoDelGiorno from '../components/suggerimentodelGiorno';
import '../styles/dashboardDM.css';

function DashboardDM() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [campagna, setCampagna] = useState({
      titolo: '',
      descrizione: '',
      stato: 'bozza',
    });
    const [campagnaSelezionata, setCampagnaSelezionata] = useState(null);
    const [showPngModal, setShowPngModal] = useState(false);
    const [showVillainModal, setShowVillainModal] = useState(false);
    
  return (
    <div className="dashboard-container">
        {showModal && <ModaleCreaCampagna onClose={() => setShowModal(false)} />}
    {campagnaSelezionata && (
  <ModaleDettagliCampagna
    campagna={campagnaSelezionata}
    onClose={() => setCampagnaSelezionata(null)}
  />
)}

      {/* Titolo e Frase Ispiratrice */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">🧙‍♂️ Antro del Narratore</h1>
        <SuggerimentoDelGiorno />
      </header>

      {/* Campagne gestite */}
      <section className="dashboard-section">
        <h2>📌 Campagne attive</h2>
        <div className="campagne-list">
          {/* Lista campagne da Firestore */}
          <CampagnaCard title="La Cripta dei Venti" stato="Attiva" />
          <CampagnaCard
  titolo={campagna.titolo}
  stato={campagna.stato}
  immagine={campagna.immagine}
  onClick={() => setCampagnaSelezionata(campagna)}
/>
          {/* Placeholder per il pulsante */}
          <div className="campagna-add-btn" onClick={() => setShowModal(true)}>
  + Crea nuova campagna
</div>

        </div>
      </section>
      

      {/* Archivio Narrativo */}
      <section className="dashboard-section">
        <h2>📚 Archivio</h2>
        <p className="section-desc">Villain, PNG, Mostri, Oggetti, Luoghi salvati e riutilizzabili nelle campagne.</p>
        <div className="archivio-buttons">
          <button>📖 PNG</button>
          <button>😈 Villain</button>
          <button>👾 Mostri</button>
          <button>🎁 Loot</button>
          <button>🏰 Luoghi</button>
        </div>
      </section>

      {/* Generatori */}
      <section className="dashboard-section">
        <h2>Forgia delle Maschere</h2>
        <p className="section-desc">Strumenti per creare PNG, Villain, Mostri, Enigmi o Avventure modulari.</p>
        {/* Widget PNG */}
      <section className="dashboard-section">
        <PngWidget onClick={() => setShowPngModal(true)} />
        {showPngModal && <ModalePng onClose={() => setShowPngModal(false)} />}
      </section>
      {/* Widget Villain */}
      <section className="dashboard-section">
        <VillainWidget onClick={() => setShowVillainModal(true)} />
        {showVillainModal && <ModaleVillain onClose={() => setShowVillainModal(false)} />}
      </section>
      </section>

      {/* Recap Sessione */}
      <section className="dashboard-section">
        <h2>🪶 Recap Sessione</h2>
        <div className="recap-box">
          <p><em>“I giocatori hanno esplorato la miniera abbandonata e incontrato l’antico spirito forgiatore…”</em></p>
          <button>✏️ Modifica Recap</button>
        </div>
      </section>

      {/* FUTURE: Mappa delle Connessioni */}
      {/* <section className="dashboard-section">
        <h2>🧠 Mappa delle Connessioni</h2>
        <p className="section-desc">Visualizzazione interattiva dei collegamenti tra elementi narrativi.</p>
        <div className="placeholder-box">[Schema a grafo - in sviluppo]</div>
      </section> */}

      {/* FUTURE: Timeline degli Eventi */}
      {/* <section className="dashboard-section">
        <h2>🕰️ Timeline degli Eventi</h2>
        <p className="section-desc">Gestione cronologica degli eventi narrativi e delle sessioni giocate.</p>
        <div className="placeholder-box">[Timeline interattiva - in sviluppo]</div>
      </section> */}

      {/* FUTURE: Note del Narratore / Diario */}
      {/* <section className="dashboard-section">
        <h2>📓 Diario del Narratore</h2>
        <p className="section-desc">Appunti sparsi, idee, bozze di trame o colpi di scena.</p>
        <button>Aggiungi nota</button>
      </section> */}

    </div>
  );
}

export default DashboardDM;
