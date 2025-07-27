import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
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
/**
 * Elimina un elemento dall'archivio Firestore.
 * @param {string} tipo - Es. "villain", "png", "mostri", "luoghi".
 * @param {string} id - ID del documento Firestore.
 */

export const eliminaDaArchivio = async (tipo, id) => {
  try {
    await deleteDoc(doc(firestore, `archivio/${tipo}/${id}`));
    return { success: true };
  } catch (err) {
    console.error("Errore eliminazione archivio:", err);
    return { success: false, error: err };
  }
};
