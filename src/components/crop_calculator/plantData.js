export async function loadPlantData() {
    try {
        const response = await fetch('/plants.csv');
        const csvText = await response.text();
        const parsedPlants = parseCSV(csvText);
        return parsedPlants;
    } catch (error) {
        console.error('Error loading plant data:', error);
        return [];
    }
}

function parseCSV(csvText) {
    const lines = csvText.split('\n');
    const plantList = [];
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;
        const columns = line.split(',');
        if (columns.length < 13) continue;
        plantList.push({
            id: columns[0].trim(),
            name: columns[1].trim(),
            phLevel: columns[2].trim(),
            daysToMaturity: parseInt(columns[3].trim()) || 0,
            idealGrowthArea: columns[4].trim(),
            waterPerWeek: columns[5].trim(),
            soilType: columns[6].trim(),
            plantSpacing: columns[7].trim(),
            rootDepth: columns[8].trim(),
            hardinessZone: columns[9].trim(),
            minTemp: parseInt(columns[10].trim()) || 0,
            maxTemp: parseInt(columns[11].trim()) || 0,
            idealPlantDate: columns[12].trim()
        });
    }
    return plantList;
}