# Physical Data Model (ERD)
## Vehicle Booking System Database Design

```mermaid
erDiagram
    roles ||--o{ users : "has"
    regions ||--o{ offices : "has"
    offices ||--o{ users : "employs"
    offices ||--o{ vehicles : "owns"
    users ||--o{ vehicle_bookings : "creates/drives"
    vehicles ||--o{ vehicle_bookings : "booked_in"
    vehicle_bookings ||--o{ booking_approvals : "requires"
    users ||--o{ booking_approvals : "approves"
    vehicles ||--o{ vehicle_logs : "logged_in"
    vehicle_bookings ||--o{ vehicle_logs : "generates"

    roles {
        bigint id PK
        string name "Nama role"
        string description "Deskripsi role"
        timestamp created_at
        timestamp updated_at
    }

    regions {
        bigint id PK
        string name "Nama wilayah"
        timestamp created_at
        timestamp updated_at
    }

    offices {
        bigint id PK
        bigint region_id FK
        string name "Nama kantor"
        string address "Alamat"
        timestamp created_at
        timestamp updated_at
    }

    users {
        bigint id PK
        bigint office_id FK
        bigint role_id FK
        string name "Nama user"
        string email "Email (unique)"
        string password "Hashed password"
        timestamp email_verified_at
        string remember_token
        timestamp created_at
        timestamp updated_at
    }

    vehicles {
        bigint id PK
        bigint office_id FK
        string name "Nama kendaraan"
        string license_plate "Plat nomor (unique)"
        enum type "angkutan_orang, angkutan_barang"
        enum ownership "milik_perusahaan, sewa"
        decimal fuel_consumption "Liter per 100 KM"
        int odometer "Total KM"
        date last_service_date "Tanggal service terakhir"
        date next_service_date "Tanggal service berikutnya"
        int service_interval_km "Interval service (KM)"
        enum status "tersedia, digunakan, maintenance"
        timestamp created_at
        timestamp updated_at
    }

    vehicle_bookings {
        bigint id PK
        bigint vehicle_id FK
        bigint driver_id FK "User dengan role Driver"
        bigint booked_by FK "Admin yang membuat booking"
        string client_name "Nama klien/pemesan"
        string client_phone "Nomor telepon klien"
        date start_date "Tanggal mulai"
        date end_date "Tanggal selesai"
        text purpose "Tujuan pemesanan"
        string destination "Destinasi tujuan"
        enum status "pending, approved, rejected, completed"
        timestamp created_at
        timestamp updated_at
    }

    booking_approvals {
        bigint id PK
        bigint booking_id FK
        bigint approver_id FK "User dengan role Approver"
        int level "Level approval (1, 2, ...)"
        enum status "pending, approved, rejected"
        text notes "Catatan approval"
        timestamp approved_at
        timestamp created_at
        timestamp updated_at
    }

    vehicle_logs {
        bigint id PK
        bigint vehicle_id FK
        bigint booking_id FK "Nullable"
        enum type "usage, fuel, service, maintenance"
        decimal fuel_amount "Jumlah BBM (Liter)"
        decimal odometer "KM saat log"
        int odometer_start "KM awal"
        int odometer_end "KM akhir"
        int distance "Total KM perjalanan"
        text notes "Catatan log"
        timestamp created_at
        timestamp updated_at
    }
```

## Penjelasan Relasi:

### **1. roles → users (One to Many)**
- Satu role bisa dimiliki banyak users
- User harus punya 1 role: Admin, Approver, Driver

### **2. regions → offices (One to Many)**
- Satu region bisa punya banyak offices
- Office harus berada di 1 region

### **3. offices → users (One to Many)**
- Satu office bisa punya banyak employees (users)
- User harus terdaftar di 1 office

### **4. offices → vehicles (One to Many)**
- Satu office bisa punya banyak vehicles
- Vehicle harus terdaftar di 1 office

### **5. users → vehicle_bookings (One to Many)**
- Satu user (driver) bisa membuat banyak bookings
- Booking harus punya 1 driver

### **6. vehicles → vehicle_bookings (One to Many)**
- Satu vehicle bisa di-booking berkali-kali (tidak bersamaan)
- Booking harus untuk 1 vehicle

### **7. vehicle_bookings → booking_approvals (One to Many)**
- Satu booking bisa punya banyak approvals (multi-level)
- Approval harus untuk 1 booking

### **8. users → booking_approvals (One to Many)**
- Satu user (approver) bisa approve banyak bookings
- Approval harus dilakukan oleh 1 approver

### **9. vehicles → vehicle_logs (One to Many)**
- Satu vehicle bisa punya banyak logs (history)
- Log harus untuk 1 vehicle

### **10. vehicle_bookings → vehicle_logs (One to Many)**
- Satu booking bisa generate banyak logs (fuel, usage, dll)
- Log bisa tanpa booking (untuk maintenance, service)

## Indexes & Constraints:

### **Primary Keys:**
- Semua table punya `id` sebagai PRIMARY KEY (AUTO_INCREMENT)

### **Foreign Keys:**
```sql
-- users table
FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE CASCADE
FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE

-- offices table
FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE

-- vehicles table
FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE CASCADE

-- vehicle_bookings table
FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE

-- booking_approvals table
FOREIGN KEY (booking_id) REFERENCES vehicle_bookings(id) ON DELETE CASCADE
FOREIGN KEY (approver_id) REFERENCES users(id) ON DELETE CASCADE

-- vehicle_logs table
FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
FOREIGN KEY (booking_id) REFERENCES vehicle_bookings(id) ON DELETE SET NULL
```

### **Unique Constraints:**
- `users.email` - Email harus unique
- `vehicles.license_plate` - Plat nomor harus unique

### **Default Values:**
- `vehicles.status` = 'tersedia'
- `vehicles.odometer` = 0
- `vehicles.service_interval_km` = 5000
- `vehicle_bookings.status` = 'pending'
- `booking_approvals.status` = 'pending'

## Business Rules:

1. **User harus punya role dan office**
2. **Vehicle status:**
   - `tersedia` - Bisa di-booking
   - `digunakan` - Sedang dipakai (ada booking approved)
   - `maintenance` - Tidak bisa di-booking

3. **Booking workflow:**
   - Status awal: `pending`
   - Butuh minimum 2 approvals (multi-level)
   - Status jadi `approved` kalau semua approver sudah approve
   - Status jadi `rejected` kalau ada 1 approver yang reject
   - Status jadi `completed` kalau booking sudah selesai

4. **Vehicle logs:**
   - `usage` - Log pemakaian kendaraan
   - `fuel` - Log pengisian BBM
   - `service` - Log service kendaraan
   - `maintenance` - Log maintenance

5. **Service schedule:**
   - Auto-calculate `next_service_date` berdasarkan `service_interval_km`
   - Alert kalau `days_until_service <= 7` atau `km_until_service <= 500`
