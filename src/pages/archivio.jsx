import React, { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { firestore } from "../firebase/firebaseConfig";
import ArchivioSezione from "../components/ArchivioSezione";
import "../styles/Archivio.css";

const Archivio = () => {
  const [png, setPng] = useState([]);
  const [villain, setVillain] = useState([]);
  const [mostri, setMostri] = useState([]);
  const [luoghi, setLuoghi] = useState([]);
  const [enigmi, setEnigmi] = useState([]);

  useEffect(() => {
    const fetchArchivio = async () => {
      const [pngSnap, villainSnap, mostriSnap, luoghiSnap, enigmiSnap] = await Promise.all([
        getDocs(collection(firestore, "archivio/png")),
        getDocs(collection(firestore, "archivio/villain")),
        getDocs(collection(firestore, "archivio/mostri")),
        getDocs(collection(firestore, "archivio/luoghi")),
        getDocs(collection(firestore, "archivio/enigmi")),
      ]);

      setPng(pngSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setVillain(villainSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setMostri(mostriSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLuoghi(luoghiSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      setEnigmi(enigmiSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    };

    fetchArchivio();
  }, []);

  return (
    <div className="pagina-archivio">
      <button className="btn-back" onClick={() => window.history.back()}>⬅ Torna nell'Antro</button>
      <h1>Archivio Globale</h1>
      <ArchivioSezione titolo="PNG Comuni" dati={png.filter(p => p.tipo === "comune")} categoria="png" />
        <hr className="archivio" />
      <ArchivioSezione titolo="PNG Non Comuni" dati={png.filter(p => p.tipo === "non_comune")} categoria="png" />
      <hr className="archivio" />
      <ArchivioSezione titolo="Villain" dati={villain} categoria="villain" />
      <hr className="archivio" />
      <ArchivioSezione titolo="Mostri" dati={mostri} categoria="mostri" />
      <hr className="archivio" />
      <ArchivioSezione titolo="Luoghi" dati={luoghi} categoria="luoghi" />
      <hr className="archivio" />
      <ArchivioSezione titolo="Enigmi" dati={enigmi} categoria="enigmi" />
    </div>
  );
};

export default Archivio;
