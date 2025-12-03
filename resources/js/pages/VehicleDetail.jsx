import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function VehicleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadVehicleDetail();
    }, [id]);

    const loadVehicleDetail = async () => {
        try {
            const { data } = await api.get(`/vehicles/${id}`);
            setVehicle(data);
        } catch (error) {
            console.error('Failed to load vehicle detail', error);
            alert('Gagal memuat detail kendaraan');
            navigate('/vehicles');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            tersedia: 'bg-green-100 text-green-800 border-green-300',
            digunakan: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            maintenance: 'bg-red-100 text-red-800 border-red-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    const getStatusLabel = (status) => {
        const labels = {
            tersedia: 'Tersedia',
            digunakan: 'Digunakan',
            maintenance: 'Maintenance',
        };
        return labels[status] || status;
    };

    const getTypeLabel = (type) => {
        return type === 'angkutan_orang' ? 'Angkutan Orang' : 'Angkutan Barang';
    };

    const getOwnershipLabel = (ownership) => {
        return ownership === 'milik_perusahaan' ? 'Milik Perusahaan' : 'Sewa';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const calculateServiceStatus = () => {
        if (!vehicle?.next_service_date) return { color: 'text-gray-500', text: 'Belum dijadwalkan' };
        
        const nextService = new Date(vehicle.next_service_date);
        const today = new Date();
        const daysUntil = Math.ceil((nextService - today) / (1000 * 60 * 60 * 24));
        
        if (daysUntil < 0) return { color: 'text-red-600', text: 'Telat service!' };
        if (daysUntil <= 7) return { color: 'text-orange-600', text: `Segera (${daysUntil} hari lagi)` };
        return { color: 'text-green-600', text: `${daysUntil} hari lagi` };
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Memuat detail kendaraan...</div>
        </div>
    );

    if (!vehicle) return null;

    const serviceStatus = calculateServiceStatus();

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate('/vehicles')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Daftar Kendaraan
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">{vehicle.name}</h1>
                    <p className="text-gray-600 mt-1">Detail Informasi Kendaraan</p>
                </div>
                <span className={`px-6 py-3 text-lg font-bold rounded-xl border-2 ${getStatusColor(vehicle.status)}`}>
                    {getStatusLabel(vehicle.status)}
                </span>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Vehicle Info Card */}
                <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Informasi Kendaraan
                    </h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Plat Nomor</label>
                            <p className="text-lg font-bold text-gray-900 font-mono">{vehicle.license_plate}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Jenis Kendaraan</label>
                            <p className="text-lg font-semibold text-gray-900">{getTypeLabel(vehicle.type)}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Kepemilikan</label>
                            <p className="text-lg font-semibold text-gray-900">{getOwnershipLabel(vehicle.ownership)}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Kantor</label>
                            <p className="text-lg font-semibold text-gray-900">{vehicle.office?.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Konsumsi BBM</label>
                            <p className="text-lg font-semibold text-gray-900">
                                {vehicle.fuel_consumption || '-'} L/100km
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Odometer</label>
                            <p className="text-lg font-semibold text-gray-900">
                                {vehicle.odometer?.toLocaleString('id-ID') || '0'} km
                            </p>
                        </div>
                    </div>
                </div>

                {/* Service Schedule Card */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg rounded-2xl p-6 border-2 border-purple-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Jadwal Service
                    </h2>
                    <div className="space-y-4">
                        <div className="bg-white rounded-lg p-4">
                            <label className="text-xs font-medium text-gray-500 uppercase">Service Terakhir</label>
                            <p className="text-lg font-bold text-gray-900 mt-1">
                                {formatDate(vehicle.last_service_date)}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <label className="text-xs font-medium text-gray-500 uppercase">Service Berikutnya</label>
                            <p className="text-lg font-bold text-gray-900 mt-1">
                                {formatDate(vehicle.next_service_date)}
                            </p>
                            <p className={`text-sm font-semibold mt-1 ${serviceStatus.color}`}>
                                {serviceStatus.text}
                            </p>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                            <label className="text-xs font-medium text-gray-500 uppercase">Interval Service</label>
                            <p className="text-lg font-bold text-gray-900 mt-1">
                                Setiap {vehicle.service_interval_km?.toLocaleString('id-ID')} km
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Booking History */}
            <div className="bg-white shadow-lg rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Riwayat Pemesanan (10 Terakhir)
                </h2>
                {vehicle.bookings && vehicle.bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Pengemudi</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tujuan</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {vehicle.bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {formatDate(booking.start_date)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {booking.driver?.name}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700">
                                            {booking.destination}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {booking.status === 'pending' ? 'Menunggu' :
                                                 booking.status === 'approved' ? 'Disetujui' :
                                                 booking.status === 'rejected' ? 'Ditolak' :
                                                 'Selesai'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p>Belum ada riwayat pemesanan</p>
                    </div>
                )}
            </div>

            {/* Vehicle Logs */}
            {vehicle.logs && vehicle.logs.length > 0 && (
                <div className="bg-white shadow-lg rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Log Kendaraan (10 Terakhir)
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Tipe</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Jarak</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">BBM</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Catatan</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {vehicle.logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {formatDate(log.created_at)}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                log.type === 'usage' ? 'bg-blue-100 text-blue-800' :
                                                log.type === 'fuel' ? 'bg-green-100 text-green-800' :
                                                log.type === 'service' ? 'bg-purple-100 text-purple-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {log.type === 'usage' ? 'Pemakaian' :
                                                 log.type === 'fuel' ? 'BBM' :
                                                 log.type === 'service' ? 'Service' : 'Maintenance'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {log.distance ? `${log.distance} km` : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900">
                                            {log.fuel_amount ? `${log.fuel_amount} L` : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">
                                            {log.notes || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
