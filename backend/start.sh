#!/bin/sh

echo "Starting database migration in background..."
(
    sleep 5
    echo "Running database migrations..."
    alembic upgrade head
    echo "Database migration finished."
) &

echo "Starting HealthGPT API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8001