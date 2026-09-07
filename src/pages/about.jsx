import { Link } from 'react-router-dom';
import FallingParticles from '../components/FallingParticles';
import '../styles/about.css';

const PETALS = ['🌸', '🌸', '🌸', '🍃'];

const FEATURES = [
  { icon: '🌦️', title: 'Live weather + alerts', body: 'Frost, heat, storm and flood warnings for your exact crops, before they happen.' },
  { icon: '🌱', title: 'Harvest predictions', body: 'Tell us what you planted and when - we\'ll tell you exactly when it\'ll be ready.' },
  { icon: '📍', title: 'Location-aware advice', body: 'Planting windows and recommendations tuned to your real climate, not a generic chart.' },
  { icon: '🔔', title: 'Push notifications', body: 'A gentle nudge the moment your garden needs attention, even when the tab is closed.' }
];

export default function About() {
  return (
    <div className="cc-about">
      {/* Fixed to the viewport (not the scene) so petals keep drifting past
          the header and feature grid as the page scrolls, instead of
          disappearing once the hero scrolls out of view. */}
      <FallingParticles emojis={PETALS} count={26} className="cc-about__petals-overlay" />

      <header className="cc-about__nav">
        <Link to="/" className="cc-about__brand">
          <span aria-hidden="true">🌿</span>
          <span>Crop Companion</span>
        </Link>
        <Link to="/" className="cc-about__back">← Back home</Link>
      </header>

      <section className="cc-blossom-scene">
        <div className="cc-blossom-tree cc-blossom-tree--left">
          <div className="cc-blossom-tree__canopy" />
          <div className="cc-blossom-tree__trunk" />
        </div>
        <div className="cc-blossom-tree cc-blossom-tree--right">
          <div className="cc-blossom-tree__canopy" />
          <div className="cc-blossom-tree__trunk" />
        </div>
        <div className="cc-blossom-scene__ground" />

        <div className="cc-blossom-scene__copy">
          <p className="cc-section__eyebrow">About Crop Companion</p>
          <h1>Grow with confidence.</h1>
          <p className="cc-blossom-scene__lede">
            The Crop Companion turns guesswork into a plan. Tell us what you've planted and
            where, and we'll track it from seed to harvest - pairing live weather data with
            agronomic know-how to warn you the moment frost, heat or a storm threatens your
            garden, and to tell you exactly when your vegetables will be ready to pick.
          </p>
          <p className="cc-blossom-scene__lede">
            No more googling planting charts or squinting at an almanac. Get personalised
            harvest predictions, real-time weather alerts, and smart planting recommendations
            tuned to your exact location - all in one calm, green corner of the internet built
            for people who'd rather be outside than staring at a spreadsheet.
          </p>
          <p className="cc-blossom-scene__lede">
            Whether you're tending a single balcony pot or a full backyard plot, Crop Companion
            is the quiet, reliable helper that makes growing your own food easier, more
            predictable, and a lot more fun.
          </p>
          <Link to="/" className="cc-blossom-scene__cta">Start growing →</Link>
        </div>
      </section>

      <section className="cc-about__features">
        {FEATURES.map((f) => (
          <div className="cc-about__feature" key={f.title}>
            <span className="cc-about__feature-icon" aria-hidden="true">{f.icon}</span>
            <h3>{f.title}</h3>
            <p>{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
