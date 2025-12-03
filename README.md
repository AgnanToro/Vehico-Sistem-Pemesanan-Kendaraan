# 🚗 Vehico - Sistem Pemesanan Kendaraan Perusahaan

Aplikasi web untuk monitoring dan pemesanan kendaraan perusahaan dengan sistem approval berjenjang.
---

## 📋 Dokumentasi record webv lewat jam.dev
link : https://jam.dev/c/527d09a8-8b72-4cf0-900e-a09566e59bd8
---

---

## 📋 Informasi Sistem

- **Framework:** Laravel 11
- **PHP Version:** 8.2+
- **Database:** MySQL 8.0
- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS

---

## 👥 Akun Testing

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sekawan.com | password |
| Approver Level 1 | approver1@sekawan.com | password |
| Approver Level 2 | approver2@sekawan.com | password |
| Driver 1 | driver1@sekawan.com | password |
| Driver 2 | driver2@sekawan.com | password |

---

## 🚀 Instalasi

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd testcase-sekawan_media
composer install
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Konfigurasi Database (.env)
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sekawan
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Migrasi Database & Seeding
```bash
php artisan migrate:fresh --seed

atau 

Alternatif (dua langkah): `php artisan migrate` lalu `php artisan db:seed`

```

### 5. Build Frontend & Jalankan
```bash
npm run build
php artisan serve
```

Akses: http://localhost:8000

---

## � Panduan Penggunaan

### Admin
1. Login dengan akun admin@sekawan.com
2. **Dashboard** - Lihat statistik kendaraan dan grafik
3. **Kendaraan** - Kelola data kendaraan (Tambah/Edit/Hapus)
4. **Pemesanan** - Buat pemesanan baru dengan info klien
5. **Pengguna** - Kelola user (Tambah/Edit/Hapus)

### Approver
1. Login dengan akun approver1 atau approver2
2. **Dashboard** - Lihat overview pemesanan
3. **Persetujuan** - Setujui/Tolak pemesanan pending
4. **Notifikasi** - Cek pemesanan yang butuh approval

### Driver
1. Login dengan akun driver1 atau driver2
2. **Dashboard** - Lihat tugas kendaraan
3. **Pemesanan** - Lihat daftar pemesanan yang disetujui
4. **Selesaikan** - Complete pemesanan dengan isi odometer & BBM
5. **Notifikasi** - Cek tugas baru dari admin

---

## ✨ Fitur Utama

- ✅ Sistem approval berjenjang (2 level)
- 📊 Dashboard dengan statistik & grafik
- 🚗 Manajemen kendaraan lengkap
- 📋 Pemesanan dengan informasi klien
- 🔔 Notifikasi real-time
- 👤 User management (role-based)
- ⛽ Monitoring BBM & service kendaraan
- 📱 Responsive mobile design

---

## 📖 Panduan Penggunaan

### Login
1. Buka `http://localhost:8000`
2. Pilih salah satu akun dari tabel di atas
3. Login menggunakan email dan password

### Admin
1. **Dashboard:** Lihat statistik dan grafik
2. **Kendaraan:** Kelola data kendaraan (Tambah/Edit/Hapus)
3. **Pemesanan:** 
   - Klik "Buat Pemesanan Baru"
   - Isi informasi klien (nama & nomor telepon)
   - Pilih kendaraan, driver, tanggal, dan tujuan
   - Pilih minimal 2 approver
   - Submit pemesanan
4. **Pengguna:** Kelola user (Tambah/Edit/Hapus)
5. **Notifikasi:** Cek notifikasi pemesanan

### Approver
1. **Dashboard:** Lihat statistik
2. **Kendaraan:** Lihat daftar kendaraan
3. **Persetujuan:**
   - Lihat daftar pemesanan yang perlu disetujui
   - Klik "Lihat Detail" untuk melihat informasi lengkap
   - Approve atau Reject dengan catatan
4. **Notifikasi:** Terima notifikasi pemesanan baru

### Driver
1. **Dashboard:** Lihat statistik
2. **Kendaraan:** Lihat daftar kendaraan
3. **Pemesanan:**
   - Lihat daftar pemesanan yang disetujui
   - Klik "Selesaikan" untuk pemesanan yang approved
   - Input odometer akhir dan BBM yang digunakan
4. **Notifikasi:** Terima notifikasi tugas baru

---

## 🗂️ Struktur Database

### Tabel Utama
- `users` - Data pengguna

## 📝 Database Schema

- `users` - Data pengguna dengan role
- `roles` - Role user (admin, approver_1, approver_2, driver)
- `vehicles` - Data kendaraan
- `vehicle_bookings` - Data pemesanan
- `booking_approvals` - Data approval
- `vehicle_logs` - Log penggunaan kendaraan
- `notifications` - Notifikasi sistem

---

**© 2025 Vehico - Sistem Pemesanan Kendaraan Perusahaan**