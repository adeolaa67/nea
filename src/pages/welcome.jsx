import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import FallingParticles from '../components/FallingParticles';
import '../styles/welcome.css';

export default function Welcome() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  function goTo(destination) {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate(destination);
  }

  return (
    <div className="cc-welcome">
      <FallingParticles variant="leaf" count={18} />

      <header className="cc-welcome__nav">
        <Link to="/" className="cc-welcome__brand">
          <span aria-hidden="true">🌿</span>
          <span>Crop Companion</span>
        </Link>
        <nav className="cc-welcome__nav-links">
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {currentUser ? (
            <Link to="/dashboard" className="cc-welcome__nav-cta">Dashboard</Link>
          ) : (
            <Link to="/login" className="cc-welcome__nav-cta">Log in</Link>
          )}
        </nav>
      </header>

      <div className="cc-welcome__hero">
        <h1 className="cc-welcome__title">Welcome.</h1>
        <p className="cc-welcome__subtitle">To The Crop Companion</p>
        <p className="cc-welcome__tagline">
          Get personalised harvest predictions, weather alerts to protect your
          crops, and smart planting recommendations built around your exact
          location. Your complete farming companion.
        </p>

        <div className="cc-welcome__actions">
          <button className="cc-leaf-btn" onClick={() => goTo('/dashboard?setLocation=1')}>
            <span>Set Location</span>
          </button>
          <button className="cc-leaf-btn" onClick={() => goTo('/dashboard#my-crops')}>
            <span>View My Crops</span>
          </button>
        </div>
      </div>
    </div>
  );
}
