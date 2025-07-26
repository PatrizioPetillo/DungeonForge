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
  const [collegamenti, setCollegamenti] = useState({});
  const [filtro, setFiltro] = useState("tutti");
const [searchTerm, setSearchTerm] = useState("");
const [filtroTipoPNG, setFiltroTipoPNG] = useState("");

const filtraDati = (lista, tipoCategoria = null) => {
  return lista.filter((item) => {
    const nome = (item.nome || item.titolo || "").toLowerCase();
    const matchSearch = nome.includes(searchTerm.toLowerCase());

    const isCollegato = collegamenti[item.id] !== undefined;
    if (filtro === "collegati" && !isCollegato) return false;
    if (filtro === "non-collegati" && isCollegato) return false;

    if (tipoCategoria === "png" && filtroTipoPNG && item.tipo !== filtroTipoPNG) return false;

    return matchSearch;
  });
};

const caricaCollegamenti = async () => {
  const map = {};
  const campagneSnap = await getDocs(collection(firestore, "campagne"));
  for (const campagnaDoc of campagneSnap.docs) {
    const capitoliSnap = await getDocs(collection(firestore, `campagne/${campagnaDoc.id}/capitoli`));
    for (const capDoc of capitoliSnap.docs) {
      const sceneSnap = await getDocs(collection(firestore, `campagne/${campagnaDoc.id}/capitoli/${capDoc.id}/scene`));
      for (const scenaDoc of sceneSnap.docs) {
        const scenaData = scenaDoc.data();
        const collegamentiRef = collection(firestore, `campagne/${campagnaDoc.id}/capitoli/${capDoc.id}/scene/${scenaDoc.id}/collegamenti`);
        const tipiSnap = await getDocs(collegamentiRef);
        for (const tipoDoc of tipiSnap.docs) {
          const tipo = tipoDoc.id; // villain, png, ecc.
          const entitaSnap = await getDocs(collection(firestore, collegamentiRef.path + `/${tipo}`));
          for (const entitaDoc of entitaSnap.docs) {
            map[entitaDoc.id] = {
              campagna: campagnaDoc.data().nome,
              capitolo: capDoc.data().titolo,
              scena: scenaData.titolo
            };
          }
        }
      }
    }
  }
  setCollegamenti(map);
};

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
    caricaCollegamenti();
  }, []);

  return (
    <div className="pagina-archivio">
      <button className="btn-back" onClick={() => window.history.back()}>⬅ Torna nell'Antro</button>
      <div className="archivio-filters">
  <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
    <option value="tutti">Tutti</option>
    <option value="collegati">Solo collegati</option>
    <option value="non-collegati">Solo non collegati</option>
  </select>

  <input
    type="text"
    placeholder="Cerca per nome..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
</div>
<hr />
      <h1>Archivio Globale</h1>
      <div className="filtro-tipo-png">
  <label>Filtra PNG:</label>
  <select value={filtroTipoPNG} onChange={(e) => setFiltroTipoPNG(e.target.value)}>
    <option value="">Tutti</option>
    <option value="Comune">Comuni</option>
    <option value="Non Comune">Non Comuni</option>
  </select>
</div>

      <ArchivioSezione
  titolo="Villain"
  dati={filtraDati(villain)}
  categoria="villain"
  collegamenti={collegamenti}
/>
        <hr className="archivio" />
      <ArchivioSezione titolo="PNG" dati={filtraDati(png, "png")} categoria="png" collegamenti={collegamenti} />
      <hr className="archivio" />
      <ArchivioSezione titolo="Mostri" dati={filtraDati(mostri)} categoria="mostri" collegamenti={collegamenti} />
      <hr className="archivio" />
      <ArchivioSezione titolo="Luoghi" dati={filtraDati(luoghi)} categoria="luoghi" collegamenti={collegamenti} />
      <hr className="archivio" />
      <ArchivioSezione titolo="Enigmi" dati={filtraDati(enigmi)} categoria="enigmi" collegamenti={collegamenti} />
      <br />
      <ModaleDettaglioArchivio
        id={selectedId}
        tipo={selectedTipo}
        onClose={() => setShowModal(false)}
        onCollega={(entita) => handleCollegaAScena(entita)}
      />
      <br />
      <p className="note-archivio">
        Nota: Puoi salvare nuovi elementi nell'archivio tramite i modali di creazione (es. ModaleMostro, ModaleVillain, ecc.).
      </p>
    </div>
  );
};

export default Archivio;
