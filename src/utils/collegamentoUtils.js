import { collection, getDocs, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";

/**
 * Ottiene tutte le campagne salvate
 */
export async function getCampagne() {
  const snapshot = await getDocs(collection(firestore, "campagne"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

/**
 * Collega un elemento (villain/png/mostro/luogo) a una scena specifica
 * @param {string} idCampagna 
 * @param {string} idCapitolo 
 * @param {string} idScena 
 * @param {object} elemento { id, tipo }
 */
export async function collegaElementoACampagna(idCampagna, idCapitolo, idScena, elemento) {
  const scenaRef = doc(firestore, "campagne", idCampagna, "capitoli", idCapitolo, "scene", idScena);
  await updateDoc(scenaRef, {
    elementi: arrayUnion(elemento)
  });
}
