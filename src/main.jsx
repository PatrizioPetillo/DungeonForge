import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css';
import App from './App.jsx'
import { DMProvider } from "./context/DMContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DMProvider>
      <App />
    </DMProvider>
  </StrictMode>,
)
 if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service Worker registrato"))
    .catch((err) => console.error("Errore SW:", err));
}
