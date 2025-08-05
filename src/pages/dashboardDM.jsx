import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import PngWidget from "../components/widget/pngWidget";
import { salvaSessioneOneShot } from "../utils/salvaSessioneOneShot";
import WidgetMappe from "../components/widget/mappeWidget";
import VillainWidget from "../components/widget/villainWidget";
import ModaleVillain from "../components/modali/modaleVillain";
import MostroWidget from "../components/widget/mostroWidget";
import ModaleMostro from "../components/modali/modaleMostro";
import LuogoWidget from "../components/widget/luogoWidget";
import ModaleLuogo from "../components/modali/modaleLuogo";
import ModaleEnigma from "../components/modali/modaleEnigma";
import EnigmaWidget from "../components/widget/enigmaWidget";
import AvventuraWidget from "../components/widget/avventuraWidget";
import AvventuraArchivio from "../components/widget/avventuraArchivio";
import ModaleCompendioOneShot from "../components/modali/modaleCompendioOneShot";
import ModaleCreaCampagna from "../components/modaleCreaCampagna";
import ModaleDettagliCampagna from "../components/modaleDettagliCampagna";
import CampagnaCard from "../components/campagnaCard";
import ModaleOggetti from "../components/gestioneOggetti";
import SuggerimentoDelGiorno from "../components/suggerimentoDelGiorno";
import DiarioNarratore from "../components/diarioNarratore";
import { oneshotPredefinite } from "../data/oneShots/oneShotData";
import { firestore } from "../firebase/firebaseConfig";
import { useDM } from "../context/DMContext";
import "../styles/dashboardDM.css";

function DashboardDM() {
  const { dmId } = useDM();
  const [mostraModaleDiario, setMostraModaleDiario] = useState(false);
  const [campagnaId, setCampagnaId] = useState(null);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [campagna, setCampagna] = useState({
    titolo: "",
    descrizione: "",
    immagine: "",
    idMaster: dmId,
    stato: "bozza",
  });
  const [campagnaSelezionata, setCampagnaSelezionata] = useState(null);
  const [campagnaAttiva, setCampagnaAttiva] = useState(null);
  const [isVillainModalOpen, setIsVillainModalOpen] = useState(false);
  const [villain, setVillain] = useState(null);
  const [showMostroModal, setShowMostroModal] = useState(false);
  const [showLuogoModal, setShowLuogoModal] = useState(false);
  const [showCompendio, setShowCompendio] = useState(false);
  const [oneShotSelezionata, setOneShotSelezionata] = useState(null);
  const [mostraModaleEnigma, setMostraModaleEnigma] = useState(false);
  const [mostraModaleMappa, setMostraModaleMappa] = useState(false);
  const [mostraModaleOggetti, setMostraModaleOggetti] = useState(false);

  const salvaOggettoInCampagna = async (oggetto) => {
  await addDoc(collection(firestore, `campagne/${campagnaId}/oggetti`), oggetto);
  alert(`Oggetto "${oggetto.name}" aggiunto alla campagna`);
};

const avviaSessione = async (oneShot) => {
  const id = await salvaSessioneOneShot(oneShot);
  if (id) navigate(`/live-session/${id}`);
};

const collegaACampagna = (oneShot) => {
  alert(`Collega "${oneShot.titolo}" a una campagna... (in sviluppo)`);
};

useEffect(() => {
  if (mostraModaleMappa) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}, [mostraModaleMappa]);

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
          Strumenti per creare PNG, Villain, Mostri, Enigmi o One-Shot lampo.
        </p>
        </div>
        <div className="dashboard-generatori">
  <PngWidget />
  <VillainWidget villain={villain} onOpen={() => setIsVillainModalOpen(true)} />
  <MostroWidget onClick={() => setShowMostroModal(true)} />
  <LuogoWidget onClick={() => setShowLuogoModal(true)} />
  <EnigmaWidget onClick={() => setMostraModaleEnigma(true)} />
  <AvventuraWidget onApri={() => setShowCompendio(true)} />


</div>
<hr />
{isVillainModalOpen && (
  <ModaleVillain
    onClose={() => setIsVillainModalOpen(false)}
    onSave={(v) => {
      setVillain(v);
      setIsVillainModalOpen(false);
    }}
    villain={villain}
/>
)}
{showMostroModal && <ModaleMostro onClose={() => setShowMostroModal(false)} />}
{showLuogoModal && <ModaleLuogo onClose={() => setShowLuogoModal(false)} />}
{mostraModaleEnigma && <ModaleEnigma onClose={() => setMostraModaleEnigma(false)} />}
{showCompendio && (
  <ModaleCompendioOneShot
    setShowCompendio={setShowCompendio}
    setOneShotSelezionata={setOneShotSelezionata}
    avviaSessione={avviaSessione}
    oneshotPredefinite={oneshotPredefinite}
    collegaACampagna={collegaACampagna}
  />
)}
      </section>

      {/* Recap Sessione */}
      <section className="recap-FRD-section">
      <section className="recap-section">
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

      <section className="FRD-section">
  <h2>📚 Avventure Modulari Salvate</h2>
  <AvventuraArchivio campagnaId={campagnaAttiva?.id || null} />
</section>
</section>

      <hr />

      {/* Widget Mappe */}
      <div className="recap-FRD-section">
        
          <WidgetMappe campagnaAttiva={campagnaAttiva} />
       
        <br />
      <section className="dashboard-section">
  <h2>Gestione Oggetti</h2>
  <p className="section-desc">
    Gestisci gli oggetti della tua campagna, come armi, armature e altri
    equipaggiamenti.
  </p>
      <button onClick={() => setMostraModaleOggetti(true)}>📜 Gestisci Oggetti</button>
</section>
</div>
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

      <hr />



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
      <section className="dashboard-section">
        <h2>📓 Diario del Narratore</h2>
        <p className="section-desc">Appunti sparsi, idee, bozze di trame o colpi di scena.</p>
        <button onClick={() => setMostraModaleDiario(true)}>Aggiungi nota</button>
      </section>
      {mostraModaleDiario && (
        <DiarioNarratore />
      )}

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
