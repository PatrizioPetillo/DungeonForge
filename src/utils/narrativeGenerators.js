import { casuale } from "./generators";

// =========================
// HOOK & DIALOGHI VILLAIN
// =========================
const hookVillain = [
  "Il villain è il mentore segreto di un PNG chiave.",
  "Il villain controlla un luogo in cui i PG cercheranno rifugio.",
  "Il villain ha stretto un patto con una divinità oscura.",
  "Un antico debito lega il villain a una potente fazione.",
  "Il villain è maledetto e ha bisogno dei PG per spezzare la maledizione.",
  "Il villain ha un oggetto che i PG devono recuperare per salvare il mondo.",
  "Il villain è in realtà un ex eroe caduto in disgrazia.",
  "Il villain ha un legame misterioso con uno dei PG.",
];

const dialoghiVillain = [
  "«Non sono io il male. Sono la cura di questo mondo malato.»",
  "«Tutto ciò che amate cadrà in cenere. E vi ringrazierete di avermi conosciuto.»",
  "«La luce è solo un’ombra in ritardo.»",
  "«Non potete fermare l’inevitabile. Potete solo affrettarlo.»",
  "«Ogni eroe ha un prezzo. E io sono qui per riscuoterlo.»",
  "«La vostra speranza è la mia forza. E io sono il vostro incubo.»",
  "«Il destino non è scritto. È scolpito nel sangue.»",
  "«La verità è un’arma, e io sono il suo maestro.»",
  "«La paura è il mio alleato. E voi siete i miei burattini.»",
  "«Ogni passo che fate mi avvicina al mio trionfo.»",
];

export function generaHookVillain() {
  return casuale(hookVillain);
}

export function generaDialogoVillain() {
  return casuale(dialoghiVillain);
}

// =========================
// HOOK & DIALOGHI PNG
// =========================
const hookPNG = [
  "Questo PNG conosce un segreto sul villain principale.",
  "Il PNG custodisce una chiave per accedere a un luogo proibito.",
  "Il PNG è in debito con una fazione oscura.",
  "Il PNG è l'unico a sapere dove si trova un oggetto leggendario.",
  "Il PNG ha un passato oscuro che lo lega al villain.",
  "Il PNG è un traditore infiltrato tra i PG.",
  "Il PNG ha un potere nascosto che può cambiare le sorti della storia.",
  "Il PNG è un testimone chiave di un evento cruciale.",
  "Il PNG è in possesso di un artefatto che può distruggere il villain.",
];

const dialoghiPNG = [
  "«Non dovreste fidarvi di chi sorride troppo.»",
  "«Ho visto cose che preferirei dimenticare.»",
  "«Avete monete? Ho storie che valgono oro.»",
  "«Il silenzio è il miglior alleato... finché non vi tradisce.»",
  "«Non tutte le ferite sono visibili, e non tutti i segreti sono nascosti.»",
  "«La mia lealtà ha un prezzo, e voi non potete permettervelo.»",
  "«Le mie parole sono come le ombre: possono nascondere o rivelare.»",
  "«Non sono qui per aiutarvi, ma per osservare.»",
  "«Ogni scelta ha un prezzo, e io sono il vostro esattore.»",
  "«La verità è un lusso che pochi possono permettersi.»",
];

export function generaHookPNG() {
  return casuale(hookPNG);
}

export function generaDialogoPNG() {
  return casuale(dialoghiPNG);
}

// =========================
// HOOK & FRASE LUOGHI
// =========================
const hookLuogo = [
  "Il luogo nasconde un passaggio verso un piano dimenticato.",
  "Una maledizione permea queste mura, e pochi conoscono il motivo.",
  "La taverna è un punto d’incontro per spie e traditori.",
  "Il luogo è stato teatro di un antico rituale che ha cambiato il corso della storia.",
  "Questo luogo è un crocevia di destini, dove ogni scelta ha conseguenze impreviste.",
  "Il luogo è protetto da un guardiano che non dorme mai.",
  "Le leggende narrano che questo luogo sia stato costruito su un antico cimitero di eroi dimenticati.",
  "Il luogo è avvolto da un’aura di mistero, e chi vi entra non ne esce mai lo stesso.",
  "Questo luogo è un rifugio per coloro che cercano risposte, ma le risposte sono spesso più pericolose delle domande.",
];

