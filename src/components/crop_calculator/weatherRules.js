export function getWeatherAdjustment(weatherCondition) {
    if (weatherCondition === 'sunny') return -3;
    if (weatherCondition === 'rainy') return 2;
    if (weatherCondition === 'cold') return 5;
    return 0;
}

export function getWeatherMessage(weatherCondition) {
    if (weatherCondition === 'sunny') return 'Sunny weather helped your plants grow faster.';
    if (weatherCondition === 'rainy') return 'Rainy weather slowed growth a little.';
    if (weatherCondition === 'cold') return 'Cold weather significantly slowed your plants.';
    return 'Normal weather conditions kept growth on track.';
}

export function formatWeatherDisplay(weatherAdjust) {
    if (weatherAdjust > 0) return `+${weatherAdjust} days`;
    return `${weatherAdjust} days`;
}