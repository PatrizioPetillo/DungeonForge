import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";

export async function salvaInArchivio(tipo, dato) {
  try {
    const id = dato.id || crypto.randomUUID();
    await setDoc(doc(firestore, `archivio/${tipo}`, id), {
      ...dato,
      id,
      creatoIl: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error(`Errore salvataggio archivio [${tipo}]:`, error);
    return false;
  }
}
