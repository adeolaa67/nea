// Rough latitude -> USDA zone estimate (Northern-hemisphere-biased heuristic
// used only to pre-fill the zone selector). This is an approximation for
// demo purposes - a production app should use an authoritative zone lookup
// (e.g. by ZIP/postcode) instead of deriving it from GPS coordinates alone.
export function estimateZoneFromLatitude(latitude) {
  const lat = Math.abs(latitude);
  if (lat >= 65) return 1;
  if (lat >= 60) return 2;
  if (lat >= 55) return 3;
  if (lat >= 50) return 4;
  if (lat >= 45) return 5;
  if (lat >= 40) return 6;
  if (lat >= 35) return 7;
  if (lat >= 30) return 8;
  if (lat >= 25) return 9;
  if (lat >= 20) return 10;
  return 11;
}

// The plant catalog stores a single hardinessZone number per crop (its
// minimum recommended zone). We treat each crop as suited to a 3-zone band
// starting there, since the CSV doesn't provide an explicit max.
export function isZoneCompatible(plantZone, userZone) {
  const pz = Number(plantZone);
  const uz = Number(userZone);
  if (!pz || !uz) return false;
  return uz >= pz && uz <= pz + 3;
}