const frasiLuogo = [
  "«Qui inizia e qui finisce il cerchio eterno.»",
  "«Chi osa varcare questa soglia non tornerà mai lo stesso.»",
  "«Il tempo qui non scorre, ma attende.»",
  "«Le ombre di questo luogo raccontano storie che nessuno osa ascoltare.»",
  "«Ogni pietra di questo luogo ha un segreto, e ogni segreto ha un prezzo.»",
  "«Questo luogo è un labirinto di verità e menzogne, e pochi ne escono indenni.»",
  "«Le leggende di questo luogo sono scritte nel sangue degli audaci.»",
  "«Qui, il passato e il futuro si intrecciano in un eterno presente.»",
  "«Questo luogo è un eco di ciò che è stato e di ciò che sarà.»",
  "«Le risposte che cercate sono qui, ma il prezzo da pagare è alto.»"
];

export function generaHookLuogo() {
  return casuale(hookLuogo);
}

export function generaFraseLuogo() {
  return casuale(frasiLuogo);
}

// =========================
// HOOK & FRASE ENIGMI
// =========================
const hookEnigma = [
  "La soluzione dell’enigma è scritta in un luogo insospettabile.",
  "Chi risolve l’enigma ottiene una visione del futuro.",
  "L’enigma cela un patto con un’entità extradimensionale.",
  "La risposta all’enigma è legata a un antico rituale.",
  "L’enigma è un test per dimostrare la vera natura dei PG.",
  "La soluzione dell’enigma è nascosta in un oggetto comune.",
  "L’enigma è un messaggio criptato che rivela un segreto oscuro.",
];

const frasiEnigma = [
  "«La risposta è nascosta dove il silenzio grida.»",
  "«Tre passi nell’ombra e la verità si rivelerà.»",
  "«Chi sa leggere il vento conosce la chiave.»",
  "«Il tempo è un inganno, e la risposta è eterna.»",
  "«Non tutto ciò che brilla è oro, ma la verità è sempre preziosa.»",
  "«La mente è un labirinto, e la soluzione è il suo centro.»",
  "«La risposta è un eco del passato, risuona nel presente.»",
  "«Solo chi guarda oltre il velo vede la luce.»",
  "«Le parole sono come le ombre: possono nascondere o rivelare.»",
];

export function generaHookEnigma() {
  return casuale(hookEnigma);
}

export function generaFraseEnigma() {
  return casuale(frasiEnigma);
}
// =========================
// GENERA 3 VARIANTI
// =========================
function generaVarianti(array, num = 3) {
  const copie = [...array];
  const varianti = [];
  while (varianti.length < num && copie.length > 0) {
    const index = Math.floor(Math.random() * copie.length);
    varianti.push(copie.splice(index, 1)[0]);
  }
  return varianti;
}

// Varianti Villain
export function genera3HookVillain() {
  return generaVarianti(hookVillain);
}
export function genera3DialoghiVillain() {
  return generaVarianti(dialoghiVillain);
}

// Varianti PNG
export function genera3HookPNG() {
  return generaVarianti(hookPNG);
}
export function genera3DialoghiPNG() {
  return generaVarianti(dialoghiPNG);
}

// Varianti Luoghi
export function genera3HookLuogo() {
  return generaVarianti(hookLuogo);
}
export function genera3FrasiLuogo() {
  return generaVarianti(frasiLuogo);
}

// Varianti Enigmi
export function genera3HookEnigma() {
  return generaVarianti(hookEnigma);
}
export function genera3FrasiEnigma() {
  return generaVarianti(frasiEnigma);
}
