import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";

export async function salvaInArchivio(tipo, dato) {
  try {
    const id = dato.id || crypto.randomUUID();
    const colRef = collection(firestore, tipo); // ✅ villain, png, mostro, luogo
    const docRef = doc(colRef, id);

    await setDoc(docRef, {
      ...dato,
      id,
      creatoIl: new Date().toISOString()
    });

    return { success: true, id };
  } catch (error) {
    console.error(`Errore salvataggio archivio [${tipo}]:`, error);
    return { success: false, error };
  }
}
