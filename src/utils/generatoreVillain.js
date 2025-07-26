import { casuale, rand, tiraStats, generaNomeCasuale, generaCognomeCasuale, generaDescrizioneEvocativa } from "./generators";
import { classes } from "./classes"; 
import { razze } from "./races";     
import { spells } from "./spells";
import { armi } from "./armi";
import { armature } from "./armature";

// ✅ Equipaggiamento base per classe
const equipBasePerClasse = {
  barbaro: { armi: ["battleaxe"], armature: ["leather-armor"], equipaggiamento: ["Abiti comuni", "Zaino", "Razioni"] },
  bardo: { armi: ["dagger"], armature: ["leather-armor"], equipaggiamento: ["Abiti comuni", "Zaino", "Razioni", "Liuto di quercia bianca"], focusArcano: generaFocusArcano("bardo") },
  chierico: { armi: ["warhammer"], armature: ["chain-mail", "shield"], equipaggiamento: ["Abiti comuni", "Libro di preghiere", "Razioni"], focusArcano: generaFocusArcano("cleric") },
  druido: { armi: ["dagger"], armature: ["leather-armor"], equipaggiamento: ["Abiti comuni", "Razioni"], focusArcano: generaFocusArcano("druid") },
  guerriero: { armi: ["longsword"], armature: ["chain-mail", "shield"], equipaggiamento: ["Abiti comuni", "Razioni"] },
  ladro: { armi: ["shortsword"], armature: ["leather-armor"], equipaggiamento: ["Abiti comuni", "Razioni"] },
  mago: { armi: ["dagger"], armature: [], equipaggiamento: ["Abiti comuni", "Razioni"], focusArcano: generaFocusArcano("wizard") },
  monaco: { armi: ["shortsword"], armature: [], equipaggiamento: ["Abiti comuni", "Razioni"] },
  paladino: { armi: ["longsword"], armature: ["chain-mail", "shield"], equipaggiamento: ["Abiti comuni", "Razioni"], focusArcano: generaFocusArcano("paladin") },
  ranger: { armi: ["longbow", "shortsword"], armature: ["leather-armor"], equipaggiamento: ["Abiti comuni", "Razioni"] },
  stregone: { armi: ["dagger"], armature: [], equipaggiamento: ["Abiti comuni", "Razioni"], focusArcano: generaFocusArcano("sorcerer") },
  warlock: { armi: ["dagger"], armature: [], equipaggiamento: ["Abiti comuni", "Razioni"], focusArcano: generaFocusArcano("warlock") }
};

const equipVariBase = [
  "Corda di canapa (15m)", "Otre d’acqua", "10 torce", "Pozione di guarigione", "Zaino", "Kit da esploratore"
];

const lootVillain = [
  "Gemma Insanguinata", "Talismano Maledetto", "Anello Oscuro", "Reliquia Antica", "Pergamena Proibita", "Pugnale Cerimoniale"
];

const frasiLoot = [
  "Avvolto in una foschia oscura che sussurra segreti.",
  "Le rune pulsano come vene incandescenti.",
  "Un oggetto che sembra assorbire la luce stessa.",
  "Un sigillo antico incide la sua superficie.",
  "Oscura energia sprigiona calore sinistro."
];

function generaFocusArcano(classe) {
  const focusPerClasse = {
    mago: ["Bastone di quercia inciso", "Cristallo arcano lucente", "Bacchetta d’osso intarsiata", "Libro degli incantesimi con copertina di pelle"],
    stregone: ["Pietra runica cremisi", "Bastone con gemma rossa", "Cristallo pulsante di energia", "Anello con sigillo arcano"],
    warlock: ["Teschio di corvo inciso", "Anello con occhio demoniaco", "Libro di ombre", "Cristallo oscuro"],
    bardo: ["Lira d’argento", "Flauto di osso antico", "Liuto intarsiato di rune", "Tamburo di pelle di drago"],
    chierico: ["Simbolo sacro (Croce d’oro)", "Rosario di perle", "Amuleto con rune divine"],
    druido: ["Totem di corteccia", "Amuleto di pietra verde", "Ramo di quercia runico"],
    ranger: ["Totem Lupo", "Pietra di luna incisa", "Collana di denti", "Bracciale di legno intagliato"],
    paladino: ["Simbolo sacro incastonato in argento (Mezzo Sole)", "Scudo con runa sacra", "Anello di giada con croce"],
    monaco: ["Corda di preghiera", "Amuleto di giada", "Bracciale di meditazione"],
  };
    return casuale(focusPerClasse[classe] || ["Cristallo mistico con venature luminose"]);
}

