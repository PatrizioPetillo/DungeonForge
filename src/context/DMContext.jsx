import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

// Crea il contesto
export const DMContext = createContext();

// Hook personalizzato
export const useDM = () => useContext(DMContext);

// Provider del contesto
export const DMProvider = ({ children }) => {
  const [dm, setDM] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (utente) => {
      if (utente) {
        const ref = doc(db, "utenti", utente.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setDM({ uid: utente.uid, ...snap.data() });
        } else {
          // fallback solo UID
          setDM({ uid: utente.uid });
        }
      } else {
        setDM(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <DMContext.Provider value={{ dm, dmId: dm?.uid, loading }}>
      {children}
    </DMContext.Provider>
  );
};
