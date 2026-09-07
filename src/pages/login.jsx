import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import FallingParticles from '../components/FallingParticles';
import '../App.css';

export default function Login() {
    const [mode, setMode] = useState('login');
    const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLogin();
    const isSignup = mode === 'signup';

    return (
        <div className="page-container login-page">
            <FallingParticles variant="leaf" count={12} />

            <header className="login-page__nav">
                <Link to="/" className="login-page__brand">
                    <span aria-hidden="true">🌿</span>
                    <span>Crop Companion</span>
                </Link>
                <div className="login-page__nav-links">
                    <Link to="/about">About Us</Link>
                    <Link to="/contact">Contact Us</Link>
                </div>
            </header>

            <div className="login-page__center">
                <div className="auth-card" id="auth-form-card">
                    <h2 className="auth-card__title">
                        {isSignup ? 'Create An Account' : 'Welcome Back'}
                    </h2>

                    <div className="auth-tabs">
                        <button
                            type="button"
                            className={`auth-tab ${!isSignup ? 'auth-tab--active' : ''}`}
                            onClick={() => setMode('login')}
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            className={`auth-tab ${isSignup ? 'auth-tab--active' : ''}`}
                            onClick={() => setMode('signup')}
                        >
                            Create Account
                        </button>
                    </div>

                    <form className="auth-form" onSubmit={(e) => handleSubmit(e, mode)}>
                        <label>Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@email.com"
                        />
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
                        />
                        {error && <p className="auth-error">{error}</p>}
                        <div className="auth-spacer" />
                        <button type="submit" disabled={loading}>
                            {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Log In'}
                        </button>
                    </form>

                    <p className="auth-switch">
                        {isSignup ? (
                            <>Already have an account?{' '}
                                <button type="button" className="auth-link" onClick={() => setMode('login')}>
                                    Log in
                                </button>
                            </>
                        ) : (
                            <>New here?{' '}
                                <button type="button" className="auth-link" onClick={() => setMode('signup')}>
                                    Create an account
                                </button>
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
