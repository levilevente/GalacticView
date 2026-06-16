# GalacticView — Terraform (AWS Infrastructure)

This directory provisions the AWS infrastructure for GalacticView: VPC, EC2 (k3s), RDS PostgreSQL, DynamoDB, and S3. Everything is reproducible from this shared git repository — **cloud credentials are not included** and must be supplied locally.

> **Next step after apply:** Deploy microservices with [`../k8s/README.md`](../k8s/README.md).

For a line-by-line explanation of every Terraform block, see [`doc.md`](./doc.md).

---

## What gets created

| Resource | Purpose | Used by |
|---|---|---|
| VPC + 2 public subnets | Network foundation | EC2, RDS subnet group |
| Security groups | SSH (22), HTTP (80), HTTPS (443), K8s API (6443), RDS (5432 internal) | EC2, RDS |
| EC2 `t3.small` (Ubuntu 22.04) | k3s Kubernetes node (Traefik ingress) | All K8s workloads |
| RDS PostgreSQL `db.t3.micro` | Auth service database (database-per-service) | `auth-service` |
| DynamoDB table `GalacticBlogPosts` | Blog post metadata (database-per-service) | `blog-service` |
| S3 bucket (encrypted, private) | Blog image storage | `blog-service` |
| TLS key pair | SSH access to EC2 | Operator |

---

## Prerequisites

- [Terraform](https://developer.hashicorp.com/terraform/install) >= 1.5.0
- An AWS account with programmatic access
- AWS credentials configured locally (one of):
  - `aws configure` → `~/.aws/credentials`
  - Environment variables: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`
  - AWS SSO / IAM role

These credentials are **never committed** to the repository.

---

## Step-by-step reproduction

### 1. Create your variable file

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars`:

```hcl
aws_region     = "eu-central-1"
project_prefix = "galactic"
environment    = "prod"

db_username = "galactic_admin"
db_name     = "galacticview"
db_password = "change-me-to-a-strong-password"   # use a strong password

ssh_allowed_cidr = "0.0.0.0/0"   # restrict to your IP in production
```

`terraform.tfvars` is gitignored. Only `terraform.tfvars.example` is tracked.

Alternatively, pass the DB password without a file:

```bash
export TF_VAR_db_password='your-strong-password'
```

### 2. Initialize and apply

```bash
terraform init
terraform plan
terraform apply
```

`terraform apply` will:

- Create all AWS resources
- Generate `galactic-key.pem` (SSH private key, gitignored)
- Install k3s on the EC2 instance via cloud-init

### 3. Read outputs

```bash
terraform output ec2_public_ip
terraform output rds_address
terraform output s3_bucket_name
terraform output dynamodb_table_name
```

Use these values when configuring the Kubernetes manifests — see the mapping table below.

### 4. Verify SSH access

```bash
chmod 400 galactic-key.pem
ssh -i galactic-key.pem ubuntu@$(terraform output -raw ec2_public_ip)
```

On the server, confirm k3s is running:

```bash
sudo kubectl get nodes
```

### 5. Deploy applications

Continue with [`../k8s/README.md`](../k8s/README.md).

---

## Terraform outputs → Kubernetes mapping

| Terraform output | K8s manifest field |
|---|---|
| `rds_address` | `auth-service.yaml` → `POSTGRESQL_HOST` |
| `db_name` (from tfvars) | `auth-service.yaml` → `POSTGRESQL_DB` |
| `db_username` (from tfvars) | `auth-service.yaml` → `POSTGRESQL_USER` |
| `db_password` (from tfvars) | `k8s/secrets.yaml` → `POSTGRESQL_PASSWORD` |
| `s3_bucket_name` | `blog-service.yaml` → `S3_BUCKET_NAME` |
| `dynamodb_table_name` | `blog-service.yaml` → `DYNAMODB_TABLE_NAME` |
| `ec2_public_ip` | Browser URL: `http://<ip>/` |

---

## Files in this directory

| File | In git? | Description |
|---|---|---|
| `main.tf` | Yes | Provider config, locals |
| `variables.tf` | Yes | Input variables |
| `network.tf` | Yes | VPC, subnets, security groups |
| `database.tf` | Yes | RDS, DynamoDB, S3 |
| `compute.tf` | Yes | EC2 + k3s bootstrap |
| `outputs.tf` | Yes | Exported values for K8s config |
| `terraform.tfvars.example` | Yes | Template for local tfvars |
| `terraform.tfvars` | **No** (gitignored) | Your real secrets and overrides |
| `galactic-key.pem` | **No** (gitignored) | Generated SSH private key |
| `k3s-remote.yaml` | **No** (gitignored) | Downloaded kubeconfig |
| `*.tfstate` | **No** (gitignored) | Contains sensitive resource data |
| `doc.md` | Yes | Detailed block-by-block reference |

---

## Teardown

To destroy all AWS resources (assignment-friendly; skips RDS final snapshot):

```bash
terraform destroy
```

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Error: creating RDS DB Instance` | Check `db_password` meets AWS complexity rules |
| `terraform apply` hangs on RDS | RDS creation takes 5–10 minutes — wait |
| Can't SSH to EC2 | Verify `ssh_allowed_cidr` includes your IP; check security group |
| `kubectl` can't reach cluster from laptop | Open port 6443 (already in `network.tf`); see k8s README |
| S3 bucket name collision | Change `project_prefix` or `environment` in tfvars |

---

## Design notes

- **Database per service:** PostgreSQL is dedicated to auth; DynamoDB + S3 are dedicated to blog. No shared database.
- **Cost-optimised for assignments:** `t3.small` EC2, `db.t3.micro` RDS, DynamoDB on-demand, `skip_final_snapshot = true`.
- **Security baseline:** RDS not publicly accessible; S3 block-public-access enabled; EBS and RDS encrypted; IMDSv2 enforced on EC2.

For full design rationale, see the [Cross-cutting design notes](./doc.md#cross-cutting-design-notes) section in `doc.md`.
