import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { getUserCrops } from '../../utils/cropUtils';
import CropCard from './CropCard';
import AddCropForm from './AddCropForm';
import './CropDashboard.css';

export default function CropDashboard() {
    const { currentUser } = useAuth();
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch crops from Firestore when the component mounts
    useEffect(() => {
        if (!currentUser) return;

        async function fetchCrops() {
            try {
                const userCrops = await getUserCrops(currentUser.uid);
                setCrops(userCrops);
            } catch (err) {
                console.error('Failed to fetch crops:', err);
                setError('Could not load your crops. Please refresh the page.');
            } finally {
                setLoading(false);
            }
        }

        fetchCrops();
    }, [currentUser]);

    // Called by AddCropForm after a successful save — adds the new crop to state immediately
    // so the user sees it without needing to refresh
    function handleCropAdded(newCrop) {
        setCrops(prev => [newCrop, ...prev]);
    }

    // Called by CropCard after a successful delete — removes the crop from state immediately
    function handleCropDeleted(cropId) {
        setCrops(prev => prev.filter(c => c.id !== cropId));
    }

    return (
        <section className="crop-dashboard">

            <div className="crop-dashboard__header">
                <h2 className="crop-dashboard__title">Your Crops</h2>
                {!loading && crops.length > 0 && (
                    <p className="crop-dashboard__count">
                        {crops.length} crop{crops.length !== 1 ? 's' : ''} growing
                    </p>
                )}
            </div>

            {/* Add crop form — always visible at the top */}
            <AddCropForm onCropAdded={handleCropAdded} />

            {/* Crop grid */}
            <div className="crop-dashboard__grid-section">
                {loading && (
                    <p className="crop-dashboard__loading">Loading your crops...</p>
                )}

                {error && (
                    <p className="crop-dashboard__error">{error}</p>
                )}

                {!loading && !error && crops.length === 0 && (
                    <div className="crop-dashboard__empty">
                        <p>You haven't added any crops yet.</p>
                        <p>Use the form above to track your first vegetable.</p>
                    </div>
                )}

                {!loading && crops.length > 0 && (
                    <div className="crop-dashboard__grid">
                        {crops.map(crop => (
                            <CropCard
                                key={crop.id}
                                crop={crop}
                                onDelete={handleCropDeleted}
                            />
                        ))}
                    </div>
                )}
            </div>

        </section>
    );
}
