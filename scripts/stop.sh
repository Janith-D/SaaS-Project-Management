#!/usr/bin/env bash
set -euo pipefail

cd /home/ubuntu/teamflow

# Stop existing containers
docker compose -f teamflow-backend/docker-compose.prod.yml down || true
