import { useEffect } from "react";
import { useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  generateEquipment,
  generaInventarioCasuale,
} from "../../utils/generatoreEquipaggiamento";
import { getClasseData, getNomeClasseIT } from "../../utils/classeUtils";
import { getTrattiRazza } from "../../utils/razzaUtils";
import { generaVillain } from "../../utils/villain";
import {
  isClasseMagica,
  generaIncantesimiVillain,
} from "../../utils/villainMagia";

import StatBox from "../modals/statBox.jsx";
import TooltipHover from "../ui/tooltipHover.jsx";

import "../../styles/generatoreVillain.css";

export default function GeneratoreVillain() {
  const [villain, setVillain] = useState(null);
  const [armaturaUsata, setArmaturaUsata] = useState("");
  const [divinita, setDivinita] = useState(null);
  const [classeArmatura, setClasseArmatura] = useState(null);
  const [tiroPerColpire, setTiroPerColpire] = useState(null);
  const [bonusDanno, setBonusDanno] = useState(null);
  const [armaUsata, setArmaUsata] = useState(null);
  const [inventario, setInventario] = useState([]);
  const [armorData, setArmorData] = useState([]);
  const [weaponData, setWeaponData] = useState([]);
  const [isMagical, setIsMagical] = useState(false);
  const [spellList, setSpellList] = useState([]);
  const [spellData, setSpellData] = useState({});
  const [equipmentList, setEquipmentList] = useState([]);
  const [tab, setTab] = useState("generale");

  useEffect(() => {
  if (!villain) {
    const nuovo = generaVillain();
    setVillain({ ...nuovo});
  }
}, []);

useEffect(() => {
  console.log("📡 useEffect per equipaggiamento TRIGGERATO");
}, [villain]);

  const salvaVillain = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Devi essere loggato.");

    try {
      const ref = collection(db, "users", user.uid, "villains");
      await addDoc(ref, {
        ...villain,
        magia: isMagical,
        incantesimi: spellList,
        spellData,
        equipaggiamento: equipmentList,
        scuolaMagica: villain.scuolaMagica,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });
      alert("Villain salvato con successo!");
    } catch (error) {
      console.error("Errore nel salvataggio Villain:", error);
      alert("Errore nel salvataggio.");
    }
  };

  const getProficiencyBonus = (livello) => {
    if (livello >= 17) return 6;
    if (livello >= 13) return 5;
    if (livello >= 9) return 4;
    if (livello >= 5) return 3;
    return 2;
  };

  const calcolaStatCombattive = () => {
    const modDes = villain.modifiers.destrezza ?? 0;
    const modSag = villain.modifiers.saggezza ?? 0;
    const modCos = villain.modifiers.costituzione ?? 0;
    const classe = villain.classe.toLowerCase();

    const nessunaArmatura =
      armorData.length === 0 || !armorData[0]?.armor_class;

    // 1. MONACO senza armatura → CA = 10 + Des + Sag
    if (classe === "monaco" && nessunaArmatura) {
      const caMonaco = 10 + modDes + modSag;
      setClasseArmatura(caMonaco);
      return;
    }

    // 2. BARBARO senza armatura → CA = 10 + Des + Cos
    if (classe === "barbaro" && nessunaArmatura) {
      const caBarbaro = 10 + modDes + modCos;
      setClasseArmatura(caBarbaro);
      return;
    }

    // 3. Con armatura → calcolo CA da armatura
    if (armorData.length > 0 && armorData[0]?.armor_class) {
      const armor = armorData[0];
      const base = armor.armor_class.base ?? 10;
      const allowDex = armor.armor_class.dex_bonus;
      const maxDex = armor.armor_class.max_bonus;

      let bonusDex = 0;
      if (allowDex) {
        bonusDex =
          typeof maxDex === "number" ? Math.min(modDes, maxDex) : modDes;
      }

      const ca = base + bonusDex;
      setClasseArmatura(ca);
      return;
    }

    // 4. Default fallback → CA = 10 + Des
    setClasseArmatura(10 + modDes);
  };

  useEffect(() => {
    if (armorData.length > 0) {
      calcolaStatCombattive();
    }
  }, [armorData]);

  const convertiNomeInIndex = (nome) => {
    return nome
      .toLowerCase()
      .replace(/ /g, "-")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w-]/g, "");
  };

  useEffect(() => {
    if (!villain?.nome) return;
    const fetchEquipaggiamento = async () => {
      const equipaggiamento = await generateEquipment(
        villain.classe.toLowerCase(),
        villain.livello
      );

      const arma = equipaggiamento.find((i) => i.tipo === "arma");
      const armaEquipaggiata = equipaggiamento.find(
        (item) => item.tipo === "arma"
      );
      const armaturaEquipaggiata = equipaggiamento.find(
        (item) => item.tipo === "armatura"
      );
      console.log(
        "📦 Armatura trovata da generateEquipment:",
        armaturaEquipaggiata
      );
      if (arma?.nome) {
        const indexArma = convertiNomeInIndex(arma.nome);

        // Es. "Longsword" → "longsword"
        const dettagliArma = await fetchWeaponDetails(indexArma);

        const props = await Promise.all(
          dettagliArma.properties.map(async (p) => {
            const res = await fetch(
              `https://www.dnd5eapi.co/api/weapon-properties/${p.index}`
            );
            const propData = await res.json();
            return {
              name: propData.name,
              desc: propData.desc[0],
              index: p.index,
            };
          })
        );

        const armatura = equipaggiamento.find((i) => i.tipo === "armatura");
        if (armatura?.nome) {
          const indexArmatura = convertiNomeInIndex(armatura.nome);
          const dettagliArmatura = await fetchArmorDetails(indexArmatura);
          setArmorData([dettagliArmatura]);
          console.log("💠 Armatura equipaggiata:", dettagliArmatura);
        }

        const usaDes = props.some((p) =>
          ["finesse", "accurate", "light"].includes(p.index)
        );
        dettagliArma.usaDestrezza = usaDes;
        dettagliArma.properties = props;
        console.log("Arma:", arma.nome);
        console.log("Dettagli arma:", dettagliArma);
        setWeaponData([dettagliArma]);
      }
      // Sovrascrittura bonus danno in base alla stat principale
      const usaForza = villain.stats.forza >= villain.stats.destrezza;
      const modPrincipale = usaForza
        ? villain.modifiers.forza
        : villain.modifiers.destrezza;

      const inventarioCasuale = generaInventarioCasuale(villain.classe);
      setInventario(inventarioCasuale);
      setEquipmentList(equipaggiamento);
      const ca = villain?.modifiers?.destrezza ? 10 + villain.modifiers.destrezza : 10;
      setClasseArmatura(ca);
      setTiroPerColpire(statComb.tiroPerColpire);
      setBonusDanno(modPrincipale); // usa solo la stat corretta
      setArmaUsata(armaEquipaggiata?.nome || "Nessuna");
      setArmaturaUsata(armaturaEquipaggiata?.nome || "Nessuna");
    };

    fetchEquipaggiamento();
  }, [villain]);

  useEffect(() => {
    if (villain?.classe) {
      setIsMagical(isClasseMagica(villain.classe));
    }
  }, [villain?.classe]);

  useEffect(() => {
    const setupMagia = async () => {
      if (!isMagical) return;

      console.log("Classe:", villain.classe);
      console.log(
        "Caratteristica magica:",
        getClasseData(villain.classe)?.spellcasting_ability
      );

      const abilitaRaw = getClasseData(villain.classe)?.spellcasting_ability;
      const abilita = abilitaRaw?.toLowerCase?.() || "intelligenza";
      const modStat = villain.modifiers?.[abilita] ?? 0;

      const sottoclasse = getSottoclasse(villain.classe);
      const {
        spellList,
        spellData,
        focusArcano,
        scuolaMagica,
        divinita,
        sottoclasse: nomeSottoclasse,
        sottoclasseDescrizione: descrizioneSottoclasse,
      } = await generaIncantesimiVillain(
        villain.classe,
        villain.livello,
        modStat,
        sottoclasse
      );

      setSpellList(spellList);
      setSpellData(spellData);
      setDivinita(divinita);
      setVillain((v) => ({
        ...v,
        focusArcano,
        scuolaMagica,
        magia: true,
        sottoclasse: nomeSottoclasse,
        sottoclasseDescrizione: descrizioneSottoclasse,
      }));
    };

    setupMagia();
  }, [villain]);

  const fetchWeaponDetails = async (index) => {
    const res = await fetch(`https://www.dnd5eapi.co/api/equipment/${index}`);
    return await res.json();
  };
  const fetchArmorDetails = async (index) => {
    const res = await fetch(`https://www.dnd5eapi.co/api/equipment/${index}`);
    return await res.json();
  };

  const calcolaHP = (villain) => {
    const classeData = getClasseData(villain.classe);
    const dadoVita = classeData?.hit_die || 8;
    const modCost = villain.modifiers.costituzione || 0;
    const primi = dadoVita + modCost;
    const successivi =
      (villain.livello - 1) * (Math.floor(dadoVita / 2) + 1 + modCost);
    return primi + successivi;
  };

  const getAbilitaClasseCasuali = (classe) => {
    const classeData = getClasseData(classe);
    if (!classeData?.skill_options) return [];
    const { choose, from } = classeData.skill_options;
    const mischiato = [...from].sort(() => 0.5 - Math.random());
    return mischiato.slice(0, choose);
  };

  const [talentiClasse, setTalentiClasse] = useState([]);

  useEffect(() => {
    if (!villain?.classe || !villain?.livello) return;
    const fetchTalentiClasse = async () => {
      try {
        const classeAPI = getClasseData(villain.classe)?.index;
        const promises = [];

        for (let lvl = 1; lvl <= villain.livello; lvl++) {
          promises.push(
            fetch(
              `https://www.dnd5eapi.co/api/classes/${classeAPI}/levels/${lvl}`
            )
          );
        }

        const responses = await Promise.all(promises);
        const levelsData = await Promise.all(
          responses.map((res) => res.json())
        );

        const featureUrls = levelsData.flatMap(
          (level) => level.features?.map((f) => f.url) || []
        );

        const talenti = await Promise.all(
          featureUrls.map(async (url) => {
            const r = await fetch(`https://www.dnd5eapi.co${url}`);
            const d = await r.json();
            return {
              name: d.name,
              desc: d.desc?.join(" ") || "—",
            };
          })
        );

        // Rimuovi duplicati per nome
        const unici = [];
        const nomiVisti = new Set();
        for (const t of talenti) {
          if (!nomiVisti.has(t.name)) {
            unici.push(t);
            nomiVisti.add(t.name);
          }
        }

        setTalentiClasse(unici);
      } catch (err) {
        console.warn("Errore nel fetch dei talenti:", err);
      }
    };

      fetchTalentiClasse();
    
  }, [villain?.classe, villain?.livello]);

  if (!villain) return <div style={{ padding: '1rem' }}>⏳ Caricamento Villain...</div>;

  return (
    <div className="villain-header">
      <h3>👹 Villain Generato</h3>
      <button
        onClick={() => {
          const nuovo = generaVillain();
          setVillain({ ...nuovo, sottoclasse: null, sottoclasseDescrizione: null });
        }}
        style={{
          backgroundColor: "#6E4F9E",
          color: "white",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "6px",
          marginBottom: "1rem",
          cursor: "pointer",
        }}
      >
        🔁 Rigenera Villain
      </button>
      <div className="tab-switch">
        <button onClick={() => setTab("generale")}>📋 Generale</button>
        <button onClick={() => setTab("equip")}>🛡️ Equipaggiamento</button>
        {isMagical && <button onClick={() => setTab("magia")}>✨ Magia</button>}
      </div>
      <hr />
      {tab === "generale" && (
        <>
          <p>
            <strong>Nome:</strong> {villain.nome}
          </p>
          <p>
            <strong>Razza:</strong> {villain.razza}
          </p>
          <p>
            <strong>Tratti Razziali:</strong>
          </p>
          <ul>
            {getTrattiRazza(villain.razza).map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>

          <p>
            <strong>Classe:</strong> {villain ? getNomeClasseIT(villain.classe) : ""} - Liv.{" "}
            {villain.livello}
          </p>
          <h4>🧬 Talenti di Classe</h4>
          <ul>
            {talentiClasse.length > 0 ? (
              talentiClasse.map((talento, i) => (
                <li key={i}>
                  <span
                    title={talento.desc}
                    style={{
                      textDecoration: "underline dotted",
                      cursor: "help",
                      color: "#6E4F9E",
                    }}
                  >
                    {talento.name}
                  </span>
                </li>
              ))
            ) : (
              <li>Nessun talento disponibile</li>
            )}
          </ul>

          <hr />

          <p>
            <strong>Classe Armatura (CA):</strong> {classeArmatura}
          </p>
          <p>
            <strong>Punti Ferita:</strong> {calcolaHP(villain)}
          </p>
          <p>
            <strong>Bonus Competenza:</strong> +
            {getProficiencyBonus(villain.livello)}
          </p>

          <hr />
          <p>
            <strong>Frase Tipica:</strong> {villain.frase}
          </p>
          <p>
            <strong>Descrizione:</strong> {villain.descrizione}
          </p>
          <hr />

          <h4>
            <strong>Punteggi Caratteristica</strong>
            <em>( bonus razziali già calcolati)</em>
          </h4>
          <StatBox stats={villain.stats} modifiers={villain.modifiers} />
          <h4>🎓 Competenze e Abilità</h4>
          <p>
            <strong>Competenze:</strong>
          </p>
          <ul>
            {getClasseData(villain.classe)?.proficiencies?.map((p, i) => (
              <li key={i}>{p}</li>
            )) || <li>—</li>}
          </ul>

          <p>
            <strong>Abilità:</strong> (scelte casualmente)
          </p>
          <ul>
            {getAbilitaClasseCasuali(villain.classe)?.map((s, i) => (
              <li key={i}>{s}</li>
            )) || <li>—</li>}
          </ul>
          <hr />
        </>
      )}
      {tab === "equip" && (
        <>
          <h4>🎒 Inventario</h4>
          <ul>
            {inventario.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <h5>🛡️ Armatura</h5>
          <table className="magic-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>CA Base</th>
                <th>Bonus Destrezza</th>
                <th>Stealth</th>
                <th>Peso</th>
              </tr>
            </thead>
            <tbody>
              {armorData.length > 0 ? (
                armorData.map((a, i) => {
                  const tipo = a.armor_category;
                  const caBase = a.armor_class?.base ?? "—";
                  const dexBonus = a.armor_class?.dex_bonus
                    ? a.armor_class?.max_bonus
                      ? `Fino a +${a.armor_class.max_bonus}`
                      : "Completo"
                    : "Nessuno";
                  const stealth = a.stealth_disadvantage
                    ? "❌ Svantaggio"
                    : "✅ Normale";
                  const peso = a.weight
                    ? `${(a.weight * 0.45).toFixed(1)} kg`
                    : "—";

                  return (
                    <tr key={i}>
                      <td>{a.name}</td>
                      <td>{tipo}</td>
                      <td>{caBase}</td>
                      <td>{dexBonus}</td>
                      <td>{stealth}</td>
                      <td>{peso}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6">
                    <em>Nessuna armatura equipaggiata</em>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <hr />
          <h5>🗡️ Armi</h5>
          <table className="magic-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Proprietà</th>
                <th>Tipo</th>
                <th>Tiro per Colpire</th>
                <th>Danni</th>
              </tr>
            </thead>
            <tbody>
              {weaponData.map((w, i) => {
                const mod = w.usaDestrezza
                  ? villain.modifiers.destrezza
                  : villain.modifiers.forza;
                const prof = getProficiencyBonus(villain.livello);
                const tiro = mod + prof;
                const dannoBase = w.damage?.damage_dice || "—";
                const tipoDanno = w.damage?.damage_type?.name || "";
                const dannoVersatile = w.two_handed_damage?.damage_dice || null;

                return (
                  <tr key={i}>
                    <td>{w.name}</td>
                    <td>
                      {w.properties.map((p, idx) => (
                        <span key={p.index}>
                          <TooltipHover tooltip={p.desc}>{p.name}</TooltipHover>
                          {idx < w.properties.length - 1 && " - "}
                        </span>
                      ))}
                    </td>

                    <td>{w.weapon_range || "—"}</td>
                    <td>+{tiro}</td>
                    <td>
                      {dannoBase !== "—"
                        ? `${dannoBase}+${mod} ${tipoDanno}`
                        : "—"}
                      {dannoVersatile && (
                        <>
                          <br />
                          Versatile: {dannoVersatile}+{mod} {tipoDanno}
                        </>
                      )}
                      {w.throw_range && (
                        <>
                          <br />
                          <em>Gittata:</em> {w.throw_range.normal * 1.5}m /{" "}
                          {w.throw_range.long * 1.5}m
                        </>
                      )}
                      {w.range && !w.throw_range && (
                        <>
                          <br />
                          <em>Portata:</em> {w.range.normal * 1.5}m
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}

      {tab === "magia" && isMagical && (
        <>
          {divinita && (
            <>
              <h4>⛪ Divinità</h4>
              <p>
                <strong>{divinita.nome}</strong>
              </p>
              <p>
                <em>{divinita.dominio}</em>
              </p>
              <p>{divinita.descrizione}</p>
              <p>
                <strong>Simbolo:</strong> {divinita.simbolo}
              </p>
            </>
          )}
          <p>
            <strong>Caratteristica Incantesimi:</strong>{" "}
            {spellData.abilitaIncantesimi?.toUpperCase()}
          </p>
          <p>
            <strong>CD Incantesimi:</strong> {spellData.CD}
          </p>
          <p>
            <strong>Bonus Attacco Magico:</strong> +{spellData.bonusAttacco}
          </p>
          <p>
            <strong>Focus Arcano:</strong> {villain.focusArcano || "—"}
          </p>

          <TooltipHover tooltip="La quantità di incantesimi noti dipende dalla classe e dal livello. Alcune classi preparano incantesimi, altre li conoscono permanentemente.">
            <em>Regole per incantesimi conosciuti/preparati</em>
          </TooltipHover>

          <p>
            <strong>Trucchetti conosciuti:</strong>{" "}
            {spellList.filter((s) => s.livello === 0).length}
          </p>

          <table className="magic-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descrizione / Effetto</th>
              </tr>
            </thead>
            <tbody>
              {spellList
                .filter((s) => s.livello === 0)
                .map((spell, i) => (
                  <tr key={i}>
                    <td>
                      <TooltipHover
                        tooltip={`Scuola: ${spell.scuola}
Componenti: ${spell.componenti}
  Gittata: ${spell.gittata}
Durata: ${spell.durata}`}
                      >
                        {spell.nome}
                      </TooltipHover>
                    </td>
                    <td>{spell.descrizione}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          {[...new Set(spellList.map((s) => s.livello).filter((l) => l > 0))]
            .sort((a, b) => a - b)
            .map((liv) => (
              <div key={liv}>
                <p>
                  <strong>
                    Incantesimi di livello {liv} – Slot disponibili:
                  </strong>{" "}
                  {spellData.slots?.[`spell_slots_level_${liv}`] ?? 0}
                </p>
                <table className="magic-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Descrizione / Effetto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {spellList
                      .filter((s) => s.livello === liv)
                      .map((spell, i) => (
                        <tr key={i}>
                          <td>
                            <TooltipHover
                              tooltip={`Scuola: ${spell.scuola}
Componenti: ${spell.componenti}
Gittata: ${spell.gittata}
Durata: ${spell.durata}`}
                            >
                              {spell.nome}
                            </TooltipHover>
                          </td>
                          <td>{spell.descrizione}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
        </>
      )}

      <button onClick={salvaVillain} className="btn-villain btn-salva">
        💾 Salva Villain
      </button>
    </div>
  );
}
