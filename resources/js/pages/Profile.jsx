import { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function Profile() {
    const { user: authUser, refreshUser } = useAuth();
    const [profileForm, setProfileForm] = useState({
        name: '',
        email: '',
    });
    const [passwordForm, setPasswordForm] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
    });
    const [loading, setLoading] = useState(true);
    const [submittingProfile, setSubmittingProfile] = useState(false);
    const [submittingPassword, setSubmittingPassword] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const { data } = await api.get('/profile');
            setProfileForm({
                name: data.name,
                email: data.email,
            });
        } catch (error) {
            console.error('Failed to load profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSubmittingProfile(true);

        try {
            await api.put('/profile', profileForm);
            alert('Profil berhasil diperbarui!');
            refreshUser();
        } catch (error) {
            console.error('Failed to update profile', error);
            alert(error.response?.data?.message || 'Gagal memperbarui profil');
        } finally {
            setSubmittingProfile(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setSubmittingPassword(true);

        if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
            alert('Konfirmasi password tidak cocok!');
            setSubmittingPassword(false);
            return;
        }

        try {
            await api.post('/profile/change-password', passwordForm);
            alert('Password berhasil diubah!');
            setPasswordForm({
                current_password: '',
                new_password: '',
                new_password_confirmation: '',
            });
        } catch (error) {
            console.error('Failed to change password', error);
            alert(error.response?.data?.message || error.response?.data?.errors?.current_password?.[0] || 'Gagal mengubah password');
        } finally {
            setSubmittingPassword(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Memuat profil...</div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Profil Saya</h1>
                <p className="text-gray-600 mt-1">Kelola informasi profil dan keamanan akun Anda</p>
            </div>

            {/* Profile Info Card */}
            <div className="bg-white shadow-lg rounded-2xl p-8">
                <div className="flex items-center space-x-6 mb-8 pb-8 border-b border-gray-200">
                    <div className="flex-shrink-0 h-24 w-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl">
                        <span className="text-white font-bold text-4xl">
                            {authUser?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{authUser?.name}</h2>
                        <p className="text-gray-600">{authUser?.email}</p>
                        <span className="inline-block mt-2 px-4 py-1 bg-purple-100 text-purple-800 text-sm font-bold rounded-full">
                            {authUser?.role?.name}
                        </span>
                    </div>
                </div>

                <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Informasi Profil</h3>
                    
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap *</label>
                        <input
                            type="text"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Nama lengkap"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                        <input
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="email@example.com"
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submittingProfile}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submittingProfile ? 'Menyimpan...' : 'Perbarui Profil'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-white shadow-lg rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Ubah Password</h3>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password Saat Ini *</label>
                        <input
                            type="password"
                            value={passwordForm.current_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Masukkan password saat ini"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password Baru *</label>
                        <input
                            type="password"
                            value={passwordForm.new_password}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Minimal 6 karakter"
                            required
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Konfirmasi Password Baru *</label>
                        <input
                            type="password"
                            value={passwordForm.new_password_confirmation}
                            onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Ulangi password baru"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                        <div className="flex">
                            <svg className="w-5 h-5 text-yellow-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <p className="text-sm text-yellow-700">
                                Setelah mengubah password, Anda akan tetap login pada sesi saat ini.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submittingPassword}
                            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submittingPassword ? 'Mengubah...' : 'Ubah Password'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Additional Info */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Informasi Tambahan
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex justify-between">
                        <span className="font-medium">Role:</span>
                        <span>{authUser?.role?.description || 'N/A'}</span>
                    </div>
                    {authUser?.office && (
                        <div className="flex justify-between">
                            <span className="font-medium">Kantor:</span>
                            <span>{authUser.office.name}</span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="font-medium">ID Pengguna:</span>
                        <span className="font-mono">{authUser?.id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
