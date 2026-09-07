import { useEffect, useMemo, useState } from 'react';
import { loadPlantCatalog } from '../utils/plantCatalog';
import { estimateZoneFromLatitude } from '../utils/hardinessZones';
import { getRecommendations, getPlantingWindow } from '../utils/plantRecommendations';
import { getCropEmoji } from '../utils/cropEmoji';

const ZONE_OPTIONS = Array.from({ length: 13 }, (_, i) => i + 1);

const DEFAULT_ZONE = 7;

export default function PlantingRecommendations({ position }) {
  const [catalog, setCatalog] = useState([]);
  const [manualZone, setManualZone] = useState(null);
  const [tab, setTab] = useState('plantable');

  useEffect(() => {
    loadPlantCatalog().then(setCatalog).catch(() => setCatalog([]));
  }, []);

  const zoneTouched = manualZone !== null;
  const zone = manualZone ?? (position ? estimateZoneFromLatitude(position.latitude) : DEFAULT_ZONE);

  const { plantable, alternatives } = useMemo(
    () => getRecommendations(catalog, zone),
    [catalog, zone]
  );

  const swappableAlternatives = alternatives.filter((a) => a.alternative);

  return (
    <div className="cc-card">
      <div className="cc-recommend__zone">
        <label htmlFor="zone-select" style={{ margin: 0 }}>Hardiness zone</label>
        <div className="cc-select-field">
          <select
            id="zone-select"
            value={zone}
            onChange={(e) => setManualZone(Number(e.target.value))}
          >
            {ZONE_OPTIONS.map((z) => (
              <option key={z} value={z}>Zone {z}</option>
            ))}
          </select>
        </div>
        {position && !zoneTouched && (
          <span className="cc-muted">📍 estimated from your location</span>
        )}
      </div>

      <div className="cc-recommend__tabs">
        <button
          className={`cc-recommend__tab ${tab === 'plantable' ? 'cc-recommend__tab--active' : ''}`}
          onClick={() => setTab('plantable')}
        >
          Plant now ({plantable.length})
        </button>
        <button
          className={`cc-recommend__tab ${tab === 'alternatives' ? 'cc-recommend__tab--active' : ''}`}
          onClick={() => setTab('alternatives')}
        >
          Alternatives ({swappableAlternatives.length})
        </button>
      </div>

      {tab === 'plantable' && (
        <div className="cc-recommend__grid">
          {plantable.length === 0 && <p className="cc-muted">No matches for this zone right now.</p>}
          {plantable.map((plant) => (
            <div className="cc-plant-tile" key={plant.id}>
              <div className="cc-plant-tile__name">
                <span>{getCropEmoji(plant.name)}</span>
                {plant.name}
              </div>
              <div className="cc-plant-tile__window">Planting window: {getPlantingWindow(plant)}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'alternatives' && (
        <div className="cc-recommend__grid">
          {swappableAlternatives.length === 0 && (
            <p className="cc-muted">Nothing needs an alternative right now.</p>
          )}
          {swappableAlternatives.map(({ plant, alternative }) => (
            <div className="cc-plant-tile" key={plant.id}>
              <div className="cc-plant-tile__name">
                <span>{getCropEmoji(plant.name)}</span>
                {plant.name}
              </div>
              <div className="cc-plant-tile__window">Out of window: {getPlantingWindow(plant)}</div>
              <div className="cc-plant-tile__alt">
                Try instead: {getCropEmoji(alternative.name)} {alternative.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
