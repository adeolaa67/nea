// Shared loader for public/plants.csv - used by AddCropDialog, CropCard and
// PlantingRecommendations. Quote-aware (IdealGrowthArea values like
// "44.1°N, 120.5°W" contain commas), unlike the calculator's own parser.
let cachedCatalog = null;

function splitCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

function parseCatalog(csvText) {
  const lines = csvText.trim().split('\n');
  const plants = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cols = splitCSVLine(line);
    if (cols.length < 13) continue;
    plants.push({
      id: cols[0].trim(),
      name: cols[1].trim(),
      phLevel: cols[2].trim(),
      daysToMaturity: parseInt(cols[3].trim(), 10) || 0,
      idealGrowthArea: cols[4].trim(),
      waterPerWeek: cols[5].trim(),
      soilType: cols[6].trim(),
      plantSpacing: cols[7].trim(),
      rootDepth: cols[8].trim(),
      hardinessZone: parseInt(cols[9].trim(), 10) || 0,
      minTemp: parseInt(cols[10].trim(), 10) || 0,
      maxTemp: parseInt(cols[11].trim(), 10) || 0,
      idealPlantDate: cols[12].trim()
    });
  }
  return plants;
}

export async function loadPlantCatalog() {
  if (cachedCatalog) return cachedCatalog;
  const res = await fetch('/plants.csv');
  if (!res.ok) throw new Error('Could not load plants.csv');
  const csvText = await res.text();
  cachedCatalog = parseCatalog(csvText);
  return cachedCatalog;
}
