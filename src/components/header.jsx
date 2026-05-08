// src/components/header.jsx
// Matches mockup header: logo left, email + logout right.

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

function Header() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    }

    return (
        <div className="header-container">
            <div className="header-left">
                <p className="header-logo">THE CROP COMPANION</p>
            </div>
            <div className="header-right">
                {currentUser ? (
                    <>
                        <p className="header-user-email">{currentUser.email}</p>
                        <button className="header-logout-btn" onClick={handleLogout}>
                            Log Out
                        </button>
                    </>
                ) : (
                    <button className="header-logout-btn" onClick={() => navigate('/')}>
                        Log In
                    </button>
                )}
            </div>
        </div>
    );
}

export default Header;
