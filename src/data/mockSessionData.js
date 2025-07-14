// src/data/mockSessionData.js

const mockCampagna = {
  id: "campagna-abc123",
  titolo: "La Cripta dei Sussurri",
  tipo: "FiveRoomDungeon",
  capitoloCorrente: "Stanza 2 - Enigma Spirituale",
  scenaAttiva: {
    titolo: "Lo Spirito nella Pietra",
    testo: "Un sussurro aleggia tra le rovine: una voce incorporea chiede aiuto... o forse inganna.",
    durataStimata: "15 minuti",
    dialogoSuggerito: "«Liberami... o ti maledirò per l’eternità!»"
  },
  mostri: [
    { nome: "Spettro", PF: 45, CA: 12, stato: "attivo" },
    { nome: "Ombra", PF: 16, CA: 14, stato: "nascosto" }
  ],
  villain: [
  { nome: "Zarkhon il Lich", ruolo: "Arcinemico", presente: true }
],
  eventi: [
    { tipo: "dialogo", descrizione: "Il PG parla con lo spirito." },
    { tipo: "prova", descrizione: "Prova Saggezza (CD 14) per percepire l’inganno." },
    { tipo: "azione", descrizione: "Lo Spettro attacca con tocco spettrale." }
  ],
  proveConsigliate: [
    { abilita: "Intuizione", cd: 14 },
    { abilita: "Religione", cd: 12 }
  ]
};

export default mockCampagna;
