import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import AuthLayout from '../layouts/AuthLayout';
import '../styles/authPage.css';

const avatarList = Array.from({ length: 10 }, (_, i) => `/avatars/avatar${i + 1}.png`);

function generaCodiceArcano() {
  const lettere = Math.random().toString(36).substring(2, 4).toUpperCase();
  const numeri = Math.floor(1000 + Math.random() * 9000);
  return `${lettere}-${numeri}`;
}

const verificaEsistenzaCampo = async (campo, valore) => {
  const ref = collection(db, "utenti");
  const q = query(ref, where(campo, "==", valore));
  const snap = await getDocs(q);
  return !snap.empty;
};

const generaCodiceArcanoUnico = async () => {
  let codice;
  let esiste = true;
  while (esiste) {
    codice = generaCodiceArcano();
    esiste = await verificaEsistenzaCampo("codiceArcano", codice);
  }
  return codice;
};

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [newUserId, setNewUserId] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profilo, setProfilo] = useState({
    nome: '',
    username: '',
    codiceArcano: generaCodiceArcano(),
    avatar: avatarList[0]
  });
  const [usernameEsistente, setUsernameEsistente] = useState(false);
  const [codiceArcanoEsistente, setCodiceArcanoEsistente] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      navigate('/dashboard');
    }
  });
  return () => unsubscribe();
}, [location, navigate]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Form inviato");
  try {
    if (isLogin) {
      console.log("Tentativo di login...");
      await signInWithEmailAndPassword(auth, email, password);
      console.log("✅ Login riuscito!");
    } else {
      console.log("Tentativo di registrazione...");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("✅ Registrazione riuscita!", cred);
    }
  } catch (err) {
    console.error("Errore login:", err.message);
    setError(err.message);
  }
};

  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (profilo.username.length >= 3) {
      verificaEsistenzaCampo("username", profilo.username).then(setUsernameEsistente);
    }
  }, 400);

  return () => clearTimeout(delayDebounce);
}, [profilo.username]);

  const salvaProfiloUtente = async () => {
    if (!profilo.nome || !profilo.username) {
      setError("Completa tutti i campi del profilo.");
      return;
    }
    try {
      await setDoc(doc(db, "utenti", newUserId), {
        ...profilo,
        email,
        createdAt: new Date().toISOString()
      });
      setShowProfileModal(false);
      navigate("/dashboard");
    } catch (err) {
      setError("Errore salvataggio profilo: " + err.message);
    }
  };
console.log("🧪 AuthPage montato");
  return (
    <AuthLayout>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Password</label>
        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-button">
          {isLogin ? 'Accedi' : 'Registrati'}
        </button>

        <p className="auth-toggle">
          {isLogin ? 'Non hai un account?' : 'Hai già un account?'}
          <span onClick={toggleMode}>{isLogin ? ' Registrati' : ' Accedi'}</span>
        </p>
      </form>

      {showProfileModal && (
        <div className="modale-overlay">
          <div className="modale-profilo">
            <h2>🎭 Crea il tuo profilo</h2>

            <input
              placeholder="Nome e Cognome"
              value={profilo.nome}
              onChange={(e) => setProfilo({ ...profilo, nome: e.target.value })}
            />

            <input
              placeholder="Username pubblico"
              value={profilo.username}
              onChange={(e) => setProfilo({ ...profilo, username: e.target.value })}
            />
            {usernameEsistente && (
              <p style={{ color: 'crimson', fontSize: '0.85rem' }}>
                ⚠️ Questo username è già in uso
              </p>
            )}

            <input
              value={profilo.codiceArcano}
              disabled
              style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
            />

            <p style={{ marginTop: '1rem', color: '#ccc' }}>Scegli un avatar:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
              {avatarList.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`avatar${i + 1}`}
                  onClick={() => setProfilo({ ...profilo, avatar: url })}
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    border: profilo.avatar === url ? '2px solid #D4AF37' : '2px solid transparent',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </div>

            <button
              className="auth-button"
              disabled={!profilo.nome || !profilo.username || usernameEsistente}
              onClick={salvaProfiloUtente}
            >
              Salva Profilo
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

export default AuthPage;
