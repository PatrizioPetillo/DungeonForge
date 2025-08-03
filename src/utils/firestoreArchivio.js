import { collection, doc, setDoc, deleteDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";

function rimuoviUndefined(obj) {
  if (Array.isArray(obj)) {
    return obj.map(rimuoviUndefined);
  } else if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = rimuoviUndefined(value);
      }
      return acc;
    }, {});
  }
  return obj;
}

export async function salvaInArchivio(tipo, dato) {
  try {
    const id = dato.id || crypto.randomUUID();
    const colRef = collection(firestore, tipo);
    const docRef = doc(colRef, id);

    const datoPulito = rimuoviUndefined({
      ...dato,
      id,
      creatoIl: new Date().toISOString()
    });

    await setDoc(docRef, datoPulito);

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
