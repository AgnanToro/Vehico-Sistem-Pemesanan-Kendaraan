import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useState, useEffect, useRef } from 'react';
import api from '../api';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const notifRef = useRef(null);

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data.data);
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error('Failed to load notifications', error);
        }
    };

const handleNotificationClick = async (notification) => {
        try {
            if (!notification.is_read) {
                await api.post(`/notifications/${notification.id}/read`);
            }
            setShowNotifications(false);
            if (notification.booking_id) {
                navigate('/bookings');
            }
            loadNotifications();
        } catch (error) {
            console.error('Failed to mark notification as read', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.post('/notifications/read-all');
            loadNotifications();
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 md:h-20">
                        <div className="flex items-center space-x-4 md:space-x-8">
                            <div className="flex items-center">
                                <img 
                                    src="/images/vehico.png" 
                                    alt="Vehico" 
                                    className="h-20 w-28 md:h-30 md:w-40 object-contain"
                                />
                            </div>
                            <div className="hidden md:flex space-x-2">
                                <Link 
                                    to="/" 
                                    className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                >
                                    Dashboard
                                </Link>
                                <Link 
                                    to="/vehicles" 
                                    className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                >
                                    Kendaraan
                                </Link>
                                {(user?.role?.name === 'admin' || user?.role?.name === 'driver') && (
                                    <Link 
                                        to="/bookings" 
                                        className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                    >
                                        Pemesanan
                                    </Link>
                                )}
                                {(user?.role?.name === 'approver_1' || user?.role?.name === 'approver_2') && (
                                    <Link 
                                        to="/approvals" 
                                        className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                    >
                                        Persetujuan
                                    </Link>
                                )}
                                {user?.role?.name === 'admin' && (
                                    <Link 
                                        to="/users" 
                                        className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                                    >
                                        Pengguna
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 md:space-x-4">
                            {/* Notification Bell */}
                            <div className="relative" ref={notifRef}>
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 md:p-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all duration-200"
                                >
                                    <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 md:px-2 md:py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full shadow-lg animate-pulse">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </button>

                                {/* Notification Dropdown */}
                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-[400px] md:max-h-[500px] overflow-hidden">
                                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 flex justify-between items-center">
                                            <h3 className="text-white font-bold text-sm md:text-base">Notifikasi</h3>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={markAllAsRead}
                                                    className="text-xs text-white hover:underline"
                                                >
                                                    Tandai Semua Dibaca
                                                </button>
                                            )}
                                        </div>
                                        <div className="overflow-y-auto max-h-[400px]">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center text-gray-500">
                                                    <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                    </svg>
                                                    <p className="font-medium">Tidak ada notifikasi</p>
                                                    <p className="text-sm text-gray-400 mt-1">Anda akan mendapat notifikasi di sini</p>
                                                </div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        onClick={() => handleNotificationClick(notif)}
                                                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition ${!notif.is_read ? 'bg-blue-50' : ''}`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                                                notif.type === 'booking_created' ? 'bg-blue-100' :
                                                                notif.type === 'booking_approved' ? 'bg-green-100' :
                                                                notif.type === 'booking_rejected' ? 'bg-red-100' :
                                                                notif.type === 'booking_completed' ? 'bg-purple-100' :
                                                                'bg-gray-100'
                                                            }`}>
                                                                <svg className={`w-5 h-5 ${
                                                                    notif.type === 'booking_created' ? 'text-blue-600' :
                                                                    notif.type === 'booking_approved' ? 'text-green-600' :
                                                                    notif.type === 'booking_rejected' ? 'text-red-600' :
                                                                    notif.type === 'booking_completed' ? 'text-purple-600' :
                                                                    'text-gray-600'
                                                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    {notif.type.includes('approved') ? (
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    ) : notif.type.includes('rejected') ? (
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    ) : notif.type.includes('completed') ? (
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    ) : (
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    )}
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-semibold text-gray-900 mb-1">{notif.title}</p>
                                                                <p className="text-xs text-gray-600 mb-2">{notif.message}</p>
                                                                <p className="text-xs text-gray-400">
                                                                    {new Date(notif.created_at).toLocaleString('id-ID', { 
                                                                        day: 'numeric', 
                                                                        month: 'short', 
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                            {!notif.is_read && (
                                                                <div className="flex-shrink-0">
                                                                    <span className="inline-block w-2 h-2 bg-blue-600 rounded-full"></span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <Link 
                                to="/profile" 
                                className="hidden sm:flex items-center gap-3 px-3 md:px-4 py-2 md:py-2.5 text-sm text-gray-700 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                            >
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm md:text-base shadow-lg group-hover:shadow-xl transition-shadow">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden lg:block text-left">
                                    <div className="font-semibold text-gray-900 text-sm">{user?.name}</div>
                                    <div className="text-xs text-gray-500">{user?.role?.description}</div>
                                </div>
                            </Link>
                            <button 
                                onClick={handleLogout} 
                                className="hidden sm:block px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-200"
                            >
                                Keluar
                            </button>
                            
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="sm:hidden p-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="sm:hidden border-t border-gray-200">
                            <div className="px-2 pt-2 pb-3 space-y-1">
                                <Link 
                                    to="/" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                                >
                                    Dashboard
                                </Link>
                                <Link 
                                    to="/vehicles" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                                >
                                    Kendaraan
                                </Link>
                                {(user?.role?.name === 'admin' || user?.role?.name === 'driver') && (
                                    <Link 
                                        to="/bookings" 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                                    >
                                        Pemesanan
                                    </Link>
                                )}
                                {(user?.role?.name === 'approver_1' || user?.role?.name === 'approver_2') && (
                                    <Link 
                                        to="/approvals" 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                                    >
                                        Persetujuan
                                    </Link>
                                )}
                                {user?.role?.name === 'admin' && (
                                    <Link 
                                        to="/users" 
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                                    >
                                        Pengguna
                                    </Link>
                                )}
                                <Link 
                                    to="/profile" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg"
                                >
                                    Profil
                                </Link>
                                <button 
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        handleLogout();
                                    }}
                                    className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg"
                                >
                                    Keluar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
            <main className="max-w-7xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
}
