# Application Logging

## Log Points dalam Sistem Vehicle Booking

Aplikasi ini mengimplementasikan **comprehensive logging** pada setiap proses penting untuk **audit trail** dan **monitoring**.

## Log Categories:

### **1. Authentication Logs** 🔐

| Event | Location | Log Message | Data Logged |
|-------|----------|-------------|-------------|
| User Login | `AuthController@login` | `User logged in: {email}` | User email, timestamp |
| User Logout | `AuthController@logout` | `User logged out: {email}` | User email, timestamp |

**File:** `app/Http/Controllers/Api/AuthController.php`

```php
// Login
Log::info('User logged in: ' . $user->email);

// Logout
Log::info('User logged out: ' . $request->user()->email);
```

---

### **2. Vehicle Management Logs** 🚗

| Event | Location | Log Message | Data Logged |
|-------|----------|-------------|-------------|
| Create Vehicle | `VehicleController@store` | `Vehicle created` | vehicle_id |
| Update Vehicle | `VehicleController@update` | `Vehicle updated` | vehicle_id |
| Delete Vehicle | `VehicleController@destroy` | `Vehicle deleted` | vehicle_id |
| Vehicle Status Change | `BookingApprovalController@approve` | `Vehicle status changed to DIGUNAKAN/TERSEDIA` | vehicle_id, status |

**File:** `app/Http/Controllers/Api/VehicleController.php`

```php
// Create
Log::info('Vehicle created', ['vehicle_id' => $vehicle->id]);

// Update
Log::info('Vehicle updated', ['vehicle_id' => $vehicle->id]);

// Delete
Log::info('Vehicle deleted', ['vehicle_id' => $id]);
```

---

### **3. Booking Management Logs** 📋

| Event | Location | Log Message | Data Logged |
|-------|----------|-------------|-------------|
| Create Booking | `VehicleBookingController@store` | `Booking created` | booking_id, user email |
| Update Booking | `VehicleBookingController@update` | `Booking updated` | booking_id, status |
| Delete Booking | `VehicleBookingController@destroy` | `Booking deleted` | booking_id |
| Booking Approved | `BookingApprovalController@approve` | `Booking approved` | booking_id, all approvals |
| Booking Rejected | `BookingApprovalController@approve` | `Booking rejected` | booking_id, approval |

**File:** `app/Http/Controllers/Api/VehicleBookingController.php`

```php
// Create
Log::info('Booking created', [
    'booking_id' => $booking->id, 
    'user' => $request->user()->email
]);

// Update
Log::info('Booking updated', [
    'booking_id' => $booking->id, 
    'status' => $booking->status
]);

// Delete
Log::info('Booking deleted', ['booking_id' => $id]);
```

---

### **4. Approval Process Logs** ✅

| Event | Location | Log Message | Data Logged |
|-------|----------|-------------|-------------|
| Approval Updated | `BookingApprovalController@approve` | `Approval updated` | approval_id, status, approver |
| All Approvals Complete | `BookingApprovalController@approve` | `Booking approved` | booking_id |
| Approval Rejected | `BookingApprovalController@approve` | `Booking rejected` | booking_id |

**File:** `app/Http/Controllers/Api/BookingApprovalController.php`

```php
// Approval Decision
Log::info('Approval updated', [
    'approval_id' => $approval->id,
    'booking_id' => $approval->booking_id,
    'approver_id' => $approval->approver_id,
    'status' => $validated['status'],
    'approver_email' => $request->user()->email,
]);

// Booking Rejected
if ($validated['status'] === 'rejected') {
    Log::info('Booking rejected', ['booking_id' => $approval->booking_id]);
}

// All Approved
if ($allApproved) {
    Log::info('Booking approved', ['booking_id' => $approval->booking_id]);
}
```

---

### **5. Report Generation Logs** 📊

| Event | Location | Log Message | Data Logged |
|-------|----------|-------------|-------------|
| Export Bookings | `ReportController@exportBookings` | `Exporting bookings` | start_date, end_date, user |

**File:** `app/Http/Controllers/Api/ReportController.php`

```php
Log::info('Exporting bookings', [
    'start_date' => $startDate, 
    'end_date' => $endDate
]);
```

---

## Log Storage:

### **File Location:**
```
storage/logs/laravel.log
```

### **Log Format (Daily Rotation):**
```
[2025-12-03 10:15:32] local.INFO: User logged in: admin@sekawan.com
[2025-12-03 10:16:45] local.INFO: Booking created {"booking_id":1,"user":"driver1@sekawan.com"}
[2025-12-03 10:18:20] local.INFO: Approval updated {"approval_id":1,"booking_id":1,"approver_id":2,"status":"approved","approver_email":"approver1@sekawan.com"}
[2025-12-03 10:20:15] local.INFO: Approval updated {"approval_id":2,"booking_id":1,"approver_id":3,"status":"approved","approver_email":"approver2@sekawan.com"}
[2025-12-03 10:20:16] local.INFO: Booking approved {"booking_id":1}
[2025-12-03 10:20:17] local.INFO: Vehicle updated {"vehicle_id":1}
```

