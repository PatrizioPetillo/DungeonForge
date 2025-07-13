// src/components/generatori/generatorePNG.jsx
import React, { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import { auth, db } from "../../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fetchBackgroundList, fetchBackgroundDetails } from "../../utils/pngBackground";
import { useSpellcastingInfo } from "../../utils/useSpellcastingInfo";
import { tiraStats, calcolaModificatori } from "../../utils/statUtils";
import "../../styles/generatorePNG.css";

const nomi = [
  "Gundra",
  "Tholrin",
  "Zargax",
  "Velra",
  "Marn",
  "Sybilla",
  "Durnok",
  "Kallista",
  "Brom",
  "Fendrel",
  "Lirael",
  "Torgar",
  "Eldrin",
  "Vespera",
  "Zyra",
];
const soprannomi = [
  "Dita Veloci",
  "il Rospo",
  "Sputafuoco",
  "Mano Gelida",
  "la Voce",
  "Tagliaossa",
  "Occhio di Falco",
  "la Furia",
  "il Saggio",
  "la Mente",
  "il Fantasma",
  "il Lupo Solitario",
  "la Serpe",
  "il Drago di Pietra",
  "la Tempesta",
];
const razze = [
  "Umano",
  "Nano",
  "Elfo",
  "Halfling",
  "Coboldo",
  "Tiefling",
  "Dragonide",
  "Mezzelfo",
  "Gnomo",
  "Goblin",
  "Mezzorco",
  "Aarakocra",
  "Goliath",
  "Tabaxi",
  "Firbolg",
];
const carattere = [
  // Personalità positive
  "Ha uno spirito incrollabile e una gentilezza contagiosa.",
  "Parla poco, ma osserva ogni dettaglio con attenzione acuta.",
  "Sempre pronto ad aiutare, anche a rischio della propria vita.",
  "Ama raccontare storie, anche se spesso sono esagerate.",
  "Affronta le sfide con un sorriso e una battuta pronta.",
  "È un saggio consigliere, con parole misurate e sguardo profondo.",
  "Riesce a mettere tutti a proprio agio, anche nelle situazioni più tese.",
  "Porta sempre con sé una piccola campanella portafortuna che agita nei momenti di ansia.",

  // Personalità ambigue o misteriose
  "È enigmatico, con uno sguardo che sembra sapere più di quanto dica.",
  "Parla in modo criptico e raramente guarda negli occhi.",
  "Sembra conoscere segreti che non dovrebbe sapere.",
  "Ha un modo affettato di parlare, ma nasconde qualcosa dietro quel sorriso.",
  "Spesso perde lo sguardo nel vuoto, come se vedesse un altro mondo.",
  "È ossessionato da simboli e rituali dimenticati.",

  // Personalità negative o ostili
  "È brusco e cinico, ma efficiente e diretto.",
  "Diffida di tutti, anche dei suoi stessi alleati.",
  "Ama il controllo e mal tollera chi lo mette in discussione.",
  "Ha una risata aspra e uno sguardo che mette a disagio.",
  "Parla con disprezzo degli altri e vanta imprese dubbie.",
  "Ha mani nervose e tic improvvisi, segno di un passato tormentato.",

  // Personalità eccentriche o uniche
  "Parla con animali immaginari e li ascolta con attenzione.",
  "Colleziona bottoni, e ogni bottone ha una storia strana.",
  "Ha paura delle parole lunghe, ed evita chi le usa.",
  "Ha giurato fedeltà a una roccia che porta sempre con sé.",
  "Ama cucinare piatti assurdi che nessuno vuole mangiare.",
  "Cambia accento ogni volta che parla con qualcuno nuovo.",

  // Eroiche e drammatiche
  "Vive con un senso tragico del destino, come se ogni parola potesse essere l'ultima.",
  "Ha un codice d'onore personale che segue fino alle estreme conseguenze.",
  "È alla ricerca di redenzione per un peccato che non vuole nominare.",
  "Protegge i deboli con una furia che nasconde un dolore profondo.",
  "Porta i segni della guerra non solo nel corpo, ma nello sguardo.",
];

const ticEGesti = [
  "Tamburella le dita su ogni superficie liscia che incontra.",
  "Sospira rumorosamente prima di iniziare a parlare.",
  "Si gratta il mento anche quando non ha barba.",
  "Arrotola una ciocca di capelli tra le dita quando è nervoso.",
  "Ride sommessamente nei momenti meno opportuni.",
  "Sbattere spesso le palpebre quando è sotto pressione.",
  "Tocca continuamente un ciondolo o amuleto al collo.",
  "Si schiarisce la voce prima di ogni frase importante.",
  "Tiene le mani dietro la schiena come un ufficiale.",
  "Fa roteare un coltello o un oggetto ogni volta che si annoia.",
  "Mastica erba secca o uno stuzzicadenti anche durante le conversazioni serie.",
  "Strofina i pollici contro le falangi in modo ritmico.",
  "Si gratta sempre lo stesso punto sulla spalla.",
  "Emette piccoli fischi inconsciamente mentre cammina.",
  "Sbuffa o alza gli occhi al cielo con esagerazione.",
  "Si aggiusta il cappuccio o il colletto anche se è già a posto.",
  "Tiene sempre in bocca un rametto, una piuma o una foglia.",
  "Ripete l’ultima parola di chi ha appena parlato, sottovoce.",
  "Batte il piede destro a terra ogni volta che è impaziente.",
  "Conta con le dita quando è pensieroso.",
  "Scruta il cielo ogni pochi minuti, come in attesa di un segno.",
  "Afferra la propria arma ogni volta che qualcuno lo fissa troppo a lungo.",
  "Tende a parlare ai propri oggetti come fossero vivi.",
  "Tiene il pollice in tasca come portafortuna.",
];

const mestieri = [
  "Locandiere",
  "Erborista",
  "Ladro",
  "Mercante",
  "Cacciatore",
  "Bibliotecario",
  "Necromante",
  "Alchimista",
  "Guardia del Corpo",
  "Cacciatore di Taglie",
  "Bardo Errante",
  "Mago Errante",
  "Stregone Errante",
];
const aggettivi = [
  "alto",
  "magro",
  "cicatrice sul volto",
  "occhi vispi",
  "capelli spettinati",
  "voce roca",
  "sguardo inquietante",
];
const frasiTipiche = [
  "Nessuno entra senza pagare!",
  "Ti conviene non guardarmi così...",
  "Ho visto cose che farebbero impallidire un drago.",
  "Conosco posti che farebbero impallidire anche un diavolo.",
  "Ah, la gioventù... tutta muscoli e niente cervello.",
  "Non ho tempo per le chiacchiere, ho affari da sbrigare.",
  "Non mi interessa il tuo passato, ma il tuo denaro sì.",
  "Hai bisogno di qualcosa? O sei solo qui per perdere tempo?",
  "Non fidarti di nessuno, nemmeno di me.",
  "La vita è dura, ma io sono più duro.",
  "Non sono qui per fare amicizia, ma per fare affari.",
  "Hai portato il pagamento, vero?",
  "Questa? Non è *quella* pozione. Credo.",
];
const pregi = [
  "Onesto",
  "Coraggioso",
  "Empatico",
  "Leale con gli amici",
  "Disciplinato",
  "Intelligente",
  "Astuto",
];
const difetti = [
  "Avido",
  "Impulsivo",
  "Paranoico",
  "Arrogante",
  "Pessimista",
  "Disonesto",
  "Eccessivamente diffidente",
];
const ideali = [
  "La libertà è tutto",
  "Il sapere è potere",
  "Il denaro apre tutte le porte",
  "La forza governa",
  "Nulla è più importante della famiglia",
  "La giustizia deve prevalere",
  "La conoscenza è la vera ricchezza",
];
const legami = [
  "Un fratello perduto",
  "Un debito verso un vecchio maestro",
  "Un giuramento mai infranto",
  "La Gilda dei Ladri",
  "Un vecchio drago",
  "Un amore perduto",
  "Un segreto oscuro",
  "Un tesoro nascosto",
  "Un amico fidato",
  "Una maledizione da spezzare",
];
const noteDM = [
  "Potrebbe essere un contatto della Gilda",
  "Conosce il luogo di un obelisco dimenticato",
  "Nasconde un oggetto maledetto",
  "È inseguito da cacciatori di taglie",
  "È l’ultimo sopravvissuto di un culto proibito",
  "Ha un passato oscuro legato a un antico artefatto",
  "È in debito con un potente mago",
  "Ha un segreto che potrebbe cambiare le sorti della campagna",
  "È il custode di un antico tomo magico",
  "Conosce un rituale dimenticato",
  "È il discendente di un eroe leggendario",
];

const formatKey = (str) =>
  str
    .toLowerCase()
    .replace(/ /g, "_")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getPortraitPath = (razza, mestiere) =>
  `/png_avatars/${formatKey(razza)}_${formatKey(mestiere)}.jpg`;

export default function GeneratorePNG() {
  const [pngGenerato, setPngGenerato] = useState({});
  const [pngNonComune, setPngNonComune] = useState(false);
  const [backgrounds, setBackgrounds] = useState([]);
  const [png, setPng] = useState({});
  const [relazioni, setRelazioni] = useState([]);
  const [tuttiPNG, setTuttiPNG] = useState([]);
  const [capitoli, setCapitoli] = useState([]);
  const [capitoliDisponibili, setCapitoliDisponibili] = useState([]);
  const [capitoloAssociato, setCapitoloAssociato] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [immagine, setImmagine] = useState(null);
  const [focusArcano, setFocusArcano] = useState("");
  const [classeSelezionata, setClasseSelezionata] = useState("");
  const [livelloSelezionato, setLivelloSelezionato] = useState(1);
  const [classiDisponibili, setClassiDisponibili] = useState([]);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [backgroundDetails, setBackgroundDetails] = useState(null);
  const [noteSegrete, setNoteSegrete] = useState("");

  useEffect(() => {
    fetch("https://www.dnd5eapi.co/api/classes")
      .then((res) => res.json())
      .then((data) => setClassiDisponibili(data.results));

    fetchBackgroundList().then(setBackgrounds);
  }, []);

  useEffect(() => {
    setPng(generaPNG());
  }, [pngNonComune]);

  const roll = (array) => array[Math.floor(Math.random() * array.length)];
  const getRandomAspetto = () => [
    roll(aggettivi),
    roll(aggettivi),
    roll(aggettivi),
  ];

  const generaPNG = () => {
    const nome = `${roll(nomi)} "${roll(soprannomi)}"`;
    const razza = roll(razze);
    const mestiere = roll(mestieri);
    const aspetto = getRandomAspetto();
    const tratto = {
      pregio: roll(pregi),
      difetto: roll(difetti),
      ideale: roll(ideali),
      legame: roll(legami),
    };
    const carattereCasuale = carattere[Math.floor(Math.random() * carattere.length)];
    const descrizione = `${carattereCasuale} ${aspetto.join(", ")}. ${roll(ticEGesti)}`;

    const ticCasuale = ticEGesti[Math.floor(Math.random() * ticEGesti.length)];

    if (!pngNonComune) {
      return {
        nome,
        razza,
        mestiere,
        tratto,
        descrizione,
        tic: ticCasuale,
        frase: roll(frasiTipiche),
        nota: roll(noteDM),
        ritratto: getPortraitPath(razza, mestiere),
        tipo: "Comune",
      };
    }

    const stats = tiraStats();
    const statMod = calcolaModificatori(stats);
    const proficiencyBonus = Math.ceil(livelloSelezionato / 4) + 1;

    return {
      nome,
      razza,
      mestiere,
      tipo: "Non Comune",
      classe: classeSelezionata,
      livello: livelloSelezionato,
      tratto,
      stats,
      statMod,
      proficiencyBonus,
      descrizione,
      frase: roll(frasiTipiche),
      nota: roll(noteDM),
      ritratto: getPortraitPath(razza, mestiere),
      background: backgroundDetails,
    };
  };

  const handleGenera = async () => {
    const nuovo = generaPNG(pngNonComune);
    setPngGenerato(nuovo);
  };

  async function handleFileUpload(e) {
    const file = e.target.files[0];
    const storageRef = ref(
      getStorage(),
      `avatars/${auth.currentUser.uid}/${file.name}`
    );
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setPng((p) => ({ ...p, avatarUrl: url }));
  }

  const handleRelazioni = (e) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value);
    setRelazioni(selected);
  };

  const salvaPNG = async () => {
    const doc = {
      ...pngGenerato,
      tipo: pngNonComune ? "Non Comune" : "Comune",
      incantesimi: pngGenerato.incantesimi || [],
      relazioni,
      capitoloAssociato,
      noteSegrete,
      isFavorite,
      immagine: immagine || null,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, "pngArchivio"), doc);
    alert("PNG salvato con successo!");
  };

  const handleBackgroundChange = async (e) => {
    const value = e.target.value;
    setSelectedBackground(value);
    const details = await fetchBackgroundDetails(value);
    setBackgroundDetails(details);
  };

  const {
    isMagical,
    spellcastingAbility,
    cdIncantesimi,
    bonusAttaccoIncantesimi,
    slots,
  } = useSpellcastingInfo(
    png.classe,
    png.livello,
    png.statMod,
    png.proficiencyBonus
  );

  return (
    <div className="generatore-png">
      <h3>🧑‍🎨 PNG Generato</h3>
      <hr />
      <p>
        <strong>Nome:</strong> {png.nome}
      </p>
      <img
        src={png.ritratto}
        alt="Ritratto"
        style={{ width: 120, height: 120 }}
      />
      <input type="file" onChange={handleFileUpload} />

      <p>
        <strong>Razza:</strong> {png.razza}
      </p>
      <p>
        <strong>Mestiere:</strong> {png.mestiere}
      </p>

      <button onClick={() => togglePreferito(png.id)}>
        {png.isFavorite ? "★ Rimuovi preferito" : "☆ Aggiungi preferito"}
      </button>

      {pngNonComune && (
        <>
          <label>Classe:</label>
          <select
            value={classeSelezionata}
            onChange={(e) => setClasseSelezionata(e.target.value)}
          >
            <option value="">-- Classe --</option>
            {classiDisponibili.map((cls) => (
              <option key={cls.index} value={cls.index}>
                {cls.name}
              </option>
            ))}
          </select>

          <label>Livello:</label>
          <select
            value={livelloSelezionato}
            onChange={(e) => setLivelloSelezionato(Number(e.target.value))}
          >
            {[...Array(20)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>

          <h4>📊 Caratteristiche</h4>
          <ul>
            {png.stats?.map((val, i) => (
              <li key={i}>
                {["FOR", "DES", "COS", "INT", "SAG", "CAR"][i]}: {val} (
                {png.statMod?.[["str", "des", "cos", "int", "sag", "car"][i]]})
              </li>
            ))}
          </ul>

          {isMagical && (
            <div>
              <h4>✨ Magia</h4>
              <p>CD Incantesimi: {cdIncantesimi}</p>
              <p>Bonus Attacco: +{bonusAttaccoIncantesimi}</p>
              <p>Focus Arcano: {focusArcano}</p>
              <p>
                Slot:{" "}
                {slots
                  .map((s, i) => s > 0 && `Lv${i + 1}: ${s}`)
                  .filter(Boolean)
                  .join(" | ")}
              </p>
              <p>Abilità Magica: {spellcastingAbility}</p>
              <hr />
              <h4>📜 Incantesimi</h4>
              {png.incantesimi?.map((spell) => (
                <span key={spell.index}>
                  <span
                    data-tooltip-id={`spell-${spell.index}`}
                    data-tooltip-content={
                      `Scuola: ${spell.school.name}\n` +
                      `Gittata: ${spell.range}\n` +
                      `Componenti: ${spell.components.join(", ")}\n` +
                      `Durata: ${spell.duration}`
                    }
                    style={{ textDecoration: "underline", cursor: "help" }}
                  >
                    {spell.name}
                  </span>
                  <Tooltip id={`spell-${spell.index}`} />{" "}
                </span>
              ))}
            </div>
          )}

          <div>
            <h4>🎒 Background</h4>
            <select
              value={selectedBackground || ""}
              onChange={handleBackgroundChange}
            >
              <option value="">-- Seleziona --</option>
              {backgrounds.map((bg) => (
                <option key={bg.index} value={bg.index}>
                  {bg.name}
                </option>
              ))}
            </select>
            {backgroundDetails && (
              <div>
                <p>
                  <strong>Abilità:</strong>{" "}
                  {backgroundDetails.abilità.join(", ")}
                </p>
                <p>
                  <strong>Strumenti:</strong>{" "}
                  {backgroundDetails.strumenti.join(", ")}
                </p>
                <p>
                  <strong>Lingue:</strong> {backgroundDetails.lingue.join(", ")}
                </p>
                <p>
                  <strong>Equipaggiamento:</strong>{" "}
                  {backgroundDetails.equipaggiamento.join(", ")}
                </p>
                <p>
                  <strong>Talento:</strong> {backgroundDetails.talento}
                </p>
                <p>{backgroundDetails.descrizioneTalento}</p>
              </div>
            )}
          </div>
        </>
      )}

      <p>
        <strong>Descrizione:</strong> {png.descrizione}
      </p>
      <p>
        <strong>Frase Tipica:</strong> “{png.frase}”
      </p>
      <p>
        <strong>Nota DM:</strong> {png.nota}
      </p>
      <p>
        <strong>Pregio:</strong> {png.tratto?.pregio}
      </p>
      <p>
        <strong>Difetto:</strong> {png.tratto?.difetto}
      </p>
      <p>
        <strong>Ideale:</strong> {png.tratto?.ideale}
      </p>
      <p>
        <strong>Legame:</strong> {png.tratto?.legame}
      </p>

      <hr />
      <div className="field-group">
        <label>Capitolo / Scena associata:</label>
        <select
          value={capitoloAssociato}
          onChange={(e) => setCapitoloAssociato(e.target.value)}
        >
          <option value="">-- Nessuno --</option>
          {capitoliDisponibili.map((cap) => (
            <option key={cap.id} value={cap.id}>
              {cap.nome}
            </option>
          ))}
        </select>
      </div>
      <hr />
      <div className="section">
        <h4>🕵️‍♂️ Note Segrete</h4>
        <textarea
          value={noteSegrete}
          onChange={(e) => setNoteSegrete(e.target.value)}
          placeholder="Note speciali solo per il DM"
        />
      </div>

      <hr />
      <div className="field-group">
        <label>Relazioni (nome PNG o Villain):</label>

        <select
          onChange={(e) =>
            setPng((p) => ({ ...p, scenaAssociata: e.target.value }))
          }
        >
          <option>-- Nessuna scena --</option>
          {capitoli
            .flatMap((c) =>
              c.scene.map((s) => ({
                id: s.id,
                label: `${c.titolo} → ${s.titolo}`,
              }))
            )
            .map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
        </select>

        <select multiple value={relazioni} onChange={handleRelazioni}>
          {tuttiPNG.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleGenera}>🔁 Rigenera PNG</button>

      <button onClick={salvaPNG}>💾 Salva PNG</button>
    </div>
  );
}
