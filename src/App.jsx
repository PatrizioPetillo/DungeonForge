import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'react-tooltip/dist/react-tooltip.css';
import AuthPage from './pages/authPage';
import DashboardDM from './pages/dashboardDM';
import ModaleCreaCampagna from './components/modaleCreaCampagna';
import CampagnaCard from './components/campagnaCard';
import SuggerimentoDelGiorno from './components/suggerimentodelGiorno';
import ModaleDettagliCampagna from './components/modaleDettagliCampagna';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<DashboardDM />} />
        <Route path="/campagna/:id" element={<ModaleDettagliCampagna />} />
        <Route path="/crea-campagna" element={<ModaleCreaCampagna />} />
        <Route path="/campagna-card" element={<CampagnaCard />} />
        <Route path="/suggerimento-del-giorno" element={<SuggerimentoDelGiorno />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
