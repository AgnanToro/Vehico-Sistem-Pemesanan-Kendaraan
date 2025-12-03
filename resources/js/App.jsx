import './bootstrap';
import '../css/app.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import VehicleDetail from './pages/VehicleDetail';
import Bookings from './pages/Bookings';
import CreateBooking from './pages/CreateBooking';
import Approvals from './pages/Approvals';
import Users from './pages/Users';
import Profile from './pages/Profile';
import BookingDetail from './pages/BookingDetail';
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                        <Route index element={<Dashboard />} />
                        <Route path="vehicles" element={<Vehicles />} />
                        <Route path="vehicles/:id" element={<VehicleDetail />} />
                        <Route path="bookings" element={<Bookings />} />
                        <Route path="bookings/create" element={<CreateBooking />} />
                        <Route path="bookings/:id" element={<BookingDetail />} />
                        <Route path="approvals" element={<Approvals />} />
                        <Route path="users" element={<Users />} />
                        <Route path="profile" element={<Profile />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

