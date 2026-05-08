// src/pages/dashboard.jsx
// Clean dashboard layout — no debug logs, no black text box.

import React from 'react';
import '../App.css';
import Header from '../components/header';
import HarvestCalculator from '../components/crop_calculator/HarvestCalculator';
import CropDashboard from '../components/crop_dashboard/CropDashboard';

export default function Dashboard() {
    return (
        <div className="page-container">
            <Header />
            <div className="dashboard-wrapper">
                <HarvestCalculator />
                <CropDashboard />
            </div>
        </div>
    );
}