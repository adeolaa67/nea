const CONDITIONS_BY_CODE = {
  0: { label: 'Clear sky', emoji: '☀️', condition: 'sunny' },
  1: { label: 'Mainly clear', emoji: '🌤️', condition: 'sunny' },
  2: { label: 'Partly cloudy', emoji: '⛅', condition: 'cloudy' },
  3: { label: 'Overcast', emoji: '☁️', condition: 'cloudy' },
  45: { label: 'Fog', emoji: '🌫️', condition: 'cloudy' },
  48: { label: 'Fog', emoji: '🌫️', condition: 'cloudy' },
  51: { label: 'Light drizzle', emoji: '🌦️', condition: 'rainy' },
  61: { label: 'Rain', emoji: '🌧️', condition: 'rainy' },
  63: { label: 'Moderate rain', emoji: '🌧️', condition: 'rainy' },
  65: { label: 'Heavy rain', emoji: '🌧️', condition: 'rainy' },
  71: { label: 'Snow', emoji: '🌨️', condition: 'rainy' },
  80: { label: 'Rain showers', emoji: '🌦️', condition: 'rainy' },
  95: { label: 'Thunderstorm', emoji: '⛈️', condition: 'stormy' },
  96: { label: 'Thunderstorm + hail', emoji: '⛈️', condition: 'stormy' },
  99: { label: 'Severe thunderstorm', emoji: '⛈️', condition: 'stormy' }
};

export function describeWeatherCode(code) {
  return CONDITIONS_BY_CODE[code] || { label: 'Unknown', emoji: '🌡️', condition: 'cloudy' };
}

function pickAffectedCrops(catalog, filterFn, limit = 4) {
  return catalog.filter(filterFn).slice(0, limit).map((p) => p.name);
}

export function buildWeatherAlerts(dailyForecast, catalog) {
  const alerts = [];
  if (!dailyForecast || dailyForecast.length === 0) return alerts;

  dailyForecast.slice(0, 5).forEach((day) => {
    if (day.tempMin <= 2) {
      alerts.push({
        id: `frost-${day.date}`,
        type: 'frost',
        severity: day.tempMin <= -2 ? 'high' : 'medium',
        title: 'Frost warning',
        description: `Overnight lows near ${day.tempMin}°C are expected, risking frost damage to sensitive plants.`,
        expectedDate: day.date,
        affectedCrops: pickAffectedCrops(catalog, (p) => p.minTemp > day.tempMin),
        recommendation: 'Cover frost-sensitive plants overnight or bring potted crops indoors.'
      });
    }

    if (day.tempMax >= 35) {
      alerts.push({
        id: `heat-${day.date}`,
        type: 'heatwave',
        severity: day.tempMax >= 40 ? 'high' : 'medium',
        title: 'Heatwave alert',
        description: `Daytime highs of ${day.tempMax}°C may stress crops outside their optimal range.`,
        expectedDate: day.date,
        affectedCrops: pickAffectedCrops(catalog, (p) => p.maxTemp < day.tempMax),
        recommendation: 'Add shade cloth and water early morning or evening to reduce heat stress.'
      });
    }

    if (day.windSpeed >= 45) {
      alerts.push({
        id: `storm-${day.date}`,
        type: 'storm',
        severity: day.windSpeed >= 65 ? 'high' : 'medium',
        title: 'Storm warning',
        description: `Winds up to ${day.windSpeed} km/h are forecast, which can damage tall or exposed plants.`,
        expectedDate: day.date,
        affectedCrops: pickAffectedCrops(catalog, (p) => Number(p.plantSpacing) > 200),
        recommendation: 'Stake tall plants and secure greenhouse panels or row covers.'
      });
    }

    if (day.precipitation >= 25) {
      alerts.push({
        id: `flood-${day.date}`,
        type: 'flood',
        severity: day.precipitation >= 50 ? 'high' : 'low',
        title: 'Flood risk',
        description: `Heavy rainfall of ${day.precipitation}mm is expected, which may waterlog beds.`,
        expectedDate: day.date,
        affectedCrops: pickAffectedCrops(catalog, (p) => !String(p.soilType).toLowerCase().includes('sandy')),
        recommendation: 'Check drainage and consider raised beds for low-lying areas.'
      });
    }
  });

  const recentDays = dailyForecast.slice(0, 5);
  const totalPrecipitation = recentDays.reduce((sum, d) => sum + d.precipitation, 0);
  const avgMax = recentDays.reduce((sum, d) => sum + d.tempMax, 0) / recentDays.length;
  if (totalPrecipitation < 2 && avgMax >= 28) {
    alerts.push({
      id: 'drought-outlook',
      type: 'drought',
      severity: 'low',
      title: 'Dry outlook',
      description: 'Little rain and warm temperatures are forecast over the next 5 days.',
      expectedDate: recentDays[0].date,
      affectedCrops: pickAffectedCrops(catalog, (p) => Number(p.waterPerWeek) > 35),
      recommendation: 'Increase watering frequency for thirsty crops and mulch to retain soil moisture.'
    });
  }

  return alerts;
}