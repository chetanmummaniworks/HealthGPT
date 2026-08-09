# HealthGPT AI — Architecture

## Overview

HealthGPT AI follows a modular, layered architecture with a clear separation of concerns. This document describes the architecture established across Milestones 1 and 2.

## High-Level Architecture

```
React Frontend (Vite)
        ↓  HTTP / JSON
FastAPI Backend
        ↓  SQLAlchemy 2.x
PostgreSQL
```

## Components

### React Frontend

- **Location:** `frontend/`
- **Purpose:** User interface for the healthcare assistant.
- **Stack:** React, TypeScript, Vite, Tailwind CSS, React Router, Axios.
- **Structure:**
  - `src/api/` — API service layer (all backend communication)
  - `src/components/` — Reusable UI components
  - `src/pages/` — Page-level components
  - `src/layouts/` — Layout components
  - `src/routes/` — Route definitions
  - `src/types/` — Shared TypeScript types
  - `src/utils/` — Utility helpers
  - `src/context/` — React context providers (AuthProvider)
- **Communication:** The frontend calls the backend through the Axios API service layer. During development, the Vite dev server proxies `/api` requests to the FastAPI backend at `http://localhost:8001`. The frontend API base URL is configurable via `VITE_API_URL`.
- **Auth state:** `src/context/AuthContext.tsx` manages JWT token storage and provides login/logout to the application. The JWT is stored in `localStorage` (development prototype only; not production-grade security).
- **Protected routes:** `src/components/ProtectedRoute.tsx` guards the `/dashboard` route, redirecting unauthenticated users to `/login`.

### FastAPI Backend

- **Location:** `backend/`
- **Purpose:** REST API server exposing versioned endpoints.
- **Stack:** Python 3.12, FastAPI, SQLAlchemy 2.x, Pydantic v2, Alembic, bcrypt, PyJWT.
- **Structure:**
  - `app/api/` — API routers (thin; no business logic)
  - `app/auth/` — Authentication: password hashing, JWT creation/decoding, FastAPI dependencies
  - `app/config/` — Application settings (pydantic-settings)
  - `app/database/` — Database engine, session, and declarative base
  - `app/models/` — SQLAlchemy ORM models
  - `app/schemas/` — Pydantic request/response schemas
  - `app/services/` — Business logic (auth_service)
  - `app/utils/` — Utility helpers
- **API versioning:** All endpoints are under `/api/v1/`.
- **Configuration:** Settings are loaded from environment variables via pydantic-settings. Required variables cause a clear startup failure if missing.

### PostgreSQL

- **Purpose:** Persistent data storage.
- **Access:** SQLAlchemy 2.x with the `psycopg` (v3) driver.
- **Schema management:** Alembic migrations. The application does not use `Base.metadata.create_all()` for schema management.
- **Connection:** Lazy — the application starts without requiring PostgreSQL to be running, as long as no database operation is performed at startup.

## Authentication

User authentication is implemented with JWT access tokens backed by bcrypt password hashing.

### Password Hashing

- `app/auth/hashing.py` — `hash_password()` and `verify_password()` using bcrypt.
- Passwords are never stored in plaintext or logged.

### JWT

- `app/auth/jwt.py` — `create_access_token()` and `decode_access_token()` using PyJWT.
- Tokens contain the user ID (`sub`) and an expiration timestamp (`exp`).
- Secret key, algorithm, and token expiry are read from environment configuration.

### Auth Service

- `app/services/auth_service.py` — Business logic for registration and login.
  - Registration: normalizes email, checks for duplicates (409), hashes password, stores user.
  - Login: verifies password, rejects inactive accounts (403), generates JWT.

### Auth API Endpoints

- `POST /api/v1/auth/register` — Register a new user (returns safe user info, 201).
- `POST /api/v1/auth/login` — Login with email/password (returns JWT bearer token, 200).
- `GET /api/v1/auth/me` — Return the current user (requires valid JWT, 200).

### Auth Dependencies

- `app/auth/dependencies.py` — `get_current_user()` FastAPI dependency.
  - Extracts Bearer token, decodes JWT, validates signature and expiration.
  - Retrieves the user from the database.
  - Returns 401 for missing/invalid/expired tokens, 403 for inactive users.

## Request Flow

1. The React frontend calls an API endpoint through the Axios service layer.
2. The request is proxied by Vite (development) to the FastAPI backend.
3. FastAPI routes the request to the appropriate router under `/api/v1/`.
4. The router delegates to a service (business logic) if needed.
5. The service uses SQLAlchemy models and sessions to interact with PostgreSQL.
6. The response is serialized using Pydantic schemas and returned as JSON.

## Design Principles

- **Modular architecture:** Backend responsibilities are separated into routers, services, models, schemas, auth, and configuration.
- **Thin routers:** API route functions contain no business logic; logic lives in services.
- **Models separate from schemas:** SQLAlchemy ORM models are distinct from Pydantic schemas.
- **Versioned APIs:** All endpoints are under `/api/v1/`.
- **Environment-based configuration:** No secrets in source code; all configuration comes from environment variables.
- **Migrations:** Database schema changes are managed through Alembic.

## Security Considerations

- No secrets are committed to the repository.
- `.env` is ignored by Git; `.env.example` documents required variables.
- CORS is restricted to configured origins (default: `http://localhost:5173`).
- Passwords are hashed with bcrypt; never stored in plaintext.
- Password hashes are never exposed through API responses.
- JWTs contain only the user ID and expiration — no sensitive data.
- The development prototype stores JWTs in `localStorage` (documented as not production-grade).

## Future Extensions

This foundation is designed to accommodate future milestones:

- **Machine Learning:** Disease prediction models in a dedicated ML module.
- **AI Chatbot:** Gemini API integration using the prepared `GEMINI_API_KEY` setting.
- **OCR:** Medical report text extraction.
- **Additional services:** Hospital search, health history, PDF generation.

These features are **not implemented** in Milestone 2 and will be added in later milestones.
