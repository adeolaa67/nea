import '../App.css';
import Header from '../components/header';
import HarvestCalculator from '../components/crop_calculator/HarvestCalculator';
console.log('HarvestCalculator:', HarvestCalculator);

export default function Dashboard() {
    return (
        <div className="page-container">
            <div className="blur-container">
                <Header />
                <h1 className="dashboard-title">Dashboard</h1>
                <div>
                    <h2>Test Component</h2>
                    {HarvestCalculator ? <HarvestCalculator /> : <p>Component not found</p>}
                </div>
            </div>
        </div>
    );
}