import { useEffect, useMemo, useState } from 'react';
import { loadPlantCatalog } from '../../utils/plantCatalog';
import {
  getProgressPercent,
  getGrowthStage,
  getEstimatedHarvestDate,
  GROWTH_STAGE_LABELS
} from '../../utils/growthStage';

// addCrop/updateCrop are passed down from CropDashboard (which owns the
// single useCrops() subscription) rather than called via a second useCrops()
// here, to avoid opening a duplicate Firestore listener per dialog open.
export default function AddCropDialog({ onClose, editingCrop, addCrop, updateCrop }) {
  const isEditing = Boolean(editingCrop);
  const [plants, setPlants] = useState([]);
  const [loadingPlants, setLoadingPlants] = useState(true);
  const [selectedName, setSelectedName] = useState(editingCrop?.name || '');
  const [plantingDate, setPlantingDate] = useState(editingCrop?.plantingDate || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPlantCatalog()
      .then((data) => {
        setPlants(data);
        setLoadingPlants(false);
      })
      .catch(() => {
        setError('Could not load the plant catalog.');
        setLoadingPlants(false);
      });
  }, []);

  const selectedPlant = useMemo(
    () => plants.find((p) => p.name === selectedName) || null,
    [plants, selectedName]
  );

  const preview = useMemo(() => {
    const daysToMaturity = selectedPlant?.daysToMaturity ?? editingCrop?.daysToMaturity;
    if (!plantingDate || !daysToMaturity) return null;
    const progressPercent = getProgressPercent(plantingDate, daysToMaturity);
    return {
      progressPercent,
      stage: GROWTH_STAGE_LABELS[getGrowthStage(progressPercent)],
      harvestDate: getEstimatedHarvestDate(plantingDate, daysToMaturity).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };
  }, [selectedPlant, plantingDate, editingCrop]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!isEditing && !selectedName) {
      setError('Please choose a vegetable.');
      return;
    }
    if (!plantingDate) {
      setError('Please choose a planting date.');
      return;
    }
    if (!isEditing && !selectedPlant) {
      setError('That vegetable could not be found in the catalog - please pick it from the list.');
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        const patch = { plantingDate };
        if (selectedPlant) {
          Object.assign(patch, {
            name: selectedPlant.name,
            daysToMaturity: selectedPlant.daysToMaturity,
            soilType: selectedPlant.soilType,
            phLevel: selectedPlant.phLevel,
            waterPerWeek: selectedPlant.waterPerWeek,
            minTemp: selectedPlant.minTemp,
            maxTemp: selectedPlant.maxTemp,
            hardinessZone: selectedPlant.hardinessZone,
            plantSpacing: selectedPlant.plantSpacing
          });
        }
        await updateCrop(editingCrop.id, patch);
      } else {
        await addCrop({
          name: selectedPlant.name,
          plantingDate,
          daysToMaturity: selectedPlant.daysToMaturity,
          soilType: selectedPlant.soilType,
          phLevel: selectedPlant.phLevel,
          waterPerWeek: selectedPlant.waterPerWeek,
          minTemp: selectedPlant.minTemp,
          maxTemp: selectedPlant.maxTemp,
          hardinessZone: selectedPlant.hardinessZone,
          plantSpacing: selectedPlant.plantSpacing
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save crop. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="cc-dialog-backdrop" onClick={onClose}>
      <div className="cc-dialog cc-dialog--crop" onClick={(e) => e.stopPropagation()}>
        <div className="cc-dialog__header">
          <h2 style={{ margin: 0 }}>{isEditing ? `Edit ${editingCrop.name}` : 'Add a New Crop'}</h2>
          <button type="button" className="cc-dialog__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="crop-vegetable">Vegetable</label>
          {loadingPlants ? (
            <p className="cc-muted">Loading plants…</p>
          ) : (
            <div className="cc-select-field">
              <select
                id="crop-vegetable"
                value={selectedName}
                onChange={(e) => setSelectedName(e.target.value)}
              >
                <option value="">
                  {isEditing ? `Keep current: ${editingCrop.name}` : 'Choose a vegetable'}
                </option>
                {plants.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <label htmlFor="crop-date">Date planted</label>
          <div className="cc-date-field">
            <input
              id="crop-date"
              type="date"
              value={plantingDate}
              onChange={(e) => setPlantingDate(e.target.value)}
            />
          </div>

          {preview && (
            <p className="cc-dialog__preview">
              {preview.progressPercent}% grown · {preview.stage} · harvest ~{preview.harvestDate}
            </p>
          )}

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" disabled={saving || loadingPlants}>
            {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Add Crop'}
          </button>
        </form>
      </div>
    </div>
  );
}
