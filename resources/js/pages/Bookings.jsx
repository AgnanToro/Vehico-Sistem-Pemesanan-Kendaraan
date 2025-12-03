import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import api from '../api';

export default function Bookings() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [completeForm, setCompleteForm] = useState({
        odometer_end: '',
        fuel_used: '',
        notes: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const { data } = await api.get('/bookings');
            setBookings(data.data);
        } catch (error) {
            console.error('Failed to load bookings', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteClick = (booking) => {
        setSelectedBooking(booking);
        setCompleteForm({
            odometer_end: booking.vehicle.odometer + 100,
            fuel_used: '',
            notes: '',
        });
        setShowCompleteModal(true);
    };

    const handleCompleteSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            await api.post(`/bookings/${selectedBooking.id}/complete`, completeForm);
            alert('Pemesanan berhasil diselesaikan!');
            setShowCompleteModal(false);
            loadBookings();
        } catch (error) {
            console.error('Failed to complete booking', error);
            alert(error.response?.data?.message || 'Gagal menyelesaikan pemesanan');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
            completed: 'bg-blue-100 text-blue-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Menunggu',
            approved: 'Disetujui',
            rejected: 'Ditolak',
            completed: 'Selesai',
        };
        return labels[status] || status;
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Memuat data pemesanan...</div>
        </div>
    );

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Daftar Pemesanan Kendaraan</h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">Kelola dan pantau semua pemesanan kendaraan</p>
                </div>
                {user?.role?.name === 'admin' && (
                    <Link 
                        to="/bookings/create" 
                        className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm md:text-base"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Buat Pemesanan Baru
                    </Link>
                )}
            </div>

            <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                            <tr>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Kendaraan</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Klien/Pemesan</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Pengemudi</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tanggal Mulai</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Tanggal Selesai</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="px-4 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {bookings.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-4 md:px-6 py-8 md:py-12 text-center text-gray-500">
                                        <svg className="w-12 h-12 md:w-16 md:h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-base md:text-lg font-medium">Belum ada data pemesanan</p>
                                        <p className="text-xs md:text-sm text-gray-400 mt-1">Buat pemesanan baru untuk memulai</p>
                                    </td>
                                </tr>
                            ) : (
                                bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-8 w-8 md:h-10 md:w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-4 h-4 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                </div>
                                                <div className="ml-2 md:ml-3">
                                                    <div className="text-xs md:text-sm font-semibold text-gray-900">{booking.vehicle.name}</div>
                                                    <div className="text-xs text-gray-500">{booking.vehicle.license_plate}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-7 w-7 md:h-8 md:w-8 bg-purple-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-3 h-3 md:w-4 md:h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <div className="ml-2 md:ml-3">
                                                    <div className="text-xs md:text-sm font-semibold text-gray-900">{booking.client_name || 'N/A'}</div>
                                                    <div className="text-xs text-gray-500">{booking.client_phone || ''}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-900">{booking.driver.name}</td>
                                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-600">
                                            {new Date(booking.start_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-xs md:text-sm text-gray-600">
                                            {new Date(booking.end_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                                            <span className={`px-2 md:px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(booking.status)}`}>
                                                {getStatusLabel(booking.status)}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center gap-1 md:gap-2">
                                                <button
                                                    onClick={() => navigate(`/bookings/${booking.id}`)}
                                                    className="p-1.5 md:p-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg transition-all duration-200"
                                                    title="Lihat Detail"
                                                >
                                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                                {booking.status === 'approved' && user?.role?.name === 'driver' && (
                                                    <button
                                                        onClick={() => handleCompleteClick(booking)}
                                                        className="p-1.5 md:p-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg transition-all duration-200"
                                                        title="Selesaikan"
                                                    >
                                                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Complete Booking Modal */}
            {showCompleteModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
                        <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-white">Selesaikan Pemesanan</h2>
                        </div>
                        
                        <div className="p-6">
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">Kendaraan:</span> {selectedBooking.vehicle.name} ({selectedBooking.vehicle.license_plate})
                                </p>
                                <p className="text-sm text-gray-700 mt-1">
                                    <span className="font-semibold">Odometer Saat Ini:</span> {selectedBooking.vehicle.odometer} km
                                </p>
                            </div>

                            <form onSubmit={handleCompleteSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Odometer Akhir (km) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min={selectedBooking.vehicle.odometer + 1}
                                        value={completeForm.odometer_end}
                                        onChange={(e) => setCompleteForm({ ...completeForm, odometer_end: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        placeholder="Masukkan odometer akhir"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Harus lebih dari {selectedBooking.vehicle.odometer} km
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        BBM yang Digunakan (Liter) *
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        min="0"
                                        value={completeForm.fuel_used}
                                        onChange={(e) => setCompleteForm({ ...completeForm, fuel_used: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        placeholder="Masukkan jumlah BBM dalam liter"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Catatan (Opsional)
                                    </label>
                                    <textarea
                                        value={completeForm.notes}
                                        onChange={(e) => setCompleteForm({ ...completeForm, notes: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                                        rows="3"
                                        placeholder="Tambahkan catatan tambahan..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowCompleteModal(false)}
                                        className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                                        disabled={submitting}
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Menyimpan...' : 'Selesaikan Pemesanan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
