export function daysBetween(dateA, dateB) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((dateB.getTime() - dateA.getTime()) / msPerDay);
}

export function getProgressPercent(plantingDate, harvestDays) {
  const planted = new Date(plantingDate);
  const today = new Date();
  const daysSincePlanting = daysBetween(planted, today);
  const days = Number(harvestDays) || 1;
  const pct = (daysSincePlanting / days) * 100;
  return Math.max(0, Math.min(100, Math.round(pct)));
}

export function getGrowthStage(progressPercent) {
  if (progressPercent >= 100) return 'ready';
  if (progressPercent >= 75) return 'fruiting';
  if (progressPercent >= 50) return 'flowering';
  if (progressPercent >= 25) return 'vegetative';
  return 'seedling';
}

export function getEstimatedHarvestDate(plantingDate, harvestDays) {
  const planted = new Date(plantingDate);
  const harvestDate = new Date(planted);
  harvestDate.setDate(planted.getDate() + Number(harvestDays));
  return harvestDate;
}

export function getDaysUntilHarvest(plantingDate, harvestDays) {
  const harvestDate = getEstimatedHarvestDate(plantingDate, harvestDays);
  const today = new Date();
  return Math.max(0, daysBetween(today, harvestDate));
}

export const GROWTH_STAGE_LABELS = {
  seedling: 'Seedling',
  vegetative: 'Vegetative',
  flowering: 'Flowering',
  fruiting: 'Fruiting',
  ready: 'Ready to harvest'
};