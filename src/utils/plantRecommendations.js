import { isZoneCompatible } from './hardinessZones';

const MONTH_TOLERANCE = 1; // +/- 1 month around the ideal planting month

function monthOf(dateString) {
  return new Date(dateString).getMonth();
}

export function isPlantableNow(plant, userZone, today = new Date()) {
  if (!isZoneCompatible(plant.hardinessZone, userZone)) return false;
  if (!plant.idealPlantDate) return false;
  const idealMonth = monthOf(plant.idealPlantDate);
  const currentMonth = today.getMonth();
  let diff = Math.abs(idealMonth - currentMonth);
  diff = Math.min(diff, 12 - diff);
  return diff <= MONTH_TOLERANCE;
}

export function getPlantingWindow(plant) {
  if (!plant.idealPlantDate) return 'Unknown';
  const ideal = new Date(plant.idealPlantDate);
  const start = new Date(ideal);
  start.setDate(ideal.getDate() - 15);
  const end = new Date(ideal);
  end.setDate(ideal.getDate() + 30);
  const fmt = (dt) => dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
  return `${fmt(start)} – ${fmt(end)}`;
}

export function getRecommendations(plants, userZone, today = new Date()) {
  const plantable = [];
  const notPlantable = [];

  for (const plant of plants) {
    if (isPlantableNow(plant, userZone, today)) {
      plantable.push(plant);
    } else {
      notPlantable.push(plant);
    }
  }

  const alternatives = notPlantable.map((plant) => ({
    plant,
    alternative: plantable.find((p) => p.name !== plant.name) || null
  }));

  return { plantable, alternatives };
}