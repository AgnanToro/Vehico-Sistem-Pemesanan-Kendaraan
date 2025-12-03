import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Vehicles() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [offices, setOffices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        office_id: '',
        name: '',
        license_plate: '',
        type: 'angkutan_orang',
        ownership: 'milik_perusahaan',
        fuel_consumption: '',
        odometer: '',
        last_service_date: '',
        next_service_date: '',
        service_interval_km: '5000',
        status: 'tersedia',
    });

    useEffect(() => {
        loadVehicles();
        loadOffices();
    }, []);

    const loadVehicles = async () => {
        try {
            const { data } = await api.get('/vehicles');
            setVehicles(data.data);
        } catch (error) {
            console.error('Failed to load vehicles', error);
        } finally {
            setLoading(false);
        }
    };

    const loadOffices = async () => {
        try {
            const { data } = await api.get('/vehicles');
            // Extract unique offices from vehicles
            const uniqueOffices = [...new Map(data.data.map(v => [v.office.id, v.office])).values()];
            setOffices(uniqueOffices);
        } catch (error) {
            console.error('Failed to load offices', error);
        }
    };

    const handleAdd = () => {
        setEditMode(false);
        setFormData({
            office_id: offices[0]?.id || '',
            name: '',
            license_plate: '',
            type: 'angkutan_orang',
            ownership: 'milik_perusahaan',
            fuel_consumption: '',
            odometer: '0',
            last_service_date: '',
            next_service_date: '',
            service_interval_km: '5000',
            status: 'tersedia',
        });
        setShowModal(true);
    };

    const handleEdit = (vehicle) => {
        setEditMode(true);
        setSelectedVehicle(vehicle);
        
        // Prepare form data with all vehicle info
        const editData = {
            office_id: vehicle.office.id,
            name: vehicle.name,
            license_plate: vehicle.license_plate,
            type: vehicle.type,
            ownership: vehicle.ownership,
            fuel_consumption: vehicle.fuel_consumption || '',
            odometer: vehicle.odometer || '0',
            last_service_date: vehicle.last_service_date || '',
            next_service_date: vehicle.next_service_date || '',
            service_interval_km: vehicle.service_interval_km || '5000',
            status: vehicle.status,
        };
        
        console.log('Edit Vehicle Data:', vehicle);
        console.log('Form Data:', editData);
        
        setFormData(editData);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editMode) {
                await api.put(`/vehicles/${selectedVehicle.id}`, formData);
                alert('Kendaraan berhasil diperbarui!');
            } else {
                await api.post('/vehicles', formData);
                alert('Kendaraan berhasil ditambahkan!');
            }
            setShowModal(false);
            loadVehicles();
        } catch (error) {
            console.error('Failed to save vehicle', error);
            alert(error.response?.data?.message || 'Gagal menyimpan kendaraan');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id, name) => {
        if (!confirm(`Yakin ingin menghapus kendaraan "${name}"?`)) return;

        try {
            await api.delete(`/vehicles/${id}`);
            alert('Kendaraan berhasil dihapus!');
            loadVehicles();
        } catch (error) {
            console.error('Failed to delete vehicle', error);
            alert(error.response?.data?.message || 'Gagal menghapus kendaraan');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            tersedia: 'bg-green-100 text-green-800',
            digunakan: 'bg-blue-100 text-blue-800',
            maintenance: 'bg-red-100 text-red-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
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
        const labels = {
            angkutan_orang: 'Angkutan Orang',
            angkutan_barang: 'Angkutan Barang',
        };
        return labels[type] || type;
    };

    const getOwnershipLabel = (ownership) => {
        const labels = {
            milik_perusahaan: 'Milik Perusahaan',
            sewa: 'Sewa',
        };
        return labels[ownership] || ownership;
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Memuat data...</div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Daftar Kendaraan</h1>
                    <p className="text-gray-600 mt-1">Kelola kendaraan perusahaan</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Kendaraan
                </button>
            </div>

            <div className="bg-white shadow-lg overflow-hidden rounded-xl">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nama</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Plat Nomor</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Jenis</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kepemilikan</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Kantor</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{vehicle.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">{vehicle.license_plate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {getTypeLabel(vehicle.type)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {getOwnershipLabel(vehicle.ownership)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{vehicle.office.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(vehicle.status)}`}>
                                        {getStatusLabel(vehicle.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                                            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 hover:shadow-lg"
                                            title="Lihat Detail"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleEdit(vehicle)}
                                            className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all duration-200 hover:shadow-lg"
                                            title="Edit Kendaraan"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(vehicle.id, vehicle.name)}
                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 hover:shadow-lg"
                                            title="Hapus Kendaraan"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {vehicles.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Belum ada kendaraan. Klik "Tambah Kendaraan" untuk menambah.
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-t-2xl">
                            <h2 className="text-2xl font-bold">
                                {editMode ? 'Edit Kendaraan' : 'Tambah Kendaraan Baru'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Kendaraan *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Toyota Avanza"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Plat Nomor *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.license_plate}
                                        onChange={(e) => setFormData({ ...formData, license_plate: e.target.value.toUpperCase() })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                                        placeholder="B1234XYZ"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kantor *
                                    </label>
                                    <select
                                        required
                                        value={formData.office_id}
                                        onChange={(e) => setFormData({ ...formData, office_id: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        {offices.map(office => (
                                            <option key={office.id} value={office.id}>{office.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Jenis Kendaraan *
                                    </label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="angkutan_orang">Angkutan Orang</option>
                                        <option value="angkutan_barang">Angkutan Barang</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Kepemilikan *
                                    </label>
                                    <select
                                        required
                                        value={formData.ownership}
                                        onChange={(e) => setFormData({ ...formData, ownership: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="milik_perusahaan">Milik Perusahaan</option>
                                        <option value="sewa">Sewa</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status *
                                    </label>
                                    <select
                                        required
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="tersedia">Tersedia</option>
                                        <option value="digunakan">Digunakan</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Konsumsi BBM (L/100km)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={formData.fuel_consumption}
                                        onChange={(e) => setFormData({ ...formData, fuel_consumption: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="10.5"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Odometer (km)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.odometer}
                                        onChange={(e) => setFormData({ ...formData, odometer: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="45000"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Service Terakhir
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.last_service_date}
                                        onChange={(e) => setFormData({ ...formData, last_service_date: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Service Berikutnya
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.next_service_date}
                                        onChange={(e) => setFormData({ ...formData, next_service_date: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Interval Service (km)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.service_interval_km}
                                        onChange={(e) => setFormData({ ...formData, service_interval_km: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="5000"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                                    disabled={submitting}
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition disabled:opacity-50"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Menyimpan...' : editMode ? 'Perbarui' : 'Tambah'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
