# HealthGPT AI

AI-powered healthcare assistant providing preliminary health information and healthcare assistance.

> **Important:** HealthGPT AI is NOT a replacement for qualified healthcare professionals. It provides preliminary health information only and must never be used for definitive medical diagnoses, prescriptions, or emergency situations.

## Current Project Status

**Milestone 2 — User Authentication (in progress)**

- ✅ Git repository initialized
- ✅ Backend FastAPI application scaffolded
- ✅ Frontend React + TypeScript + Vite application scaffolded
- ✅ Backend health endpoint: `GET /api/v1/health`
- ✅ Frontend communicates with the backend
- ✅ PostgreSQL configuration prepared
- ✅ SQLAlchemy 2.x configured
- ✅ Alembic configured for future migrations
- ✅ Environment configuration implemented
- ✅ CORS configured for local development
- ✅ Basic automated testing configured
- ✅ User registration
- ✅ User login (JWT)
- ✅ Protected endpoint (`GET /api/v1/auth/me`)
- ✅ Frontend login/register pages
- ✅ Protected dashboard
- ✅ Frontend logout

Future milestones will add disease prediction, Gemini integration, OCR, hospital search, chatbot functionality, health history, and PDF generation.

## Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| Backend | Python 3.12, FastAPI, SQLAlchemy 2.x, PostgreSQL, Alembic, Pydantic v2 |
| Authentication | JWT (PyJWT), bcrypt |
| Testing | pytest, httpx |
| Infrastructure | Git, Docker (planned) |

## Repository Structure

```
HealthGpt/
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── router.py
│   │   │       ├── health.py
│   │   │       └── auth.py
│   │   ├── auth/
│   │   │   ├── hashing.py
│   │   │   ├── jwt.py
│   │   │   └── dependencies.py
│   │   ├── config/
│   │   │   └── settings.py
│   │   ├── database/
│   │   │   ├── database.py
│   │   │   └── base.py
│   │   ├── models/
│   │   │   └── user.py
│   │   ├── schemas/
│   │   │   ├── user.py
│   │   │   └── auth.py
│   │   ├── services/
│   │   │   └── auth_service.py
│   │   ├── utils/
│   │   └── main.py
│   ├── tests/
│   │   ├── conftest.py
│   │   ├── test_health.py
│   │   └── test_auth.py
│   ├── alembic/
│   │   └── versions/
│   │       └── 0001_create_users_table.py
│   ├── alembic.ini
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── health.ts
│   │   │   └── auth.ts
│   │   ├── components/
│   │   │   ├── BackendStatus.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── DashboardPage.tsx
│   │   ├── layouts/
│   │   ├── routes/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
├── docs/
│   └── architecture.md
├── .env.example
├── .gitignore
└── README.md
```

## Prerequisites

- **Python 3.12** or newer
- **Node.js 18+** and **npm**
- **PostgreSQL** (required for authentication features)

## Backend Setup

```bash
cd backend

# Create a virtual environment
python -m venv .venv

# Activate it
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -e ".[dev]"
```

## Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
```

## PostgreSQL Setup

1. Install and start PostgreSQL.
2. Create a database:

```sql
CREATE DATABASE healthgpt;
```

3. Configure the connection string in your `.env` file (see below).

## Database Migrations

```bash
cd backend
.venv\Scripts\Activate.ps1   # Windows (PowerShell)

# Apply all migrations
alembic upgrade head

# Roll back the last migration
alembic downgrade -1

# Generate a new migration after model changes
alembic revision --autogenerate -m "description"
```

## Environment Configuration

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` and fill in real values:

```env
DATABASE_URL=postgresql+psycopg://postgres:password@localhost:5432/healthgpt
SECRET_KEY=replace-with-a-secure-secret
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GEMINI_API_KEY=replace-with-api-key
ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
VITE_API_URL=http://localhost:8001
```

> **Never commit the `.env` file.** It is ignored by Git.

## How to Start the Backend

```bash
cd backend
.venv\Scripts\Activate.ps1   # Windows (PowerShell)
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

Interactive API documentation is available at `http://localhost:8000/docs`.

## How to Start the Frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`.

The Vite dev server proxies `/api` requests to the backend at `http://localhost:8000`. To use a different backend port, set `VITE_API_URL` in `.env`.

## How to Run Tests

```bash
cd backend
.venv\Scripts\Activate.ps1   # Windows (PowerShell)
pytest
```

Tests use an in-memory SQLite database and do not require PostgreSQL.

## API Endpoints

### Health

```
GET /api/v1/health
```

Response:

```json
{
  "status": "healthy",
  "service": "healthgpt-api"
}
```

### Register

```
POST /api/v1/auth/register
```

Request:

```json
{
  "full_name": "Chetan",
  "email": "chetan@example.com",
  "password": "TestPassword123"
}
```

Response (201):

```json
{
  "id": 1,
  "full_name": "Chetan",
  "email": "chetan@example.com",
  "is_active": true,
  "created_at": "2026-08-09T..."
}
```

### Login

```
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "chetan@example.com",
  "password": "TestPassword123"
}
```

Response:

```json
{
  "access_token": "...",
  "token_type": "bearer"
}
```

### Current User (Protected)

```
GET /api/v1/auth/me
```

Headers:

```
Authorization: Bearer <access_token>
```

Response:

```json
{
  "id": 1,
  "full_name": "Chetan",
  "email": "chetan@example.com",
  "is_active": true,
  "created_at": "2026-08-09T..."
}
```

## Frontend Authentication

1. Open `http://localhost:5173`.
2. Click **Register** to create an account.
3. You will be automatically logged in and redirected to the dashboard.
4. The dashboard displays your name and email.
5. Click **Log out** to return to the login page.
6. Accessing `/dashboard` without a token redirects to `/login`.

> **Security note:** The development prototype stores the JWT in `localStorage`. This is NOT production-grade security. Production hardening (e.g., httpOnly cookies, refresh tokens) will be implemented in a later milestone.

## Future Milestones

- **Milestone 3:** Disease prediction (ML)
- **Milestone 4:** Gemini AI chatbot integration
- **Milestone 5:** OCR for medical reports
- **Milestone 6:** Hospital search
- **Milestone 7:** Health history and PDF generation

## License

This project is for educational and portfolio purposes.