import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Welcome from './pages/welcome';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import About from './pages/about';
import Contact from './pages/contact';
import { AuthProvider } from './auth/AuthContext';
import RequireAuth from './auth/RequireAuth';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/" element={<Welcome />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;