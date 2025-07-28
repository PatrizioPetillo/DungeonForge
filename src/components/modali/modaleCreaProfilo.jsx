import React, { useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import './modaleProfilo.css';

function ModaleCreaProfilo({ uid, onClose }) {
  const [nome, setNome] = useState('');
  const [avatar, setAvatar] = useState('');
  const [ruolo, setRuolo] = useState('Dungeon Master');

  const salvaProfilo = async () => {
    await setDoc(doc(db, "utenti", uid), {
      nome,
      avatar,
      ruolo,
      createdAt: new Date().toISOString()
    });
    onClose(); // chiude modale dopo salvataggio
  };

  return (
    <div className="modale-overlay">
      <div className="modale-profilo">
        <h2>🎭 Crea il tuo profilo</h2>
        <input placeholder="Nome del DM" value={nome} onChange={e => setNome(e.target.value)} />
        <input placeholder="URL Avatar (opzionale)" value={avatar} onChange={e => setAvatar(e.target.value)} />
        <button onClick={salvaProfilo}>Salva Profilo</button>
      </div>
    </div>
  );
}

export default ModaleCreaProfilo;
