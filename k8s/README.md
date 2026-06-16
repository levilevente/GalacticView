# GalacticView — Kubernetes Deployment

This directory contains the Kubernetes manifests for deploying all GalacticView microservices on a **k3s** cluster (Traefik ingress). Follow this guide to reproduce the cloud deployment from the shared git repository.

> **Prerequisite:** Provision AWS infrastructure first — see [`../terraform/README.md`](../terraform/README.md).

---

## What gets deployed

| Manifest | Workload | Internal port | Ingress path |
|---|---|---|---|
| `frontend.yaml` | React SPA (nginx) | 80 | `/` via `frontend-ui-ingress` |
| `auth-service.yaml` | Auth API (FastAPI + PostgreSQL) | 8000 | `/auth` via `backend-api-ingress` |
| `blog-service.yaml` | Blog API (FastAPI + DynamoDB + S3) | 8001 | `/blogs` via `backend-api-ingress` |
| `agent-service.yaml` | AI chat API (FastAPI + Groq) | 8002 | `/agent` via `backend-api-ingress` |
| `ingress-frontend.yaml` | UI ingress (Traefik) | — | `/` → `frontend` |
| `ingress-backend.yaml` | API ingress (Traefik) | — | `/auth`, `/blogs`, `/agent` |
| `secrets.example.yaml` | Secret template (copy → `secrets.yaml`) | — | — |

### Ingress architecture

Two separate `Ingress` resources split UI traffic from API traffic:

```
Browser ──► EC2:80 (Traefik)
              ├── frontend-ui-ingress  →  /           → frontend
              └── backend-api-ingress  →  /auth       → auth-service
                                         →  /blogs      → blog-service
                                         →  /agent      → agent-service
```

Traefik uses **longest-prefix matching**, so `/auth`, `/blogs`, and `/agent` are routed by the API ingress even though the UI ingress also declares `/`.

Service-to-service calls (e.g. blog → auth) use internal ClusterIP DNS (`http://auth-service`) and do not go through Ingress.

---

## Prerequisites

Install locally:

- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Docker](https://docs.docker.com/get-docker/) (for building and pushing images)
- A Docker Hub account (or another registry the cluster can pull from)
- AWS infrastructure already applied via Terraform

You also need:

- Cluster access (`k3s-remote.yaml` — see [Connect to the cluster](#2-connect-to-the-cluster))
- API keys: Groq, Tavily (optional), Firebase service account JSON
- AWS IAM credentials for the blog service (S3 + DynamoDB access)

---

## Step-by-step reproduction

### 1. Configure environment-specific values

After `terraform apply`, read the outputs:

```bash
cd terraform
terraform output rds_address
terraform output s3_bucket_name
terraform output dynamodb_table_name
terraform output ec2_public_ip
```

Update the deployment manifests with **your** values (the checked-in files contain one author's deployment and will not work as-is):

**`auth-service.yaml`** — set the RDS hostname and DB user:

```yaml
- name: POSTGRESQL_HOST
  value: "<terraform output rds_address>"
- name: POSTGRESQL_DB
  value: "galacticview"          # must match terraform db_name
- name: POSTGRESQL_USER
  value: "galactic_admin"        # must match terraform db_username
```

**`blog-service.yaml`** — set the S3 bucket and DynamoDB table:

```yaml
- name: S3_BUCKET_NAME
  value: "<terraform output s3_bucket_name>"
- name: DYNAMODB_TABLE_NAME
  value: "<terraform output dynamodb_table_name>"
```

**All `*.yaml` deployments** — replace the Docker image prefix with your registry username:

```yaml
image: <DOCKER_USERNAME>/galactic-private:<service>-latest
```

### 2. Connect to the cluster

```bash
# From the terraform/ directory (after terraform apply)
chmod 400 galactic-key.pem
scp -i galactic-key.pem ubuntu@<EC2_IP>:/etc/rancher/k3s/k3s.yaml ./k3s-remote.yaml

# Edit k3s-remote.yaml:
#   - Replace 127.0.0.1 with <EC2_IP>
#   - Add:  insecure-skip-tls-verify: true  (under cluster)

export KUBECONFIG=$(pwd)/k3s-remote.yaml
kubectl get nodes
```

Port **6443** must be open in the AWS security group (already configured in `terraform/network.tf`).

### 3. Create secrets

**Application secrets** — copy the template and fill in real values (never commit `secrets.yaml`):

```bash
cp k8s/secrets.example.yaml k8s/secrets.yaml
# Edit secrets.yaml — set POSTGRESQL_PASSWORD (same as terraform db_password),
# AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, GROQ_API_KEY, TAVILY_API_KEY

kubectl apply -f k8s/secrets.yaml
```

**Firebase credentials** — create separately from the JSON file:

```bash
kubectl create secret generic firebase-credentials \
  --from-file=firebase-service-account.json=./secrets/firebase-service-account.json
```

**Docker registry pull secret** — so k3s can pull private images:

```bash
kubectl create secret docker-registry registry-credentials \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=<DOCKER_USERNAME> \
  --docker-password=<DOCKER_HUB_TOKEN> \
  --docker-email=<EMAIL>
```

### 4. Build and push Docker images

The cloud EC2 instance runs **linux/amd64**. If you build on an Apple Silicon Mac, cross-compile:

```bash
docker login -u <DOCKER_USERNAME>

# Repeat for each service (build context = app directory):
docker build --platform linux/amd64 \
  -t <DOCKER_USERNAME>/galactic-private:auth-latest ./apps/core-backend
docker build --platform linux/amd64 \
  -t <DOCKER_USERNAME>/galactic-private:blog-latest ./apps/blogpost-backend
docker build --platform linux/amd64 \
  -t <DOCKER_USERNAME>/galactic-private:agent-latest ./apps/agent-backend
docker build --platform linux/amd64 \
  -t <DOCKER_USERNAME>/galactic-private:frontend-latest ./apps/frontend

docker push <DOCKER_USERNAME>/galactic-private:auth-latest
docker push <DOCKER_USERNAME>/galactic-private:blog-latest
docker push <DOCKER_USERNAME>/galactic-private:agent-latest
docker push <DOCKER_USERNAME>/galactic-private:frontend-latest
```

When you change code, bump the image tag (e.g. `auth-v2`) and update the `image:` field in the manifest — `kubectl rollout restart` alone will not pull a new image if the tag is unchanged.

### 5. Deploy workloads

Apply in this order:

```bash
kubectl apply -f k8s/secrets.yaml          # if not already applied
kubectl apply -f k8s/auth-service.yaml
kubectl apply -f k8s/blog-service.yaml
kubectl apply -f k8s/agent-service.yaml
kubectl apply -f k8s/frontend.yaml
kubectl apply -f k8s/ingress-backend.yaml
kubectl apply -f k8s/ingress-frontend.yaml
```

### 6. Verify

```bash
kubectl get pods
kubectl get ingress

# Open in browser (replace with your EC2 public IP):
#   http://<EC2_IP>/          → frontend
#   http://<EC2_IP>/auth/me   → auth API (requires session)
#   http://<EC2_IP>/blogs/    → blog list
```

Debug a crashing pod:

```bash
kubectl logs -l app=auth-service --tail=50
```

---

## Configuration reference

### Readable config (in manifests)

Non-sensitive values are set directly as `env` entries in the Deployment YAML files (region, bucket names, internal service URLs).

### Secret config (never committed)

| Secret name | Keys | Used by |
|---|---|---|
| `galactic-secrets` | `POSTGRESQL_PASSWORD`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `GROQ_API_KEY`, `TAVILY_API_KEY` | auth, blog, agent |
| `firebase-credentials` | `firebase-service-account.json` | auth |
| `registry-credentials` | Docker Hub token | all deployments (`imagePullSecrets`) |

Files excluded from git (see `k8s/.gitignore`):

- `secrets.yaml` — copy from `secrets.example.yaml`
- `k3s-remote.yaml` — downloaded cluster kubeconfig

### Frontend API routing (production)

The frontend image is built with relative API paths (`apps/frontend/.env.production`):

```
VITE_CORE_API_BASE_URL=/
VITE_BLOGPOSTS_API_BASE_URL=/
VITE_AGENT_API_BASE_URL=/agent
```

Same-origin requests hit the Traefik ingress paths above — no CORS configuration needed in production.

---

## Updating a running deployment

1. Rebuild the image with a **new tag** (`auth-v2`, not `auth-latest` if the tag already exists remotely).
2. Push to Docker Hub.
3. Update the `image:` line in the service YAML.
4. `kubectl apply -f k8s/<service>.yaml`

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `exec format error` in pod logs | ARM image on AMD64 server | Rebuild with `--platform linux/amd64` |
| `ImagePullBackOff` | Missing registry secret or wrong image name | Create `registry-credentials`; verify image tag |
| Auth pod `CrashLoopBackOff` | Wrong RDS host or password | Check `POSTGRESQL_HOST` and `galactic-secrets` |
| Blog pod can't reach S3/DynamoDB | Wrong bucket name or IAM keys | Match terraform outputs; verify AWS secrets |
| `kubectl` timeout | Port 6443 blocked or wrong server IP | Check security group; fix `k3s-remote.yaml` |
| 404 on `/auth/...` | Ingress not applied | `kubectl apply -f k8s/ingress-backend.yaml` |

---

## Local alternative (Docker Compose)

For local development without Kubernetes, use the root `docker-compose.yml` instead. It runs PostgreSQL and LocalStack in containers and does not require AWS or k3s. See the [root README](../README.md).
