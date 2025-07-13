import { db } from "./firebaseConfig"; // o percorso corretto del tuo file Firebase
import { collection, addDoc, Timestamp } from "firebase/firestore";

export const salvaPNGFirestore = async (png) => {
  try {
    const docRef = await addDoc(collection(db, "png"), {
      ...png,
      creatoIl: Timestamp.now(),
    });
    console.log("PNG salvato con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Errore salvataggio PNG:", error);
  }
};
