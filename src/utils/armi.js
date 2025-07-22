export const armi = [
  {
    index: "longsword",
    name: "Spada lunga",
    equipment_category: { name: "Weapon" },
    weapon_category: "Martial",
    weapon_range: "Melee",
    category_range: "Melee",
    cost: { quantity: 15, unit: "gp" },
    damage: {
      damage_dice: "1d8",
      damage_type: { name: "Taglio" }
    },
    properties: [
      { name: "Versatile", desc: "Può essere usata a una o due mani (1d10 a due mani)." }
    ],
    weight: 3
  },
  {
    index: "shortsword",
    name: "Spada corta",
    equipment_category: { name: "Weapon" },
    weapon_category: "Martial",
    weapon_range: "Melee",
    category_range: "Melee",
    cost: { quantity: 10, unit: "gp" },
    damage: {
      damage_dice: "1d6",
      damage_type: { name: "Taglio" }
    },
    properties: [
      { name: "Leggera", desc: "Può essere usata per attacchi con due armi." },
      { name: "Finesse", desc: "Può usare Destrezza per tiri per colpire e danno." }
    ],
    weight: 2
  },
  {
    index: "dagger",
    name: "Pugnale",
    equipment_category: { name: "Weapon" },
    weapon_category: "Simple",
    weapon_range: "Melee",
    category_range: "Melee",
    cost: { quantity: 2, unit: "gp" },
    damage: {
      damage_dice: "1d4",
      damage_type: { name: "Perforante" }
    },
    properties: [
      { name: "Leggera", desc: "Può essere usata per attacchi con due armi." },
      { name: "Lancio", desc: "Gittata 6/18 m." },
      { name: "Finesse", desc: "Può usare Destrezza per tiri per colpire e danno." }
    ],
    weight: 1
  },
  {
    index: "longbow",
    name: "Arco lungo",
    equipment_category: { name: "Weapon" },
    weapon_category: "Martial",
    weapon_range: "Ranged",
    category_range: "Ranged",
    cost: { quantity: 50, unit: "gp" },
    damage: {
      damage_dice: "1d8",
      damage_type: { name: "Perforante" }
    },
    properties: [
      { name: "Due mani", desc: "Può essere usato a una o due mani." },
      { name: "Pesante", desc: "Svantaggio a distanza ravvicinata." }
    ],
    weight: 2
  },
  {
    index: "crossbow",
    name: "Balestra",
    equipment_category: { name: "Weapon" },
    weapon_category: "Martial",
    weapon_range: "Ranged",
    category_range: "Ranged",
    cost: { quantity: 25, unit: "gp" },
    damage: {
      damage_dice: "1d10",
      damage_type: { name: "Perforante" }
    },
    properties: [
      { name: "A due mani", desc: "Può essere usato a due mani." },
      { name: "Ricarica", desc: "Richiede un'azione per ricaricare." }
    ],
  },
    {
        index: "greatsword",
        name: "Spadone",
        equipment_category: { name: "Weapon" },
        weapon_category: "Martial",
        weapon_range: "Melee",
        category_range: "Melee",
        cost: { quantity: 50, unit: "gp" },
        damage: {
        damage_dice: "2d6",
        damage_type: { name: "Taglio" }
        },
        properties: [
        { name: "Due mani", desc: "Può essere usato a due mani." }
        ],
        weight: 6
    },
    {
        index: "battleaxe",
        name: "Ascia da battaglia",
        equipment_category: { name: "Weapon" },
        weapon_category: "Martial",
        weapon_range: "Melee",
        category_range: "Melee",
        cost: { quantity: 10, unit: "gp" },
        damage: {
            damage_dice: "1d8",
            damage_type: { name: "Taglio" }
        },
        properties: [
            { name: "Due mani", desc: "Può essere usato a due mani." }
        ],
        weight: 4
    },
    {
        index: "warhammer",
        name: "Martello da guerra",
        equipment_category: { name: "Weapon" },
        weapon_category: "Martial",
        weapon_range: "Melee",
        category_range: "Melee",
        cost: { quantity: 15, unit: "gp" },
        damage: {
            damage_dice: "1d8",
            damage_type: { name: "Perforante" }
        },
        properties: [
            { name: "Due mani", desc: "Può essere usato a due mani." }
        ],
        weight: 2
    }
];