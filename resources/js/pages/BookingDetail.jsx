import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function BookingDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookingDetail();
    }, [id]);

    const loadBookingDetail = async () => {
        try {
            const { data } = await api.get(`/bookings/${id}`);
            setBooking(data);
        } catch (error) {
            console.error('Failed to load booking detail', error);
            alert('Gagal memuat detail pemesanan');
            navigate('/bookings');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            approved: 'bg-green-100 text-green-800 border-green-300',
            rejected: 'bg-red-100 text-red-800 border-red-300',
            completed: 'bg-blue-100 text-blue-800 border-blue-300',
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
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

    const getApprovalStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-500',
            approved: 'bg-green-500',
            rejected: 'bg-red-500',
        };
        return colors[status] || 'bg-gray-500';
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Memuat detail pemesanan...</div>
        </div>
    );

    if (!booking) return null;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate('/bookings')}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-2"
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Kembali ke Daftar Pemesanan
                    </button>
                    <h1 className="text-3xl font-bold text-gray-800">Detail Pemesanan</h1>
                    <p className="text-gray-600 mt-1">ID Pemesanan: #{booking.id}</p>
                </div>
                <span className={`px-6 py-3 text-lg font-bold rounded-xl border-2 ${getStatusColor(booking.status)}`}>
                    {getStatusLabel(booking.status)}
                </span>
            </div>

            {/* Main Info Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Vehicle Info */}
                <div className="lg:col-span-2 bg-white shadow-lg rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Informasi Kendaraan
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Nama Kendaraan</label>
                            <p className="text-lg font-semibold text-gray-900">{booking.vehicle.name}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Plat Nomor</label>
                            <p className="text-lg font-semibold text-gray-900">{booking.vehicle.license_plate}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Jenis</label>
                            <p className="text-gray-900">{booking.vehicle.type}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Kepemilikan</label>
                            <p className="text-gray-900">{booking.vehicle.ownership === 'company' ? 'Perusahaan' : 'Sewa'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Odometer</label>
                            <p className="text-gray-900">{booking.vehicle.odometer?.toLocaleString()} km</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Konsumsi BBM</label>
                            <p className="text-gray-900">{booking.vehicle.fuel_consumption || 'N/A'} L/100km</p>
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-lg text-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-blue-100">Durasi</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-2xl font-bold">
                            {Math.ceil((new Date(booking.end_date) - new Date(booking.start_date)) / (1000 * 60 * 60 * 24))} Hari
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-lg text-white">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-green-100">Status Persetujuan</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-2xl font-bold">
                            {booking.approvals?.filter(a => a.status === 'approved').length || 0}/{booking.approvals?.length || 0}
                        </p>
                    </div>
                </div>
            </div>

            {/* Booking Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow-lg rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Jadwal & Tujuan
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-gray-500">Tanggal Mulai</label>
                            <p className="text-gray-900">
                                {new Date(booking.start_date).toLocaleString('id-ID', { 
                                    weekday: 'long',
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Tanggal Selesai</label>
                            <p className="text-gray-900">
                                {new Date(booking.end_date).toLocaleString('id-ID', { 
                                    weekday: 'long',
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Destinasi</label>
                            <p className="text-gray-900 font-semibold">{booking.destination}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-500">Tujuan Pemesanan</label>
                            <p className="text-gray-900">{booking.purpose}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white shadow-lg rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Informasi Personel
                    </h2>
                    <div className="space-y-4">
                        <div className="flex items-center p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-3 shadow-lg">
                                {booking.client_name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <label className="text-xs font-bold text-purple-600 uppercase tracking-wide">Klien/Pemesan</label>
                                <p className="text-gray-900 font-bold text-lg">{booking.client_name}</p>
                                <p className="text-sm text-gray-600 flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    {booking.client_phone}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                {booking.driver?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">Pengemudi</label>
                                <p className="text-gray-900 font-semibold">{booking.driver?.name}</p>
                                <p className="text-xs text-gray-600">{booking.driver?.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                {booking.booked_by?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500">Dibuat Oleh (Admin)</label>
                                <p className="text-gray-900 font-semibold">{booking.booked_by?.name}</p>
                                <p className="text-xs text-gray-600">{booking.booked_by?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approval Timeline */}
            <div className="bg-white shadow-lg rounded-2xl p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Timeline Persetujuan
                </h2>
                <div className="space-y-4">
                    {booking.approvals && booking.approvals.length > 0 ? (
                        booking.approvals.map((approval, index) => (
                            <div key={approval.id} className="flex items-start">
                                <div className="flex flex-col items-center mr-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${getApprovalStatusColor(approval.status)}`}>
                                        {approval.status === 'approved' ? (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : approval.status === 'rejected' ? (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        ) : (
                                            <span className="font-bold">{index + 1}</span>
                                        )}
                                    </div>
                                    {index < booking.approvals.length - 1 && (
                                        <div className={`w-0.5 h-16 ${approval.status === 'approved' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    )}
                                </div>
                                <div className="flex-1 pb-8">
                                    <div className="flex items-center justify-between mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-900">Level {approval.level} - {approval.approver?.name}</p>
                                            <p className="text-sm text-gray-600">{approval.approver?.role?.description}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                                            approval.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            approval.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {approval.status === 'pending' ? 'Menunggu' : approval.status === 'approved' ? 'Disetujui' : 'Ditolak'}
                                        </span>
                                    </div>
                                    {approval.approved_at && (
                                        <p className="text-sm text-gray-500">
                                            {new Date(approval.approved_at).toLocaleString('id-ID', { 
                                                day: 'numeric', 
                                                month: 'short', 
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    )}
                                    {approval.notes && (
                                        <div className="mt-2 p-3 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                                            <p className="text-sm text-gray-700"><strong>Catatan:</strong> {approval.notes}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">Tidak ada data persetujuan</p>
                    )}
                </div>
            </div>

            {/* Vehicle Logs */}
            {booking.logs && booking.logs.length > 0 && (
                <div className="bg-white shadow-lg rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Riwayat Kendaraan
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tipe</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">BBM (L)</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Odometer Awal</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Odometer Akhir</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Jarak (km)</th>
                                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Catatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {booking.logs.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm">
                                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-semibold">{log.type}</span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{log.fuel_amount || '-'}</td>
                                        <td className="px-4 py-3 text-sm">{log.odometer_start?.toLocaleString() || '-'} km</td>
                                        <td className="px-4 py-3 text-sm">{log.odometer_end?.toLocaleString() || '-'} km</td>
                                        <td className="px-4 py-3 text-sm font-semibold">{log.distance?.toLocaleString() || '-'} km</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{log.notes || '-'}</td>
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
