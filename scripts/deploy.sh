#!/usr/bin/env bash
set -euo pipefail

cd /home/ubuntu/teamflow

# Restore .env from secure location (created manually on first deploy)
if [ -f /home/ubuntu/.env.production ]; then
  cp /home/ubuntu/.env.production teamflow-backend/.env
fi

# Build and start
docker compose -f teamflow-backend/docker-compose.prod.yml up --build -d

# Health check
echo "Waiting for backend..."
sleep 15
curl -sf http://localhost/api/v1/auth/register && echo " Backend OK" || echo " WARN: Backend health check failed"

echo "Deploy complete"
