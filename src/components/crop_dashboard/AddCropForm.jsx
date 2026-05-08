import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { addCrop } from '../../utils/cropUtils';

export default function AddCropForm({ onCropAdded }) {
    const { currentUser } = useAuth();

    const [plants, setPlants] = useState([]);
    const [loadingPlants, setLoadingPlants] = useState(true);
    const [selectedPlantName, setSelectedPlantName] = useState('');
    const [plantingDate, setPlantingDate] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Load plants.csv from the public folder on mount
    useEffect(() => {
        fetch('/plants.csv')
            .then(res => {
                if (!res.ok) throw new Error('Could not load plants.csv');
                return res.text();
            })
            .then(csvText => {
                const parsed = parseCSV(csvText);
                setPlants(parsed);
                setLoadingPlants(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingPlants(false);
            });
    }, []);

    // Parse CSV — skips header row, handles quoted fields
    function parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const result = [];
        for (let i = 1; i < lines.length; i++) {
            const cols = splitCSVLine(lines[i].trim());
            if (cols.length < 12) continue;
            result.push({
                name:           cols[1].trim(),
                phLevel:        cols[2].trim(),
                daysToMaturity: parseInt(cols[3].trim()),
                waterPerWeek:   cols[5].trim(),
                soilType:       cols[6].trim(),
                minTemp:        cols[10].trim(),
                maxTemp:        cols[11].trim(),
            });
        }
        return result;
    }

    // Handles quoted commas in CSV
    function splitCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') { inQuotes = !inQuotes; }
            else if (line[i] === ',' && !inQuotes) { result.push(current); current = ''; }
            else { current += line[i]; }
        }
        result.push(current);
        return result;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setSuccess('');

        const plant = plants.find(p => p.name === selectedPlantName);
        if (!plant) { setError('Please select a vegetable.'); return; }
        if (!plantingDate) { setError('Please enter a planting date.'); return; }

        setSaving(true);
        try {
            const newId = await addCrop(currentUser.uid, {
                name:           plant.name,
                plantingDate:   plantingDate,
                daysToMaturity: plant.daysToMaturity,
                soilType:       plant.soilType,
                phLevel:        plant.phLevel,
                waterPerWeek:   plant.waterPerWeek,
                minTemp:        plant.minTemp,
                maxTemp:        plant.maxTemp,
            });

            // Tell the parent to add this crop to the list immediately
            onCropAdded({
                id:             newId,
                userId:         currentUser.uid,
                name:           plant.name,
                plantingDate:   plantingDate,
                daysToMaturity: plant.daysToMaturity,
                soilType:       plant.soilType,
                phLevel:        plant.phLevel,
                waterPerWeek:   plant.waterPerWeek,
                minTemp:        plant.minTemp,
                maxTemp:        plant.maxTemp,
            });

            setSuccess(`${plant.name} added to your crops!`);
            setSelectedPlantName('');
            setPlantingDate('');
        } catch (err) {
            console.error(err);
            setError('Failed to save crop. Please try again.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="add-crop-form">
            <h3 className="add-crop-form__title">Add a New Crop</h3>

            <form onSubmit={handleSubmit}>

                <div className="add-crop-form__field">
                    <label className="add-crop-form__label">Vegetable</label>
                    {loadingPlants ? (
                        <p className="add-crop-form__loading">Loading plants...</p>
                    ) : (
                        <select
                            className="add-crop-form__select"
                            value={selectedPlantName}
                            onChange={e => setSelectedPlantName(e.target.value)}
                        >
                            <option value="">-- Choose a vegetable --</option>
                            {plants.map((p, i) => (
                                <option key={i} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="add-crop-form__field">
                    <label className="add-crop-form__label">Date planted</label>
                    <input
                        className="add-crop-form__input"
                        type="date"
                        value={plantingDate}
                        onChange={e => setPlantingDate(e.target.value)}
                    />
                </div>

                {error && <p className="add-crop-form__error">{error}</p>}
                {success && <p className="add-crop-form__success">{success}</p>}

                <button
                    type="submit"
                    className="add-crop-form__btn"
                    disabled={saving || loadingPlants}
                >
                    {saving ? 'Saving...' : 'Add Crop'}
                </button>

            </form>
        </div>
    );
}
