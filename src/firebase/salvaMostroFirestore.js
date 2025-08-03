import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export async function salvaMostroFirestore(mostro) {
  try {
    const id = mostro.id || crypto.randomUUID();
    await setDoc(doc(db, "archivio/mostri", id), { ...mostro, id });
    console.log("Mostro salvato:", mostro.nome);
  } catch (error) {
    console.error("Errore salvataggio Mostro:", error);
  }
}
