export function formatPokemonNumber(id) {
  return String(id).padStart(3, "0");
}

export function formatPokemonName(name) {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatHeight(height) {
  const meters = height / 10;
  return `${meters.toFixed(1).replace(".0", "")} m`;
}

export function formatWeight(weight) {
  const kilograms = weight / 10;
  return `${kilograms.toFixed(1).replace(".0", "")} kg`;
}

export function cleanDescription(text) {
  return text.replace(/\f/g, " ").replace(/\n/g, " ").trim();
}
