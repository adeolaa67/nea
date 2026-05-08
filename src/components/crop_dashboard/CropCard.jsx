import React from 'react';
import {
    calculateProgress,
    getGrowthStage,
    getGrowthStageClass,
    formatDateBritish,
    deleteCrop
} from '../../utils/cropUtils';

export default function CropCard({ crop, onDelete }) {
    const { progressPercent, daysRemaining, harvestDate } = calculateProgress(
        crop.plantingDate,
        crop.daysToMaturity
    );
    const stage = getGrowthStage(progressPercent);
    const stageClass = getGrowthStageClass(stage);

    async function handleDelete() {
        const confirmed = window.confirm(`Remove ${crop.name} from your crops?`);
        if (!confirmed) return;
        try {
            await deleteCrop(crop.id);
            onDelete(crop.id); 
        } catch (err) {
            console.error('Failed to delete crop:', err);
            alert('Could not delete crop. Please try again.');
        }
    }

    return (
        <div className="crop-card">

            {/* Header row */}
            <div className="crop-card__header">
                <h3 className="crop-card__name">{crop.name}</h3>
                <span className={`crop-card__stage ${stageClass}`}>{stage}</span>
            </div>

            {/* Progress bar */}
            <div className="crop-card__progress-track">
                <div
                    className="crop-card__progress-fill"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
            <p className="crop-card__progress-label">{progressPercent}% grown</p>

            {/* Details grid */}
            <div className="crop-card__details">
                <div className="crop-card__detail-item">
                    <span className="crop-card__detail-label">Planted</span>
                    <span className="crop-card__detail-value">
                        {formatDateBritish(crop.plantingDate)}
                    </span>
                </div>
                <div className="crop-card__detail-item">
                    <span className="crop-card__detail-label">
                        {progressPercent >= 100 ? 'Harvest date' : 'Est. harvest'}
                    </span>
                    <span className="crop-card__detail-value">
                        {formatDateBritish(harvestDate)}
                    </span>
                </div>
                <div className="crop-card__detail-item">
                    <span className="crop-card__detail-label">Days left</span>
                    <span className="crop-card__detail-value">
                        {progressPercent >= 100 ? 'Ready now!' : `${daysRemaining} days`}
                    </span>
                </div>
                <div className="crop-card__detail-item">
                    <span className="crop-card__detail-label">Soil</span>
                    <span className="crop-card__detail-value">{crop.soilType}</span>
                </div>
                <div className="crop-card__detail-item">
                    <span className="crop-card__detail-label">pH</span>
                    <span className="crop-card__detail-value">{crop.phLevel}</span>
                </div>
                <div className="crop-card__detail-item">
                    <span className="crop-card__detail-label">Temp range</span>
                    <span className="crop-card__detail-value">
                        {crop.minTemp}°C – {crop.maxTemp}°C
                    </span>
                </div>
            </div>

            {/* Delete button */}
            <button className="crop-card__delete-btn" onClick={handleDelete}>
                Remove crop
            </button>

        </div>
    );
}
