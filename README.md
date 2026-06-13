# Anaya Art Gallery

Premium Art Gallery & Custom Portraits — full-stack monorepo.

## Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 16, TypeScript, Tailwind CSS, Shadcn UI, Zustand, Axios |
| Backend | NestJS, PostgreSQL, Prisma, JWT, Cloudinary, Swagger |

## Prerequisites

- Node.js 20+
- npm
- Docker Desktop (for local PostgreSQL)

## Quick start

### 1. Start PostgreSQL

**Option A — Docker (recommended for production-like setup):**

```bash
docker compose up -d
```

Use in `backend/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/anaya_gallery?schema=public
```

**Option B — No Docker (Prisma local dev DB):**

```bash
cd backend
npx prisma dev -d
npx prisma dev ls    # copy the TCP postgres:// URL port
```

Set `backend/.env` to that URL with `sslmode=disable`, then:

```bash
npx prisma db push
```

Example:
```env
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:51214/template1?sslmode=disable
```

### Troubleshooting

**"Another next dev server is already running" / port 3000 in use:**

Only one Next.js dev server can run per project folder. Stop the old one:

```powershell
# Find what's on port 3000
netstat -ano | findstr ":3000"

# Kill the PID (replace 12345 with the actual PID)
taskkill /PID 12345 /F
```

Then start again: `cd frontend && npm run dev`

### 2. Backend

```bash
cd backend
cp .env.example .env
# Fill in JWT secrets and Cloudinary credentials in .env
npm install
npx prisma migrate dev
npm run start:dev
```

API: http://localhost:4000/api/v1  
Swagger: http://localhost:4000/docs

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

App: http://localhost:3000

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| `frontend/` | `npm run dev` | Start Next.js dev server |
| `frontend/` | `npm run lint` | ESLint |
| `frontend/` | `npm run format` | Prettier write |
| `backend/` | `npm run start:dev` | NestJS watch mode |
| `backend/` | `npm run lint` | ESLint |
| `backend/` | `npm run format` | Prettier write |

## Environment

See `frontend/.env.example` and `backend/.env.example` for required variables.
