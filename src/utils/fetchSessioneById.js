
import { db } from "../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// Recupera una sessione da Firestore tramite ID
export const fetchSessioneById = async (id) => {
  try {
    const docRef = doc(db, "sessioni", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id, ...docSnap.data() };
    } else {
      console.warn("Nessuna sessione trovata con ID:", id);
      return null;
    }
  } catch (error) {
    console.error("Errore nel recupero sessione:", error);
    return null;
  }
};
