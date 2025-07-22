export const armature = [
  {
    index: "leather-armor",
    name: "Armatura di cuoio",
    equipment_category: { name: "Armor" },
    armor_category: "Light",
    cost: { quantity: 10, unit: "gp" },
    armor_class: { base: 11, dex_bonus: true, max_bonus: null },
    weight: 5,
    stealth_disadvantage: false
  },
  {
    index: "chain-mail",
    name: "Cotta di maglia",
    equipment_category: { name: "Armor" },
    armor_category: "Heavy",
    cost: { quantity: 75, unit: "gp" },
    armor_class: { base: 16, dex_bonus: false },
    weight: 27,
    stealth_disadvantage: true,
    strength_minimum: 13
  },
  {
    index: "shield",
    name: "Scudo",
    equipment_category: { name: "Armor" },
    armor_category: "Shield",
    cost: { quantity: 10, unit: "gp" },
    armor_class: { base: 2, dex_bonus: false },
    weight: 3,
    stealth_disadvantage: false
  },
  {
    index: "plate-armor",
    name: "Armatura a piastre",
    equipment_category: { name: "Armor" },
    armor_category: "Heavy",
    cost: { quantity: 1500, unit: "gp" },
    armor_class: { base: 18, dex_bonus: false },
    weight: 65,
    stealth_disadvantage: false,
    strength_minimum: 15
  },
  {
    index: "studded-leather-armor",
    name: "Armatura di cuoio rinforzato",
    equipment_category: { name: "Armor" },
    armor_category: "Light",
    cost: { quantity: 45, unit: "gp" },
    armor_class: { base: 12, dex_bonus: true, max_bonus: null },
    weight: 13,
    stealth_disadvantage: false
  },
  {
    index: "breastplate",
    name: "Corazza",
    equipment_category: { name: "Armor" },
    armor_category: "Medium",
    cost: { quantity: 400, unit: "gp" },
    armor_class: { base: 14, dex_bonus: true, max_bonus: 2 },
    weight: 20,
    stealth_disadvantage: false
  },
  {
    index: "half-plate",
    name: "Mezza corazza",
    equipment_category: { name: "Armor" },
    armor_category: "Medium",
    cost: { quantity: 750, unit: "gp" },
    armor_class: { base: 15, dex_bonus: true, max_bonus: 2 },
    weight: 40,
    stealth_disadvantage: false,
    strength_minimum: 15
  },
  {
    index: "ring-mail",
    name: "Maglia di anelli",
    equipment_category: { name: "Armor" },
    armor_category: "Heavy",
    cost: { quantity: 30, unit: "gp" },
    armor_class: { base: 14, dex_bonus: false },
    weight: 40,
    stealth_disadvantage: true
  },
  {
    index: "scale-mail",
    name: "Maglia di scaglie",
    equipment_category: { name: "Armor" },
    armor_category: "Medium",
    cost: { quantity: 50, unit: "gp" },
    armor_class: { base: 14, dex_bonus: true, max_bonus: 2 },
    weight: 45,
    stealth_disadvantage: true
  }
];
