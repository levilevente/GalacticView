# GalacticView

A microservices platform for exploring the cosmos — NASA Open APIs, community blog posts, and an AI astronomy assistant — deployed on **AWS + k3s**.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Browser                                                     │
└──────────────────────────┬──────────────────────────────────┘
                           │ http://<EC2_IP>/
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  k3s on EC2 (Traefik Ingress)                                │
│  ┌─────────────────────┐  ┌──────────────────────────────┐  │
│  │ frontend-ui-ingress │  │ backend-api-ingress          │  │
│  │   /  → frontend     │  │   /auth  → auth-service    │  │
│  └─────────────────────┘  │   /blogs → blog-service    │  │
│                           │   /agent → agent-service   │  │
│                           └──────────────────────────────┘  │
└──────────┬──────────────────────┬──────────────────────────┘
           │                      │
    ┌──────▼──────┐        ┌──────▼──────┐        ┌───────────┐
    │  frontend   │        │ auth-service│        │blog-service│
    │  (React)    │        │  (FastAPI)  │        │ (FastAPI) │
    └─────────────┘        └──────┬──────┘        └─────┬─────┘
                                  │                     │
                           ┌──────▼──────┐       ┌──────▼──────┐
                           │ RDS Postgres│       │ DynamoDB+S3 │
                           └─────────────┘       └─────────────┘

    ┌─────────────┐
    │agent-service│  ← Groq + Tavily (no own database)
    │  (FastAPI)  │
    └─────────────┘
```

### Microservices (`apps/`)

| Service | Directory | Port | Database | Responsibility |
|---|---|---|---|---|
| Frontend | `apps/frontend` | 80 | — | React SPA, NASA data UI, chat widget |
| Auth | `apps/core-backend` | 8000 | PostgreSQL | User registration, login, sessions (Firebase) |
| Blog | `apps/blogpost-backend` | 8001 | DynamoDB + S3 | Blog posts and image uploads |
| Agent | `apps/agent-backend` | 8002 | — | AI chat (Groq, LangGraph, Tavily) |

Each backend service has its own Dockerfile, Poetry dependencies, and `.env.example`.

---

## Quick start — local (Docker Compose)

The fastest way to run the full stack on your machine without AWS or Kubernetes.

### Prerequisites

- Docker and Docker Compose
- Copy `.env.example` → `.env` in each app directory (see below)
- Place Firebase service account JSON at `secrets/firebase-service-account.json`

### Environment files

```bash
cp apps/core-backend/.env.example    apps/core-backend/.env
cp apps/blogpost-backend/.env.example apps/blogpost-backend/.env
cp apps/agent-backend/.env.example    apps/agent-backend/.env
cp apps/frontend/.env.example         apps/frontend/.env
```

Fill in API keys: NASA, Groq, Tavily (optional), Firebase.

### Run

```bash
docker compose up --build
```

Open **http://localhost:8080**

| Service | URL |
|---|---|
| Frontend | http://localhost:8080 |
| Auth API | http://localhost:8000 |
| Blog API | http://localhost:8001 |
| Agent API | http://localhost:8002 |

Local databases: PostgreSQL (auth) and LocalStack (DynamoDB + S3 for blog) run inside Compose — no AWS account needed.

---

## Cloud deployment (reproducible)

Full cloud reproduction from this repository:

1. **[`terraform/README.md`](terraform/README.md)** — Provision AWS (VPC, EC2/k3s, RDS, DynamoDB, S3)
2. **[`k8s/README.md`](k8s/README.md)** — Build images, create secrets, deploy manifests

### What you must provide locally (never in git)

| Secret / credential | Where to set it |
|---|---|
| AWS credentials | `aws configure` or env vars |
| `db_password` | `terraform/terraform.tfvars` |
| PostgreSQL password | `k8s/secrets.yaml` (same as `db_password`) |
| AWS IAM keys (blog S3/DynamoDB) | `k8s/secrets.yaml` |
| Groq / Tavily API keys | `k8s/secrets.yaml` |
| Firebase service account | `kubectl create secret` + `secrets/firebase-service-account.json` |
| Docker Hub token | `kubectl create secret docker-registry` |

### Tracked reproducibility files

| Path | Purpose |
|---|---|
| `docker-compose.yml` | Local full-stack |
| `terraform/*.tf` + `terraform.tfvars.example` | AWS infrastructure |
| `k8s/*.yaml` + `k8s/secrets.example.yaml` | Kubernetes workloads |
| `apps/*/.env.example` | Per-app local configuration templates |

---

## Per-app documentation

- [Frontend](./apps/frontend/README.md)
- [Agent service](./apps/agent-backend/README.md)

Each backend app also has a `.env.example` in its directory for local configuration.

---

## CI

GitHub Actions workflows under `.github/workflows/` run linting and tests per service on push.

---

## License

See `apps/frontend/LICENSE`, `apps/core-backend/LICENSE`, and `apps/blogpost-backend/LICENSE`.
