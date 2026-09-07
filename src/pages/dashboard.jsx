import { useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import '../styles/landing.css';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import WeatherWidget from '../components/WeatherWidget';
import WeatherAlerts from '../components/WeatherAlerts';
import CropDashboard from '../components/crop_dashboard/CropDashboard';
import PlantingRecommendations from '../components/PlantingRecommendations';
import Footer from '../components/Footer';
import { useGeolocation } from '../hooks/useGeolocation';
import { useLocationOverride } from '../hooks/useLocationOverride';
import { useWeather } from '../hooks/useWeather';
import { useCrops } from '../hooks/useCrops';
import { useSyncLocation } from '../hooks/useSyncLocation';
import FallingParticles from '../components/FallingParticles';

export default function Dashboard() {
  const routerLocation = useLocation();
  const [searchParams] = useSearchParams();
  const wantsLocationPrompt = searchParams.get('setLocation') === '1';

  // Wired once here so WeatherWidget and WeatherAlerts share a single
  // geolocation read and a single Open-Meteo fetch instead of duplicating it.
  const { position: geoPosition, status: geoStatus, error: geoError, requestLocation } = useGeolocation();
  const { override, setOverride, searchLocation } = useLocationOverride();
  const position = override ? { latitude: override.latitude, longitude: override.longitude } : geoPosition;
  const { weather, locationLabel: autoLabel, loading, error } = useWeather(position);
  const locationLabel = override?.label || autoLabel;
  const { crops, loading: cropsLoading, addCrop, updateCrop, deleteCrop } = useCrops();
  useSyncLocation(position);

  useEffect(() => {
    if (routerLocation.hash) {
      const el = document.querySelector(routerLocation.hash);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (wantsLocationPrompt) {
      document.getElementById('alerts')?.scrollIntoView({ behavior: 'smooth' });
    }
    // Only react on initial navigation into the dashboard, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="cc-page">
      <NavBar />
      <Hero />

      <main className="cc-main">
        <section className="cc-section" id="alerts">
          <div className="cc-section__header">
            <div>
              <p className="cc-section__eyebrow">Live conditions</p>
              <h2>Weather &amp; Alerts</h2>
            </div>
          </div>
          <WeatherWidget
            weather={weather}
            locationLabel={locationLabel}
            loading={loading}
            error={error}
            geoStatus={geoStatus}
            geoError={geoError}
            onRetryLocation={requestLocation}
            hasOverride={Boolean(override)}
            onClearOverride={() => setOverride(null)}
            onSearchLocation={searchLocation}
            autoOpenSearch={wantsLocationPrompt}
          />
          <div style={{ marginTop: 20 }}>
            <WeatherAlerts forecast={weather?.forecast} catalog={crops} />
          </div>
        </section>

        <section className="cc-section cc-section--crops" id="my-crops">
          <FallingParticles variant="leaf" count={16} />
          <div className="cc-section--crops__content">
            <CropDashboard
              weather={weather}
              crops={crops}
              loading={cropsLoading}
              addCrop={addCrop}
              updateCrop={updateCrop}
              deleteCrop={deleteCrop}
            />
          </div>
        </section>

        <section className="cc-section" id="recommendations">
          <div className="cc-section__header">
            <div>
              <p className="cc-section__eyebrow">What to plant</p>
              <h2>Planting Recommendations</h2>
            </div>
          </div>
          <PlantingRecommendations position={position} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
