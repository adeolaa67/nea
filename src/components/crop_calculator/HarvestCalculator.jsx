import { useState, useEffect, useRef } from 'react';
import { loadPlantData } from './plantData';
import { getWeatherAdjustment, getWeatherMessage, formatWeatherDisplay } from './weatherRules';
import { calculateHarvestDate } from './calculatorLogic';
import './HarvestCalculator.css';

const LOADER_MS = 1700;

function HarvestCalculator({ onAddToCrops }) {
    const [plants, setPlants] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState('');
    const [plantingDate, setPlantingDate] = useState('');
    const [weather, setWeather] = useState('normal');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [calculating, setCalculating] = useState(false);
    const [formError, setFormError] = useState('');
    const [showDetails, setShowDetails] = useState(false);
    const [addState, setAddState] = useState('idle'); // idle | saving | saved | error
    const timerRef = useRef(null);

    useEffect(() => {
        async function fetchData() {
            const data = await loadPlantData();
            setPlants(data || []);
            setLoading(false);
        }
        fetchData();
    }, []);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    const handleCalculate = () => {
        setFormError('');
        if (!selectedPlant) {
            setFormError('Please select a vegetable.');
            return;
        }
        if (!plantingDate) {
            setFormError('Please enter a planting date.');
            return;
        }
        const plant = plants.find(p => p.name === selectedPlant);
        if (!plant) {
            setFormError('Could not find that vegetable - please choose it from the list.');
            return;
        }
        const weatherAdjust = getWeatherAdjustment(weather);
        const calculation = calculateHarvestDate(plant, plantingDate, weatherAdjust);
        if (calculation.error) {
            setFormError(calculation.error);
            return;
        }

        setResult(null);
        setShowDetails(false);
        setAddState('idle');
        setCalculating(true);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            setResult({
                ...calculation,
                weatherMessage: getWeatherMessage(weather)
            });
            setCalculating(false);
        }, LOADER_MS);
    };

    async function handleAddToCrops() {
        const plant = plants.find(p => p.name === selectedPlant);
        if (!plant || !plantingDate || !onAddToCrops) return;
        setAddState('saving');
        try {
            await onAddToCrops({
                name: plant.name,
                plantingDate,
                daysToMaturity: plant.daysToMaturity,
                soilType: plant.soilType,
                phLevel: plant.phLevel,
                waterPerWeek: plant.waterPerWeek,
                minTemp: plant.minTemp,
                maxTemp: plant.maxTemp,
                hardinessZone: plant.hardinessZone,
                plantSpacing: plant.plantSpacing
            });
            setAddState('saved');
        } catch (err) {
            console.error('Failed to add crop from calculator:', err);
            setAddState('error');
        }
    }

    if (loading) return <div className="hc-loading">Loading your garden data…</div>;

    return (
        <div className="calculator-container">
            <p className="hc-intro">Know exactly when to harvest your vegetables</p>

            <div className="form-group">
                <label>What did you plant?</label>
                <div className="hc-select-wrap">
                    <select value={selectedPlant} onChange={(e) => setSelectedPlant(e.target.value)} disabled={calculating}>
                        <option value="">-- Choose a vegetable --</option>
                        {plants.map((plant, index) => (
                            <option key={index} value={plant.name}>{plant.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label>When did you plant it?</label>
                <div className="hc-date-wrap">
                    <input
                        type="date"
                        value={plantingDate}
                        onChange={(e) => setPlantingDate(e.target.value)}
                        disabled={calculating}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>How has the weather been? (first 2 weeks)</label>
                <div className="weather-options">
                    <label><input type="radio" name="weather" value="sunny" checked={weather === 'sunny'} onChange={(e) => setWeather(e.target.value)} disabled={calculating} /> Sunny (faster)</label>
                    <label><input type="radio" name="weather" value="normal" checked={weather === 'normal'} onChange={(e) => setWeather(e.target.value)} disabled={calculating} /> Normal</label>
                    <label><input type="radio" name="weather" value="rainy" checked={weather === 'rainy'} onChange={(e) => setWeather(e.target.value)} disabled={calculating} /> Rainy (slower)</label>
                    <label><input type="radio" name="weather" value="cold" checked={weather === 'cold'} onChange={(e) => setWeather(e.target.value)} disabled={calculating} /> Cold (much slower)</label>
                </div>
            </div>

            {formError && <p className="hc-error">{formError}</p>}

            <button onClick={handleCalculate} disabled={calculating}>
                {calculating ? 'Calculating…' : 'Calculate Harvest Date'}
            </button>

            {calculating && (
                <div className="hc-loader">
                    <svg viewBox="0 0 100 100" className="hc-loader__svg" aria-hidden="true">
                        <path
                            className="hc-loader__outline"
                            d="M50 6 C22 22 10 55 50 94 C90 55 78 22 50 6 Z"
                        />
                        <line className="hc-loader__vein" x1="50" y1="20" x2="50" y2="80" />
                    </svg>
                    <p className="hc-loader__text">Growing your prediction…</p>
                </div>
            )}

            {result && !calculating && (
                <div className="result-box hc-result">
                    <h3>Your Harvest Prediction</h3>
                    <div className="hc-result__headline">
                        <span>{result.plantName} · planted {result.plantingDate}</span>
                        <span className="hc-result__date">Harvest around {result.harvestDate}</span>
                    </div>

                    <button
                        type="button"
                        className="hc-result__toggle"
                        onClick={() => setShowDetails((v) => !v)}
                    >
                        {showDetails ? 'Show less ▲' : 'Show more ▼'}
                    </button>

                    {showDetails && (
                        <div className="hc-result__details">
                            <div className="hc-result__grid">
                                <p><strong>Soil type:</strong> {result.soilType}</p>
                                <p><strong>Soil pH:</strong> {result.phLevel}</p>
                                <p><strong>Water per week:</strong> {result.waterPerWeek} cm</p>
                                <p><strong>Temp range:</strong> {result.minTemp}°C - {result.maxTemp}°C</p>
                                <p><strong>Normal growing time:</strong> {result.baseDays} days</p>
                                <p><strong>Weather adjustment:</strong> {formatWeatherDisplay(result.weatherAdjust)}</p>
                            </div>
                            <p className="hc-result__weather-message">{result.weatherMessage}</p>
                        </div>
                    )}

                    {onAddToCrops && (
                        <button
                            type="button"
                            className="hc-result__add-btn"
                            onClick={handleAddToCrops}
                            disabled={addState === 'saving' || addState === 'saved'}
                        >
                            {addState === 'saved' ? 'Added to Your Crops ✓' : addState === 'saving' ? 'Adding…' : 'Add to My Crops'}
                        </button>
                    )}
                    {addState === 'error' && <p className="hc-error">Could not add this crop. Please try again.</p>}
                </div>
            )}
        </div>
    );
}

export default HarvestCalculator;
