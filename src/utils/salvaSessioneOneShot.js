
import { db } from "../firebase/firebaseConfig";
import { collection, addDoc, doc, serverTimestamp } from "firebase/firestore";

// Salva una sessione one-shot come documento singolo
export const salvaSessioneOneShot = async (oneShot) => {
  try {
    const sessione = {
      titolo: oneShot.titolo,
      tipo: "predefinita",
      iniziataIl: serverTimestamp(),
      campagna: oneShot
    };

    // Salva la sessione principale
    const docRef = await addDoc(collection(db, "sessioni"), sessione);

    // Salva un log iniziale
    const logRef = collection(db, "sessioni", docRef.id, "log");
    await addDoc(logRef, {
      messaggio: `📖 Iniziata la one-shot "${oneShot.titolo}"`,
      tipo: "INFO",
      timestamp: serverTimestamp()
    });

    return docRef.id;
  } catch (error) {
    console.error("Errore nel salvataggio della sessione:", error);
    return null;
  }
};
