# Mobile Dev Setup (Capacitor + Laravel)

This guide captures the working local setup for running the Android app against the local Laravel API.

## 1) Capacitor API URL

Use ADB reverse for physical Android device testing over USB:

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

Set this in `.env.capacitor`.

## 2) ADB reverse (USB device)

Run in PowerShell:

```powershell
& "C:\Users\smart\AppData\Local\Android\Sdk\platform-tools\adb.exe" reverse tcp:8000 tcp:8000
& "C:\Users\smart\AppData\Local\Android\Sdk\platform-tools\adb.exe" reverse --list
```

Expected output includes:

```text
tcp:8000 tcp:8000
```

## 3) Backend startup

Run Laravel from `backend`:

```powershell
php artisan config:clear
php artisan serve --host 0.0.0.0 --port 8000
```

## 4) Database

Current local dev path uses SQLite in `backend/.env`:

```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

If needed, rebuild and seed:

```powershell
php artisan migrate:fresh --seed --force
```

Seed admin:

- Email: `admin@wellnessconnect.local`
- Password: `Admin@12345`

## 5) Rebuild Android app

From repo root:

```powershell
npm run cap:sync
npm run cap:open
```

In Android Studio:

1. Clean Project
2. Rebuild Project
3. Run on device

## 6) LAN fallback (without ADB reverse)

If not using USB reverse:

1. Set `VITE_API_URL=http://<PC_LAN_IP>:8000/api/v1` in `.env.capacitor`
2. Ensure phone and PC are on same Wi-Fi
3. Ensure inbound firewall allows TCP `8000`
