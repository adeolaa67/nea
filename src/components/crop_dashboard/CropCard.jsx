import {
  getProgressPercent,
  getGrowthStage,
  getEstimatedHarvestDate,
  getDaysUntilHarvest,
  GROWTH_STAGE_LABELS
} from '../../utils/growthStage';
import { getCropEmoji } from '../../utils/cropEmoji';
import { getCropCategory } from '../../utils/cropCategory';

function formatShortDate(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short'
  });
}

export default function CropCard({ crop, onEdit, onDelete }) {
  const progressPercent = getProgressPercent(crop.plantingDate, crop.daysToMaturity);
  const stage = getGrowthStage(progressPercent);
  const harvestDate = getEstimatedHarvestDate(crop.plantingDate, crop.daysToMaturity);
  const daysRemaining = getDaysUntilHarvest(crop.plantingDate, crop.daysToMaturity);
  const category = getCropCategory(crop.name);

  async function handleDelete() {
    if (!window.confirm(`Remove ${crop.name} from your crops?`)) return;
    try {
      await onDelete(crop);
    } catch (err) {
      console.error('Failed to delete crop:', err);
      alert('Could not delete crop. Please try again.');
    }
  }

  return (
    <div className="crop-card">
      <div className="crop-card__top">
        <div className="crop-card__identity">
          <span className="crop-card__badge">
            {crop.photoURL
              ? <img src={crop.photoURL} alt="" />
              : <span aria-hidden="true">{getCropEmoji(crop.name)}</span>}
          </span>
          <h3 className="crop-card__name">{crop.name}</h3>
        </div>
        <span className={`crop-card__stage stage-${stage}`}>{GROWTH_STAGE_LABELS[stage]}</span>
      </div>

      <span className="crop-card__category">{category}</span>

      <div className="crop-card__progress-row">
        <span>Growth Progress</span>
        <span>{progressPercent}%</span>
      </div>
      <div className="crop-card__progress-track">
        <div className="crop-card__progress-fill" style={{ width: `${progressPercent}%` }} />
      </div>

      <div className="crop-card__meta-row">
        <span className="crop-card__meta-icon" aria-hidden="true">🌱</span>
        <span>
          {progressPercent >= 100 ? 'Ready to harvest' : `Harvest: ${formatShortDate(harvestDate)}`}
        </span>
        <span className="crop-card__meta-days">
          {progressPercent >= 100 ? 'Ready now!' : `${daysRemaining} days left`}
        </span>
      </div>

      <div className="crop-card__meta-row">
        <span className="crop-card__meta-icon" aria-hidden="true">🌡️</span>
        <span>{crop.minTemp}–{crop.maxTemp}°C</span>
        <span className="crop-card__meta-days">💧 {crop.waterPerWeek}</span>
      </div>

      <div className="crop-card__actions">
        <button className="crop-card__edit-btn" onClick={() => onEdit(crop)}>Edit</button>
        <button className="crop-card__delete-btn cc-danger" onClick={handleDelete}>Remove</button>
      </div>
    </div>
  );
}
