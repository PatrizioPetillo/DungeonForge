import { db } from "./firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export async function salvaVillainFirestore(villain) {
  try {
    const id = villain.id || crypto.randomUUID();
    await setDoc(doc(db, "archivio/villain", id), { ...villain, id });
    console.log("Villain salvato:", villain.nome);
  } catch (error) {
    console.error("Errore salvataggio Villain:", error);
  }
}
