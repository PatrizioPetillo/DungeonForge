import { firestore } from "../firebase/firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";

// ✅ 1. CREA CAMPAGNA
export async function creaCampagna(dati) {
  try {
    const colRef = collection(firestore, "campagne");
    const docRef = await addDoc(colRef, {
      ...dati,
      creatoIl: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Errore creazione campagna:", error);
    return { success: false, error };
  }
}

// ✅ 2. OTTIENI TUTTE LE CAMPAGNE
export async function getCampagne() {
  try {
    const snapshot = await getDocs(collection(firestore, "campagne"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Errore getCampagne:", error);
    return [];
  }
}

// ✅ 3. CREA CAPITOLO
export async function creaCapitolo(idCampagna, dati) {
  try {
    const colRef = collection(firestore, "campagne", idCampagna, "capitoli");
    const docRef = await addDoc(colRef, {
      ...dati,
      creatoIl: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Errore creazione capitolo:", error);
    return { success: false, error };
  }
}

// ✅ 4. OTTIENI CAPITOLI
export async function getCapitoli(idCampagna) {
  try {
    const colRef = collection(firestore, "campagne", idCampagna, "capitoli");
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Errore getCapitoli:", error);
    return [];
  }
}

// ✅ 5. CREA SCENA
export async function creaScena(idCampagna, idCapitolo, dati) {
  try {
    const colRef = collection(
      firestore,
      "campagne",
      idCampagna,
      "capitoli",
      idCapitolo,
      "scene"
    );
    const docRef = await addDoc(colRef, {
      ...dati,
      elementi: [],
      creatoIl: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Errore creazione scena:", error);
    return { success: false, error };
  }
}

// ✅ 6. OTTIENI SCENE
export async function getScene(idCampagna, idCapitolo) {
  try {
    const colRef = collection(
      firestore,
      "campagne",
      idCampagna,
      "capitoli",
      idCapitolo,
      "scene"
    );
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Errore getScene:", error);
    return [];
  }
}

// ✅ 7. COLLEGA ELEMENTO (Villain, PNG, Mostro, Luogo)
export async function collegaElementoACampagna(
  idCampagna,
  idCapitolo,
  idScena,
  elemento
) {
  try {
    const scenaRef = doc(
      firestore,
      "campagne",
      idCampagna,
      "capitoli",
      idCapitolo,
      "scene",
      idScena
    );
    await updateDoc(scenaRef, {
      elementi: arrayUnion(elemento), // { id, tipo }
    });
    return { success: true };
  } catch (error) {
    console.error("Errore collegamento elemento:", error);
    return { success: false, error };
  }
}
