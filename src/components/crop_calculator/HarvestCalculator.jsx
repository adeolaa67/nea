import React, { useState, useEffect } from 'react';
import { loadPlantData } from './plantData';
import { getWeatherAdjustment, getWeatherMessage, formatWeatherDisplay } from './weatherRules';
import { calculateHarvestDate } from './calculatorLogic';

function HarvestCalculator() {
    const [plants, setPlants] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState('');
    const [plantingDate, setPlantingDate] = useState('');
    const [weather, setWeather] = useState('normal');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const data = await loadPlantData();
            setPlants(data || []);
            setLoading(false);
        }
        fetchData();
    }, []);

    const handleCalculate = () => {
        if (!selectedPlant) {
            alert('Please select a vegetable');
            return;
        }
        if (!plantingDate) {
            alert('Please enter a planting date');
            return;
        }
        const plant = plants.find(p => p.name === selectedPlant);
        if (!plant) return;
        const weatherAdjust = getWeatherAdjustment(weather);
        const calculation = calculateHarvestDate(plant, plantingDate, weatherAdjust);
        if (calculation.error) {
            alert(calculation.error);
            return;
        }
        setResult({
            ...calculation,
            weatherMessage: getWeatherMessage(weather)
        });
    };

    if (loading) return <div>Loading your garden data...</div>;

    return (
        <div className="calculator-container">
            <h1>The Crop Companion</h1>
            <p>Know exactly when to harvest your vegetables</p>

            <div className="form-group">
                <label>What did you plant?</label>
                <select value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)}>
                    <option value="">-- Choose a vegetable --</option>
                    {plants.map((plant, index) => (
                        <option key={index} value={plant.name}>{plant.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>When did you plant it?</label>
                <input type="date" value={plantingDate} onChange={(e) => setPlantingDate(e.target.value)} />
            </div>

            <div className="form-group">
                <label>How has the weather been? (first 2 weeks)</label>
                <div className="weather-options">
                    <label><input type="radio" name="weather" value="sunny" checked={weather === 'sunny'} onChange={(e) => setWeather(e.target.value)} /> Sunny (faster)</label>
                    <label><input type="radio" name="weather" value="normal" checked={weather === 'normal'} onChange={(e) => setWeather(e.target.value)} /> Normal</label>
                    <label><input type="radio" name="weather" value="rainy" checked={weather === 'rainy'} onChange={(e) => setWeather(e.target.value)} /> Rainy (slower)</label>
                    <label><input type="radio" name="weather" value="cold" checked={weather === 'cold'} onChange={(e) => setWeather(e.target.value)} /> Cold (much slower)</label>
                </div>
            </div>

            <button onClick={handleCalculate}>Calculate Harvest Date</button>

            {result && (
                <div className="result-box">
                    <h3>Your Harvest Prediction</h3>
                    <p><strong>Plant:</strong> {result.plantName}</p>
                    <p><strong>Planted on:</strong> {result.plantingDate}</p>
                    <p><strong>Soil type:</strong> {result.soilType}</p>
                    <p><strong>Soil pH:</strong> {result.phLevel}</p>
                    <p><strong>Water per week:</strong> {result.waterPerWeek} cm</p>
                    <p><strong>Temp range:</strong> {result.minTemp}°C - {result.maxTemp}°C</p>
                    <p><strong>Normal growing time:</strong> {result.baseDays} days</p>
                    <p><strong>Weather adjustment:</strong> {formatWeatherDisplay(result.weatherAdjust)}</p>
                    <p><strong>{result.weatherMessage}</strong></p>
                    <p><strong>Total days:</strong> {result.totalDays}</p>
                    <p><strong>Harvest date:</strong> {result.harvestDate}</p>
                </div>
            )}
        </div>
    );
}

export default HarvestCalculator;