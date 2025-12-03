import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import api from '../api';

export default function CreateBooking() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [vehicles, setVehicles] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [approvers, setApprovers] = useState([]);
    const [form, setForm] = useState({
        vehicle_id: '',
        driver_id: '',
        client_name: '',
        client_phone: '',
        start_date: '',
        end_date: '',
        purpose: '',
        destination: '',
        approvers: [],
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Protect page - only admin can access
    useEffect(() => {
        if (user && user.role?.name !== 'admin') {
            alert('Akses ditolak. Hanya Admin yang dapat membuat pemesanan.');
            navigate('/bookings');
        }
    }, [user, navigate]);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [vehiclesRes, driversRes, approversRes] = await Promise.all([
                api.get('/vehicles'),
                api.get('/drivers'),
                api.get('/approvers'),
            ]);
            setVehicles(vehiclesRes.data.data.filter(v => v.status === 'tersedia'));
            setDrivers(driversRes.data);
            setApprovers(approversRes.data);
        } catch (error) {
            console.error('Failed to load data', error);
            setError('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (form.approvers.length < 2) {
            setError('Harap pilih minimal 2 pihak yang menyetujui');
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/bookings', form);
            alert('Pemesanan berhasil dibuat!');
            navigate('/bookings');
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal membuat pemesanan');
        } finally {
            setSubmitting(false);
        }
    };

    const toggleApprover = (approverId) => {
        setForm(prev => ({
            ...prev,
            approvers: prev.approvers.includes(approverId)
                ? prev.approvers.filter(id => id !== approverId)
                : [...prev.approvers, approverId]
        }));
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Memuat form pemesanan...</div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Buat Pemesanan Kendaraan</h1>
                <p className="text-gray-600 mt-1">Lengkapi formulir di bawah ini untuk membuat pemesanan baru</p>
            </div>
            
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6">
                    <div className="flex">
                        <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Kendaraan *</label>
                    <select
                        value={form.vehicle_id}
                        onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                    >
                        <option value="">Pilih Kendaraan</option>
                        {vehicles.map(vehicle => (
                            <option key={vehicle.id} value={vehicle.id}>
                                {vehicle.name} - {vehicle.license_plate} ({vehicle.type})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pengemudi *</label>
                    <select
                        value={form.driver_id}
                        onChange={(e) => setForm({ ...form, driver_id: e.target.value })}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                    >
                        <option value="">Pilih Pengemudi</option>
                        {drivers.map(driver => (
                            <option key={driver.id} value={driver.id}>{driver.name}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <h3 className="flex items-center text-sm font-bold text-gray-800 mb-4">
                        <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Informasi Klien/Pemesan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Klien *</label>
                            <input
                                type="text"
                                value={form.client_name}
                                onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                placeholder="Nama lengkap klien/pemesan"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Telepon *</label>
                            <input
                                type="tel"
                                value={form.client_phone}
                                onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                                placeholder="08xxxxxxxxxx"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Mulai *</label>
                        <input
                            type="datetime-local"
                            value={form.start_date}
                            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Selesai *</label>
                        <input
                            type="datetime-local"
                            value={form.end_date}
                            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tujuan Pemesanan *</label>
                    <textarea
                        value={form.purpose}
                        onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        rows="4"
                        placeholder="Jelaskan tujuan pemesanan kendaraan..."
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Destinasi *</label>
                    <input
                        type="text"
                        value={form.destination}
                        onChange={(e) => setForm({ ...form, destination: e.target.value })}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        placeholder="Lokasi tujuan"
                        required
                    />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <label className="flex items-center text-sm font-bold text-gray-800 mb-3">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Pilih Pihak yang Menyetujui (Minimal 2 - sesuai urutan) *
                    </label>
                    <p className="text-xs text-gray-600 mb-4">Persetujuan akan diproses sesuai urutan yang Anda pilih</p>
                    <div className="space-y-3">
                        {approvers.map(approver => (
                            <label key={approver.id} className="flex items-center p-3 bg-white rounded-lg hover:bg-blue-100 transition-colors cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.approvers.includes(approver.id)}
                                    onChange={() => toggleApprover(approver.id)}
                                    className="rounded text-blue-600 focus:ring-2 focus:ring-blue-500 w-5 h-5"
                                />
                                <span className="ml-3 flex-1 font-medium text-gray-800">{approver.name}</span>
                                <span className="text-xs bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-semibold">
                                    {approver.role?.description || 'Approver'}
                                </span>
                                {form.approvers.includes(approver.id) && (
                                    <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full font-bold">
                                        Level {form.approvers.indexOf(approver.id) + 1}
                                    </span>
                                )}
                            </label>
                        ))}
                    </div>
                    {form.approvers.length > 0 && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800 font-medium">
                                ✓ {form.approvers.length} pihak terpilih
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Menyimpan...' : 'Buat Pemesanan'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/bookings')}
                        disabled={submitting}
                        className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        Batal
                    </button>
                </div>
            </form>
        </div>
    );
}
