import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";

const getDiarioRef = (dmId) => collection(db, "utenti", dmId, "diario");

export const aggiungiNotaDiario = async (dmId, contenuto) => {
  const ref = getDiarioRef(dmId);
  return await addDoc(ref, {
    contenuto,
    timestamp: new Date().toISOString(),
    autore: dmId
  });
};

export const recuperaNoteDiario = async (dmId) => {
  const ref = getDiarioRef(dmId);
  const snapshot = await getDocs(query(ref, orderBy("timestamp", "desc")));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const eliminaNotaDiario = async (dmId, notaId) => {
  const ref = doc(db, "utenti", dmId, "diario", notaId);
  await deleteDoc(ref);
};
