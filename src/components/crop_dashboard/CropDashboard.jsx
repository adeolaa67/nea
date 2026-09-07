import { useState } from 'react';
import CropCard from './CropCard';
import AddCropDialog from './AddCropDialog';
import HarvestCalculator from '../crop_calculator/HarvestCalculator';
import './CropDashboard.css';

export default function CropDashboard({ weather, crops, loading, addCrop, updateCrop, deleteCrop }) {
  const [dialogState, setDialogState] = useState(null); // null | 'new' | crop object

  return (
    <div className="crop-dashboard">
      <div className="cc-card" style={{ marginBottom: 28 }}>
        <h2>Harvest Calculator</h2>
        <HarvestCalculator onAddToCrops={addCrop} />
      </div>

      <div className="crop-dashboard__header">
        <h2 className="crop-dashboard__title">
          Your <span className="crop-dashboard__title-accent">Crops:</span>
        </h2>
        <p className="crop-dashboard__count">
          {loading ? 'Loading…' : `${crops.length} crop${crops.length === 1 ? '' : 's'} tracked`}
        </p>
      </div>

      {weather && (
        <p className="crop-dashboard__weather">
          <span aria-hidden="true">{weather.emoji}</span>
          {' '}How's the weather been? {weather.label}, {weather.temperature}°C right now.
        </p>
      )}

      {loading && <p className="crop-dashboard__loading">Loading your crops…</p>}

      {!loading && (
        <div className="crop-dashboard__grid">
          {crops.map((crop) => (
            <CropCard
              key={crop.id}
              crop={crop}
              onEdit={(c) => setDialogState(c)}
              onDelete={deleteCrop}
            />
          ))}

          <button className="crop-add-card" onClick={() => setDialogState('new')}>
            <span className="crop-add-card__icon">+</span>
            <span>Add a crop</span>
          </button>
        </div>
      )}

      {dialogState && (
        <AddCropDialog
          editingCrop={dialogState === 'new' ? null : dialogState}
          addCrop={addCrop}
          updateCrop={updateCrop}
          onClose={() => setDialogState(null)}
        />
      )}
    </div>
  );
}
