# WellnessConnect Frontend + Backend (Dockerized)

WellnessConnect now includes:
- React + Vite frontend
- Laravel API backend with real token auth (Sanctum)
- MariaDB
- phpMyAdmin
- Nginx

## Frontend Run

```bash
npm install
npm run dev
```

Frontend API base is configured in `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Backend Run (Docker)

```bash
cp .env.docker.example .env
docker compose up -d --build
```

Run migrations + seeders:

```bash
docker compose exec app php artisan migrate --force
docker compose exec app php artisan db:seed --force
```

## Access URLs

- Laravel app / API: `http://localhost:8080`
- phpMyAdmin: `http://localhost:8081`
- MariaDB host port: `3307`

## Real Auth API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token)
- `POST /api/auth/logout` (Bearer token)

## Seeded Login Credentials

- Admin:
  - Email: `admin@wellnessconnect.local`
  - Password: `Admin@12345`
- Client:
  - Email: `client@wellnessconnect.local`
  - Password: `Client@12345`
- Counsellor:
  - Email: `counsellor@wellnessconnect.local`
  - Password: `Counsellor@12345`

## Notes

- Frontend now uses Laravel API login/logout instead of demo-only local auth.
- Current frontend route implementation remains admin-first; non-admin users can authenticate but their module pages are not fully built yet.
- Next phase can add full module UIs per role and connect domain entities (appointments, programs, tickets, etc.) to backend APIs.
