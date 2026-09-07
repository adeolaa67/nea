import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="cc-footer">
      <div className="cc-footer__brand">🌿 Crop Companion</div>
      <p className="cc-footer__tagline">Your complete farming companion.</p>
      <div className="cc-footer__links">
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </footer>
  );
}
