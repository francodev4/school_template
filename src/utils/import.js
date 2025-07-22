import Papa from "papaparse";

// Fonction utilitaire pour parser un CSV en tableau d'objets JS
// csvText: string CSV (avec en-tête)
// Retourne: tableau d'objets (ex: [{name: ..., class: ...}, ...])
export function parseCSV(csvText) {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: false,
    trimHeaders: true,
  });
  return result.data;
}
