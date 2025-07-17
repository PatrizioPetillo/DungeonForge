import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import PngWidget from "../components/widget/pngWidget";
import VillainWidget from "../components/widget/villainWidget";
import ModaleVillain from "../components/modali/modaleVillain";
import ModalePng from "../components/modali/modalePNG";
import MostroWidget from "../components/widget/mostroWidget";
import ModaleMostro from "../components/modali/modaleMostro";
import LuogoWidget from "../components/widget/luogoWidget";
import ModaleLuogo from "../components/modali/modaleLuogo";
import ModaleEnigma from "../components/modali/modaleEnigma";
import EnigmaWidget from "../components/widget/enigmaWidget";
import ModaleAvventura from "../components/modali/modaleFiveRoomDungeon";
import AvventuraWidget from "../components/widget/avventuraWidget";
import ModaleCreaCampagna from "../components/modaleCreaCampagna";
import ModaleDettagliCampagna from "../components/modaleDettagliCampagna";
import CampagnaCard from "../components/campagnaCard";
import ModaleOggetti from "../components/gestioneOggetti";
import SuggerimentoDelGiorno from "../components/suggerimentodelGiorno";
import "../styles/dashboardDM.css";

function DashboardDM() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [campagna, setCampagna] = useState({
    titolo: "",
    descrizione: "",
    stato: "bozza",
  });
  const [campagnaSelezionata, setCampagnaSelezionata] = useState(null);
  const [showPngModal, setShowPngModal] = useState(false);
  const [showVillainModal, setShowVillainModal] = useState(false);
  const [showMostroModal, setShowMostroModal] = useState(false);
  const [showLuogoModal, setShowLuogoModal] = useState(false);
  const [mostraModaleEnigma, setMostraModaleEnigma] = useState(false);
  const [mostraModaleAvventura, setMostraModaleAvventura] = useState(false);
  const [mostraModaleOggetti, setMostraModaleOggetti] = useState(false);

  const salvaOggettoInCampagna = async (oggetto) => {
  await addDoc(collection(firestore, `campagne/${campagnaId}/oggetti`), oggetto);
  alert(`Oggetto "${oggetto.name}" aggiunto alla campagna`);
};


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
        <div className="dashboard-header-left">
          <img
            src="/img/avatar-default.png"
            alt="Profilo DM"
            className="dashboard-avatar"
          />
          <h1 className="dashboard-title">• Antro del Narratore •</h1>
        </div>
      </header>
        <SuggerimentoDelGiorno />

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

      <hr />

      {/* Generatori */}
      <section className="dashboard-generatori-section">
        <div className="dashboard-generatori-header">
        <h2>Forgia delle Maschere</h2>
        <p className="section-desc">
          Strumenti per creare PNG, Villain, Mostri, Enigmi o Avventure
          modulari.
        </p>
        </div>
        <div className="dashboard-generatori">
  <PngWidget onClick={() => setShowPngModal(true)} />
  <VillainWidget onClick={() => setShowVillainModal(true)} />
  <MostroWidget onClick={() => setShowMostroModal(true)} />
  <LuogoWidget onClick={() => setShowLuogoModal(true)} />
  <EnigmaWidget onClick={() => setMostraModaleEnigma(true)} />
  <AvventuraWidget onClick={() => setMostraModaleAvventura(true)} />
</div>
<hr />
{showPngModal && <ModalePng onClose={() => setShowPngModal(false)} />}
{showVillainModal && <ModaleVillain onClose={() => setShowVillainModal(false)} />}
{showMostroModal && <ModaleMostro onClose={() => setShowMostroModal(false)} />}
{showLuogoModal && <ModaleLuogo onClose={() => setShowLuogoModal(false)} />}
{mostraModaleEnigma && <ModaleEnigma onClose={() => setMostraModaleEnigma(false)} />}
{mostraModaleAvventura && <ModaleAvventura onClose={() => setMostraModaleAvventura(false)} />}
      </section>

      {/* Recap Sessione */}
      <section className="dashboard-section">
        <h2>🪶 Recap Sessione</h2>
        <div className="recap-box">
          <p>
            <em>
              “I giocatori hanno esplorato la miniera abbandonata e incontrato
              l’antico spirito forgiatore…”
            </em>
          </p>
          <button>✏️ Modifica Recap</button>
        </div>
      </section>

      <hr />

      {/* Archivio Narrativo */}
      <section className="dashboard-section">
        <h2>📚 Archivio</h2>
        <p className="section-desc">
          Villain, PNG, Mostri, Oggetti, Luoghi salvati e riutilizzabili nelle
          campagne.
        </p>
        <button className="btn-primary" onClick={() => navigate("/archivio")}>
          Apri Archivio
        </button>
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
<section className="dashboard-section">
  <h2>Gestione Oggetti</h2>
  <p className="section-desc">
    Gestisci gli oggetti della tua campagna, come armi, armature e altri
    equipaggiamenti.
  </p>
      <button onClick={() => setMostraModaleOggetti(true)}>📜 Gestisci Oggetti</button>
</section>
{mostraModaleOggetti && (
  <ModaleOggetti
    onClose={() => setMostraModaleOggetti(false)}
    campagnaId={campagnaId}
    onAggiungi={(oggetto) => salvaOggettoInCampagna(oggetto)}
  />
)}

    </div>
  );
}

export default DashboardDM;
