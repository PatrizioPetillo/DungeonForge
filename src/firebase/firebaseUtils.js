import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();

export async function salvaInArchivio(dati, tipo) {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Utente non autenticato");

  const ref = collection(db, `users/${user.uid}/${tipo}`);
  const payload = {
    ...dati,
    creatoIl: serverTimestamp(),
    creatoDa: user.uid
  };

  await addDoc(ref, payload);
}