function calcolaCA(stats, armatureEquip) {
  let baseCA = 10 + Math.floor((stats.destrezza - 10) / 2);
  armatureEquip.forEach(a => {
    if (a.armor_category === "Shield") baseCA += a.armor_class.base;
    else {
      baseCA = a.armor_class.base;
      if (a.armor_class.dex_bonus) {
        const modDex = Math.floor((stats.destrezza - 10) / 2);
        baseCA += a.armor_class.max_bonus ? Math.min(modDex, a.armor_class.max_bonus) : modDex;
      }
    }
  });
  return baseCA;
}

function getEquipFromIds(ids, lista) {
  return lista.filter(item => ids.includes(item.index));
}

export function generaVillainCompleto() {
  const villain = {};
  villain.livello = rand(5, 12);
  const proficienza = Math.ceil(villain.livello / 4) + 2;

  // Razza e classe
  const razzaKey = casuale(Object.keys(razze));
  const classeKey = casuale(classes.map(c => c.index));
  const razzaData = razze[razzaKey];
  const classeData = classes.find(c => c.index === classeKey);

  villain.classe = classeData.name;
  villain.razza = razzaData.name;

  // Classe evocativa
  villain.classeEvocativa = `${classeData.name} ${casuale(["Oscuro", "del Sangue", "Empio", "delle Ombre"])}`;

  // Linguaggi e privilegi razza
  villain.linguaggi = razzaData.languages || [];
  villain.privilegiRazza = (razzaData.traits || []).map(t => ({ nome: t.name, descrizione: t.desc || "" }));

  // Nome e allineamento
  villain.nome = `${generaNomeCasuale()} ${generaCognomeCasuale()}`;
  villain.allineamento = casuale(["Legale Malvagio", "Neutrale Malvagio", "Caotico Malvagio"]);

  // Stats
  const rolls = tiraStats().sort((a, b) => b - a);
  const statsOrder = ["forza", "destrezza", "costituzione", "intelligenza", "saggezza", "carisma"];
  villain.stats = {};
  statsOrder.forEach((s, i) => villain.stats[s] = rolls[i]);
  razzaData.ability_bonuses.forEach(b => villain.stats[b.ability_score] += b.bonus);
  villain.bonusRaziali = razzaData.ability_bonuses.map(b => `${b.ability_score}: +${b.bonus}`).join(", ") || "Nessuno";

  // PF e CA
  const modCos = Math.floor((villain.stats.costituzione - 10) / 2);
  villain.pf = (classeData.hit_die || 8) + (villain.livello - 1) * ((classeData.hit_die || 8) / 2 + modCos);

  // Equip base
  const equipBase = equipBasePerClasse[classeKey] || { armi: ["dagger"], armature: [], equipaggiamento: ["Abiti comuni"] };
  villain.armiEquippate = getEquipFromIds(equipBase.armi, armi);
  villain.armatureIndossate = getEquipFromIds(equipBase.armature, armature);
  villain.equipVari = [...equipBase.equipaggiamento, ...equipVariBase, casuale(lootVillain)];
  if (!villain.armiEquippate.length) villain.armiEquippate.push(armi.find(a => a.index === "dagger"));
  if (!villain.armatureIndossate.length) villain.armatureIndossate.push(armature.find(a => a.index === "leather-armor"));
  villain.ca = calcolaCA(villain.stats, villain.armatureIndossate);

  // Magia
  const classiMagiche = ["wizard", "sorcerer", "warlock", "cleric", "druid", "bard", "paladin"];
  if (classiMagiche.includes(classeKey)) {
    const statMagica = classeKey === "wizard" ? "intelligenza" : "carisma";
    const modMagia = Math.floor((villain.stats[statMagica] - 10) / 2);
    villain.magia = {
      caratteristica: statMagica,
      cd: 8 + modMagia + proficienza,
      bonusAttacco: modMagia + proficienza,
      focus: equipBase.focusArcano || generaFocusArcano(classeKey)
    };
    villain.incantesimi = (spells[classeKey]?.cantrips || []).slice(0, 3).map(sp => ({
      nome: sp.name, livello: sp.level, scuola: sp.school, descrizione: sp.desc
    }));
  }

  // Narrativa
  villain.descrizione = generaDescrizioneEvocativa(villain);
  villain.narrativa = {
    obiettivo: casuale(["Conquistare un regno caduto in rovina e riportarlo alla gloria passata", 
    "Vendicarsi dei traditori che hanno distrutto la sua vita", 
    "Risvegliare un potere antico per dominare il mondo",
    "Recuperare un artefatto perduto che gli conferisce poteri divini",
    "Proteggere un antico santuario dedicato a Bane, il dio della guerra e della conquista",
    "Soggiogare un antico drago cosi che possa usarne il potere per i suoi scopi",
    "Sconfiggere un antico demone e prenderne il posto come suo successore",
    "Liberare un potente spirito maligno per scatenare il caos nel mondo",
    "Diventare il campione di un'entità oscura e diffondere la sua influenza",
    "Sottomettere un antico ordine di cavalieri per usarne le risorse e l'influenza",]),
    motivazione: casuale(["Ossessione per il potere e il dominio, determinato a sottomettere chiunque osi opporsi",
    "Desiderio di vendetta per un torto subito, disposto a tutto pur di ottenere giustizia",
    "Servizio a un'entità oscura che gli ha conferito poteri proibiti in cambio della sua anima",
    "Ricerca di conoscenza proibita, disposto a sacrificare tutto per scoprire i segreti dell'universo",
    "Ambizione sfrenata di diventare il più grande eroe o villain della storia, cercando fama e gloria",
    "Desiderio di proteggere i più deboli, ma con metodi estremi e violenti che lo portano a scontrarsi con gli eroi",
    "Volontà di dimostrare la propria superiorità, cercando di sconfiggere chiunque lo sfidi",
    "Ricerca di un senso di appartenenza, ma attraverso mezzi distruttivi che lo allontanano da chi ama",
    "Desiderio di creare un nuovo ordine mondiale, dove solo i più forti sopravvivono",
    "Fuga da un passato traumatico, cercando di ricostruire la propria identità"]),
    origine: casuale([
       "Un tempo un eroe, ora corrotto da un potere antico che lo ha trasformato in ciò che odiava.",
  "Figlio di un culto oscuro, allevato per essere il prescelto di un dio dimenticato.",
  "Un mago brillante caduto in disgrazia, ossessionato dalla conoscenza proibita.",
  "Un ex campione della luce che ha giurato vendetta dopo il tradimento del suo ordine.",
  "Un nobile decaduto che trama per riprendersi il potere con ogni mezzo.",
  "Un guerriero sopravvissuto a mille battaglie, deciso a imporre un nuovo ordine con il ferro e il sangue.",
  "Creato da un rituale proibito, è la fusione di carne, ombra e follia.",
  "Una vittima del fato che ora cerca di piegare il destino alla propria volontà.",
  "Un servo devoto di un’entità cosmica che brama il caos eterno.",
  "Il portatore di una maledizione millenaria, costretto a distruggere tutto ciò che ama.",
  "Un assassino leggendario, la cui fama è superata solo dalla sua sete di sangue.",
  "Un ex eroe caduto in disgrazia, ora un simbolo di terrore per coloro che un tempo proteggeva."
    ])
  };

  villain.loot = [`${casuale(lootVillain)} — ${casuale(frasiLoot)}`];

  return villain;
}
