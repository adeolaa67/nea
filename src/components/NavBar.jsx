import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/landing.css';

const NAV_LINKS = [
  { href: '#my-crops', label: 'My Crops' },
  { href: '#alerts', label: 'Alerts' },
  { href: '#recommendations', label: 'Recommendations' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className={`cc-navbar ${scrolled ? 'cc-navbar--scrolled' : ''}`}>
      <div className="cc-navbar__inner">
        <Link to="/" className="cc-navbar__brand">
          <span aria-hidden="true">🌿</span>
          <span>Crop Companion</span>
        </Link>
        <div className="cc-navbar__links">
          {NAV_LINKS.map((link) => (
            link.href.startsWith('/')
              ? <Link key={link.href} to={link.href}>{link.label}</Link>
              : <a key={link.href} href={link.href}>{link.label}</a>
          ))}
          <button className="cc-navbar__logout" onClick={handleLogout}>Log out</button>
        </div>
      </div>
    </nav>
  );
}