---

## Log Configuration:

**File:** `config/logging.php`

Default channel: `stack` (combines daily file + stderr)

```php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['daily'],
        'ignore_exceptions' => false,
    ],

    'daily' => [
        'driver' => 'daily',
        'path' => storage_path('logs/laravel.log'),
        'level' => env('LOG_LEVEL', 'debug'),
        'days' => 14, // Keep logs for 14 days
    ],
],
```

---

## Viewing Logs:

### **Via Terminal:**
```bash
# View latest logs (tail)
tail -f storage/logs/laravel.log

# View last 50 lines
tail -n 50 storage/logs/laravel.log

# Search for specific event
grep "Booking created" storage/logs/laravel.log
```

### **Via PowerShell (Windows):**
```powershell
# View latest logs
Get-Content storage/logs/laravel.log -Tail 50 -Wait

# Search for specific event
Select-String "Booking created" storage/logs/laravel.log
```

---

## Log Levels:

Aplikasi menggunakan berbagai log levels sesuai severity:

| Level | Usage | Example |
|-------|-------|---------|
| `emergency` | System down | Database connection failed |
| `alert` | Immediate action required | Payment gateway down |
| `critical` | Critical conditions | Application component unavailable |
| `error` | Runtime errors | Exception caught |
| `warning` | Warning messages | Deprecated API usage |
| `notice` | Normal but significant | User account created |
| **`info`** | **Informational messages** | **Most business logic events** |
| `debug` | Detailed debug info | Variable values |

**Currently using:** `Log::info()` untuk semua business events.

---

## Audit Trail Examples:

### **Scenario 1: Booking Creation & Approval**
```
[2025-12-03 09:00:00] INFO: User logged in: driver1@sekawan.com
[2025-12-03 09:01:30] INFO: Booking created {"booking_id":5,"user":"driver1@sekawan.com"}
[2025-12-03 09:15:00] INFO: User logged in: approver1@sekawan.com
[2025-12-03 09:16:20] INFO: Approval updated {"approval_id":9,"booking_id":5,"approver_id":2,"status":"approved","approver_email":"approver1@sekawan.com"}
[2025-12-03 09:30:00] INFO: User logged in: approver2@sekawan.com
[2025-12-03 09:31:45] INFO: Approval updated {"approval_id":10,"booking_id":5,"approver_id":3,"status":"approved","approver_email":"approver2@sekawan.com"}
[2025-12-03 09:31:46] INFO: Booking approved {"booking_id":5}
[2025-12-03 09:31:47] INFO: Vehicle updated {"vehicle_id":3}
```

### **Scenario 2: Booking Rejection**
```
[2025-12-03 10:00:00] INFO: User logged in: driver2@sekawan.com
[2025-12-03 10:02:15] INFO: Booking created {"booking_id":6,"user":"driver2@sekawan.com"}
[2025-12-03 10:10:00] INFO: User logged in: approver1@sekawan.com
[2025-12-03 10:11:30] INFO: Approval updated {"approval_id":11,"booking_id":6,"approver_id":2,"status":"rejected","approver_email":"approver1@sekawan.com"}
[2025-12-03 10:11:31] INFO: Booking rejected {"booking_id":6}
[2025-12-03 10:11:32] INFO: Booking updated {"booking_id":6,"status":"rejected"}
```

---

## Benefits of Logging:

1. ✅ **Audit Trail** - Track who did what and when
2. ✅ **Debugging** - Identify issues in production
3. ✅ **Security** - Detect suspicious activities
4. ✅ **Compliance** - Meet regulatory requirements
5. ✅ **Performance Monitoring** - Identify slow operations
6. ✅ **Business Intelligence** - Analyze user behavior

---

## Future Enhancements:

### **Recommendation untuk Production:**

1. **Structured Logging** - Use JSON format for easier parsing
```php
Log::info('booking.created', [
    'booking_id' => $booking->id,
    'vehicle_id' => $booking->vehicle_id,
    'driver_id' => $booking->driver_id,
    'timestamp' => now()->toIso8601String(),
]);
```

2. **Log Aggregation** - Send logs to centralized service:
   - **ELK Stack** (Elasticsearch, Logstash, Kibana)
   - **Splunk**
   - **Datadog**
   - **CloudWatch** (AWS)

3. **Log Rotation** - Keep logs manageable:
   - Current: 14 days retention
   - Consider: Compress old logs, archive to S3

4. **Performance Logging** - Track response times:
```php
$start = microtime(true);
// ... operation ...
$duration = (microtime(true) - $start) * 1000;
Log::info('operation.duration', ['operation' => 'create_booking', 'ms' => $duration]);
```

5. **User Context** - Add user info to all logs:
```php
Log::withContext([
    'user_id' => auth()->id(),
    'user_email' => auth()->user()->email,
    'ip' => request()->ip(),
]);
```
