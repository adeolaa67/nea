import React from 'react';
import { useLogin } from '../hooks/useLogin';
import '../App.css';
import Header from '../components/header';

export default function Login() {
    const { email, setEmail, password, setPassword, error, handleSubmit } = useLogin();

    return (
        <div className="page-container">
            <div className="blur-container">
                <Header />
                <h1 className="auth-title">Create Account</h1>
                <div className="auth-container">
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <label>Email:</label>
                        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        <br />
                        <label>Password:</label>
                        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        <div className="auth-spacer"></div>
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        <button type="submit">Create Account</button>
                    </form>
                </div>
            </div>
        </div>
    );
}