# HealthGPT AI - AI Coding Instructions

## Project

HealthGPT AI is an AI-powered healthcare assistant being developed as a
hackathon project and AI engineering portfolio project.

The system provides preliminary health information and must never claim
to replace a qualified healthcare professional.

---

## Technology Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios

### Backend
- Python 3.12
- FastAPI
- SQLAlchemy 2.x
- PostgreSQL
- Alembic
- Pydantic v2
- JWT authentication

### Machine Learning
- Python
- pandas
- NumPy
- scikit-learn
- XGBoost
- joblib

### AI
- Gemini API

### OCR
- EasyOCR

### Infrastructure
- Git
- Docker
- REST APIs

---

# Architecture Principles

Use a modular architecture.

Backend responsibilities should be separated into:

- API / routers
- authentication
- database
- models
- schemas
- services
- machine learning
- OCR
- chatbot
- external integrations
- utilities

Do not put business logic directly into API route functions.

Keep routers thin.

Business logic belongs in services.

Database models must be separate from Pydantic schemas.

---

# Security Rules

NEVER:

- store plaintext passwords
- hardcode API keys
- hardcode database passwords
- commit `.env`
- expose password hashes
- log passwords
- expose JWT secrets
- trust arbitrary uploaded files
- return sensitive information unnecessarily

Use environment variables for secrets.

Use secure password hashing.

Validate all user input.

Validate uploaded files.

---

# Healthcare Safety

HealthGPT AI is NOT a replacement for doctors.

The application must NOT:

- provide definitive medical diagnoses
- prescribe medications
- recommend prescription dosages
- claim medical certainty
- replace emergency medical services

The application SHOULD:

- describe predictions as preliminary
- communicate uncertainty
- recommend professional medical consultation when appropriate
- clearly display medical disclaimers

Never present an ML confidence score as the probability that a patient actually has a disease.

---

# Development Rules

Before changing code:

1. Inspect the existing repository.
2. Understand the current architecture.
3. Identify files that need modification.
4. Explain the intended changes.

When implementing:

1. Make the smallest reasonable changes.
2. Reuse existing code where appropriate.
3. Don't duplicate functionality.
4. Don't rewrite working code unnecessarily.
5. Follow existing project conventions.
6. Add error handling.
7. Add type hints.
8. Keep functions focused.
9. Avoid unnecessary dependencies.

---

# Testing

Every major backend feature should have tests.

At minimum test:

- successful operation
- invalid input
- authentication failure where relevant
- database failure where relevant
- edge cases

Run tests after implementation.

Do not claim something works unless it has been tested.

---

# Git

Use conventional commit messages.

Examples:

feat: add user authentication
fix: handle duplicate email registration
refactor: separate authentication service
test: add authentication tests
docs: update setup instructions

Do not automatically commit or push unless explicitly requested.

---

# Dependencies

Do not add a dependency unless there is a clear reason.

Before adding a major dependency:

- explain why it is needed
- verify compatibility with the existing stack

Prefer stable, maintained libraries.

---

# Environment Variables

Never put secrets in source code.

Use:

.env

for local development.

Use:

.env.example

for documentation.

`.env` must be ignored by Git.

---

# API Design

Use versioned APIs:

/api/v1/...

Use appropriate HTTP methods:

GET
POST
PUT
PATCH
DELETE

Use appropriate HTTP status codes.

Use Pydantic request and response schemas.

---

# Database

Use SQLAlchemy 2.x.

Use Alembic migrations.

Do NOT use:

Base.metadata.create_all()

for production schema management.

Database schema changes must be represented by migrations.

---

# Frontend

Use:

- TypeScript
- reusable components
- API service layer
- proper loading states
- proper error states
- accessible forms
- responsive design

Do not put API calls everywhere inside UI components.

---

# AI / LLM

Never hardcode API keys.

LLM prompts should be stored in an organized manner.

LLM output must be treated as untrusted generated content.

Validate structured LLM outputs where appropriate.

Do not rely on an LLM for deterministic calculations or disease classification when a dedicated model/service is intended.

---

# Machine Learning

ML development must include:

- dataset documentation
- preprocessing
- train/validation/test strategy
- baseline model
- model comparison
- appropriate evaluation metrics
- error analysis
- reproducibility
- model versioning

Do not fabricate model metrics.

Do not claim clinical accuracy without appropriate validation.

---

# Coding Agent Behavior

Work ONLY on the requested milestone.

Do not automatically implement future milestones.

Before major changes, summarize:

- files to create
- files to modify
- purpose of each change

After implementation report:

- files created
- files modified
- commands executed
- tests executed
- test results
- remaining issues

If something is ambiguous, ask before making a major architectural decision.

Do not invent APIs, datasets, credentials, or external services.

Do not silently replace technologies specified in the project architecture.