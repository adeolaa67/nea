import React, { useState } from 'react';
import { useLogin } from '../hooks/useLogin';
import Header from '../components/header';
import '../App.css';

export default function Login() {
    const [mode, setMode] = useState('login');
    const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLogin();
    const isSignup = mode === 'signup';

    function scrollToForm() {
        document.getElementById('auth-form-card')?.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <div className="page-container login-page">
            <Header />

            {/* Hero — matches "Welcome. / The Crop Companion" in mockup */}
            <div className="login-hero">
                <h1 className="login-hero__welcome">Welcome.</h1>
                <p className="login-hero__title">The Crop Companion</p>
                <p className="login-hero__tagline">
                    Get personalised harvest predictions, weather alerts
                    to protect your crops, and smart recommendations
                    based on your location. Your complete farming companion!
                </p>
                <div className="login-hero__buttons">
                    <button className="btn-hero" onClick={scrollToForm}>
                        📍 Set Location
                    </button>
                    <button className="btn-hero" onClick={scrollToForm}>
                        🌱 View My Crops
                    </button>
                </div>
            </div>

            {/* Auth card */}
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
    );
}