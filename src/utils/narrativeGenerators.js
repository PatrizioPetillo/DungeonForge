import { casuale } from "./generators";

const hookVillain = [
  "Il villain è il mentore segreto di un PNG chiave.",
  "Il villain controlla il luogo in cui i PG si rifugeranno.",
  "Il villain ha un accordo segreto con una divinità oscura.",
  "Il villain è il vero erede di un antico potere.",
  "Il villain ha un oggetto che i PG devono recuperare.",
  "Il villain è stato tradito da un alleato fidato.",
  "Il villain ha un piano che coinvolge un evento catastrofico.",
  "Il villain è in possesso di un artefatto che può cambiare le sorti della campagna."
];

const hookPNG = [
  "Questo PNG è in debito con il villain.",
  "Il PNG nasconde un oggetto leggendario in un luogo remoto.",
  "Il PNG conosce un rituale che il villain vuole eseguire.",
    "Il PNG è l'unico in grado di decifrare un antico testo.",
    "Il PNG è un ex alleato del villain, ora pentito.",
    "Il PNG ha una connessione con un luogo chiave della campagna.",
    "Il PNG è stato maledetto dal villain e cerca aiuto.",
    "Il PNG è un agente sotto copertura inviato dal villain.",
    "Il PNG ha un segreto che può rovesciare le sorti della campagna.",
    "Il PNG è il custode di un portale verso un altro piano."
];

const dialoghiVillain = [
  "«Non sono io il male. Sono la cura di questo mondo malato.»",
  "«Tutto ciò che amate cadrà in cenere. E vi ringrazierete di avermi conosciuto.»",
  "«La luce è solo un’ombra in ritardo.»",
  "«Il potere non è un dono, è una maledizione che pochi possono gestire.»",
  "«La tua lealtà è un lusso che non posso permettermi.»",
  "«La tua morte sarà solo l'inizio della mia grande opera.»",
    "«Non c'è redenzione per chi ha scelto il lato sbagliato.»",
    "«La tua speranza è la mia arma più potente.»",
    "«Ogni eroe ha un prezzo. E io sono qui per riscuoterlo.»",
    "«La tua paura è il mio carburante. E brucerà tutto ciò che ami.»"
];

const dialoghiPNG = [
  "«Non dovreste fidarvi di chi sorride troppo.»",
  "«Ho visto cose che preferirei dimenticare.»",
  "«Avete monete? Ho storie che valgono oro.»",
  "«Il silenzio è il miglior alleato... finché non vi tradisce.»",
  "«Non chiedetemi da dove vengo, e non vi chiederò dove andate.»",
  "«La mia vita è un labirinto, e voi siete solo visitatori.»",
  "«Non sono un eroe, ma un sopravvissuto. E voi dovreste imparare a esserlo.»",
  "«La mia lealtà è a chi mi paga di più. E voi non avete monete.»",
  "«La mia storia è un segreto. E voi non siete pronti a sentirla.»",
];

export function generaDialogoPNG() {
  return casuale(dialoghiPNG);
}

export function generaHook(tipo) {
  if (tipo === "villain") return casuale(hookVillain);
  if (tipo === "png") return casuale(hookPNG);
  return "Un mistero lega questi elementi...";
}

export function generaDialogo(tipo) {
  if (tipo === "villain") return casuale(dialoghiVillain);
  if (tipo === "png") return casuale([
    "«Posso fidarmi di voi? Non ho altra scelta…. »",
    "«Un uomo deve mangiare. E voi dovreste correre.»",
    "«Loro non vi diranno la verità. Io sì.»",
    "«La mia vita è un labirinto. E voi siete perduti.»",
    "«Non sono un eroe. Sono un sopravvissuto.»",
    "«La mia lealtà è a chi mi paga di più. E voi non avete monete.»",
    "«La mia storia è un segreto. E voi non siete pronti a sentirla.»",
    "«Non sono qui per salvare il mondo. Sono qui per salvarmi.»",
  ]);
  return "Silenzio eloquente...";
}

// =========================
// HOOK & FRASE LUOGHI
// =========================
const hookLuogo = [
  "Il luogo nasconde un passaggio verso un piano dimenticato.",
  "Una maledizione permea queste mura, e pochi conoscono il motivo.",
  "La taverna è un punto d’incontro per spie e traditori.",
  "Sotto la città c’è un tempio dedicato a un dio proibito.",
  "Il villaggio ospita un PNG che è la chiave di un’antica profezia."
];

const frasiLuogo = [
  "«Qui inizia e qui finisce il cerchio eterno.»",
  "«Chi osa varcare questa soglia non tornerà mai lo stesso.»",
  "«Il tempo qui non scorre, ma attende.»",
  "«Solo chi non ha paura dell’oscurità vedrà la luce.»",
  "«La verità giace sotto tre ombre e un silenzio eterno.»"
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
  "Un fallimento scatena una maledizione che si estende alla regione.",
  "L’enigma è collegato a un artefatto che il villain desidera."
];

const frasiEnigma = [
  "«La risposta è nascosta dove il silenzio grida.»",
  "«Tre passi nell’ombra e la verità si rivelerà.»",
  "«Chi sa leggere il vento conosce la chiave.»",
  "«Non cercare fuori ciò che è inciso dentro.»",
  "«Solo il vuoto completa il cerchio.»"
];

export function generaHookEnigma() {
  return casuale(hookEnigma);
}

export function generaFraseEnigma() {
  return casuale(frasiEnigma);
}
