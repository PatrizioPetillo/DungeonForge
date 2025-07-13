// helpers.js

// Restituisce un elemento casuale da un array
export function getRandomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Prima lettera maiuscola
export function capitalize(str) {
  if (!str || typeof str !== "string") return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}
