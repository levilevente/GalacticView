variable "aws_region" {
  description = "AWS region where all resources will be deployed."
  type        = string
  default     = "eu-central-1"
}

variable "project_prefix" {
  description = "Short project name used as a prefix for resource names and tags."
  type        = string
  default     = "galactic"

  validation {
    condition     = can(regex("^[a-z][a-z0-9-]*$", var.project_prefix))
    error_message = "project_prefix must start with a lowercase letter and contain only lowercase letters, digits, and hyphens."
  }
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod)."
  type        = string
  default     = "prod"
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for the public subnets (one per AZ)."
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "ssh_allowed_cidr" {
  description = "CIDR block allowed to reach the EC2 instance on port 22."
  type        = string
  default     = "0.0.0.0/0"
}

variable "ec2_instance_type" {
  description = "EC2 instance type for the k3s web node (t3.small recommended for k3s memory)."
  type        = string
  default     = "t3.small"
}

variable "db_engine_version" {
  description = "PostgreSQL major engine version."
  type        = string
  default     = "15"
}

variable "db_instance_class" {
  description = "RDS instance class."
  type        = string
  default     = "db.t3.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage for the RDS instance, in GB."
  type        = number
  default     = 20
}

variable "db_name" {
  description = "Initial PostgreSQL database name."
  type        = string
  default     = "galacticview"
}

variable "db_username" {
  description = "Master username for the PostgreSQL database."
  type        = string
  default     = "galactic_admin"
}

variable "db_password" {
  description = "Master password for the PostgreSQL database. Provide via TF_VAR_db_password or terraform.tfvars."
  type        = string
  sensitive   = true

  validation {
    condition     = length(var.db_password) >= 8
    error_message = "db_password must be at least 8 characters long."
  }
}

variable "dynamodb_table_name" {
  description = "Name of the DynamoDB table for blog post metadata."
  type        = string
  default     = "GalacticBlogPosts"
}
