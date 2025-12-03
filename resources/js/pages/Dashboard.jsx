import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [vehicleUsage, setVehicleUsage] = useState([]);
    const [fuelData, setFuelData] = useState([]);
    const [serviceSchedule, setServiceSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [statsRes, usageRes, fuelRes, serviceRes] = await Promise.all([
                api.get('/dashboard/stats'),
                api.get('/dashboard/vehicle-usage'),
                api.get('/dashboard/fuel-consumption'),
                api.get('/monitoring/service-schedule'),
            ]);
            setStats(statsRes.data);
            setVehicleUsage(usageRes.data);
            setFuelData(fuelRes.data);
            setServiceSchedule(serviceRes.data);
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setLoading(false);
        }
    };

    const exportBookings = async () => {
        try {
            const response = await api.get('/reports/export-bookings', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `laporan_pemesanan_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            alert('Laporan berhasil diunduh!');
        } catch (error) {
            console.error('Failed to export bookings', error);
            alert('Gagal mengunduh laporan');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Memuat dashboard...</div>
        </div>
    );

    if (!stats) return null;

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Ringkasan sistem pemesanan kendaraan</p>
                </div>
                <button 
                    onClick={exportBookings} 
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Ekspor Laporan (Excel)
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total Kendaraan</p>
                            <p className="text-4xl font-bold mt-2">{stats.total_vehicles}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Tersedia</p>
                            <p className="text-4xl font-bold mt-2">{stats.available_vehicles}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Sedang Digunakan</p>
                            <p className="text-4xl font-bold mt-2">{stats.in_use_vehicles}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Menunggu Persetujuan</p>
                            <p className="text-4xl font-bold mt-2">{stats.pending_bookings}</p>
                        </div>
                        <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Penggunaan Kendaraan (30 Hari Terakhir)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={vehicleUsage}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                labelStyle={{ fontWeight: 'bold' }}
                            />
                            <Bar dataKey="booking_count" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Jumlah Pemesanan" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        Konsumsi BBM (30 Hari Terakhir)
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={fuelData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                                labelStyle={{ fontWeight: 'bold' }}
                            />
                            <Bar dataKey="total_fuel" fill="#10B981" radius={[8, 8, 0, 0]} name="Total BBM (Liter)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Service Schedule Alert */}
            {serviceSchedule && serviceSchedule.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center">
                            <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Perhatian: Kendaraan Perlu Service
                        </h3>
                        <span className="px-4 py-2 bg-orange-500 text-white font-bold rounded-full">
                            {serviceSchedule.length} Kendaraan
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {serviceSchedule.map((vehicle) => (
                            <Link
                                key={vehicle.id}
                                to={`/vehicles/${vehicle.id}`}
                                className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow border-l-4 border-orange-500"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900">{vehicle.name}</h4>
                                        <p className="text-sm text-gray-600 font-mono">{vehicle.license_plate}</p>
                                        <div className="mt-2 space-y-1">
                                            <div className="flex items-center text-sm">
                                                <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-gray-700">
                                                    Service: <span className="font-semibold">{vehicle.next_service_date || 'Belum dijadwalkan'}</span>
                                                </span>
                                            </div>
                                            {vehicle.days_until_service !== null && (
                                                <div className={`text-sm font-semibold ${
                                                    vehicle.days_until_service < 0 ? 'text-red-600' : 
                                                    vehicle.days_until_service <= 3 ? 'text-orange-600' : 'text-yellow-600'
                                                }`}>
                                                    {vehicle.days_until_service < 0 
                                                        ? `Telat ${Math.abs(vehicle.days_until_service)} hari!` 
                                                        : `${vehicle.days_until_service} hari lagi`}
                                                </div>
                                            )}
                                            {vehicle.km_until_service !== null && vehicle.km_until_service <= 500 && (
                                                <div className="text-sm text-orange-600 font-semibold">
                                                    {vehicle.km_until_service} km lagi
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Aksi Cepat</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <a 
                        href="/bookings/create" 
                        className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                        <div className="bg-blue-500 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800">Pemesanan Baru</div>
                            <div className="text-sm text-gray-600">Buat pemesanan kendaraan</div>
                        </div>
                    </a>
                    
                    <a 
                        href="/vehicles" 
                        className="flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
                    >
                        <div className="bg-green-500 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800">Lihat Kendaraan</div>
                            <div className="text-sm text-gray-600">Kelola daftar kendaraan</div>
                        </div>
                    </a>
                    
                    <a 
                        href="/approvals" 
                        className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors"
                    >
                        <div className="bg-purple-500 p-3 rounded-lg">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <div className="font-semibold text-gray-800">Persetujuan</div>
                            <div className="text-sm text-gray-600">Proses persetujuan</div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}
