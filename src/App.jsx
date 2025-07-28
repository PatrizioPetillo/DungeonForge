import { BrowserRouter, Routes, Route } from 'react-router-dom';
import packageJson from '../package.json';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthPage from './pages/authPage';
import DashboardDM from './pages/dashboardDM';
import ModaleCreaCampagna from './components/modaleCreaCampagna';
import CampagnaCard from './components/campagnaCard';
import SuggerimentoDelGiorno from './components/suggerimentoDelGiorno';
import ModaleDettagliCampagna from './components/modaleDettagliCampagna';
import ModaleDettaglioArchivio from './components/modali/modaleDettaglioArchivio';
import ArchivioSezione from './components/archivioSezione';
import Archivio from './pages/archivio';
import CardElemento from './components/cardElemento';
import LiveSessionDM from './pages/liveSessionDM';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/live-session/:id" element={<LiveSessionDM />} />
        <Route path="/dashboard" element={<DashboardDM />} />
        <Route path="/campagna/:id" element={<ModaleDettagliCampagna />} />
        <Route path="/crea-campagna" element={<ModaleCreaCampagna />} />
        <Route path="/campagna-card" element={<CampagnaCard />} />
        <Route path="/archivio" element={<Archivio />} />
        <Route path="/modale-dettaglio-archivio" element={<ModaleDettaglioArchivio />} />
        <Route path="/card-elemento" element={<CardElemento />} />
        <Route path="/archivio-sezione" element={<ArchivioSezione />} />
        <Route path="/suggerimento-del-giorno" element={<SuggerimentoDelGiorno />} />
      </Routes>
      <footer>
        <small>Versione: {packageJson.version}</small>
      </footer>
      <ToastContainer 
  position="bottom-center" // 👈 più visibile
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>
    </BrowserRouter>
  );
}

export default App;
