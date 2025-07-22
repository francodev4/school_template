// Fonction utilitaire pour exporter un tableau d'objets en CSV
// data: tableau d'objets (ex: étudiants)
// columns: tableau de clés à exporter (ex: ['name', 'class', 'status', 'grade'])
export function exportToCSV(data, columns) {
  const header = columns.join(",");
  const rows = data.map((row) =>
    columns
      .map((col) => {
        const cell = row[col] !== undefined ? String(row[col]) : "";
        // Échapper les guillemets et entourer de guillemets si nécessaire
        const escaped = cell.replace(/"/g, '""');
        return /[",\n]/.test(escaped) ? `"${escaped}"` : escaped;
      })
      .join(",")
  );
  return [header, ...rows].join("\n");
}
