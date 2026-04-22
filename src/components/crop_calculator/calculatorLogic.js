export function calculateHarvestDate(plant, plantingDateString, weatherAdjust) {
    if (!plant) {
        return { error: 'No plant information found' };
    }
    if (!plantingDateString) {
        return { error: 'Please enter a planting date' };
    }
    const plantDate = new Date(plantingDateString);
    if (isNaN(plantDate.getTime())) {
        return { error: 'Invalid date format' };
    }
    const baseDays = plant.daysToMaturity;
    const totalDays = baseDays + weatherAdjust;
    const harvestDate = new Date(plantDate);
    harvestDate.setDate(plantDate.getDate() + totalDays);
    const formattedHarvestDate = harvestDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    return {
        success: true,
        plantName: plant.name,
        plantingDate: plantDate.toLocaleDateString('en-GB'),
        harvestDate: formattedHarvestDate,
        baseDays: baseDays,
        weatherAdjust: weatherAdjust,
        totalDays: totalDays,
        soilType: plant.soilType,
        phLevel: plant.phLevel,
        waterPerWeek: plant.waterPerWeek,
        minTemp: plant.minTemp,
        maxTemp: plant.maxTemp
    };
}